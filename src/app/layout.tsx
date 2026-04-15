import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "這味泰泰 - 社群內容管理",
  description: "這味泰泰 社群內容管理",
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
