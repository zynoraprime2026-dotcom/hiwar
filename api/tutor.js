/**
 * Hiwar shared tutor endpoint.
 *
 * Why this exists: the AI tutor used to need a personal API key, which is the
 * single biggest thing that stopped people from using Hiwar. This function
 * keeps the keys on the server so any visitor can hold a real conversation,
 * while the keys themselves never reach the browser.
 *
 * Safety rails, because the endpoint is public:
 *   - the model, token ceiling and temperature are set here, never by the client
 *   - the message list is trimmed and each message is length-capped
 *   - a per-IP daily budget plus a global daily ceiling stop runaway spend
 *   - no conversation is logged or stored; requests pass through untouched
 *
 * Providers are tried in order, so a free tier that is spiking or a model that
 * has been retired does not take the tutor down:
 *   1. Google Gemini (a key from Google AI Studio starts with AQ. or AIza)
 *   2. OpenRouter (a key starts with sk-or-)
 *   3. The Vercel AI Gateway, when the project has an OIDC token
 *
 * Configuration (Vercel -> Project -> Settings -> Environment Variables):
 *   GEMINI_API_KEY      a Google AI Studio key, the fastest of the free options
 *   OPENROUTER_API_KEY  an OpenRouter key, used when Gemini cannot answer
 *   TUTOR_MODEL         optional, forces one model instead of the default list
 *   TUTOR_DAILY_PER_IP  optional, default 40
 *   TUTOR_DAILY_TOTAL   optional, default 1500
 */

const GEMINI = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";
const GATEWAY = "https://ai-gateway.vercel.sh/v1/chat/completions";

const GEMINI_MODELS = ["gemini-flash-lite-latest", "gemini-3.8-flash"];
// Free OpenRouter models move around; two are kept so one retirement is survivable.
const OPENROUTER_MODELS = [
  "baidu/ernie-5.5-flash-preview:free",
  "inclusionai/ling-3.2-flash:free",
];
const GATEWAY_MODELS = ["openai/gpt-4o-mini"];

const MAX_MESSAGES = 14;
const MAX_CHARS_PER_MESSAGE = 1200;
const MAX_TOKENS = 500;
const MAX_ATTEMPTS = 4;

/* Ordered list of {name, url, key, models}. Empty when nothing is configured. */
function buildProviders() {
  const forced = process.env.TUTOR_MODEL;
  const providers = [];

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    providers.push({
      name: "gemini",
      url: GEMINI,
      key: geminiKey,
      models: forced ? [forced] : GEMINI_MODELS,
    });
  }

  // Each variable is read on its own: a key saved under the OpenRouter name may
  // still be a Google key, and it must never hide the real OpenRouter key.
  const seen = new Set(providers.map((p) => p.key));
  const candidates = [process.env.OPENROUTER_KEY, process.env.OPENROUTER_API_KEY].filter(Boolean);
  for (const key of candidates) {
    if (seen.has(key)) continue;
    seen.add(key);
    const looksGoogle = /^(AQ\.|AIza)/.test(key);
    const provider = looksGoogle
      ? { name: "gemini", url: GEMINI, key, models: forced ? [forced] : GEMINI_MODELS }
      : { name: "openrouter", url: OPENROUTER, key, models: forced ? [forced] : OPENROUTER_MODELS };
    if (providers.some((p) => p.name === provider.name && p.key === provider.key)) continue;
    providers.push(provider);
  }

  if (process.env.VERCEL_OIDC_TOKEN) {
    providers.push({
      name: "vercel-gateway",
      url: GATEWAY,
      key: process.env.VERCEL_OIDC_TOKEN,
      models: forced ? [forced] : GATEWAY_MODELS,
    });
  }

  return providers;
}

// Best-effort counters. Serverless instances are short-lived, so these are a
// speed bump, not a wall; the global ceiling is the real cost guard.
const perIp = new Map();
const global = { day: "", count: 0 };

function today() {
  return new Date().toISOString().slice(0, 10);
}

function rollDay() {
  const d = today();
  if (global.day !== d) {
    global.day = d;
    global.count = 0;
    perIp.clear();
  }
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function cleanMessages(input) {
  if (!Array.isArray(input)) return null;
  const out = [];
  for (const m of input.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== "object") continue;
    const role = m.role === "assistant" ? "assistant" : m.role === "user" ? "user" : null;
    if (!role) continue;
    const content = String(m.content ?? "").slice(0, MAX_CHARS_PER_MESSAGE);
    if (!content.trim()) continue;
    out.push({ role, content });
  }
  return out.length ? out : null;
}

async function askProvider(provider, model, messages, maxTokens, temperature) {
  const headers = { "Content-Type": "application/json", Authorization: "Bearer " + provider.key };
  if (provider.name === "openrouter") {
    headers["HTTP-Referer"] = "https://hiwar-zynora1.vercel.app";
    headers["X-Title"] = "Hiwar Arabic Tutor";
  }
  const body = JSON.stringify({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
  });

  let upstream = await fetch(provider.url, { method: "POST", headers, body });
  // Free tiers spike briefly: one quiet retry of the same model.
  if (upstream.status === 503 || upstream.status === 429) {
    await new Promise((r) => setTimeout(r, 500));
    upstream = await fetch(provider.url, { method: "POST", headers, body });
  }

  const text = await upstream.text();
  if (!upstream.ok) {
    return { ok: false, status: upstream.status };
  }
  const data = safeParse(text);
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) return { ok: false, status: 204 };
  return { ok: true, content };
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  // The desktop app and the GitHub Pages mirror call this endpoint from
  // another origin. It is public and cookie-less, so a wildcard is fine and
  // the per-IP budget still applies.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const providers = buildProviders();
  const perIpLimit = Number(process.env.TUTOR_DAILY_PER_IP || 40);
  const totalLimit = Number(process.env.TUTOR_DAILY_TOTAL || 1500);

  // GET is the availability probe the app uses at boot.
  if (req.method === "GET") {
    rollDay();
    const first = providers[0];
    return res.status(200).json({
      configured: providers.length > 0,
      provider: first ? first.name : null,
      providers: providers.map((p) => p.name),
      model: first ? first.models[0] : null,
      remainingToday: providers.length ? Math.max(0, totalLimit - global.count) : 0,
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!providers.length) {
    return res.status(503).json({
      error: "not_configured",
      message: "The shared tutor is not switched on for this deployment yet.",
    });
  }

  rollDay();

  const ip = clientIp(req);
  const used = perIp.get(ip) || 0;
  if (used >= perIpLimit) {
    return res.status(429).json({
      error: "daily_limit",
      message: "You have used today's free tutor messages. Guided practice still works, and your own key removes the limit.",
    });
  }
  if (global.count >= totalLimit) {
    return res.status(429).json({
      error: "capacity",
      message: "The shared tutor is at capacity for today. Guided practice still works, or add your own key in Settings.",
    });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const messages = cleanMessages(body?.messages);
  if (!messages) {
    return res.status(400).json({ error: "bad_request", message: "No messages were sent." });
  }

  perIp.set(ip, used + 1);
  global.count += 1;

  const maxTokens = Math.min(Number(body.max_tokens) || 400, MAX_TOKENS);
  const temperature = Math.min(Math.max(Number(body.temperature) || 0.8, 0), 1.2);

  let attempts = 0;
  let lastStatus = 0;
  try {
    for (const provider of providers) {
      for (const model of provider.models) {
        if (attempts >= MAX_ATTEMPTS) break;
        attempts += 1;
        const result = await askProvider(provider, model, messages, maxTokens, temperature);
        if (result.ok) {
          return res.status(200).json({
            choices: [{ message: { role: "assistant", content: result.content } }],
            provider: provider.name,
            model,
            remainingToday: Math.max(0, totalLimit - global.count),
          });
        }
        lastStatus = result.status;
      }
    }
  } catch (err) {
    return res.status(502).json({
      error: "network",
      message: "The tutor could not be reached. Please try again.",
    });
  }

  // Hand back a plain-language reason only: never echo provider internals.
  const busy = lastStatus === 429 || lastStatus === 503;
  return res.status(busy ? 503 : 502).json({
    error: busy ? "busy" : "upstream",
    message: busy
      ? "The tutor is busy right now. Wait a moment and try again."
      : "The tutor is having trouble right now. Please try again in a moment.",
    status: lastStatus,
  });
};

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
