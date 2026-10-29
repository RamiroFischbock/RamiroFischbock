import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';

// Destellos tipo brillo de fiesta: estrellitas de 4 puntas que titilan y suben despacio
export const Destellos: React.FC<{cantidad?: number; color?: string; semilla?: string; desde?: number}> = ({cantidad = 26, color = '#fff6dc', semilla = 'd', desde = 0}) => {
  const f = useCurrentFrame() - desde;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: cantidad}, (_, i) => {
        const x = random(`${semilla}x${i}`) * 1080;
        const y0 = random(`${semilla}y${i}`) * 1920;
        const tam = 14 + random(`${semilla}s${i}`) * 34;
        const fase = random(`${semilla}p${i}`) * 60;
        const brillo = Math.max(0, Math.sin((f + fase) / 9));
        const aparece = interpolate(f, [i * 1.2, i * 1.2 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <svg key={i} width={tam} height={tam} viewBox="-10 -10 20 20"
            style={{position: 'absolute', left: x, top: y0 - f * (0.6 + random(`${semilla}v${i}`)), opacity: brillo * aparece,
              transform: `rotate(${f * 2 + fase}deg) scale(${0.6 + brillo * 0.5})`, filter: `drop-shadow(0 0 6px ${color})`}}>
            <path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill={color} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};
