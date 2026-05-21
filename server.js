import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadingFromBits, fallbackInterpretation } from "./src/lib/iching.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "dist");

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const RESEND_URL = "https://api.resend.com/emails";
const MODEL_SERVICE_URL =
  process.env.ORACLE_MODEL_SERVICE_URL || "https://shir-man.com/api/free-llm/top-models";
const QRANDOM_URL = "https://qrandom.io/api/random/ints?min=0&max=1&n=18";
const DEFAULT_MODEL = "openrouter/free";
const MAX_BODY_BYTES = 16 * 1024;
const MODEL_CACHE_TTL_MS = 10 * 60 * 1000;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "me@valquilty.com";
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Val Quilty Portfolio <onboarding@resend.dev>";

const PORTFOLIO_CONTEXT = `
Public name: Val Quilty.
Email: me@valquilty.com.
LinkedIn: https://www.linkedin.com/in/valentyn-havrychenko/.
GitHub: https://github.com/QuiltyVal.

Positioning:
Val is growing toward Product Owner, Junior PM, AI product builder, and product operations roles.
She is not positioning herself as a pure software engineer, ML engineer, data engineer, marketing copywriter, or AI video creative.
Her strongest value: product thinking, AI-assisted prototyping, workflow design, UX logic, communication, and making product ideas tangible with modern AI tools.

Flagship project:
ADHD Planner is a recovery-first planner for stuck brains. It is not a generic todo app.
It starts from task paralysis, avoidance, stale tasks, overwhelm, and the need for one reachable next move.
Core mechanics: one Today Mission, Rescue Mode for freeze moments, visible task worlds, sticky-quest diagnosis, Telegram/email nudges, Firebase-backed task state, mascot onboarding, Planner Engine contracts, reports, stale cleanup, and delivery health.
Mascots: an angel helps the user start gently; a devil cleans stale tasks and reports what changed.
Demo: https://planner.valquilty.com/demo.

Supporting projects:
Jobs Dashboard: protected job-search operations dashboard for vacancies, applications, CV variants, cover letters, source links, daily actions, and decisions. Signal: product operations, internal tooling, pipeline thinking.
Dzyn / I Ching: public AI UX and randomness lab. Not mysticism as belief. Product hypothesis: randomness as an interaction primitive for decision workflows, prediction-like interfaces, and AI/API orchestration. Demo: https://i-ching.valquilty.com/en/i-ching.
Dossier: personal calorie and macro tracker. Signal: mobile-first, privacy-first personal tooling, local AI on-device hypothesis for sensitive data. Demo: http://dossier.valquilty.com/.
Gemini Creative Generator: private prototype using Gemini API to read a reference creative, accept company assets, and generate brand-consistent ad concepts. Signal: multimodal prompting, brand constraints, asset reuse, generation workflow.

Best fit:
Teams building AI workflows, internal tools, productivity apps, automations, bots, user-facing web products, or product operations systems.
Daily work she can support: user problem framing, product specs, user stories, product flows, acceptance criteria, prototype execution with AI tools, API-backed demos, and communication across product/design/engineering.
`;

let modelCache = null;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  let raw = "";

  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      throw Object.assign(new Error("Request body is too large."), { statusCode: 413 });
    }
  }

  if (!raw.trim()) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), { statusCode: 400 });
  }
}

async function fetchJson(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 400)}`);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function getPreferredModel() {
  if (process.env.OPENROUTER_MODEL) {
    return {
      id: process.env.OPENROUTER_MODEL,
      source: "env",
      updatedAt: null,
      confidence: null,
    };
  }

  if (modelCache && Date.now() - modelCache.cachedAt < MODEL_CACHE_TTL_MS) {
    return modelCache.value;
  }

  try {
    const data = await fetchJson(MODEL_SERVICE_URL, {}, 8000);
    const model = data?.models?.[0]?.id || data?.fallback?.id || DEFAULT_MODEL;
    const value = {
      id: model,
      source: MODEL_SERVICE_URL,
      updatedAt: data?.updatedAt || null,
      confidence: data?.rankingConfidence || null,
    };

    modelCache = { cachedAt: Date.now(), value };
    return value;
  } catch (error) {
    const value = {
      id: DEFAULT_MODEL,
      source: "fallback",
      updatedAt: null,
      confidence: "unknown",
      warning: error.message,
    };

    modelCache = { cachedAt: Date.now(), value };
    return value;
  }
}

async function getQuantumBits() {
  const data = await fetchJson(QRANDOM_URL, {}, 12000);
  const numbers = data?.numbers;

  if (!Array.isArray(numbers) || numbers.length < 18) {
    throw new Error("qrandom.io returned an unexpected payload.");
  }

  const bits = numbers.slice(0, 18).map((number) => {
    if (number !== 0 && number !== 1) {
      throw new Error("qrandom.io returned a non-binary value.");
    }

    return number;
  });

  return {
    bits,
    proof: {
      source: "qrandom.io",
      hardware: "ID Quantique Quantis QRNG, as declared by qrandom.io",
      resultType: data?.resultType || null,
      requestId: data?.id || null,
      timestamp: data?.timestamp || null,
      signature: data?.signature || null,
    },
  };
}

function cleanQuestion(question) {
  return String(question || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 800);
}

function cleanField(value, maxLength) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function cleanMessage(value) {
  return String(value || "")
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .slice(0, 1800);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderContactHtml({ name, email, message, pageUrl }) {
  const safeName = escapeHtml(name || "Website visitor");
  const safeEmail = escapeHtml(email);
  const safePageUrl = escapeHtml(pageUrl || "https://valquilty.com/");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
    <div style="font-family: Georgia, serif; color: #2d241d; line-height: 1.5;">
      <h1 style="font-size: 24px; font-weight: 400;">New portfolio message</h1>
      <p><strong>From:</strong> ${safeName}</p>
      <p><strong>Reply email:</strong> ${safeEmail}</p>
      <p><strong>Page:</strong> ${safePageUrl}</p>
      <hr style="border: 0; border-top: 1px solid #d8c8b8;" />
      <p>${safeMessage}</p>
    </div>
  `;
}

function parseJsonFromModel(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function normalizeInterpretation(value, fallback) {
  if (!value || typeof value !== "object") return fallback;

  return {
    headline: String(value.headline || fallback.headline).slice(0, 180),
    core: String(value.core || fallback.core).slice(0, 1200),
    movement: String(value.movement || fallback.movement).slice(0, 1200),
    changingLines: Array.isArray(value.changingLines)
      ? value.changingLines.slice(0, 6).map((line) => ({
          line: Number(line.line) || null,
          text: String(line.text || "").slice(0, 700),
        }))
      : fallback.changingLines,
    practice: String(value.practice || fallback.practice).slice(0, 900),
    caution: String(value.caution || fallback.caution).slice(0, 600),
    source: value.source || "openrouter",
  };
}

async function createOpenRouterInterpretation(reading, modelInfo) {
  const local = fallbackInterpretation(reading);

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      interpretation: local,
      llm: {
        status: "missing-key",
        model: modelInfo.id,
        message: "Set OPENROUTER_API_KEY to enable AI interpretation.",
      },
    };
  }

  const promptPayload = {
    question: reading.question || "Вопрос не указан.",
    quantumBits: reading.bits,
    primaryHexagram: {
      number: reading.primary.number,
      ru: reading.primary.ru,
      name: reading.primary.name,
      keyword: reading.primary.keyword,
      upperTrigram: reading.primary.upper.ru,
      lowerTrigram: reading.primary.lower.ru,
    },
    relatingHexagram: reading.relating
      ? {
          number: reading.relating.number,
          ru: reading.relating.ru,
          name: reading.relating.name,
          keyword: reading.relating.keyword,
          upperTrigram: reading.relating.upper.ru,
          lowerTrigram: reading.relating.lower.ru,
        }
      : null,
    lines: reading.lines.map((line) => ({
      line: line.index,
      bits: line.bits,
      sum: line.value,
      type: line.label,
      changing: line.changing,
    })),
  };

  const body = {
    model: modelInfo.id,
    messages: [
      {
        role: "system",
        content:
          "Ты пишешь короткие, современные трактовки И-цзин на русском языке. Не предсказывай будущее как факт. Не давай медицинских, юридических или финансовых инструкций. Пиши как символическую карту внимания: ясно, живо, без эзотерического тумана. Верни только JSON.",
      },
      {
        role: "user",
        content: `Сделай трактовку расклада И-цзин по данным ниже. JSON schema: {"headline":"...","core":"...","movement":"...","changingLines":[{"line":1,"text":"..."}],"practice":"...","caution":"..."}. Данные: ${JSON.stringify(promptPayload)}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1100,
    response_format: { type: "json_object" },
  };

  try {
    const data = await fetchJson(
      OPENROUTER_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.PUBLIC_SITE_URL || "http://localhost:3000",
          "X-OpenRouter-Title": process.env.PUBLIC_SITE_NAME || "Quantum I Ching",
        },
        body: JSON.stringify(body),
      },
      Number.parseInt(process.env.OPENROUTER_TIMEOUT_MS || "25000", 10)
    );

    const text = data?.choices?.[0]?.message?.content || "";
    const parsed = parseJsonFromModel(text);

    return {
      interpretation: normalizeInterpretation(parsed, local),
      llm: {
        status: parsed ? "ok" : "repaired-fallback",
        model: modelInfo.id,
        modelSource: modelInfo.source,
        rawUsage: data?.usage || null,
      },
    };
  } catch (error) {
    return {
      interpretation: {
        ...local,
        source: "local-fallback-after-openrouter-error",
      },
      llm: {
        status: "error",
        model: modelInfo.id,
        modelSource: modelInfo.source,
        message: error.message,
      },
    };
  }
}

function createPortfolioFallback(question) {
  const normalized = cleanQuestion(question).toLowerCase();

  if (normalized.includes("adhd") || normalized.includes("planner") || normalized.includes("планер")) {
    return "ADHD Planner is Val's flagship project: a recovery-first productivity app for task paralysis, stale tasks, avoidance, and overwhelm. It uses one Today Mission, Rescue Mode, visible task worlds, mascot-guided onboarding, Telegram/email nudges, Firebase-backed task state, and Planner Engine logic.";
  }

  if (normalized.includes("fit") || normalized.includes("role") || normalized.includes("product") || normalized.includes("работ")) {
    return "Val fits Product Owner, Junior PM, AI product builder, or product operations roles where product judgment, workflow design, AI-assisted prototyping, and cross-functional communication matter. She is not presenting herself as a pure software engineer.";
  }

  if (
    normalized.includes("ai") ||
    normalized.includes("codex") ||
    normalized.includes("chatgpt") ||
    normalized.includes("prototype") ||
    normalized.includes("api") ||
    normalized.includes("automation") ||
    normalized.includes("bot") ||
    normalized.includes("ии")
  ) {
    return "Val uses AI tools as execution partners: specs, flow design, interface prototypes, API-backed demos, automations, bots, and product experiments. The portfolio proof is ADHD Planner, Jobs Dashboard, Dzyn / I Ching, Dossier, and a private Gemini creative generator.";
  }

  if (normalized.includes("contact") || normalized.includes("email") || normalized.includes("linkedin") || normalized.includes("контакт")) {
    return "You can contact Val at me@valquilty.com, on LinkedIn at linkedin.com/in/valentyn-havrychenko, or on GitHub at github.com/QuiltyVal.";
  }

  return "Val turns messy human workflows into usable product prototypes. Her flagship proof is ADHD Planner; supporting projects show job-search operations, AI UX/randomness workflows, privacy-first personal tooling, and multimodal creative generation.";
}

async function createPortfolioChatReply(question, modelInfo) {
  const local = createPortfolioFallback(question);

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      reply: local,
      source: "curated local fallback",
      llm: {
        status: "missing-key",
        model: modelInfo.id,
        message: "Set OPENROUTER_API_KEY to enable portfolio AI chat.",
      },
    };
  }

  const body = {
    model: modelInfo.id,
    messages: [
      {
        role: "system",
        content:
          "You are Ask Val, a concise portfolio assistant for recruiters and product teams. Answer only from the provided portfolio context. Be truthful and specific. Do not invent metrics, employers, degrees, seniority, or unavailable links. Make clear that Val is product-owner / junior-PM / AI-product-builder oriented, not a pure software engineer. Use plain text only: no Markdown bold, no Markdown headings, and no long bullet lists. If the user writes Russian, answer in Russian; otherwise answer in English.",
      },
      {
        role: "user",
        content: `Portfolio context:\n${PORTFOLIO_CONTEXT}\n\nVisitor question: ${cleanQuestion(question)}`,
      },
    ],
    temperature: 0.35,
    max_tokens: 520,
  };

  try {
    const data = await fetchJson(
      OPENROUTER_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.PUBLIC_SITE_URL || "http://localhost:3000",
          "X-OpenRouter-Title": process.env.PUBLIC_SITE_NAME || "Val Quilty Portfolio",
        },
        body: JSON.stringify(body),
      },
      Number.parseInt(process.env.OPENROUTER_TIMEOUT_MS || "25000", 10)
    );

    const reply = String(data?.choices?.[0]?.message?.content || "").trim();

    return {
      reply: reply.slice(0, 1800) || local,
      source: reply ? "portfolio model" : "curated local fallback",
      llm: {
        status: reply ? "ok" : "empty-response",
        model: modelInfo.id,
        modelSource: modelInfo.source,
        rawUsage: data?.usage || null,
      },
    };
  } catch (error) {
    return {
      reply: local,
      source: "curated fallback after model error",
      llm: {
        status: "error",
        model: modelInfo.id,
        modelSource: modelInfo.source,
        message: error.message,
      },
    };
  }
}

async function handlePortfolioChat(req, res) {
  try {
    const body = await readJsonBody(req);
    const question = cleanQuestion(body.question);

    if (!question) {
      sendJson(res, 400, { ok: false, error: "Question is required." });
      return;
    }

    const modelInfo = await getPreferredModel();
    const result = await createPortfolioChatReply(question, modelInfo);

    sendJson(res, 200, {
      ok: true,
      createdAt: new Date().toISOString(),
      model: modelInfo,
      ...result,
    });
  } catch (error) {
    sendJson(res, error.statusCode || 502, {
      ok: false,
      error: error.message || "Portfolio chat failed.",
    });
  }
}

async function handleContactMessage(req, res) {
  try {
    const body = await readJsonBody(req);
    const honeypot = cleanField(body.company, 120);

    if (honeypot) {
      sendJson(res, 200, { ok: true });
      return;
    }

    const name = cleanField(body.name, 120);
    const email = cleanField(body.email, 180).toLowerCase();
    const message = cleanMessage(body.message);
    const pageUrl = cleanField(body.pageUrl, 260);

    if (!isValidEmail(email)) {
      sendJson(res, 400, { ok: false, error: "A valid reply email is required." });
      return;
    }

    if (message.length < 4) {
      sendJson(res, 400, { ok: false, error: "Message is too short." });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      sendJson(res, 503, {
        ok: false,
        code: "email-not-configured",
        error: "Email delivery is not configured yet.",
        fallbackEmail: CONTACT_TO_EMAIL,
      });
      return;
    }

    const subjectName = name || email;
    const text = [
      "New portfolio message",
      "",
      `From: ${subjectName}`,
      `Reply email: ${email}`,
      `Page: ${pageUrl || "https://valquilty.com/"}`,
      "",
      message,
    ].join("\n");

    const data = await fetchJson(
      RESEND_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL,
          to: CONTACT_TO_EMAIL,
          reply_to: email,
          subject: `Portfolio contact: ${subjectName}`,
          text,
          html: renderContactHtml({ name, email, message, pageUrl }),
        }),
      },
      Number.parseInt(process.env.RESEND_TIMEOUT_MS || "12000", 10)
    );

    sendJson(res, 200, {
      ok: true,
      id: data?.id || data?.data?.id || null,
    });
  } catch (error) {
    console.error("contact-message failed:", error.message);
    sendJson(res, 502, {
      ok: false,
      error: "Could not send the message right now.",
    });
  }
}

async function handleReading(req, res) {
  try {
    const body = await readJsonBody(req);
    const question = cleanQuestion(body.question);
    const modelInfo = await getPreferredModel();
    const quantum = await getQuantumBits();
    const reading = createReadingFromBits(quantum.bits, question);
    const ai = await createOpenRouterInterpretation(reading, modelInfo);

    sendJson(res, 200, {
      ok: true,
      createdAt: new Date().toISOString(),
      model: modelInfo,
      quantum: quantum.proof,
      reading,
      ...ai,
    });
  } catch (error) {
    sendJson(res, error.statusCode || 502, {
      ok: false,
      error: error.message || "Reading failed.",
    });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);
  const safePath = pathname.replace(/^\/+/, "");
  let target = path.join(publicDir, safePath || "index.html");

  if (!target.startsWith(publicDir)) {
    sendJson(res, 403, { ok: false, error: "Forbidden." });
    return;
  }

  try {
    const fileStat = await stat(target);
    if (fileStat.isDirectory()) target = path.join(target, "index.html");
    await access(target);
  } catch {
    target = path.join(publicDir, "index.html");
  }

  try {
    const ext = path.extname(target);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": target.endsWith("index.html")
        ? "no-cache"
        : "public, max-age=31536000, immutable",
    });
    createReadStream(target).pipe(res);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Static file error.");
  }
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      model: await getPreferredModel(),
      hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
      hasResendKey: Boolean(process.env.RESEND_API_KEY),
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/reading") {
    await handleReading(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/portfolio-chat") {
    await handlePortfolioChat(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/contact-message") {
    await handleContactMessage(req, res);
    return;
  }

  if (req.url?.startsWith("/api/")) {
    sendJson(res, 404, { ok: false, error: "Unknown API endpoint." });
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  await serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Quantum I Ching server listening on http://localhost:${PORT}`);
});
