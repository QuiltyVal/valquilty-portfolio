import { fetchJson, readJsonBody, sendJson } from "./_shared.js";

const RESEND_URL = "https://api.resend.com/emails";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "me@valquilty.com";
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Val Quilty Portfolio <onboarding@resend.dev>";

function cleanField(value, maxLength) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function cleanMessage(value) {
  return String(value || "")
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .slice(0, 1800);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderContactHtml({ name, email, message, pageUrl }) {
  const safeName = escapeHtml(name || "Website visitor");
  const safeEmail = escapeHtml(email);
  const safePageUrl = escapeHtml(pageUrl || "https://valquilty.com/");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
    <div style="font-family: Georgia, serif; color: #2d241d; line-height: 1.5;">
      <h1 style="font-size: 24px; font-weight: 400;">New portfolio message</h1>
      <p><strong>From:</strong> ${safeName}</p>
      <p><strong>Reply email:</strong> ${safeEmail}</p>
      <p><strong>Page:</strong> ${safePageUrl}</p>
      <hr style="border: 0; border-top: 1px solid #d8c8b8;" />
      <p>${safeMessage}</p>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const honeypot = cleanField(body.company, 120);

    if (honeypot) {
      sendJson(res, 200, { ok: true });
      return;
    }

    const name = cleanField(body.name, 120);
    const email = cleanField(body.email, 180).toLowerCase();
    const message = cleanMessage(body.message);
    const pageUrl = cleanField(body.pageUrl, 260);

    if (!isValidEmail(email)) {
      sendJson(res, 400, { ok: false, error: "A valid reply email is required." });
      return;
    }

    if (message.length < 12) {
      sendJson(res, 400, { ok: false, error: "Message is too short." });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      sendJson(res, 503, {
        ok: false,
        code: "email-not-configured",
        error: "Email delivery is not configured yet.",
        fallbackEmail: CONTACT_TO_EMAIL,
      });
      return;
    }

    const subjectName = name || email;
    const text = [
      "New portfolio message",
      "",
      `From: ${subjectName}`,
      `Reply email: ${email}`,
      `Page: ${pageUrl || "https://valquilty.com/"}`,
      "",
      message,
    ].join("\n");

    const data = await fetchJson(
      RESEND_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL,
          to: CONTACT_TO_EMAIL,
          reply_to: email,
          subject: `Portfolio contact: ${subjectName}`,
          text,
          html: renderContactHtml({ name, email, message, pageUrl }),
        }),
      },
      Number.parseInt(process.env.RESEND_TIMEOUT_MS || "12000", 10)
    );

    sendJson(res, 200, {
      ok: true,
      id: data?.id || data?.data?.id || null,
    });
  } catch (error) {
    sendJson(res, error.statusCode || 502, {
      ok: false,
      error: "Could not send the message right now.",
    });
  }
}
