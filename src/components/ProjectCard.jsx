import { useEffect, useId, useState } from "react";
import { ButtonLink, ExternalButtonLink, StaticButton } from "./PageElements";
import { Reveal } from "./Reveal";

function isWalkthroughPreviewMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("walkthrough") === "1";
}

function ProjectAction({ action }) {
  if (action.disabled) {
    return <StaticButton variant="ghost">{action.label}</StaticButton>;
  }

  if (action.href) {
    return (
      <ExternalButtonLink href={action.href} variant="ghost">
        {action.label}
      </ExternalButtonLink>
    );
  }

  return (
    <ButtonLink to={action.to} variant="ghost">
      {action.label}
    </ButtonLink>
  );
}

function ProjectWalkthroughDrawer({ project, isOpen, onClose }) {
  const titleId = useId();
  const walkthrough = project.walkthrough;
  const media = walkthrough?.video ?? project.video;
  const poster = media?.poster ?? project.image;
  const hasVideo = Boolean(media?.mp4);
  const detailItems = [
    { label: "hypothesis", value: project.hypothesis },
    { label: "workflow", value: project.workflow },
    { label: "proves", value: project.proves },
  ].filter((item) => item.value);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("project-drawer-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("project-drawer-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="project-drawer" role="presentation">
      <button
        className="project-drawer__backdrop"
        type="button"
        aria-label={`Close ${project.title} walkthrough`}
        onClick={onClose}
      />
      <aside className="project-drawer__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="project-drawer__head">
          <div>
            <p className="section-label">{hasVideo ? "screen walkthrough" : "walkthrough plan"}</p>
            <h3 id={titleId}>{project.title}</h3>
          </div>
          <button type="button" onClick={onClose}>
            close
          </button>
        </header>

        <div className="project-drawer__media">
          {hasVideo ? (
            <video autoPlay controls loop muted playsInline poster={poster}>
              <source src={media.mp4} type="video/mp4" />
            </video>
          ) : (
            <div className="project-drawer__placeholder">
              <span>{walkthrough?.placeholderTitle ?? "recording slot"}</span>
              <p>
                {walkthrough?.placeholderCopy ??
                  "A short screen recording can live here once this project has a walkthrough."}
              </p>
            </div>
          )}
        </div>

        {walkthrough?.show?.length ? (
          <div className="project-drawer__plan">
            <span>what the recording should show</span>
            <ul>
              {walkthrough.show.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <dl className="project-drawer__details">
          {detailItems.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        {project.actions?.length ? (
          <div className="project-drawer__actions">
            {project.actions.map((action) => (
              <ProjectAction action={action} key={action.label} />
            ))}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

export function ProjectCard({ project, compact = false }) {
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const walkthrough = project.walkthrough;
  const walkthroughMedia = walkthrough?.video ?? project.video;
  const hasWalkthroughVideo = Boolean(walkthroughMedia?.mp4);
  const canPreviewWalkthrough = Boolean(walkthrough?.planned) && isWalkthroughPreviewMode();
  const shouldShowWalkthrough = hasWalkthroughVideo || canPreviewWalkthrough;
  const className = [
    "project-card",
    project.id ? `project-card--${project.id}` : "",
    project.featured ? "project-card--featured" : "",
    compact ? "project-card--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const evidenceItems = [
    { label: "workflow", value: project.workflow },
    { label: "proves", value: project.proves },
  ].filter((item) => item.value);

  return (
    <Reveal as="article" className={className} id={project.id}>
      <div className="project-card__body">
        <div className="project-card__topline">
          <p className="section-label">{project.eyebrow}</p>
          <span>{project.status}</span>
        </div>
        <h3>{project.title}</h3>
        {project.subtitle ? <p className="project-card__subtitle">{project.subtitle}</p> : null}
        <p>{project.cardText ?? project.description}</p>

        {project.hypothesis ? (
          <p className="project-card__hypothesis">
            <span>hypothesis</span>
            {project.hypothesis}
          </p>
        ) : null}

        {evidenceItems.length ? (
          <dl className="project-card__evidence" aria-label={`${project.title} product evidence`}>
            {evidenceItems.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {project.actions?.length ? (
          <div className="project-card__actions">
            {project.actions.map((action) => (
              <ProjectAction action={action} key={action.label} />
            ))}
            {shouldShowWalkthrough ? (
              <button className="button button--ghost" type="button" onClick={() => setIsWalkthroughOpen(true)}>
                {hasWalkthroughVideo ? "watch walkthrough" : "walkthrough plan"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {shouldShowWalkthrough ? (
        <ProjectWalkthroughDrawer
          project={project}
          isOpen={isWalkthroughOpen}
          onClose={() => setIsWalkthroughOpen(false)}
        />
      ) : null}
    </Reveal>
  );
}
