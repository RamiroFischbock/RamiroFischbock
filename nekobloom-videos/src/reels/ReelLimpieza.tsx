import {z} from 'zod';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {colors, sans, serif} from '../brand';
import {Fondo} from '../components/Fondo';
import {Aparece} from '../components/Aparece';
import {Fuentes} from '../components/Fuentes';

export const reelLimpiezaSchema = z.object({
  tratamiento: z.string(),
  bajada: z.string(),
  pasos: z.array(z.object({titulo: z.string(), clips: z.array(z.string())})),
  resultado: z.object({clip: z.string(), texto: z.string()}),
  cierre: z.string(),
});

export const CLIP = 75; // 2,5 s por toma
const INTRO = 75;
const CIERRE = 105;
const FADE = 8;

export const duracionReelLimpieza = (p: z.infer<typeof reelLimpiezaSchema>) =>
  INTRO + (p.pasos.reduce((n, s) => n + s.clips.length, 0) + 1) * CLIP + CIERRE;

// Toma de video con zoom lento y fundido de entrada
const Toma: React.FC<{src: string}> = ({src}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [0, FADE], [0, 1], {extrapolateRight: 'clamp'})}}>
      <OffthreadVideo muted src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, CLIP], [1, 1.06])})`}} />
    </AbsoluteFill>
  );
};

const Rotulo: React.FC<{n?: number; texto: string}> = ({n, texto}) => (
  <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 90px 260px'}}>
    <AbsoluteFill style={{background: 'linear-gradient(transparent 60%, rgba(43,38,34,.6))'}} />
    {n !== undefined && (
      <Aparece><div style={{fontFamily: sans, fontWeight: 300, fontSize: 34, letterSpacing: 10, color: colors.blush}}>PASO 0{n}</div></Aparece>
    )}
    <Aparece delay={6}><div style={{fontFamily: serif, fontSize: 110, color: colors.cream, lineHeight: 1.05, marginTop: 12}}>{texto}</div></Aparece>
  </AbsoluteFill>
);

const Intro: React.FC<{tratamiento: string; bajada: string; clip: string}> = ({tratamiento, bajada, clip}) => (
  <AbsoluteFill>
    <Toma src={clip} />
    <AbsoluteFill style={{background: 'rgba(250,246,236,.72)', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 90}}>
      <Aparece><div style={{fontFamily: sans, fontWeight: 300, fontSize: 36, letterSpacing: 12, color: colors.rose}}>NEKOBLOOM STUDIO</div></Aparece>
      <Aparece delay={8}><div style={{fontFamily: serif, fontSize: 150, color: colors.ink, lineHeight: 1, marginTop: 40}}>{tratamiento}</div></Aparece>
      <Aparece delay={18}><div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 64, color: colors.rose, marginTop: 36}}>{bajada}</div></Aparece>
    </AbsoluteFill>
  </AbsoluteFill>
);

const Cierre: React.FC<{cierre: string}> = ({cierre}) => (
  <AbsoluteFill>
    <Fondo />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 80}}>
      <Aparece><div style={{fontFamily: serif, fontSize: 120, color: colors.ink, lineHeight: 1.05}}>{cierre}</div></Aparece>
      <Aparece delay={12}>
        <div style={{marginTop: 60, padding: '28px 70px', borderRadius: 100, background: colors.rose, color: colors.cream, fontFamily: sans, fontSize: 44, letterSpacing: 4}}>
          nekobloom.vercel.app
        </div>
      </Aparece>
      <Aparece delay={24}><div style={{fontFamily: sans, fontWeight: 300, fontSize: 40, color: colors.ink, marginTop: 70}}>@nekobloomstudio · Nordelta</div></Aparece>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const ReelLimpieza: React.FC<z.infer<typeof reelLimpiezaSchema>> = (p) => {
  let t = INTRO;
  const tomas = p.pasos.flatMap((paso, i) =>
    paso.clips.map((clip, j) => {
      const desde = t;
      t += CLIP;
      return (
        <Sequence key={clip} from={desde} durationInFrames={CLIP}>
          <Toma src={clip} />
          {j === 0 ? <Rotulo n={i + 1} texto={paso.titulo} /> : null}
        </Sequence>
      );
    }),
  );
  return (
    <AbsoluteFill style={{background: colors.ink}}>
      <Fuentes />
      <Sequence durationInFrames={INTRO}><Intro tratamiento={p.tratamiento} bajada={p.bajada} clip={p.pasos[0].clips[0]} /></Sequence>
      {tomas}
      <Sequence from={t} durationInFrames={CLIP}>
        <Toma src={p.resultado.clip} />
        <Rotulo texto={p.resultado.texto} />
      </Sequence>
      <Sequence from={t + CLIP}><Cierre cierre={p.cierre} /></Sequence>
    </AbsoluteFill>
  );
};
