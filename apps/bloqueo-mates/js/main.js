(function () {
  var SESSION_SECONDS = 15 * 60;
  var MAX_ANSWER_LEN = 4;

  var viewWatch = document.getElementById("view-watch");
  var viewLock = document.getElementById("view-lock");
  var countdownEl = document.getElementById("countdown");
  var problemEl = document.getElementById("problem");
  var answerEl = document.getElementById("answer");
  var feedbackEl = document.getElementById("feedback");

  var mode = "watch"; // watch | lock
  var remaining = SESSION_SECONDS;
  var tickId = null;
  var expected = 0;
  var answer = "";

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function formatTime(total) {
    var m = Math.floor(total / 60);
    var s = total % 60;
    return pad(m) + ":" + pad(s);
  }

  function setFeedback(text, kind) {
    feedbackEl.textContent = text || "";
    feedbackEl.classList.remove("is-bad", "is-good");
    if (kind) feedbackEl.classList.add(kind);
  }

  function showWatch() {
    mode = "watch";
    viewLock.hidden = true;
    viewLock.classList.remove("is-active");
    viewWatch.hidden = false;
    viewWatch.classList.add("is-active");
    answer = "";
    setFeedback("");
  }

  function showLock() {
    mode = "lock";
    viewWatch.hidden = true;
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
    setFeedback("Resuelve para continuar");
  }

  function renderAnswer() {
    answerEl.textContent = answer.length ? answer : "_";
  }

  function startTimer() {
    remaining = SESSION_SECONDS;
    countdownEl.textContent = formatTime(remaining);
    if (tickId) clearInterval(tickId);
    tickId = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(tickId);
        tickId = null;
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
    var value = parseInt(answer, 10);
    if (value === expected) {
      setFeedback("¡Bien! +15 minutos", "is-good");
      setTimeout(function () {
        showWatch();
        startTimer();
      }, 900);
    } else {
      setFeedback("Incorrecto. Nuevo problema", "is-bad");
      setTimeout(nextProblem, 900);
    }
  }

  function digitFromEvent(event) {
    if (event.key >= "0" && event.key <= "9") return event.key;
    // Teclas numéricas del mando Samsung / Tizen suelen ir por keyCode 48–57 o 96–105
    var code = event.keyCode;
    if (code >= 48 && code <= 57) return String(code - 48);
    if (code >= 96 && code <= 105) return String(code - 96);
    return null;
  }

  function isEnter(event) {
    return (
      event.key === "Enter" ||
      event.keyCode === 13 ||
      event.keyCode === 65385 // algunos mandos
    );
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
        startTimer();
      }
      return;
    }

    // mode === lock
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
        // En bloqueo, Atrás no sale de la app: evita saltarse el reto
        setFeedback("Hay que resolver el problema", "is-bad");
      }
      return;
    }

    if (isEnter(event)) {
      event.preventDefault();
      submitAnswer();
    }
  });

  // Arranque
  showWatch();
  startTimer();
})();
