import {z} from 'zod';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {colors, sans, serif} from '../brand';
import {Fuentes} from '../components/Fuentes';
import {Grano, Revela} from '../fx/efectos';
import {Placa} from './ReelFiestas';

// Estética "old money / boutique": papel crema, filetes finos, versalitas espaciadas,
// tomas en ventana con el borde superior fundido al papel (oculta la mesa de trabajo).

const toma = z.object({clip: z.string(), corte: z.number(), titulo: z.string(), bajada: z.string()});
export const reelProgramaSchema = z.object({
  programa: z.string(),
  temporada: z.string(),
  escenas: z.array(toma).length(2),
  pasos: z.array(toma).length(4),
  remate: z.array(z.string()),
});
type Props = z.infer<typeof reelProgramaSchema>;

const D = {apertura: 90, escena: 95, paso: 80, hoy: 105, placa: 115};
const T = 18;
export const DURACION_PROGRAMA = D.apertura + 2 * D.escena + 4 * D.paso + D.hoy + D.placa - 8 * T;

const VENTANA = 640; // y donde empieza la toma en el lienzo
const FUNDIDO = 230; // alto del fundido de la toma al papel
const ROMANOS = ['I', 'II', 'III', 'IV'];

const versalitas = (size: number, color: string = colors.taupe): React.CSSProperties => ({
  fontFamily: sans, fontWeight: 400, fontSize: size, letterSpacing: size * 0.38, color, textTransform: 'uppercase',
});

const aparece = (f: number, desde: number, dur = 20) =>
  interpolate(f, [desde, desde + dur], [0, 1], {easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Doble filete de marco, como papelería de boutique
const Marco: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', inset: 40, border: `1.5px solid ${colors.taupe}`, opacity: 0.7}} />
    <div style={{position: 'absolute', inset: 52, border: `1px solid ${colors.taupe}`, opacity: 0.35}} />
  </AbsoluteFill>
);

const Papel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 35%, ${colors.cream} 0%, ${colors.sand} 70%, ${colors.beige} 100%)`}}>
    {children}
  </AbsoluteFill>
);

// Filete horizontal que se dibuja desde el centro
const Filete: React.FC<{desde: number; ancho?: number}> = ({desde, ancho = 220}) => {
  const f = useCurrentFrame();
  return <div style={{width: ancho * aparece(f, desde, 26), height: 1.5, background: colors.taupe, margin: '0 auto'}} />;
};

const Encabezado: React.FC<{texto: string}> = ({texto}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: 108, left: 0, right: 0, textAlign: 'center', opacity: aparece(f, 0, 16)}}>
      <div style={versalitas(24)}>{texto}</div>
    </div>
  );
};

// Toma en ventana: ocupa la parte baja, se corre para esconder las primeras `corte` filas
// del video y funde su borde superior al papel. Cámara: avance lento.
const Ventana: React.FC<{clip: string; corte: number}> = ({clip, corte}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const s = interpolate(f, [0, durationInFrames], [1.0, 1.07], {easing: Easing.inOut(Easing.sin)});
  const mascara = `linear-gradient(to bottom, transparent 0px, rgba(0,0,0,.35) ${FUNDIDO * 0.45}px, black ${FUNDIDO}px)`;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: VENTANA, bottom: 0, overflow: 'hidden', WebkitMaskImage: mascara, maskImage: mascara}}>
      <OffthreadVideo muted playbackRate={0.85} src={staticFile(clip)}
        style={{position: 'absolute', left: 0, top: -corte, width: 1080, height: 1920, transformOrigin: `50% ${corte + 500}px`, transform: `scale(${s})`}} />
      {/* leve velo cálido para unificar el color de las tomas con el papel */}
      <AbsoluteFill style={{background: colors.sand, opacity: 0.08, mixBlendMode: 'multiply'}} />
    </div>
  );
};

const Apertura: React.FC<{programa: string; temporada: string}> = ({programa, temporada}) => {
  const f = useCurrentFrame();
  return (
    <Papel>
      <Marco />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{...versalitas(26), opacity: aparece(f, 4)}}>NekoBloom Studio presenta</div>
        <div style={{height: 70}} />
        <Revela delay={12} lineas={['Programa']} style={{fontFamily: serif, fontStyle: 'italic', fontSize: 80, color: colors.taupe}} />
        <Revela delay={18} lineas={programa.split('\n')} style={{fontFamily: serif, fontSize: 150, color: colors.ink, lineHeight: 1}} />
        <div style={{height: 50}} />
        <Filete desde={34} />
        <div style={{height: 40}} />
        <div style={{...versalitas(26), opacity: aparece(f, 44)}}>{temporada}</div>
      </AbsoluteFill>
    </Papel>
  );
};

const Escena: React.FC<{t: z.infer<typeof toma>; encabezado: string; numeral?: string}> = ({t, encabezado, numeral}) => {
  const f = useCurrentFrame();
  return (
    <Papel>
      <Ventana clip={t.clip} corte={t.corte} />
      <Encabezado texto={encabezado} />
      <div style={{position: 'absolute', top: 200, left: 90, right: 90, textAlign: 'center'}}>
        {numeral ? <Revela delay={4} lineas={[`${numeral}.`]} style={{fontFamily: serif, fontStyle: 'italic', fontSize: 64, color: colors.taupe}} /> : null}
        <Revela delay={numeral ? 9 : 6} lineas={t.titulo.split('\n')} style={{fontFamily: serif, fontSize: numeral ? 132 : 104, color: colors.ink, lineHeight: 1.02}} />
        <div style={{height: 22}} />
        <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 46, color: colors.taupe, opacity: aparece(f, 22)}}>{t.bajada}</div>
      </div>
      <Marco />
    </Papel>
  );
};

const Hoy: React.FC<{remate: string[]}> = ({remate}) => {
  const f = useCurrentFrame();
  return (
    <Papel>
      <Marco />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 100}}>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 52, color: colors.taupe, opacity: aparece(f, 2)}}>{remate[0]}</div>
        <div style={{height: 70}} />
        <Revela delay={18} lineas={remate.slice(1)} style={{fontFamily: serif, fontSize: 92, color: colors.ink, lineHeight: 1.08}} />
        <div style={{height: 10}} />
        <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 230, color: colors.ink, lineHeight: 1,
          opacity: aparece(f, 44, 26), transform: `translateY(${(1 - aparece(f, 44, 26)) * 30}px)`, letterSpacing: 2}}>
          hoy.
        </div>
        <div style={{height: 30}} />
        <Filete desde={62} ancho={180} />
      </AbsoluteFill>
    </Papel>
  );
};

export const ReelPrograma: React.FC<Props> = (p) => {
  const tr = linearTiming({durationInFrames: T, easing: Easing.inOut(Easing.sin)});
  const enc = `Programa ${p.programa.replace('\n', ' ')}`;
  const seq: React.ReactNode[] = [
    <Apertura key="a" programa={p.programa} temporada={p.temporada} />,
    ...p.escenas.map((e, i) => <Escena key={`e${i}`} t={e} encabezado="NekoBloom Studio" />),
    ...p.pasos.map((e, i) => <Escena key={`p${i}`} t={e} encabezado={enc} numeral={ROMANOS[i]} />),
    <Hoy key="h" remate={p.remate} />,
    <Placa key="z" />,
  ];
  const dur = [D.apertura, D.escena, D.escena, D.paso, D.paso, D.paso, D.paso, D.hoy, D.placa];
  return (
    <AbsoluteFill style={{background: colors.sand}}>
      <Fuentes />
      <TransitionSeries>
        {seq.flatMap((nodo, i) => [
          ...(i > 0 ? [<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={tr} />] : []),
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={dur[i]}>{nodo}</TransitionSeries.Sequence>,
        ])}
      </TransitionSeries>
      <Grano opacidad={0.05} />
    </AbsoluteFill>
  );
};
