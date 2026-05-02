'use client';

import { useEffect, useState } from 'react';
import { getConfig, getLogs, getSessionForDate, AllLogs, DailyLog } from '@/lib/store';
import programsData from '@/data/programs.json';

interface Exercise {
  name: string;
  sets: number | null;
  reps: string;
  rpe: string;
  defaultLoad: number | null;
  memo: string | null;
}

interface Session {
  exercises: Exercise[];
  cardio: string | null;
}

interface DayData {
  dateStr: string;
  dayIdx: number;
  weekIdx: number;
  sessionKey: string | undefined;
  isComplete: boolean;
  isPartial: boolean;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  completedCount: number;
  totalExercises: number;
}

interface DayDetailModalProps {
  day: DayData;
  session: Session | null;
  dayLog: DailyLog;
  onClose: () => void;
}

function DayDetailModal({ day, session, dayLog, onClose }: DayDetailModalProps) {
  const dateObj = new Date(day.dateStr);
  const dateLabel = dateObj.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 w-full max-w-md rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">{dateLabel}</p>
            <h3 className="font-bold text-white text-lg">
              {day.weekIdx}주차 Day {day.dayIdx}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {day.isComplete && (
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">완료 ✓</span>
            )}
            {day.isPartial && (
              <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
                {day.completedCount}/{day.totalExercises}
              </span>
            )}
            <button onClick={onClose} className="text-zinc-500 hover:text-white text-2xl leading-none">×</button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-2">
          {day.isFuture && !day.completedCount && (
            <div className="text-center py-8 text-zinc-500">
              <p className="text-3xl mb-3">📅</p>
              <p>아직 진행하지 않은 날이에요</p>
            </div>
          )}

          {session && session.exercises.map((exercise, idx) => {
            const log = dayLog[idx];
            const done = log?.completed;
            const weight = log?.weight;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                  done ? 'bg-emerald-500/10' : 'bg-zinc-800/60'
                }`}
              >
                {/* Check circle */}
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  done ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'
                }`}>
                  {done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Exercise info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${done ? 'text-white' : 'text-zinc-400'}`}>
                    {exercise.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {[
                      exercise.sets ? `${exercise.sets}세트` : null,
                      exercise.reps ? `${exercise.reps}회` : null,
                      exercise.rpe ? `RPE ${exercise.rpe.replace('@', '')}` : null,
                    ].filter(Boolean).join(' · ')}
                  </p>
                </div>

                {/* Weight badge */}
                {weight && (
                  <span className="flex-shrink-0 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    {weight}kg
                  </span>
                )}
              </div>
            );
          })}

          {/* Cardio */}
          {session?.cardio && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-zinc-800/60">
              <span className="text-xl">🏃</span>
              <div>
                <p className="text-sm font-semibold text-zinc-400">저강도 유산소</p>
                <p className="text-xs text-zinc-500">{session.cardio}</p>
              </div>
            </div>
          )}

          {!session && !day.isFuture && (
            <div className="text-center py-8 text-zinc-500">
              <p>운동 데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [config, setConfig] = useState<{ programId: string; startDate: string } | null>(null);
  const [logs, setLogs] = useState<AllLogs>({});
  const [mounted, setMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

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

      return { dateStr, dayIdx: dayIdx + 1, weekIdx: weekIdx + 1, sessionKey, isComplete, isPartial, isPast, isToday, isFuture, completedCount, totalExercises };
    });
    return days;
  });

  const totalCompleted = weeks.flat().filter(d => d.isComplete).length;
  const streak = (() => {
    let s = 0;
    const all = weeks.flat().reverse();
    for (const d of all) {
      if (d.isComplete) s++;
      else if (d.isPast) break;
    }
    return s;
  })();

  const selectedSession = selectedDay?.sessionKey
    ? (program.sessions as Record<string, Session>)[selectedDay.sessionKey] ?? null
    : null;
  const selectedLog = selectedDay ? (logs[selectedDay.dateStr] || {}) as DailyLog : {};

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
          <div>
            <h2 className="font-bold text-white">12주 캘린더</h2>
            <p className="text-xs text-zinc-500 mt-0.5">날짜를 탭하면 운동 내역을 볼 수 있어요</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block" /> 완료</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-orange-500 rounded-sm inline-block" /> 일부</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1.5 mb-1">
            <div />
            {['D1', 'D2', 'D3', 'D4'].map(d => (
              <div key={d} className="text-center text-xs text-zinc-600 font-medium">{d}</div>
            ))}
          </div>

          {weeks.map((weekDays, wIdx) => (
            <div key={wIdx} className="grid grid-cols-5 gap-1.5 items-center">
              <div className="text-xs text-zinc-500 font-medium">{wIdx + 1}주</div>
              {weekDays.map(day => (
                <button
                  key={day.dayIdx}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all active:scale-95 ${
                    day.isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900' : ''
                  } ${
                    day.isComplete
                      ? 'bg-emerald-500 text-white'
                      : day.isPartial
                      ? 'bg-orange-500/70 text-white'
                      : day.isFuture
                      ? 'bg-zinc-800 text-zinc-600'
                      : 'bg-zinc-700 text-zinc-400'
                  }`}
                >
                  {day.isComplete ? '✓' : day.isToday ? '●' : day.completedCount > 0 ? day.completedCount : ''}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-zinc-600 pb-2">
        시작일: {config.startDate}
      </div>

      {/* Day detail modal */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          session={selectedSession}
          dayLog={selectedLog}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
