type EventName =
  | 'app_open'
  | 'entry_parsed'
  | 'entry_saved'
  | 'entry_deleted'
  | 'budget_changed'
  | 'ai_enriched';

export function fire(name: EventName, payload: Record<string, unknown> = {}) {
  // Stub for now; can be wired to Segment or Expo Analytics later
  // console.log(`[analytics] ${name}`, payload);
}



