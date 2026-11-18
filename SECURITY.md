# Security and privacy

Hiwar is a static, client-side app. There is no Hiwar server, no account system and no
analytics, so there is no database of learners to breach.

## What is stored, and where

| Data | Where it lives |
|---|---|
| AI provider API key | `localStorage` on your device (browser profile or desktop app data) |
| Streak, daily goal, vocabulary, corrections, chat history | `localStorage` on your device |
| Exported backup file | Only where you save it — **the API key is removed before export** |

Nothing else leaves the device. The only outbound network request is the one you
configure: `POST <your base URL>/chat/completions`.

## Hardening already in place

- A Content-Security-Policy in `index.html`: local scripts only, no remote code, no
  inline scripts, no framing, no form posts.
- All third-party assets (Tailwind, Inter, Noto Naskh Arabic) are vendored and served
  from the app itself, so a compromised CDN cannot inject code.
- The desktop build runs the renderer sandboxed with `contextIsolation` on and Node
  integration off; the preload bridge exposes only a "new chat" callback.
- `vercel.json` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and a
  `Permissions-Policy` that allows the microphone for the app only.
- The service worker never caches cross-origin responses.

## Your own responsibilities

- Treat your API key like a password; use a provider key with a spending limit.
- If you share your device, clear site data (or uninstall the desktop app) to remove
  your practice history.
- If you ever paste a key into a shared or public computer, revoke it at the provider.

## Reporting a problem

Please open a private report through GitHub's **Security → Report a vulnerability** on
this repository rather than a public issue, and allow a reasonable time for a fix.
