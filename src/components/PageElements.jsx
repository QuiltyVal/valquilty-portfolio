import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

export function ButtonLink({ to, variant = "primary", children }) {
  const className = ["button", variant === "ghost" ? "button--ghost" : ""]
    .filter(Boolean)
    .join(" ");

  if (to?.startsWith("#")) {
    return (
      <a className={className} href={to}>
        {children}
      </a>
    );
  }

  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export function ExternalButtonLink({ href, variant = "primary", children }) {
  const className = ["button", variant === "ghost" ? "button--ghost" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function StaticButton({ variant = "primary", children }) {
  const className = [
    "button",
    variant === "ghost" ? "button--ghost" : "",
    "is-static",
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={className}>{children}</span>;
}

export function PageHero({ eyebrow, title, lede, actions = [], chips = [], meta = [] }) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        <div className="page-hero__grid">
          <Reveal className="page-hero__copy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="lede">{lede}</p>
            {actions.length > 0 ? (
              <div className="cta-row">
                {actions.map((action) =>
                  action.disabled ? (
                    <StaticButton key={action.label} variant={action.variant}>
                      {action.label}
                    </StaticButton>
                  ) : (
                    <ButtonLink key={action.label} to={action.to} variant={action.variant}>
                      {action.label}
                    </ButtonLink>
                  )
                )}
              </div>
            ) : null}
            {chips.length > 0 ? (
              <div className="chip-row">
                {chips.map((chip) => (
                  <span className="chip" key={chip}>
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </Reveal>

          <Reveal as="aside" className="page-hero__panel">
            <div className="meta-list">
              {meta.map((item) => (
                <div className="meta-item" key={item.label}>
                  <span className="meta-item__label">{item.label}</span>
                  <span className="meta-item__value">{item.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ label, title, copy }) {
  return (
    <div className="section__header">
      <div>
        <p className="section-label">{label}</p>
        <h2 className="section__title">{title}</h2>
      </div>
      <div className="section__copy">{copy}</div>
    </div>
  );
}

export function QuotePanel({ quote, footer, flush = false }) {
  const className = ["quote-panel", flush ? "quote-panel--flush" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <blockquote className={className}>
      <p>{quote}</p>
      <footer>{footer}</footer>
    </blockquote>
  );
}
