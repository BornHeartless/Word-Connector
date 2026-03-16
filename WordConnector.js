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
    wordsForSearch: "Слова для поиска:"
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
    wordsForSearch: "Words for search:"
  }
}
const levels = {
  easy: [
    {
      grid: [
        ["К","О","Т","А","Р"],
        ["Р","А","К","Е","Т"],
        ["Т","О","Р","Т","А"],
        ["А","К","О","Т","Р"],
        ["Р","Т","А","К","О"]
      ],
      words: ["КОТ","РАК","ТОРТ"]
    },
    {
      grid: [
        ["Д","О","М","А","Ш","А"],
        ["А","Р","Е","К","А","Т"],
        ["М","О","Р","Е","Т","О"],
        ["Ш","К","О","Л","А","Р"],
        ["Т","А","К","С","И","Н"],
        ["К","А","Р","Т","А","С"]
      ],
      words: ["ДОМ","МОРЕ","ШКОЛА","ТАКСИ","КАРТА"]
    },
    {
      grid: [
        ["К","О","М","П","Ь","Ю","Т"],
        ["А","Р","Х","И","В","О","Р"],
        ["Т","Е","Л","Е","Ф","О","Н"],
        ["С","И","С","Т","Е","М","А"],
        ["П","Р","О","Г","Р","А","М"],
        ["К","Л","А","В","И","А","Т"],
        ["М","О","Н","И","Т","О","Р"]
      ],
      words: ["ТЕЛЕФОН","СИСТЕМА","МОНИТОР","КЛАВИАТ"]
    }
  ],

  medium: [
    {
      grid: [
        ["Д","О","М","А","Ш","А"],
        ["А","Р","Е","К","А","Т"],
        ["М","О","Р","Е","Т","О"],
        ["Ш","К","О","Л","А","Р"],
        ["Т","А","К","С","И","Н"],
        ["К","А","Р","Т","А","С"]
      ],
      words: ["ДОМ","МОРЕ","ШКОЛА","ТАКСИ","КАРТА"]
    },
  ],

  hard: [
    {
      grid: [
        ["П","О","К","О","Р","Д","Ю","Ш","Е","С"],
        ["З","Х","О","Ж","М","И","Ц","В","П","К"],
        ["Ш","Ц","К","Б","У","М","Й","Р","В","Г"],
        ["Й","К","А","Ж","Н","Ф","А","Н","Т","А"],
        ["В","Б","К","Й","П","Й","С","Н","И","Д"],
        ["Д","А","О","О","Т","И","С","П","Е","П"],
        ["К","С","Л","Л","У","Б","Д","Е","Р","М"],
        ["Г","Т","А","Р","Х","У","Н","Р","Г","Ш"],
        ["О","Д","У","В","А","Н","Ч","И","К","Е"],
        ["З","О","А","Д","А","Н","О","М","И","Л"],
      ],
      words: ["КОКАКОЛА","ЛИМОНАД","ОДУВАНЧИК","ТАРХУН","ФАНТА","СПРАЙТ","РЕДБУЛЛ","ДЮШЕС"]
    },
        {
      grid: [
        ["Р","А","Й","И","Щ","З","М","А","Р","С"],
        ["С","А","Р","М","Т","Х","Ш","М","Е","Н"],
        ["Н","Л","Ф","Б","И","Т","Н","С","И","И"],
        ["К","Ё","Д","А","Ю","Б","К","Ь","И","К"],
        ["Т","Н","Е","У","Э","И","А","Н","Д","Е"],
        ["Б","К","Д","Н","В","Л","Ь","Х","Ю","Р"],
        ["Ю","А","Ч","Т","Е","С","Л","З","Ц","С"],
        ["Ч","Ц","Й","И","Ф","И","Ф","О","Т","Э"],
        ["Г","В","Й","Э","В","И","К","Л","И","М"],
        ["И","Ч","У","П","А","Ч","У","П","С","Ы"],
      ],
      words: ["АЛЁНКА","ЧУПАЧУПС","МИЛКИВЭЙ","МАРС","СНИКЕРС","РАФАЭЛЛО","БАУНТИ","ТВИКС","ТОФИФИ"]
    },
        {
      grid: [
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
      ],
      words: []
    },
        {
      grid: [
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
      ],
      words: []
    },
        {
      grid: [
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
      ],
      words: []
    },
        {
      grid: [
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
      ],
      words: []
    },    {
      grid: [
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
      ],
      words: []
    }
  ]
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
    loadLevel(0);
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
}


window.setDifficulty = function(diff){

  difficulty = diff;
  currentLevel = 0;
  countFoundWords = 0;

  document.getElementById("startOverlay").classList.add("hidden");

  closePauseMenu()
  loadLevel(0);
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