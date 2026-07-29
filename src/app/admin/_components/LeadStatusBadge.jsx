const STATUS_LABELS = {
  new: "New",
  new_email_attention_required: "New · Email attention",
  assigned: "Assigned",
  contact_attempted: "Contact attempted",
  connected: "Connected",
  follow_up: "Follow-up",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
  not_interested: "Not interested",
  duplicate: "Duplicate",
  invalid: "Invalid",
  spam: "Spam",
  submission_error: "Submission error",
  subscribed: "Subscribed",
  pending_provider_sync: "Pending provider sync",
  provider_sync_failed: "Provider sync failed",
};

const STATUS_CLASSES = {
  new: "bg-blue-50 text-blue-700",
  new_email_attention_required: "bg-amber-50 text-amber-700",
  assigned: "bg-indigo-50 text-indigo-700",
  contact_attempted: "bg-violet-50 text-violet-700",
  connected: "bg-cyan-50 text-cyan-700",
  follow_up: "bg-amber-50 text-amber-700",
  qualified: "bg-emerald-50 text-emerald-700",
  converted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-700",
  not_interested: "bg-gray-100 text-gray-600",
  duplicate: "bg-orange-50 text-orange-700",
  invalid: "bg-red-50 text-red-700",
  spam: "bg-red-50 text-red-700",
  submission_error: "bg-red-50 text-red-700",
  subscribed: "bg-emerald-50 text-emerald-700",
  pending_provider_sync: "bg-amber-50 text-amber-700",
  provider_sync_failed: "bg-red-50 text-red-700",
};

export function leadStatusLabel(status) {
  return STATUS_LABELS[status] || String(status || "New").replaceAll("_", " ");
}

export function LeadStatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${STATUS_CLASSES[status] || "bg-gray-100 text-gray-700"}`}>{leadStatusLabel(status)}</span>;
}

export function PriorityBadge({ priority = "normal" }) {
  const classes = priority === "urgent" ? "bg-red-50 text-red-700" : priority === "high" ? "bg-amber-50 text-amber-700" : priority === "low" ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-700";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${classes}`}>{priority}</span>;
}
