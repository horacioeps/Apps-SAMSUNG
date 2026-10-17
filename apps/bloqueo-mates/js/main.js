(function () {
  var cfg = window.BloqueoMatesConfig || {};
  var SESSION_SECONDS = cfg.sessionSeconds || 15 * 60;
  var MAX_ANSWER_LEN = 4;

  // Demo rápido en navegador: index.html?demo=1 → 20 s
  if (/[?&]demo=1\b/.test(location.search)) {
    SESSION_SECONDS = 20;
  }

  var viewWatch = document.getElementById("view-watch");
  var viewLock = document.getElementById("view-lock");
  var countdownEl = document.getElementById("countdown");
  var statusEl = document.getElementById("player-status");
  var problemEl = document.getElementById("problem");
  var answerEl = document.getElementById("answer");
  var feedbackEl = document.getElementById("feedback");
  var shield = document.getElementById("focus-shield");

  var mode = "watch"; // watch | lock
  var remaining = SESSION_SECONDS;
  var tickId = null;
  var expected = 0;
  var answer = "";
  var player = null;
  var playerReady = false;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function formatTime(total) {
    return pad(Math.floor(total / 60)) + ":" + pad(total % 60);
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function setFeedback(text, kind) {
    feedbackEl.textContent = text || "";
    feedbackEl.classList.remove("is-bad", "is-good");
    if (kind) feedbackEl.classList.add(kind);
  }

  function pauseYoutube() {
    try {
      if (player && playerReady && player.pauseVideo) player.pauseVideo();
    } catch (e) {}
  }

  function playYoutube() {
    try {
      if (player && playerReady && player.playVideo) player.playVideo();
    } catch (e) {}
  }

  function toggleYoutube() {
    if (!player || !playerReady || !player.getPlayerState) return;
    try {
      var state = player.getPlayerState();
      // 1 = playing
      if (state === 1) {
        player.pauseVideo();
        setStatus("YouTube en pausa");
      } else {
        player.playVideo();
        setStatus("Reproduciendo YouTube");
      }
    } catch (e) {}
  }

  function showWatch() {
    mode = "watch";
    viewLock.hidden = true;
    viewLock.classList.remove("is-active");
    viewWatch.hidden = false;
    viewWatch.classList.add("is-active");
    answer = "";
    setFeedback("");
    if (shield) shield.focus();
    playYoutube();
  }

  function showLock() {
    mode = "lock";
    pauseYoutube();
    viewWatch.classList.remove("is-active");
    viewLock.hidden = false;
    viewLock.classList.add("is-active");
    nextProblem();
  }

  function nextProblem() {
    var a = 2 + Math.floor(Math.random() * 12);
    var b = 2 + Math.floor(Math.random() * 12);
    var op = Math.random() < 0.55 ? "+" : "-";
    if (op === "-" && b > a) {
      var tmp = a;
      a = b;
      b = tmp;
    }
    expected = op === "+" ? a + b : a - b;
    problemEl.textContent = a + " " + op + " " + b + " = ?";
    answer = "";
    answerEl.textContent = "_";
    setFeedback("Resuelve para seguir con YouTube");
  }

  function renderAnswer() {
    answerEl.textContent = answer.length ? answer : "_";
  }

  function stopTimer() {
    if (tickId) {
      clearInterval(tickId);
      tickId = null;
    }
  }

  function startTimer() {
    remaining = SESSION_SECONDS;
    countdownEl.textContent = formatTime(remaining);
    stopTimer();
    tickId = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        stopTimer();
        countdownEl.textContent = "00:00";
        showLock();
        return;
      }
      countdownEl.textContent = formatTime(remaining);
    }, 1000);
  }

  function submitAnswer() {
    if (!answer.length) {
      setFeedback("Escribe un número", "is-bad");
      return;
    }
    if (parseInt(answer, 10) === expected) {
      setFeedback("¡Bien! +15 minutos de YouTube", "is-good");
      setTimeout(function () {
        showWatch();
        startTimer();
        setStatus("Reproduciendo YouTube");
      }, 900);
    } else {
      setFeedback("Incorrecto. Nuevo problema", "is-bad");
      setTimeout(nextProblem, 900);
    }
  }

  function digitFromEvent(event) {
    if (event.key >= "0" && event.key <= "9") return event.key;
    var code = event.keyCode;
    if (code >= 48 && code <= 57) return String(code - 48);
    if (code >= 96 && code <= 105) return String(code - 96);
    return null;
  }

  function isEnter(event) {
    return event.key === "Enter" || event.keyCode === 13 || event.keyCode === 65385;
  }

  function isBack(event) {
    return (
      event.key === "Backspace" ||
      event.key === "Escape" ||
      event.keyName === "XF86Back" ||
      event.keyCode === 8 ||
      event.keyCode === 27 ||
      event.keyCode === 10009
    );
  }

  document.addEventListener("keydown", function (event) {
    if (mode === "watch") {
      if (isEnter(event)) {
        event.preventDefault();
        toggleYoutube();
      }
      // En visionado, Atrás no cierra: evita saltar a la app YouTube nativa
      if (isBack(event)) {
        event.preventDefault();
        setStatus("Usa esta app, no la YouTube del menú");
      }
      return;
    }

    var digit = digitFromEvent(event);
    if (digit !== null) {
      event.preventDefault();
      if (answer.length >= MAX_ANSWER_LEN) return;
      answer += digit;
      renderAnswer();
      setFeedback("");
      return;
    }

    if (isBack(event)) {
      event.preventDefault();
      if (answer.length) {
        answer = answer.slice(0, -1);
        renderAnswer();
      } else {
        setFeedback("Hay que resolver el problema", "is-bad");
      }
      return;
    }

    if (isEnter(event)) {
      event.preventDefault();
      submitAnswer();
    }
  });

  function loadYoutubeApi() {
    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = createPlayer;
  }

  function createPlayer() {
    var opts = {
      height: "100%",
      width: "100%",
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: cfg.modestBranding ? 1 : 0,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: function () {
          playerReady = true;
          setStatus("Reproduciendo YouTube");
          if (shield) shield.focus();
          startTimer();
        },
        onError: function () {
          setStatus("Error al cargar YouTube — revisa videoId/playlistId en config.js");
        },
        onStateChange: function (event) {
          // 0 ended → si hay playlist, YT sigue; si no, dejamos el timer
          if (event.data === 0) setStatus("Vídeo terminado");
        },
      },
    };

    if (cfg.playlistId) {
      opts.playerVars.listType = "playlist";
      opts.playerVars.list = cfg.playlistId;
    } else {
      opts.videoId = cfg.videoId || "M7lc1UVf-VE";
    }

    player = new YT.Player("player", opts);
  }

  // Arranque
  countdownEl.textContent = formatTime(SESSION_SECONDS);
  if (shield) shield.focus();
  loadYoutubeApi();
})();
