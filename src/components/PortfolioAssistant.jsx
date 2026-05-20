import { useEffect, useMemo, useState } from "react";
import { siteContent } from "../content/siteContent";

const initialMessages = [
  {
    role: "assistant",
    text:
      "Ask me about Val's product fit, ADHD Planner, project lab, AI-assisted building, or how to contact her.",
    source: "curated context",
  },
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function summarizeProject(project) {
  return `${project.title}: ${project.description || project.cardText} Hiring signal: ${project.proves}`;
}

function createLocalReply(question) {
  const query = normalizeText(question);
  const { profile, teamFit, projects, contact, featuredCaseStudy } = siteContent;
  const planner = projects.find((project) => project.id === "planner");
  const jobs = projects.find((project) => project.id === "jobs");
  const dzyn = projects.find((project) => project.id === "i-ching");
  const dossier = projects.find((project) => project.id === "dossier");
  const creative = projects.find((project) => project.id === "creative-generator");

  if (!query) {
    return initialMessages[0].text;
  }

  if (hasAny(query, ["contact", "email", "linkedin", "github", "hire", "reach", "talk", "связ", "контакт"])) {
    return `Val is currently ${contact.status}. Best contact: me@valquilty.com. LinkedIn: linkedin.com/in/valentyn-havrychenko. GitHub: github.com/QuiltyVal.`;
  }

  if (hasAny(query, ["adhd", "planner", "rescue", "today", "mission", "task paralysis", "overwhelm", "планер"])) {
    return `${summarizeProject(planner)} Core mechanics: ${featuredCaseStudy.featureTags.join(", ")}. The important point: this is not a generic todo app; it turns avoidance, stale tasks, and freeze moments into product requirements.`;
  }

  if (hasAny(query, ["fit", "role", "product owner", "pm", "team", "job", "career", "position", "роль", "работ"])) {
    return `Val is aiming for Product Owner, Junior PM, AI product builder, or product operations roles. She fits best where someone has to clarify messy workflows, write specs, prototype product flows with AI tools, and communicate across product/design/engineering. She is not positioning herself as a pure software engineer.`;
  }

  if (hasAny(query, ["ai", "codex", "chatgpt", "claude", "cursor", "prototype", "api", "automation", "bot", "llm", "ии"])) {
    return `Val uses AI tools as execution partners: specs, flow design, interface prototypes, API-backed demos, automations, bots, and product experiments. The evidence is the portfolio itself: ADHD Planner, Jobs Dashboard, Dzyn / I Ching, Dossier, and a private Gemini creative generator.`;
  }

  if (hasAny(query, ["jobs", "dashboard", "vacancy", "applications", "cv", "ваканс"])) {
    return `${summarizeProject(jobs)} It matters because it shows product-ops thinking: turning a chaotic job search into a visible pipeline with statuses, variants, source links, daily actions, and decisions.`;
  }

  if (hasAny(query, ["i ching", "iching", "dzyn", "random", "quantum", "oracle", "mystic", "randomness", "и цзын"])) {
    return `${summarizeProject(dzyn)} The framing is important: it is not presented as mysticism. It explores randomness as an interaction primitive for decision workflows, prediction-like interfaces, and AI/API orchestration.`;
  }

  if (hasAny(query, ["dossier", "calorie", "nutrition", "local model", "privacy", "phone", "калор"])) {
    return `${summarizeProject(dossier)} It also tests a larger product idea: personal apps with local AI on the phone, tuned to the user while keeping sensitive data private.`;
  }

  if (hasAny(query, ["gemini", "creative", "ad", "brand", "assets", "advertising", "креатив"])) {
    return `${summarizeProject(creative)} It is private, but the product signal is clear: multimodal prompting, brand constraints, asset reuse, and generation workflow design.`;
  }

  if (hasAny(query, ["risk", "weak", "limit", "engineer", "coding", "software", "ml", "data", "риск"])) {
    return `The honest risk: Val is not selling herself as a hard software engineer, ML engineer, or data engineer. The fit is stronger for product ownership, product operations, AI-assisted prototyping, workflow design, internal tools, and user-facing product flows.`;
  }

  return `${profile.name} turns messy human workflows into usable product prototypes. ${teamFit.copy} Her flagship proof is ADHD Planner; supporting projects show job-search operations, AI UX/randomness workflows, privacy-first personal tooling, and multimodal creative generation.`;
}

async function requestRemoteReply(question) {
  const response = await fetch("/api/portfolio-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok || !contentType.includes("application/json")) {
    throw new Error("Portfolio chat endpoint is not available.");
  }

  const data = await response.json();
  if (!data?.reply) {
    throw new Error("Portfolio chat endpoint returned no reply.");
  }

  return data;
}

export function PortfolioAssistant({ prompts = [], className = "" }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const visiblePrompts = useMemo(() => prompts.slice(0, 4), [prompts]);

  async function submitQuestion(value) {
    const question = String(value || draft).trim();
    if (!question || isThinking) return;

    const userMessage = { role: "user", text: question };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsThinking(true);

    try {
      const remote = await requestRemoteReply(question);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: remote.reply,
          source: remote.source || "portfolio model",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: createLocalReply(question),
          source: "curated context",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitQuestion();
  }

  return (
    <div className={["portfolio-assistant", className].filter(Boolean).join(" ")} aria-label="Ask Val portfolio assistant">
      <div className="portfolio-assistant__status">
        <span>portfolio assistant</span>
        <strong>{isThinking ? "thinking" : "ready"}</strong>
      </div>

      <div className="portfolio-assistant__messages" aria-live="polite">
        {messages.map((message, index) => (
          <article className={`assistant-message assistant-message--${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.role === "assistant" ? "assistant" : "visitor"}</span>
            <p>{message.text}</p>
            {message.source ? <small>{message.source}</small> : null}
          </article>
        ))}
      </div>

      {visiblePrompts.length ? (
        <div className="portfolio-assistant__prompts" aria-label="Suggested questions">
          {visiblePrompts.map((prompt) => (
            <button type="button" key={prompt} onClick={() => submitQuestion(prompt)} disabled={isThinking}>
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <form className="portfolio-assistant__form" onSubmit={handleSubmit}>
        <label htmlFor="portfolio-assistant-question">Ask a question</label>
        <div>
          <input
            id="portfolio-assistant-question"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about Val's role fit, ADHD Planner, or AI prototypes"
            maxLength={420}
          />
          <button type="submit" disabled={isThinking || !draft.trim()}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export function PortfolioAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const prompts = siteContent.assistant?.prompts ?? [];

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#ask-val") {
        setIsOpen(true);
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    return () => {
      window.removeEventListener("hashchange", openFromHash);
    };
  }, []);

  return (
    <aside className={["assistant-widget", isOpen ? "is-open" : ""].filter(Boolean).join(" ")} id="ask-val">
      <button
        className="assistant-widget__launcher"
        type="button"
        aria-expanded={isOpen}
        aria-controls="portfolio-assistant-window"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>Ask Val</span>
        <small>portfolio assistant</small>
      </button>

      {isOpen ? (
        <section
          className="assistant-widget__panel"
          id="portfolio-assistant-window"
          aria-label="Ask Val chat window"
        >
          <div className="assistant-widget__head">
            <div>
              <span>Ask Val</span>
              <strong>portfolio assistant</strong>
            </div>
            <button type="button" aria-label="Close Ask Val" onClick={() => setIsOpen(false)}>
              close
            </button>
          </div>

          <PortfolioAssistant prompts={prompts} className="portfolio-assistant--widget" />
        </section>
      ) : null}
    </aside>
  );
}
