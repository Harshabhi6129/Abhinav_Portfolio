'use client';

// ─── RANGE MODE — GAME ORCHESTRATOR ─────────────────────────────────────────
// Full-screen shooting-gallery view of the portfolio. Visitors clear small
// stages (one mechanic per section) to unlock intel cards with the real
// portfolio content. Never blocks anyone: every stage is skippable.

import React, { useEffect, useMemo, useReducer, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, X, Check, ChevronsRight, RotateCcw } from "lucide-react";
import { STAGES, StageArena, type ArenaHandle } from "./game/stages";
import IntelCard, { ContactIntel } from "./game/IntelCard";
import {
  loadProgress, saveProgress, EMPTY_PROGRESS,
  type RangeProgress, type SectionKey, type UnlockStatus,
} from "./game/storage";
import {
  playShot, playDryFire, playHit, playReload,
  playStageClear, playUnlock, playMissionComplete,
} from "./audio";

const AMBER = "#F5A623";
const MAG_SIZE = 8;
const RELOAD_MS = 900;
const FIRE_GATE_MS = 130;

// ─── STATE ──────────────────────────────────────────────────────────────────

type Phase = "menu" | "briefing" | "playing" | "intel" | "debrief";

type GameState = {
  phase: Phase;
  stageIndex: number;
  runId: number;            // bump to force a fresh arena
  score: number;
  shots: number;
  hits: number;
  streak: number;
  ammo: number;
  reloading: boolean;
  stageKills: number;
  unlocked: Partial<Record<SectionKey, UnlockStatus>>;
};

const multiplierOf = (streak: number) => (streak >= 10 ? 4 : streak >= 6 ? 3 : streak >= 3 ? 2 : 1);

type Action =
  | { type: "SHOT"; hit: boolean; points?: number; destroyed?: boolean }
  | { type: "RELOAD_START" }
  | { type: "RELOAD_DONE" }
  | { type: "START_STAGE" }
  | { type: "STAGE_CLEAR"; section: SectionKey }
  | { type: "SKIP_STAGE"; section: SectionKey }
  | { type: "SKIP_ALL" }
  | { type: "CONTINUE" }
  | { type: "SELECT_STAGE"; index: number }
  | { type: "OPEN_MENU" }
  | { type: "REPLAY_MISSION" }
  | { type: "LOAD_PROGRESS"; unlocked: GameState["unlocked"] };

const initialState: GameState = {
  phase: "menu",
  stageIndex: 0,
  runId: 1,
  score: 0,
  shots: 0,
  hits: 0,
  streak: 0,
  ammo: MAG_SIZE,
  reloading: false,
  stageKills: 0,
  unlocked: {},
};

function reducer(state: GameState, a: Action): GameState {
  switch (a.type) {
    case "SHOT": {
      if (state.phase !== "playing" || state.ammo <= 0 || state.reloading) return state;
      const shots = state.shots + 1;
      const ammo = state.ammo - 1;
      if (!a.hit) return { ...state, shots, ammo, streak: 0 };
      const streak = state.streak + 1;
      return {
        ...state,
        shots,
        ammo,
        hits: state.hits + 1,
        streak,
        score: state.score + (a.points ?? 0) * multiplierOf(streak),
        stageKills: state.stageKills + (a.destroyed ? 1 : 0),
      };
    }
    case "RELOAD_START":
      if (state.reloading || state.ammo === MAG_SIZE) return state;
      return { ...state, reloading: true };
    case "RELOAD_DONE":
      return { ...state, reloading: false, ammo: MAG_SIZE };
    case "START_STAGE":
      return state.phase === "briefing" ? { ...state, phase: "playing" } : state;
    case "STAGE_CLEAR":
      return {
        ...state,
        phase: "intel",
        unlocked: { ...state.unlocked, [a.section]: "cleared" },
      };
    case "SKIP_STAGE":
      return {
        ...state,
        phase: "intel",
        unlocked: {
          ...state.unlocked,
          [a.section]: state.unlocked[a.section] === "cleared" ? "cleared" : "bypassed",
        },
      };
    case "SKIP_ALL": {
      const unlocked = { ...state.unlocked };
      STAGES.forEach(s => {
        if (unlocked[s.section] !== "cleared") unlocked[s.section] = "bypassed";
      });
      return { ...state, unlocked, phase: "debrief" };
    }
    case "CONTINUE": {
      if (state.stageIndex >= STAGES.length - 1) return { ...state, phase: "debrief" };
      return {
        ...state,
        phase: "briefing",
        stageIndex: state.stageIndex + 1,
        runId: state.runId + 1,
        stageKills: 0,
        ammo: MAG_SIZE,
        reloading: false,
        streak: 0,
      };
    }
    case "SELECT_STAGE":
      return {
        ...state,
        phase: "briefing",
        stageIndex: a.index,
        runId: state.runId + 1,
        stageKills: 0,
        ammo: MAG_SIZE,
        reloading: false,
        streak: 0,
      };
    case "OPEN_MENU":
      return { ...state, phase: "menu" };
    case "REPLAY_MISSION":
      return {
        ...state,
        phase: "briefing",
        stageIndex: 0,
        runId: state.runId + 1,
        score: 0,
        shots: 0,
        hits: 0,
        streak: 0,
        stageKills: 0,
        ammo: MAG_SIZE,
        reloading: false,
      };
    case "LOAD_PROGRESS":
      return { ...state, unlocked: { ...a.unlocked, ...state.unlocked } };
    default:
      return state;
  }
}

// ─── SMALL PIECES ───────────────────────────────────────────────────────────

function Typewriter({ text, speed = 18 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const t = setInterval(() => setN(v => {
      if (v >= text.length) { clearInterval(t); return v; }
      return v + 1;
    }), speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return (
    <span>
      {text.slice(0, n)}
      <span className="inline-block w-2 h-3.5 ml-0.5 align-middle animate-pulse" style={{ background: AMBER }} />
    </span>
  );
}

type ShotFx = { id: number; x: number; y: number; hit: boolean; points?: number };

function ShotEffects({ fx }: { fx: ShotFx[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {fx.map(f => (
        <div key={f.id} className="absolute" style={{ left: f.x, top: f.y }}>
          {/* Impact ring */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: f.hit ? 1.6 : 1, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 34, height: 34,
              border: `2px solid ${f.hit ? AMBER : "rgba(255,255,255,0.5)"}`,
            }}
          />
          {/* Sparks */}
          {Array.from({ length: f.hit ? 6 : 3 }).map((_, i) => {
            const ang = (Math.PI * 2 * i) / (f.hit ? 6 : 3) + f.id % 7;
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos(ang) * 36, y: Math.sin(ang) * 36, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute w-1 h-1 rounded-full"
                style={{ background: f.hit ? AMBER : "#8A8F98", boxShadow: `0 0 4px ${f.hit ? AMBER : "#8A8F98"}` }}
              />
            );
          })}
          {/* Floating score */}
          {f.hit && f.points ? (
            <motion.div
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -42, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute -translate-x-1/2 font-mono-custom text-sm font-bold whitespace-nowrap"
              style={{ color: AMBER, textShadow: `0 0 8px ${AMBER}88` }}
            >
              +{f.points}
            </motion.div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function GameView({ onExit }: { onExit: () => void }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const arenaRef = useRef<ArenaHandle>(null);
  const lastShotRef = useRef(0);
  const [fx, setFx] = useState<ShotFx[]>([]);
  const [flash, setFlash] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [best, setBest] = useState<RangeProgress>(EMPTY_PROGRESS);

  const stage = STAGES[state.stageIndex];
  const isLastStage = state.stageIndex === STAGES.length - 1;
  const accuracy = state.shots > 0 ? state.hits / state.shots : 0;
  const mult = multiplierOf(state.streak);

  // Play-time accounting (only while "playing")
  const playMsRef = useRef(0);
  const playingSinceRef = useRef<number | null>(null);
  useEffect(() => {
    if (state.phase === "playing") {
      playingSinceRef.current = Date.now();
    } else if (playingSinceRef.current != null) {
      playMsRef.current += Date.now() - playingSinceRef.current;
      playingSinceRef.current = null;
    }
  }, [state.phase]);

  // Load saved progress + detect touch
  useEffect(() => {
    const p = loadProgress();
    setBest(p);
    if (Object.keys(p.unlocked).length) dispatch({ type: "LOAD_PROGRESS", unlocked: p.unlocked });
    try {
      setCoarse(window.matchMedia("(pointer: coarse)").matches);
    } catch { /* ignore */ }
  }, []);

  // Persist unlocks whenever they change
  useEffect(() => {
    if (!Object.keys(state.unlocked).length) return;
    setBest(prev => {
      const merged: RangeProgress = { ...prev, unlocked: { ...prev.unlocked, ...state.unlocked } };
      saveProgress(merged);
      return merged;
    });
  }, [state.unlocked]);

  // Persist best run stats (called at debrief + exit)
  const commitBest = useCallback(() => {
    setBest(prev => {
      const acc = state.shots > 0 ? state.hits / state.shots : 0;
      const merged: RangeProgress = {
        ...prev,
        unlocked: { ...prev.unlocked, ...state.unlocked },
        bestScore: Math.max(prev.bestScore, state.score),
        bestAccuracy: state.score >= prev.bestScore ? acc : prev.bestAccuracy,
        bestTimeMs: prev.bestTimeMs,
      };
      saveProgress(merged);
      return merged;
    });
  }, [state.shots, state.hits, state.score, state.unlocked]);

  // Body scroll lock while the range is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Reload cycle
  useEffect(() => {
    if (!state.reloading) return;
    playReload();
    const t = setTimeout(() => dispatch({ type: "RELOAD_DONE" }), RELOAD_MS);
    return () => clearTimeout(t);
  }, [state.reloading]);

  // Auto-reload on empty mag
  useEffect(() => {
    if (state.phase === "playing" && state.ammo === 0 && !state.reloading) {
      const t = setTimeout(() => dispatch({ type: "RELOAD_START" }), 250);
      return () => clearTimeout(t);
    }
  }, [state.ammo, state.reloading, state.phase]);

  // Stage clear watcher
  useEffect(() => {
    if (state.phase !== "playing" || !stage || state.stageKills < stage.count) return;
    playStageClear();
    const t = setTimeout(() => {
      playUnlock();
      dispatch({ type: "STAGE_CLEAR", section: stage.section });
    }, 850);
    return () => clearTimeout(t);
  }, [state.stageKills, state.phase, stage]);

  // Mission-complete fanfare + stats
  const debriefDoneRef = useRef(false);
  useEffect(() => {
    if (state.phase !== "debrief" || debriefDoneRef.current) return;
    debriefDoneRef.current = true;
    playMissionComplete();
    // finalize time + bests
    let totalMs = playMsRef.current;
    if (playingSinceRef.current != null) totalMs += Date.now() - playingSinceRef.current;
    setBest(prev => {
      const acc = state.shots > 0 ? state.hits / state.shots : 0;
      const isBest = state.score > prev.bestScore;
      const merged: RangeProgress = {
        ...prev,
        unlocked: { ...prev.unlocked, ...state.unlocked },
        bestScore: Math.max(prev.bestScore, state.score),
        bestAccuracy: isBest ? acc : prev.bestAccuracy,
        bestTimeMs: prev.bestTimeMs === 0 ? totalMs : Math.min(prev.bestTimeMs, totalMs || prev.bestTimeMs),
        missionsCompleted: prev.missionsCompleted + 1,
      };
      saveProgress(merged);
      return merged;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);
  useEffect(() => {
    if (state.phase !== "debrief") debriefDoneRef.current = false;
  }, [state.phase]);

  // Keyboard: Escape navigates back · R reloads
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (state.phase === "menu") { commitBest(); onExit(); }
        else if (state.phase === "playing" || state.phase === "briefing") dispatch({ type: "OPEN_MENU" });
      } else if ((e.key === "r" || e.key === "R") && state.phase === "playing") {
        dispatch({ type: "RELOAD_START" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, onExit, commitBest]);

  // ── THE SHOT PIPELINE ──
  const handlePointerDown = (e: React.PointerEvent) => {
    const el = e.target as HTMLElement;
    if (el.closest("[data-ui]")) return; // UI clicks never consume ammo

    if (state.phase === "briefing") {
      dispatch({ type: "START_STAGE" });
      return;
    }
    if (state.phase !== "playing") return;

    const now = Date.now();
    if (now - lastShotRef.current < FIRE_GATE_MS) return;
    lastShotRef.current = now;

    if (state.reloading) { playDryFire(); return; }
    if (state.ammo <= 0) { playDryFire(); return; }

    playShot();
    setFlash(true);
    setTimeout(() => setFlash(false), 50);

    const targetEl = el.closest("[data-target-id]") as HTMLElement | null;
    const id = now + Math.floor(Math.random() * 1000);

    if (targetEl) {
      const targetId = targetEl.getAttribute("data-target-id")!;
      const result = arenaRef.current?.damage(targetId) ?? null;
      if (result) {
        playHit(state.streak + 1);
        const shown = result.points * multiplierOf(state.streak + 1);
        setFx(prev => [...prev.slice(-14), { id, x: e.clientX, y: e.clientY, hit: true, points: shown }]);
        dispatch({ type: "SHOT", hit: true, points: result.points, destroyed: result.destroyed });
      } else {
        // already-dead target — counts as a miss
        setFx(prev => [...prev.slice(-14), { id, x: e.clientX, y: e.clientY, hit: false }]);
        dispatch({ type: "SHOT", hit: false });
      }
    } else {
      setFx(prev => [...prev.slice(-14), { id, x: e.clientX, y: e.clientY, hit: false }]);
      dispatch({ type: "SHOT", hit: false });
    }
    setTimeout(() => setFx(prev => prev.filter(f => f.id !== id)), 800);
  };

  const exitToDossier = () => { commitBest(); onExit(); };

  const firstUndone = useMemo(() => {
    const i = STAGES.findIndex(s => !state.unlocked[s.section]);
    return i === -1 ? 0 : i;
  }, [state.unlocked]);
  const maxPlayable = useMemo(() => {
    // every finished stage + the next one
    let i = 0;
    while (i < STAGES.length && state.unlocked[STAGES[i].section]) i++;
    return Math.min(i, STAGES.length - 1);
  }, [state.unlocked]);

  const fmtTime = (ms: number) => {
    const s = Math.round(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  const inMission = state.phase === "briefing" || state.phase === "playing" || state.phase === "intel";

  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[500] overflow-hidden select-none"
      style={{ background: "#080C12" }}
      onPointerDown={handlePointerDown}
    >
      {/* ── BACKDROP LAYERS ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {/* Amber grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              `linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px),` +
              `linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Scanlines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />
        {/* Slow radar sweep line */}
        <motion.div
          className="absolute top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${AMBER}33, transparent)` }}
          animate={{ left: ["0%", "100%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Muzzle flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ background: "rgba(245,166,35,0.07)" }}
          />
        )}
      </AnimatePresence>

      {/* ── ARENA ── */}
      {state.phase === "playing" && stage && (
        <StageArena
          key={`${state.stageIndex}-${state.runId}`}
          ref={arenaRef}
          stage={stage}
          salt={state.runId}
          coarse={coarse}
        />
      )}

      <ShotEffects fx={fx} />

      {/* ── LEFT PROGRESS RAIL ── */}
      {inMission && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-1" data-ui>
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
          {STAGES.map((s, i) => {
            const status = state.unlocked[s.section];
            const active = i === state.stageIndex;
            const clickable = i <= maxPlayable;
            return (
              <button
                key={s.index}
                disabled={!clickable}
                onClick={() => clickable && dispatch({ type: "SELECT_STAGE", index: i })}
                className="group relative flex items-center gap-3 py-1.5 pl-0.5 disabled:cursor-default"
                title={`${s.code} · ${s.name}`}
              >
                <span className="relative flex items-center justify-center w-[22px] h-[22px]">
                  {active && (
                    <motion.span
                      className="absolute rounded-full"
                      style={{ width: 20, height: 20, border: `1px solid ${AMBER}` }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  )}
                  <span
                    className="flex items-center justify-center rounded-full transition-all"
                    style={{
                      width: status ? 14 : 8,
                      height: status ? 14 : 8,
                      background: status === "cleared" ? AMBER : status === "bypassed" ? "rgba(255,255,255,0.3)" : "transparent",
                      border: status ? "none" : `1px solid ${active ? AMBER : "rgba(255,255,255,0.25)"}`,
                      boxShadow: status === "cleared" ? `0 0 8px ${AMBER}` : "none",
                    }}
                  >
                    {status === "cleared" && <Check className="w-2.5 h-2.5 text-[#080C12]" strokeWidth={4} />}
                    {status === "bypassed" && <ChevronsRight className="w-2.5 h-2.5 text-[#080C12]" strokeWidth={3} />}
                  </span>
                </span>
                <span
                  className="font-mono-custom text-[9px] tracking-widest uppercase whitespace-nowrap transition-opacity"
                  style={{ color: active ? AMBER : "rgba(255,255,255,0.3)", opacity: active ? 1 : 0.6 }}
                >
                  {s.code}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── HUD TOP ── */}
      {inMission && stage && (
        <div className="absolute top-0 inset-x-0 z-40 px-5 md:px-8 pt-4 flex items-start justify-between pointer-events-none">
          <div>
            <div className="font-mono-custom text-[9px] tracking-[0.4em] uppercase text-white/30 mb-0.5">{stage.code}</div>
            <div className="font-display text-3xl md:text-4xl leading-none" style={{ color: AMBER }}>{stage.name}</div>
            <div className="font-mono-custom text-[10px] tracking-widest uppercase text-white/45 mt-1.5">
              {state.stageKills} / {stage.count} {stage.counterNoun}
            </div>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto" data-ui>
            <button
              onClick={() => dispatch({ type: "SKIP_STAGE", section: stage.section })}
              className="font-mono-custom text-[10px] tracking-widest uppercase px-3.5 py-2 border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition"
            >
              Skip ▸
            </button>
            <button
              onClick={() => dispatch({ type: "OPEN_MENU" })}
              className="font-mono-custom text-[10px] tracking-widest uppercase px-3.5 py-2 border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition"
            >
              Menu
            </button>
            <button
              onClick={exitToDossier}
              className="flex items-center gap-1.5 font-mono-custom text-[10px] tracking-widest uppercase px-3.5 py-2 border transition"
              style={{ borderColor: `${AMBER}55`, color: AMBER, background: `${AMBER}0A` }}
            >
              <X className="w-3 h-3" /> Exit
            </button>
          </div>
        </div>
      )}

      {/* ── HUD BOTTOM ── */}
      {inMission && (
        <div className="absolute bottom-0 inset-x-0 z-40 px-5 md:px-8 pb-5 flex items-end justify-between pointer-events-none">
          {/* Score + combo */}
          <div>
            <div className="font-mono-custom text-[9px] tracking-[0.4em] uppercase text-white/30 mb-0.5">Score</div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl leading-none" style={{ color: AMBER }}>
                {state.score.toLocaleString()}
              </span>
              <AnimatePresence>
                {mult > 1 && (
                  <motion.span
                    key={mult}
                    initial={{ scale: 1.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="font-mono-custom text-sm font-bold px-2 py-0.5"
                    style={{ color: "#080C12", background: AMBER }}
                  >
                    x{mult}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ammo */}
          <div className="pointer-events-auto" data-ui>
            <div className="font-mono-custom text-[9px] tracking-[0.4em] uppercase text-white/30 mb-1.5 text-center">
              {state.reloading ? "Reloading" : `Ammo ${state.ammo}/${MAG_SIZE}`}
            </div>
            <button
              onClick={() => dispatch({ type: "RELOAD_START" })}
              title="Reload (R)"
              className="relative flex gap-1 p-1.5 border border-white/10 bg-[#0E1118]"
            >
              {state.reloading ? (
                <div className="relative w-[140px] h-4 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{ background: `${AMBER}66` }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: RELOAD_MS / 1000, ease: "linear" }}
                  />
                </div>
              ) : (
                Array.from({ length: MAG_SIZE }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[14px] h-4 transition-colors"
                    style={{
                      background: i < state.ammo ? AMBER : "transparent",
                      border: `1px solid ${i < state.ammo ? AMBER : "rgba(255,255,255,0.2)"}`,
                      boxShadow: i < state.ammo ? `0 0 5px ${AMBER}55` : "none",
                    }}
                  />
                ))
              )}
            </button>
          </div>

          {/* Accuracy */}
          <div className="text-right">
            <div className="font-mono-custom text-[9px] tracking-[0.4em] uppercase text-white/30 mb-0.5">Telemetry</div>
            <div className="font-mono-custom text-sm text-white/70">
              ACC <span style={{ color: AMBER }}>{Math.round(accuracy * 100)}%</span>
              <span className="text-white/25 mx-2">·</span>
              SHOTS <span style={{ color: AMBER }}>{state.shots}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── OVERLAYS ── */}
      <AnimatePresence mode="wait">
        {/* MENU */}
        {state.phase === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center px-6"
            data-ui
          >
            <div className="w-full max-w-xl text-center">
              <div className="inline-flex items-center gap-2 font-mono-custom text-[10px] tracking-[0.4em] uppercase mb-6 px-3 py-1.5"
                style={{ color: AMBER, border: `1px solid ${AMBER}44`, background: `${AMBER}08` }}>
                <Crosshair className="w-3.5 h-3.5" />
                Tactical Portfolio Interface
              </div>
              <h1 className="font-display text-7xl md:text-8xl text-white leading-none mb-3">
                THE <span style={{ color: AMBER }}>RANGE</span>
              </h1>
              <p className="font-mono-custom text-xs text-white/45 tracking-wider uppercase mb-2">
                Clear the stages · Declassify the dossier
              </p>
              <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8">
                Each stage hides one section of Abhinav&apos;s portfolio behind a quick shooting objective.
                {coarse ? " TAP to shoot." : " CLICK to shoot · R to reload · ESC for menu."}
                {coarse && <span className="block mt-1 text-white/25 text-xs">Best experienced on desktop.</span>}
              </p>

              {/* Stage list */}
              <div className="mb-8 border border-white/8 bg-[#0E1118] divide-y divide-white/5 text-left">
                {STAGES.map((s, i) => {
                  const status = state.unlocked[s.section];
                  const clickable = i <= maxPlayable;
                  return (
                    <button
                      key={s.index}
                      disabled={!clickable}
                      onClick={() => dispatch({ type: "SELECT_STAGE", index: i })}
                      className="w-full flex items-center gap-4 px-4 py-2.5 transition hover:bg-white/[0.03] disabled:opacity-40 disabled:hover:bg-transparent text-left"
                    >
                      <span className="font-mono-custom text-[9px] text-white/30 tracking-widest w-16 flex-none">{s.code}</span>
                      <span className="font-display text-lg text-white/85 flex-1">{s.name}</span>
                      <span className="font-mono-custom text-[9px] tracking-widest uppercase"
                        style={{ color: status === "cleared" ? AMBER : status === "bypassed" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" }}>
                        {status === "cleared" ? "✓ CLEARED" : status === "bypassed" ? "» BYPASSED" : clickable ? "READY" : "LOCKED"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Best stats */}
              {best.bestScore > 0 && (
                <div className="font-mono-custom text-[10px] text-white/30 tracking-widest uppercase mb-6">
                  Best Score <span style={{ color: AMBER }}>{best.bestScore.toLocaleString()}</span>
                  <span className="mx-2">·</span>
                  Best Acc <span style={{ color: AMBER }}>{Math.round(best.bestAccuracy * 100)}%</span>
                  {best.bestTimeMs > 0 && (
                    <>
                      <span className="mx-2">·</span>
                      Best Time <span style={{ color: AMBER }}>{fmtTime(best.bestTimeMs)}</span>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => dispatch({ type: "SELECT_STAGE", index: firstUndone })}
                  className="font-mono-custom text-sm tracking-widest uppercase px-8 py-3.5 transition hover:opacity-90"
                  style={{ background: AMBER, color: "#080C12" }}
                >
                  ▸ Start Mission
                </button>
                <button
                  onClick={() => dispatch({ type: "SKIP_ALL" })}
                  className="font-mono-custom text-[10px] tracking-widest uppercase px-5 py-3.5 border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition"
                >
                  Skip All — Open Full Dossier
                </button>
                <button
                  onClick={exitToDossier}
                  className="font-mono-custom text-[10px] tracking-widest uppercase px-5 py-3.5 border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition"
                >
                  ✕ Exit
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* BRIEFING */}
        {state.phase === "briefing" && stage && (
          <motion.div
            key={`briefing-${state.stageIndex}-${state.runId}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-30 flex items-center justify-center px-6"
          >
            <div className="text-center max-w-lg">
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                className="h-px w-48 mx-auto mb-6" style={{ background: `${AMBER}66` }}
              />
              <div className="font-mono-custom text-[10px] tracking-[0.5em] uppercase text-white/35 mb-2">{stage.code} · MISSION BRIEFING</div>
              <div className="font-display text-6xl md:text-7xl leading-none mb-5" style={{ color: AMBER }}>{stage.name}</div>
              <div className="font-mono-custom text-xs md:text-sm text-white/70 tracking-wider min-h-[2.5em] mb-8">
                <Typewriter text={stage.objective} />
              </div>
              <div className="font-mono-custom text-[10px] tracking-[0.3em] uppercase text-white/30 animate-pulse">
                {coarse ? "— TAP ANYWHERE TO ENGAGE —" : "— CLICK ANYWHERE TO ENGAGE —"}
              </div>
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                className="h-px w-48 mx-auto mt-6" style={{ background: `${AMBER}66` }}
              />
            </div>
          </motion.div>
        )}

        {/* INTEL */}
        {state.phase === "intel" && stage && (
          <IntelCard
            key={`intel-${state.stageIndex}`}
            section={stage.section}
            status={state.unlocked[stage.section] ?? "cleared"}
            onContinue={() => dispatch({ type: "CONTINUE" })}
            isLast={isLastStage}
          />
        )}

        {/* DEBRIEF */}
        {state.phase === "debrief" && (
          <motion.div
            key="debrief"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
            data-ui
          >
            <div className="w-full max-w-2xl text-center my-auto">
              <div className="font-mono-custom text-[10px] tracking-[0.5em] uppercase mb-3" style={{ color: AMBER }}>
                ◢ MISSION COMPLETE
              </div>
              <h2 className="font-display text-6xl md:text-8xl text-white leading-none mb-2">
                DOSSIER<br /><span style={{ color: AMBER }}>DECLASSIFIED</span>
              </h2>
              {state.score > 0 && state.score >= best.bestScore && (
                <div className="inline-block font-mono-custom text-[10px] tracking-widest uppercase px-3 py-1 mb-4 mt-2"
                  style={{ color: "#080C12", background: AMBER }}>
                  ★ New Personal Best
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
                {[
                  { l: "Score", v: state.score.toLocaleString() },
                  { l: "Accuracy", v: `${Math.round(accuracy * 100)}%` },
                  { l: "Time", v: fmtTime(playMsRef.current) },
                  {
                    l: "Cleared",
                    v: `${Object.values(state.unlocked).filter(s => s === "cleared").length}/${STAGES.length}`,
                  },
                ].map(s => (
                  <div key={s.l} className="p-4 border border-white/10 bg-[#0E1118]">
                    <div className="font-display text-3xl" style={{ color: AMBER }}>{s.v}</div>
                    <div className="font-mono-custom text-[9px] text-white/35 uppercase tracking-widest mt-1">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="p-6 md:p-8 border border-white/10 bg-[#0E1118] mb-8" style={{ boxShadow: `0 0 60px ${AMBER}11` }}>
                <div className="font-mono-custom text-[10px] tracking-[0.4em] uppercase text-white/35 mb-5">ESTABLISH CONTACT</div>
                <ContactIntel />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pb-6">
                <button
                  onClick={() => dispatch({ type: "REPLAY_MISSION" })}
                  className="flex items-center gap-2 font-mono-custom text-[10px] tracking-widest uppercase px-5 py-3 border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay Mission
                </button>
                <button
                  onClick={exitToDossier}
                  className="font-mono-custom text-sm tracking-widest uppercase px-8 py-3 transition hover:opacity-90"
                  style={{ background: AMBER, color: "#080C12" }}
                >
                  Return to Dossier ▸
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
