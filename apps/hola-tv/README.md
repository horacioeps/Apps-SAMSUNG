# Hola TV

App Tizen mínima para la **Samsung QE43Q60AAU (Q60A, 2021)**.

## Contenido

| Archivo | Rol |
|---------|-----|
| `config.xml` | Manifiesto Tizen (perfil `tv-samsung`) |
| `index.html` | Pantalla principal |
| `css/style.css` | Estilos 1080p / TV |
| `js/main.js` | Teclado / mando básico |
| `icon.png` | Icono (placeholder; regenerar en Tizen Studio si hace falta) |

## Empaquetar e instalar (en el Mac con Tizen Studio)

1. Abrir este proyecto en Tizen Studio o empaquetar con CLI.
2. Firmar el `.wgt` con el certificado de desarrollo.
3. TV en Developer Mode con la IP del Mac.
4. Instalar por red (`sdb` / Device Manager).

Detalle de la TV: [docs/tv-qe43q60aau.md](../../docs/tv-qe43q60aau.md).

## Probar en navegador

Abre `index.html` en el navegador del Mac para revisar layout y teclas de flecha. Las APIs `tizen.*` solo existen en la TV.
