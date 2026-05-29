import {
  OPENROUTER_URL,
  cleanQuestion,
  fetchJson,
  getPreferredModel,
  readJsonBody,
  sendJson,
} from "./_shared.js";

const PORTFOLIO_CONTEXT = `
Public name: Val Quilty.
Email: me@valquilty.com.
LinkedIn: https://www.linkedin.com/in/valentyn-havrychenko/.
GitHub: https://github.com/QuiltyVal.

Positioning:
Val is growing toward Product Owner, Junior PM, AI product builder, and product operations roles.
She is not positioning herself as a pure software engineer, ML engineer, data engineer, marketing copywriter, or AI video creative.
Her strongest value: product thinking, AI-assisted prototyping, workflow design, UX logic, communication, marketing-domain understanding from long experience, and making product ideas tangible with modern AI tools.

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
NovaHaus: concept / prototype direction for real-estate lead generation. It turns property context, audience segments, campaign hypotheses, message variants, lead capture, and follow-up logic into one structured commercial workflow. Signal: Val understands marketing and lead-generation operations from long work experience, but she is not positioning as a marketing-only candidate.

Best fit:
Teams building AI workflows, internal tools, productivity apps, automations, bots, user-facing web products, or product operations systems.
Daily work she can support: user problem framing, product specs, user stories, product flows, acceptance criteria, prototype execution with AI tools, API-backed demos, and communication across product/design/engineering.
`;

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
    return "Val uses AI tools as execution partners: specs, flow design, interface prototypes, API-backed demos, automations, bots, and product experiments. The portfolio proof is ADHD Planner, Jobs Dashboard, Dzyn / I Ching, Dossier, a private Gemini creative generator, and NovaHaus.";
  }

  if (
    normalized.includes("novahaus") ||
    normalized.includes("nova haus") ||
    normalized.includes("marketing") ||
    normalized.includes("lead") ||
    normalized.includes("real estate") ||
    normalized.includes("real-estate") ||
    normalized.includes("growth") ||
    normalized.includes("маркет") ||
    normalized.includes("лид") ||
    normalized.includes("недвиж")
  ) {
    return "NovaHaus is Val's real-estate lead-generation product concept. It shows she understands marketing and lead operations from long experience and can turn that domain knowledge into product workflows: property context, audience angles, campaign hypotheses, message variants, lead capture, and follow-up logic.";
  }

  if (normalized.includes("contact") || normalized.includes("email") || normalized.includes("linkedin") || normalized.includes("контакт")) {
    return "You can contact Val at me@valquilty.com, on LinkedIn at linkedin.com/in/valentyn-havrychenko, or on GitHub at github.com/QuiltyVal.";
  }

  return "Val turns messy human workflows into usable product prototypes. Her flagship proof is ADHD Planner; supporting projects show job-search operations, AI UX/randomness workflows, privacy-first personal tooling, multimodal creative generation, and marketing-domain workflow thinking through NovaHaus.";
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
          "HTTP-Referer": process.env.PUBLIC_SITE_URL || "https://valquilty.com",
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

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
