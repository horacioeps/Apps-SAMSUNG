# Bloqueo Mates — alcance y límites

Primera app del proyecto. Idea: cada 15 minutos interrumpir el visionado y pedir un problema de matemáticas; con la respuesta correcta (mando) se desbloquean otros 15 minutos.

## Lo que Tizen permite y lo que no

| Capacidad | ¿En Q60A con app Tizen? |
|-----------|-------------------------|
| Temporizador + pantalla de mates + teclado numérico del mando | Sí, **dentro de nuestra app** |
| Overlay encima de Netflix / YouTube / TDT | **No** |
| Seguir ejecutando JS en segundo plano cuando cambias de app | En la práctica **no** (la app se pausa) |
| Bloquear el televisor entero | **No** |

Conclusión: en Tizen nativo, “Bloqueo Mates” es viable como **sala de visionado propia** (el contenido vive dentro de la app), no como control parental del sistema.

## Estrategias

### 1) MVP en la TV Samsung (este repo) — recomendado para empezar

App Tizen permanente (vía Seller Office cuando toque) que:

- Arranca un temporizador de 15 minutos.
- Al cumplirse, bloquea la UI y muestra un problema de mates.
- El niño responde con el mando (dígitos + OK).
- Si acierta → otros 15 minutos; si falla → nuevo problema.
- Fase 2: embeber o enlazar solo contenido que controlemos (vídeo local, lista propia, webview limitado).

Útil si los niños usan **esta app** como “modo tele”. Inútil si saltan a Netflix nativo.

### 2) Hardware externo (si miran Netflix/YouTube/TDT)

- Caja Android TV / dispositivo HDMI con app de control parental, o
- Reproductor HDMI propio con el mismo ciclo de mates.

Más trabajo y coste; único camino creíble para cortar streaming de terceros.

### 3) Wi‑Fi / macros desde Mac o Raspberry Pi

Puede intentar apagar o cambiar de entrada; **no es un bloqueo seguro** (se esquiva fácil).

## Decisión pendiente (producto)

¿Los niños miran sobre todo **YouTube/Netflix** o también **TDT**?

- Solo contenido dentro de nuestra app → seguimos con Tizen MVP.
- Streaming / TDT del sistema → planificar dispositivo HDMI además (o en lugar) de la app Tizen.

## Estado en el repo

Scaffold: [`apps/bloqueo-mates/`](../apps/bloqueo-mates/) — temporizador + mates + mando, listo para empaquetar `.wgt`.
