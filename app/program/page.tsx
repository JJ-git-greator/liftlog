'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getConfig, saveConfig } from '@/lib/store';
import programsData from '@/data/programs.json';

export default function ProgramPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('base-one');
  const [startDate, setStartDate] = useState('');
  const [saved, setSaved] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<{ programId: string; startDate: string } | null>(null);

  useEffect(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setStartDate(`${y}-${m}-${d}`);

    const cfg = getConfig();
    if (cfg) {
      setCurrentConfig(cfg);
      setSelectedId(cfg.programId);
      setStartDate(cfg.startDate);
    }
  }, []);

  const handleSave = () => {
    saveConfig({ programId: selectedId, startDate });
    setSaved(true);
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  const programDescriptions: Record<string, { desc: string; tag: string; color: string }> = {
    'base-one': { desc: '처음 시작하는 분들을 위한 기본 프로그램. 볼륨을 점진적으로 올려가며 적응합니다.', tag: '입문자 추천', color: 'emerald' },
    'base': { desc: '기본 프로그램 표준 버전. 더 많은 운동 종류로 전신을 균형 있게 자극합니다.', tag: '중급자', color: 'emerald' },
    'strength-one': { desc: '빅3 중심의 스트렝스 훈련. 처음 접하는 분들에게 추천되는 버전입니다.', tag: '스트렝스 입문', color: 'blue' },
    'strength': { desc: '빅3(스쿼트/벤치/데드) 중심으로 최대 근력 향상에 집중하는 프로그램입니다.', tag: '스트렝스', color: 'blue' },
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">프로그램 설정</h1>
        <p className="text-zinc-400 text-sm mt-1">12주 축분할 트레이닝 프로그램을 선택하세요</p>
      </div>

      {/* Current program info */}
      {currentConfig && (
        <div className="mb-5 bg-zinc-900 ring-1 ring-zinc-700 rounded-2xl p-4">
          <p className="text-xs text-zinc-500 mb-1">현재 진행 중</p>
          <p className="text-white font-semibold">
            {programsData.find(p => p.id === currentConfig.programId)?.name}
          </p>
          <p className="text-zinc-400 text-xs mt-0.5">시작일: {currentConfig.startDate}</p>
        </div>
      )}

      {/* Program cards */}
      <div className="space-y-3 mb-6">
        {programsData.map(program => {
          const meta = programDescriptions[program.id] || { desc: '', tag: '', color: 'zinc' };
          const isSelected = selectedId === program.id;

          return (
            <button
              key={program.id}
              onClick={() => setSelectedId(program.id)}
              className={`w-full text-left rounded-2xl p-4 transition-all border-2 ${
                isSelected
                  ? 'bg-zinc-800 border-emerald-500 ring-0'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{program.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      meta.color === 'emerald' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-blue-900/50 text-blue-300'
                    }`}>
                      {meta.tag}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{meta.desc}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-zinc-500">12주</span>
                    <span className="text-xs text-zinc-600">·</span>
                    <span className="text-xs text-zinc-500">주 4회</span>
                    <span className="text-xs text-zinc-600">·</span>
                    <span className="text-xs text-zinc-500">
                      {Object.values(program.sessions as Record<string, { exercises: unknown[] }>)[0]?.exercises.length || 0}개 운동/일
                    </span>
                  </div>
                </div>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'
                }`}>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Start date */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-zinc-300 mb-2">시작일</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <p className="text-xs text-zinc-500 mt-1.5">오늘부터 시작하면 오늘이 1주차 Day 1이 됩니다.</p>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!startDate || saved}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
          saved
            ? 'bg-emerald-600 text-white'
            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
        } disabled:opacity-50`}
      >
        {saved ? '✓ 저장됨! 이동 중...' : '프로그램 시작하기'}
      </button>
    </div>
  );
}
