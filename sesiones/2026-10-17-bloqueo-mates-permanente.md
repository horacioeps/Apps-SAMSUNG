# Sesión: instalación permanente + primera app Bloqueo Mates

**Fecha:** 2026-10-17 14:06 UTC  
**Usuario:** Horacio Pérez-Sánchez (horacioeps)  
**Agente:** Cursor (Cloud / Composer)

## Usuario

1. > permanente  
   (respuesta a si quiere apps permanentes en la TV)

2. > y esta es la primera app  
   (adjunta captura: app que bloquea cada 15 min con un problema de mates; análisis de límites Tizen vs Android TV / HDMI)

## Agente

1. Documentado camino permanente oficial:
   - `docs/instalacion-permanente.md`
   - Tizen Studio ≠ permanente
   - Permanente real ≈ Samsung Apps TV Seller Office (Public Seller solo EE.UU.; Partner para España)
   - USB Demo Packaging (partner, `.tmg`, suele caducar)

2. Documentado alcance de la 1ª app:
   - `docs/bloqueo-mates-alcance.md`
   - No overlay sobre Netflix/YouTube; JS en background no sirve para cortar otras apps

3. Creado scaffold `apps/bloqueo-mates/`:
   - Temporizador 15 min → bloqueo mates → dígitos + OK del mando
   - Acierta → +15 min

4. Actualizado README + ficha TV; sesión + HISTORICO; push `main`.

## Pendiente de Horacio (producto)

¿Los niños miran sobre todo YouTube/Netflix (hace falta hardware HDMI) o aceptan visionado dentro de esta app Tizen (MVP viable)?
