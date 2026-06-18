// game.js — OK Permit Quest Game Engine

const ZONES = [
  { id: "downtown", name: "Downtown District", emoji: "🏙️", description: "Intersections, traffic lights & right of way" },
  { id: "school",   name: "School Zone",       emoji: "🏫", description: "School buses, crosswalks & speed limits" },
  { id: "highway",  name: "Highway Haven",     emoji: "🛣️", description: "Merging, passing & following distance" },
  { id: "weather",  name: "Rain & Night",      emoji: "🌧️", description: "Visibility, headlights & wet roads" },
  { id: "signs",    name: "Sign City",         emoji: "🚦", description: "Traffic signs, shapes & colors" },
  { id: "emergency",name: "Emergency Zone",    emoji: "🚨", description: "Emergency vehicles & Move Over law" }
];

// ─── STATE ────────────────────────────────────────────────────────────────────

let state = {
  currentZone: null,
  zoneScenarios: [],
  currentIndex: 0,
  zoneScore: 0,
  totalXP: 0,
  mistakes: [],        // { scenario, chosenIndex }
  completedZones: {},  // { zoneId: { score, total } }
  inReview: false,
  reviewQueue: [],
  reviewIndex: 0,
  allZoneMistakes: [], // for final review
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────

function saveProgress() {
  localStorage.setItem("okpq_completed", JSON.stringify(state.completedZones));
  localStorage.setItem("okpq_xp", String(state.totalXP));
}

function loadProgress() {
  try {
    const c = localStorage.getItem("okpq_completed");
    const x = localStorage.getItem("okpq_xp");
    if (c) state.completedZones = JSON.parse(c);
    if (x) state.totalXP = parseInt(x, 10) || 0;
  } catch (e) {
    state.completedZones = {};
    state.totalXP = 0;
  }
}

function resetProgress() {
  localStorage.removeItem("okpq_completed");
  localStorage.removeItem("okpq_xp");
  state.completedZones = {};
  state.totalXP = 0;
  state.allZoneMistakes = [];
}

// ─── SCREEN MANAGEMENT ────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove("hidden");
    // Force reflow then animate in
    void target.offsetWidth;
    target.classList.add("active");
  }
}

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────

function initWelcome() {
  loadProgress();
  const xpDisplay = document.getElementById("welcome-xp");
  if (state.totalXP > 0) {
    xpDisplay.textContent = `Returning player — ${state.totalXP} XP earned`;
    xpDisplay.style.display = "block";
  } else {
    xpDisplay.style.display = "none";
  }
}

function startGame() {
  showScreen("map-screen");
  renderMap();
}

// ─── MAP SCREEN ───────────────────────────────────────────────────────────────

function renderMap() {
  const grid = document.getElementById("zone-grid");
  grid.innerHTML = "";

  ZONES.forEach(zone => {
    const completed = state.completedZones[zone.id];
    const card = document.createElement("div");
    card.className = "zone-card" + (completed ? " completed" : "");
    card.setAttribute("data-zone", zone.id);
    card.innerHTML = `
      <div class="zone-emoji">${zone.emoji}</div>
      <div class="zone-info">
        <div class="zone-name">${zone.name}</div>
        <div class="zone-desc">${zone.description}</div>
        ${completed
          ? `<div class="zone-status completed-badge">✓ ${completed.score}/${completed.total} correct</div>`
          : `<div class="zone-status">5 scenarios</div>`
        }
      </div>
    `;
    card.addEventListener("click", () => selectZone(zone.id));
    grid.appendChild(card);
  });

  // Show total XP
  document.getElementById("map-xp").textContent = `Total XP: ${state.totalXP}`;

  // Show "View Final Results" if all zones done
  const allDone = ZONES.every(z => state.completedZones[z.id]);
  const finalBtn = document.getElementById("map-final-btn");
  if (allDone) {
    finalBtn.style.display = "inline-block";
  } else {
    finalBtn.style.display = "none";
  }
}

// ─── ZONE / SCENARIO FLOW ─────────────────────────────────────────────────────

function selectZone(zoneId) {
  state.currentZone = zoneId;
  state.zoneScenarios = SCENARIOS.filter(s => s.zone === zoneId);
  state.currentIndex = 0;
  state.zoneScore = 0;
  state.mistakes = [];
  state.inReview = false;
  showScreen("scenario-screen");
  loadScenario();
}

function loadScenario() {
  const scenario = state.inReview
    ? state.reviewQueue[state.reviewIndex]
    : state.zoneScenarios[state.currentIndex];

  if (!scenario) {
    if (state.inReview) {
      finishReview();
    } else {
      showZoneComplete();
    }
    return;
  }

  // Header
  const zone = ZONES.find(z => z.id === scenario.zone);
  document.getElementById("scenario-zone-label").textContent =
    `${zone ? zone.emoji : ""} ${scenario.zoneName}`;

  // Progress
  const total = state.inReview ? state.reviewQueue.length : state.zoneScenarios.length;
  const current = state.inReview ? state.reviewIndex + 1 : state.currentIndex + 1;
  document.getElementById("progress-text").textContent = `Question ${current} of ${total}`;
  const pct = (current / total) * 100;
  document.getElementById("progress-fill").style.width = pct + "%";

  // Icon
  document.getElementById("scenario-icon").textContent = scenario.icon;

  // Title & situation
  document.getElementById("scenario-title").textContent = scenario.title;
  document.getElementById("scenario-situation").textContent = scenario.situation;

  // Question
  document.getElementById("scenario-question").textContent = scenario.question;

  // Choices
  const choicesEl = document.getElementById("choices-container");
  choicesEl.innerHTML = "";
  scenario.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => handleAnswer(i, scenario));
    choicesEl.appendChild(btn);
  });

  // Tip (hidden until answer)
  document.getElementById("tip-box").style.display = "none";
  document.getElementById("feedback-box").style.display = "none";
  document.getElementById("next-btn").style.display = "none";

  // XP display
  updateXPDisplay();
}

function handleAnswer(choiceIndex, scenario) {
  const choice = scenario.choices[choiceIndex];

  // Disable all buttons
  const buttons = document.querySelectorAll(".choice-btn");
  buttons.forEach(b => b.disabled = true);

  // Highlight chosen and correct
  buttons[choiceIndex].classList.add(choice.correct ? "correct" : "wrong");
  if (!choice.correct) {
    const correctIdx = scenario.choices.findIndex(c => c.correct);
    if (correctIdx !== -1) buttons[correctIdx].classList.add("correct");
  }

  const feedback = document.getElementById("feedback-box");
  const feedbackIcon = document.getElementById("feedback-icon");
  const feedbackText = document.getElementById("feedback-text");
  const feedbackExplain = document.getElementById("feedback-explain");

  if (choice.correct) {
    state.zoneScore++;
    const xpEarned = 100;
    state.totalXP += xpEarned;
    feedback.className = "feedback-box correct-feedback";
    feedbackIcon.textContent = "✓";
    feedbackText.textContent = "Nice driving!";
    feedbackExplain.textContent = choice.explanation;
    animateXP(xpEarned);
  } else {
    feedback.className = "feedback-box wrong-feedback";
    feedbackIcon.textContent = "✗";
    feedbackText.textContent = "Not quite — check this out:";
    feedbackExplain.textContent = choice.explanation;

    // Track mistake
    if (!state.inReview) {
      state.mistakes.push({ scenario, chosenIndex: choiceIndex });
      state.allZoneMistakes.push({ scenario, chosenIndex: choiceIndex });
    }
  }

  feedback.style.display = "block";

  // Show tip
  const tipBox = document.getElementById("tip-box");
  document.getElementById("tip-text").textContent = "📌 " + scenario.tip;
  tipBox.style.display = "block";

  // Show next button
  document.getElementById("next-btn").style.display = "inline-block";

  saveProgress();
  updateXPDisplay();
}

function nextScenario() {
  if (state.inReview) {
    state.reviewIndex++;
    loadScenario();
  } else {
    state.currentIndex++;
    if (state.currentIndex >= state.zoneScenarios.length) {
      showZoneComplete();
    } else {
      loadScenario();
    }
  }
}

function updateXPDisplay() {
  document.getElementById("xp-display").textContent = `⭐ ${state.totalXP} XP`;
}

function animateXP(amount) {
  const el = document.getElementById("xp-earned-pop");
  el.textContent = `+${amount} XP`;
  el.classList.remove("pop-animate");
  void el.offsetWidth;
  el.classList.add("pop-animate");
}

// ─── ZONE COMPLETE ────────────────────────────────────────────────────────────

function showZoneComplete() {
  // Save zone results
  const zoneId = state.currentZone;
  state.completedZones[zoneId] = {
    score: state.zoneScore,
    total: state.zoneScenarios.length
  };
  saveProgress();

  const overlay = document.getElementById("zone-complete-overlay");
  document.getElementById("zone-complete-score").textContent =
    `${state.zoneScore} / ${state.zoneScenarios.length} correct`;

  const zone = ZONES.find(z => z.id === zoneId);
  document.getElementById("zone-complete-name").textContent =
    `${zone ? zone.emoji : ""} ${zone ? zone.name : ""} Complete!`;

  const pct = Math.round((state.zoneScore / state.zoneScenarios.length) * 100);
  document.getElementById("zone-complete-pct").textContent = `${pct}% accuracy`;

  overlay.style.display = "flex";
  void overlay.offsetWidth;
  overlay.classList.add("visible");
}

function closeZoneComplete() {
  const overlay = document.getElementById("zone-complete-overlay");
  overlay.classList.remove("visible");
  setTimeout(() => {
    overlay.style.display = "none";
    showScreen("map-screen");
    renderMap();
  }, 300);
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────

function showResults() {
  const overlay = document.getElementById("zone-complete-overlay");
  overlay.classList.remove("visible");
  overlay.style.display = "none";

  const totalScenarios = ZONES.length * 5; // 30 total
  let totalCorrect = 0;
  ZONES.forEach(z => {
    if (state.completedZones[z.id]) {
      totalCorrect += state.completedZones[z.id].score;
    }
  });

  const pct = Math.round((totalCorrect / totalScenarios) * 100);
  const grade = calcGrade(pct);

  document.getElementById("result-xp").textContent = state.totalXP;
  document.getElementById("result-score").textContent = `${totalCorrect} / ${totalScenarios}`;
  document.getElementById("result-pct").textContent = `${pct}%`;
  document.getElementById("result-grade").textContent = grade;
  document.getElementById("result-grade").className = "grade-letter grade-" + grade;
  document.getElementById("result-message").textContent = permitMessage(grade);

  // Zone breakdown
  const breakdown = document.getElementById("zone-breakdown");
  breakdown.innerHTML = "";
  ZONES.forEach(zone => {
    const data = state.completedZones[zone.id];
    if (data) {
      const li = document.createElement("div");
      li.className = "breakdown-row";
      const zonePct = Math.round((data.score / data.total) * 100);
      li.innerHTML = `
        <span>${zone.emoji} ${zone.name}</span>
        <span class="${zonePct >= 80 ? 'score-good' : 'score-low'}">${data.score}/${data.total} (${zonePct}%)</span>
      `;
      breakdown.appendChild(li);
    }
  });

  // Review mistakes button
  const reviewBtn = document.getElementById("review-btn");
  if (state.allZoneMistakes.length > 0) {
    reviewBtn.style.display = "inline-block";
  } else {
    reviewBtn.style.display = "none";
  }

  showScreen("results-screen");
}

function calcGrade(pct) {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

function permitMessage(grade) {
  const messages = {
    A: "🏆 Permit Ready! You have excellent knowledge of Oklahoma traffic laws. Hit that DMV with confidence!",
    B: "👍 Almost There! Strong performance — review a few areas and you'll be permit-ready in no time.",
    C: "📚 Keep Studying! You know the basics but need more practice. Focus on your weak zones before the real test.",
    D: "⚠️ More Practice Needed. Review the Oklahoma Driver's Manual and replay the zones you struggled with.",
    F: "🔄 Start Over! Don't worry — use this game to learn. Review the manual and try again. You've got this!"
  };
  return messages[grade] || messages["F"];
}

// ─── REVIEW MISTAKES ─────────────────────────────────────────────────────────

function reviewMistakes() {
  if (state.allZoneMistakes.length === 0) return;

  state.inReview = true;
  state.reviewQueue = state.allZoneMistakes.map(m => m.scenario);
  state.reviewIndex = 0;

  showScreen("scenario-screen");
  document.getElementById("scenario-zone-label").textContent = "📝 Review Mode — Your Mistakes";
  loadScenario();
}

function finishReview() {
  state.inReview = false;
  state.reviewQueue = [];
  state.reviewIndex = 0;
  showScreen("results-screen");
}

// ─── PLAY AGAIN ───────────────────────────────────────────────────────────────

function playAgain() {
  resetProgress();
  state.mistakes = [];
  state.allZoneMistakes = [];
  state.currentZone = null;
  state.currentIndex = 0;
  state.zoneScore = 0;
  showScreen("map-screen");
  renderMap();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  loadProgress();
  initWelcome();

  // Button bindings
  document.getElementById("start-btn").addEventListener("click", startGame);
  document.getElementById("next-btn").addEventListener("click", nextScenario);
  document.getElementById("zone-continue-btn").addEventListener("click", closeZoneComplete);
  document.getElementById("zone-results-btn").addEventListener("click", showResults);
  document.getElementById("review-btn").addEventListener("click", reviewMistakes);
  document.getElementById("play-again-btn").addEventListener("click", playAgain);
  document.getElementById("map-back-btn").addEventListener("click", () => {
    showScreen("welcome-screen");
    initWelcome();
  });
  document.getElementById("map-final-btn").addEventListener("click", showResults);
  document.getElementById("scenario-back-btn").addEventListener("click", () => {
    state.inReview = false;
    showScreen("map-screen");
    renderMap();
  });
});
