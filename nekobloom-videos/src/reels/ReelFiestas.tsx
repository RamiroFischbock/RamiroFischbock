import {z} from 'zod';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {colors, sans, serif} from '../brand';
import {Fuentes} from '../components/Fuentes';
import {Fondo} from '../components/Fondo';
import {Grano, Plano, Revela, Vineta} from '../fx/efectos';
import {Destellos} from '../fx/Destellos';
import {leak, zoomThrough} from '../fx/transiciones';

export const reelFiestasSchema = z.object({
  hook: z.array(z.string()),
  hookClip: z.string(),
  meses: z.array(z.string()).length(3),
  montaje: z.array(z.object({palabra: z.string(), clip: z.string()})),
  hoyClip: z.string(),
});
type Props = z.infer<typeof reelFiestasSchema>;

const D = {hook: 80, cal: 90, corte: 30, hoy: 105, placa: 115};
const T = 14;
export const duracionReelFiestas = (p: Props) => D.hook + D.cal + D.corte * p.montaje.length + D.hoy + D.placa - 4 * T;

const dorado = '#e9cf9a';

const Hook: React.FC<{lineas: string[]; clip: string}> = ({lineas, clip}) => (
  <AbsoluteFill>
    <Plano src={clip} desde={{s: 1.3, x: 40, y: 0, r: -2}} hasta={{s: 1.08, x: 0, y: 0, r: 0}} />
    <AbsoluteFill style={{background: 'linear-gradient(rgba(43,38,34,.6), transparent 50%)'}} />
    <AbsoluteFill style={{padding: '220px 80px', alignItems: 'center', textAlign: 'center'}}>
      <Revela delay={6} lineas={lineas} style={{fontFamily: serif, fontSize: 118, color: colors.cream, lineHeight: 1.02}} />
    </AbsoluteFill>
    <Destellos cantidad={18} color={dorado} semilla="hook" />
  </AbsoluteFill>
);

// Almanaque cuyas hojas pasan en 3D de octubre a diciembre
const Calendario: React.FC<{meses: string[]}> = ({meses}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = spring({frame: f, fps, config: {damping: 14}});
  const hoja = (i: number) => interpolate(f, [18 + i * 18, 34 + i * 18], [0, -180], {easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card: React.CSSProperties = {position: 'absolute', inset: 0, borderRadius: 40, background: colors.cream, boxShadow: '0 40px 80px rgba(43,38,34,.18)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', transformOrigin: 'top center'};
  return (
    <AbsoluteFill>
      <Fondo />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1600}}>
        <div style={{position: 'relative', width: 640, height: 640, transform: `scale(${entra}) rotateX(10deg) rotateY(${interpolate(f, [0, D.cal], [-14, 10])}deg)`, transformStyle: 'preserve-3d'}}>
          {[...meses].reverse().map((m, ri) => {
            const i = meses.length - 1 - ri;
            const ultima = i === meses.length - 1;
            return (
              <div key={m} style={{...card, transform: ultima ? undefined : `rotateX(${hoja(i)}deg)`}}>
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 130, borderRadius: '40px 40px 0 0', background: ultima ? colors.rose : colors.blush}} />
                <div style={{fontFamily: sans, fontWeight: 300, fontSize: 46, letterSpacing: 12, color: colors.ink, marginTop: 110}}>{m.toUpperCase()}</div>
                <div style={{fontFamily: serif, fontSize: 260, color: ultima ? colors.rose : colors.ink, lineHeight: 1}}>{ultima ? '24' : '1'}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 230, textAlign: 'center'}}>
        <Revela delay={50} lineas={['Las fiestas', 'están a la vuelta']} style={{fontFamily: serif, fontStyle: 'italic', fontSize: 92, color: colors.ink, lineHeight: 1.05}} />
      </AbsoluteFill>
      <Sequence from={60}><Destellos cantidad={14} color={colors.rose} semilla="cal" /></Sequence>
    </AbsoluteFill>
  );
};

// Cortes rápidos al ritmo: una palabra por toma, con flash entre cortes
const Montaje: React.FC<{items: Props['montaje']}> = ({items}) => (
  <AbsoluteFill>
    {items.map((it, i) => (
      <Sequence key={it.clip} from={i * D.corte} durationInFrames={D.corte}>
        <Corte {...it} i={i} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const Corte: React.FC<{palabra: string; clip: string; i: number}> = ({palabra, clip, i}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f - 2, fps, config: {damping: 11, stiffness: 180}});
  const flash = interpolate(f, [0, 5], [0.85, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Plano src={clip} rate={1} desde={{s: 1.25, x: i % 2 ? 60 : -60, y: 0, r: 0}} hasta={{s: 1.12, x: 0, y: 0, r: 0}} />
      <AbsoluteFill style={{background: 'rgba(43,38,34,.18)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 170, color: colors.cream, transform: `scale(${pop}) rotate(${(1 - pop) * -8}deg)`, textShadow: '0 8px 40px rgba(43,38,34,.45)'}}>
          {palabra}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: colors.cream, opacity: flash}} />
    </AbsoluteFill>
  );
};

// "El mejor momento para empezar es... HOY"
const Hoy: React.FC<{clip: string}> = ({clip}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f - 38, fps, config: {damping: 9, stiffness: 140}});
  const subrayado = interpolate(f, [52, 72], [0, 1], {easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Plano src={clip} desde={{s: 1.05, x: 0, y: 0, r: 0}} hasta={{s: 1.22, x: 0, y: -30, r: 0}} />
      <AbsoluteFill style={{background: `rgba(250,246,236,${interpolate(f, [0, 30], [0.2, 0.78], {extrapolateRight: 'clamp'})})`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 80}}>
        <Revela delay={4} lineas={['El mejor momento', 'para empezar es']} style={{fontFamily: serif, fontSize: 96, color: colors.ink, lineHeight: 1.05}} />
        <div style={{position: 'relative', marginTop: 10}}>
          <div style={{fontFamily: serif, fontWeight: 500, fontSize: 330, color: colors.rose, lineHeight: 1, transform: `scale(${pop})`}}>hoy</div>
          <svg width="520" height="60" viewBox="0 0 520 60" style={{position: 'absolute', left: '50%', marginLeft: -260, bottom: -10}}>
            <path d="M10 40 C 150 10, 370 10, 510 35" stroke={colors.ink} strokeWidth="5" fill="none" strokeLinecap="round"
              strokeDasharray="540" strokeDashoffset={540 * (1 - subrayado)} />
          </svg>
        </div>
      </AbsoluteFill>
      <Sequence from={40}><Destellos cantidad={30} color={colors.rose} semilla="hoy" /></Sequence>
    </AbsoluteFill>
  );
};

// Placa final NekoBloom Studio
const Placa: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = spring({frame: f, fps, config: {damping: 14}});
  const brillo = interpolate(f, [18, 55], [-120, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeIn = (a: number) => ({opacity: interpolate(f, [a, a + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})});
  return (
    <AbsoluteFill>
      <Fondo />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1400, textAlign: 'center'}}>
        <div style={{position: 'relative', width: 400, height: 400, borderRadius: '50%', overflow: 'hidden',
          transform: `rotateY(${interpolate(e, [0, 1], [-200, 0])}deg) scale(${interpolate(e, [0, 1], [0.5, 1])})`, boxShadow: '0 30px 70px rgba(217,164,160,.45)'}}>
          <Img src={staticFile('logo.png')} style={{width: '100%', height: '100%'}} />
          <div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, transparent ${brillo - 30}%, rgba(255,255,255,.75) ${brillo}%, transparent ${brillo + 30}%)`}} />
        </div>
        <div style={{marginTop: 60}}>
          <Revela delay={14} lineas={['NekoBloom Studio']} style={{fontFamily: serif, fontSize: 108, color: colors.ink}} />
        </div>
        <div style={{...fadeIn(26), fontFamily: serif, fontStyle: 'italic', fontSize: 60, color: colors.rose, marginTop: 6}}>Empezá tu ritual de fiestas</div>
        <div style={{...fadeIn(38), marginTop: 56, padding: '26px 64px', borderRadius: 100, background: colors.rose, color: colors.cream, fontFamily: sans, fontSize: 42, letterSpacing: 4}}>
          Reservá en nekobloom.vercel.app
        </div>
        <div style={{...fadeIn(48), marginTop: 46, fontFamily: sans, fontWeight: 300, fontSize: 36, color: colors.ink}}>@nekobloomstudio · Nordelta</div>
      </AbsoluteFill>
      <Destellos cantidad={16} color={colors.rose} semilla="placa" />
    </AbsoluteFill>
  );
};

export const ReelFiestas: React.FC<Props> = (p) => {
  const tr = linearTiming({durationInFrames: T, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: colors.ink}}>
      <Fuentes />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={D.hook}><Hook lineas={p.hook} clip={p.hookClip} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={leak()} timing={tr} />
        <TransitionSeries.Sequence durationInFrames={D.cal}><Calendario meses={p.meses} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomThrough()} timing={tr} />
        <TransitionSeries.Sequence durationInFrames={D.corte * p.montaje.length}><Montaje items={p.montaje} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomThrough()} timing={tr} />
        <TransitionSeries.Sequence durationInFrames={D.hoy}><Hoy clip={p.hoyClip} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={tr} />
        <TransitionSeries.Sequence durationInFrames={D.placa}><Placa /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Vineta />
      <Grano opacidad={0.07} />
    </AbsoluteFill>
  );
};
