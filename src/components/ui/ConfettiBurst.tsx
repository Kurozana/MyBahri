import { useMemo, type CSSProperties } from 'react'

const COLORS = ['#14fdd4', '#10c1fd', '#ffd93b', '#ff6b9d', '#7c5cff', '#42d778']

/**
 * A one-shot confetti + emoji-pop celebration. Mount it (with a changing `key`
 * to re-fire) inside a `relative` container. Pieces animate once and fade out.
 */
export function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2
        const dist = 70 + Math.random() * 170
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist * 0.7 + 60, // bias downward, like falling paper
          rot: Math.random() * 720 - 360,
          color: COLORS[i % COLORS.length],
          delay: Math.random() * 0.12,
          dur: 0.9 + Math.random() * 0.8,
          w: 6 + Math.random() * 6,
          h: 8 + Math.random() * 9,
          round: Math.random() > 0.6,
        }
      }),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <span className="animate-emoji-pop absolute left-1/2 top-1/2 text-7xl drop-shadow-lg">🎉</span>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="animate-confetti-fly absolute left-1/2 top-[46%]"
          style={
            {
              width: p.w,
              height: p.h,
              background: p.color,
              borderRadius: p.round ? '9999px' : '2px',
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
