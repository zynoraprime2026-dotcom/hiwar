# Contributing to Hiwar

Jazak Allahu khayran for helping. This project exists so that anyone can learn to speak
Arabic without paying for a tutor, so contributions that widen access are the most
valuable ones.

## Good first contributions

- **Arabic review** — a native or fluent speaker checking the scenarios, the corrections
  and the dictionary entries. Accuracy here matters more than any feature.
- **New scenarios** — a doctor's visit, the masjid, a job interview, a phone call.
- **New dialects** — Gulf, Maghrebi, Sudanese, Nigerian/African Arabic teaching material.
- **Accessibility** — screen-reader labels, keyboard flows, contrast, larger text.
- **Translations of the interface** — French, Hausa, Urdu, Indonesian, Turkish.

## Before you open a pull request

```bash
npm run check      # scripts, JSON, asset references and service worker must pass
npm run serve      # then click through the app at http://localhost:4173
```

Please keep the project dependency-free for the web app: no build step, no bundler, no
CDN. Everything the browser needs must be served from this repository so the app keeps
working offline and on cheap connections. The only npm dependencies allowed are the
desktop packaging tools in `devDependencies`.

## Code style

- Plain modern JavaScript, `"use strict"`, two-space indent.
- No framework, no transpiling. If a browser supports it natively, use it.
- Keep the Arabic text vocalized for beginner-level content.
- Every new user-visible control needs an `aria-label` or a visible label, and must be
  reachable by keyboard.

## Commit and PR conventions

Use a short imperative subject (`Add Gulf dialect scenario`), describe the user-visible
effect in the body, and mention anything a reviewer should test by hand.

## License

By contributing you agree your work is released under the [MIT License](LICENSE).
