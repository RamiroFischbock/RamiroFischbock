import {z} from 'zod';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {colors, sans, serif} from '../brand';
import {Fondo} from '../components/Fondo';
import {Aparece} from '../components/Aparece';

export const reelServiciosSchema = z.object({
  titulo: z.string(),
  subtitulo: z.string(),
  servicios: z.array(z.object({nombre: z.string(), detalle: z.string()})),
  cierre: z.string(),
});

const SEG = 90; // 3 s por escena

const Intro: React.FC<{titulo: string; subtitulo: string}> = ({titulo, subtitulo}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: 100, textAlign: 'center'}}>
    <Aparece><Img src={staticFile('logo.png')} style={{width: 380, borderRadius: '50%'}} /></Aparece>
    <Aparece delay={15}>
      <div style={{fontFamily: serif, fontSize: 88, color: colors.ink, marginTop: 80, lineHeight: 1.1}}>{titulo}</div>
    </Aparece>
    <Aparece delay={30}>
      <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 80, color: colors.rose, marginTop: 20}}>{subtitulo}</div>
    </Aparece>
  </AbsoluteFill>
);

const Servicio: React.FC<{n: number; nombre: string; detalle: string}> = ({n, nombre, detalle}) => (
  <AbsoluteFill style={{justifyContent: 'center', padding: 110}}>
    <Aparece><div style={{fontFamily: sans, fontWeight: 300, fontSize: 36, letterSpacing: 10, color: colors.rose}}>0{n} — TRATAMIENTO</div></Aparece>
    <Aparece delay={8}><div style={{fontFamily: serif, fontSize: 130, color: colors.ink, lineHeight: 1, marginTop: 40}}>{nombre}</div></Aparece>
    <Aparece delay={16}><div style={{width: 160, height: 2, background: colors.rose, margin: '60px 0'}} /></Aparece>
    <Aparece delay={22}><div style={{fontFamily: sans, fontWeight: 300, fontSize: 48, color: colors.ink}}>{detalle}</div></Aparece>
  </AbsoluteFill>
);

const Flor: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img src={staticFile('flor.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, SEG], [1.05, 1.15])})`}} />
      <AbsoluteFill style={{background: 'linear-gradient(transparent 55%, rgba(43,38,34,.75))'}} />
      <AbsoluteFill style={{justifyContent: 'flex-end', padding: 110}}>
        <Aparece delay={10}><div style={{fontFamily: serif, fontSize: 96, color: colors.cream}}>Florencia Zanlongo</div></Aparece>
        <Aparece delay={20}><div style={{fontFamily: sans, fontWeight: 300, fontSize: 40, color: colors.blush, letterSpacing: 6, marginTop: 10}}>DERMATOCOSMIATRA</div></Aparece>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cierre: React.FC<{cierre: string}> = ({cierre}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
    <Aparece><div style={{fontFamily: serif, fontSize: 120, color: colors.ink}}>{cierre}</div></Aparece>
    <Aparece delay={12}>
      <div style={{marginTop: 60, padding: '28px 70px', borderRadius: 100, background: colors.rose, color: colors.cream, fontFamily: sans, fontSize: 44, letterSpacing: 4}}>
        nekobloom.vercel.app
      </div>
    </Aparece>
    <Aparece delay={24}><div style={{fontFamily: sans, fontWeight: 300, fontSize: 40, color: colors.ink, marginTop: 70}}>@nekobloomstudio · Nordelta</div></Aparece>
  </AbsoluteFill>
);

export const ReelServicios: React.FC<z.infer<typeof reelServiciosSchema>> = ({titulo, subtitulo, servicios, cierre}) => (
  <AbsoluteFill>
    <Fondo />
    <Sequence durationInFrames={SEG}><Intro titulo={titulo} subtitulo={subtitulo} /></Sequence>
    {servicios.map((s, i) => (
      <Sequence key={s.nombre} from={SEG * (i + 1)} durationInFrames={SEG}>
        <Servicio n={i + 1} {...s} />
      </Sequence>
    ))}
    <Sequence from={SEG * (servicios.length + 1)} durationInFrames={SEG}><Flor /></Sequence>
    <Sequence from={SEG * (servicios.length + 2)}><Cierre cierre={cierre} /></Sequence>
  </AbsoluteFill>
);
