import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRequest = {
  input?: unknown;
  message?: unknown;
};

type JsonRecord = Record<string, unknown>;

function normalizeText(text: string): string {
  // Some published Coze endpoints expose UTF-8 bytes as Latin-1 text.
  if (!/[ÃÂäåæçèé]/.test(text)) return text;

  const decoded = Buffer.from(text, "latin1").toString("utf8");
  return /[\u4e00-\u9fff]/.test(decoded) && !decoded.includes("�") ? decoded : text;
}

function getText(value: unknown): string {
  if (typeof value === "string") {
    const text = value.trim();
    if (
      (text.startsWith("{") && text.endsWith("}")) ||
      (text.startsWith("[") && text.endsWith("]"))
    ) {
      try {
        return getText(JSON.parse(text));
      } catch {
        return normalizeText(text);
      }
    }
    return normalizeText(text);
  }
  if (Array.isArray(value)) return value.map(getText).join("");
  if (!value || typeof value !== "object") return "";

  const record = value as JsonRecord;
  for (const key of ["answer", "output", "content", "text", "message", "delta", "response"]) {
    const text = getText(record[key]);
    if (text) return text;
  }

  return "";
}

function parseSse(raw: string): { answer: string; error: string } {
  const chunks: string[] = [];
  let finalAnswer = "";
  let error = "";

  // SSE events are separated by a blank line and may contain both
  // `event: message` and `data: {...}` lines.
  for (const block of raw.split(/\r?\n\r?\n/)) {
    let outerEvent = "";
    const dataLines: string[] = [];

    for (const line of block.split(/\r?\n/)) {
      if (line.startsWith("event:")) outerEvent = line.slice(6).trim();
      if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
    }

    const data = dataLines.join("\n").trim();
    if (!data || data === "[DONE]") continue;

    try {
      const payload = JSON.parse(data) as JsonRecord;
      const innerEvent = String(payload.event ?? payload.type ?? payload.name ?? "");
      const eventName = `${outerEvent} ${innerEvent}`.toLowerCase();
      const text = getText(payload.data ?? payload);
      const content = payload.content as JsonRecord | undefined;
      const messageEnd = content?.message_end as JsonRecord | undefined;
      const eventError = getText(content?.error);
      const endError =
        messageEnd?.code && messageEnd.code !== "0"
          ? getText(messageEnd.message)
          : "";

      if (eventError || endError) error = eventError || endError;
      if (!text) continue;
      if (eventName.includes("message_end") && !error) finalAnswer = text;
      else if (
        !eventName.includes("message_start") &&
        !eventName.includes("message_end") &&
        !eventName.includes("error") &&
        !eventName.includes("verbose")
      ) {
        chunks.push(text);
      }
    } catch {
      chunks.push(data);
    }
  }

  return {
    answer: (finalAnswer || chunks.join("")).trim(),
    error: error.trim(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest;
    // 浏览器到 Next.js 统一使用 input；服务端再转换成 Coze SDK 原始消息格式。
    const userText =
      typeof body.input === "string"
        ? body.input
        : typeof body.message === "string"
          ? body.message
          : "";

    if (!userText.trim()) {
      return NextResponse.json({ error: "input 必须是非空字符串。" }, { status: 400 });
    }

    const token = process.env.COZE_API_TOKEN;
    const apiUrl = process.env.COZE_API_URL;
    if (!token || !apiUrl) {
      return NextResponse.json({ error: "缺少 COZE_API_TOKEN 或 COZE_API_URL。" }, { status: 503 });
    }

    const endpoint = apiUrl.endsWith("/stream_run")
      ? apiUrl
      : `${apiUrl.replace(/\/$/, "")}/stream_run`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        type: "query",
        content: {
          query: {
            prompt: [
              {
                type: "text",
                content: {
                  text: userText.trim(),
                },
              },
            ],
          },
        },
      }),
      cache: "no-store",
    });

    const raw = await response.text();
    const result = parseSse(raw);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Coze 请求失败（${response.status}）`, detail: raw },
        { status: response.status },
      );
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    if (!result.answer) {
      return NextResponse.json(
        { error: "Coze 返回了 SSE 数据，但没有解析到有效回答。", detail: raw },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer: result.answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: `请求 Coze 时出错：${message}` }, { status: 502 });
  }
}
