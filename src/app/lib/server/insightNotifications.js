import { sendTransactionalEmail } from "./brevo";
import { writeCommunicationLog } from "./communications";
import { getAdminDb } from "./firebaseAdmin";

const NOTIFIABLE_STATUSES = new Set(["in_review", "changes_requested", "approved", "scheduled", "published"]);

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusLabel(status) {
  return String(status || "draft").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function notifyInsightWorkflow({ post, previousStatus = null, actor }) {
  if (!post || !NOTIFIABLE_STATUSES.has(post.status) || post.status === previousStatus) return { skipped: true };
  const recipient = process.env.GROWVEST_NOTIFICATION_EMAIL || process.env.BREVO_REPLY_TO_EMAIL || process.env.BREVO_DEFAULT_SENDER_EMAIL;
  if (!recipient || !process.env.BREVO_API_KEY) return { skipped: true };

  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://growvest.info"}/admin/insights/${post.id}/edit`;
  const subject = `GrowVest Insight ${statusLabel(post.status)}: ${post.title}`;
  const htmlContent = `
    <div style="font-family:Arial,sans-serif;color:#0B0B0F;line-height:1.6">
      <p style="color:#1F4ED8;font-weight:700;text-transform:uppercase;letter-spacing:.08em">GrowVest Insights Workflow</p>
      <h2 style="margin:8px 0 12px">${escapeHtml(post.title)}</h2>
      <p>Status changed from <strong>${escapeHtml(statusLabel(previousStatus || "new"))}</strong> to <strong>${escapeHtml(statusLabel(post.status))}</strong>.</p>
      <p>Updated by: ${escapeHtml(actor?.displayName || actor?.email || "GrowVest Admin")}</p>
      ${post.scheduledAt ? `<p>Scheduled for: ${escapeHtml(new Date(post.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }))}</p>` : ""}
      <p><a href="${adminUrl}" style="display:inline-block;background:#1F4ED8;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700">Open in Website Admin</a></p>
    </div>`;

  try {
    const response = await sendTransactionalEmail({ to: [{ email: recipient, name: "GrowVest Website Team" }], subject, htmlContent });
    await writeCommunicationLog(getAdminDb(), {
      requestId: post.id,
      channel: "email",
      type: `insight_${post.status}`,
      recipient,
      status: "sent",
      providerMessageId: response?.messageId,
    });
    return { sent: true };
  } catch (error) {
    await writeCommunicationLog(getAdminDb(), {
      requestId: post.id,
      channel: "email",
      type: `insight_${post.status}`,
      recipient,
      status: "failed",
      providerCode: error?.providerCode,
      errorMessage: error?.message,
    }).catch(() => null);
    return { sent: false, error: error?.message };
  }
}
