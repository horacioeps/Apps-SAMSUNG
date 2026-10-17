# Bloqueo Mates (YouTube dentro)

Modo tele para la Q60A: **YouTube embebido** + pausa cada 15 minutos con un problema de mates.

No controla la app YouTube nativa del Smart Hub. Alcance: [docs/bloqueo-mates-alcance.md](../../docs/bloqueo-mates-alcance.md).

## Configurar qué ven

Edita `js/config.js`:

```js
videoId: "xxxxxxxxxxx",   // un vídeo
playlistId: "PLxxxxxxx",  // o una lista (manda sobre videoId si no está vacío)
sessionSeconds: 15 * 60,
```

## Uso en la TV

| Momento | Mando |
|---------|--------|
| Visionado | OK = play/pausa |
| Bloqueo | 0–9 = dígitos, OK = enviar, Atrás = borrar |

## Probar en el Mac

Abre `index.html` en el navegador (hace falta red).  
Para un ciclo corto: `index.html?demo=1` (20 segundos).

## Empaquetar

Privilegio `internet` + CSP para YouTube ya van en `config.xml`. Firmar `.wgt` con certificado Samsung y instalar (prueba: Developer Mode; permanente: Seller Office).
