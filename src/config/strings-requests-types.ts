// Request voices: the shapes (split from strings-requests.ts, TECH-36).

export interface VoicePair {
  ask: string;
  thanks: string;
}

export interface RequestVoice {
  fallback: VoicePair;
  /** Narrated, for a request from one of the Grove's Nubbins; `{name}` is its name. */
  nubbin: VoicePair;
  by: Partial<Record<string, VoicePair>>;
}
