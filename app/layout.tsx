import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "拾阶 · AI 学习路径规划师",
  description: "每周五分钟，生成真正能完成的学习计划。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
