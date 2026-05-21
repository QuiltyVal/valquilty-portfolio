# Val Quilty Portfolio

React/Vite one-page portfolio for Val Quilty: Product Owner track, AI-assisted product builder, and product operations positioning.

## Stack

- React
- React Router
- Vite
- Vercel API functions

## Structure

- `/#ask-val` - portfolio assistant
- `/#team-fit` - product-team positioning
- `/#adhd-planner-case-study` - flagship ADHD Planner case study
- `/#projects` - supporting product lab
- `/#contact` - contact links
- `/i-ching` - Quantum I Ching live demo route

Legacy URLs such as `/projects`, `/archives`, and `/book/killing-the-water` redirect back to the portfolio.

## Install and run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
npm run preview
```

## API

- `POST /api/portfolio-chat` - Ask Val portfolio assistant
- `POST /api/contact-message` - send recruiter/contact messages to Val
- `POST /api/reading` - Quantum I Ching reading
- `GET /api/health` - model/key health check

`OPENROUTER_API_KEY` enables live AI replies. Without it, the portfolio assistant and I Ching route keep working with curated/local fallback responses.
`RESEND_API_KEY` enables direct message delivery from the Ask Val contact form.

## Content

Primary portfolio data lives in `src/content/siteContent.js`. Add project cards, contact links, and publication links there first.
