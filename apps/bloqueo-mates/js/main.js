(function () {
  var cfg = window.BloqueoMatesConfig || {};
  var SESSION_SECONDS = cfg.sessionSeconds || 15 * 60;
  var PARENT_PIN = String(cfg.parentPin || "0350");
  var MAX_ANSWER_LEN = 3;
  var MAX_PIN_LEN = 4;
  var MAX_RESULTS = 8;

  if (/[?&]demo=1\b/.test(location.search)) SESSION_SECONDS = 20;

  var views = {
    search: document.getElementById("view-search"),
    watch: document.getElementById("view-watch"),
    lock: document.getElementById("view-lock"),
    pin: document.getElementById("view-pin"),
    parent: document.getElementById("view-parent"),
  };

  var queryEl = document.getElementById("query");
  var keyboardEl = document.getElementById("keyboard");
  var resultsEl = document.getElementById("results");
  var searchStatusEl = document.getElementById("search-status");
  var countdownEl = document.getElementById("countdown");
  var playerStatusEl = document.getElementById("player-status");
  var problemEl = document.getElementById("problem");
  var answerEl = document.getElementById("answer");
  var feedbackEl = document.getElementById("feedback");
  var pinDotsEl = document.getElementById("pin-dots");
  var pinFeedbackEl = document.getElementById("pin-feedback");
  var parentMenuEl = document.getElementById("parent-menu");
  var shield = document.getElementById("focus-shield");

  var mode = "search";
  var returnMode = "search";
  var query = "";
  var results = [];
  var focusZone = "keys"; // keys | results
  var keyIndex = 0;
  var resultIndex = 0;
  var parentIndex = 0;
  var remaining = SESSION_SECONDS;
  var tickId = null;
  var expected = 0;
  var answer = "";
  var pinBuffer = "";
  var player = null;
  var playerReady = false;
  var pendingVideoId = null;

  var KEYS = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","Ñ","O","P","Q","R","S",
    "T","U","V","W","X","Y","Z","0","1","2",
    "3","4","5","6","7","8","9","ESP","BOR","BUSCAR",
  ];

  var PARENT_ITEMS = [
    { id: "resume", label: "Volver al visionado / búsqueda" },
    { id: "search", label: "Ir a buscar YouTube" },
    { id: "skip", label: "Saltar reto actual (+15 min)" },
    { id: "exit", label: "Salir de la aplicación" },
  ];

  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function formatTime(t) { return pad(Math.floor(t / 60)) + ":" + pad(t % 60); }

  function setText(el, text, kind) {
    if (!el) return;
    el.textContent = text || "";
    el.classList.remove("is-bad", "is-good");
    if (kind) el.classList.add(kind);
  }

  function showView(name) {
    mode = name;
    Object.keys(views).forEach(function (key) {
      var el = views[key];
      var on = key === name;
      el.hidden = !on;
      el.classList.toggle("is-active", on);
    });
  }

  function extractVideoId(text) {
    var t = String(text || "").trim();
    if (/^[\w-]{11}$/.test(t)) return t;
    var m = t.match(/[?&]v=([\w-]{11})/) || t.match(/youtu\.be\/([\w-]{11})/) || t.match(/embed\/([\w-]{11})/);
    return m ? m[1] : null;
  }

  // —— Teclado / búsqueda ——
  function renderQuery() {
    queryEl.textContent = query.length ? query : "¿Qué quieres ver?";
  }

  function renderKeyboard() {
    keyboardEl.innerHTML = "";
    KEYS.forEach(function (label, i) {
      var btn = document.createElement("div");
      btn.className = "key" + (i === keyIndex && focusZone === "keys" ? " is-focus" : "");
      btn.textContent = label === "ESP" ? "␣" : label === "BOR" ? "←" : label === "BUSCAR" ? "OK" : label;
      btn.setAttribute("data-i", String(i));
      keyboardEl.appendChild(btn);
    });
  }

  function renderResults() {
    resultsEl.innerHTML = "";
    results.forEach(function (item, i) {
      var li = document.createElement("li");
      li.className = "result" + (i === resultIndex && focusZone === "results" ? " is-focus" : "");
      if (item.thumb) {
        var img = document.createElement("img");
        img.className = "result-thumb";
        img.src = item.thumb;
        img.alt = "";
        li.appendChild(img);
      }
      var title = document.createElement("div");
      title.className = "result-title";
      title.textContent = item.title;
      li.appendChild(title);
      resultsEl.appendChild(li);
    });
  }

  function renderParentMenu() {
    parentMenuEl.innerHTML = "";
    PARENT_ITEMS.forEach(function (item, i) {
      var li = document.createElement("li");
      li.className = "result" + (i === parentIndex ? " is-focus" : "");
      var title = document.createElement("div");
      title.className = "result-title";
      title.textContent = item.label;
      li.appendChild(title);
      parentMenuEl.appendChild(li);
    });
  }

  function moveKeyFocus(dx, dy) {
    var cols = 10;
    var row = Math.floor(keyIndex / cols);
    var col = keyIndex % cols;
    var maxRow = Math.floor((KEYS.length - 1) / cols);
    col = Math.max(0, Math.min(cols - 1, col + dx));
    row = Math.max(0, Math.min(maxRow, row + dy));
    var next = row * cols + col;
    if (next >= KEYS.length) next = KEYS.length - 1;
    keyIndex = next;
    renderKeyboard();
  }

  function activateKey() {
    var label = KEYS[keyIndex];
    if (label === "ESP") {
      query += " ";
    } else if (label === "BOR") {
      query = query.slice(0, -1);
    } else if (label === "BUSCAR") {
      runSearch();
      return;
    } else {
      query += label.length === 1 ? label.toLowerCase() : label;
    }
    renderQuery();
  }

  function runSearch() {
    var q = query.trim();
    if (!q) {
      setText(searchStatusEl, "Escribe algo y pulsa BUSCAR", "is-bad");
      return;
    }

    var direct = extractVideoId(q);
    if (direct) {
      playVideo(direct, q);
      return;
    }

    setText(searchStatusEl, "Buscando…");
    searchVideos(q)
      .then(function (items) {
        results = items.slice(0, MAX_RESULTS);
        resultIndex = 0;
        if (!results.length) {
          setText(searchStatusEl, "Sin resultados. Prueba otras palabras.", "is-bad");
          focusZone = "keys";
        } else {
          setText(searchStatusEl, results.length + " vídeos — abajo con ↓ · OK para ver");
          focusZone = "results";
        }
        renderKeyboard();
        renderResults();
      })
      .catch(function (err) {
        setText(searchStatusEl, "Error de búsqueda: " + (err && err.message ? err.message : "red"), "is-bad");
        focusZone = "keys";
        renderKeyboard();
      });
  }

  function searchVideos(q) {
    if (cfg.youtubeApiKey) return searchGoogle(q);
    return searchPiped(q);
  }

  function searchGoogle(q) {
    var url =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=" +
      MAX_RESULTS +
      "&q=" +
      encodeURIComponent(q) +
      "&key=" +
      encodeURIComponent(cfg.youtubeApiKey);
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("YouTube API " + res.status);
      return res.json();
    }).then(function (data) {
      return (data.items || []).map(function (it) {
        return {
          id: it.id.videoId,
          title: it.snippet.title,
          thumb: it.snippet.thumbnails && it.snippet.thumbnails.medium
            ? it.snippet.thumbnails.medium.url
            : "",
        };
      });
    });
  }

  function searchPiped(q) {
    var instances = cfg.pipedInstances || [];
    var i = 0;

    function tryNext() {
      if (i >= instances.length) {
        return Promise.reject(new Error("no hay buscador disponible"));
      }
      var base = instances[i++];
      var url = base.replace(/\/$/, "") + "/search?q=" + encodeURIComponent(q) + "&filter=videos";
      return fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error("piped " + res.status);
          return res.json();
        })
        .then(function (data) {
          var items = (data.items || data || []).filter(function (it) {
            return it.type === "video" || it.url || it.id;
          });
          if (!items.length) throw new Error("vacío");
          return items.map(function (it) {
            var id = it.id || extractVideoId(it.url) || "";
            return {
              id: id,
              title: it.title || "Vídeo",
              thumb: (it.thumbnail || (it.thumbnails && it.thumbnails[0] && it.thumbnails[0].url) || ""),
            };
          }).filter(function (it) { return !!it.id; });
        })
        .catch(function () {
          return tryNext();
        });
    }

    return tryNext();
  }

  // —— YouTube player ——
  function pauseYoutube() {
    try { if (player && playerReady && player.pauseVideo) player.pauseVideo(); } catch (e) {}
  }
  function playYoutube() {
    try { if (player && playerReady && player.playVideo) player.playVideo(); } catch (e) {}
  }
  function toggleYoutube() {
    if (!player || !playerReady || !player.getPlayerState) return;
    try {
      if (player.getPlayerState() === 1) {
        player.pauseVideo();
        setText(playerStatusEl, "Pausa");
      } else {
        player.playVideo();
        setText(playerStatusEl, "Reproduciendo");
      }
    } catch (e) {}
  }

  function ensureYoutubeApi() {
    return new Promise(function (resolve) {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }
      var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (typeof prev === "function") prev();
        resolve();
      };
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
  }

  function playVideo(videoId, title) {
    pendingVideoId = videoId;
    setText(playerStatusEl, title ? String(title).slice(0, 60) : "Cargando…");
    showView("watch");
    if (shield) shield.focus();

    ensureYoutubeApi().then(function () {
      if (player && playerReady && player.loadVideoById) {
        player.loadVideoById(videoId);
        startTimer();
        playYoutube();
        return;
      }
      player = new YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: function () {
            playerReady = true;
            startTimer();
            setText(playerStatusEl, "Reproduciendo");
            if (shield) shield.focus();
          },
          onError: function () {
            setText(playerStatusEl, "No se pudo reproducir este vídeo");
          },
        },
      });
    });
  }

  // —— Timer / mates ——
  function stopTimer() {
    if (tickId) { clearInterval(tickId); tickId = null; }
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
        enterLock();
        return;
      }
      countdownEl.textContent = formatTime(remaining);
    }, 1000);
  }

  function enterLock() {
    pauseYoutube();
    answer = "";
    nextProblem();
    showView("lock");
  }

  function nextProblem() {
    // Solo multiplicaciones de 1 cifra: 1–9 × 1–9
    var a = 1 + Math.floor(Math.random() * 9);
    var b = 1 + Math.floor(Math.random() * 9);
    expected = a * b;
    problemEl.textContent = a + " × " + b + " = ?";
    answer = "";
    answerEl.textContent = "_";
    setText(feedbackEl, "Resuelve para seguir con YouTube");
  }

  function submitAnswer() {
    if (!answer.length) {
      setText(feedbackEl, "Escribe un número", "is-bad");
      return;
    }
    if (parseInt(answer, 10) === expected) {
      setText(feedbackEl, "¡Bien! +15 minutos", "is-good");
      setTimeout(function () {
        showView("watch");
        startTimer();
        playYoutube();
        setText(playerStatusEl, "Reproduciendo");
        if (shield) shield.focus();
      }, 800);
    } else {
      setText(feedbackEl, "Incorrecto. Otra multiplicación", "is-bad");
      setTimeout(nextProblem, 800);
    }
  }

  // —— PIN / padres ——
  function openPin() {
    if (mode === "lock") {
      // Desde el reto también pueden abrir padres (por si hay que saltar)
    }
    returnMode = mode === "pin" || mode === "parent" ? returnMode : mode;
    pinBuffer = "";
    pinDotsEl.textContent = "····";
    setText(pinFeedbackEl, "Introduce PIN");
    if (mode === "watch") pauseYoutube();
    showView("pin");
  }

  function updatePinDots() {
    var dots = "";
    for (var i = 0; i < MAX_PIN_LEN; i++) dots += i < pinBuffer.length ? "●" : "·";
    pinDotsEl.textContent = dots;
  }

  function submitPin() {
    if (pinBuffer === PARENT_PIN) {
      parentIndex = 0;
      renderParentMenu();
      showView("parent");
      setText(pinFeedbackEl, "");
    } else {
      setText(pinFeedbackEl, "PIN incorrecto", "is-bad");
      pinBuffer = "";
      updatePinDots();
    }
  }

  function cancelPin() {
    showView(returnMode === "watch" || returnMode === "lock" || returnMode === "search" ? returnMode : "search");
    if (mode === "watch" && shield) shield.focus();
  }

  function activateParentItem() {
    var item = PARENT_ITEMS[parentIndex];
    if (!item) return;
    if (item.id === "resume") {
      if (returnMode === "lock") {
        showView("watch");
        startTimer();
        playYoutube();
      } else if (returnMode === "watch") {
        showView("watch");
        playYoutube();
        if (shield) shield.focus();
      } else {
        goSearch();
      }
    } else if (item.id === "search") {
      stopTimer();
      pauseYoutube();
      goSearch();
    } else if (item.id === "skip") {
      showView("watch");
      startTimer();
      playYoutube();
      setText(playerStatusEl, "Reto saltado (padres)");
      if (shield) shield.focus();
    } else if (item.id === "exit") {
      try {
        if (window.tizen && tizen.application) {
          tizen.application.getCurrentApplication().exit();
          return;
        }
      } catch (e) {}
      setText(searchStatusEl, "Salida solo en la TV Tizen");
      goSearch();
    }
  }

  function goSearch() {
    stopTimer();
    pauseYoutube();
    focusZone = "keys";
    showView("search");
    renderQuery();
    renderKeyboard();
    renderResults();
  }

  // —— Teclas ——
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

  function isYellow(event) {
    // Tecla amarilla del mando Samsung / algunos ColorKey
    return event.keyCode === 405 || event.key === "ColorF2Yellow" || event.keyName === "XF86Yellow";
  }

  function arrowDir(event) {
    if (event.key === "ArrowLeft" || event.keyCode === 37) return "left";
    if (event.key === "ArrowUp" || event.keyCode === 38) return "up";
    if (event.key === "ArrowRight" || event.keyCode === 39) return "right";
    if (event.key === "ArrowDown" || event.keyCode === 40) return "down";
    return null;
  }

  document.addEventListener("keydown", function (event) {
    if (isYellow(event)) {
      event.preventDefault();
      openPin();
      return;
    }

    var dir = arrowDir(event);
    var digit = digitFromEvent(event);

    if (mode === "search") {
      if (dir) {
        event.preventDefault();
        if (focusZone === "keys") {
          if (dir === "down" && results.length && keyIndex >= 30) {
            focusZone = "results";
            resultIndex = 0;
            renderKeyboard();
            renderResults();
          } else {
            moveKeyFocus(
              dir === "left" ? -1 : dir === "right" ? 1 : 0,
              dir === "up" ? -1 : dir === "down" ? 1 : 0
            );
          }
        } else {
          if (dir === "up" && resultIndex === 0) {
            focusZone = "keys";
            renderKeyboard();
            renderResults();
          } else if (dir === "up") {
            resultIndex = Math.max(0, resultIndex - 1);
            renderResults();
          } else if (dir === "down") {
            resultIndex = Math.min(results.length - 1, resultIndex + 1);
            renderResults();
          }
        }
        return;
      }
      if (isEnter(event)) {
        event.preventDefault();
        if (focusZone === "results" && results[resultIndex]) {
          playVideo(results[resultIndex].id, results[resultIndex].title);
        } else {
          activateKey();
        }
        return;
      }
      if (isBack(event)) {
        event.preventDefault();
        if (query.length) {
          query = query.slice(0, -1);
          renderQuery();
        }
        return;
      }
      if (digit !== null) {
        event.preventDefault();
        query += digit;
        renderQuery();
      }
      return;
    }

    if (mode === "watch") {
      if (isEnter(event)) {
        event.preventDefault();
        toggleYoutube();
      } else if (isBack(event)) {
        event.preventDefault();
        goSearch();
      }
      return;
    }

    if (mode === "lock") {
      if (digit !== null) {
        event.preventDefault();
        if (answer.length >= MAX_ANSWER_LEN) return;
        answer += digit;
        answerEl.textContent = answer;
        setText(feedbackEl, "");
        return;
      }
      if (isBack(event)) {
        event.preventDefault();
        if (answer.length) {
          answer = answer.slice(0, -1);
          answerEl.textContent = answer.length ? answer : "_";
        } else {
          setText(feedbackEl, "Hay que resolver la multiplicación", "is-bad");
        }
        return;
      }
      if (isEnter(event)) {
        event.preventDefault();
        submitAnswer();
      }
      return;
    }

    if (mode === "pin") {
      if (digit !== null) {
        event.preventDefault();
        if (pinBuffer.length >= MAX_PIN_LEN) return;
        pinBuffer += digit;
        updatePinDots();
        if (pinBuffer.length === MAX_PIN_LEN) submitPin();
        return;
      }
      if (isBack(event)) {
        event.preventDefault();
        if (pinBuffer.length) {
          pinBuffer = pinBuffer.slice(0, -1);
          updatePinDots();
        } else {
          cancelPin();
        }
        return;
      }
      return;
    }

    if (mode === "parent") {
      if (dir === "up") {
        event.preventDefault();
        parentIndex = Math.max(0, parentIndex - 1);
        renderParentMenu();
      } else if (dir === "down") {
        event.preventDefault();
        parentIndex = Math.min(PARENT_ITEMS.length - 1, parentIndex + 1);
        renderParentMenu();
      } else if (isEnter(event)) {
        event.preventDefault();
        activateParentItem();
      } else if (isBack(event)) {
        event.preventDefault();
        cancelPin();
      }
    }
  });

  // Arranque
  countdownEl.textContent = formatTime(SESSION_SECONDS);
  renderQuery();
  renderKeyboard();
  renderResults();
  setText(searchStatusEl, "Escribe con el teclado · BUSCAR · o pega un ID de vídeo");
  showView("search");
})();
