'use client';

import { useEffect } from 'react';
import { getYouTubeSearchUrl } from '@/data/exercises';

interface VideoModalProps {
  exerciseName: string;
  onClose: () => void;
}

export default function VideoModal({ exerciseName, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h3 className="font-bold text-white">{exerciseName}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">×</button>
        </div>
        <div className="p-6 text-center">
          <a
            href={getYouTubeSearchUrl(exerciseName)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-medium transition-colors"
          >
            YouTube에서 영상 검색
          </a>
        </div>
      </div>
    </div>
  );
}
