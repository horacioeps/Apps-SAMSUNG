# Bloqueo Mates (YouTube libre)

YouTube **libre** (buscan lo que quieran) + cada 15 min una **multiplicación de 1 cifra** + menú padres con **PIN 0350**.

No controla la app YouTube nativa del Smart Hub. Alcance: [docs/bloqueo-mates-alcance.md](../../docs/bloqueo-mates-alcance.md).

## Uso

| Quién | Qué hace |
|-------|----------|
| Niños | Teclado en pantalla → buscar → ver vídeo |
| Cada 15 min | YouTube se pausa; hay que acertar `a × b` (1–9) |
| Padres | Tecla **amarilla** del mando → PIN `0350` |

Menú padres: volver, ir a buscar, saltar reto, salir de la app.

## Config

`js/config.js`:

- `parentPin`: `"0350"`
- `sessionSeconds`: `15 * 60`
- `youtubeApiKey`: opcional (si vacío, busca vía Piped)
- `pipedInstances`: mirrors de búsqueda sin clave Google

## Demo en el Mac

Abre `index.html` (hace falta red). Ciclo corto: `index.html?demo=1`.

## Instalar en la TV

Paso a paso Mac + Q60A: [docs/como-instalar.md](../../docs/como-instalar.md).
