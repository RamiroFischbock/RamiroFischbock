import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {fontFaceCss, fuentesCargar} from '../brand';

// Declara las fuentes locales y frena el render hasta que estén listas.
// El delayRender va dentro del componente: a nivel módulo colgaba algunas pestañas.
export const Fuentes: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.allSettled(fuentesCargar.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);
  return <style>{fontFaceCss}</style>;
};
