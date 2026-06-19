document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    ru: {
      start: "Генерировать уровень",
      resume: "Продолжить",
      pause: "Пауза",
      levelComplete: "Уровень пройден!",
      gameComplete: "🎉 Вы прошли все уровни!",
      easy: "Лёгкий",
      medium: "Средний",
      hard: "Сложный",
      foundWord: "Найдено слово",
      time: "Время:",
      wordsForSearch: "Слова для поиска:",
      changeDifficulty: "Сменить сложность",
      chooseDifficulty: "Выберите сложность",
      chooseLanguage: "Выберите язык",
      playLevels: "Играть уровни",
      saveLevel: "💾 Сохранить уровень"
    },
    en: {
      start: "Generate Level",
      resume: "Resume",
      pause: "Pause",
      levelComplete: "Level completed!",
      gameComplete: "🎉 You finished all levels!",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      foundWord: "Word found",
      time: "Time:",
      wordsForSearch: "Words for search:",
      changeDifficulty: "Change difficulty",
      chooseDifficulty: "Choose difficulty",
      chooseLanguage: "Choose language",
      playLevels: "Play Levels",
      saveLevel: "💾 Save Level"
    },
    he: {
      start: "צור רמה",
      resume: "המשך",
      pause: "הפסקה",
      levelComplete: "הרמה הושלמה!",
      gameComplete: "🎉 סיימת את כל הרמות!",
      easy: "קל",
      medium: "בינוני",
      hard: "קשה",
      foundWord: "מצא מילה",
      time: "זמן:",
      wordsForSearch: "מילים לחיפוש:",
      changeDifficulty: "שנה קושי",
      chooseDifficulty: "בחר קושי",
      chooseLanguage: "בחר שפה",
      playLevels: "שחק רמות",
      saveLevel: "💾 שמור רמה"
    }
  };

  let currentLevel = 0;
  let gridData = [];
  let words = [];
  let selectedCells = [];
  let countFoundWords = 0;
  let isSelecting = false;
  let isPaused = false;
  let timerId = null;
  let time = 0;
  let difficulty = "easy";
  let lang = "ru";
  let allLevels = [];
  let currentLevelIndex = 0;

  const grid = document.getElementById("grid");
  const wordsEl = document.getElementById("words");
  const pauseOverlay = document.getElementById("pauseOverlay");
  const loginChoiceOverlay = document.getElementById("loginChoiceOverlay");

  document.getElementById("startBtn").addEventListener("click", () => {
    loginChoiceOverlay.classList.add("hidden");
    generateNewLevel();
  });

  document.getElementById("playLevelsBtn").addEventListener("click", () => {
    loginChoiceOverlay.classList.add("hidden");
    loadSavedLevels();
  });

  document.getElementById("pauseBtn").addEventListener("click", openPauseMenu);
  document.getElementById("resumeBtn").addEventListener("click", closePauseMenu);

  function addCellEvents(cell) {
    cell.addEventListener("mousedown", (e) => {
      if (isPaused) return;
      isSelecting = true;
      selectedCells = [];
      selectCell(cell);
    });

    cell.addEventListener("mouseenter", (e) => {
      if (!isSelecting || isPaused) return;
      selectCell(cell);
    });
  }

  document.addEventListener("mouseup", () => {
    if (isPaused) return;
    if (isSelecting) {
      isSelecting = false;
      if (selectedCells.length > 0) {
        checkWord(selectedCells);
      }
      clearSelection();
    }
  });

  function generateNewLevel() {
    const lang = document.getElementById("langSelect").value || "ru";
    const difficulty = document.getElementById("difficultySelect").value || "easy";

    fetch(`http://localhost:5000/generate-level?lang=${lang}&difficulty=${difficulty}`)
      .then(res => res.json())
      .then(level => {
        gridData = level.grid;
        words = level.words.slice();
        currentLevelIndex = 0;
        allLevels = [level];
        renderLevel();
      })
      .catch(err => {
        console.error("Ошибка генерации уровня:", err);
        showMessage("Не удалось сгенерировать уровень");
      });
  }

  function loadSavedLevels() {
    const lang = document.getElementById("langSelect").value || "ru";
    const difficulty = document.getElementById("difficultySelect").value || "easy";

    fetch(`http://localhost:5000/get-levels?lang=${lang}&difficulty=${difficulty}`)
      .then(res => res.json())
      .then(levels => {
        if (levels.length > 0) {
          allLevels = levels;
          currentLevelIndex = 0;
          loadLevel(allLevels[currentLevelIndex]);
        } else {
          showMessage("Нет сохранённых уровней. Сначала сгенерируйте и сохраните уровни.");
        }
      })
      .catch(err => {
        console.error("Ошибка загрузки уровней:", err);
        showMessage("Не удалось загрузить уровни");
      });
  }

  function loadLevel(level) {
    gridData = level.grid;
    words = level.words.slice();
    renderLevel();
  }

  function renderLevel() {
    time = 0;
    countFoundWords = 0;
    grid.innerHTML = "";
    wordsEl.textContent = words.join("\n");
    const size = gridData.length;
    grid.style.gridTemplateColumns = `repeat(${size}, 36px)`;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = gridData[y][x];
        cell.dataset.row = y;
        cell.dataset.col = x;
        addCellEvents(cell);
        grid.appendChild(cell);
      }
    }
    startTimer();
  }

  window.setLanguage = function(newLang) {
    lang = newLang;
    updateTranslations();
  };

  window.setDifficulty = function(diff) {
    difficulty = diff;
    currentLevel = 0;
    countFoundWords = 0;
    closePauseMenu();
    loadSavedLevels();
  };

  window.openLogin = function() {
    document.getElementById("loginChoiceOverlay").classList.add("hidden");
    document.getElementById("loginOverlay").classList.remove("hidden");
  };

  window.openRegister = function() {
    document.getElementById("loginChoiceOverlay").classList.add("hidden");
    document.getElementById("registerOverlay").classList.remove("hidden");
  };

  window.closeLogin = function() {
    document.getElementById("loginOverlay").classList.add("hidden");
    document.getElementById("loginChoiceOverlay").classList.remove("hidden");
  };

  window.closeRegister = function() {
    document.getElementById("registerOverlay").classList.add("hidden");
    document.getElementById("loginChoiceOverlay").classList.remove("hidden");
  };

  window.login = function() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          document.getElementById("loginOverlay").classList.add("hidden");
          document.getElementById("loginChoiceOverlay").classList.add("hidden");
        } else {
          document.getElementById("loginMessage").textContent = data.message;
        }
      })
      .catch(err => console.error(err));
  };

  window.register = function() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          document.getElementById("registerOverlay").classList.add("hidden");
          document.getElementById("loginChoiceOverlay").classList.add("hidden");
        } else {
          document.getElementById("authMessage").textContent = data.message;
        }
      })
      .catch(err => console.error(err));
  };

  function checkWord(cells) {
    if (cells.length < 2) return;
    const word = cells.map(c => c.textContent).join("");
    if (words.includes(word)) {
      showMessage(`${translations[lang].foundWord}: ${word}`);
      cells.forEach(c => c.classList.add("found"));
      words = words.filter(w => w !== word);
      wordsEl.textContent = words.join("\n");
      countFoundWords++;
      if (words.length === 0) {
        showMessage(translations[lang].levelComplete);
        stopTimer();
        setTimeout(() => {
          if (currentLevelIndex < allLevels.length - 1) {
            currentLevelIndex++;
            loadLevel(allLevels[currentLevelIndex]);
          } else {
            showMessage(translations[lang].gameComplete);
          }
        }, 1500);
      }
    }
  }

  function clearSelection() {
    grid.querySelectorAll(".cell").forEach(c => c.classList.remove("selected"));
    selectedCells = [];
  }

  function selectCell(cell) {
    if (selectedCells.includes(cell)) return;
    if (selectedCells.length > 0) {
      const last = selectedCells[selectedCells.length - 1];
      const r1 = parseInt(last.dataset.row);
      const c1 = parseInt(last.dataset.col);
      const r2 = parseInt(cell.dataset.row);
      const c2 = parseInt(cell.dataset.col);
      const dr = Math.sign(r2 - r1);
      const dc = Math.sign(c2 - c1);
      if (selectedCells.length === 1 || (selectedCells[selectedCells.length - 2] && Math.sign(r2 - parseInt(selectedCells[selectedCells.length - 2].dataset.row)) === dr && Math.sign(c2 - parseInt(selectedCells[selectedCells.length - 2].dataset.col)) === dc)) {
        selectedCells.push(cell);
        cell.classList.add("selected");
      }
    } else {
      selectedCells.push(cell);
      cell.classList.add("selected");
    }
  }

  function startTimer() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      if (!isPaused) {
        time++;
        document.getElementById("timer").textContent = time;
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
  }

  function openPauseMenu() {
    isPaused = true;
    pauseOverlay.classList.remove("hidden");
  }

  function closePauseMenu() {
    isPaused = false;
    pauseOverlay.classList.add("hidden");
  }

  function showMessage(text, duration = 1000) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    setTimeout(() => {
      messageEl.textContent = "";
    }, duration);
  }

  function updateTranslations() {
    // Обновление текста элементов на основе текущего языка
    if (lang === "ru") {
      document.getElementById("pause").textContent = "Пауза";
      document.getElementById("resumeBtn").textContent = "Продолжить";
      document.getElementById("time").textContent = "Время:";
      document.getElementById("WordsForSearch").textContent = "Слова для поиска:";
      document.getElementById("pauseBtn").textContent = "Пауза";
      document.getElementById("startBtn").textContent = "Генерировать уровень";
      document.getElementById("playLevelsBtn").textContent = "Играть уровни";
      document.getElementById("saveLevelBtn").textContent = "💾 Сохранить уровень";
      document.getElementById("langLabel").textContent = "Язык:";
      document.getElementById("difficultyLabel").textContent = "Сложность:";
      document.getElementById("opt-easy").textContent = "Лёгкий";
      document.getElementById("opt-medium").textContent = "Средний";
      document.getElementById("opt-hard").textContent = "Сложный";
    } else if (lang === "en") {
      document.getElementById("pause").textContent = "Pause";
      document.getElementById("resumeBtn").textContent = "Resume";
      document.getElementById("time").textContent = "Time:";
      document.getElementById("WordsForSearch").textContent = "Words for search:";
      document.getElementById("pauseBtn").textContent = "Pause";
      document.getElementById("startBtn").textContent = "Generate Level";
      document.getElementById("playLevelsBtn").textContent = "Play Levels";
      document.getElementById("saveLevelBtn").textContent = "💾 Save Level";
      document.getElementById("langLabel").textContent = "Language:";
      document.getElementById("difficultyLabel").textContent = "Difficulty:";
      document.getElementById("opt-easy").textContent = "Easy";
      document.getElementById("opt-medium").textContent = "Medium";
      document.getElementById("opt-hard").textContent = "Hard";
    } else if (lang === "he") {
      document.getElementById("pause").textContent = "הפסקה";
      document.getElementById("resumeBtn").textContent = "המשך";
      document.getElementById("time").textContent = "זמן:";
      document.getElementById("WordsForSearch").textContent = "מילים לחיפוש:";
      document.getElementById("pauseBtn").textContent = "הפסקה";
      document.getElementById("startBtn").textContent = "צור רמה";
      document.getElementById("playLevelsBtn").textContent = "שחק רמות";
      document.getElementById("saveLevelBtn").textContent = "💾 שמור רמה";
      document.getElementById("langLabel").textContent = "שפה:";
      document.getElementById("difficultyLabel").textContent = "קושי:";
      document.getElementById("opt-easy").textContent = "קל";
      document.getElementById("opt-medium").textContent = "בינוני";
      document.getElementById("opt-hard").textContent = "קשה";
    }
  }

  document.getElementById("saveLevelBtn").addEventListener("click", () => {
    if (gridData.length === 0) {
      showMessage("Сначала сгенерируйте уровень!");
      return;
    }

    const level = {
      lang: document.getElementById("langSelect").value,
      difficulty: document.getElementById("difficultySelect").value,
      grid: gridData,
      words: words
    };
    
    fetch("http://localhost:5000/save-level", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(level)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        showMessage("✅ " + data.message);
      } else {
        showMessage("❌ " + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      showMessage("Ошибка при сохранении уровня");
    });
  });

  document.getElementById("langSelect").addEventListener("change", (e) => {
    lang = e.target.value;
    updateTranslations();
  });
});