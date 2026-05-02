'use client';

import { useEffect, useState } from 'react';
import { getConfig, getLogs, getSessionForDate, AllLogs } from '@/lib/store';
import programsData from '@/data/programs.json';

interface Session {
  exercises: unknown[];
}

export default function ProgressPage() {
  const [config, setConfig] = useState<{ programId: string; startDate: string } | null>(null);
  const [logs, setLogs] = useState<AllLogs>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConfig(getConfig());
    setLogs(getLogs());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-zinc-400">프로그램을 먼저 설정해주세요.</p>
      </div>
    );
  }

  const program = programsData.find(p => p.id === config.programId);
  if (!program) return null;

  const startDate = new Date(config.startDate);
  startDate.setHours(0, 0, 0, 0);

  // Build 12-week grid (48 days)
  const weeks = Array.from({ length: 12 }, (_, weekIdx) => {
    const days = Array.from({ length: 4 }, (_, dayIdx) => {
      const totalDayIdx = weekIdx * 4 + dayIdx;
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + totalDayIdx);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const sessionInfo = getSessionForDate(config.startDate, dateStr);
      const sessionKey = sessionInfo?.sessionKey;
      const session = sessionKey ? (program.sessions as Record<string, Session>)[sessionKey] : null;
      const totalExercises = session?.exercises.length || 0;
      const dayLog = logs[dateStr] || {};
      const completedCount = Object.values(dayLog).filter(l => l.completed).length;
      const isComplete = totalExercises > 0 && completedCount >= totalExercises;
      const isPartial = completedCount > 0 && !isComplete;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isFuture = date > today;

      return { dateStr, dayIdx: dayIdx + 1, weekIdx: weekIdx + 1, isComplete, isPartial, isPast, isToday, isFuture, completedCount, totalExercises };
    });
    return days;
  });

  // Stats
  const totalCompleted = weeks.flat().filter(d => d.isComplete).length;
  const totalPast = weeks.flat().filter(d => d.isPast || d.isToday).length;
  const streak = (() => {
    let s = 0;
    const all = weeks.flat().reverse();
    for (const d of all) {
      if (d.isComplete) s++;
      else if (d.isPast) break;
    }
    return s;
  })();

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">진행 현황</h1>
        <p className="text-zinc-400 text-sm mt-1">{program.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{totalCompleted}</p>
          <p className="text-xs text-zinc-400 mt-1">완료한 날</p>
        </div>
        <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{streak}</p>
          <p className="text-xs text-zinc-400 mt-1">연속 완료</p>
        </div>
        <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{Math.round(totalCompleted / 48 * 100)}%</p>
          <p className="text-xs text-zinc-400 mt-1">전체 진행률</p>
        </div>
      </div>

      {/* 12-week grid */}
      <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">12주 캘린더</h2>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block" /> 완료</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-orange-500 rounded-sm inline-block" /> 일부</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-zinc-700 rounded-sm inline-block" /> 미완료</span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-5 gap-1.5 mb-1">
            <div className="text-xs text-zinc-600 font-medium"></div>
            {['D1', 'D2', 'D3', 'D4'].map(d => (
              <div key={d} className="text-center text-xs text-zinc-600 font-medium">{d}</div>
            ))}
          </div>

          {weeks.map((weekDays, wIdx) => (
            <div key={wIdx} className="grid grid-cols-5 gap-1.5 items-center">
              <div className="text-xs text-zinc-500 font-medium">{wIdx + 1}주</div>
              {weekDays.map(day => (
                <div
                  key={day.dayIdx}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    day.isToday
                      ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900'
                      : ''
                  } ${
                    day.isComplete
                      ? 'bg-emerald-500 text-white'
                      : day.isPartial
                      ? 'bg-orange-500/70 text-white'
                      : day.isFuture
                      ? 'bg-zinc-800 text-zinc-600'
                      : 'bg-zinc-700 text-zinc-400'
                  }`}
                  title={`${day.dateStr} - ${day.completedCount}/${day.totalExercises}`}
                >
                  {day.isComplete ? '✓' : day.isToday ? '●' : day.completedCount > 0 ? day.completedCount : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Start date info */}
      <div className="mt-4 text-center text-xs text-zinc-600">
        시작일: {config.startDate}
      </div>
    </div>
  );
}
