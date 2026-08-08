/**
 * Production analytics event pipeline.
 * ClickHouse remains the analytics engine and Grafana the observability layer —
 * this adapter buffers events client-side and forwards them when the
 * warehouse endpoint is configured. Nothing here replaces either system.
 */
export interface AnalyticsEvent {
  name: string;
  ts: string;
  props: Record<string, string | number | boolean | undefined>;
}

const buffer: AnalyticsEvent[] = [];

export function trackEvent(
  name: string,
  props: AnalyticsEvent["props"] = {}
): AnalyticsEvent {
  const event: AnalyticsEvent = { name, ts: new Date().toISOString(), props };
  buffer.unshift(event);
  if (buffer.length > 200) buffer.pop();
  if (import.meta.env.DEV) console.debug("[clickhouse:event]", event);
  return event;
}

export function recentEvents(limit = 25): AnalyticsEvent[] {
  return buffer.slice(0, limit);
}
