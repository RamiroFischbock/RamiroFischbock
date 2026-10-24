import {Config} from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? null);
// Con más pestañas en paralelo algunas se cuelgan cargando fuentes/imágenes
Config.setConcurrency(2);
Config.setDelayRenderTimeoutInMilliseconds(90000);
