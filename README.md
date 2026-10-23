# Hiwar — حوار

**An Arabic conversational app with an AI tutor to improve your speaking skills.**

Hiwar means "dialogue" (حوار) — and that's exactly what this app is: a judgment-free
space to practice Arabic by talking with a patient AI tutor.

## ✨ Features

- **💬 Arabic chat with an AI tutor** — MSA, or switch to Egyptian or Levantine dialect
- **🌍 Optional English translations** — toggle per session, with automatic fallback if the AI skips a line
- **🔤 Transliteration** — Latin text under every Arabic phrase so beginners can read along
- **🎤 Voice input** — speak your replies in Arabic using your browser's mic
- **🔊 Text-to-speech** — tap any tutor bubble to hear correct pronunciation
- **🎧 Listen & Repeat mode** — the tutor speaks a phrase, you repeat it, and your pronunciation is scored with the words to work on
- **👆 Tap-to-learn vocabulary** — tap any word in the tutor's reply for its meaning, then save it to your vocabulary list
- **🎯 Study hub** — vocabulary multiple-choice quiz and mistakes flashcards built from your own practice
- **✏️ Gentle corrections** — mistakes are explained in simple English with the corrected Arabic
- **🧾 Session summary** — a recap of new words, mistakes, and what to practice next
- **🎭 Real scenarios** — greetings, shopping & bargaining, travel, café, family small talk, work appointments, and free conversation
- **📊 Difficulty levels** — beginner (vocalized, short sentences), intermediate, advanced (idioms and nuance)
- **🔥 Streak tracking** — keep your daily practice streak alive
- **📱 Installable (PWA)** — add Hiwar to your phone's home screen; works offline after first load

## 🚀 Run it

It's a static app — no build step required.

**Live:** https://zynoraprime2026-dotcom.github.io/hiwar/

**Locally:** open `index.html` in Chrome or Edge, or serve it:

```bash
npx serve .
```

**Deploy:** works out of the box on Vercel, Netlify, or GitHub Pages.

## 🔑 Connect your AI

Hiwar talks to any OpenAI-compatible chat API:

1. Create a key at [openrouter.ai/keys](https://openrouter.ai/keys) (free tier available)
2. Open **Settings ⚙️** in the app and paste it
3. Start talking

The key is stored only in your browser's localStorage — never sent anywhere except the API you choose.

## 🧰 Tech

- Vanilla HTML/CSS/JS — zero dependencies, fast load
- [Tailwind (CDN)](https://tailwindcss.com) + custom CSS
- Web Speech API for speech recognition (Arabic) and synthesis
- Service worker + web app manifest for offline use and install
- Noto Naskh Arabic for beautiful, readable Arabic type

## 🔒 Privacy

No accounts, no servers, no tracking. Everything (streak, mistakes, vocabulary,
chat history, API key) lives in your own browser.
