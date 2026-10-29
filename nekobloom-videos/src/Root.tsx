import {Composition} from 'remotion';
import {VERTICAL} from './brand';
import {ReelServicios, reelServiciosSchema} from './reels/ReelServicios';
import {DURACION_ESTETICO, ReelEstetico, reelEsteticoSchema} from './reels/ReelEstetico';
import {duracionReelLimpieza, ReelLimpieza, reelLimpiezaSchema} from './reels/ReelLimpieza';

export const Root: React.FC = () => (
  <>
    <Composition
      id="ReelServicios"
      component={ReelServicios}
      durationInFrames={18 * VERTICAL.fps}
      {...VERTICAL}
      schema={reelServiciosSchema}
      defaultProps={{
        titulo: 'Atenderte es un privilegio,',
        subtitulo: 'elegir calidad también lo es.',
        servicios: [
          {nombre: 'Glass Skin Ritual', detalle: 'Dermaplaning + limpieza profunda'},
          {nombre: 'Japanese Lift Ritual', detalle: 'Masaje facial Kobido'},
          {nombre: 'Cellular Repair Therapy', detalle: 'Microneedling con exosomas o PDRN'},
        ],
        cierre: 'Reservá tu turno',
      }}
    />
    <Composition
      id="ReelLimpieza"
      component={ReelLimpieza}
      durationInFrames={1}
      calculateMetadata={({props}) => ({durationInFrames: duracionReelLimpieza(props)})}
      {...VERTICAL}
      schema={reelLimpiezaSchema}
      defaultProps={{
        tratamiento: 'Deep Skin Reset',
        bajada: 'limpieza facial profunda',
        pasos: [
          {titulo: 'Limpieza y máscara', clips: ['clips/clip1.mp4', 'clips/clip2.mp4']},
          {titulo: 'Extracción', clips: ['clips/clip3.mp4', 'clips/clip4.mp4']},
          {titulo: 'Ice globes', clips: ['clips/clip5.mp4', 'clips/clip6.mp4']},
          {titulo: 'Masaje final', clips: ['clips/clip7.mp4', 'clips/clip8.mp4']},
        ],
        resultado: {clip: 'clips/clip9.mp4', texto: 'Piel renovada'},
        cierre: 'Reservá tu turno',
      }}
    />
    <Composition
      id="ReelEstetico"
      component={ReelEstetico}
      durationInFrames={DURACION_ESTETICO}
      {...VERTICAL}
      schema={reelEsteticoSchema}
      defaultProps={{
        invitada: 'Ekaterina Ojeda',
        hook: 'UN DÍA EN NEKOBLOOM CON',
        tratamiento: 'Deep Skin Reset',
        paneles: ['clips/clip2.mp4', 'clips/clip11.mp4', 'clips/clip5.mp4'],
        pasos: [
          {titulo: 'Limpieza profunda', clip: 'clips/clip1.mp4'},
          {titulo: 'Extracción', clip: 'clips/clip4.mp4'},
          {titulo: 'Tecnología', clip: 'clips/clip12.mp4'},
          {titulo: 'Ice globes', clip: 'clips/clip6.mp4'},
          {titulo: 'Masaje facial', clip: 'clips/clip10.mp4'},
        ],
        carrusel: ['clips/clip13.mp4', 'clips/clip8.mp4', 'clips/clip9.mp4', 'clips/clip7.mp4', 'clips/clip3.mp4', 'clips/clip11.mp4'],
        fraseFinal: 'Piel que\nrespira',
        cierre: 'Tu momento',
      }}
    />
  </>
);
