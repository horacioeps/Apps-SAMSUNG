# Bloqueo Mates

Primera app del repo. Temporizador de **15 minutos** → pantalla de **mates** → desbloqueo con el mando.

## Importante

Esta app **solo controla su propia UI**. No puede tapar Netflix, YouTube ni la TDT del sistema. Detalle: [docs/bloqueo-mates-alcance.md](../../docs/bloqueo-mates-alcance.md).

Instalación permanente (no Tizen Studio): [docs/instalacion-permanente.md](../../docs/instalacion-permanente.md).

## Uso

1. Al abrir: cuenta atrás 15:00.
2. Al llegar a 0: bloqueo con suma/resta.
3. Dígitos del mando + OK para enviar.
4. Acierta → otros 15 minutos. Falla → nuevo problema.
5. En visionado, OK reinicia el ciclo.

## Probar en el Mac

Abre `index.html` en el navegador. Acorta el tiempo editando `SESSION_SECONDS` en `js/main.js` (p. ej. `20` para 20 segundos).

## Empaquetar

Misma vía Tizen que `hola-tv`: certificado Samsung → `.wgt` → TV en Developer Mode (prueba) o Seller Office (permanente).
