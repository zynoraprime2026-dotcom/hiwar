/* ================================================================
   Hiwar (حوار) — Arabic Conversation Tutor
   Chat UI, AI tutor (OpenAI-compatible API), voice in/out,
   listen & repeat with pronunciation scoring, dialects,
   tap-to-learn vocabulary, quizzes, transliteration,
   streak + mistake tracking. All state in localStorage.
   ================================================================ */

"use strict";

/* ---------------- State ---------------- */
const APP_VERSION = "2.3.0";

const LS = {
  settings: "hiwar_settings",
  streak: "hiwar_streak",
  mistakes: "hiwar_mistakes",
  history: "hiwar_history",
  vocab: "hiwar_vocab",
  goal: "hiwar_goal",
};

const state = {
  settings: {
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: "",
    tutorAvailable: false,
    model: "openai/gpt-4o-mini",
    tts: true,
    goal: 10,
  },
  scenario: "greetings",
  level: "intermediate",
  dialect: "msa",
  mode: "chat", // chat | repeat
  translations: true,
  translit: false,
  messages: [], // {role, ar, en, tr, feedback}
  busy: false,
  listening: false,
  session: { messages: 0, mistakes: 0, vocab: 0, startedAt: Date.now() },
};

/* One scenario list for both modes: guided practice and the AI tutor
   read the same definitions, so labels and levels never drift apart. */
const SCENARIOS = Object.fromEntries(
  Object.entries((window.HiwarGuided && window.HiwarGuided.scenes) || {}).map(([key, scene]) => [
    key,
    {
      label: scene.label || scene.title,
      level: scene.level || "beginner",
      opener: scene.ai?.opener || "",
      en: scene.ai?.en || "",
      brief: scene.ai?.brief || "",
    },
  ])
);

const LEVEL_GUIDE = {
  beginner: "The user is a BEGINNER. Use only very simple sentences (under 8 words), high-frequency vocabulary, and full vocalization (tashkeel) on every word.",
  intermediate: "The user is INTERMEDIATE. Use natural everyday vocabulary and varied sentence structures. Occasional idioms are fine if explained.",
  advanced: "The user is ADVANCED. Use rich, natural Arabic including idioms, nuanced expressions, and more complex structures.",
};

const DIALECT_GUIDE = {
  msa: "Speak Modern Standard Arabic (فصحى) only.",
  egyptian: "Speak Egyptian colloquial Arabic (العامية المصرية) — everyday Cairene Egyptian.",
  levantine: "Speak Levantine colloquial Arabic (العامية الشامية) — everyday Syrian/Lebanese/Jordanian style.",
};

const SR_LOCALE = { msa: "ar-SA", egyptian: "ar-EG", levantine: "ar-LB" };

/* ---------------- Utilities ---------------- */
const $ = (id) => document.getElementById(id);

function loadLS(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v !== null ? v : fallback;
  } catch {
    return fallback;
  }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function loadSettings() {
  const s = loadLS(LS.settings, null);
  if (s) Object.assign(state.settings, s);
}
function saveSettings() { saveLS(LS.settings, state.settings); }

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* ---------------- Streak ---------------- */
function getStreak() {
  return loadLS(LS.streak, { days: 0, lastDate: null });
}
function touchStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const st = getStreak();
  if (st.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  st.days = st.lastDate === yesterday ? st.days + 1 : 1;
  st.lastDate = today;
  saveLS(LS.streak, st);
  renderStreak();
}
function renderStreak() {
  $("streak-count").textContent = getStreak().days;
}

/* ---------------- Daily goal ---------------- */
function getGoalProgress() {
  const today = new Date().toISOString().slice(0, 10);
  const p = loadLS(LS.goal, { date: today, count: 0 });
  if (p.date !== today) return { date: today, count: 0 };
  return p;
}
function renderGoalChip() {
  const p = getGoalProgress();
  $("goal-count").textContent = Math.min(p.count, state.settings.goal) + "/" + state.settings.goal;
  $("goal-chip")?.classList.toggle("done", p.count >= state.settings.goal);
}
function touchGoal() {
  const p = getGoalProgress();
  p.count += 1;
  saveLS(LS.goal, p);
  renderGoalChip();
  const done = p.count >= state.settings.goal;
  $("goal-chip")?.classList.toggle("done", done);
  if (p.count === state.settings.goal) showToast("🎯 Daily goal reached — great work!");
}
function showToast(text) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 30);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 3800);
}

/* ---------------- Mistakes & vocabulary ---------------- */
function getMistakes() { return loadLS(LS.mistakes, []); }
function recordMistake(userText, note) {
  const mistakes = getMistakes();
  const norm = userText.trim().slice(0, 120);
  const existing = mistakes.find((m) => m.ar === norm);
  if (existing) {
    existing.count += 1;
    existing.note = note;
    existing.date = new Date().toISOString();
  } else {
    mistakes.unshift({ ar: norm, note, count: 1, date: new Date().toISOString() });
  }
  saveLS(LS.mistakes, mistakes.slice(0, 40));
  state.session.mistakes += 1;
}
function getVocab() { return loadLS(LS.vocab, []); }
function saveVocabWord(word, meaning, sentence) {
  const vocab = getVocab();
  const norm = word.trim();
  if (vocab.some((v) => v.word === norm)) return false;
  vocab.unshift({ word: norm, meaning, sentence: sentence || "", date: new Date().toISOString(), seen: 1 });
  saveLS(LS.vocab, vocab.slice(0, 200));
  state.session.vocab += 1;
  return true;
}

/* ---------------- Study modal (mistakes + vocab lists) ---------------- */
function renderStudyLists() {
  // mistakes
  const mistakes = getMistakes();
  const mWrap = $("mistakes-list");
  $("mistakes-n").textContent = mistakes.length;
  mWrap.innerHTML = "";
  if (!mistakes.length) {
    mWrap.innerHTML = '<p class="empty-note">No mistakes recorded yet. Practice more — mistakes are how we learn! 🌱</p>';
  } else {
    for (const m of mistakes.slice(0, 15)) {
      const card = document.createElement("div");
      card.className = "mistake-card";
      card.innerHTML = `<div class="m-count">× ${m.count}</div>
        <div class="m-ar">${escapeHtml(m.ar)}</div>
        <div class="m-note">${escapeHtml(m.note)}</div>`;
      mWrap.appendChild(card);
    }
  }
  // vocabulary
  const vocab = getVocab();
  const vWrap = $("vocab-list");
  $("vocab-n").textContent = vocab.length;
  vWrap.innerHTML = "";
  if (!vocab.length) {
    vWrap.innerHTML = '<p class="empty-note">Tap any word in the tutor\'s replies to look it up and save it here.</p>';
  } else {
    for (const v of vocab.slice(0, 30)) {
      const card = document.createElement("div");
      card.className = "mistake-card";
      card.innerHTML = `<div class="m-ar">${escapeHtml(v.word)}
          <button class="word-del" data-word="${escapeHtml(v.word)}" title="Remove">×</button></div>
        <div class="m-note">${escapeHtml(v.meaning)}</div>`;
      vWrap.appendChild(card);
    }
    vWrap.querySelectorAll(".word-del").forEach((b) =>
      b.addEventListener("click", () => {
        const w = b.dataset.word;
        saveLS(LS.vocab, getVocab().filter((v) => v.word !== w));
        renderStudyLists();
      })
    );
  }
}

/* ---------------- Quizzes ---------------- */
const quiz = { type: null, items: [], idx: 0, score: 0, order: [], front: true };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Saved words first; the built-in dictionary fills in so a first-time
   visitor can still practise instead of hitting an empty quiz. */
function quizPool() {
  const vocab = getVocab().map((v) => ({ word: v.word, meaning: v.meaning, saved: true }));
  const saved = new Set(vocab.map((v) => v.word));
  const extra = (typeof DICTIONARY !== "undefined" ? DICTIONARY : [])
    .map((d) => ({
      word: d.ar,
      meaning: (DICT_POS[d.pos] || d.pos) + ": " + d.en,
      saved: false,
    }))
    .filter((d) => !saved.has(d.word));
  return { vocab, extra };
}

function startVocabQuiz() {
  const { vocab, extra } = quizPool();
  quiz.type = "vocab";
  quiz.fromDictionary = vocab.length < 4;
  quiz.items = quiz.fromDictionary
    ? shuffle([...vocab, ...extra]).slice(0, 8)
    : shuffle(vocab).slice(0, 10);
  if (!quiz.items.length) {
    alert("The dictionary could not be loaded. Reload the page and try again.");
    return;
  }
  quiz.idx = 0;
  quiz.score = 0;
  showQuizArea();
  renderVocabQuestion();
}

function renderVocabQuestion() {
  const item = quiz.items[quiz.idx];
  $("quiz-progress").textContent =
    `Question ${quiz.idx + 1} / ${quiz.items.length}` +
    (quiz.fromDictionary ? " · practising from the built-in dictionary" : "");
  $("quiz-word").textContent = item.word;
  $("quiz-feedback").textContent = "";
  $("quiz-feedback").className = "quiz-feedback";
  $("quiz-next").classList.add("hidden");
  $("quiz-done").classList.add("hidden");

  const pool = quizPool();
  const distractors = shuffle([...pool.vocab, ...pool.extra].filter((v) => v.word !== item.word)).slice(0, 3);
  const options = shuffle([item, ...distractors]);
  const wrap = $("quiz-options");
  wrap.innerHTML = "";
  for (const opt of options) {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt.meaning;
    btn.addEventListener("click", () => {
      if (btn.dataset.done) return;
      document.querySelectorAll(".quiz-option").forEach((o) => {
        o.dataset.done = "1";
        o.classList.add(o.dataset.word === item.word ? "correct" : "dim");
      });
      const correct = opt.word === item.word;
      if (correct) {
        quiz.score += 1;
        $("quiz-feedback").textContent = "✅ Correct!";
      } else {
        $("quiz-feedback").textContent = "❌ Correct answer: " + item.meaning;
      }
      $("quiz-feedback").className = "quiz-feedback " + (correct ? "good" : "bad");
      if (quiz.idx + 1 < quiz.items.length) $("quiz-next").classList.remove("hidden");
      else finishQuiz();
    });
    btn.dataset.word = opt.word;
    wrap.appendChild(btn);
  }
}

function startMistakesQuiz() {
  const mistakes = getMistakes();
  if (!mistakes.length) {
    alert("No mistakes recorded yet — chat with the tutor first.");
    return;
  }
  quiz.type = "mistakes";
  quiz.items = shuffle(mistakes).slice(0, 12);
  quiz.idx = 0;
  quiz.score = 0;
  showQuizArea();
  renderMistakesCard();
}

function renderMistakesCard() {
  const item = quiz.items[quiz.idx];
  $("quiz-progress").textContent = `Card ${quiz.idx + 1} / ${quiz.items.length}`;
  $("quiz-word").textContent = item.ar;
  $("quiz-word").classList.add("quiz-word-en");
  $("quiz-feedback").textContent = "";
  $("quiz-feedback").className = "quiz-feedback";
  $("quiz-next").classList.add("hidden");
  $("quiz-done").classList.add("hidden");

  const wrap = $("quiz-options");
  wrap.innerHTML = "";
  const reveal = document.createElement("button");
  reveal.className = "quiz-option";
  reveal.textContent = "👆 Tap to see the correction";
  reveal.addEventListener("click", () => {
    reveal.textContent = item.note;
    reveal.classList.add("revealed");
    $("quiz-feedback").textContent = "Did you remember the fix?";
    $("quiz-feedback").className = "quiz-feedback";
    if (quiz.idx + 1 < quiz.items.length) $("quiz-next").classList.remove("hidden");
    else finishQuiz();
  });
  wrap.appendChild(reveal);
}

function finishQuiz() {
  $("quiz-word").textContent = "";
  $("quiz-word").classList.remove("quiz-word-en");
  $("quiz-options").innerHTML = "";
  $("quiz-feedback").textContent = "";
  const pct = Math.round((quiz.score / quiz.items.length) * 100);
  $("quiz-done").classList.remove("hidden");
  $("quiz-done").innerHTML = `
    <p class="quiz-score">${quiz.score} / ${quiz.items.length} correct</p>
    <p class="quiz-pct">${pct}%</p>
    <p class="quiz-msg">${pct >= 80 ? "Excellent work! 🌟" : pct >= 50 ? "Good progress — keep going! 💪" : "Keep practicing, you'll get there. 🌱"}</p>`;
  $("quiz-next").classList.add("hidden");
}

function showQuizArea() {
  $("quiz-area").classList.remove("hidden");
  $("study-lists").classList.add("hidden");
  $("btn-quiz-vocab").classList.add("hidden");
  $("btn-quiz-mistakes").classList.add("hidden");
  $("btn-quiz-back").classList.remove("hidden");
  if (quiz.type === "vocab") $("quiz-word").classList.remove("quiz-word-en");
}
function showStudyLists() {
  $("quiz-area").classList.add("hidden");
  $("study-lists").classList.remove("hidden");
  $("btn-quiz-vocab").classList.remove("hidden");
  $("btn-quiz-mistakes").classList.remove("hidden");
  $("btn-quiz-back").classList.add("hidden");
  $("quiz-done").classList.add("hidden");
}

/* ---------------- Chat rendering ---------------- */
function addMessage(msg, opts = {}) {
  if (!opts.skipPush) state.messages.push(msg);
  const chat = $("chat");
  const wrap = document.createElement("div");
  wrap.className = msg.role === "user" ? "msg user" : "msg msg-bot";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = msg.role === "user" ? "🙂" : "ح";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const ar = document.createElement("div");
  ar.className = "ar";
  if (msg.role === "assistant") {
    // tap-to-learn: wrap each word
    for (const token of msg.ar.split(/(\s+)/)) {
      if (!token) continue;
      if (/^\s+$/.test(token)) { ar.appendChild(document.createTextNode(" ")); continue; }
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = token;
      span.addEventListener("click", (e) => {
        e.stopPropagation();
        openWordPopup(token, msg.ar);
      });
      ar.appendChild(span);
    }
  } else {
    ar.textContent = msg.ar;
  }
  bubble.appendChild(ar);

  if (msg.role === "assistant" && state.translit && (msg.tr || msg.en)) {
    const tr = document.createElement("div");
    tr.className = "tr";
    tr.textContent = msg.tr || translitFallback(msg.ar);
    bubble.appendChild(tr);
  }

  if (msg.en && (state.translations || msg.role === "user")) {
    const en = document.createElement("div");
    en.className = "en";
    en.textContent = msg.en;
    bubble.appendChild(en);
  }

  if (msg.feedback && msg.feedback.toLowerCase() !== "none") {
    const fb = document.createElement("div");
    fb.className = "feedback";
    fb.innerHTML = "<b>✏️ Correction:</b> " + escapeHtml(msg.feedback);
    bubble.appendChild(fb);
  }

  if (msg.role === "assistant" && !msg.en) {
    const tbtn = document.createElement("button");
    tbtn.type = "button";
    tbtn.className = "translate-btn";
    tbtn.textContent = "🌐 Translate";
    tbtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      tbtn.disabled = true;
      tbtn.textContent = "Translating…";
      try {
        const en = await translateArabic(msg.ar);
        msg.en = en;
        const enDiv = document.createElement("div");
        enDiv.className = "en";
        enDiv.textContent = en;
        tbtn.replaceWith(enDiv);
        saveLS(LS.history, { scenario: state.scenario, messages: state.messages.slice(-40) });
      } catch {
        tbtn.disabled = false;
        tbtn.textContent = "🌐 Retry translate";
      }
    });
    bubble.appendChild(tbtn);
  }

  if (msg.role === "assistant" && !opts.noSpeakTag) {
    const tag = document.createElement("div");
    tag.className = "speak-tag";
    tag.textContent = "🔊 tap to listen";
    bubble.appendChild(tag);
  }

  if (msg.role === "assistant") {
    bubble.title = "Click to listen";
    bubble.addEventListener("click", () => speakArabic(msg.ar));
  }

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
  if (!opts.skipPush) saveLS(LS.history, { scenario: state.scenario, messages: state.messages.slice(-40) });
}

function renderAll() {
  const msgs = [...state.messages];
  $("chat").innerHTML = "";
  state.messages = [];
  for (const m of msgs) addMessage(m, { skipPush: true });
}

function addTyping() {
  const chat = $("chat");
  const wrap = document.createElement("div");
  wrap.className = "msg msg-bot";
  wrap.id = "typing";
  wrap.innerHTML = `<div class="avatar">ح</div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}
function removeTyping() { $("typing")?.remove(); }

/* ---------------- Transliteration (fallback) ---------------- */
const TRANSLIT_MAP = {
  "ا": "a", "ب": "b", "ت": "t", "ث": "th", "ج": "j", "ح": "ḥ", "خ": "kh",
  "د": "d", "ذ": "dh", "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "ṣ",
  "ض": "ḍ", "ط": "ṭ", "ظ": "ẓ", "ع": "ʻ", "غ": "gh", "ف": "f", "ق": "q",
  "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "و": "w", "ي": "y",
  "ى": "a", "ة": "a", "ء": "'", "آ": "aa", "أ": "a", "إ": "i", "ؤ": "u", "ئ": "i",
  "َ": "a", "ُ": "u", "ِ": "i", "ً": "an", "ٌ": "un", "ٍ": "in",
};
function translitFallback(text) {
  let out = "";
  for (const ch of String(text || "")) {
    if (ch === "ّ") { out += out.slice(-1); continue; } // shadda: double previous
    if (ch === "ـ") continue;
    out += TRANSLIT_MAP[ch] ?? ch;
  }
  return out.replace(/\s+/g, " ").trim();
}

/* ---------------- Text-to-speech ---------------- */
let arabicVoice = null;
function pickArabicVoice() {
  const voices = speechSynthesis.getVoices();
  arabicVoice =
    voices.find((v) => new RegExp("^ar(-(" + state.dialect.slice(0,2).toUpperCase() + "|SA|EG|AE|LB))?$", "i").test(v.lang)) ||
    voices.find((v) => /^ar/i.test(v.lang)) ||
    null;
}
speechSynthesis.onvoiceschanged = pickArabicVoice;
pickArabicVoice();

function speakArabic(text) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const locale = SR_LOCALE[state.dialect] || "ar-SA";
    u.lang = locale === "ar-LB" ? "ar-SA" : locale;
    if (arabicVoice) u.voice = arabicVoice;
    u.rate = state.level === "beginner" ? 0.8 : 0.95;
    speechSynthesis.speak(u);
  } catch (e) {
    console.warn("TTS failed", e);
  }
}

/* ---------------- Speech recognition ---------------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (SR) {
  recognition = new SR();
  recognition.lang = "ar-SA";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    if (window.HiwarGuided && window.HiwarGuided.handleSpeech(text)) return;
    if (state.mode === "repeat") handleRepeatAttempt(text);
    else { $("input").value = text; sendMessage(text); }
  };
  recognition.onend = () => setListening(false);
  recognition.onerror = () => setListening(false);
}
function setListening(on) {
  state.listening = on;
  $("btn-mic").classList.toggle("rec", on);
  $("listening-pill").classList.toggle("hidden", !on);
  $("btn-repeat-mic")?.classList.toggle("rec", on);
}
function startListening() {
  if (!recognition) {
    alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
    return;
  }
  if (state.listening) { recognition.stop(); return false; }
  recognition.lang = SR_LOCALE[state.dialect] || "ar-SA";
  try { recognition.start(); setListening(true); return true; } catch { return false; }
}
function toggleMic() { startListening(); }

/* ---------------- AI plumbing ---------------- */
function buildHeaders() {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + state.settings.apiKey,
  };
  if (/openrouter/i.test(state.settings.baseUrl)) {
    headers["HTTP-Referer"] = location.origin || "https://zynoraprime2026-dotcom.github.io";
    headers["X-Title"] = "Hiwar Arabic Tutor";
  }
  return headers;
}

function friendlyApiError(status) {
  if (status === 401 || status === 403) {
    return "That API key was not accepted. Open Settings ⚙️ and check the key, or create a fresh one at openrouter.ai/keys.";
  }
  if (status === 402) {
    return "This API key has run out of credit. Add credit with your AI provider, or pick a free model in Settings.";
  }
  if (status === 404) {
    return "The API address or model name was not found. Check the base URL and model in Settings.";
  }
  if (status === 429) {
    return "Too many requests just now. Wait a few seconds, then try again.";
  }
  if (status >= 500) {
    return "The AI service is having trouble right now. Please try again in a moment.";
  }
  return "The AI request failed (HTTP " + status + "). Check your settings, then try again.";
}

/* Is any tutor reachable? Either the learner's own key or the shared endpoint. */
function hasAI() {
  return Boolean(state.settings.apiKey) || state.tutorAvailable;
}

/* Ask the deployment whether a shared tutor is switched on. */
async function probeTutor() {
  try {
    const res = await fetch("/api/tutor", { method: "GET" });
    if (!res.ok) throw new Error("no endpoint");
    const data = await res.json();
    state.tutorAvailable = Boolean(data.configured);
  } catch {
    state.tutorAvailable = false;
  }
  renderTutorHint();
}

function renderTutorHint() {
  const hint = $("tutor-hint");
  if (!hint) return;
  hint.textContent = state.tutorAvailable
    ? "The tutor here is shared and free, with a daily limit. "
    : "AI key is optional — guided practice works without one. ";
  const link = $("btn-open-settings");
  if (link) link.textContent = state.tutorAvailable ? "Your own key" : "AI key";
}

/* Talk to the shared endpoint, which holds the key on the server. */
async function tutorCompletion(messages, maxTokens, temperature) {
  const res = await fetch("/api/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, max_tokens: maxTokens, temperature }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || friendlyApiError(res.status));
    err.code = data.error || "tutor";
    err.status = res.status;
    if (err.code === "not_configured") {
      state.tutorAvailable = false;
      renderTutorHint();
    }
    throw err;
  }
  state.tutorAvailable = true;
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

async function chatCompletion(messages, maxTokens = 400, temperature = 0.8) {
  if (!state.settings.apiKey) return tutorCompletion(messages, maxTokens, temperature);
  const url = state.settings.baseUrl.replace(/\/+$/, "") + "/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      model: state.settings.model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // Keep the technical detail for developers, show the learner plain language.
    console.warn("Hiwar: AI request failed", res.status, body.slice(0, 500));
    const err = new Error(friendlyApiError(res.status));
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

async function translateArabic(text) {
  return chatCompletion(
    [
      { role: "system", content: "Translate the user's Arabic text into natural English. Reply with ONLY the English translation. No Arabic, no explanations, no quotes." },
      { role: "user", content: text },
    ],
    200,
    0.3
  );
}

function sanitizeAI(raw) {
  return String(raw ?? "")
    .replace(/```[a-zA-Z]*\n?/g, "")
    .replace(/[*#>`_~]/g, "")
    .trim();
}

function parseAI(raw) {
  raw = sanitizeAI(raw);
  const out = { ar: "", en: "", tr: "", feedback: "none" };
  const arM = raw.match(/AR\s*[:：]\s*([\s\S]*?)(?=\n\s*EN\s*[:：]|\n\s*TR\s*[:：]|\n\s*FEEDBACK\s*[:：]|$)/i);
  const enM = raw.match(/EN\s*[:：]\s*([\s\S]*?)(?=\n\s*TR\s*[:：]|\n\s*FEEDBACK\s*[:：]|$)/i);
  const trM = raw.match(/TR\s*[:：]\s*([\s\S]*?)(?=\n\s*EN\s*[:：]|\n\s*FEEDBACK\s*[:：]|$)/i);
  const fbM = raw.match(/FEEDBACK\s*[:：]\s*([\s\S]*)$/i);
  if (arM) out.ar = arM[1].trim();
  if (enM) out.en = enM[1].trim();
  if (trM) out.tr = trM[1].trim();
  if (fbM) out.feedback = fbM[1].trim();
  if (!out.ar) out.ar = raw.trim();
  return out;
}

function systemPrompt() {
  const sc = SCENARIOS[state.scenario];
  return [
    "You are Ustadh Hiwar (حوار), a warm, patient Arabic conversation tutor for foreign learners.",
    DIALECT_GUIDE[state.dialect],
    LEVEL_GUIDE[state.level],
    `Current role-play scenario: ${sc.label}. ${sc.brief}`,
    "Keep replies short (1-3 sentences), natural, and always end with a question to keep the conversation flowing.",
    "ALWAYS respond in EXACTLY this plain-text format, nothing else:",
    "AR: <your Arabic reply>",
    "TR: <Latin transliteration of your reply, e.g. 'Sabah al-khayr! Kayf haluk?'>",
    "EN: <English translation of your reply>",
    "FEEDBACK: <if the user's last message had a grammar, vocabulary, or spelling mistake, briefly explain it in simple English and show the corrected Arabic; if it was correct or this is the first message, write: none>",
    "",
    "Example of your EXACT response format:",
    "AR: صباح الخير! كيف حالك اليوم؟",
    "TR: Sabah al-khayr! Kayf haluk al-yawm?",
    "EN: Good morning! How are you today?",
    "FEEDBACK: none",
    "",
    "Never use markdown, bold text, or extra labels. Always output all four lines (AR, TR, EN, FEEDBACK) on every reply.",
  ].join("\n");
}

function historyForAPI() {
  const msgs = [{ role: "system", content: systemPrompt() }];
  for (const m of state.messages.slice(-16)) {
    msgs.push({ role: m.role, content: m.ar });
  }
  return msgs;
}

async function callAI() {
  return parseAI(await chatCompletion(historyForAPI(), 400, 0.8));
}

async function sendMessage(textOverride) {
  if (state.busy) return;
  const text = (textOverride ?? $("input").value).trim();
  if (!text) return;

  if (!hasAI()) {
    if (window.HiwarGuided && window.HiwarGuided.isActive()) {
      $("input").value = "";
      window.HiwarGuided.textAnswer(text);
      return;
    }
    showKeyNotice();
    return;
  }

  $("input").value = "";
  addMessage({ role: "user", ar: text, en: "", tr: "", feedback: "none" });
  state.session.messages += 1;
  touchGoal();
  state.busy = true;
  $("btn-send").disabled = true;
  addTyping();

  try {
    const reply = await callAI();
    removeTyping();
    addMessage({ role: "assistant", ar: reply.ar, en: reply.en, tr: reply.tr, feedback: reply.feedback });
    touchStreak();
    if (reply.feedback && reply.feedback.toLowerCase() !== "none") {
      recordMistake(text, reply.feedback);
    }
    if (!reply.en && reply.ar) {
      try {
        const en = await translateArabic(reply.ar);
        const last = state.messages[state.messages.length - 1];
        if (last && last.role === "assistant" && !last.en) {
          last.en = en;
          renderAll();
        }
      } catch { /* keep the manual Translate button */ }
    }
    if (state.settings.tts) speakArabic(reply.ar);
  } catch (err) {
    removeTyping();
    addMessage({
      role: "assistant",
      ar: "عذراً، حدث خطأ في الاتصال.",
      en: "Sorry, there was a connection error: " + err.message,
      tr: "",
      feedback: "none",
    }, { noSpeakTag: true });
  } finally {
    state.busy = false;
    $("btn-send").disabled = false;
    $("input").focus();
  }
}

/* A typed message with no key: offer the free path instead of a modal. */
/* One tap to tell the maintainer that a line of Arabic is wrong. */
function reportMistake() {
  const scene = SCENARIOS[state.scenario];
  const where = scene ? "\nScene: " + scene.label : "";
  const body = [
    "What is wrong? (the Arabic, the translation, the transliteration, or the app itself)",
    "",
    "",
    "---",
    "Version: " + APP_VERSION + where,
    "Page: " + location.href,
  ].join("\n");
  const url =
    "https://github.com/zynoraprime2026-dotcom/hiwar/issues/new" +
    "?title=" + encodeURIComponent("Mistake in Hiwar: ") +
    "&body=" + encodeURIComponent(body) +
    "&labels=content";
  window.open(url, "_blank", "noopener");
}

function showKeyNotice() {
  if ($("chat").querySelector(".key-notice")) return;
  const wrap = document.createElement("div");
  wrap.className = "msg msg-bot key-notice";
  wrap.innerHTML =
    '<div class="avatar">ح</div>' +
    '<div class="bubble">' +
    '<div class="en">The AI tutor is not reachable right now. Guided practice needs nothing at all, and it works offline.</div>' +
    '<div class="key-notice-actions">' +
    '<button type="button" class="primary" id="notice-guided">🧭 Try guided practice</button>' +
    '<button type="button" id="notice-key">⚙️ Connect a key</button>' +
    "</div></div>";
  $("chat").appendChild(wrap);
  $("chat").scrollTop = $("chat").scrollHeight;
  wrap.querySelector("#notice-guided").addEventListener("click", () => {
    wrap.remove();
    startGuidedMode();
  });
  wrap.querySelector("#notice-key").addEventListener("click", openSettings);
}

function startGuidedMode() {
  if (!window.HiwarGuided) return;
  document.querySelectorAll(".mode-btn").forEach((x) => x.classList.remove("active"));
  document.querySelector('.mode-btn[data-mode="guided"]')?.classList.add("active");
  state.mode = "guided";
  exitRepeatMode();
  $("dict-panel").classList.add("hidden");
  window.HiwarGuided.start(state.scenario);
}

/* ---------------- Listen & Repeat mode ---------------- */
let repeatPhrase = null; // {ar, en, tr}

async function fetchRepeatPhrase() {
  if (!hasAI()) { showKeyNotice(); return; }
  const sc = SCENARIOS[state.scenario];
  $("repeat-phrase").textContent = "…";
  $("repeat-en").textContent = "";
  $("repeat-tr").textContent = "";
  $("repeat-result").classList.add("hidden");
  try {
    const raw = await chatCompletion(
      [
        { role: "system", content: [
            "You create listen-and-repeat practice phrases for an Arabic learner.",
            DIALECT_GUIDE[state.dialect],
            LEVEL_GUIDE[state.level],
            `Scenario: ${sc.label}.`,
            "Give ONE short useful sentence (5-10 words)." +
              (state.level === "beginner" ? " Include full tashkeel (vocalization)." : "") +
              " Vary the topic each time.",
            "Respond ONLY in this format:",
            "AR: <Arabic sentence>",
            "TR: <Latin transliteration>",
            "EN: <English translation>",
          ].join("\n") },
        { role: "user", content: previousPhrase ? "Give a NEW sentence, different from: " + previousPhrase.ar : "Give a sentence." },
      ],
      200,
      1.0
    );
    const parsed = parseAI(raw);
    repeatPhrase = parsed;
    $("repeat-phrase").textContent = parsed.ar;
    $("repeat-en").textContent = state.translations && parsed.en ? parsed.en : "";
    const trEl = $("repeat-tr");
    trEl.textContent = parsed.tr || translitFallback(parsed.ar);
    trEl.classList.toggle("hidden", !state.translit);
    if (state.settings.tts) setTimeout(() => speakArabic(parsed.ar), 300);
  } catch (err) {
    $("repeat-phrase").textContent = "⚠️ " + err.message;
  }
}

/* Arabic text normalization for comparison */
function normalizeArabic(text) {
  return String(text || "")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // diacritics + tatweel
    .replace(/[.,!?؟،؛:؛…«»"'()\-]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

function wordSimilarity(target, said) {
  const t = normalizeArabic(target).split(" ").filter(Boolean);
  const s = normalizeArabic(said).split(" ").filter(Boolean);
  if (!t.length || !s.length) return { score: 0, missed: t };
  // LCS length
  const dp = Array.from({ length: t.length + 1 }, () => new Array(s.length + 1).fill(0));
  for (let i = 1; i <= t.length; i++) {
    for (let j = 1; j <= s.length; j++) {
      dp[i][j] = t[i - 1] === s[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const lcs = dp[t.length][s.length];
  const score = Math.round((2 * lcs * 100) / (t.length + s.length));
  const missed = [];
  let i = t.length, j = s.length;
  while (i > 0 && j > 0) {
    if (t[i - 1] === s[j - 1]) { i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) { missed.unshift(t[i - 1]); i--; }
    else j--;
  }
  while (i > 0) { missed.unshift(t[i - 1]); i--; }
  return { score, missed: missed.filter((w) => w) };
}

function handleRepeatAttempt(saidText) {
  if (!repeatPhrase) return;
  $("repeat-said").textContent = "You said: " + saidText;
  const { score, missed } = wordSimilarity(repeatPhrase.ar, saidText);
  $("score-fill").style.width = Math.max(4, score) + "%";
  $("score-fill").style.background = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  $("repeat-verdict").textContent =
    score >= 85 ? "🌟 Excellent pronunciation!" :
    score >= 60 ? "💪 Close! Listen again and repeat." :
    "🌱 Keep trying — tap 🔊 to hear it slowly.";
  $("repeat-missed").textContent = missed.length ? "Words to work on: " + missed.join(" ") : "";
  $("repeat-result").classList.remove("hidden");
  touchStreak();
  touchGoal();
}

let previousPhrase = null;
function enterRepeatMode() {
  $("chat").classList.add("hidden");
  $("composer").classList.add("hidden");
  $("repeat-panel").classList.remove("hidden");
  if (!repeatPhrase) fetchRepeatPhrase();
}
function exitRepeatMode() {
  $("chat").classList.remove("hidden");
  $("composer").classList.remove("hidden");
  $("repeat-panel").classList.add("hidden");
}

/* ---------------- Word popup (tap-to-learn) ---------------- */
let currentWord = null;

function cleanWord(token) {
  return token.replace(/[.,!?؟،؛:…"«»()\-]/g, "").trim();
}

async function openWordPopup(token, sentence) {
  const word = cleanWord(token);
  if (!word) return;
  currentWord = { word, sentence };
  $("word-title").textContent = word;
  $("word-context").textContent = sentence ? '"' + sentence + '"' : "";
  $("word-meaning").textContent = "Looking up…";
  $("btn-word-save").disabled = true;
  $("btn-word-save").textContent = "💾 Save to vocabulary";
  openModal("modal-word");

  if (!hasAI()) {
    const hit = findInDictionary(word);
    if (hit) {
      currentWord.meaning = (DICT_POS[hit.pos] || hit.pos) + ": " + hit.en;
      $("word-meaning").textContent = currentWord.meaning;
      $("btn-word-save").disabled = false;
    } else {
      $("word-meaning").textContent = "Add your API key in Settings for full lookups — or find the word in the built-in dictionary (📖).";
    }
    return;
  }
  try {
    const meaning = await chatCompletion(
      [
        { role: "system", content: "You are a concise Arabic-English dictionary. The user gives an Arabic word and the sentence it appeared in. Reply with ONLY its meaning in this format: '<part of speech>: <short English meaning>'. Maximum 2 lines. No Arabic in the reply except the word itself if needed." },
        { role: "user", content: `Word: ${word}\nSentence: ${sentence || "(none)"}` },
      ],
      120,
      0.3
    );
    currentWord.meaning = meaning;
    $("word-meaning").textContent = meaning;
    $("btn-word-save").disabled = false;
  } catch (err) {
    $("word-meaning").textContent = "Lookup failed: " + err.message;
  }
}

/* ---------------- Dictionary (browse alif to yāʾ + search) ---------------- */
const dictView = { letter: "ا", search: "" };

function openDictionary() {
  $("chat").classList.add("hidden");
  $("composer").classList.add("hidden");
  $("repeat-panel").classList.add("hidden");
  $("dict-panel").classList.remove("hidden");
  renderDictLetters();
  renderDictResults();
}

function closeDictionary() {
  $("dict-panel").classList.add("hidden");
  $("chat").classList.remove("hidden");
  $("composer").classList.remove("hidden");
}

function renderDictLetters() {
  const wrap = $("dict-letters");
  const counts = dictCounts();
  wrap.innerHTML = "";
  for (const l of DICT_LETTERS) {
    const btn = document.createElement("button");
    const active = !dictView.search && dictView.letter === l;
    btn.className = "dict-letter-btn" + (active ? " active" : "");
    btn.dataset.letter = l;
    btn.title = "Words starting with " + l;
    btn.innerHTML = `${l}<span class="cnt">${counts[l] || 0}</span>`;
    btn.addEventListener("click", () => {
      dictView.letter = l;
      dictView.search = "";
      $("dict-search").value = "";
      $("btn-dict-clear").classList.add("hidden");
      renderDictLetters();
      renderDictResults();
    });
    wrap.appendChild(btn);
  }
}

function renderDictResults() {
  const list = $("dict-list");
  const status = $("dict-status");
  list.innerHTML = "";
  let entries;
  if (dictView.search) {
    entries = searchDictionary(dictView.search);
    status.textContent = `${entries.length} result${entries.length === 1 ? "" : "s"} for “${dictView.search}”`;
  } else {
    entries = entriesByLetter(dictView.letter);
    status.textContent = `Letter ${dictView.letter} — ${entries.length} words`;
  }
  if (!entries.length) {
    list.innerHTML = '<p class="dict-empty">No words found. Try another spelling, or search in English.</p>';
    return;
  }
  for (const e of entries) list.appendChild(dictWordCard(e));
}

function dictWordCard(e) {
  const card = document.createElement("div");
  card.className = "dict-word";
  const top = document.createElement("div");
  top.className = "dict-word-top";
  const ar = document.createElement("div");
  ar.className = "dict-word-ar";
  ar.textContent = e.ar;
  ar.title = "Tap to hear it";
  ar.addEventListener("click", () => speakArabic(e.ar));
  const pos = document.createElement("span");
  pos.className = "dict-word-pos";
  pos.textContent = DICT_POS[e.pos] || e.pos;
  top.appendChild(ar);
  top.appendChild(pos);
  card.appendChild(top);
  const tr = document.createElement("div");
  tr.className = "dict-word-tr";
  tr.textContent = e.tr;
  card.appendChild(tr);
  const en = document.createElement("div");
  en.className = "dict-word-en";
  en.textContent = e.en;
  card.appendChild(en);
  const actions = document.createElement("div");
  actions.className = "dict-word-actions";
  const speakBtn = document.createElement("button");
  speakBtn.textContent = "🔊 Listen";
  speakBtn.addEventListener("click", () => speakArabic(e.ar));
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "💾 Save";
  saveBtn.addEventListener("click", () => {
    const saved = saveVocabWord(e.ar, e.en, "");
    showToast(saved ? "✅ Saved " + e.ar + " to your vocabulary" : e.ar + " is already in your vocabulary");
  });
  actions.appendChild(speakBtn);
  actions.appendChild(saveBtn);
  card.appendChild(actions);
  return card;
}

/* ---------------- Session summary ---------------- */
async function openSummary() {
  const s = state.session;
  const st = getStreak();
  const stats = $("summary-stats");
  stats.innerHTML = `
    <div class="stat-row">
      <div class="stat-tile"><span class="stat-num">${s.messages}</span><span class="stat-label">messages</span></div>
      <div class="stat-tile"><span class="stat-num">${getVocab().length}</span><span class="stat-label">saved words</span></div>
      <div class="stat-tile"><span class="stat-num">${getMistakes().length}</span><span class="stat-label">mistakes</span></div>
      <div class="stat-tile"><span class="stat-num">🔥 ${st.days}</span><span class="stat-label">day streak</span></div>
    </div>`;
  $("summary-recap").textContent = "Generating recap…";
  openModal("modal-summary");

  const recent = state.messages.slice(-20).map((m) => (m.role === "user" ? "Learner: " : "Tutor: ") + m.ar + (m.en ? " (" + m.en + ")" : ""));
  if (!hasAI() || recent.length === 0) {
    $("summary-recap").textContent = recent.length
      ? "The tutor is not reachable right now, so there is no recap. Guided practice still works."
      : "Start a conversation first — then come back for a recap of new words and things to practice.";
    return;
  }
  try {
    const recap = await chatCompletion(
      [
        { role: "system", content: "You are an Arabic tutor reviewing a learner's practice conversation. Write a short session recap in English with three sections: 1) 'New words' — up to 8 useful Arabic words/phrases from the conversation, each as 'Arabic — English'. 2) 'To review' — up to 3 mistakes or weak points the learner made. 3) 'Next' — one concrete suggestion for the next practice session. Be encouraging and concise. Use plain text with short lines, no markdown." },
        { role: "user", content: recent.join("\n") },
      ],
      400,
      0.5
    );
    $("summary-recap").textContent = recap;
    touchStreak();
  } catch (err) {
    $("summary-recap").textContent = "Recap failed: " + err.message;
  }
}

/* ---------------- Modals ---------------- */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let lastFocused = null;

function openModal(id) {
  const modal = $(id);
  if (!modal) return;
  lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const first = modal.querySelector("[data-autofocus]") || modal.querySelector(FOCUSABLE);
  if (first) setTimeout(() => first.focus({ preventScroll: true }), 30);
}

function closeModal(id) {
  const modal = $(id);
  if (!modal || modal.classList.contains("hidden")) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".modal:not(.hidden)")) document.body.classList.remove("modal-open");
  if (lastFocused && document.contains(lastFocused)) {
    lastFocused.focus({ preventScroll: true });
    lastFocused = null;
  }
}

function closeTopModal() {
  const open = [...document.querySelectorAll(".modal:not(.hidden)")];
  const top = open[open.length - 1];
  if (!top) return false;
  closeModal(top.id);
  return true;
}

function trapFocus(e) {
  const open = [...document.querySelectorAll(".modal:not(.hidden)")];
  const modal = open[open.length - 1];
  if (!modal) return;
  const items = [...modal.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openSettings() {
  $("set-baseurl").value = state.settings.baseUrl;
  $("set-apikey").value = state.settings.apiKey;
  $("set-model").value = state.settings.model;
  $("set-goal").value = state.settings.goal;
  $("set-tts").checked = state.settings.tts;
  openModal("modal-settings");
}
function saveSettingsFromModal() {
  state.settings.baseUrl = $("set-baseurl").value.trim() || "https://openrouter.ai/api/v1";
  state.settings.apiKey = $("set-apikey").value.trim();
  state.settings.model = $("set-model").value.trim() || "openai/gpt-4o-mini";
  state.settings.goal = Math.min(100, Math.max(1, parseInt($("set-goal").value, 10) || 10));
  state.settings.tts = $("set-tts").checked;
  saveSettings();
  renderGoalChip();
  closeModal("modal-settings");
}

/* ---------------- Backup & restore ---------------- */
const BACKUP_KEYS = [LS.settings, LS.streak, LS.mistakes, LS.history, LS.vocab, LS.goal];

function setDataStatus(text) {
  const el = $("data-status");
  if (el) el.textContent = text;
}

function exportBackup() {
  const data = { app: "hiwar", version: APP_VERSION, exportedAt: new Date().toISOString(), data: {} };
  for (const key of BACKUP_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw === null) continue;
    if (key === LS.settings) {
      // Never put an API key in a file the learner may share or email.
      try {
        const clean = JSON.parse(raw);
        delete clean.apiKey;
        data.data[key] = JSON.stringify(clean);
        continue;
      } catch {
        continue;
      }
    }
    data.data[key] = raw;
  }
  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hiwar-backup-" + stamp + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  setDataStatus("✅ Backup downloaded. Keep it somewhere safe (your API key is not included).");
}

async function importBackup(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || parsed.app !== "hiwar" || typeof parsed.data !== "object") {
      throw new Error("not a Hiwar backup");
    }
    const currentKey = state.settings.apiKey;
    let restored = 0;
    for (const key of BACKUP_KEYS) {
      const raw = parsed.data[key];
      if (typeof raw !== "string") continue;
      JSON.parse(raw); // validate before it reaches storage
      localStorage.setItem(key, raw);
      restored += 1;
    }
    // Keep the API key that is already on this device.
    loadSettings();
    state.settings.apiKey = currentKey;
    saveSettings();
    setDataStatus("✅ Restored " + restored + " data sets. Reloading…");
    setTimeout(() => location.reload(), 900);
  } catch {
    setDataStatus("⚠️ That file is not a Hiwar backup. Choose the .json file you exported earlier.");
  }
}

/* ---------------- Conversation control ---------------- */
function newConversation() {
  if (window.HiwarGuided && window.HiwarGuided.isActive()) {
    window.HiwarGuided.start(state.scenario);
    return;
  }
  state.messages = [];
  state.session = { messages: 0, mistakes: 0, vocab: 0, startedAt: Date.now() };
  $("chat").innerHTML = "";
  const sc = SCENARIOS[state.scenario];
  addMessage({ role: "assistant", ar: sc.opener, en: sc.en, tr: "", feedback: "none" }, { noSpeakTag: true });
}

/* ---------------- Install (PWA) ---------------- */
let deferredInstall = null;
function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    navigator.standalone === true
  );
}
function initInstall() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstall = e;
    $("btn-install").classList.remove("hidden");
  });
  window.addEventListener("appinstalled", () => {
    deferredInstall = null;
    $("btn-install").classList.add("hidden");
    showToast("✅ Hiwar installed!");
  });
  if (isStandalone()) $("btn-install").classList.add("hidden");
  $("btn-install").addEventListener("click", async () => {
    if (deferredInstall) {
      deferredInstall.prompt();
      const choice = await deferredInstall.userChoice.catch(() => null);
      if (choice?.outcome === "accepted") $("btn-install").classList.add("hidden");
      deferredInstall = null;
    } else {
      openModal("modal-install");
    }
  });
}

/* ---------------- Init ---------------- */
async function init() {
  loadSettings();
  await probeTutor();
  populateScenarioSelect();

  // Version label + desktop shell integration
  const versionEl = $("app-version");
  if (versionEl) versionEl.textContent = APP_VERSION;
  if (window.hiwarDesktop?.isDesktop) {
    document.documentElement.dataset.shell = "desktop";
    $("btn-install").classList.add("hidden");
    window.hiwarDesktop.onNewChat(() => newConversation());
  }
  const savedLevel = loadLS("hiwar_level", null);
  if (savedLevel && ["beginner", "intermediate", "advanced"].includes(savedLevel)) {
    state.level = savedLevel;
    document.querySelectorAll("#difficulty .seg-btn").forEach((x) =>
      x.classList.toggle("active", x.dataset.level === state.level)
    );
  }
  renderStreak();
  renderGoalChip();

  // Restore last conversation if same scenario
  const saved = loadLS(LS.history, null);
  if (saved && saved.scenario === state.scenario && saved.messages?.length) {
    state.messages = saved.messages;
    for (const m of state.messages) addMessage(m, { skipPush: true });
  } else {
    newConversation();
  }

  // PWA
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  initInstall();

  // Chat composer
  $("btn-send").addEventListener("click", () => sendMessage());
  $("input").addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
  $("input").addEventListener("input", (e) => {
    e.target.style.direction = /[\u0600-\u06FF]/.test(e.target.value) ? "rtl" : "ltr";
  });
  $("btn-mic").addEventListener("click", toggleMic);

  // Topbar
  $("btn-settings").addEventListener("click", openSettings);
  $("btn-open-settings").addEventListener("click", openSettings);
  $("btn-save-settings").addEventListener("click", saveSettingsFromModal);
  $("btn-report")?.addEventListener("click", reportMistake);
  $("btn-export").addEventListener("click", exportBackup);
  $("btn-import").addEventListener("click", () => $("file-import").click());
  $("file-import").addEventListener("change", (e) => {
    importBackup(e.target.files?.[0]);
    e.target.value = "";
  });
  $("btn-summary").addEventListener("click", openSummary);
  $("btn-study").addEventListener("click", () => {
    showStudyLists();
    renderStudyLists();
    openModal("modal-study");
  });

  // Dictionary: browse alif to yāʾ, or search
  $("btn-dictionary").addEventListener("click", openDictionary);
  $("btn-dict-close").addEventListener("click", closeDictionary);
  $("dict-search").addEventListener("input", (e) => {
    dictView.search = e.target.value.trim();
    $("btn-dict-clear").classList.toggle("hidden", !dictView.search);
    renderDictLetters();
    renderDictResults();
  });
  $("btn-dict-clear").addEventListener("click", () => {
    dictView.search = "";
    $("dict-search").value = "";
    $("btn-dict-clear").classList.add("hidden");
    renderDictLetters();
    renderDictResults();
  });

  // Study: quizzes + word save
  $("btn-quiz-vocab").addEventListener("click", startVocabQuiz);
  $("btn-quiz-mistakes").addEventListener("click", startMistakesQuiz);
  $("btn-quiz-back").addEventListener("click", showStudyLists);
  $("quiz-next").addEventListener("click", () => {
    quiz.idx += 1;
    if (quiz.type === "vocab") renderVocabQuestion();
    else renderMistakesCard();
  });
  $("btn-word-save").addEventListener("click", () => {
    if (!currentWord?.meaning) return;
    const saved = saveVocabWord(currentWord.word, currentWord.meaning, currentWord.sentence);
    $("btn-word-save").textContent = saved ? "Saved ✓" : "Already saved ✓";
    $("btn-word-save").disabled = true;
  });

  // Modals close
  document.querySelectorAll(".modal-close").forEach((b) =>
    b.addEventListener("click", () => closeModal(b.dataset.close))
  );
  document.querySelectorAll(".modal").forEach((m) =>
    m.addEventListener("click", (e) => { if (e.target === m) closeModal(m.id); })
  );

  // Keyboard: Esc closes the top panel, Tab stays inside an open dialog
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (closeTopModal()) return;
      if (!$("dict-panel").classList.contains("hidden")) closeDictionary();
      else if (state.listening) startListening(); // stops an active recording
    } else if (e.key === "Tab") {
      trapFocus(e);
    }
  });

  // Controls
  $("scenario-select").addEventListener("change", (e) => {
    state.scenario = e.target.value;
    if (window.HiwarGuided && window.HiwarGuided.isActive()) window.HiwarGuided.start(state.scenario);
    else newConversation();
  });
  document.querySelectorAll("#difficulty .seg-btn").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("#difficulty .seg-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.level = b.dataset.level;
      saveLS("hiwar_level", state.level);
    })
  );
  $("dialect-select").addEventListener("change", (e) => {
    state.dialect = e.target.value;
    pickArabicVoice();
    if (state.mode === "repeat") { repeatPhrase = null; fetchRepeatPhrase(); }
    else if (window.HiwarGuided && window.HiwarGuided.isActive()) window.HiwarGuided.render();
    else newConversation();
  });
  document.querySelectorAll(".mode-btn").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.mode = b.dataset.mode;
      $("dict-panel").classList.add("hidden");
      if (state.mode === "repeat") {
        if (window.HiwarGuided) window.HiwarGuided.exit();
        enterRepeatMode();
      } else if (state.mode === "guided") {
        exitRepeatMode();
        if (window.HiwarGuided) window.HiwarGuided.start(state.scenario);
      } else {
        if (window.HiwarGuided) window.HiwarGuided.exit();
        exitRepeatMode();
        newConversation();
      }
    })
  );
  $("btn-translation").addEventListener("click", () => {
    state.translations = !state.translations;
    const btn = $("btn-translation");
    btn.classList.toggle("on", state.translations);
    btn.querySelector(".toggle-text").textContent = state.translations ? "On" : "Off";
    if (window.HiwarGuided && window.HiwarGuided.isActive()) window.HiwarGuided.render();
    else renderAll();
    $("repeat-en").textContent = state.translations && repeatPhrase?.en ? repeatPhrase.en : "";
  });
  $("btn-translit").addEventListener("click", () => {
    state.translit = !state.translit;
    const btn = $("btn-translit");
    btn.classList.toggle("on", state.translit);
    btn.querySelector(".toggle-text").textContent = state.translit ? "On" : "Off";
    if (window.HiwarGuided && window.HiwarGuided.isActive()) window.HiwarGuided.render();
    else renderAll();
    $("repeat-tr").classList.toggle("hidden", !state.translit);
  });
  $("btn-newchat").addEventListener("click", newConversation);

  // Repeat mode
  $("btn-repeat-play").addEventListener("click", () => repeatPhrase && speakArabic(repeatPhrase.ar));
  $("btn-repeat-mic").addEventListener("click", startListening);
  $("btn-repeat-next").addEventListener("click", () => {
    previousPhrase = repeatPhrase;
    fetchRepeatPhrase();
  });

  // Welcome: level and daily goal chosen before the first scene
  document.querySelectorAll("#welcome-level button").forEach((b) =>
    b.addEventListener("click", () => {
      state.level = b.dataset.level;
      document.querySelectorAll("#welcome-level button").forEach((x) => x.classList.toggle("on", x === b));
      document.querySelectorAll("#difficulty .seg-btn").forEach((x) =>
        x.classList.toggle("active", x.dataset.level === state.level)
      );
      saveLS("hiwar_level", state.level);
    })
  );
  document.querySelectorAll("#welcome-goal button").forEach((b) =>
    b.addEventListener("click", () => {
      state.settings.goal = Number(b.dataset.goal) || 10;
      document.querySelectorAll("#welcome-goal button").forEach((x) => x.classList.toggle("on", x === b));
      saveSettings();
      renderGoalChip();
    })
  );

  // Welcome: offer the free path first, never a key wall
  $("btn-welcome-guided").addEventListener("click", () => {
    markOnboarded();
    closeModal("modal-welcome");
    startGuidedMode();
  });
  $("btn-welcome-ai").addEventListener("click", () => {
    markOnboarded();
    closeModal("modal-welcome");
    openSettings();
  });

  // Home-screen shortcuts: ./?scenario=free and ./?mode=repeat
  applyLaunchParams();

  // Nothing reachable: start where the learner can actually practise
  if (!hasAI() && !(window.HiwarGuided && window.HiwarGuided.isActive())) {
    startGuidedMode();
  }
  if (!loadLS("hiwar_onboarded", false)) {
    openModal("modal-welcome");
  }
}

function markOnboarded() {
  saveLS("hiwar_onboarded", true);
}

function populateScenarioSelect() {
  const select = $("scenario-select");
  if (!select) return;
  select.innerHTML = "";
  const groups = [
    ["beginner", "Beginner scenes"],
    ["intermediate", "Intermediate scenes"],
    ["advanced", "Advanced scenes"],
  ];
  for (const [level, title] of groups) {
    const group = document.createElement("optgroup");
    group.label = title;
    for (const [key, scene] of Object.entries(SCENARIOS)) {
      if (scene.level !== level) continue;
      const option = document.createElement("option");
      option.value = key;
      option.textContent = scene.label;
      group.appendChild(option);
    }
    if (group.children.length) select.appendChild(group);
  }
  select.value = state.scenario;
}

function applyLaunchParams() {
  const params = new URLSearchParams(location.search);
  const scenario = params.get("scenario");
  if (scenario && SCENARIOS[scenario]) {
    state.scenario = scenario;
    $("scenario-select").value = scenario;
    newConversation();
  }
  if (params.get("mode") === "repeat") {
    document.querySelector('.mode-btn[data-mode="repeat"]')?.click();
  }
}

init();
