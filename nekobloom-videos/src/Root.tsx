import {Composition} from 'remotion';
import {VERTICAL} from './brand';
import {ReelServicios, reelServiciosSchema} from './reels/ReelServicios';

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
  </>
);
