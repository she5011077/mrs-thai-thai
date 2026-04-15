import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Threads 內容排程儀表板",
  description: "Threads 內容排程管理系統",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
