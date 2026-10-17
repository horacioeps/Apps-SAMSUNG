# Cómo instalar Bloqueo Mates en la QE43Q60AAU

Guía práctica desde el **Mac** (misma Wi‑Fi que la tele).

> **Importante:** con Developer Mode la app **se borra al apagar** la TV. Es el camino para probar ya. Permanente = [instalacion-permanente.md](instalacion-permanente.md).

## 0. Requisitos

- Mac y TV en la **misma red Wi‑Fi**
- Cuenta en [Samsung Developers](https://developer.samsung.com/)
- Repo clonado (esta carpeta), app en `apps/bloqueo-mates/`

## 1. Instalar herramientas en el Mac

1. Descarga e instala **Tizen Studio**:  
   https://developer.tizen.org/development/tizen-studio/download
2. Abre **Package Manager** e instala:
   - **Samsung TV Extensions** (versión cercana a tu Tizen; la Q60A 2021 suele ir bien con extensiones 6.x / recientes)
   - **Samsung Certificate Extension**
3. Guía oficial: [Installing TV SDK](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html)

Anota la ruta típica:

```text
~/tizen-studio
```

## 2. Activar Developer Mode en la TV

1. Mando → **Smart Hub** → panel **Apps**
2. Ve a **App Settings** (ajustes de aplicaciones)
3. Con el mando escribe **`12345`**
4. **Developer mode = On**
5. Introduce la **IP local del Mac** (en el Mac: Ajustes → Red → Wi‑Fi → Detalles, o `ipconfig getifaddr en0` en Terminal)
6. **Reinicia la TV**
7. Al volver a Apps debe verse algo como **Develop Mode** arriba

Si la TV tiene *Samsung Instant On*, a veces hace falta desenchufar y enchufar para un reinicio completo.

## 3. Certificado Samsung (obligatorio)

1. Tizen Studio → **Tools → Certificate Manager**
2. **+** → tipo **Samsung** → **TV**
3. Crea (o importa) **Author certificate** (con tu cuenta Samsung Developers)
4. Crea **Distributor certificate** e incluye el **DUID** de tu tele:
   - En la TV: menú de soporte / Contact Samsung / **Unique Device ID**,  
     o conéctala primero en Device Manager y pulsa **+** junto al dispositivo
5. Deja ese perfil de certificado como **activo**

Guía: [Creating Certificates](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html)

## 4. Conectar Mac ↔ TV

### Con Device Manager (GUI)

1. Tizen Studio → **Tools → Device Manager**
2. **Remote Device Manager** → **+**
3. Nombre libre, IP de la TV, puerto **26101**
4. Conexión **On**

### Con Terminal (CLI)

```bash
# IP de la TV (la ves en Ajustes de red de la tele)
~/tizen-studio/tools/sdb connect IP_DE_LA_TV:26101
~/tizen-studio/tools/sdb devices
```

Si pide permiso de instalación:

```bash
~/tizen-studio/tools/ide/bin/tizen install-permit -s SERIAL_QUE_SALGA
```

O en Device Manager: clic derecho en el dispositivo → **Permit to install applications**.

## 5. Empaquetar Bloqueo Mates (`.wgt`)

### Opción A — Importar en Tizen Studio

1. **File → Import → Tizen → Tizen Project** (o New Web Project y sustituir ficheros)
2. Usa el contenido de `apps/bloqueo-mates/` (`config.xml`, `index.html`, `css/`, `js/`, `icon.png`)
3. Perfil: **tv-samsung**
4. **Project → Build Signed Package** (o clic derecho → Build Signed Package)
5. Se genera un `.wgt` firmado con tu certificado activo

### Opción B — CLI (si ya tienes el proyecto en un workspace Tizen)

```bash
cd /ruta/al/proyecto-tizen-bloqueo-mates
~/tizen-studio/tools/ide/bin/tizen package -t wgt -s NOMBRE_PERFIL_CERTIFICADO -- .
```

El `.wgt` suele quedar en la carpeta del proyecto.

## 6. Instalar en la TV

Device Manager: clic derecho en la TV → **Install app** → elige el `.wgt`.

O CLI:

```bash
~/tizen-studio/tools/ide/bin/tizen install -s SERIAL -- ./BloqueoMates.wgt
```

(Ajusta el nombre del `.wgt` y el `SERIAL` de `sdb devices`.)

## 7. Abrir la app

1. En la TV, panel **Apps**
2. Busca **Bloqueo Mates**
3. Ábrela (no abras el icono YouTube de Samsung)
4. Busca vídeos con el teclado en pantalla
5. Cada 15 min: multiplicación 1 cifra
6. Tecla **amarilla** → PIN **0350** (padres)

Prueba rápida de ciclo: en desarrollo puedes poner `sessionSeconds: 20` en `js/config.js`, volver a empaquetar e instalar.

## Si falla

| Síntoma | Qué mirar |
|---------|-----------|
| No conecta | Misma Wi‑Fi, Developer Mode On, IP del Mac correcta, reinicio TV |
| Error 1010 / install fail | Certificado, DUID de **esta** tele, Permit to install |
| Error 205 | Perfil de certificado; crea uno nuevo Samsung TV |
| YouTube no carga | Internet en la TV; privilegio `internet` ya está en `config.xml` |
| Se borró al apagar | Normal en Developer Mode → ver permanente |

## Siguiente paso (permanente)

Cuando quieras que **no** se borre al apagar: [instalacion-permanente.md](instalacion-permanente.md) (Seller Office / partnership España).
