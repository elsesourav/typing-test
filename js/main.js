const timeRange = document.getElementById("time-range");
const difficaltys = document.querySelectorAll(".diff");
const showSetTime = document.getElementById("show-set-time");
const selCheckbox = document.getElementById("sel-checkbox");
const keyCheckbox = document.getElementById("key-checkbox");
const symCheckbox = document.getElementById("sym-checkbox");
const escCheckbox = document.getElementById("esc-checkbox");
const startButton = document.getElementById("start-button");
const typingBox = document.getElementById("typing-box");
const closeTypingWindow = document.getElementById("close-typing-window");

const textShow = document.getElementById("text-show");
const typingInput = document.getElementById("typing-input");
const root = document.querySelector(':root');
const liveTime = document.getElementById("live-time");

const resultWindow = document.getElementById("result-window");
const timeUsed = document.getElementById("time-used");
const accuracy = document.getElementById("accuracy");
const grossSpeed = document.getElementById("gross-speed");
const needSpeed = document.getElementById("need-speed");
const wordsCompleted = document.getElementById("words-completed");
const wordsCorrect = document.getElementById("words-correct");
const wordsMistake = document.getElementById("words-mistake");
const closeResultBtn = document.getElementById("close-result-btn");

let difficaltyLvl = 1;
let time = 3 * 60;
let keyCheck = false;
let selCheck = false;
let symCheck = false;
let escCheck = true;

difficaltys.forEach((difficalty, i) => {
  difficalty.addEventListener("click", () => {
    difficaltys.forEach(d => {
      d.classList.remove("active");
    })
    difficaltyLvl = i;
    difficalty.classList.add("active");
  })
});

timeRange.addEventListener("input", (e) => {
  time = (e.target.value / 10) * 60;
  if (time < 30) {
    time = 30;
    e.target.value = 5;
  }
  let m = `${Math.floor(time / 60)}`;
  let s = `${time % 60}`;
  showSetTime.innerHTML =
    `${m.length < 2 ? '0' : ''}${m}:${s.length < 2 ? '0' : ''}${s}<x> min.</x></div>  
    </div>`;
})

selCheckbox.addEventListener("input", (e) => selCheck = e.target.checked);
keyCheckbox.addEventListener("input", (e) => keyCheck = e.target.checked);
symCheckbox.addEventListener("input", (e) => symCheck = e.target.checked);
escCheckbox.addEventListener("input", (e) => escCheck = e.target.checked);
const paraLength = 21;

startButton.addEventListener("click", started);
closeTypingWindow.addEventListener("click", ended);
closeResultBtn.addEventListener("click", ended);

let wrong = 0, right = 0;
let sft;
let myTimeout;

function setDefultTime() {
  let m = `${Math.floor(time / 60)}`;
  let s = `${time % 60}`;
  liveTime.innerHTML =
  `${m.length < 2 ? '0' : ''}${m}:${s.length < 2 ? '0' : ''}${s}`;
}

function started() {
  sft = new setupForTyping();
  setDefultTime();
  typingBox.classList.add("active");
  typingInput.addEventListener("keydown", sft.inputEvent);
}
function ended() {
  clearTimeout(myTimeout);
  liveTime.classList.remove("run-time-geter-10")
  typingBox.classList.remove("active");
  resultWindow.classList.remove("active");
  typingInput.placeholder = "Type...";
  typingInput.value = "";
  typingInput.removeEventListener("keydown", sft.inputEvent);
}

typingBox.style.transition = "transform linear 0.3s";

function neededText() {
  if (keyCheck && symCheck && selCheck) {
    return getText([keyWords, symbols], difficaltyLvl);
  } else if (!selCheck && keyCheck && symCheck) {
    return getText([sympleWords, keyWords, englishWords, symbols], difficaltyLvl);
  } else if (!selCheck && keyCheck && !symCheck) {
    return getText([sympleWords, keyWords, englishWords], difficaltyLvl);
  } else if (!selCheck && !keyCheck && symCheck) {
    return getText([sympleWords, englishWords, symbols], difficaltyLvl);
  } else if (selCheck && !keyCheck && symCheck) {
    return getText([symbols], difficaltyLvl);
  } else if (selCheck && keyCheck && !symCheck) {
    return getText([keyWords], difficaltyLvl);
  } else {
    return getText([sympleWords, englishWords], difficaltyLvl);
  }
}


function running(t) {
  let m = `${Math.floor(t / 60)}`;
  let s = `${t % 60}`;
  liveTime.innerHTML =
  `${m.length < 2 ? '0' : ''}${m}:${s.length < 2 ? '0' : ''}${s}`;
  if (t > 10) {
    liveTime.classList.add("run-time-geter-10");
    liveTime.classList.remove("run-time-less-10");
  } else {
    liveTime.classList.remove("run-time-geter-10");
    liveTime.classList.add("run-time-less-10");
  }

  if (t > 0) {
    myTimeout = setTimeout(() => {
      running(--t);
    }, 1000)
  } else {
    resultWindow.classList.add("active");

    let m = `${Math.floor(time / 60)}`;
    let s = `${time % 60}`;
    timeUsed.innerHTML = `${m.length < 2 ? '0' : ''}${m}:${s.length < 2 ? '0' : ''}${s}`;

    let total = wrong + right;
    accuracy.innerText = Math.round(right * 100 / total);

    grossSpeed.innerText = Math.round(total / time * 60);
    needSpeed.innerText = Math.round(right / time * 60);
    wordsCompleted.innerText = total;
    wordsCorrect.innerText = right;
    wordsMistake.innerText = wrong;
  }
}

function setupForTyping() {
  let xxCount, zCount;
  wrong = right = 0;
  let text = neededText();
  let xx, z;
  typingInput.select();
  setTimeout(() => typingInput.placeholder = "", 2000);

  function reste() {
    text = neededText();
    textShow.innerHTML = "";
    text.forEach((t, i) => {
      let word = "";
      for (let i = 0; i < t.length; i++) {
        word += `<z>${t[i]}</z>`
      }
      textShow.innerHTML += `<xx>${word}</xx> `;
      if (i < text.length - 1) {
        if (!((i + 1) % paraLength)) textShow.innerHTML += `<br><br>`;
      }
    })

    xx = document.querySelectorAll("xx");
    z = document.querySelectorAll("z");
    xxCount = zCount = 0;
    currentWord(zCount, zCount + text[xxCount].length, xxCount);
  }
  reste();
  function currentWord(start, end, index) {
    for (let i = start; i < end; i++) {
      z[i].classList.add("now");
    }
    let w = xx[index].offsetWidth;
    let h = xx[index].offsetHeight;
    root.style.setProperty('--word-w', `${w}px`);
    root.style.setProperty('--word-h', `${h}px`);
    xx[index].classList.add("now");
  }

  function update(v) {
    if (text[xxCount] != v) {
      for (let i = 0; i < text[xxCount].length; i++) {
        z[zCount + i].classList.add("rong");
        if (text[xxCount][i] != v[i]) {
          z[zCount + i].classList.add("rong-letter");
        }
      }
      wrong++;
    } else {
      right++;
    }
    let old = zCount;
    zCount += text[xxCount].length;
    xxCount++;
    for (let i = old; i < zCount; i++) {
      z[i].classList.add("complite");
    }
    if (xxCount < xx.length) {
      currentWord(zCount, zCount + text[xxCount].length, xxCount);
    }

    try {
      xx[xxCount - 1].classList.remove("now");
      removeAllCursor();
      z[zCount].classList.add("cursor-b");
    } catch (e) { };

    typingInput.value = "";
  }

  function removeAllCursor() {
    const cursor = document.querySelectorAll(".cursor");
    cursor.forEach(c => {
      c.classList.remove("cursor");
    })
    const cursor_b = document.querySelectorAll(".cursor-b");
    cursor_b.forEach(c => {
      c.classList.remove("cursor-b");
    })
  }

  let firstTime = true;
  this.inputEvent = (e) => {
    if(firstTime) {
      running(time);
    }
    firstTime = false;
    setTimeout(() => {
      let val = typingInput.value.split(" ").join("");
      for (let i = 0; i < text[xxCount].length; i++) {
        z[zCount + i].classList.remove("semi-com");
        z[zCount + i].classList.remove("rong-underline");
      }
      removeAllCursor();
      let j;
      for (j = 0; j < val.length && j < text[xxCount].length; j++) {
        if (z[zCount + j].innerText == val[j]) {
          z[zCount + j].classList.add("semi-com");
        } else {
          break;
        }
      }
      for (let k = j; k < val.length && k < text[xxCount].length; k++) {
        z[zCount + k].classList.add("rong-underline");
      }

      try {
        z[zCount + (j - 1)].classList.add("cursor");
        if (!j) {
          removeAllCursor();
          z[zCount].classList.add("cursor-b");
        }
      } catch (e) { };

      if ((escCheck && e.keyCode === 32 && val) ||
        (e.keyCode === 32 && val == text[xxCount])) {
        update(val);
      }
      xxCount >= xx.length && reste();
    })
  }
}



function getText(ary2d, def) {
  let tempArray = [];

  while (tempArray.length < 2 * paraLength) {
    let words = ary2d[Math.floor(Math.random() * ary2d.length)];

    let word = words[Math.floor(Math.random() * words.length)];
    if (words == symbols && def > 0) {
      word = "";
      if (def == 1) {
        for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
          word += symbols[Math.floor(Math.random() * symbols.length)];
        }
      } else if (def == 2) {
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          word += symbols[Math.floor(Math.random() * symbols.length)];
        }
      }
    }
    if (words == keyWords) {
      word = "";
      if (def == 0) {
        let tp = keyWords[Math.floor(Math.random() * keyWords.length)];
        while (1) {
          if (tp.length <= 5) {
            word = tp;
            break;
          } else {
            tp = keyWords[Math.floor(Math.random() * keyWords.length)];
          }
        }
      } else if (def == 1) {
        let tp = keyWords[Math.floor(Math.random() * keyWords.length)];
        while (1) {
          if (tp.length <= 7) {
            word = tp;
            break;
          } else {
            tp = keyWords[Math.floor(Math.random() * keyWords.length)];
          }
        }
      } else {
        word =  keyWords[Math.floor(Math.random() * keyWords.length)];
      }
    }
    let t = def == 0 ? word.toLowerCase() : word;
    if (def == 2) {
      let x = "";
      x += word[0].toLocaleUpperCase();
      for (let i = 1; i < word.length; i++) {
        x += word[i];
      }
      t = x;
    }

    if (def == 0 && t.length <= (Math.random() * 3) + 4) {
      tempArray.push(t);
    } else if (def == 1 && t.length <= (Math.random() * 4) + 5) {
      tempArray.push(t);
    } else if (def == 2) {
      tempArray.push(t);
    }
  }
  return tempArray;
}