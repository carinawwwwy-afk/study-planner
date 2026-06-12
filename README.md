# 拾阶 · AI 学习路径规划师

基于 Next.js App Router、TypeScript 和 Tailwind CSS 的交互式 UI 原型。

## 本地启动

```bash
npm install
copy .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。

## Coze 配置

在 `.env.local` 中填写：

```env
COZE_API_TOKEN=your_personal_access_token
COZE_API_URL=https://h9p5yjzfxk.coze.site
```

前端通过 `POST /api/chat` 与 Coze 通信，Token 只保存在服务端。

请求示例：

```json
{
  "input": "帮我把今天的任务缩短到 15 分钟"
}
```

浏览器到 Next.js API 使用简洁的 `{ "input": "..." }`。服务端会将其转换为
Coze `AgentStreamRunner` 需要的原始查询 payload：

```json
{
  "type": "query",
  "content": {
    "query": {
      "prompt": [
        {
          "type": "text",
          "content": {
            "text": "帮我把今天的任务缩短到 15 分钟"
          }
        }
      ]
    }
  }
}
```

服务端随后解析 `/stream_run` 返回的 SSE 数据，并向前端返回：

```json
{
  "answer": "Coze 返回的有效回答"
}
```

## 主要结构

- `app/page.tsx`：产品入口
- `components/dashboard.tsx`：学习仪表盘与交互组件
- `app/api/chat/route.ts`：Coze 服务端代理接口
- `app/globals.css`：Tailwind 基础样式
