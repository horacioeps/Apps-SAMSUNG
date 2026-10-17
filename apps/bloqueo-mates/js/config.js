// Configuración — editar antes de empaquetar si hace falta.
window.BloqueoMatesConfig = {
  // Segundos de YouTube entre cada reto de mates.
  sessionSeconds: 15 * 60,

  // PIN del menú de padres (mando).
  parentPin: "0350",

  // Opcional: clave YouTube Data API v3 (si está vacía se usa búsqueda Piped, sin clave).
  youtubeApiKey: "",

  // Instancias Piped para buscar vídeos sin API key de Google (se prueba en orden).
  pipedInstances: [
    "https://pipedapi.kavin.rocks",
    "https://pipedapi.adminforge.de",
    "https://pipedapi.reallyaweso.me",
  ],
};
