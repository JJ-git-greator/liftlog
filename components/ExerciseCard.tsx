'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SetLog } from '@/lib/store';
import { getVideoId, getYouTubeSearchUrl } from '@/data/exercises';

interface ExerciseData {
  name: string;
  sets: number | null;
  reps: string;
  rpe: string;
  defaultLoad: number | null;
  memo: string | null;
}

interface ExerciseCardProps {
  exercise: ExerciseData;
  index: number;
  log: SetLog;
  onUpdate: (update: Partial<SetLog>) => void;
}

export default function ExerciseCard({ exercise, index, log, onUpdate }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [weightInput, setWeightInput] = useState(log.weight !== null ? String(log.weight) : '');

  const videoId = getVideoId(exercise.name);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  const youtubeUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : getYouTubeSearchUrl(exercise.name);

  const handleCheck = () => onUpdate({ completed: !log.completed });

  const handleWeightBlur = () => {
    const val = parseFloat(weightInput);
    onUpdate({ weight: isNaN(val) ? null : val });
  };

  const rpeNum = exercise.rpe.replace('@', '');

  return (
    <div
      className={`relative bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-200 ${
        log.completed ? 'ring-2 ring-emerald-500/60' : 'ring-1 ring-zinc-800'
      }`}
    >
      {/* Completion stripe */}
      {log.completed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 z-10" />
      )}

      {/* Thumbnail — tap to expand */}
      {thumbnailUrl && !imgError && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full relative block overflow-hidden"
        >
          <div className={`relative w-full overflow-hidden transition-all duration-300 ${expanded ? 'h-44' : 'h-28'}`}>
            <Image
              src={thumbnailUrl}
              alt={exercise.name}
              fill
              className="object-cover object-center"
              onError={() => setImgError(true)}
              unoptimized
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

            {/* Expand/collapse hint */}
            <div className="absolute bottom-2 right-3 flex items-center gap-1 text-zinc-400 text-xs">
              <span>{expanded ? '접기' : '자세히'}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* YouTube link (expanded only) */}
            {expanded && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="absolute bottom-2 left-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube에서 보기
              </a>
            )}
          </div>
        </button>
      )}

      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Checkbox */}
            <button
              onClick={handleCheck}
              className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                log.completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-zinc-600 hover:border-zinc-400'
              }`}
            >
              {log.completed && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Exercise name */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-base leading-tight ${log.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
                {exercise.name}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {exercise.sets !== null && (
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                    {exercise.sets}세트
                  </span>
                )}
                {exercise.reps && (
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                    {exercise.reps}회
                  </span>
                )}
                {rpeNum && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    parseInt(rpeNum) >= 9 ? 'bg-red-900/50 text-red-300' :
                    parseInt(rpeNum) >= 8 ? 'bg-orange-900/50 text-orange-300' :
                    'bg-blue-900/50 text-blue-300'
                  }`}>
                    RPE {rpeNum}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Image/search button (only when no thumbnail) */}
          {(!thumbnailUrl || imgError) && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              영상 검색
            </a>
          )}
        </div>

        {/* Weight input */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-800 rounded-xl px-3 py-2 flex-1 max-w-[160px]">
            <span className="text-zinc-500 text-xs">무게</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder={exercise.defaultLoad ? String(exercise.defaultLoad) : '0'}
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              onBlur={handleWeightBlur}
              className="bg-transparent text-white text-sm font-medium w-full outline-none placeholder:text-zinc-600"
            />
            <span className="text-zinc-500 text-xs">kg</span>
          </div>

          {log.weight && (
            <span className="text-xs text-zinc-500">{log.weight}kg 입력됨</span>
          )}
        </div>

        {/* Memo */}
        {exercise.memo && (
          <p className="mt-2 text-xs text-zinc-500 bg-zinc-800/50 rounded-lg px-3 py-2">
            💡 {exercise.memo}
          </p>
        )}
      </div>
    </div>
  );
}
