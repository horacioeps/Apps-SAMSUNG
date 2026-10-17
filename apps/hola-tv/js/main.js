(function () {
  var statusEl = document.getElementById("status");
  var keys = {
    ArrowUp: "Arriba",
    ArrowDown: "Abajo",
    ArrowLeft: "Izquierda",
    ArrowRight: "Derecha",
    Enter: "OK",
    Escape: "Atrás / Escape",
  };

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  document.addEventListener("keydown", function (event) {
    var label = keys[event.key];
    if (!label) return;
    event.preventDefault();
    setStatus("Tecla: " + label + " (" + event.keyCode + ")");
  });

  if (statusEl) statusEl.focus();

  // Tizen: salir con la tecla Return del mando si la API está disponible.
  document.addEventListener("keydown", function (event) {
    if (event.keyName === "XF86Back" || event.keyCode === 10009) {
      try {
        if (window.tizen && tizen.application) {
          tizen.application.getCurrentApplication().exit();
        }
      } catch (err) {
        setStatus("Salida Tizen no disponible en navegador.");
      }
    }
  });
})();
