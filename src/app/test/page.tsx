'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  { q: 1, text: '终于到周末了，你通常怎么过？', options: ['约朋友出去玩', '宅家打游戏/追剧', '睡到自然醒，啥也不干', '出去探店/逛展打卡'] },
  { q: 2, text: '朋友突然约你今晚出去，你的第一反应是？', options: ['好呀好呀！去哪？', '让我想想…', '不了，我已经安排好了', '随便，都可以'] },
  { q: 3, text: '在聚会上，你通常？', options: ['全场最活跃的那个', '和熟悉的人聊', '找个角落安静待着', '观察大家，偶尔插话'] },
  { q: 4, text: '说到吃饭，你更在意？', options: ['好不好吃', '和谁一起吃', '有没有仪式感', '快不快乐'] },
  { q: 5, text: '你的社交媒体状态通常是？', options: ['天天发，分享生活', '偶尔发一下', '只看不发', '有多个小号'] },
  { q: 6, text: '旅行时你更喜欢？', options: ['详细攻略安排到小时', '定个大方向，随性走', '跟着朋友走', '躺酒店就是度假'] },
  { q: 7, text: '朋友向你倾诉烦恼，你通常会？', options: ['给建议和分析', '认真倾听', '讲个笑话缓和气氛', '分享自己的类似经历'] },
  { q: 8, text: '你觉得自己更偏向？', options: ['理性的', '感性的', '随性的', '佛系的'] },
  { q: 9, text: '一个人在家时，你通常会？', options: ['必须找点事做', '享受安静时光', '有点焦虑想找人聊', '睡觉！'] },
  { q: 10, text: '以下哪些场景让你感到舒适？（选 1-3 项）', options: ['热闹的聚餐', '安静的咖啡馆', '大自然的徒步', '家里的沙发', '深夜的便利店', '热闹的市集', '安静的图书馆', 'KTV 包厢'], multi: true, maxSelect: 3 },
  { q: 11, text: '你早上醒来的状态是？', options: ['元气满满', '再睡五分钟', '被闹钟吵醒的怨气', '已经醒了但不起'] },
  { q: 12, text: '你更愿意在什么时间工作/学习？', options: ['清晨', '上午', '下午', '深夜'] },
  { q: 13, text: '周末的天气超好，你会？', options: ['必须出门！', '看心情', '阳台算户外吗', '窗帘拉上继续宅'] },
  { q: 14, text: '你对待计划的态度是？', options: ['事事有计划', '有大计划就行', '计划赶不上变化', '从不计划'] },
  { q: 15, text: '以下哪些是你的真实写照？（选 1-5 项）', options: ['笑点低', '容易共情', '喜欢尝试新事物', '念旧', '容易焦虑', '随遇而安', '有点拖延', '完美主义'], multi: true, maxSelect: 5 },
  { q: 16, text: '遇到新鲜事物时，你首先？', options: ['想试试！', '先观察一下', '看别人试了再说', '不感兴趣'] },
  { q: 17, text: '你更喜欢哪种社交方式？', options: ['线下面对面', '线上聊天', '都可以', '能免则免'] },
  { q: 18, text: '你对"一个人"的感觉是？', options: ['很享受', '偶尔需要', '有点害怕', '看情况'] },
  { q: 19, text: '你的手机相册里大多是？', options: ['美食', '风景', '自拍', '截图和表情包'] },
  { q: 20, text: '你更认同哪种生活态度？', options: ['及时行乐', '未雨绸缪', '随遇而安', '活出自我'] },
  { q: 21, text: '朋友怎么形容你？', options: ['开心果', '靠谱的人', '神秘的人', '温暖的人'] },
  { q: 22, text: '你理想的周末是？', options: ['精彩充实的', '放松躺平的', '和朋友一起的', '完全属于自己的'] },
  { q: 23, text: '你对"家"的感觉是？', options: ['最温暖的地方', '就是个睡觉的地方', '想逃离的地方', '需要精心打理的空间'] },
  { q: 24, text: '最后，你觉得自己是个怎样的人？', options: ['复杂的人', '简单的人', '有趣的人', '正在探索的人'] },
];

export default function TestPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('life_species_test');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setCurrentQ(parsed.currentQ || 0);
      } catch {}
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('life_species_test', JSON.stringify({ answers, currentQ }));
    }
  }, [answers, currentQ, mounted]);

  // Scroll to top when question changes
  useEffect(() => {
    questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentQ]);

  const handleSelect = useCallback((optionIndex: number) => {
    const q = QUESTIONS[currentQ];
    setError('');

    if (q.multi) {
      setAnswers(prev => {
        const current = prev[q.q] || [];
        if (current.includes(optionIndex)) {
          return { ...prev, [q.q]: current.filter(i => i !== optionIndex) };
        }
        if (current.length >= (q.maxSelect || 5)) {
          return prev;
        }
        return { ...prev, [q.q]: [...current, optionIndex] };
      });
    } else {
      setAnswers(prev => ({ ...prev, [q.q]: [optionIndex] }));
      // Auto advance for single choice
      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ(prev => prev + 1);
        }
      }, 300);
    }
  }, [currentQ]);

  const handleNext = useCallback(() => {
    const q = QUESTIONS[currentQ];
    const ans = answers[q.q];
    if (!ans || ans.length === 0) {
      setError('请选择一个选项');
      return;
    }
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    }
  }, [currentQ, answers]);

  const handlePrev = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
    }
  }, [currentQ]);

  const handleJump = useCallback((qIndex: number) => {
    setCurrentQ(qIndex);
    setError('');
  }, []);

  const handleSubmit = useCallback(async () => {
    const missed = QUESTIONS.filter(q => !answers[q.q] || answers[q.q].length === 0);
    if (missed.length > 0) {
      const missedNums = missed.map(q => q.q);
      setError(`第 ${missedNums.join('、')} 题未完成，请点击上方红色标记补填`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Start a new run
      const startRes = await fetch('/api/runs/start', { method: 'POST' });
      const startData = await startRes.json();

      if (!startRes.ok) {
        throw new Error(startData.error || 'Failed to start test');
      }

      // Format answers
      const formattedAnswers = QUESTIONS.map(q => ({
        q: q.q,
        options: answers[q.q],
      }));

      // Complete the run
      const completeRes = await fetch(`/api/runs/${startData.runId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runToken: startData.runToken,
          answers: formattedAnswers,
        }),
      });

      const completeData = await completeRes.json();

      if (!completeRes.ok) {
        throw new Error(completeData.error || 'Failed to complete test');
      }

      // Clear saved progress
      localStorage.removeItem('life_species_test');

      // Navigate to result
      router.push(`/r/${completeData.shareCode}`);
    } catch (e: any) {
      setError(e.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [answers, router]);

  if (!mounted) return null;

  const q = QUESTIONS[currentQ];
  const selected = answers[q.q] || [];
  const missedQuestions = QUESTIONS.filter(qq => !answers[qq.q] || answers[qq.q].length === 0);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col max-w-[480px] mx-auto px-5 py-6">
      {/* Dot progress indicator */}
      <div className="mb-6" ref={questionRef}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-[#888] font-medium">
            {currentQ + 1} / {QUESTIONS.length}
          </span>
          {missedQuestions.length > 0 && (
            <span className="text-xs text-red-500 font-medium">
              漏了 {missedQuestions.length} 题
            </span>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {QUESTIONS.map((qq, idx) => {
            const isAnswered = answers[qq.q] && answers[qq.q].length > 0;
            const isCurrent = idx === currentQ;
            const isMissed = !isAnswered;

            return (
              <button
                key={qq.q}
                onClick={() => handleJump(idx)}
                className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center
                  transition-all duration-150
                  ${isCurrent
                    ? 'ring-2 ring-offset-1 ring-[#2D2D2D] scale-110'
                    : ''
                  }
                  ${isAnswered
                    ? isCurrent
                      ? 'bg-[#2D2D2D] text-white'
                      : 'bg-[#2D2D2D] text-white opacity-60 hover:opacity-100'
                    : isCurrent
                      ? 'bg-red-500 text-white'
                      : 'bg-red-300 text-white hover:bg-red-500'
                  }
                `}
                title={`第 ${qq.q} 题${isMissed ? '（未完成）' : ''}`}
              >
                {qq.q}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center" key={currentQ}>
        <div className="animate-[fadeInUp_0.3s_ease-out]">
          <h2 className="text-lg font-bold text-[#2D2D2D] mb-6 leading-relaxed">
            {q.text}
          </h2>

          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const isSelected = selected.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 text-sm leading-relaxed
                    ${isSelected
                      ? 'border-[#2D2D2D] bg-[#2D2D2D] text-white font-medium'
                      : 'border-[#E8E0D8] bg-white text-[#333] hover:border-[#ccc]'
                    }
                    active:scale-[0.98]`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${isSelected
                        ? 'border-white bg-white'
                        : 'border-[#ccc]'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2D2D2D]" />
                      )}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-4 space-y-2">
        {error && (
          <p className="text-red-500 text-xs text-center leading-relaxed">{error}</p>
        )}

        <div className="flex gap-3">
          {currentQ > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3.5 rounded-2xl border-2 border-[#E8E0D8] bg-white text-[#333] font-medium text-sm
                         active:scale-[0.98] transition-transform duration-150"
            >
              上一题
            </button>
          )}

          {currentQ < QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!selected.length}
              className={`flex-1 py-3.5 rounded-2xl font-medium text-sm active:scale-[0.98] transition-all duration-150
                ${selected.length
                  ? 'bg-[#2D2D2D] text-white'
                  : 'bg-[#E8E0D8] text-[#999]'
                }`}
            >
              下一题
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !selected.length}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all duration-150
                ${loading
                  ? 'bg-[#666] text-white'
                  : 'bg-[#2D2D2D] text-white'
                }`}
            >
              {loading ? '提交中...' : '查看我的生活物种！'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}