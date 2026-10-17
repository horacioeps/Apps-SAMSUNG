# Bloqueo Mates — alcance y límites

Primera app del proyecto. Los niños consumen sobre todo **YouTube**.

## Decisión de producto

**Modo tele = YouTube dentro de Bloqueo Mates**, no la app YouTube del Smart Hub.

Así podemos pausar el vídeo, mostrar mates y reanudar. Si abren la YouTube nativa del menú, **esta app no los controla**.

## Lo que Tizen permite y lo que no

| Capacidad | ¿En Q60A? |
|-----------|-----------|
| YouTube embebido (IFrame API) + timer + mates + mando | Sí, en nuestra app |
| Pausar ese YouTube al llegar a 0:00 | Sí |
| Overlay / corte sobre la app YouTube nativa | **No** |
| Bloquear Netflix / TDT del sistema | **No** |

## Flujo actual (MVP)

1. Abres **Bloqueo Mates** (no el icono YouTube de Samsung).
2. Suena/reproduce YouTube a pantalla casi completa.
3. Cada 15 minutos: pausa + problema de mates.
4. Respuesta correcta con el mando → YouTube sigue otros 15 minutos.
5. Lista o vídeo configurables en `apps/bloqueo-mates/js/config.js`.

## Cómo “hacer que usen esta” y no la YouTube nativa

- Poner Bloqueo Mates en favoritos / carpeta fácil del Smart Hub.
- Opcional más adelante: PIN parental en la app; o restricciones del propio Samsung Kids / cuentas.
- No hay API oficial para desactivar la YouTube del sistema desde nuestra app.

## Permanente

Misma historia que el resto: sideload de desarrollo se borra al apagar; instalación fija vía Seller Office. Ver [instalacion-permanente.md](instalacion-permanente.md).

## Estado en el repo

App: [`apps/bloqueo-mates/`](../apps/bloqueo-mates/) — YouTube embebido + timer + mates.
