# Hiwar — حوار

**An Arabic conversational app with an AI tutor to improve your speaking skills.**

Hiwar means "dialogue" (حوار) — and that's exactly what this app is: a judgment-free
space to practice Modern Standard Arabic by talking with a patient AI tutor.

## ✨ Features

- **💬 Arabic chat with an AI tutor** — converses in Modern Standard Arabic (فصحى)
- **🌍 Optional English translations** — toggle them on or off per message
- **🎤 Voice input** — speak your replies in Arabic using your browser's mic
- **🔊 Text-to-speech** — tap any tutor bubble to hear correct pronunciation
- **✏️ Gentle corrections** — mistakes are explained in simple English with the corrected Arabic
- **🎭 Real scenarios** — greetings, shopping & bargaining, travel, café, family small talk, work appointments, and free conversation
- **📊 Difficulty levels** — beginner (vocalized, short sentences), intermediate, advanced (idioms and nuance)
- **🔥 Streak tracking** — keep your daily practice streak alive
- **📋 Common mistakes log** — a personal review list of your recurring errors

## 🚀 Run it

It's a static app — no build step required.

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
- Web Speech API for speech recognition (Arabic, `ar-SA`) and synthesis
- Noto Naskh Arabic for beautiful, readable Arabic type

## 🔒 Privacy

No accounts, no servers, no tracking. Everything (streak, mistakes, chat history, API key)
lives in your own browser.
