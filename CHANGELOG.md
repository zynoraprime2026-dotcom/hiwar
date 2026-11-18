# Changelog

All notable changes to Hiwar are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[semantic versioning](https://semver.org/).

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
