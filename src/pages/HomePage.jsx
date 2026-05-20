import { ButtonLink, ExternalButtonLink, SectionHeader, StaticButton } from "../components/PageElements";
import { ProjectCard } from "../components/ProjectCard";
import { Reveal } from "../components/Reveal";
import { siteContent } from "../content/siteContent";

function HeroProof({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="hero-proof" aria-label="Hiring snapshot">
      {items.map((item) => (
        <div className="hero-proof__item" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function PlannerSystemFlow({ steps }) {
  if (!steps?.length) {
    return null;
  }

  return (
    <div className="planner-flow" aria-label="ADHD Planner product system">
      {steps.map((step) => (
        <article className="planner-flow__step" key={step.label}>
          <span>{step.label}</span>
          <strong>{step.title}</strong>
          <p>{step.copy}</p>
        </article>
      ))}
    </div>
  );
}

function TeamFitSection({ teamFit }) {
  return (
    <section className="section team-fit-section one-page-section" id="team-fit">
      <div className="section__inner">
        <Reveal className="team-fit-panel">
          <div className="team-fit-panel__copy">
            <p className="section-label">{teamFit.label}</p>
            <h2>
              {teamFit.title}
              <span>.</span>
            </h2>
            <p>{teamFit.copy}</p>
            <p className="micro-note">{teamFit.note}</p>
          </div>

          <div className="team-fit-panel__items">
            {teamFit.items.map((item) => (
              <article className="team-fit-item" key={item.label}>
                <span>{item.label}</span>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlannerCaseStudy({ caseStudy, project }) {
  if (!caseStudy || !project) {
    return null;
  }

  const featureTags = caseStudy.featureTags ?? caseStudy.metrics ?? [];
  const rolePoint = caseStudy.points.find((point) => point.label === "My role");
  const builtPoint = caseStudy.points.find((point) => point.label === "Built");
  const whyPoint = caseStudy.points.find((point) => point.label === "Why it matters");
  const problemPoint = caseStudy.points.find((point) => point.label === "Problem");

  return (
    <section className="section planner-case-section one-page-section" id="adhd-planner-case-study">
      <div className="section__inner">
        <Reveal className="planner-case">
          <div className="planner-case__copy">
            <p className="section-label">{caseStudy.label}</p>
            <h2>
              {caseStudy.title}
              <span>.</span>
            </h2>
            <p className="planner-case__subtitle">{caseStudy.subtitle}</p>
            <p>{caseStudy.intro}</p>
            {project.image ? (
              <figure className="planner-case__preview">
                <img src={project.image} alt={project.imageAlt} loading="lazy" />
              </figure>
            ) : null}
            <div className="planner-case__actions">
              <ExternalButtonLink href={project.url}>{caseStudy.actionLabel}</ExternalButtonLink>
            </div>
          </div>

          <div className="planner-case__summary">
            <article className="planner-case__point">
              <span>problem</span>
              <p>{problemPoint?.copy}</p>
            </article>
            <article className="planner-case__point">
              <span>product hypothesis</span>
              <p>{caseStudy.thesis}</p>
            </article>
            <article className="planner-case__point">
              <span>my role</span>
              <p>{rolePoint?.copy}</p>
            </article>
            <article className="planner-case__point">
              <span>build depth</span>
              <p>{builtPoint?.copy}</p>
            </article>
          </div>

          <PlannerSystemFlow steps={caseStudy.systemSteps} />

          <div className="planner-case__worlds" aria-label="ADHD Planner system map">
            {caseStudy.worlds.map((world) => (
              <article className="planner-world" key={world.label}>
                <span>{world.label}</span>
                <strong>{world.title}</strong>
                <p>{world.copy}</p>
              </article>
            ))}
          </div>

          <div className="planner-case__closing">
            <article>
              <span>why it matters for product roles</span>
              <p>{whyPoint?.copy}</p>
            </article>
            <article>
              <span>what I would test next</span>
              <ul>
                {caseStudy.nextTests.map((test) => (
                  <li key={test}>{test}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="planner-case__metrics" aria-label="ADHD Planner feature highlights">
            {featureTags.map((metric) => (
              <span className="archive-tag" key={metric}>
                {metric}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CompetenciesSection({ competencies }) {
  return (
    <section className="section section--tinted one-page-section" id="competencies">
      <div className="section__inner">
        <Reveal>
          <SectionHeader
            label="skills / evidence"
            title={
              <>
                How the work maps to product roles<span>.</span>
              </>
            }
            copy="A compact map of the skills the projects are meant to demonstrate: product ownership, AI-assisted execution, workflow systems, and interaction design."
          />
        </Reveal>

        <div className="competency-grid">
          {competencies.map((group) => (
            <Reveal as="article" className="competency-card" key={group.label}>
              <p className="section-label">{group.label}</p>
              {group.copy ? <p className="competency-card__copy">{group.copy}</p> : null}
              <ul className="competency-card__items">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareerDirectionSection({ direction }) {
  if (!direction) {
    return null;
  }

  const groups = [
    { label: "roles", items: direction.roles },
    { label: "daily work", items: direction.dailyWork },
    { label: "best environments", items: direction.environments },
  ].filter((group) => group.items?.length);

  return (
    <section className="section career-direction-section one-page-section" id="career-direction">
      <div className="section__inner">
        <Reveal className="career-direction-panel">
          <div className="career-direction-panel__copy">
            <p className="section-label">{direction.label}</p>
            <h2>
              {direction.title}
              <span>.</span>
            </h2>
            <p>{direction.copy}</p>
            <p className="micro-note">{direction.note}</p>
          </div>

          <div className="career-direction-panel__grid">
            {groups.map((group) => (
              <article className="career-direction-card" key={group.label}>
                <span>{group.label}</span>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactAction({ link, primary = false }) {
  if (link.href) {
    return (
      <ExternalButtonLink href={link.href} variant={primary ? "primary" : "ghost"}>
        {link.label}: {link.value}
      </ExternalButtonLink>
    );
  }

  if (link.to) {
    return (
      <ButtonLink to={link.to} variant="ghost">
        {link.label}: {link.value}
      </ButtonLink>
    );
  }

  return (
    <StaticButton variant="ghost">
      {link.label}: {link.value}
    </StaticButton>
  );
}

export function HomePage() {
  const featuredCaseStudy = siteContent.featuredCaseStudy;
  const caseStudyProject = featuredCaseStudy
    ? siteContent.projects.find((project) => project.id === featuredCaseStudy.projectId)
    : null;
  const labProjects = siteContent.projects.filter((project) => project.id !== featuredCaseStudy?.projectId);

  return (
    <main id="top">
      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="engine-strip" aria-hidden="true">
            <span className="engine-strip__label">ADHD Planner</span>
            <span>overwhelm</span>
            <i>→</i>
            <span>one reachable move</span>
            <i>→</i>
            <span>working prototype</span>
            <i>→</i>
            <span>proof</span>
          </div>

          <Reveal className="home-hero__copy">
            <p className="eyebrow">{siteContent.profile.eyebrow}</p>
            <h1>
              {siteContent.profile.headline}
              <span>.</span>
            </h1>
            <p className="lede">{siteContent.profile.lede}</p>
            <div className="cta-row">
              {caseStudyProject ? (
                <ExternalButtonLink href={caseStudyProject.url}>Try ADHD Planner</ExternalButtonLink>
              ) : (
                <ButtonLink to="#projects">View projects</ButtonLink>
              )}
              <ButtonLink to="#contact" variant="ghost">
                Contact me
              </ButtonLink>
            </div>
            <HeroProof items={siteContent.profile.proof} />
          </Reveal>

          <Reveal as="aside" className="home-hero__panel" aria-label="Portfolio focus">
            <p className="section-label">flagship proof</p>
            <h2>ADHD Planner</h2>
            <p>
              A public working prototype that turns task paralysis, stale tasks, and overwhelm into product requirements.
            </p>
            <ul className="home-hero__panel-list">
              <li>
                <span>01</span>
                <strong>Today Mission</strong>
                <small>one reachable move</small>
              </li>
              <li>
                <span>02</span>
                <strong>Rescue Mode</strong>
                <small>for freeze moments</small>
              </li>
              <li>
                <span>03</span>
                <strong>Planner Engine</strong>
                <small>nudges, reports, task state</small>
              </li>
            </ul>
            <ButtonLink to="#adhd-planner-case-study" variant="ghost">
              View case study
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <TeamFitSection teamFit={siteContent.teamFit} />

      <PlannerCaseStudy caseStudy={featuredCaseStudy} project={caseStudyProject} />

      <section className="section one-page-section" id="projects">
        <div className="section__inner">
          <Reveal>
            <SectionHeader
              label="projects"
              title={
                <>
                  Product lab: supporting prototypes<span>.</span>
                </>
              }
              copy="These projects are not random toys. Each one tests a specific workflow or product hypothesis and shows how I think through systems."
            />
          </Reveal>

          <div className="project-grid project-grid--index">
            {labProjects.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </div>
        </div>
      </section>

      <CompetenciesSection competencies={siteContent.competencies} />

      <CareerDirectionSection direction={siteContent.careerDirection} />

      <section className="section one-page-section" id="contact">
        <Reveal className="footer-panel">
          <p className="section-label">contact</p>
          <h3>Open to product owner, AI product builder, and product operations roles.</h3>
          <p>{siteContent.contact.note}</p>
          <div className="contact-link-list">
            {siteContent.contact.links.map((link) => (
              <ContactAction link={link} key={link.label} primary={link.label === "Email"} />
            ))}
          </div>
          <p className="micro-note">Current status: {siteContent.contact.status}.</p>
        </Reveal>
      </section>
    </main>
  );
}
