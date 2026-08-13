'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import StatsModal from '@/components/StatsModal';

interface Species {
  species_key: string;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  buff: string;
  summon_tags: string[];
  food_tags: string[];
  how_to_get_along: string;
  typical_symptoms: string;
  roast: string;
  family: string;
}

interface ResultData {
  shareCode: string;
  mainSpecies: Species;
  secondarySpecies: Species[];
  dimensionScores: { dimension_key: string; score: number }[];
  testVersion: string;
  scorerVersion: string;
  completedAt: string;
}

export default function ResultPage() {
  const params = useParams();
  const shareCode = params.shareCode as string;
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Share image state
  const [shareLoading, setShareLoading] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [shareError, setShareError] = useState('');
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!shareCode) return;
    setLoading(true);
    fetch(`/api/results/${shareCode}`)
      .then(res => {
        if (!res.ok) throw new Error('结果未找到');
        return res.json();
      })
      .then(data => setResult(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [shareCode]);

  const handleFeedback = async (rating: number) => {
    setFeedback(rating);
    setFeedbackSent(true);
  };

  const handleGenerateShare = useCallback(async () => {
    if (!captureRef.current) return;
    setShareLoading(true);
    setShareError('');
    try {
      // Wait a tick for layout
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await toPng(captureRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });
      setShareImage(dataUrl);
    } catch (e: any) {
      setShareError('生成失败，请重试');
      console.error('Share image error:', e);
    } finally {
      setShareLoading(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!shareImage) return;
    try {
      const blob = await (await fetch(shareImage)).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `生活物种-${result?.mainSpecies?.name || 'result'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(shareImage, '_blank');
    }
  }, [shareImage, result]);

  const handleShare = useCallback(async () => {
    if (!shareImage) return;
    try {
      const blob = await (await fetch(shareImage)).blob();
      const file = new File([blob], `生活物种-${result?.mainSpecies?.name || 'result'}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: '我的生活物种',
          text: `我是「${result?.mainSpecies?.name}」！来测测你是什么生活物种？`,
          files: [file],
        });
      } else {
        // Fallback to download
        handleDownload();
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        handleDownload();
      }
    }
  }, [shareImage, result, handleDownload]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2D2D2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#888]">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg mb-2">😕</p>
          <p className="text-sm text-[#888] mb-4">{error || '结果未找到'}</p>
          <Link href="/test" className="text-sm text-[#2D2D2D] font-medium underline">
            去测测我的生活物种
          </Link>
        </div>
      </div>
    );
  }

  const main = result.mainSpecies;
  const secondaries = result.secondarySpecies;

  const safeTags = (v: any): string[] => (Array.isArray(v) ? v : []);
  const summonTags = safeTags(main?.summon_tags);
  const foodTags = safeTags(main?.food_tags);

  return (
    <div className="min-h-screen bg-[#FFF8F0] max-w-[480px] mx-auto px-5 py-8">
      {/* === Capture Area: everything inside is what gets screenshotted === */}
      <div ref={captureRef}>
        {/* 1. Main species image */}
        <div className="text-center mb-6">
          <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-3xl shadow-sm border border-[#E8E0D8]
                          flex items-center justify-center overflow-hidden">
            <img
              src={main.image_url}
              alt={main.name}
              crossOrigin="anonymous"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 2. Main species name */}
        <h1 className="text-2xl font-black text-[#2D2D2D] text-center mb-2">
          {main.name}
        </h1>

        {/* 3. Tagline / Roast */}
        <p className="text-base text-[#666] text-center mb-6 leading-relaxed">
          {main.roast || main.tagline}
        </p>

        {/* 4. Two secondary species */}
        {secondaries.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-[#888] font-medium mb-3 text-center">副物种</p>
            <div className="flex gap-3 justify-center">
              {secondaries.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-[#E8E0D8] text-center w-32">
                  <div className="w-14 h-14 mx-auto mb-2">
                    <img src={s.image_url} alt={s.name} crossOrigin="anonymous" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs font-bold text-[#2D2D2D]">{s.name}</p>
                  <p className="text-[10px] text-[#888] mt-1">{s.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Buff */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-[#E8E0D8]">
          <p className="text-xs font-bold text-[#888] mb-1">🎯 生活 Buff</p>
          <p className="text-sm text-[#333] leading-relaxed">{main.buff}</p>
        </div>

        {/* 6. Summon tags */}
        {summonTags.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold text-[#888] mb-2">📢 如何召唤我</p>
            <div className="flex flex-wrap gap-1.5">
              {summonTags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-[#FFD1DC] text-[#2D2D2D] rounded-full text-[11px] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 7. Food tags */}
        {foodTags.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold text-[#888] mb-2">🍽️ 投喂指南</p>
            <div className="flex flex-wrap gap-1.5">
              {foodTags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-[#C5E8C5] text-[#2D2D2D] rounded-full text-[11px] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 8. How to get along */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-[#E8E0D8]">
          <p className="text-xs font-bold text-[#888] mb-1">🤝 如何与本物种相处</p>
          <p className="text-sm text-[#333] leading-relaxed">{main.how_to_get_along}</p>
        </div>

        {/* 9. Typical symptoms */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-[#E8E0D8]">
          <p className="text-xs font-bold text-[#888] mb-1">🔍 典型症状</p>
          <p className="text-sm text-[#333] leading-relaxed">{main.typical_symptoms}</p>
        </div>

        {/* 10. Description */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-[#E8E0D8]">
          <p className="text-xs font-bold text-[#888] mb-1">📖 物种档案</p>
          <p className="text-sm text-[#333] leading-relaxed">{main.description}</p>
        </div>

        {/* Branding footer for share image */}
        <div className="text-center pb-2">
          <p className="text-[10px] text-[#bbb]">🐾 生活物种 · 发现你的动物人格</p>
        </div>
      </div>
      {/* === End Capture Area === */}

      {/* Share image CTA */}
      <div className="mt-4 mb-6">
        <button
          onClick={handleGenerateShare}
          disabled={shareLoading}
          className="w-full bg-[#2D2D2D] text-white rounded-2xl p-4 shadow-md
                     active:scale-[0.98] transition-transform duration-150
                     disabled:opacity-60 disabled:scale-100"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl">📸</span>
            <div className="text-left">
              <p className="font-bold text-sm">
                {shareLoading ? '正在生成分享图...' : shareImage ? '已生成分享图' : '一键生成分享长图'}
              </p>
              <p className="text-xs text-white/70">
                {shareImage ? '点击查看 / 保存 / 分享' : '保存到相册或分享给朋友'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Feedback */}
      <div className="mb-6">
        <p className="text-xs text-[#888] font-medium mb-3 text-center">你觉得准吗？</p>
        <div className="flex gap-2 justify-center">
          {['完全不像', '有一点', '挺像', '太准了'].map((label, i) => {
            const rating = i + 1;
            return (
              <button
                key={i}
                onClick={() => handleFeedback(rating)}
                disabled={feedbackSent}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150
                  ${feedback === rating
                    ? 'bg-[#2D2D2D] text-white'
                    : feedbackSent
                      ? 'bg-[#E8E0D8] text-[#999]'
                      : 'bg-white border border-[#E8E0D8] text-[#666] hover:border-[#ccc]'
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Share link CTA */}
      <div className="text-center mb-8">
        <p className="text-xs text-[#888] mb-3">
          分享给朋友，看看他们是什么物种
        </p>
        <button
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('结果链接已复制！');
          }}
          className="bg-[#2D2D2D] text-white px-6 py-3 rounded-2xl font-bold text-sm
                     active:scale-[0.98] transition-transform duration-150 shadow-md"
        >
          复制结果链接
        </button>
      </div>

      {/* CTA to test */}
      <div className="text-center pb-8">
        <Link
          href="/test"
          className="inline-block text-sm text-[#2D2D2D] font-medium underline"
        >
          测测我是什么生活物种
        </Link>
      </div>

      {/* Stats */}
      <div className="text-center pb-12">
        <button
          onClick={() => setShowStats(true)}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#E8E0D8]
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
      </div>

      <StatsModal open={showStats} onClose={() => setShowStats(false)} />

      {/* Share Image Preview Modal */}
      {shareImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm"
          onClick={() => setShareImage(null)}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setShareImage(null)}
              className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>

          {/* Image preview */}
          <div className="flex-1 flex items-center justify-center px-4 overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img
              src={shareImage}
              alt="分享长图"
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 p-4 max-w-[480px] mx-auto w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleDownload}
              className="flex-1 py-3.5 rounded-2xl bg-white text-[#2D2D2D] font-bold text-sm
                         active:scale-[0.98] transition-transform duration-150"
            >
              保存到相册
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3.5 rounded-2xl bg-[#07C160] text-white font-bold text-sm
                         active:scale-[0.98] transition-transform duration-150"
            >
              分享给朋友
            </button>
          </div>
        </div>
      )}

      {/* Share error toast */}
      {shareError && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#2D2D2D] text-white text-xs px-4 py-2 rounded-full shadow-lg">
          {shareError}
        </div>
      )}
    </div>
  );
}