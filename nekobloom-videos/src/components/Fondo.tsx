import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../brand';

// Fondo crema con un círculo rosa que respira lento
export const Fondo: React.FC = () => {
  const f = useCurrentFrame();
  const s = interpolate(Math.sin(f / 40), [-1, 1], [0.95, 1.08]);
  return (
    <AbsoluteFill style={{background: colors.cream}}>
      <div
        style={{
          position: 'absolute', width: 1300, height: 1300, borderRadius: '50%',
          left: -110, top: 310, background: colors.blush, opacity: 0.35,
          transform: `scale(${s})`, filter: 'blur(40px)',
        }}
      />
    </AbsoluteFill>
  );
};
