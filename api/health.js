import { getPreferredModel, sendJson } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  sendJson(res, 200, {
    ok: true,
    model: await getPreferredModel(),
    hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
  });
}
