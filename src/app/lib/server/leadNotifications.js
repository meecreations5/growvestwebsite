import { sendTransactionalEmail } from "./brevo";
import { writeCommunicationLog } from "./communications";
import { getAdminDb } from "./firebaseAdmin";
import { getApprovedCommunicationTemplate, renderCommunicationTemplate } from "./communicationTemplatesRepository";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function textToHtml(value) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#111827">${escapeHtml(value).replaceAll("\n", "<br>")}</div>`;
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://growvest.info").replace(/\/$/, "");
}

export async function notifyLeadAssignee({ lead, actor, event = "assigned", previousAssignee = "" }) {
  if (!lead?.assignedToEmail) return { skipped: true, reason: "No assignee email." };
  const template = await getApprovedCommunicationTemplate("enquiry_assignment", "email");
  const variables = {
    assigneeName: lead.assignedToName || "GrowVest team member",
    leadName: lead.fullName || "Website enquiry",
    leadType: lead.sourceLabel || lead.enquiryType || "Enquiry",
    priority: lead.priority || "normal",
    leadReference: lead.requestId || lead.leadKey,
    leadUrl: `${siteUrl()}/admin/enquiries/${encodeURIComponent(lead.leadKey)}`,
    event,
  };
  const rendered = template
    ? renderCommunicationTemplate(template, variables)
    : {
      subject: `GrowVest enquiry assigned: ${variables.leadName}`,
      body: `Hello ${variables.assigneeName},\n\nA GrowVest enquiry has been ${event === "reassigned" ? "reassigned" : "assigned"} to you.\n\nLead: ${variables.leadName}\nType: ${variables.leadType}\nPriority: ${variables.priority}\nReference: ${variables.leadReference}\n\nOpen: ${variables.leadUrl}`,
    };

  try {
    const result = await sendTransactionalEmail({
      to: { email: lead.assignedToEmail, name: lead.assignedToName || "GrowVest team member" },
      subject: rendered.subject,
      htmlContent: textToHtml(rendered.body),
    });
    await writeCommunicationLog(getAdminDb(), {
      leadKey: lead.leadKey,
      requestId: lead.requestId,
      entityType: "websiteLead",
      entityId: lead.id,
      channel: "email",
      type: `lead_${event}_notification`,
      templateKey: template?.key || "enquiry_assignment",
      recipient: lead.assignedToEmail,
      status: "sent",
      providerMessageId: result?.messageId,
      sentBy: actor?.uid || "system",
      sentByName: actor?.displayName || "System",
      subject: rendered.subject,
      metadata: { previousAssignee: previousAssignee || null },
    });
    return { sent: true, messageId: result?.messageId || null };
  } catch (error) {
    await writeCommunicationLog(getAdminDb(), {
      leadKey: lead.leadKey,
      requestId: lead.requestId,
      entityType: "websiteLead",
      entityId: lead.id,
      channel: "email",
      type: `lead_${event}_notification`,
      templateKey: template?.key || "enquiry_assignment",
      recipient: lead.assignedToEmail,
      status: "failed",
      providerCode: error?.providerCode,
      errorMessage: error?.message,
      sentBy: actor?.uid || "system",
      sentByName: actor?.displayName || "System",
      subject: rendered.subject,
    }).catch(() => {});
    return { sent: false, error: error?.message || "Notification failed." };
  }
}

export async function notifyConversionRequested({ lead, conversionId, actor }) {
  const recipient = process.env.GROWVEST_CONVERSION_NOTIFICATION_EMAIL || process.env.GROWVEST_NOTIFICATION_EMAIL;
  if (!recipient) return { skipped: true, reason: "No conversion notification recipient." };
  const subject = `GrowVest conversion review: ${lead.fullName}`;
  const body = [
    "A lead conversion request is ready for review.",
    "",
    `Lead: ${lead.fullName}`,
    `Reference: ${lead.requestId || lead.leadKey}`,
    `Conversion request: ${conversionId}`,
    `Requested by: ${actor?.displayName || "GrowVest team"}`,
    "",
    `Open: ${siteUrl()}/admin/enquiries/conversions/${conversionId}`,
  ].join("\n");
  try {
    const result = await sendTransactionalEmail({
      to: { email: recipient, name: "GrowVest Conversion Team" },
      subject,
      htmlContent: textToHtml(body),
    });
    await writeCommunicationLog(getAdminDb(), {
      leadKey: lead.leadKey,
      requestId: lead.requestId,
      entityType: "leadConversionRequest",
      entityId: conversionId,
      channel: "email",
      type: "lead_conversion_review_requested",
      templateKey: "lead_conversion_review_requested",
      recipient,
      status: "sent",
      providerMessageId: result?.messageId,
      sentBy: actor?.uid || "system",
      sentByName: actor?.displayName || "System",
      subject,
    });
    return { sent: true };
  } catch (error) {
    return { sent: false, error: error?.message || "Notification failed." };
  }
}

export async function notifyLeadMilestone({ lead, actor, milestone = "qualified" }) {
  if (!lead?.assignedToEmail) return { skipped: true, reason: "No assignee email." };
  const templateKey = milestone === "qualified" ? "enquiry_qualified_notification" : `enquiry_${milestone}_notification`;
  const template = await getApprovedCommunicationTemplate(templateKey, "email");
  const variables = {
    assigneeName: lead.assignedToName || "GrowVest team member",
    leadName: lead.fullName || "Website enquiry",
    leadType: lead.sourceLabel || lead.enquiryType || "Enquiry",
    leadReference: lead.requestId || lead.leadKey,
    leadUrl: `${siteUrl()}/admin/enquiries/${encodeURIComponent(lead.leadKey)}`,
    milestone,
  };
  const rendered = template
    ? renderCommunicationTemplate(template, variables)
    : {
      subject: `GrowVest lead ${milestone.replaceAll("_", " ")}: ${variables.leadName}`,
      body: `Hello ${variables.assigneeName},\n\n${variables.leadName} has reached the ${milestone.replaceAll("_", " ")} stage.\n\nReference: ${variables.leadReference}\nOpen: ${variables.leadUrl}`,
    };
  try {
    const result = await sendTransactionalEmail({
      to: { email: lead.assignedToEmail, name: lead.assignedToName || "GrowVest team member" },
      subject: rendered.subject,
      htmlContent: textToHtml(rendered.body),
    });
    await writeCommunicationLog(getAdminDb(), {
      leadKey: lead.leadKey,
      requestId: lead.requestId,
      entityType: "websiteLead",
      entityId: lead.id,
      channel: "email",
      type: `lead_${milestone}_notification`,
      templateKey: template?.key || templateKey,
      recipient: lead.assignedToEmail,
      status: "sent",
      providerMessageId: result?.messageId,
      sentBy: actor?.uid || "system",
      sentByName: actor?.displayName || "System",
      subject: rendered.subject,
    });
    return { sent: true, messageId: result?.messageId || null };
  } catch (error) {
    await writeCommunicationLog(getAdminDb(), {
      leadKey: lead.leadKey,
      requestId: lead.requestId,
      entityType: "websiteLead",
      entityId: lead.id,
      channel: "email",
      type: `lead_${milestone}_notification`,
      templateKey: template?.key || templateKey,
      recipient: lead.assignedToEmail,
      status: "failed",
      providerCode: error?.providerCode,
      errorMessage: error?.message,
      sentBy: actor?.uid || "system",
      sentByName: actor?.displayName || "System",
      subject: rendered.subject,
    }).catch(() => {});
    return { sent: false, error: error?.message || "Notification failed." };
  }
}
