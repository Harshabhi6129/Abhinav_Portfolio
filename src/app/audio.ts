// ─── SHARED WEBAUDIO SFX ─────────────────────────────────────────────────────
// All sounds are synthesized — no asset files. A single lazy AudioContext is
// shared by the dossier cursor and the Range game view (also avoids the old
// per-click AudioContext leak). Every helper is try/catch'd and no-ops on SSR.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Filtered white-noise burst — building block for shots / clicks. */
function noiseBurst(c: AudioContext, dur: number, fromHz: number, toHz: number, gain: number) {
  const bufferSize = Math.max(1, Math.floor(c.sampleRate * dur));
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.8;

  const noise = c.createBufferSource();
  noise.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(fromHz, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(Math.max(20, toHz), c.currentTime + dur * 0.66);

  const g = c.createGain();
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);

  noise.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  noise.start();
  noise.stop(c.currentTime + dur);
}

/** Simple enveloped oscillator note. */
function tone(
  c: AudioContext,
  type: OscillatorType,
  freq: number,
  start: number,
  dur: number,
  gain: number,
  endFreq?: number
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), c.currentTime + start + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.02);
}

/** Gunshot — noise blast through a sweeping lowpass + low sine recoil thump. */
export function playShot() {
  const c = getCtx();
  if (!c) return;
  try {
    noiseBurst(c, 0.15, 3500, 150, 0.4);
    tone(c, "sine", 140, 0, 0.15, 0.6, 20);
  } catch {
    /* ignore audio errors */
  }
}

/** Dry-fire / empty-mag click. */
export function playDryFire() {
  const c = getCtx();
  if (!c) return;
  try {
    noiseBurst(c, 0.04, 2200, 1200, 0.15);
  } catch {
    /* ignore audio errors */
  }
}

/** Hit confirmation ding — pitch rises slightly with the combo streak. */
export function playHit(streak = 0) {
  const c = getCtx();
  if (!c) return;
  try {
    const base = 1320 * Math.pow(1.04, Math.min(streak, 10));
    tone(c, "triangle", base, 0, 0.12, 0.22);
    tone(c, "triangle", base * 1.5, 0.02, 0.1, 0.1);
  } catch {
    /* ignore audio errors */
  }
}

/** Reload — two mechanical clicks + a snap. */
export function playReload() {
  const c = getCtx();
  if (!c) return;
  try {
    noiseBurst(c, 0.05, 1800, 600, 0.2);
    setTimeout(() => {
      const c2 = getCtx();
      if (!c2) return;
      noiseBurst(c2, 0.05, 1400, 500, 0.2);
      tone(c2, "square", 220, 0.05, 0.05, 0.08, 110);
    }, 250);
  } catch {
    /* ignore audio errors */
  }
}

/** Stage clear — three ascending notes. */
export function playStageClear() {
  const c = getCtx();
  if (!c) return;
  try {
    const notes = [440, 554.37, 659.25]; // A4 · C#5 · E5
    notes.forEach((f, i) => {
      tone(c, "square", f, i * 0.09, 0.12, 0.12);
      tone(c, "square", f * 1.005, i * 0.09, 0.12, 0.06); // slight detune
    });
  } catch {
    /* ignore audio errors */
  }
}

/** Intel reveal — low swell + soft chime. */
export function playUnlock() {
  const c = getCtx();
  if (!c) return;
  try {
    tone(c, "sine", 110, 0, 0.5, 0.18, 220);
    tone(c, "triangle", 880, 0.18, 0.35, 0.12);
    tone(c, "triangle", 1318.5, 0.28, 0.4, 0.08);
  } catch {
    /* ignore audio errors */
  }
}

/** Mission complete — five-note fanfare. */
export function playMissionComplete() {
  const c = getCtx();
  if (!c) return;
  try {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((f, i) => {
      tone(c, "square", f, i * 0.11, 0.16, 0.12);
      tone(c, "triangle", f / 2, i * 0.11, 0.2, 0.08);
    });
  } catch {
    /* ignore audio errors */
  }
}
