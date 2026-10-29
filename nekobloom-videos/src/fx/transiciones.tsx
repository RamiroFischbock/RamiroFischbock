import {AbsoluteFill, interpolate} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {colors} from '../brand';

type P = Record<string, never>;

// Zoom a través: la toma que sale se agranda y desenfoca, la que entra viene de lejos
const ZoomThrough: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress: p}) => {
  const sale = presentationDirection === 'exiting';
  const style: React.CSSProperties = sale
    ? {transform: `scale(${interpolate(p, [0, 1], [1, 1.6])})`, filter: `blur(${p * 18}px)`, opacity: 1 - p}
    : {transform: `scale(${interpolate(p, [0, 1], [0.75, 1])})`, opacity: p};
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
export const zoomThrough = (): TransitionPresentation<P> => ({component: ZoomThrough, props: {}});

// Whip pan: barrido rápido horizontal con desenfoque de movimiento
const Whip: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress: p}) => {
  const sale = presentationDirection === 'exiting';
  const x = sale ? interpolate(p, [0, 1], [0, -100]) : interpolate(p, [0, 1], [100, 0]);
  const blur = Math.sin(p * Math.PI) * 40;
  return <AbsoluteFill style={{transform: `translateX(${x}%) skewX(${sale ? -p * 6 : (1 - p) * 6}deg)`, filter: `blur(${blur}px)`}}>{children}</AbsoluteFill>;
};
export const whip = (): TransitionPresentation<P> => ({component: Whip, props: {}});

// Destello de luz cálida que abre la toma nueva desde un círculo
const Leak: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress: p}) => {
  if (presentationDirection === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  const glow = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${p * 120}% at 70% 30%)`}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(circle at 70% 30%, ${colors.cream} 0%, ${colors.blush}cc 25%, transparent 60%)`, opacity: glow, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};
export const leak = (): TransitionPresentation<P> => ({component: Leak, props: {}});
