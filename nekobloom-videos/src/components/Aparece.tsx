import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Fade + leve subida, con delay en frames
export const Aparece: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay = 0, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - delay, fps, config: {damping: 200}});
  return (
    <div style={{opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`, ...style}}>
      {children}
    </div>
  );
};
