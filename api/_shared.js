export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
export const MODEL_SERVICE_URL =
  process.env.ORACLE_MODEL_SERVICE_URL || "https://shir-man.com/api/free-llm/top-models";
export const DEFAULT_MODEL = "openrouter/free";
export const MAX_BODY_BYTES = 16 * 1024;
export const MODEL_CACHE_TTL_MS = 10 * 60 * 1000;

let modelCache = null;

export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req.body === "string") {
    return req.body.trim() ? JSON.parse(req.body) : {};
  }

  let raw = "";

  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      throw Object.assign(new Error("Request body is too large."), { statusCode: 413 });
    }
  }

  return raw.trim() ? JSON.parse(raw) : {};
}

export async function fetchJson(url, options = {}, timeoutMs = 12000) {
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

export async function getPreferredModel() {
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

export function cleanQuestion(question) {
  return String(question || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 800);
}

export function parseJsonFromModel(text) {
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
