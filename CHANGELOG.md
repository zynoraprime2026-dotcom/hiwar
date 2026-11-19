# Changelog

All notable changes to Hiwar are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[semantic versioning](https://semver.org/).

## 2.4.0

- Arabic interface with a real RTL layout. A language switch in Settings flips the
  document to `dir="rtl"` and translates the chrome: scenario names, levels,
  dialects, modes, panels, buttons, and the notes in Settings and Install.
- Strings are translated at runtime from an English table, so switching back
  restores the original nodes exactly. Sentences split across `<b>` and `<a>` are
  replaced as whole blocks to keep Arabic word order.
- Latin text (model names, URLs) keeps LTR isolation inside the Arabic layout.
- The tutor's replies, guided dialogues and dictionary entries stay as data, and
  are not translated by the interface.

## [2.3.1] — 2026-11-18

The shared tutor is switched on.

- `api/tutor.js` now answers through whichever provider is configured: Google Gemini (OpenAI-compatible
  endpoint, default model `gemini-flash-lite-latest`), OpenRouter, or the Vercel AI Gateway. A Google key
  is recognised by its prefix even when it is stored under the OpenRouter variable name.
- One quiet retry when a free tier answers 429 or 503, and a plain-language "the tutor is busy" instead
  of a raw status.
- The desktop app and the GitHub Pages mirror have no `/api` of their own, so they fall back to the
  deployed endpoint, which now answers CORS preflights. The per-IP budget still applies.
- Verified live: a visitor with no key and no account typed "مرحبا، اسمي عبدالرحمن" and got
  "أهلاً بك يا عبد الرحمن! …" in about a second.

## [2.3.0] — 2026-11-18

A tutor that does not ask for a key, and no more dead ends on a phone.

### Added
- **Shared tutor endpoint** (`api/tutor.js`): one key lives on the server, so a visitor can hold a
  real conversation without pasting anything. The model, token ceiling and temperature are fixed
  server-side, messages are trimmed and length-capped, and a per-IP plus global daily budget guards
  the cost. Nothing is logged.
- The app probes `/api/tutor` at boot: a reachable tutor opens chat mode with the AI tutor, otherwise
  it falls back to guided practice exactly as before. Works with an OpenRouter key or the Vercel AI
  Gateway.
- **Vocabulary quiz now works on a first visit**, drawing on the built-in dictionary when fewer than
  four words are saved, and saying so in the question counter.
- **Report a mistake** in Settings opens a prefilled GitHub issue with the version and scene attached.

### Changed
- A browser with no speech engine now reads "This browser cannot listen. Tap the Arabic line to hear
  it, then say it out loud." instead of showing no button at all.
- Copy no longer claims the AI tutor needs a personal key, because on this deployment it usually does not.

### Note
The shared tutor stays off until one environment variable exists in Vercel: `OPENROUTER_API_KEY`.
Until then `/api/tutor` answers `configured: false` and Hiwar behaves as it did in 2.2.x.

## [2.2.1] — 2026-11-18

Deployed to Vercel.

- The site now runs at https://hiwar-zynora1.vercel.app with deployment protection off, so it is
  public, and every push to `main` redeploys it. GitHub Pages stays as a mirror.
- `vercel.json` pins a static deployment: no install command (Electron must not be downloaded on the
  builder) and no build command.
- Canonical and social metadata now point at the Vercel domain.

## [2.2.0] — 2026-11-18

Practice you can speak, a library worth coming back to, and a front page that shows the app.

### Added
- **Spoken guided practice.** Every guided reply has a *Say it* button: the microphone scores how
  clearly you said the line, entirely on device, with no key and nothing uploaded.
- **21 scenes tagged by level** (10 beginner, 9 intermediate, 2 advanced): numbers, time, taxi,
  pharmacy, school, mosque, weather, doctor, hotel, airport, phone, invitations, news and storytelling
  join the original seven. The scene picker groups them by level.
- **Level and daily goal on the welcome screen**, saved on the device.
- **Screenshots** in the README and on the release page, captured from the running app.
- CI now checks the scene library: at least 21 scenes, every level represented, an AI brief for each.

### Changed
- The guided conversation stays on screen as a transcript instead of being replaced each step, so the
  learner can compare their reply with the tutor's.
- One scenario list now drives both guided practice and the AI tutor, so labels and levels cannot drift.

## [2.1.0] — 2026-11-18

Guided practice: the app is useful the moment it opens, with no key and no account.

### Added
- **Guided practice mode.** Seven scripted conversations (first meeting, market, directions,
  café, family, work, open conversation) with four steps each. Every line carries Arabic,
  transliteration, English and, where it helps, a short tip on why the reply works.
- **Welcome screen** that offers two paths — free guided practice, or the AI tutor with
  your own key — instead of asking for an API key before anything can happen.
- **Inline key notice.** Typing with no key now offers guided practice in the conversation
  itself rather than throwing a settings dialog at the learner.
- Self-check now validates the guided content (scenes, steps, Arabic/English pairs) and
  that the mode is wired into the app and the service worker.

### Changed
- The app opens straight into guided practice when no key is configured, so nothing is
  gated behind setup.
- Footer hint no longer tells people to "connect your AI key to start".

## [2.0.0] — 2026-11-18

The release that turns Hiwar from a personal project into something the whole Ummah can
install, trust and improve.

### Added
- **Windows desktop app.** Installer and portable `.exe` built with Electron, with a
  native menu, `Ctrl+N` for a new chat, remembered window size and position, and
  external links opening in the system browser.
- **Automated desktop builds.** GitHub Actions packages Windows on every push to `main`
  and publishes a GitHub Release when a `v*` tag is pushed.
- **Backup and restore.** Export streak, vocabulary, corrections and history to a JSON
  file and restore it on another device. The API key is never included.
- **Home-screen shortcuts** for free conversation and listen-and-repeat.
- **Repository self-check** (`npm run check`) and a CI workflow that runs it plus a
  static smoke test.
- **Zero-dependency dev server** (`npm run serve`).
- `vercel.json` with security headers, uncached service worker and a microphone-only
  permissions policy.
- Documentation: rewritten README, MIT LICENSE, CONTRIBUTING, SECURITY.

### Changed
- Wide-screen layout: the chat column, composer and controls expand properly on laptops
  and in the desktop window instead of staying phone-width.
- Manifest: `orientation: any`, display override, categories, app id and shortcuts.
- Service worker: navigations fall back to the cached shell when offline, cache bumped
  to `hiwar-v7`.
- API failures now explain themselves in plain language (bad key, no credit, rate limit,
  server trouble) instead of showing a raw HTTP error.

### Fixed
- Dialogs are real dialogs: focus moves in, stays inside, `Esc` closes them, and focus
  returns to where it was.
- Icon buttons, the chat log and form fields expose proper accessible names and a live
  region for new messages.
- Opening a backup file can no longer overwrite local data with something that is not a
  Hiwar backup.

## [1.x] — 2026-10

Earlier work in the same app: AI tutor with AR/TR/EN/FEEDBACK replies, voice input and
text-to-speech, listen-and-repeat scoring, tap-to-learn vocabulary, the offline
dictionary, quizzes and mistake flashcards, streaks and a daily goal, session summaries,
three dialects, three levels, and full offline support with vendored Tailwind and fonts.
