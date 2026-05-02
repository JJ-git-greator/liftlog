import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '리프트로그';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Dumbbell emoji */}
        <div style={{ fontSize: 96, marginBottom: 32 }}>🏋️</div>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-2px',
            marginBottom: 20,
          }}
        >
          리프트로그
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#a1a1aa',
            marginBottom: 48,
          }}
        >
          12주 축분할 트레이닝 트래커
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['매일 운동 스케줄', '무게 기록', '운동 영상 가이드'].map((text) => (
            <div
              key={text}
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.4)',
                color: '#34d399',
                fontSize: 22,
                fontWeight: 600,
                padding: '10px 24px',
                borderRadius: 40,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
