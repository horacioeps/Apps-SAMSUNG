# Sesión: Bloqueo Mates como modo YouTube

**Fecha:** 2026-10-17 14:08 UTC  
**Usuario:** Horacio Pérez-Sánchez (horacioeps)  
**Agente:** Cursor (Cloud / Composer)

## Usuario

> pues puede ser modo tele dentro de youtube, que es la que mas consumen

## Agente

1. Aclarado: no se puede enganchar la YouTube **nativa**; el camino es YouTube **dentro** de Bloqueo Mates.
2. Actualizado `apps/bloqueo-mates/`:
   - IFrame API de YouTube a pantalla completa
   - Escudo de foco para que el mando no se lo coma el iframe
   - Al llegar a 0: pausa YouTube + mates; al acertar, reanuda + 15 min
   - `js/config.js` para `videoId` / `playlistId`
   - `config.xml` con privilegio internet + CSP YouTube
   - `?demo=1` para probar ciclos de 20 s en navegador
3. Docs de alcance y README actualizados.
4. Sesión + HISTORICO + push `main`.
