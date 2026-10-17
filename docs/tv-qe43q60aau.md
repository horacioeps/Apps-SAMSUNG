# Televisión objetivo: Samsung QE43Q60AAU

Modelo documentado a partir de la exploración de Horacio (2026-10-17).

| Campo | Valor |
|-------|--------|
| Modelo comercial | Samsung QE43Q60AAU (serie Q60A) |
| Año | 2021 |
| Sistema | Samsung Tizen |
| Stack de apps | HTML5, CSS, JavaScript |
| Apps Android (APK) | No |
| Modificar el SO | No |

## ¿Se pueden instalar apps propias?

Sí. Se pueden desarrollar e instalar aplicaciones web empaquetadas (`.wgt`) firmadas, incluso sin publicarlas en la tienda Samsung Apps, para uso en la propia TV.

### Tipos de app viables

- Reproductor multimedia personalizado
- Dashboard con datos en tiempo real
- Clientes de APIs propias
- Juegos HTML5 / JavaScript
- Control con el mando (teclas / foco espacial)

### Limitación importante (sideload de desarrollo)

Las apps instaladas vía Tizen Studio / CLI en modo desarrollador suelen **desinstalarse al apagar la TV** o al salir del entorno de desarrollo. Una instalación permanente implica más requisitos (certificados, políticas Samsung, o publicación).

## Flujo desde el Mac (resumen)

1. Instalar **Tizen Studio** + extensión Samsung TV.
2. En la TV: Apps → ajustes de aplicaciones → marcar `12345` → activar **Developer Mode**.
3. Introducir la IP local del Mac y reiniciar la TV.
4. Crear la app (p. ej. con Cursor), empaquetar `.wgt` firmado.
5. Instalar por red con Tizen Studio o `tizen` / `sdb` CLI.

## En este repo

Scaffold de prueba: [`apps/hola-tv/`](../apps/hola-tv/).
