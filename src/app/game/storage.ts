// ─── RANGE MODE PERSISTENCE ─────────────────────────────────────────────────
// localStorage-backed progress. All access is SSR-safe and failure-tolerant.

export type SectionKey =
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "certs"
  | "contact";

export type UnlockStatus = "cleared" | "bypassed";

export type RangeProgress = {
  version: 1;
  unlocked: Partial<Record<SectionKey, UnlockStatus>>;
  bestScore: number;
  bestAccuracy: number; // 0..1
  bestTimeMs: number;   // 0 = none recorded
  missionsCompleted: number;
};

const KEY = "akRangeProgress.v1";

export const EMPTY_PROGRESS: RangeProgress = {
  version: 1,
  unlocked: {},
  bestScore: 0,
  bestAccuracy: 0,
  bestTimeMs: 0,
  missionsCompleted: 0,
};

export function loadProgress(): RangeProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as RangeProgress;
    if (parsed?.version !== 1) return EMPTY_PROGRESS;
    return { ...EMPTY_PROGRESS, ...parsed, unlocked: { ...parsed.unlocked } };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(p: RangeProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage may be unavailable (private mode) — ignore */
  }
}
