document.addEventListener("DOMContentLoaded", () => {
const translations = {
  ru: {
    start: "Начать",
    resume: "Продолжить",
    pause: "Пауза",
    levelComplete: "Уровень пройден!",
    gameComplete: "🎉 Вы прошли все уровни!",
    easy: "Лёгкий",
    medium: "Средний",
    hard: "Сложный",
    foundWord: "Найдено слово",
    time: "Время",
    wordsForSearch: "Слова для поиска:",
    changeDifficulty: "Сменить сложность"
  },

  en: {
    start: "Start",
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
    changeDifficulty: "Change difficulty"
  }
}
let levels = {
  easy: [],
  medium: [],
  hard: []
};

  let currentLevel = 0;
  let gridData = [];
  let words = [];
  let selectedCells = [];
  let countFoundWords = 0;
  let isSelecting = false;
  let isPaused = false
  let timerId = null;
  let direction = null
  let time = 0;
  let difficulty = "easy"
  let lang = "ru";

  const grid = document.getElementById("grid");
  const wordsEl = document.getElementById("words");
  const startOverlay = document.getElementById("startOverlay");


  document.getElementById("startBtn").addEventListener("click" , () => {
    startOverlay.classList.add("hidden");
    loadLevelsFromServer();
  });
  document.getElementById("pauseBtn").addEventListener("click", openPauseMenu);
  document.getElementById("resumeBtn").addEventListener("click", closePauseMenu);

  function addCellEvents(cell) {
    cell.addEventListener("mousedown", () => {
      if (isPaused) return;
      clearSelection();
      isSelecting = true;
      selectCell(cell);
    });

    cell.addEventListener("mouseenter", () => {
      if (!isSelecting || isPaused) return;
      const last = selectedCells[selectedCells.length - 1];
      console.log(last)
      if (!last) return;

      if (selectedCells.length === 1) {
        const dir = getDirection(last, cell);
        if (dir) {
          direction = dir;
          selectCell(cell);
        }
        return;
      }

      if (!direction) return;
      const rLast = +last.dataset.row;
      const cLast = +last.dataset.col;
      const r = +cell.dataset.row;
      const c = +cell.dataset.col;

      if (r === rLast + direction.dr && c === cLast + direction.dc) {
        selectCell(cell);
      }
    });
  }

  document.addEventListener("mouseup", () => {
    if (isPaused) return;
    if (isSelecting) {
      isSelecting = false;
      checkWord(selectedCells);
      clearSelection();
      direction = null;
    }
  });

function loadLevelsFromServer() {
  fetch("http://localhost:5000/levels")
    .then(res => res.json())
    .then(data => {

      // очищаем
      levels = { easy: [], medium: [], hard: [] };

      data.forEach(lvl => {
        levels[lvl.difficulty].push({
          grid: JSON.parse(lvl.grid),
          words: lvl.words.split(",")
        });
      });

      console.log("Уровни загружены:", levels);

      loadLevel(0);; // запускаем первый уровень
      startTimer();

    })
    .catch(err => console.error("Ошибка загрузки:", err));
}

function loadLevel(levelIndex) {

  const level = levels[difficulty][levelIndex];
  a=levels[difficulty][levelIndex]["grid"].length
  grid.style.gridTemplateColumns=`repeat(${a}, 40px)`

  time = 0
  countFoundWords = 0;                
  gridData = level.grid;
  words = level.words;

  grid.innerHTML = "";
  wordsEl.textContent = words.join(", ");

  for (let r = 0; r < gridData.length; r++) {
    for (let c = 0; c < gridData[r].length; c++) {

      const cell = document.createElement("div");

      cell.classList.add("cell");
      cell.textContent = gridData[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;

      addCellEvents(cell);
      grid.appendChild(cell);

    }
  }
}

window.setLanguage = function(newLang){

  lang = newLang;

  document.getElementById("startBtn").textContent =
    translations[lang].start;

  document.getElementById("resumeBtn").textContent =
    translations[lang].resume;

  document.getElementById("pauseBtn").textContent =
    translations[lang].pause;
  document.getElementById("easy-button").textContent =
    translations[lang].easy;
  document.getElementById("medium-button").textContent =
    translations[lang].medium;
  document.getElementById("hard-button").textContent =
    translations[lang].hard;
  document.getElementById("time").textContent =
    translations[lang].time;
  document.getElementById("pause").textContent =
    translations[lang].pause;
  document.getElementById("WordsForSearch").textContent =
    translations[lang].wordsForSearch;
  document.getElementById("change-difficulty").textContent =
    translations[lang].changeDifficulty;
  document.getElementById("easyButton").textContent =
    translations[lang].easy;
  document.getElementById("mediumButton").textContent =
    translations[lang].medium;
  document.getElementById("hardButton").textContent =
    translations[lang].hard;
}
n

window.setDifficulty = function(diff){

  difficulty = diff;
  currentLevel = 0;
  countFoundWords = 0;

  document.getElementById("startOverlay").classList.add("hidden");

  closePauseMenu()
  loadLevelsFromServer();
  startTimer();

}

  function checkWord(cells) {
    if (cells.length < 2) return;
    const word = cells.map(c => c.textContent).join("");
    if (words.includes(word)) {
      cells.forEach(c => c.classList.add("found"));
      countFoundWords++;
      showMessage(`✔ ${translations[lang].foundWord} ${word}`);
      if (countFoundWords === words.length) {
        stopTimer();
        setTimeout(() => {
          currentLevel++;
          if (currentLevel < levels[difficulty].length) {
            alert(`✔ ${translations[lang].levelComplete}`);
            loadLevel(currentLevel);
          } else {
            alert("🎉 Вы прошли все уровни!");
          }
        }, 500);
      }
    }
  }

  function clearSelection() {
    selectedCells.forEach(c => c.classList.remove("selected"));
    selectedCells = [];
  }

  function selectCell(cell) {
    cell.classList.add("selected");
    selectedCells.push(cell);
  }

  function getDirection(a, b) {
    const dr = +b.dataset.row - +a.dataset.row;
    const dc = +b.dataset.col - +a.dataset.col;
    if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) {
      return { dr: Math.sign(dr), dc: Math.sign(dc) };
    }
    return null;
  }

  function startTimer() {
    console.log(timerId)
    if (timerId !== null) return;
    timerId = setInterval(() => {
      time++;
      document.getElementById("timer").textContent = time;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function openPauseMenu() {
    isPaused = true;
    stopTimer();
    document.getElementById("pauseOverlay").classList.remove("hidden");
  }

  function closePauseMenu() {
    isPaused = false;
    startTimer();
    document.getElementById("pauseOverlay").classList.add("hidden");
  }
  function showMessage(text, duration = 1000) {
    const el = document.getElementById("message");
    el.textContent = text;
    setTimeout(() => { el.textContent = ""; }, duration);
  }

});