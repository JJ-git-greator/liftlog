'use client';

import { useEffect } from 'react';
import { getVideoId, getYouTubeSearchUrl } from '@/data/exercises';

interface VideoModalProps {
  exerciseName: string;
  onClose: () => void;
}

export default function VideoModal({ exerciseName, onClose }: VideoModalProps) {
  const videoId = getVideoId(exerciseName);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h3 className="font-bold text-white text-lg">{exerciseName}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        {videoId ? (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-zinc-400 mb-4">등록된 영상이 없습니다.</p>
            <a
              href={getYouTubeSearchUrl(exerciseName)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube에서 검색
            </a>
          </div>
        )}

        <div className="px-5 py-3 bg-zinc-950/50">
          <p className="text-xs text-zinc-500 text-center">
            영상을 참고하여 올바른 자세로 운동하세요
          </p>
        </div>
      </div>
    </div>
  );
}
