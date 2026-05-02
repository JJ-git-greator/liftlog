'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ExerciseCard from '@/components/ExerciseCard';
import {
  getConfig,
  getLogs,
  saveLogs,
  getCurrentSession,
  getTodayString,
  UserConfig,
  SetLog,
  AllLogs,
  DailyLog,
} from '@/lib/store';
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
  day: string;
  week: number;
  dayNum: number;
  exercises: Exercise[];
  cardio: string | null;
}

export default function HomePage() {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [logs, setLogs] = useState<AllLogs>({});
  const [today] = useState(getTodayString());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const cfg = getConfig();
    setConfig(cfg);
    setLogs(getLogs());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!config) return;
    const currentSession = getCurrentSession(config.startDate);
    if (!currentSession) return;

    const program = programsData.find(p => p.id === config.programId);
    if (!program) return;

    const sessionData = (program.sessions as Record<string, Session>)[currentSession.sessionKey];
    setSession(sessionData || null);
  }, [config]);

  const updateLog = useCallback((exerciseIndex: number, update: Partial<SetLog>) => {
    setLogs(prev => {
      const next = { ...prev };
      if (!next[today]) next[today] = {};
      const current = next[today][exerciseIndex] || { completed: false, weight: null, notes: '' };
      next[today] = { ...next[today], [exerciseIndex]: { ...current, ...update } };
      saveLogs(next);
      return next;
    });
  }, [today]);

  const todayLog = (logs[today] || {}) as DailyLog;
  const completedCount = Object.values(todayLog).filter(l => l.completed).length;
  const totalCount = session?.exercises.length || 0;
  const allDone = totalCount > 0 && completedCount >= totalCount;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!mounted) return null;

  // No program set
  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="text-6xl mb-6">🏋️</div>
        <h1 className="text-3xl font-bold text-white mb-3">리프트로그</h1>
        <p className="text-zinc-400 mb-8 text-base leading-relaxed">
          12주 축분할 트레이닝을 시작해보세요.<br />
          매일 운동 스케줄이 자동으로 제공됩니다.
        </p>
        <Link
          href="/program"
          className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-emerald-500/20"
        >
          프로그램 시작하기
        </Link>
      </div>
    );
  }

  // Program complete
  const sessionInfo = getCurrentSession(config.startDate);
  if (!sessionInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-white mb-3">12주 프로그램 완료!</h1>
        <p className="text-zinc-400 mb-8">수고하셨습니다. 새 프로그램을 시작하세요.</p>
        <Link href="/program" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-2xl transition-colors">
          새 프로그램 시작
        </Link>
      </div>
    );
  }

  const program = programsData.find(p => p.id === config.programId);
  const todayDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="mb-6">
        <p className="text-zinc-400 text-sm">{todayDate}</p>
        <div className="flex items-center justify-between mt-1">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {sessionInfo.week}주차 Day {sessionInfo.day}
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">{program?.name}</p>
          </div>
          {allDone && (
            <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-sm font-bold">
              완료 ✓
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">{completedCount} / {totalCount} 완료</span>
          <span className="text-sm font-bold text-emerald-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* No session data */}
      {!session && (
        <div className="text-center py-12 text-zinc-500">
          <p>오늘 운동 데이터를 불러올 수 없습니다.</p>
          <Link href="/program" className="text-emerald-400 underline mt-2 block">프로그램 재설정</Link>
        </div>
      )}

      {/* Exercise list */}
      {session && (
        <div className="space-y-3">
          {session.exercises.map((exercise, idx) => (
            <ExerciseCard
              key={`${exercise.name}-${idx}`}
              exercise={exercise}
              index={idx}
              log={todayLog[idx] || { completed: false, weight: null, notes: '' }}
              onUpdate={update => updateLog(idx, update)}
            />
          ))}

          {/* Cardio */}
          {session.cardio && (
            <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏃</span>
                <div>
                  <p className="text-sm font-semibold text-white">저강도 유산소 (권장)</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{session.cardio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Completion message */}
          {allDone && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center mt-4">
              <p className="text-2xl mb-2">💪</p>
              <p className="text-emerald-400 font-bold text-lg">오늘 운동 완료!</p>
              <p className="text-zinc-400 text-sm mt-1">수고하셨습니다. 내일도 파이팅!</p>
            </div>
          )}
        </div>
      )}

      {/* 12주 진행률 */}
      <div className="mt-6 bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">12주 전체 진행률</span>
          <span className="text-sm font-bold text-white">
            {sessionInfo.week}주차 / 12주
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-400 rounded-full transition-all duration-500"
            style={{ width: `${((sessionInfo.week - 1) * 4 + sessionInfo.day) / 48 * 100}%` }}
          />
        </div>
        <p className="text-xs text-zinc-600 mt-1.5 text-right">
          {(sessionInfo.week - 1) * 4 + sessionInfo.day} / 48일
        </p>
      </div>
    </div>
  );
}
