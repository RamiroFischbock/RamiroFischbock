import {z} from 'zod';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {flip} from '@remotion/transitions/flip';
import {colors, sans, serif} from '../brand';
import {Fuentes} from '../components/Fuentes';
import {Fondo} from '../components/Fondo';
import {Grano, Plano, Revela, Vineta} from '../fx/efectos';
import {leak, whip, zoomThrough} from '../fx/transiciones';

export const reelEsteticoSchema = z.object({
  invitada: z.string(),
  tratamiento: z.string(),
  hook: z.string(),
  paneles: z.array(z.string()).length(3),
  pasos: z.array(z.object({titulo: z.string(), clip: z.string()})).length(5),
  carrusel: z.array(z.string()),
  fraseFinal: z.string(),
  cierre: z.string(),
});
type Props = z.infer<typeof reelEsteticoSchema>;

const D = {hook: 90, paneles: 105, paso: 80, carrusel: 120, outro: 110};
const T = {zoom: 15, flip: 20, whip: 12, leak: 18, fade: 15};
export const DURACION_ESTETICO =
  D.hook + D.paneles + 5 * D.paso + D.carrusel + D.outro - (T.zoom * 2 + T.flip * 2 + T.whip * 2 + T.leak + T.fade);

// Movimientos de cámara de cada paso: push-in, paneo vertical, dolly con giro, paneo lateral, pull-out
const CAMARAS = [
  {desde: {s: 1.05, x: 0, y: 0, r: 0}, hasta: {s: 1.25, x: 0, y: -40, r: 0}},
  {desde: {s: 1.2, x: 0, y: 120, r: 0}, hasta: {s: 1.2, x: 0, y: -120, r: 0}},
  {desde: {s: 1.3, x: 0, y: 0, r: -3}, hasta: {s: 1.12, x: 0, y: 0, r: 2}},
  {desde: {s: 1.2, x: 90, y: 0, r: 0}, hasta: {s: 1.2, x: -90, y: 0, r: 0}},
  {desde: {s: 1.3, x: 0, y: -30, r: 0}, hasta: {s: 1.05, x: 0, y: 0, r: 0}},
];

const Hook: React.FC<{clip: string; invitada: string; hook: string}> = ({clip, invitada, hook}) => (
  <AbsoluteFill>
    <Plano src={clip} desde={{s: 1.35, x: 0, y: 60, r: -2}} hasta={{s: 1.08, x: 0, y: 0, r: 0}} />
    <AbsoluteFill style={{background: 'linear-gradient(rgba(43,38,34,.55), transparent 45%)'}} />
    <AbsoluteFill style={{padding: '230px 90px', alignItems: 'center', textAlign: 'center'}}>
      <Revela delay={8} lineas={[hook]} style={{fontFamily: sans, fontWeight: 300, fontSize: 36, letterSpacing: 12, color: colors.blush}} />
      <Revela delay={16} lineas={invitada.split(' ')} style={{fontFamily: serif, fontSize: 150, color: colors.cream, lineHeight: 1}} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// Tres pantallas flotando en 3D con la cámara orbitando alrededor
const Paneles: React.FC<{clips: string[]; tratamiento: string}> = ({clips, tratamiento}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const orbita = interpolate(f, [0, D.paneles], [28, -18], {easing: Easing.inOut(Easing.sin)});
  return (
    <AbsoluteFill>
      <Fondo />
      <AbsoluteFill style={{perspective: 1800, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transformStyle: 'preserve-3d', transform: `rotateX(8deg) rotateY(${orbita}deg)`, width: 1, height: 1, position: 'relative'}}>
          {clips.map((c, i) => {
            const e = spring({frame: f - i * 7, fps, config: {damping: 16, mass: 0.9}});
            const ang = (i - 1) * 32;
            return (
              <div key={c} style={{
                position: 'absolute', width: 560, height: 995, left: -280, top: -560, borderRadius: 36, overflow: 'hidden',
                boxShadow: '0 50px 90px rgba(43,38,34,.35)', border: `3px solid ${colors.cream}`,
                transform: `rotateY(${ang}deg) translateZ(${interpolate(e, [0, 1], [-1400, 520])}px) translateX(${(i - 1) * 40}px)`,
                opacity: e, backfaceVisibility: 'hidden',
              }}>
                <OffthreadVideo muted playbackRate={0.8} src={staticFile(c)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 170}}>
        <Revela delay={22} lineas={[tratamiento]} style={{fontFamily: serif, fontSize: 120, color: colors.ink}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Paso: React.FC<{n: number; titulo: string; clip: string}> = ({n, titulo, clip}) => (
  <AbsoluteFill>
    <Plano src={clip} {...CAMARAS[n - 1]} />
    <AbsoluteFill style={{background: 'linear-gradient(transparent 58%, rgba(43,38,34,.65))'}} />
    <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 90px 250px'}}>
      <Revela delay={6} lineas={[`0${n}`]} style={{fontFamily: serif, fontStyle: 'italic', fontSize: 70, color: colors.blush}} />
      <Revela delay={10} lineas={[titulo]} style={{fontFamily: serif, fontSize: 112, color: colors.cream, lineHeight: 1.02}} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// Carrusel 3D girando: las tomas forman un anillo
const Carrusel: React.FC<{clips: string[]; frase: string}> = ({clips, frase}) => {
  const f = useCurrentFrame();
  const radio = 760;
  const giro = interpolate(f, [0, D.carrusel], [0, -150], {easing: Easing.inOut(Easing.quad)});
  const zoom = interpolate(f, [0, D.carrusel], [-500, -250]);
  return (
    <AbsoluteFill>
      <Fondo />
      <AbsoluteFill style={{perspective: 2000, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transformStyle: 'preserve-3d', transform: `translateZ(${zoom}px) rotateX(-6deg) rotateY(${giro}deg)`, position: 'relative', width: 1, height: 1}}>
          {clips.map((c, i) => (
            <div key={c} style={{
              position: 'absolute', width: 520, height: 924, left: -260, top: -462, borderRadius: 30, overflow: 'hidden',
              border: `3px solid ${colors.cream}`, boxShadow: '0 40px 80px rgba(43,38,34,.3)',
              transform: `rotateY(${(360 / clips.length) * i}deg) translateZ(${radio}px)`,
            }}>
              <OffthreadVideo muted playbackRate={0.8} src={staticFile(c)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 200}}>
        <Revela delay={14} lineas={frase.split('\n')} style={{fontFamily: serif, fontStyle: 'italic', fontSize: 104, color: colors.ink, textAlign: 'center', lineHeight: 1.05}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{cierre: string}> = ({cierre}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = spring({frame: f, fps, config: {damping: 14}});
  const brillo = interpolate(f, [20, 60], [-120, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Fondo />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1400}}>
        {/* Logo que entra girando como una moneda, con un reflejo que lo cruza */}
        <div style={{position: 'relative', width: 420, height: 420, borderRadius: '50%', overflow: 'hidden',
          transform: `rotateY(${interpolate(e, [0, 1], [-200, 0])}deg) scale(${interpolate(e, [0, 1], [0.5, 1])})`,
          boxShadow: '0 30px 70px rgba(217,164,160,.45)'}}>
          <Img src={staticFile('logo.png')} style={{width: '100%', height: '100%'}} />
          <div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, transparent ${brillo - 30}%, rgba(255,255,255,.75) ${brillo}%, transparent ${brillo + 30}%)`}} />
        </div>
        <div style={{marginTop: 70}}>
          <Revela delay={18} lineas={[cierre]} style={{fontFamily: serif, fontSize: 110, color: colors.ink, textAlign: 'center'}} />
        </div>
        <div style={{opacity: interpolate(f, [34, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), marginTop: 50, padding: '26px 64px', borderRadius: 100, background: colors.rose, color: colors.cream, fontFamily: sans, fontSize: 42, letterSpacing: 4}}>
          nekobloom.vercel.app
        </div>
        <div style={{opacity: interpolate(f, [44, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), marginTop: 50, fontFamily: sans, fontWeight: 300, fontSize: 38, color: colors.ink}}>
          @nekobloomstudio · Nordelta
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ReelEstetico: React.FC<Props> = (p) => {
  const tr = (d: number) => linearTiming({durationInFrames: d, easing: Easing.inOut(Easing.cubic)});
  const [s1, s2, s3, s4, s5] = p.pasos;
  return (
    <AbsoluteFill style={{background: colors.ink}}>
      <Fuentes />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={D.hook}><Hook clip={p.pasos[0].clip} invitada={p.invitada} hook={p.hook} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomThrough()} timing={tr(T.zoom)} />
        <TransitionSeries.Sequence durationInFrames={D.paneles}><Paneles clips={p.paneles} tratamiento={p.tratamiento} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flip({direction: 'from-right'})} timing={springTiming({durationInFrames: T.flip, config: {damping: 200}})} />
        <TransitionSeries.Sequence durationInFrames={D.paso}><Paso n={1} {...s1} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip()} timing={tr(T.whip)} />
        <TransitionSeries.Sequence durationInFrames={D.paso}><Paso n={2} {...s2} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={leak()} timing={tr(T.leak)} />
        <TransitionSeries.Sequence durationInFrames={D.paso}><Paso n={3} {...s3} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip()} timing={tr(T.whip)} />
        <TransitionSeries.Sequence durationInFrames={D.paso}><Paso n={4} {...s4} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomThrough()} timing={tr(T.zoom)} />
        <TransitionSeries.Sequence durationInFrames={D.paso}><Paso n={5} {...s5} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flip({direction: 'from-bottom'})} timing={springTiming({durationInFrames: T.flip, config: {damping: 200}})} />
        <TransitionSeries.Sequence durationInFrames={D.carrusel}><Carrusel clips={p.carrusel} frase={p.fraseFinal} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={tr(T.fade)} />
        <TransitionSeries.Sequence durationInFrames={D.outro}><Outro cierre={p.cierre} /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Vineta />
      <Grano />
    </AbsoluteFill>
  );
};
