import plannerPreview from "../../assets/generated/adhd-planner-preview.jpg";
import quantumHero from "../../assets/generated/quantum-iching-hero.jpg";

const plannerDemoUrl = "https://planner.valquilty.com/demo";

export const siteContent = {
  voice: "product lab systems",
  profile: {
    name: "Val Quilty",
    eyebrow: "Val Quilty / Product Owner track / AI-assisted product builder",
    headline: "I turn messy workflows into usable product prototypes",
    lede:
      "I'm growing toward Product Owner / Junior PM roles in teams building AI workflows, internal tools, productivity apps, or user-facing web products. My strength is product judgment plus AI-assisted execution: specs, flows, prototypes, APIs, automations, and clear communication.",
    tags: ["Product Owner track", "AI-assisted prototyping", "workflow systems", "team communication"],
    proof: [
      {
        label: "target",
        value: "Product Owner / Junior PM",
      },
      {
        label: "edge",
        value: "product judgment + AI-assisted execution",
      },
      {
        label: "proof",
        value: "public flagship prototype: ADHD Planner",
      },
    ],
  },
  philosophy: {
    label: "how I work",
    title: "I like turning messy human workflows into clear product systems",
    copy:
      "I am interested in the space between product ownership, user empathy, and AI-assisted building. I use AI tools as execution partners: to prototype faster, test flows, connect APIs, and make product ideas tangible before they become roadmaps.",
    tags: ["product thinking", "workflow design", "AI-assisted prototyping", "systems thinking"],
  },
  assistant: {
    label: "ask val",
    title: "Ask the portfolio about my product work",
    copy:
      "A small assistant surface for recruiters and product teams: it answers from curated portfolio context about my role fit, ADHD Planner, product lab, and AI-assisted building practice.",
    prompts: [
      "How can I contact Val?",
      "Why might Val fit a Product Owner role?",
      "What is ADHD Planner?",
      "What can Val build with AI tools?",
      "What is the honest risk?",
    ],
    signals: ["curated context", "LLM-ready endpoint", "portfolio knowledge", "fallback replies"],
  },
  teamFit: {
    label: "team fit",
    title: "Where I fit in a product team",
    copy:
      "I am strongest in the layer between user problems, product logic, design detail, and prototype execution. I can turn unclear workflows into specs, testable flows, internal tools, and AI-assisted product demos.",
    note:
      "I am not applying as a pure software engineer. I want to grow in a team where product judgment, communication, UX logic, and AI-assisted building matter.",
    items: [
      {
        label: "I can own",
        copy: "problem framing, user stories, product flows, acceptance criteria, and iteration notes.",
      },
      {
        label: "I can prototype",
        copy: "web flows, internal tools, automations, API-backed demos, and AI-assisted interfaces.",
      },
      {
        label: "I can coordinate",
        copy: "logic between users, design, engineering, data, and delivery constraints.",
      },
    ],
  },
  contact: {
    status: "open to product owner, AI product builder, and product operations roles",
    note:
      "If your team needs someone who can clarify workflows, write product specs, prototype with AI tools, and communicate across product/design/engineering, I would like to talk.",
    links: [
      { label: "Email", value: "me@valquilty.com", href: "mailto:me@valquilty.com" },
      { label: "LinkedIn", value: "valentyn-havrychenko", href: "https://www.linkedin.com/in/valentyn-havrychenko/" },
      { label: "GitHub", value: "QuiltyVal", href: "https://github.com/QuiltyVal" },
      { label: "ADHD Planner demo", value: "public demo", href: plannerDemoUrl },
      { label: "Project lab", value: "on this page", to: "#projects" },
    ],
  },
  projects: [
    {
      id: "planner",
      eyebrow: "recovery-first planner",
      title: "ADHD Planner",
      subtitle: "An external executive-function layer for stuck brains.",
      status: "public demo",
      url: plannerDemoUrl,
      image: plannerPreview,
      imageMode: "screenshot",
      imageAlt: "ADHD Planner demo interface preview",
      description:
        "A playful executive-function companion for task paralysis: one daily mission, rescue mode for freeze moments, task worlds, Telegram/email nudges, and mascot-guided onboarding.",
      hypothesis:
        "When a user is frozen, the product should reduce pressure, hide overload, and create one emotionally safe entry point before asking for more prioritization.",
      workflow: "Daily mission selection, Rescue Mode, task worlds, sticky-quest diagnosis, stale-task cleanup, Telegram/email nudges.",
      proves: "Product thinking, ADHD UX, executive-function workflow design, and AI-assisted end-to-end prototype execution.",
      tags: [
        "React",
        "Firebase",
        "Telegram bot",
        "Email nudges",
        "Planner Engine",
        "ADHD UX",
        "Executive function",
        "Mascot onboarding",
        "Rescue mode",
      ],
      heroTags: ["today mission", "rescue mode", "external executive layer", "planner engine"],
      signals: [
        "recovery-first UX",
        "task paralysis",
        "external executive function",
        "workflow design",
        "retention nudges",
        "AI-assisted build",
        "product prototype",
      ],
      actions: [{ label: "Try the demo", href: plannerDemoUrl }],
      featured: true,
      heroSlot: "planner",
    },
    {
      id: "jobs",
      eyebrow: "job-search operations",
      title: "Jobs Dashboard",
      status: "protected",
      url: "https://jobs.valquilty.com/",
      cardText:
        "A protected dashboard for vacancies, CV variants, cover letters, source links, daily actions, and decisions.",
      description:
        "A personal job-search operations dashboard I use while looking for product roles: vacancies, applications, CV variants, cover letters, source links, daily actions, and decision status in one workflow.",
      hypothesis:
        "Job search needs a visible operations pipeline, not scattered tabs.",
      workflow: "Vacancy capture -> status -> CV/letter variants -> follow-up decision.",
      proves: "Operations thinking, workflow visibility, and internal-tool instincts.",
      tags: ["dashboard", "job search", "workflow ops", "cv automation"],
      signals: [
        "job-search ops",
        "personal CRM",
        "pipeline tracking",
        "CV variants",
        "decision status",
        "internal tools",
      ],
      actions: [{ label: "open dashboard", href: "https://jobs.valquilty.com/" }],
      featured: true,
      heroSlot: "jobs",
    },
    {
      id: "i-ching",
      eyebrow: "AI UX / randomness lab",
      title: "Dzyn / I Ching",
      status: "public app",
      url: "https://i-ching.valquilty.com/en/i-ching",
      image: quantumHero,
      imageMode: "cover",
      imageAlt: "Dzyn I Ching interface artwork",
      cardText:
        "A public AI UX lab for text assembly, design-system checks, API orchestration, and quantum-random input.",
      description:
        "An experimental AI interface for testing text-assembly mechanics, design language, external API orchestration, and quantum-random coin casting. The product question is randomness as an interaction primitive, not mysticism.",
      hypothesis:
        "Randomness can be an interface input, not a mystical claim.",
      workflow: "Random source -> AI text assembly -> API response -> interface check.",
      proves: "AI UX, API orchestration, and careful framing of ambiguous product concepts.",
      tags: ["AI UX", "quantum randomness", "OpenRouter", "local models"],
      signals: [
        "randomness engine",
        "API orchestration",
        "text assembly",
        "design system test",
        "prediction workflows",
        "local AI hypothesis",
      ],
      actions: [{ label: "open Dzyn", href: "https://i-ching.valquilty.com/en/i-ching" }],
      featured: true,
      heroSlot: "oracle",
    },
    {
      id: "dossier",
      eyebrow: "personal calorie tooling",
      title: "Dossier",
      status: "public app",
      url: "http://dossier.valquilty.com/",
      cardText:
        "A personal calorie and macro tracker for testing mobile-first, privacy-first AI around sensitive data.",
      description:
        "A personal calorie and macro tracker for quick food logging, daily feedback, and testing local AI on mobile devices as a privacy-first app concept: personal data, personal model, personal tuning.",
      hypothesis:
        "Sensitive personal apps can pair local data with on-device AI.",
      workflow: "Food logging -> daily feedback -> macro view -> local-model privacy hypothesis.",
      proves: "Applied tooling, mobile-first thinking, privacy-first AI, and practical utility.",
      tags: ["Next.js", "nutrition", "mobile-first", "local AI"],
      signals: [
        "personal tooling",
        "calorie tracking",
        "on-device models",
        "privacy-first AI",
        "personalized feedback",
        "mobile app future",
      ],
      actions: [{ label: "open dossier", href: "http://dossier.valquilty.com/" }],
      featured: true,
      heroSlot: "dossier",
    },
    {
      id: "creative-generator",
      eyebrow: "multimodal creative workflow",
      title: "Gemini Creative Generator",
      status: "private prototype",
      cardText:
        "A private Gemini API prototype for brand-consistent ad concepts from a reference creative and company assets.",
      description:
        "A Gemini API prototype that reads a reference creative, accepts company assets, and generates brand-consistent ad concepts in a corporate style.",
      hypothesis:
        "Creative generation improves when brand assets constrain the output.",
      workflow: "Reference analysis -> asset input -> brand constraints -> generated ad concepts.",
      proves: "Multimodal prompting, brand constraints, asset reuse, and workflow design.",
      tags: ["Gemini API", "multimodal prompting", "brand assets", "creative automation"],
      signals: [
        "multimodal AI",
        "brand constraints",
        "asset reuse",
        "generation workflow",
        "reference matching",
        "prototype thinking",
      ],
      actions: [{ label: "private prototype", disabled: true }],
      featured: false,
    },
  ],
  featuredCaseStudy: {
    projectId: "planner",
    label: "flagship case study",
    title: "ADHD Planner",
    subtitle: "An external executive-function layer for stuck brains.",
    intro:
      "Most task managers assume the user can calmly prioritize. ADHD Planner starts from the opposite state: overwhelm, avoidance, sticky tasks, and the need for one emotionally safe entry point.",
    thesis:
      "The product hypothesis is simple: if the user is frozen, the planner should reduce pressure, hide overload, and create one reachable next action before it asks for more prioritization.",
    systemSteps: [
      {
        label: "01",
        title: "Today Mission",
        copy: "Narrow the whole day to one reachable move.",
      },
      {
        label: "02",
        title: "Rescue Mode",
        copy: "Give freeze moments a tiny recovery flow.",
      },
      {
        label: "03",
        title: "Task Worlds",
        copy: "Keep focus, background, stale, and completed tasks visible.",
      },
      {
        label: "04",
        title: "Nudges",
        copy: "Use Telegram and email to bring the planner back gently.",
      },
      {
        label: "05",
        title: "Planner Engine",
        copy: "Connect commands, reports, stale cleanup, and delivery health.",
      },
    ],
    points: [
      {
        label: "Target user",
        copy: "People who experience ADHD-style task paralysis, avoidance, stale tasks, and the pressure of lists that keep growing.",
      },
      {
        label: "Problem",
        copy: "When everything feels equally urgent, a task list becomes another source of pressure instead of a tool.",
      },
      {
        label: "Product idea",
        copy: "The planner narrows the day to one Today Mission, diagnoses sticky quests, and gives the user Rescue Mode when they freeze.",
      },
      {
        label: "My role",
        copy: "Concept, product logic, UX structure, mascot flows, AI-assisted implementation, copy, testing, and iteration.",
      },
      {
        label: "Built",
        copy: "React interface, Firebase-backed task state, Telegram/email nudges, planner reports, and a backend Planner Engine contract.",
      },
      {
        label: "Why it matters",
        copy: "This is not a generic todo app. It treats recovery, avoidance, and stale tasks as product requirements.",
      },
    ],
    worlds: [
      {
        label: "Today Mission",
        title: "One reachable next step",
        copy: "The interface narrows the day to one chosen mission instead of asking the user to rank everything.",
      },
      {
        label: "Rescue Mode",
        title: "For freeze moments",
        copy: "A small recovery flow helps the user restart gently when avoidance or overwhelm takes over.",
      },
      {
        label: "Active",
        title: "Focus / Background / Purgatory",
        copy: "Active work is split into visible zones so attention, waiting, and stuck tasks are not mixed together.",
      },
      {
        label: "Heaven / Cemetery",
        title: "Done and stale are visible",
        copy: "Completed tasks get a place to land; stale tasks are cleaned up instead of silently rotting in the list.",
      },
      {
        label: "Angel / Devil",
        title: "Mascots with jobs",
        copy: "The angel helps the user start gently. The devil cleans stale tasks and reports what changed.",
      },
      {
        label: "Nudges",
        title: "Backend delivery logic",
        copy: "Telegram and email nudges connect the playful interface to a real planner engine and delivery health checks.",
      },
    ],
    featureTags: [
      "Today Mission",
      "Rescue Mode",
      "Task worlds",
      "Planner Engine",
      "Telegram/email nudges",
      "Firebase-backed state",
    ],
    nextTests: [
      "Measure whether Rescue Mode helps users restart after avoidance.",
      "Test which nudges feel supportive instead of pressuring.",
      "Refine the Planner Engine reports so stale-task cleanup feels transparent.",
    ],
    actionLabel: "Try the demo",
  },
  competencies: [
    {
      label: "product ownership",
      copy: "I translate messy user states into product requirements, tradeoffs, and testable flows.",
      items: ["problem framing", "user stories", "success criteria"],
    },
    {
      label: "AI-assisted building",
      copy: "I use AI tools as execution partners to get from an idea to a working prototype faster.",
      items: ["Codex / ChatGPT", "API orchestration", "fast iteration"],
    },
    {
      label: "workflow systems",
      copy: "I like products that make repeated work visible, structured, and easier to act on.",
      items: ["internal tools", "dashboards", "automation flows"],
    },
    {
      label: "UX / interaction",
      copy: "I care about interfaces that meet the user in the state they are actually in.",
      items: ["recovery-first UX", "AI interfaces", "mobile-first concepts"],
    },
  ],
  careerDirection: {
    label: "career direction",
    title: "I want to grow into product ownership in a larger product team",
    copy:
      "I am looking for product owner, junior product manager, AI product builder, or product operations roles where I can combine product judgment, AI-assisted prototyping, workflow design, and communication.",
    roles: ["product owner", "junior product manager", "AI product builder", "product operations"],
    dailyWork: [
      "turn user problems into specs and flows",
      "prototype product ideas with AI tools",
      "coordinate logic between design, data, and engineering",
      "test workflows with real use cases",
    ],
    environments: [
      "internal tools",
      "AI workflows",
      "productivity apps",
      "user-facing web apps",
      "automation systems",
    ],
    note:
      "I am not positioning myself as a pure software engineer. My strongest value is fast product thinking plus prototype execution with modern AI tools.",
  },
};
