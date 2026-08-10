'use client';

import { useState, useEffect } from 'react';

interface SpeciesStat {
  speciesKey: string;
  name: string;
  imageUrl: string;
  family: string;
  displayOrder: number;
  count: number;
  percentage: number;
}

interface StatsData {
  total: number;
  species: SpeciesStat[];
}

const familyColor = (family: string) => {
  const map: Record<string, string> = {
    social: '#FFD1DC',
    food: '#C5E8C5',
    lifestyle: '#B5D8EB',
  };
  return map[family] || '#E8E0D8';
};

const familyLabel = (family: string) => {
  const map: Record<string, string> = {
    social: '社交系',
    food: '美食系',
    lifestyle: '生活系',
  };
  return map[family] || family;
};

export default function StatsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (stats) return;
    setLoading(true);
    setError('');
    fetch('/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error('加载失败');
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open, stats]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FFF8F0] rounded-3xl w-full max-w-[420px] max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E8E0D8] p-6 animate-[fadeInUp_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-[#2D2D2D]">物种分布图鉴</h2>
            {stats && (
              <p className="text-xs text-[#888] mt-0.5">
                共 {stats.total} 位小伙伴完成了测试
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E8E0D8] flex items-center justify-center
                       text-[#888] hover:text-[#2D2D2D] transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#2D2D2D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#888]">加载中...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <p className="text-sm text-[#999]">{error}</p>
          </div>
        )}

        {/* Species grid */}
        {stats && stats.species.length > 0 && (
          <div className="space-y-3">
            {stats.species.map((s) => (
              <div
                key={s.speciesKey}
                className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-[#E8E0D8]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFF8F0] flex-shrink-0 overflow-hidden border border-[#E8E0D8]">
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#2D2D2D] truncate">{s.name}</p>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: familyColor(s.family), color: '#2D2D2D' }}
                    >
                      {familyLabel(s.family)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#F0ECE6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${s.percentage}%`,
                          backgroundColor: familyColor(s.family),
                        }}
                      />
                    </div>
                    <span className="text-xs text-[#888] font-medium flex-shrink-0">
                      {s.percentage}% · {s.count}人
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {stats && stats.species.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[#999]">还没有人完成测试，快来当第一个吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}