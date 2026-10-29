import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type Camara = {s: number; x: number; y: number; r: number};

// Toma con movimiento de cámara: interpola escala, paneo (px) y rotación de inicio a fin
export const Plano: React.FC<{src: string; desde: Camara; hasta: Camara; rate?: number}> = ({src, desde, hasta, rate = 0.85}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = interpolate(f, [0, durationInFrames], [0, 1], {easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp'});
  const v = (k: keyof Camara) => desde[k] + (hasta[k] - desde[k]) * t;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo muted playbackRate={rate} src={staticFile(src)}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${v('x')}px, ${v('y')}px) scale(${v('s')}) rotate(${v('r')}deg)`}} />
    </AbsoluteFill>
  );
};

// Grano de película animado
export const Grano: React.FC<{opacidad?: number}> = ({opacidad = 0.09}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: opacidad, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} /></filter>
        <rect width="100%" height="100%" filter="url(#grano)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vineta: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(43,38,34,.45) 100%)', pointerEvents: 'none'}} />
);

// Texto que sube desde una máscara, línea por línea
export const Revela: React.FC<{lineas: string[]; delay?: number; style: React.CSSProperties}> = ({lineas, delay = 0, style}) => {
  const f = useCurrentFrame();
  return (
    <div>
      {lineas.map((l, i) => {
        const p = interpolate(f - delay - i * 6, [0, 22], [0, 1], {easing: Easing.out(Easing.exp), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={i} style={{overflow: 'hidden', paddingBottom: 8}}>
            <div style={{...style, transform: `translateY(${(1 - p) * 110}%)`, opacity: p}}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};
