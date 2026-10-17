# Instalación permanente en Samsung Tizen TV

Objetivo: que la app **no se borre al apagar** la QE43Q60AAU.

## Qué no sirve para permanente

| Método | ¿Permanente? | Notas |
|--------|--------------|--------|
| Tizen Studio / `sdb` + Developer Mode | **No** | Samsung lo desinstala al apagar o al desconectar el entorno de desarrollo. Comportamiento intencional. |
| Copiar un `.wgt` por USB | **No** | Bloqueado por seguridad. |

Fuentes: [Application Testing Q&A](https://developer.samsung.com/smarttv/develop/faq/application-testing.html), [Application Installation Q&A](https://developer.samsung.com/smarttv/develop/faq/application-installation.html).

## Caminos reales hacia algo que aguante el apagado

### A) Publicar en Samsung Apps TV (la vía “como Netflix”)

1. Cuenta Samsung → registro en [Samsung Apps TV Seller Office](https://seller.samsungapps.com/tv/).
2. Al empezar eres **Public Seller**: publicación solo en **Estados Unidos**.
3. Para España / más países hace falta **Partner Seller** (contrato con Samsung + Content Manager).
4. Subes el `.wgt`, pasas pre-test, certificación Samsung y, si aprueban, la app queda en Apps de la TV (instalación normal, permanente).

Esto es el único camino oficial de consumidor para una app que se comporta como una app de la tienda.

### B) USB Demo Packaging (`.tmg` + `.license`) — partner

- Herramienta en Seller Office: **USB Demo Packaging Tool** (suele exigir cuenta partner).
- Genera `.tmg` + `.license` → carpeta `userwidget/` en la raíz de un USB → la TV instala al insertarlo.
- Sirve para demos / pruebas más largas que Developer Mode, pero **no es “para siempre”**: las firmas de demo suelen caducar (p. ej. ~30 días) y hay que regenerar.
- No se puede instalar un `.wgt` crudo por USB.

### C) Alpha / Beta (partners)

Partners pueden distribuir builds alpha/beta a TVs de desarrollador vía Seller Office. Más estable que Tizen Studio, pero sigue siendo canal de prueba, no “app personal invisible en la tienda”.

## Resumen práctico para este repo

| Quieres… | Camino |
|----------|--------|
| Probar ya en la tele (aceptas reinstalar) | Developer Mode + Tizen Studio |
| App fija en tu tele, como YouTube | Seller Office + certificación (y partnership si España) |
| Demo USB sin publicar | Partner + USB Demo Packaging (caduca) |

**No hay un interruptor oficial de “instalar solo en mi TV para siempre sin Samsung”.** La plataforma está cerrada a propósito.

## Relación con la primera app (Bloqueo Mates)

Aunque consigas instalación permanente, una app Tizen **no puede** poner un overlay encima de Netflix/YouTube ni bloquear todo el sistema. Ver [apps/bloqueo-mates/](../apps/bloqueo-mates/).
