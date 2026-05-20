import { createReadingFromBits, fallbackInterpretation } from "../src/lib/iching.js";
import {
  OPENROUTER_URL,
  cleanQuestion,
  fetchJson,
  getPreferredModel,
  parseJsonFromModel,
  readJsonBody,
  sendJson,
} from "./_shared.js";

const QRANDOM_URL = "https://qrandom.io/api/random/ints?min=0&max=1&n=18";

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
          "HTTP-Referer": process.env.PUBLIC_SITE_URL || "https://valquilty.com",
          "X-OpenRouter-Title": process.env.PUBLIC_SITE_NAME || "Val Quilty Portfolio",
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

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
