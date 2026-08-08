'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
    // We don't have runId from the result API, but we'd need it for feedback
    // For now, just show the feedback UI
  };

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

  return (
    <div className="min-h-screen bg-[#FFF8F0] max-w-[480px] mx-auto px-5 py-8">
      {/* 1. Main species image */}
      <div className="text-center mb-6">
        <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-3xl shadow-sm border border-[#E8E0D8] 
                        flex items-center justify-center overflow-hidden">
          <img
            src={main.image_url}
            alt={main.name}
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
                  <img src={s.image_url} alt={s.name} className="w-full h-full object-contain" />
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
      {main.summon_tags && main.summon_tags.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-[#888] mb-2">📢 如何召唤我</p>
          <div className="flex flex-wrap gap-1.5">
            {main.summon_tags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 bg-[#FFD1DC] text-[#2D2D2D] rounded-full text-[11px] font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7. Food tags */}
      {main.food_tags && main.food_tags.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-[#888] mb-2">🍽️ 投喂指南</p>
          <div className="flex flex-wrap gap-1.5">
            {main.food_tags.map((tag, i) => (
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
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-[#E8E0D8]">
        <p className="text-xs font-bold text-[#888] mb-1">📖 物种档案</p>
        <p className="text-sm text-[#333] leading-relaxed">{main.description}</p>
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

      {/* Share card CTA */}
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
    </div>
  );
}