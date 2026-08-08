import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '生活物种 | 测测你是什么生活物种',
    template: '%s | 生活物种',
  },
  description:
    '24 道题，发现你的生活人格。生活物种 — 动物卡通人格宇宙，有点损但不低幼。',
  openGraph: {
    title: '生活物种 | 测测你是什么生活物种',
    description: '24 道题，发现你的生活人格。动物卡通人格宇宙，有点损但不低幼。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-[#FFF8F0] text-[#333]">
        <Inspector />
        {children}
      </body>
    </html>
  );
}