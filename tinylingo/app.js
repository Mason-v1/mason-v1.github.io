const homeScreen = document.querySelector('[data-screen="home"]');
const lessonScreen = document.querySelector('[data-screen="lesson"]');
const manualScreen = document.querySelector('[data-screen="manual"]');
const stageList = document.querySelector(".stage-list");
const todayCount = document.querySelector(".today-count");
const reviewCount = document.querySelector(".review-count");
const startTodayButton = document.querySelector(".start-today");
const startReviewsButton = document.querySelector(".start-reviews");
const openManualButton = document.querySelector(".open-manual");
const closeManualButton = document.querySelector(".close-manual");
const manualInput = document.querySelector(".manual-input");
const addManualReviewButton = document.querySelector(".add-manual-review");
const closeLessonButton = document.querySelector(".close-lesson");
const lessonTitle = document.querySelector(".lesson-title");
const lessonCount = document.querySelector(".lesson-count");
const progressFill = document.querySelector(".progress-fill");
const targetKind = document.querySelector(".target-kind");
const targetTitle = document.querySelector(".target-title");
const targetMeaning = document.querySelector(".target-meaning");
const listenButton = document.querySelector(".listen-button");
const soundCheckButton = document.querySelector(".sound-check");
const nextFromListenButton = document.querySelector(".next-from-listen");
const recordButton = document.querySelector(".record-button");
const transcript = document.querySelector(".transcript");
const markReviewButton = document.querySelector(".mark-review");
const nextFromReadButton = document.querySelector(".next-from-read");
const reviewItemButton = document.querySelector(".review-item-button");
const slotGrid = document.querySelector(".slot-grid");
const tileGrid = document.querySelector(".tile-grid");
const supportMeaning = document.querySelector(".support-meaning");
const ghostWord = document.querySelector(".ghost-word");
const canvas = document.querySelector(".write-canvas");
const writeInput = document.querySelector(".write-input");
const clearCanvasButton = document.querySelector(".clear-canvas");
const finishItemButton = document.querySelector(".finish-item");
const confettiLayer = document.querySelector(".confetti-layer");

const stepNames = ["listen", "read", "spell", "write"];
const reviewKey = "tinylingo.web.reviews";
const legacyMistakeKey = "tinylingo.web.mistakes";
let appData;
let selectedStageId = "grade-k";
let lessonItems = [];
let currentIndex = 0;
let currentStep = "listen";
let reviews = loadReviews();
let recognition;
let isRecording = false;
let drawing = false;
let hasInk = false;
const ctx = canvas.getContext("2d");

function speak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.78;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function loadReviews() {
  try {
    const stored = localStorage.getItem(reviewKey);
    if (stored) {
      return JSON.parse(stored);
    }

    const legacy = localStorage.getItem(legacyMistakeKey);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      localStorage.setItem(reviewKey, JSON.stringify(parsed));
      return parsed;
    }

    return [];
  } catch {
    return [];
  }
}

function saveReviews() {
  localStorage.setItem(reviewKey, JSON.stringify(reviews));
  renderReviewCount();
}

function renderReviewCount() {
  reviewCount.textContent = reviews.length;
  startReviewsButton.disabled = reviews.length === 0;
}

function stageShortLabel(title) {
  return title.replace("Starter ", "S");
}

function renderStages() {
  stageList.innerHTML = appData.grades
    .map(
      (grade) => `
        <button class="stage-button ${grade.id === selectedStageId ? "active" : ""}" type="button" data-stage="${grade.id}">
          ${stageShortLabel(grade.title)}
        </button>
      `
    )
    .join("");
}

function currentDailyItems() {
  return appData.dailyTasks[selectedStageId]?.lessonItems || [];
}

function renderHome() {
  const items = currentDailyItems();
  todayCount.textContent = `${items.length} 个`;
  renderStages();
  renderReviewCount();
}

function showLesson(items, title) {
  if (items.length === 0) {
    return;
  }

  lessonItems = items;
  currentIndex = 0;
  lessonTitle.textContent = title;
  homeScreen.classList.add("hidden");
  manualScreen.classList.add("hidden");
  lessonScreen.classList.remove("hidden");
  showStep("listen");
  renderCurrentItem();
}

function closeLesson() {
  stopRecognition();
  lessonScreen.classList.add("hidden");
  manualScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  renderHome();
}

function showManual() {
  stopRecognition();
  lessonScreen.classList.add("hidden");
  homeScreen.classList.add("hidden");
  manualScreen.classList.remove("hidden");
  manualInput.value = "";
  addManualReviewButton.disabled = true;
  window.setTimeout(() => manualInput.focus(), 80);
}

function closeManual() {
  manualScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  renderHome();
}

function currentItem() {
  return lessonItems[currentIndex];
}

function renderCurrentItem() {
  const item = currentItem();
  if (!item) {
    closeLesson();
    return;
  }

  lessonCount.textContent = `${currentIndex + 1}/${lessonItems.length}`;
  progressFill.style.width = `${(currentIndex / Math.max(lessonItems.length, 1)) * 100}%`;
  targetKind.textContent = item.kind === "word" ? "Word" : "Sentence";
  targetTitle.textContent = item.kind === "word" ? item.title : "Sentence";
  targetMeaning.textContent = item.kind === "word" ? item.meaning : item.title;
  supportMeaning.textContent = item.meaning;
  ghostWord.textContent = item.title;
  transcript.textContent = "...";
  nextFromReadButton.disabled = true;
  resetWriting();

  if (currentStep === "listen") {
    window.setTimeout(() => speak(item.audioText), 220);
  }
}

function showStep(step) {
  currentStep = step;
  document.querySelectorAll(".step-view").forEach((view) => {
    view.classList.toggle("hidden", view.dataset.step !== step);
  });

  if (step === "spell") {
    renderSpell();
  }

  if (step === "write") {
    resetWriting();
  }
}

function nextStep() {
  const nextIndex = stepNames.indexOf(currentStep) + 1;
  showStep(stepNames[nextIndex] || "write");
}

function finishCurrentItem() {
  const item = currentItem();
  reviews = reviews.filter((review) => review.id !== item.id);
  saveReviews();
  burstConfetti();

  window.setTimeout(() => {
    if (currentIndex + 1 >= lessonItems.length) {
      closeLesson();
      burstConfetti();
      return;
    }

    currentIndex += 1;
    showStep("listen");
    renderCurrentItem();
  }, 780);
}

function addReviewItem(item) {
  if (!reviews.some((review) => review.id === item.id)) {
    reviews.push(item);
    saveReviews();
  }
}

function markCurrentReviewAndAdvance() {
  const item = currentItem();
  addReviewItem(item);
  advanceToNextItem();
}

function advanceToNextItem() {
  if (currentIndex + 1 >= lessonItems.length) {
    closeLesson();
    return;
  }

  currentIndex += 1;
  showStep("listen");
  renderCurrentItem();
}

function createManualReviewItem(text) {
  const title = text.replace(/\s+/g, " ").trim();
  const idBase = normalized(title).replace(/\s+/g, "-") || "manual";
  const id = `manual-${Date.now()}-${idBase}`;
  const isSentence = normalized(title).split(" ").length > 1 || /[.!?。！？]/.test(title);

  return {
    id,
    kind: isSentence ? "sentence" : "word",
    title,
    meaning: "手动输入",
    supportText: title,
    supportTranslation: "手动输入",
    audioText: title,
    stageId: "manual"
  };
}

function addManualReviewAndStart() {
  const text = manualInput.value.trim();
  if (!text) {
    return;
  }

  const item = createManualReviewItem(text);
  addReviewItem(item);
  showLesson([item, ...reviews.filter((review) => review.id !== item.id)], "待复习");
}

function normalized(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function speechMatches(text, item) {
  const heard = normalized(text);
  const expected = normalized(item.title);

  if (item.kind === "sentence") {
    const words = expected.split(" ").filter(Boolean);
    const matched = words.filter((word) => heard.includes(word)).length;
    return matched >= Math.max(2, Math.ceil(words.length * 0.7));
  }

  return heard.includes(expected);
}

function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    transcript.textContent = "浏览器不支持朗读识别，可以直接继续。";
    nextFromReadButton.disabled = false;
    return null;
  }

  const recognizer = new SpeechRecognition();
  recognizer.lang = "en-US";
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.onresult = (event) => {
    const text = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ");
    transcript.textContent = text || "...";
    nextFromReadButton.disabled = !speechMatches(text, currentItem());
  };
  recognizer.onend = () => {
    isRecording = false;
    recordButton.classList.remove("recording");
  };
  recognizer.onerror = () => {
    transcript.textContent = "没有听清，可以再试一次。";
    isRecording = false;
    recordButton.classList.remove("recording");
  };

  return recognizer;
}

function toggleRecognition() {
  if (!recognition) {
    recognition = setupRecognition();
  }

  if (!recognition) {
    return;
  }

  if (isRecording) {
    stopRecognition();
  } else {
    transcript.textContent = "...";
    nextFromReadButton.disabled = true;
    recognition.start();
    isRecording = true;
    recordButton.classList.add("recording");
  }
}

function stopRecognition() {
  if (recognition && isRecording) {
    recognition.stop();
  }
  isRecording = false;
  recordButton.classList.remove("recording");
}

function targetUnits(item) {
  if (item.kind === "sentence") {
    return normalized(item.title).split(" ").filter(Boolean);
  }

  return item.title
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("");
}

function seededShuffle(items, seed) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    const random = ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    const swapIndex = Math.floor(random * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }

  return output;
}

function renderSpell() {
  const item = currentItem();
  const units = targetUnits(item);
  const tiles = seededShuffle(
    units.map((unit, index) => ({ id: `${item.id}-${index}-${unit}`, value: unit })),
    item.id
  );
  slotGrid.classList.toggle("sentence-slots", item.kind === "sentence");
  tileGrid.classList.toggle("sentence-tiles", item.kind === "sentence");

  slotGrid.innerHTML = units
    .map((unit, index) => `<div class="slot" data-index="${index}" data-target="${unit}">${unit}</div>`)
    .join("");
  tileGrid.innerHTML = tiles
    .map((tile) => `<button class="tile" draggable="true" type="button" data-id="${tile.id}" data-value="${tile.value}">${tile.value}</button>`)
    .join("");
}

function checkSpellDone() {
  if (!slotGrid.querySelector(".slot:not(.filled)")) {
    burstConfetti();
    window.setTimeout(() => {
      showStep("write");
      renderCurrentItem();
    }, 760);
  }
}

function burstConfetti() {
  confettiLayer.innerHTML = "";
  for (let index = 0; index < 32; index += 1) {
    const piece = document.createElement("i");
    piece.style.setProperty("--x", `${(index % 9) - 4}`);
    piece.style.setProperty("--delay", `${index * 12}ms`);
    piece.style.setProperty("--color", ["#f15f55", "#2f7dea", "#42b883", "#ffc857", "#a66cff"][index % 5]);
    confettiLayer.append(piece);
  }
  window.setTimeout(() => {
    confettiLayer.innerHTML = "";
  }, 1400);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetWriting() {
  hasInk = false;
  clearCanvas();
  writeInput.value = "";
  writeInput.classList.remove("matched");
  updateWritingReady();
}

function writingTargetMatches() {
  return normalized(writeInput.value) === normalized(currentItem()?.title || "");
}

function updateWritingReady() {
  const matches = writingTargetMatches();
  writeInput.classList.toggle("matched", matches);
  finishItemButton.disabled = !hasInk && !matches;
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const source = event.touches?.[0] || event;
  return {
    x: ((source.clientX - rect.left) / rect.width) * canvas.width,
    y: ((source.clientY - rect.top) / rect.height) * canvas.height
  };
}

function beginDraw(event) {
  event.preventDefault();
  drawing = true;
  hasInk = true;
  updateWritingReady();
  const point = canvasPoint(event);
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
}

function draw(event) {
  if (!drawing) {
    return;
  }

  event.preventDefault();
  const point = canvasPoint(event);
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#172033";
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

function endDraw() {
  drawing = false;
}

function setupEvents() {
  stageList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-stage]");
    if (!button) {
      return;
    }
    selectedStageId = button.dataset.stage;
    renderHome();
  });

  startTodayButton.addEventListener("click", () => {
    showLesson(currentDailyItems(), "今日任务");
  });

  startReviewsButton.addEventListener("click", () => {
    showLesson(reviews, "待复习");
  });

  closeLessonButton.addEventListener("click", closeLesson);
  openManualButton.addEventListener("click", showManual);
  closeManualButton.addEventListener("click", closeManual);
  manualInput.addEventListener("input", () => {
    addManualReviewButton.disabled = manualInput.value.trim().length === 0;
  });
  manualInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !addManualReviewButton.disabled) {
      event.preventDefault();
      addManualReviewAndStart();
    }
  });
  addManualReviewButton.addEventListener("click", addManualReviewAndStart);
  soundCheckButton.addEventListener("click", () => speak("Hello TinyLingo"));
  listenButton.addEventListener("click", () => speak(currentItem().audioText));
  nextFromListenButton.addEventListener("click", nextStep);
  recordButton.addEventListener("click", toggleRecognition);
  markReviewButton.addEventListener("click", markCurrentReviewAndAdvance);
  reviewItemButton.addEventListener("click", markCurrentReviewAndAdvance);
  nextFromReadButton.addEventListener("click", nextStep);
  clearCanvasButton.addEventListener("click", resetWriting);
  finishItemButton.addEventListener("click", finishCurrentItem);
  writeInput.addEventListener("input", updateWritingReady);
  writeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !finishItemButton.disabled) {
      finishCurrentItem();
    }
  });

  tileGrid.addEventListener("dragstart", (event) => {
    const tile = event.target.closest(".tile");
    if (!tile) {
      return;
    }
    event.dataTransfer.setData("text/plain", tile.dataset.id);
  });

  slotGrid.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  slotGrid.addEventListener("drop", (event) => {
    event.preventDefault();
    const slot = event.target.closest(".slot");
    const tileId = event.dataTransfer.getData("text/plain");
    const tile = tileGrid.querySelector(`[data-id="${CSS.escape(tileId)}"]`);
    if (!slot || !tile || slot.classList.contains("filled")) {
      return;
    }

    if (tile.dataset.value.toLowerCase() !== slot.dataset.target.toLowerCase()) {
      slot.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 220 }
      );
      return;
    }

    slot.textContent = tile.dataset.value;
    slot.classList.add("filled");
    tile.remove();
    checkSpellDone();
  });

  tileGrid.addEventListener("click", (event) => {
    const tile = event.target.closest(".tile");
    if (!tile) {
      return;
    }
    const nextSlot = Array.from(slotGrid.querySelectorAll(".slot:not(.filled)")).find(
      (slot) => slot.dataset.target.toLowerCase() === tile.dataset.value.toLowerCase()
    );
    if (!nextSlot) {
      return;
    }
    nextSlot.textContent = tile.dataset.value;
    nextSlot.classList.add("filled");
    tile.remove();
    checkSpellDone();
  });

  canvas.addEventListener("mousedown", beginDraw);
  canvas.addEventListener("mousemove", draw);
  window.addEventListener("mouseup", endDraw);
  canvas.addEventListener("touchstart", beginDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  window.addEventListener("touchend", endDraw);
}

async function boot() {
  if (window.__TINYLINGO_APP_DATA__) {
    appData = window.__TINYLINGO_APP_DATA__;
  } else {
    const response = await fetch("./app-data.json");
    appData = await response.json();
  }

  selectedStageId = appData.grades[0].id;
  setupEvents();
  renderHome();
}

boot().catch((error) => {
  console.error(error);
  todayCount.textContent = "数据加载失败";
  startTodayButton.disabled = true;
});
