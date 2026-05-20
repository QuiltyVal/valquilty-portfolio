import { ButtonLink, ExternalButtonLink, StaticButton } from "./PageElements";
import { Reveal } from "./Reveal";

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

export function ProjectCard({ project, compact = false }) {
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
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
