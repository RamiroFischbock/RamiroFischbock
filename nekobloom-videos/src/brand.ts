import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Paleta y tipografías tomadas de nekobloom.vercel.app
export const colors = {
  cream: '#faf6ec',
  sand: '#f5efe0',
  beige: '#e6dcc8',
  rose: '#d9a4a0',
  blush: '#e8c5c0',
  ink: '#2b2622',
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
for (const [family, file, weight, style] of fuentes) {
  loadFont({family, url: staticFile(`fonts/${file}.woff2`), weight, style});
}

export const VERTICAL = {width: 1080, height: 1920, fps: 30};
