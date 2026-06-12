"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Home,
  MessageCircle,
  MoreHorizontal,
  Route,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";

type Page = "week" | "path" | "insights" | "profile";
type Task = { title: string; meta: string; done: boolean; optional?: boolean };

const nav = [
  { id: "week" as Page, label: "本周学习", icon: Home },
  { id: "path" as Page, label: "学习路径", icon: Route },
  { id: "insights" as Page, label: "学习洞察", icon: BarChart3 },
];

const initialTasks: Task[] = [
  { title: "认识 Matplotlib 图表结构", meta: "知识学习 · 20 分钟", done: true },
  { title: "完成基础图表练习", meta: "动手实践 · 35 分钟", done: true },
  { title: "制作销售趋势折线图", meta: "项目实践 · 30 分钟", done: false },
  { title: "完成可视化检验小测", meta: "学习验证 · 10 分钟", done: false, optional: true },
  { title: "优化图表视觉表现", meta: "拓展练习 · 30 分钟", done: false, optional: true },
];

export function Dashboard() {
  const [page, setPage] = useState<Page>("week");
  const [tasks, setTasks] = useState(initialTasks);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [shortened, setShortened] = useState(false);

  const labels: Record<Page, string> = {
    week: "本周学习",
    path: "学习路径",
    insights: "学习洞察",
    profile: "个人设置",
  };

  return (
    <div className="min-h-screen lg:pl-60">
      <Sidebar page={page} setPage={setPage} />
      <Header label={labels[page]} openReview={() => setReviewOpen(true)} />

      <main className="mx-auto max-w-[1440px] p-4 pb-24 md:p-8">
        {page === "week" && (
          <WeekPage
            tasks={tasks}
            setTasks={setTasks}
            shortened={shortened}
            shorten={() => setShortened(true)}
            openFocus={() => setFocusOpen(true)}
            openReview={() => setReviewOpen(true)}
            openInsights={() => setPage("insights")}
          />
        )}
        {page === "path" && <PathPage />}
        {page === "insights" && <InsightsPage />}
        {page === "profile" && <ProfilePage />}
      </main>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 z-20 flex items-center gap-3 rounded-2xl bg-slate-900 px-3 py-3 text-left text-white shadow-2xl md:px-4"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-primary"><Sparkles size={16} /></span>
        <span className="hidden md:block"><b className="block text-xs">和 AI 教练聊聊</b><small className="text-[10px] text-slate-400">随时帮你调整计划</small></span>
      </button>

      {reviewOpen && <ReviewModal close={() => setReviewOpen(false)} />}
      {focusOpen && <FocusModal close={() => setFocusOpen(false)} />}
      {chatOpen && <ChatPanel close={() => setChatOpen(false)} />}
    </div>
  );
}

function Sidebar({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-[#11182a] p-5 text-white lg:flex">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-primary"><BarChart3 size={20} /></div>
        <div><strong className="block text-lg">拾阶</strong><small className="text-[10px] text-slate-400">AI 学习路径规划师</small></div>
      </div>
      <nav className="mt-9 space-y-2">
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setPage(id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${page === id ? "bg-slate-700/60 text-white" : "text-slate-400 hover:bg-slate-800"}`}>
            <Icon size={18} />{label}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="mb-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex justify-between text-[11px]"><span>本周目标</span><b className="text-indigo-300">65%</b></div>
          <div className="progress my-3 bg-slate-700"><i style={{ width: "65%" }} /></div>
          <small className="text-[10px] text-slate-400">还差 2 个核心任务</small>
        </div>
        <button onClick={() => setPage("profile")} className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-slate-800">
          <span className="grid size-9 place-items-center rounded-full bg-stone-300 text-xs text-stone-700">林</span>
          <span className="flex-1 text-left"><b className="block text-xs">小林</b><small className="text-[9px] text-slate-400">数据分析学习者</small></span>
          <MoreHorizontal size={16} className="text-slate-500" />
        </button>
      </div>
    </aside>
  );
}

function Header({ label, openReview }: { label: string; openReview: () => void }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl md:px-8">
      <div className="text-xs text-muted"><span>数据分析与可视化</span><span className="mx-2 text-slate-300">/</span><b className="text-ink">{label}</b></div>
      <div className="flex items-center gap-2">
        <button className="hidden size-9 place-items-center rounded-xl border border-slate-200 bg-white md:grid"><Search size={15} /></button>
        <button className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white"><Bell size={15} /></button>
        <button onClick={openReview} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold">每周复盘 <span className="text-muted">约 5 分钟</span></button>
      </div>
    </header>
  );
}

function PageTitle({ eyebrow, title, note, action }: { eyebrow: string; title: string; note?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div><span className="eyebrow">{eyebrow}</span><h1 className="mt-2 text-2xl font-bold tracking-tight">{title} {note && <span className="ml-2 text-xs font-normal text-muted">{note}</span>}</h1></div>
      {action}
    </div>
  );
}

function WeekPage({ tasks, setTasks, shortened, shorten, openFocus, openReview, openInsights }: {
  tasks: Task[]; setTasks: (tasks: Task[]) => void; shortened: boolean; shorten: () => void; openFocus: () => void; openReview: () => void; openInsights: () => void;
}) {
  const toggle = (index: number) => setTasks(tasks.map((task, i) => i === index ? { ...task, done: !task.done } : task));
  return (
    <>
      <PageTitle eyebrow="6 月 15 日，星期一" title="早上好，小林" note="今天继续稳稳向前。" action={<button onClick={openReview} className="text-xs font-semibold text-primary">调整本周计划 ↗</button>} />
      <section className="grid gap-5 xl:grid-cols-[1.65fr_.9fr]">
        <article className="relative min-h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-[#555bd7] to-[#7d78ee] p-6 text-white shadow-card md:p-8">
          <div className="flex justify-between"><span className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold">下一步行动</span><span className="flex items-center gap-1 rounded-full bg-indigo-950/20 px-3 py-1.5 text-[10px]"><Clock3 size={11} />预计 {shortened ? 15 : 30} 分钟</span></div>
          <h2 className="mt-8 text-2xl font-bold">{shortened ? "快速完成折线图基础版" : "制作销售趋势折线图"}</h2>
          <p className="mt-2 max-w-xl text-xs leading-6 text-indigo-100">使用 Matplotlib 呈现月度销售变化，并尝试优化图表的标题、标签和配色。</p>
          <div className="relative z-[1] mt-7 flex flex-wrap gap-10 text-[11px]"><div><span className="block text-[9px] text-indigo-200">完成后你将掌握</span><b>折线图绘制与视觉优化</b></div><div><span className="block text-[9px] text-indigo-200">任务难度</span><b>适中 · 实践任务</b></div></div>
          <div className="relative z-[1] mt-6 flex flex-wrap gap-2"><button onClick={openFocus} className="primary-button">开始学习 <ChevronRight className="ml-5 inline" size={13} /></button><button onClick={shorten} className="soft-button">今天有点忙，缩短任务</button></div>
          <div className="absolute -bottom-20 -right-10 size-72 rounded-full border-[45px] border-white/5" />
        </article>
        <article className="card p-6">
          <div className="flex justify-between"><div><span className="eyebrow">本周学习卡片</span><h3 className="mt-1 text-sm font-bold">掌握数据可视化基础</h3></div><MoreHorizontal size={16} /></div>
          <div className="my-8 flex items-center justify-center gap-8">
            <div className="grid size-28 place-items-center rounded-full bg-[conic-gradient(#6466e9_65%,#edeef4_0)]"><div className="grid size-20 place-items-center rounded-full bg-white text-center"><div><b className="block text-xl">65%</b><span className="text-[9px] text-muted">本周进度</span></div></div></div>
            <div className="grid grid-cols-2 gap-6"><div><b className="text-xl">3<span className="text-[10px] text-muted"> / 5</span></b><span className="block text-[9px] text-muted">任务完成</span></div><div><b className="text-xl">2<span className="text-[10px] text-muted">h 10m</span></b><span className="block text-[9px] text-muted">预计剩余</span></div></div>
          </div>
          <div className="border-t border-slate-200 pt-4"><div className="flex justify-between text-[10px]"><span>本周状态</span><b><i className="mr-1 inline-block size-1.5 rounded-full bg-emerald-500" />节奏适中</b></div><div className="mt-3 grid grid-cols-7 gap-1">{[1,1,1,1,1,0,0].map((v,i)=><i key={i} className={`h-1.5 rounded-full ${v ? "bg-emerald-400" : "bg-slate-200"}`} />)}</div></div>
        </article>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_.9fr]">
        <article className="card p-6">
          <div className="mb-4 flex justify-between"><div><h3 className="text-sm font-bold">本周任务</h3><span className="text-[10px] text-muted">按优先级安排，完成核心任务就很棒</span></div><button className="text-[10px] font-semibold text-primary">查看全部</button></div>
          {[false, true].map(optional => <div key={String(optional)} className="border-t border-slate-200 py-2"><div className="flex items-center gap-2 py-2 text-[10px] font-bold"><i className={`size-2 rounded-full ${optional ? "bg-slate-400" : "bg-primary"}`} />{optional ? "建议完成" : "必须完成"}</div>{tasks.map((task,index) => task.optional === optional && <button key={task.title} onClick={() => toggle(index)} className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left hover:bg-slate-50"><span className={`grid size-5 place-items-center rounded-full border ${task.done ? "border-indigo-300 bg-indigo-50 text-primary" : "border-slate-300"}`}>{task.done && <Check size={11}/>}</span><span className="flex-1"><b className={`block text-[11px] ${task.done ? "text-slate-400 line-through" : ""}`}>{task.title}</b><small className="text-[9px] text-muted">{task.meta}</small></span><span className={`rounded-full px-2 py-1 text-[9px] ${task.done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-muted"}`}>{task.done ? "已完成" : "未开始"}</span></button>)}</div>)}
        </article>
        <div className="space-y-5">
          <article className="card bg-gradient-to-br from-indigo-50 to-white p-6"><span className="mb-4 grid size-9 place-items-center rounded-xl bg-primary text-white"><Sparkles size={15}/></span><span className="eyebrow">AI 教练观察</span><h3 className="mt-2 text-sm font-bold">你的实践状态不错</h3><p className="subtle mt-2 text-[10px]">最近项目练习的完成率比理论阅读高 28%。本周我已经为你增加了更多短时实践任务。</p><button onClick={openInsights} className="mt-3 text-[10px] font-bold text-primary">看看调整依据 →</button></article>
          <article className="card p-6"><div className="flex justify-between"><div><h3 className="text-sm font-bold">学习节奏</h3><span className="text-[9px] text-muted">过去 7 天</span></div><b className="text-sm">3h 20m</b></div><div className="mt-6 flex h-24 items-end gap-3">{[26,62,40,85,54,95,68].map((height,i)=><div className="flex h-full flex-1 items-end" key={i}><i className={`w-full rounded-t ${i===5?"bg-primary":"bg-indigo-100"}`} style={{height:`${height}%`}} /></div>)}</div></article>
        </div>
      </section>
    </>
  );
}

function PathPage() {
  const stages = [
    ["01", "Python 数据基础", "变量、数据结构、函数与基础数据处理", "已完成"],
    ["02", "Pandas 数据处理", "读取、清洗、筛选、分组与合并数据", "已完成"],
    ["03", "数据可视化", "用 Matplotlib 和 Seaborn 讲清楚数据故事", "65%"],
    ["04", "综合分析项目", "完成一份可展示的销售数据分析报告", "未开始"],
  ];
  return <><PageTitle eyebrow="8 周学习路线" title="数据分析与可视化" note="当前第 3 周" /><div className="grid gap-5 xl:grid-cols-[1.6fr_.7fr]"><article className="card p-7"><div className="mb-5 flex justify-between"><div><h3 className="text-sm font-bold">你的学习路径</h3><span className="text-[10px] text-muted">从数据基础，到完成第一份分析报告</span></div><span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-primary">整体进度 38%</span></div><div className="space-y-2">{stages.map((stage,i)=><div key={stage[0]} className={`flex items-center gap-4 rounded-2xl p-4 ${i===2?"border border-indigo-100 bg-indigo-50/60":""}`}><span className={`grid size-9 place-items-center rounded-full text-xs font-bold ${i<2?"bg-emerald-50 text-emerald-600":i===2?"bg-primary text-white":"bg-slate-100 text-slate-400"}`}>{i<2?<Check size={14}/>:stage[0]}</span><div className="flex-1"><span className="text-[8px] uppercase tracking-widest text-muted">{i===2?"当前阶段 · 第 3 周":`阶段 ${stage[0]}`}</span><h3 className="text-sm font-bold">{stage[1]}</h3><p className="text-[10px] text-muted">{stage[2]}</p>{i===2&&<div className="progress mt-3 max-w-xs"><i style={{width:"65%"}}/></div>}</div><b className="text-[10px] text-primary">{stage[3]}</b></div>)}</div></article><article className="card self-start p-7 text-center"><span className="eyebrow">阶段成果</span><div className="mx-auto my-6 grid size-28 place-items-center rounded-full bg-indigo-50"><BarChart3 size={36} className="text-primary"/></div><h2 className="text-lg font-bold">销售分析报告</h2><p className="subtle mt-2 text-[10px]">再完成 7 个核心任务，你将能够独立完成第一份可视化数据分析报告。</p><button className="primary-button mt-5 bg-primary">查看成果样例</button></article></div></>;
}

function InsightsPage() {
  return <><PageTitle eyebrow="学习洞察" title="更了解自己的学习方式" /><div className="grid gap-5 md:grid-cols-3">{[["本月投入","12.8","小时"],["任务完成率","82","%"],["小测正确率","78","%"]].map(item=><article key={item[0]} className="card p-6"><span className="text-[10px] text-muted">{item[0]}</span><b className="my-2 block text-3xl">{item[1]}<small className="ml-1 text-xs text-muted">{item[2]}</small></b><span className="text-[9px] text-emerald-600">表现持续提升</span></article>)}<article className="card p-6 md:col-span-2"><h3 className="text-sm font-bold">最适合你的学习安排</h3><span className="text-[9px] text-muted">根据过去 4 周的行为生成</span><div className="mt-5 space-y-2">{[["工作日适合短时任务","20 分钟以内的任务完成率高达 91%"],["实践比阅读更有效","项目练习后的知识点掌握度提升 24%"],["周六是你的高效学习日","平均专注时长是工作日的 2.3 倍"]].map((x,i)=><div key={x[0]} className="flex gap-4 rounded-xl bg-slate-50 p-4"><b className="text-xl text-slate-300">0{i+1}</b><div><strong className="block text-[11px]">{x[0]}</strong><span className="text-[9px] text-muted">{x[1]}</span></div></div>)}</div></article><article className="card bg-gradient-to-br from-indigo-50 to-white p-6"><Sparkles className="text-primary" size={22}/><span className="eyebrow mt-8 block">本周建议</span><h3 className="mt-2 text-sm font-bold">重点巩固 GroupBy</h3><p className="subtle mt-2 text-[10px]">这个知识点连续两次小测未通过。我已经为你准备了一个 15 分钟拆解练习。</p><button className="mt-4 text-[10px] font-bold text-primary">加入本周计划 →</button></article></div></>;
}

function ProfilePage() {
  return <><PageTitle eyebrow="个人设置" title="你好，小林" /><div className="grid gap-5 md:grid-cols-2"><SettingsCard title="学习偏好" rows={[["每周可用时间","约 5 小时"],["默认学习强度","节奏适中"],["主动提醒","已开启"]]} /><SettingsCard title="数据同步" rows={[["飞书多维表格","已连接"],["腾讯文档","连接"],["历史学习周报","查看"]]} /></div></>;
}

function SettingsCard({ title, rows }: { title: string; rows: string[][] }) {
  return <article className="card p-6"><h3 className="mb-4 text-sm font-bold">{title}</h3>{rows.map(row=><button key={row[0]} className="flex w-full items-center justify-between border-t border-slate-200 py-5 text-left"><span><b className="block text-[11px]">{row[0]}</b><small className="text-[9px] text-muted">点击查看或调整设置</small></span><span className="text-[10px] font-semibold text-primary">{row[1]} ›</span></button>)}</article>;
}

function ModalShell({ children, close, wide = false }: { children: React.ReactNode; close: () => void; wide?: boolean }) {
  return <div onMouseDown={e => e.target===e.currentTarget&&close()} className="fixed inset-0 z-40 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"><div className={`relative max-h-[92vh] overflow-auto rounded-3xl bg-white p-7 shadow-2xl ${wide?"w-full max-w-2xl":"w-full max-w-lg"}`}><button onClick={close} className="absolute right-5 top-5 text-slate-400"><X size={18}/></button>{children}</div></div>;
}

function ReviewModal({ close }: { close: () => void }) {
  const [step,setStep]=useState(1);
  return <ModalShell close={close}><div className="flex justify-between text-[10px]"><span>本周复盘</span><b className="text-primary">{step} / 4</b></div><div className="progress mt-2"><i style={{width:`${step*25}%`}}/></div><span className="mx-auto mt-8 grid size-12 place-items-center rounded-2xl bg-primary text-white"><Sparkles size={18}/></span><div className="mt-4 text-center"><span className="eyebrow">AI 教练 · 预计还需 {5-step} 分钟</span><h2 className="mt-2 text-xl font-bold">{step===1?"上周学习体验怎么样？":"这周大约能安排多少学习时间？"}</h2><p className="subtle mx-auto mt-2 max-w-sm text-[11px]">{step===1?"你完成了 5 / 7 个任务，在数据筛选上表现很好。":"我会根据你的现实时间生成两套计划，不必为了学习打乱生活。"}</p></div><div className="mt-6 space-y-2">{(step===1?["很顺利，可以适当加量","和平时差不多","有些吃力，减少一点任务","非常忙，只保留核心任务"]:["约 2 小时","约 3–5 小时","5 小时以上"]).map(x=><button key={x} onClick={()=>step<4?setStep(step+1):close()} className="flex w-full justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-[11px] hover:border-primary hover:text-primary">{x}<ChevronRight size={14}/></button>)}</div></ModalShell>;
}

function FocusModal({ close }: { close: () => void }) {
  return <ModalShell close={close} wide><div className="flex justify-between pr-8 text-[9px] text-muted"><span>项目实践 · 步骤 1 / 3</span><span>预计 30 分钟</span></div><div className="progress mt-2"><i style={{width:"33%"}}/></div><h1 className="mt-7 text-2xl font-bold">制作销售趋势折线图</h1><p className="subtle mt-2 text-[11px]">读取月度销售数据，绘制一张能够清晰呈现销售变化趋势的折线图。</p><div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"><span className="eyebrow">本步骤任务</span><h3 className="mt-2 text-sm font-bold">读取数据并确认时间与销售额字段</h3><pre className="mt-4 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-200"><code>{`import pandas as pd\n\nsales = pd.read_csv("monthly_sales.csv")\nsales.head()`}</code></pre></div><div className="flex justify-between gap-3"><button className="rounded-xl bg-slate-100 px-5 py-3 text-xs font-semibold">我遇到了问题</button><button onClick={close} className="primary-button bg-primary">完成这一步 →</button></div></ModalShell>;
}

function ChatPanel({ close }: { close: () => void }) {
  const [message,setMessage]=useState(""); const [reply,setReply]=useState("你好，小林。想调整本周计划，还是聊聊遇到的学习卡点？"); const [loading,setLoading]=useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const input = message.trim();
    if (!input || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };
      setReply(response.ok && data.answer ? data.answer : data.error ?? "暂时无法连接 AI 教练。");
    } catch {
      setReply("暂时无法连接 AI 教练。");
    } finally {
      setLoading(false);
      setMessage("");
    }
  }
  return <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"><div className="flex items-center gap-3 border-b border-slate-200 p-5"><span className="grid size-10 place-items-center rounded-xl bg-primary text-white"><Sparkles size={17}/></span><div className="flex-1"><b className="block text-sm">AI 学习教练</b><span className="text-[9px] text-emerald-600">随时在线</span></div><button onClick={close}><X size={18}/></button></div><div className="flex-1 p-5"><div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 p-4 text-xs leading-6">{reply}</div></div><form onSubmit={submit} className="border-t border-slate-200 p-4"><div className="flex gap-2 rounded-2xl border border-slate-200 p-2"><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="告诉我你的学习情况..." className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none"/><button disabled={loading} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{loading?"发送中":"发送"}</button></div></form></div>;
}
