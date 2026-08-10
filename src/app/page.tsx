'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatsModal from '@/components/StatsModal';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 max-w-[480px] mx-auto">
        {/* Hero */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🐾</div>
          <h1 className="text-3xl font-black text-[#2D2D2D] tracking-tight mb-2">
            生活物种
          </h1>
          <p className="text-base text-[#666] leading-relaxed">
            动物卡通人格宇宙<br />
            24 道题，发现你的生活人格
          </p>
        </div>

        {/* 可爱的介绍词 */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-[#E8E0D8] w-full">
          <p className="text-sm text-[#555] leading-relaxed text-center">
            🐶 你是什么动物人格？是周末撒欢的狗子，还是宅家充电的猫猫？
            24 道灵魂拷问，揭晓你的生活物种 —— 还有 2 个隐藏副人格等你发现！
            <span className="block mt-1 text-xs text-[#999]">✨ 有点准，有点损，有点可爱 ✨</span>
          </p>
        </div>

        {/* Feature cards */}
        <div className="w-full space-y-3 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E0D8]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold text-sm text-[#2D2D2D]">24 道精选题</p>
                <p className="text-xs text-[#888]">从生活场景洞察你的真实人格</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E0D8]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦊</span>
              <div>
                <p className="font-semibold text-sm text-[#2D2D2D]">24 种生活物种</p>
                <p className="text-xs text-[#888]">找到你的主物种 + 2 个副物种</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E0D8]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <p className="font-semibold text-sm text-[#2D2D2D]">永久结果页</p>
                <p className="text-xs text-[#888]">分享你的生活物种给朋友</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/test"
          className="w-full bg-[#2D2D2D] text-white text-center py-4 rounded-2xl font-bold text-lg
                     active:scale-[0.98] transition-transform duration-150 shadow-md"
        >
          开始测试
        </Link>

        {/* Stats button */}
        <button
          onClick={() => setShowStats(true)}
          className="w-full mt-5 bg-white rounded-2xl p-4 shadow-sm border border-[#E8E0D8] 
                     active:scale-[0.98] transition-transform duration-150 hover:border-[#ccc]"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="font-semibold text-sm text-[#2D2D2D]">物种分布图鉴</p>
              <p className="text-xs text-[#888]">看看大家都在什么物种</p>
            </div>
          </div>
        </button>

        <p className="text-xs text-[#999] mt-4 text-center">
          大约需要 3-5 分钟 · 一屏一题
        </p>
      </div>

      <StatsModal open={showStats} onClose={() => setShowStats(false)} />
    </>
  );
}