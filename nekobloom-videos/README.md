# NekoBloom Studio · videos (Remotion)

Reels e historias verticales (1080x1920, 30 fps) para @nekobloomstudio.
Marca en `src/brand.ts` (paleta y fuentes de nekobloom.vercel.app), assets en `public/`.

```
npm i
npm run studio                      # editar/previsualizar
npx remotion render ReelServicios out/reel-servicios.mp4
```

Composiciones:
- `ReelServicios` (18 s): intro con logo → 3 tratamientos → Flor → CTA reserva.
- `ReelLimpieza` (~28 s): intro → pasos del tratamiento con tomas reales → resultado → CTA.
  Los clips (`public/clips/`) no se versionan: salen de los .mov del iPhone (HDR HLG)
  convertidos a SDR 1080x1920 con ffmpeg (`zscale` + `tonemap=hable:desat=2`).
