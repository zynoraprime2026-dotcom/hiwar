/**
 * Hiwar shared tutor endpoint.
 *
 * Why this exists: the AI tutor used to need a personal API key, which is the
 * single biggest thing that stopped people from using Hiwar. This function
 * keeps ONE key on the server so any visitor can hold a real conversation,
 * while the key itself never reaches the browser.
 *
 * Safety rails, because the endpoint is public:
 *   - the model, token ceiling and temperature are set here, never by the client
 *   - the message list is trimmed and each message is length-capped
 *   - a per-IP daily budget plus a global daily ceiling stop runaway spend
 *   - no conversation is logged or stored; requests pass through untouched
 *
 * Configuration (Vercel → Project → Settings → Environment Variables):
 *   OPENROUTER_API_KEY  required, a free OpenRouter key is enough
 *   TUTOR_MODEL         optional, defaults to a free OpenRouter model
 *   TUTOR_DAILY_PER_IP  optional, default 40
 *   TUTOR_DAILY_TOTAL   optional, default 1500
 */

const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";
const GATEWAY = "https://ai-gateway.vercel.sh/v1/chat/completions";
const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const DEFAULT_GATEWAY_MODEL = "openai/gpt-4o-mini";

const MAX_MESSAGES = 14;
const MAX_CHARS_PER_MESSAGE = 1200;
const MAX_TOKENS = 500;

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

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const gatewayToken = process.env.VERCEL_OIDC_TOKEN;
  const viaGateway = !openrouterKey && Boolean(gatewayToken);
  const key = openrouterKey || gatewayToken;
  const model = process.env.TUTOR_MODEL || (viaGateway ? DEFAULT_GATEWAY_MODEL : DEFAULT_MODEL);
  const perIpLimit = Number(process.env.TUTOR_DAILY_PER_IP || 40);
  const totalLimit = Number(process.env.TUTOR_DAILY_TOTAL || 1500);

  // GET is the availability probe the app uses at boot.
  if (req.method === "GET") {
    rollDay();
    return res.status(200).json({
      configured: Boolean(key),
      provider: key ? (viaGateway ? "vercel-gateway" : "openrouter") : null,
      model: key ? model : null,
      remainingToday: key ? Math.max(0, totalLimit - global.count) : 0,
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!key) {
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
  const messages = cleanMessages(body.messages);
  if (!messages) {
    return res.status(400).json({ error: "bad_request", message: "No messages were sent." });
  }

  perIp.set(ip, used + 1);
  global.count += 1;

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
    };
    if (!viaGateway) {
      headers["HTTP-Referer"] = "https://hiwar-zynora1.vercel.app";
      headers["X-Title"] = "Hiwar Arabic Tutor";
    }
    const upstream = await fetch(viaGateway ? GATEWAY : OPENROUTER, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: Math.min(Number(body.max_tokens) || 400, MAX_TOKENS),
        temperature: Math.min(Math.max(Number(body.temperature) || 0.8, 0), 1.2),
      }),
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      // Hand back the status only: never echo provider internals to the browser.
      return res.status(upstream.status === 429 ? 429 : 502).json({
        error: "upstream",
        message: "The tutor is having trouble right now. Please try again in a moment.",
        status: upstream.status,
      });
    }

    const data = safeParse(text);
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res.status(502).json({ error: "empty", message: "The tutor sent nothing back. Try again." });
    }

    return res.status(200).json({
      choices: [{ message: { role: "assistant", content } }],
      remainingToday: Math.max(0, totalLimit - global.count),
    });
  } catch (err) {
    return res.status(502).json({
      error: "network",
      message: "The tutor could not be reached. Please try again.",
    });
  }
};

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
