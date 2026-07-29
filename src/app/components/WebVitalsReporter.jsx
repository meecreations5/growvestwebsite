"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "../lib/analytics";

function reportMetric(metric) {
  trackEvent("web_vital", {
    metric_name: metric.name,
    metric_id: metric.id,
    metric_value: metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value),
    metric_delta: metric.name === "CLS" ? Math.round(metric.delta * 1000) : Math.round(metric.delta),
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
  });
}

export function WebVitalsReporter() {
  useReportWebVitals(reportMetric);
  return null;
}
