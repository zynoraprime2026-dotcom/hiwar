/* ================================================================
   Hiwar (حوار) — Arabic Conversation Tutor
   Chat UI, AI tutor (OpenAI-compatible API), voice in/out,
   streak + mistake tracking. All state in localStorage.
   ================================================================ */

"use strict";

/* ---------------- State ---------------- */
const LS = {
  settings: "hiwar_settings",
  streak: "hiwar_streak",
  mistakes: "hiwar_mistakes",
  history: "hiwar_history",
};

const state = {
  settings: {
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: "",
    model: "openai/gpt-4o-mini",
    tts: true,
  },
  scenario: "greetings",
  level: "intermediate",
  translations: true,
  messages: [], // {role: 'user'|'assistant', ar, en, feedback}
  busy: false,
  listening: false,
};

const SCENARIOS = {
  greetings: {
    label: "Greetings & Introductions",
    opener: "أهلاً وسهلاً! أنا أستاذ حديث. ما اسمك؟",
    en: "Welcome! I'm Ustadh Hiwar. What is your name?",
    brief: "The user greets you and introduces themselves. Ask their name, where they are from, and what they do.",
  },
  shopping: {
    label: "Shopping & Bargaining",
    opener: "أهلاً بك في السوق! كيف أستطيع مساعدتك اليوم؟",
    en: "Welcome to the market! How can I help you today?",
    brief: "You are a friendly shopkeeper in a traditional souq. The user wants to buy things, ask prices, and bargain politely.",
  },
  travel: {
    label: "Travel & Directions",
    opener: "مرحباً! تبدو حائراً. هل تبحث عن مكان معين؟",
    en: "Hello! You look lost. Are you looking for a specific place?",
    brief: "You are a helpful local. The user is a traveler asking for directions, transport advice, and places to visit.",
  },
  cafe: {
    label: "Café & Restaurant",
    opener: "أهلاً وسهلاً! تفضل، ماذا تحب أن تشرب؟",
    en: "Welcome! Please, what would you like to drink?",
    brief: "You are a waiter in a café. The user orders food and drinks, asks about the menu, and asks for the bill.",
  },
  family: {
    label: "Family & Small Talk",
    opener: "كيف حالك اليوم؟ كيف كانت أيامك؟",
    en: "How are you today? How have your days been?",
    brief: "You are a warm friend catching up. Talk about family, daily routine, weather, and plans.",
  },
  work: {
    label: "Work & Appointments",
    opener: "صباح الخير! حجزت موعداً اليوم. كيف يمكنني خدمتك؟",
    en: "Good morning! You booked an appointment today. How can I help you?",
    brief: "You are a receptionist at a company. The user books appointments, reschedules, and discusses simple work matters.",
  },
  free: {
    label: "Free Conversation",
    opener: "مرحباً! أنا مستعد للتحدث معك في أي موضوع. عمّ تريد أن نتحدث؟",
    en: "Hello! I'm ready to talk about anything. What would you like to discuss?",
    brief: "Open conversation on any topic the user chooses. Follow their lead naturally.",
  },
};

const LEVEL_GUIDE = {
  beginner: "The user is a BEGINNER. Use only very simple MSA sentences (under 8 words), high-frequency vocabulary, and full vocalization (tashkeel) on words. Speak slowly in style.",
  intermediate: "The user is INTERMEDIATE. Use natural MSA with common everyday vocabulary and varied sentence structures. Occasional idioms are fine if explained.",
  advanced: "The user is ADVANCED. Use rich, natural MSA including idioms, nuanced expressions, and more complex structures.",
};

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

/* ---------------- Mistakes ---------------- */
function getMistakes() {
  return loadLS(LS.mistakes, []);
}
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
}
function renderMistakes() {
  const wrap = $("mistakes-list");
  const mistakes = getMistakes();
  wrap.innerHTML = "";
  if (!mistakes.length) {
    wrap.innerHTML = '<p class="empty-note">No mistakes recorded yet. Practice more — mistakes are how we learn! 🌱</p>';
    return;
  }
  for (const m of mistakes.slice(0, 15)) {
    const card = document.createElement("div");
    card.className = "mistake-card";
    card.innerHTML = `
      <div class="m-count">× ${m.count}</div>
      <div class="m-ar">${escapeHtml(m.ar)}</div>
      <div class="m-note">${escapeHtml(m.note)}</div>
    `;
    wrap.appendChild(card);
  }
}

/* ---------------- Chat rendering ---------------- */
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

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
  ar.textContent = msg.ar;
  bubble.appendChild(ar);

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
  saveLS(LS.history, { scenario: state.scenario, messages: state.messages.slice(-40) });
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
function removeTyping() {
  $("typing")?.remove();
}

/* ---------------- Text-to-speech ---------------- */
let arabicVoice = null;
function pickArabicVoice() {
  const voices = speechSynthesis.getVoices();
  arabicVoice =
    voices.find((v) => /ar-(SA|EG|AE)/i.test(v.lang)) ||
    voices.find((v) => /^ar/i.test(v.lang)) ||
    null;
}
speechSynthesis.onvoiceschanged = pickArabicVoice;
pickArabicVoice();

function speakArabic(text) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    if (arabicVoice) u.voice = arabicVoice;
    u.rate = state.level === "beginner" ? 0.85 : 0.95;
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
    $("input").value = text;
    sendMessage(text);
  };
  recognition.onend = () => setListening(false);
  recognition.onerror = () => setListening(false);
}
function setListening(on) {
  state.listening = on;
  $("btn-mic").classList.toggle("rec", on);
  $("listening-pill").classList.toggle("hidden", !on);
}
function toggleMic() {
  if (!recognition) {
    alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
    return;
  }
  if (state.listening) {
    recognition.stop();
    return;
  }
  try { recognition.start(); setListening(true); } catch {}
}

/* ---------------- AI ---------------- */
function systemPrompt() {
  const sc = SCENARIOS[state.scenario];
  return [
    "You are Hiwar (حوار), a warm, patient Arabic conversation tutor for foreign learners.",
    "You ONLY converse in Modern Standard Arabic (فصحى), never dialects.",
    LEVEL_GUIDE[state.level],
    `Current role-play scenario: ${sc.label}. ${sc.brief}`,
    "Keep replies short (1-3 sentences), natural, and always end with a question to keep the conversation flowing.",
    "ALWAYS respond in EXACTLY this plain-text format, nothing else:",
    "AR: <your Arabic reply>",
    "EN: <English translation of your reply>",
    "FEEDBACK: <if the user's last message had a grammar, vocabulary, or spelling mistake, briefly explain it in simple English and show the corrected Arabic; if it was correct or this is the first message, write: none>",
    "",
    "Example of your EXACT response format:",
    "AR: صباح الخير! كيف حالك اليوم؟",
    "EN: Good morning! How are you today?",
    "FEEDBACK: none",
    "",
    "Never use markdown, bold text, or extra labels. Always output all three lines (AR, EN, FEEDBACK) on every reply.",
  ].join("\n");
}

function sanitizeAI(raw) {
  return String(raw ?? "")
    .replace(/```[a-zA-Z]*\n?/g, "")
    .replace(/[*#>`_~]/g, "")
    .trim();
}

function parseAI(raw) {
  raw = sanitizeAI(raw);
  const out = { ar: "", en: "", feedback: "none" };
  const arM = raw.match(/AR\s*[:：]\s*([\s\S]*?)(?=\n\s*EN\s*[:：]|\n\s*FEEDBACK\s*[:：]|$)/i);
  const enM = raw.match(/EN\s*[:：]\s*([\s\S]*?)(?=\n\s*FEEDBACK\s*[:：]|$)/i);
  const fbM = raw.match(/FEEDBACK\s*[:：]\s*([\s\S]*)$/i);
  if (arM) out.ar = arM[1].trim();
  if (enM) out.en = enM[1].trim();
  if (fbM) out.feedback = fbM[1].trim();
  if (!out.ar) out.ar = raw.trim(); // fallback if model ignored format
  return out;
}

function historyForAPI() {
  const msgs = [{ role: "system", content: systemPrompt() }];
  for (const m of state.messages.slice(-16)) {
    msgs.push({ role: m.role, content: m.ar });
  }
  return msgs;
}

function buildHeaders() {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + state.settings.apiKey,
  };
  if (/openrouter/i.test(state.settings.baseUrl)) {
    headers["HTTP-Referer"] = location.origin || "https://hiwar.app";
    headers["X-Title"] = "Hiwar Arabic Tutor";
  }
  return headers;
}

function renderAll() {
  const msgs = [...state.messages];
  $("chat").innerHTML = "";
  state.messages = [];
  for (const m of msgs) addMessage(m, { skipPush: true });
}

async function translateArabic(text) {
  const url = state.settings.baseUrl.replace(/\/+$/, "") + "/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      model: state.settings.model,
      messages: [
        { role: "system", content: "Translate the user's Arabic text into natural English. Reply with ONLY the English translation. No Arabic, no explanations, no quotes." },
        { role: "user", content: text },
      ],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error("API " + res.status);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

async function callAI() {
  const { baseUrl, apiKey, model } = state.settings;
  const url = baseUrl.replace(/\/+$/, "") + "/chat/completions";
  const headers = buildHeaders();
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages: historyForAPI(), max_tokens: 400, temperature: 0.8 }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "";
  return parseAI(raw);
}

async function sendMessage(textOverride) {
  if (state.busy) return;
  const text = (textOverride ?? $("input").value).trim();
  if (!text) return;

  if (!state.settings.apiKey) {
    openModal("modal-settings");
    return;
  }

  $("input").value = "";
  addMessage({ role: "user", ar: text, en: "", feedback: "none" });
  state.busy = true;
  $("btn-send").disabled = true;
  addTyping();

  try {
    const reply = await callAI();
    removeTyping();
    addMessage({ role: "assistant", ar: reply.ar, en: reply.en, feedback: reply.feedback });
    touchStreak();
    if (reply.feedback && reply.feedback.toLowerCase() !== "none") {
      recordMistake(text, reply.feedback);
    }
    if (!reply.en && reply.ar) {
      // AI skipped the EN line: fetch translation separately and re-render
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
      feedback: "none",
    }, { noSpeakTag: true });
  } finally {
    state.busy = false;
    $("btn-send").disabled = false;
    $("input").focus();
  }
}

/* ---------------- Modals ---------------- */
function openModal(id) { $(id).classList.remove("hidden"); }
function closeModal(id) { $(id).classList.add("hidden"); }

function openSettings() {
  $("set-baseurl").value = state.settings.baseUrl;
  $("set-apikey").value = state.settings.apiKey;
  $("set-model").value = state.settings.model;
  $("set-tts").checked = state.settings.tts;
  openModal("modal-settings");
}
function saveSettingsFromModal() {
  state.settings.baseUrl = $("set-baseurl").value.trim() || "https://openrouter.ai/api/v1";
  state.settings.apiKey = $("set-apikey").value.trim();
  state.settings.model = $("set-model").value.trim() || "openai/gpt-4o-mini";
  state.settings.tts = $("set-tts").checked;
  saveSettings();
  closeModal("modal-settings");
}

/* ---------------- Conversation control ---------------- */
function newConversation() {
  state.messages = [];
  $("chat").innerHTML = "";
  const sc = SCENARIOS[state.scenario];
  addMessage({ role: "assistant", ar: sc.opener, en: sc.en, feedback: "none" }, { noSpeakTag: true });
  if (state.settings.tts && state.settings.apiKey) {
    // don't auto-speak opener before first interaction (browsers block it)
  }
}

/* ---------------- Init ---------------- */
function init() {
  loadSettings();
  renderStreak();

  // Restore last conversation if same scenario
  const saved = loadLS(LS.history, null);
  if (saved && saved.scenario === state.scenario && saved.messages?.length) {
    state.messages = saved.messages;
    for (const m of state.messages) addMessage(m, { skipPush: true });
  } else {
    newConversation();
  }

  $("btn-send").addEventListener("click", () => sendMessage());
  $("input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  $("btn-mic").addEventListener("click", toggleMic);
  $("btn-settings").addEventListener("click", openSettings);
  $("btn-open-settings").addEventListener("click", openSettings);
  $("btn-save-settings").addEventListener("click", saveSettingsFromModal);
  $("btn-mistakes").addEventListener("click", () => {
    renderMistakes();
    openModal("modal-mistakes");
  });
  document.querySelectorAll(".modal-close").forEach((b) =>
    b.addEventListener("click", () => closeModal(b.dataset.close))
  );
  document.querySelectorAll(".modal").forEach((m) =>
    m.addEventListener("click", (e) => { if (e.target === m) m.classList.add("hidden"); })
  );

  $("scenario-select").addEventListener("change", (e) => {
    state.scenario = e.target.value;
    newConversation();
  });
  document.querySelectorAll(".seg-btn").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll(".seg-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.level = b.dataset.level;
    })
  );
  $("btn-translation").addEventListener("click", () => {
    state.translations = !state.translations;
    const btn = $("btn-translation");
    btn.classList.toggle("on", state.translations);
    btn.querySelector(".toggle-text").textContent = state.translations ? "On" : "Off";
    renderAll();
  });
  $("btn-newchat").addEventListener("click", newConversation);

  // Adjust input direction for Arabic typing
  $("input").addEventListener("input", (e) => {
    const v = e.target.value;
    e.target.style.direction = /[\u0600-\u06FF]/.test(v) ? "rtl" : "ltr";
  });
}

init();
