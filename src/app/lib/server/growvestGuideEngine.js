const INTENTS = [
  {
    id: "child_education",
    label: "Child education",
    patterns: [/child(?:ren)?[’']?s?\s+(education|college|future)/i, /education\s+goal/i, /higher\s+education/i, /school\s+fees/i],
    source: { label: "Goal Library — Children’s Future", url: "/goal-library" },
  },
  {
    id: "retirement",
    label: "Retirement planning",
    patterns: [/retire(?:ment|d|ing)?/i, /post[-\s]?retirement/i, /pension/i],
    source: { label: "Goal Library — Retirement", url: "/goal-library" },
  },
  {
    id: "dream_home",
    label: "Dream home",
    patterns: [/dream\s+home/i, /buy(?:ing)?\s+(a\s+)?home/i, /house\s+purchase/i, /home\s+loan/i, /property\s+goal/i],
    source: { label: "Goal Library — Dream Home", url: "/goal-library" },
  },
  {
    id: "travel_bucket_list",
    label: "Travel or bucket-list goal",
    patterns: [/travel/i, /vacation/i, /world\s+tour/i, /bucket\s+list/i, /experience\s+goal/i],
    source: { label: "Bucket List Builder", url: "/bucket-list-builder" },
  },
  {
    id: "family_protection",
    label: "Family protection",
    patterns: [/family\s+(security|protection)/i, /insurance/i, /emergency\s+fund/i, /protect\s+my\s+family/i],
    source: { label: "Family Wealth", url: "/family-wealth" },
  },
  {
    id: "nri_wealth",
    label: "NRI wealth journey",
    patterns: [/\bnri\b/i, /non[-\s]?resident/i, /living\s+abroad/i, /overseas\s+indian/i],
    source: { label: "For NRIs", url: "/for-nris" },
  },
  {
    id: "portfolio_review",
    label: "Portfolio review",
    patterns: [/portfolio\s+(review|check|analysis)/i, /review\s+my\s+(portfolio|investments)/i, /existing\s+investments/i, /too\s+many\s+funds/i],
    source: { label: "Progress Reviews", url: "/progress-reviews" },
  },
  {
    id: "existing_investor",
    label: "Existing investor support",
    patterns: [/existing\s+(investor|client)/i, /already\s+(an\s+)?investor/i, /investor\s+portal/i, /monthly\s+report/i, /assigned\s+advisor/i, /service\s+request/i],
    source: { label: "Investor Portal", url: "https://insights.growvest.info/investor-login" },
  },
  {
    id: "start_conversation",
    label: "Start a GrowVest conversation",
    patterns: [/book\s+(a\s+)?(call|meeting|conversation)/i, /speak\s+(to|with)/i, /contact\s+(growvest|advisor|team)/i, /start\s+(a\s+)?conversation/i],
    source: { label: "Start Here", url: "/start-here" },
  },
  {
    id: "general_clarity",
    label: "General financial clarity",
    patterns: [/financial\s+clarity/i, /plan\s+my\s+finances/i, /where\s+do\s+i\s+start/i, /organise\s+my\s+money/i, /goal[-\s]?based\s+planning/i],
    source: { label: "The GrowVest Way", url: "/the-growvest-way" },
  },
];

const TIMELINE_CHOICES = [
  { label: "Within 3 years", value: "Within 3 years" },
  { label: "3–7 years", value: "3–7 years" },
  { label: "8–15 years", value: "8–15 years" },
  { label: "More than 15 years", value: "More than 15 years" },
];

const PLANNING_CHOICES = [
  { label: "Yes, already started", value: "Already started" },
  { label: "Not yet", value: "Not started yet" },
  { label: "I’m not sure", value: "Needs review" },
];

const EXISTING_INVESTOR_CHOICES = [
  { label: "Open Investor Portal", type: "link", url: "https://insights.growvest.info/investor-login" },
  { label: "Monthly report support", value: "I need help with my monthly report" },
  { label: "Document-related help", value: "I need help with an investor document" },
  { label: "Contact my advisor", type: "handoff" },
];

function text(value, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function normalized(value) {
  return text(value, 1000).toLowerCase().replace(/\s+/g, " ");
}

function compact(value, max = 300) {
  const cleaned = text(value, 1000).replace(/\s+/g, " ");
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max - 1).trim()}…`;
}

function detectIntent(message) {
  const value = text(message, 800);
  for (const intent of INTENTS) {
    if (intent.patterns.some((pattern) => pattern.test(value))) return intent;
  }
  return null;
}

function getIntent(id) {
  return INTENTS.find((intent) => intent.id === id) || null;
}

function timelineFromMessage(message) {
  const value = normalized(message);
  if (!value) return "";
  if (/within\s+(three|3)\s+years?|next\s+(three|3)\s+years?|short[-\s]?term/.test(value)) return "Within 3 years";
  if (/(3|three)\s*(to|-|–)\s*(7|seven)\s+years?/.test(value)) return "3–7 years";
  if (/(8|eight)\s*(to|-|–)\s*(15|fifteen)\s+years?/.test(value)) return "8–15 years";
  if (/more\s+than\s+(15|fifteen)\s+years?|over\s+(15|fifteen)\s+years?|long[-\s]?term/.test(value)) return "More than 15 years";
  const match = value.match(/(?:after|in|within|around|approximately|about)?\s*(\d{1,2})\s*(?:year|years|yr|yrs)/);
  if (match) {
    const years = Number(match[1]);
    if (years <= 3) return `Around ${years} year${years === 1 ? "" : "s"}`;
    if (years <= 7) return `Around ${years} years`;
    if (years <= 15) return `Around ${years} years`;
    return `Around ${years} years`;
  }
  if (/this\s+year|next\s+year|soon/.test(value)) return "Within 3 years";
  return "";
}

function planningStatusFromMessage(message) {
  const value = normalized(message);
  if (!value) return "";
  if (/already\s+(started|investing|planning)|yes|currently\s+(investing|saving)|have\s+(a\s+)?sip/.test(value)) return "Already started";
  if (/not\s+(yet|started)|haven'?t\s+started|no\b|starting\s+fresh/.test(value)) return "Not started yet";
  if (/not\s+sure|unsure|need\s+(a\s+)?review|don'?t\s+know/.test(value)) return "Needs review";
  return "";
}


function goalPhrase(intent) {
  const phrases = {
    child_education: "your child’s education",
    retirement: "retirement",
    dream_home: "a dream home",
    travel_bucket_list: "a travel or bucket-list experience",
    family_protection: "family protection",
    nri_wealth: "your NRI wealth journey",
    portfolio_review: "a portfolio review",
    general_clarity: "greater financial clarity",
  };
  return phrases[intent?.id] || intent?.label?.toLowerCase() || "this goal";
}

function makeSummary(intent, journey) {
  if (!intent) return "";
  const parts = [`Goal: ${intent.label}`];
  if (journey.timeline) parts.push(`Timeline: ${journey.timeline}`);
  if (journey.planningStatus) parts.push(`Current position: ${journey.planningStatus}`);
  return parts.join(" · ");
}

function genericClarification(settings) {
  return {
    answer: "I can help in three ways: explain a GrowVest topic, guide you through a specific life goal, or connect you with the GrowVest team. Which would be most useful?",
    matched: false,
    confidence: 0.25,
    quickReplies: [
      { label: "Plan a specific goal", value: "I want to plan a specific goal" },
      { label: "Learn about GrowVest", value: "What is GrowVest?" },
      { label: "Speak with the team", type: "handoff" },
    ],
    canHandoff: Boolean(settings.whatsappEnabled),
    nextAction: "clarify_intent",
  };
}

function existingInvestorResponse(settings) {
  return {
    answer: "For privacy, I cannot access investor-specific information here. You can use the Investor Portal, ask for document or monthly-report support, or continue with your assigned GrowVest team member.",
    matched: true,
    confidence: 1,
    intent: { id: "existing_investor", label: "Existing investor support" },
    sources: [{ label: "Investor Portal", url: "https://insights.growvest.info/investor-login" }],
    quickReplies: EXISTING_INVESTOR_CHOICES,
    canHandoff: Boolean(settings.whatsappEnabled),
    nextAction: "existing_investor_support",
    stateUpdate: {
      intentId: "existing_investor",
      intentLabel: "Existing investor support",
      journeyStage: "support_options",
    },
  };
}

export function sanitizeGuideClientContext(input = {}) {
  const allowedIntent = getIntent(text(input.intentId, 80));
  return {
    intentId: allowedIntent?.id || "",
    intentLabel: allowedIntent?.label || "",
    journeyStage: ["", "timeline", "planning_status", "complete", "support_options"].includes(input.journeyStage) ? input.journeyStage : "",
    timeline: text(input.timeline, 100),
    planningStatus: text(input.planningStatus, 100),
    conversationSummary: text(input.conversationSummary, 500),
  };
}

export async function buildGuideResponse({ message, settings, sessionContext = {}, findKnowledgeAnswer }) {
  const input = text(message, 800);
  const context = sanitizeGuideClientContext(sessionContext);
  const explicitIntent = detectIntent(input);
  const currentIntent = explicitIntent || getIntent(context.intentId);

  if (/^(restart|start again|new conversation|clear)$/i.test(input)) {
    return {
      answer: "We can start fresh. What would you like clarity on today?",
      matched: true,
      confidence: 1,
      quickReplies: (settings.quickPrompts || []).slice(0, 4).map((value) => ({ label: value, value })),
      nextAction: "restart",
      stateUpdate: { reset: true },
    };
  }

  if (!explicitIntent && /plan\s+(a\s+)?specific\s+goal|choose\s+(a\s+)?goal|goal\s+planning/i.test(input)) {
    return {
      answer: "Which life goal would you like to plan first?",
      matched: true,
      confidence: 1,
      quickReplies: [
        { label: "Child education", value: "I want to plan for my child’s education" },
        { label: "Retirement", value: "I want to plan for retirement" },
        { label: "Dream home", value: "I want to plan for a dream home" },
        { label: "Travel or bucket list", value: "I want to plan a travel or bucket-list goal" },
        { label: "Family protection", value: "I want to plan for family protection" },
        { label: "NRI wealth journey", value: "I need help with an NRI wealth journey" },
      ],
      canHandoff: Boolean(settings.whatsappEnabled),
      nextAction: "select_goal",
      stateUpdate: { reset: true },
    };
  }

  if (currentIntent?.id === "existing_investor") return existingInvestorResponse(settings);

  const activeJourney = Boolean(settings.guidedJourneysEnabled !== false && currentIntent && !["start_conversation"].includes(currentIntent.id));
  const timeline = context.timeline || (context.journeyStage === "timeline" ? timelineFromMessage(input) : "");
  const planningStatus = context.planningStatus || (context.journeyStage === "planning_status" ? planningStatusFromMessage(input) : "");

  if (currentIntent?.id === "start_conversation") {
    return {
      answer: "A discovery conversation can help the team understand the life goal behind your question before discussing possible next steps. You can continue on WhatsApp and the context from this Guide conversation will be carried forward.",
      matched: true,
      confidence: 1,
      intent: { id: currentIntent.id, label: currentIntent.label },
      sources: [currentIntent.source],
      quickReplies: [{ label: "Continue on WhatsApp", type: "handoff" }, { label: "Ask another question", type: "restart" }],
      canHandoff: Boolean(settings.whatsappEnabled),
      nextAction: "handoff",
      stateUpdate: { intentId: currentIntent.id, intentLabel: currentIntent.label, journeyStage: "complete", conversationSummary: `Intent: ${currentIntent.label}` },
    };
  }

  if (activeJourney && explicitIntent && !context.timeline) {
    return {
      answer: `Let’s make ${goalPhrase(currentIntent)} more practical. When would you ideally like to achieve it?`,
      matched: true,
      confidence: 0.95,
      intent: { id: currentIntent.id, label: currentIntent.label },
      sources: [currentIntent.source],
      quickReplies: TIMELINE_CHOICES,
      canHandoff: Boolean(settings.whatsappEnabled),
      nextAction: "collect_timeline",
      stateUpdate: { intentId: currentIntent.id, intentLabel: currentIntent.label, journeyStage: "timeline" },
    };
  }

  if (activeJourney && context.journeyStage === "timeline") {
    if (!timeline) {
      return {
        answer: "A rough timeline is enough. Is this goal within 3 years, 3–7 years, 8–15 years, or more than 15 years away?",
        matched: true,
        confidence: 0.8,
        intent: { id: currentIntent.id, label: currentIntent.label },
        sources: [currentIntent.source],
        quickReplies: TIMELINE_CHOICES,
        canHandoff: Boolean(settings.whatsappEnabled),
        nextAction: "collect_timeline",
        stateUpdate: { intentId: currentIntent.id, intentLabel: currentIntent.label, journeyStage: "timeline" },
      };
    }
    return {
      answer: `Thank you. For ${goalPhrase(currentIntent)} ${timeline.toLowerCase()}, have you already started planning or investing for it?`,
      matched: true,
      confidence: 0.95,
      intent: { id: currentIntent.id, label: currentIntent.label },
      sources: [currentIntent.source],
      quickReplies: PLANNING_CHOICES,
      canHandoff: Boolean(settings.whatsappEnabled),
      nextAction: "collect_planning_status",
      stateUpdate: { intentId: currentIntent.id, intentLabel: currentIntent.label, journeyStage: "planning_status", timeline },
    };
  }

  if (activeJourney && context.journeyStage === "planning_status") {
    if (!planningStatus) {
      return {
        answer: "Have you already started planning for this goal, not started yet, or would you prefer a review of your current approach?",
        matched: true,
        confidence: 0.8,
        intent: { id: currentIntent.id, label: currentIntent.label },
        sources: [currentIntent.source],
        quickReplies: PLANNING_CHOICES,
        canHandoff: Boolean(settings.whatsappEnabled),
        nextAction: "collect_planning_status",
        stateUpdate: { intentId: currentIntent.id, intentLabel: currentIntent.label, journeyStage: "planning_status", timeline: context.timeline },
      };
    }
    const journey = { timeline: context.timeline, planningStatus };
    const summary = makeSummary(currentIntent, journey);
    return {
      answer: `You are planning for ${goalPhrase(currentIntent)} ${context.timeline ? context.timeline.toLowerCase() : "with a defined timeline"}, and your current position is “${planningStatus}”. A useful next step is to map the target, existing resources, planned contributions and review milestones—without jumping straight to a product decision.`,
      matched: true,
      confidence: 1,
      intent: { id: currentIntent.id, label: currentIntent.label },
      sources: [currentIntent.source, { label: "Start Here", url: "/start-here" }],
      quickReplies: [
        { label: "Continue on WhatsApp", type: "handoff" },
        { label: "Read the relevant guide", type: "link", url: currentIntent.source.url },
        { label: "Ask another question", type: "restart" },
      ],
      canHandoff: Boolean(settings.whatsappEnabled),
      nextAction: "journey_complete",
      conversationSummary: summary,
      stateUpdate: { intentId: currentIntent.id, intentLabel: currentIntent.label, journeyStage: "complete", timeline: context.timeline, planningStatus, conversationSummary: summary },
    };
  }

  if (activeJourney && context.journeyStage === "complete" && currentIntent) {
    const knowledge = await findKnowledgeAnswer(input, settings);
    return {
      ...knowledge,
      intent: { id: currentIntent.id, label: currentIntent.label },
      quickReplies: knowledge.matched
        ? [{ label: "Continue on WhatsApp", type: "handoff" }, { label: "Ask another question", type: "restart" }]
        : [{ label: "Clarify my goal", value: currentIntent.label }, { label: "Continue on WhatsApp", type: "handoff" }],
      canHandoff: Boolean(settings.whatsappEnabled),
      stateUpdate: { ...context },
    };
  }

  const knowledge = await findKnowledgeAnswer(input, settings);
  const threshold = Number(settings.lowConfidenceThreshold ?? 0.35);
  if (knowledge.boundary) {
    return {
      ...knowledge,
      quickReplies: [
        { label: "General education", value: "Share general educational information" },
        { label: "Plan a specific goal", value: "I want to plan a specific goal" },
        { label: "Speak with GrowVest", type: "handoff" },
      ],
      canHandoff: Boolean(settings.whatsappEnabled),
      nextAction: "advice_boundary",
    };
  }

  if (!knowledge.matched || Number(knowledge.confidence || 0) < threshold) {
    return {
      ...genericClarification(settings),
      answer: knowledge.matched
        ? `I found related information, but not enough to answer confidently. ${genericClarification(settings).answer}`
        : settings.fallbackMessage || genericClarification(settings).answer,
    };
  }

  return {
    ...knowledge,
    quickReplies: [
      { label: "Plan a specific goal", value: "I want to plan a specific goal" },
      { label: "Speak with GrowVest", type: "handoff" },
    ],
    canHandoff: Boolean(settings.whatsappEnabled),
    nextAction: "knowledge_answer",
  };
}

export function buildConversationSummary(context = {}, lastQuestion = "") {
  const state = sanitizeGuideClientContext(context);
  const intent = getIntent(state.intentId);
  const summary = state.conversationSummary || makeSummary(intent, state);
  if (summary) return summary;
  if (lastQuestion) return `Question: ${compact(lastQuestion, 220)}`;
  return "GrowVest Guide conversation";
}

export function getGuideIntentDefinitions() {
  return INTENTS.map(({ id, label, source }) => ({ id, label, source }));
}
