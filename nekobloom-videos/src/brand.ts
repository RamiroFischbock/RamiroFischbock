import {staticFile} from 'remotion';

// Paleta y tipografías tomadas de nekobloom.vercel.app
export const colors = {
  cream: '#faf6ec',
  sand: '#f5efe0',
  beige: '#e6dcc8',
  rose: '#d9a4a0',
  blush: '#e8c5c0',
  ink: '#2b2622',
  taupe: '#a8916c',
};

export const serif = 'Cormorant Garamond';
export const sans = 'Inter';

// Fuentes locales (public/fonts): el render no depende de Google Fonts
const fuentes: [string, string, string, string][] = [
  [serif, 'cormorant-garamond-latin-400-normal', '400', 'normal'],
  [serif, 'cormorant-garamond-latin-500-normal', '500', 'normal'],
  [serif, 'cormorant-garamond-latin-400-italic', '400', 'italic'],
  [sans, 'inter-latin-300-normal', '300', 'normal'],
  [sans, 'inter-latin-400-normal', '400', 'normal'],
];
// CSS @font-face para inyectar en cada composición (ver components/Fuentes.tsx)
export const fontFaceCss = fuentes
  .map(([family, file, weight, style]) =>
    `@font-face{font-family:'${family}';src:url(${staticFile(`fonts/${file}.woff2`)}) format('woff2');font-weight:${weight};font-style:${style};font-display:block}`,
  )
  .join('\n');

export const fuentesCargar = fuentes.map(([family, , weight, style]) => `${style} ${weight} 40px '${family}'`);

export const VERTICAL = {width: 1080, height: 1920, fps: 30};
