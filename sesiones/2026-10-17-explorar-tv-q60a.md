# Sesión: explorar apps en Samsung QE43Q60AAU

**Fecha:** 2026-10-17 14:04 UTC  
**Usuario:** Horacio Pérez-Sánchez (horacioeps)  
**Agente:** Cursor (Cloud / Composer)

## Usuario

> quiero explorar esto en este proyecto, hacer apps para mi tele samgung, sale aqui el modelo?
>
> (Adjunta resumen: Modelo Samsung QE43Q60AAU / Q60A, 2021, Tizen; HTML5/CSS/JS; sideload con Tizen Studio; apps de desarrollo se desinstalan al apagar; pregunta sobre instalación permanente.)

## Agente

1. Revisado el repo: estaba vacío de contenido de TV; el modelo **no** aparecía aún (solo README genérico + HISTORICO de creación del repo).
2. Documentada la TV en `docs/tv-qe43q60aau.md`.
3. Creado scaffold Tizen `apps/hola-tv/` (`config.xml`, HTML/CSS/JS, icono, README).
4. Actualizado `README.md` con el modelo QE43Q60AAU y enlace a la ficha.
5. Sesión + fila en `HISTORICO.md` + push a `main`.

## Respuesta clave

- **¿Sale el modelo aquí?** Antes de este turno: no. Ahora sí, en README y `docs/tv-qe43q60aau.md`.
- **¿Puedes hacer apps para esa TV?** Sí, web apps Tizen (`.wgt`), no APK Android.
- **Permanencia:** el sideload de desarrollo suele borrarse al apagar; instalación permanente es otro procedimiento.
