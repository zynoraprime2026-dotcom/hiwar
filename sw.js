/* Hiwar service worker — offline app shell, network-first for updates */
const CACHE = "hiwar-v9";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/guided.js",
  "./js/dictionary.js",
  "./js/vendor/tailwind.js",
  "./css/fonts.css",
  "./fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7SUc.woff2",
  "./fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2",
  "./fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7SUc.woff2",
  "./fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7SUc.woff2",
  "./fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2",
  "./fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7SUc.woff2",
  "./fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7SUc.woff2",
  "./fonts/notonaskharabic-RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN2DHV20Lg.woff2",
  "./fonts/notonaskharabic-RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN2GHV0.woff2",
  "./fonts/notonaskharabic-RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN2IHV20Lg.woff2",
  "./fonts/notonaskharabic-RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN36HV20Lg.woff2",
  "./fonts/notonaskharabic-RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN3oHV20Lg.woff2",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const sameOrigin = new URL(e.request.url).origin === self.location.origin;

  // Navigations: try the network, fall back to the cached shell so the app
  // still opens with no connection (important for the desktop build and
  // for learners on expensive data).
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok && sameOrigin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put("./index.html", copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match("./index.html")
            .then((hit) => hit || caches.match("./") || Response.error())
        )
    );
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && sameOrigin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((hit) => hit || Response.error())
      )
  );
});

// Let the page activate a new version immediately when it asks.
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
