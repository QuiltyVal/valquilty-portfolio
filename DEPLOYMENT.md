# Val Quilty Portfolio Deployment

The app is a Vite build with same-origin API endpoints. On Vercel, the endpoints live in `api/`.
For a standalone Node server, `server.js` serves `dist/` and exposes the same API surface.

- `GET /api/health`
- `POST /api/reading`
- `POST /api/portfolio-chat`
- `POST /api/contact-message`

## Environment

Set these on the server:

```bash
OPENROUTER_API_KEY=sk-or-v1... # enables I Ching interpretation and portfolio AI chat
RESEND_API_KEY=re_... # enables Ask Val direct contact delivery
CONTACT_TO_EMAIL=me@valquilty.com
CONTACT_FROM_EMAIL=Val Quilty Portfolio <onboarding@resend.dev>
PUBLIC_SITE_URL=https://valquilty.com
PUBLIC_SITE_NAME=Val Quilty Portfolio
PORT=3000
```

With Resend's `onboarding@resend.dev`, delivery is limited to the verified Resend account email. Verify `valquilty.com` in Resend before sending from/to the public domain address.

The OpenRouter model is selected from:

```txt
https://shir-man.com/api/free-llm/top-models
```

The backend uses `models[0].id`, cached for ten minutes. Set `OPENROUTER_MODEL` only if you want to pin a model manually.

## Run

```bash
npm ci
npm run build
npm start
```

Put Nginx/Caddy in front of `localhost:$PORT` for HTTPS and the domain.
