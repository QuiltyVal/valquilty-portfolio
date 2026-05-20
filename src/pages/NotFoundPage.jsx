import { ButtonLink } from "../components/PageElements";
import { Reveal } from "../components/Reveal";

export function NotFoundPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__inner">
          <Reveal className="footer-panel">
            <p className="section-label">Not found</p>
            <h1>
              Wrong document<span>.</span>
            </h1>
            <p className="lede">
              That route is not part of the portfolio. Use one of the primary pages instead.
            </p>
            <div className="cta-row">
              <ButtonLink to="/">Return home</ButtonLink>
              <ButtonLink to="/#projects" variant="ghost">
                View projects
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
