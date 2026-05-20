import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { href: "/#top", label: "Start" },
  { href: "/#ask-val", label: "Ask" },
  { href: "/#team-fit", label: "Team" },
  { href: "/#adhd-planner-case-study", label: "Planner" },
  { href: "/#projects", label: "Lab" },
  { href: "/#competencies", label: "Proof" },
  { href: "/#contact", label: "Contact" },
];

const footerLabels = {
  "/": "Val Quilty / Product owner portfolio",
  "/i-ching": "Quantum I Ching / Val Quilty",
};

function getInitialTheme() {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function SiteLayout() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const footerLabel = footerLabels[location.pathname] ?? "Val Quilty / Portfolio";

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(location.hash.slice(1));
        target?.scrollIntoView({ block: "start" });
      });
    } else {
      window.scrollTo(0, 0);
    }

    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("site-theme", theme);
  }, [theme]);

  useEffect(() => {
    const updateBackToTop = () => {
      setShowBackToTop(window.scrollY > 640);
    };

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateBackToTop);
    };
  }, []);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink className="brand" to="/">
            <span className="brand__name">Val Quilty</span>
            <span className="brand__role">product systems / AI-assisted prototypes</span>
          </NavLink>

          <nav className="site-nav" id="site-nav" aria-label="Primary" data-site-nav>
            <div className="nav-links">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="site-header__actions">
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              onClick={() => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>

            <button
              className="menu-toggle"
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="site-nav"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <Outlet />

      <a
        className={["scroll-top", showBackToTop ? "is-visible" : ""].filter(Boolean).join(" ")}
        href="#top"
        aria-label="Back to top"
      >
        top
      </a>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <span>{footerLabel}</span>
          <span>One-page portfolio / {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
