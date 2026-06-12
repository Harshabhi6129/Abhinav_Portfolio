'use client';

// ─── RANGE MODE — STAGE CONFIG + ARENA + TARGETS ────────────────────────────
// Declarative stage definitions and the StageArena that spawns/animates the
// targets. Movement is pure framer-motion keyframes (GPU transforms) so the
// browser's own hit-testing tracks moving targets — no manual AABB math.

import React, { forwardRef, useImperativeHandle, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DATA, groupColors } from "../data";
import type { SectionKey } from "./storage";

// ─── STAGE DEFINITIONS ──────────────────────────────────────────────────────

export type TargetKind = "drones" | "vaults" | "chips" | "pods" | "recon" | "badges" | "flare";

export type StageDef = {
  index: number;
  code: string;       // "STAGE 00"
  name: string;       // "CALIBRATION"
  objective: string;  // briefing line
  counterNoun: string; // HUD counter noun, e.g. "NEUTRALIZED"
  section: SectionKey;
  kind: TargetKind;
  count: number;      // destroys needed to clear
  hp: number;
  sizePx: number;
  speed: number;      // 1 = baseline
  pointsPerHit: number;
  destroyBonus: number;
};

export const STAGES: StageDef[] = [
  {
    index: 0, code: "STAGE 00", name: "CALIBRATION",
    objective: "NEUTRALIZE 5 RECON DRONES TO DECRYPT THE PERSONNEL FILE",
    counterNoun: "NEUTRALIZED",
    section: "about", kind: "drones", count: 5, hp: 1, sizePx: 64, speed: 1,
    pointsPerHit: 100, destroyBonus: 0,
  },
  {
    index: 1, code: "STAGE 01", name: "BREACH",
    objective: "CRACK BOTH CORPORATE VAULTS — SUSTAINED FIRE REQUIRED",
    counterNoun: "BREACHED",
    section: "experience", kind: "vaults", count: 2, hp: 5, sizePx: 170, speed: 1,
    pointsPerHit: 50, destroyBonus: 300,
  },
  {
    index: 2, code: "STAGE 02", name: "ARSENAL",
    objective: "INTERCEPT 8 WEAPON CRATES CROSSING THE AIRSPACE",
    counterNoun: "INTERCEPTED",
    section: "skills", kind: "chips", count: 8, hp: 1, sizePx: 44, speed: 1,
    pointsPerHit: 100, destroyBonus: 0,
  },
  {
    index: 3, code: "STAGE 03", name: "EXTRACTION",
    objective: "DESTROY 4 PROJECT PODS IN ORBIT — 2 ROUNDS EACH",
    counterNoun: "EXTRACTED",
    section: "projects", kind: "pods", count: 4, hp: 2, sizePx: 104, speed: 1,
    pointsPerHit: 100, destroyBonus: 200,
  },
  {
    index: 4, code: "STAGE 04", name: "RECON",
    objective: "ONE TARGET. ONE SHOT. TAKE OUT THE MOVING BEACON",
    counterNoun: "ELIMINATED",
    section: "education", kind: "recon", count: 1, hp: 1, sizePx: 34, speed: 1,
    pointsPerHit: 500, destroyBonus: 0,
  },
  {
    index: 5, code: "STAGE 05", name: "TAGGING",
    objective: "TAG ALL 6 CREDENTIAL BADGES BEFORE THEY DRIFT AWAY",
    counterNoun: "TAGGED",
    section: "certs", kind: "badges", count: 6, hp: 1, sizePx: 76, speed: 1,
    pointsPerHit: 100, destroyBonus: 0,
  },
  {
    index: 6, code: "FINAL", name: "EXFIL",
    objective: "SHOOT THE SIGNAL FLARE TO CALL IN THE EXTRACTION",
    counterNoun: "SIGNALED",
    section: "contact", kind: "flare", count: 1, hp: 1, sizePx: 52, speed: 1,
    pointsPerHit: 250, destroyBonus: 0,
  },
];

// ─── SMALL UTILS ────────────────────────────────────────────────────────────

// Deterministic PRNG so target layouts are stable per spawn
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type TargetInst = {
  id: string;
  label: string;
  sub?: string;
  color: string;
  hpLeft: number;
  maxHp: number;
  seed: number;
  dead: boolean;
};

// Per-stage label pools pulled from real portfolio data
function buildTargets(stage: StageDef, salt: number): TargetInst[] {
  const mk = (i: number, label: string, color: string, sub?: string): TargetInst => ({
    id: `${stage.index}-${salt}-${i}`,
    label, sub, color,
    hpLeft: stage.hp, maxHp: stage.hp,
    seed: salt * 7919 + i * 104729 + stage.index * 31,
    dead: false,
  });

  switch (stage.kind) {
    case "drones":
      return Array.from({ length: 5 }, (_, i) => mk(i, `UAV-0${i + 1}`, "#F5A623"));
    case "vaults":
      return DATA.companies.map((c, i) => mk(i, c.org, c.color, c.role));
    case "chips": {
      const pool = DATA.skillBento.filter(s => s.size === "lg" || s.size === "md");
      return pool.slice(0, 12).map((s, i) => mk(i, s.label, groupColors[s.group] || "#F5A623"));
    }
    case "pods":
      return DATA.featuredProjects.map((p, i) => mk(i, p.title, p.accent));
    case "recon":
      return [mk(0, "BEACON", "#FF5F57")];
    case "badges": {
      const shorts = ["AWS SA-A", "AWS DEV-A", "AWS ML-A", "MS GENAI", "BCG GENAI", "TATA VIZ"];
      return DATA.certifications.slice(0, 6).map((c, i) =>
        mk(i, shorts[i] ?? c.issuer, c.tier === "gold" ? "#F5A623" : "#C0C0C0", c.tier.toUpperCase())
      );
    }
    case "flare":
      return [mk(0, "FLARE", "#F5A623")];
  }
}

// ─── DESTROY / HIT FX ───────────────────────────────────────────────────────

function DestroyBurst({ color, size }: { color: string; size: number }) {
  const sparks = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 10 + Math.random() * 0.5,
      dist: size * (0.8 + Math.random() * 1.2),
      c: i % 3 === 0 ? "#FFFFFF" : color,
    })),
    [color, size]
  );
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Flash core */}
      <motion.div
        initial={{ scale: 0.3, opacity: 1 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute rounded-full"
        style={{ width: size, height: size, background: `radial-gradient(circle, #fff 0%, ${color} 35%, transparent 70%)` }}
      />
      {/* Radiating sparks */}
      {sparks.map((s, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(s.angle) * s.dist, y: Math.sin(s.angle) * s.dist, opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ background: s.c, boxShadow: `0 0 6px ${s.c}` }}
        />
      ))}
    </div>
  );
}

// Brief white flash keyed by remaining HP so it re-triggers per hit
function HitFlash({ hpLeft }: { hpLeft: number }) {
  return (
    <motion.div
      key={hpLeft}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 pointer-events-none"
      style={{ background: "rgba(255,255,255,0.55)", mixBlendMode: "screen" }}
    />
  );
}

// ─── TARGET VISUALS (inner content; movement handled by the wrapper) ───────

const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

function DroneBody({ t, size }: { t: TargetInst; size: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Rotor lines */}
      <motion.div
        className="absolute -top-2 left-1/2 -translate-x-1/2 h-px"
        style={{ width: size * 1.1, background: "rgba(245,166,35,0.5)" }}
        animate={{ scaleX: [1, 0.25, 1] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          clipPath: HEX_CLIP,
          background: "linear-gradient(160deg, rgba(245,166,35,0.22), rgba(14,17,24,0.95))",
          border: "1px solid rgba(245,166,35,0.6)",
          boxShadow: "0 0 24px rgba(245,166,35,0.25)",
        }}
      >
        <div className="font-mono-custom text-[9px] tracking-widest" style={{ color: "#F5A623" }}>{t.label}</div>
      </div>
      {/* Hex outline ring */}
      <div className="absolute inset-0" style={{ clipPath: HEX_CLIP, border: "1px solid rgba(245,166,35,0.8)", opacity: 0.6 }} />
      {/* Blinking LED */}
      <motion.div
        className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: "#FF5F57", boxShadow: "0 0 6px #FF5F57" }}
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
    </div>
  );
}

function VaultBody({ t, size }: { t: TargetInst; size: number }) {
  const segs = Array.from({ length: t.maxHp });
  const cracked = t.hpLeft <= Math.ceil(t.maxHp * 0.6);
  const critical = t.hpLeft <= Math.ceil(t.maxHp * 0.3);
  return (
    <div className="relative" style={{ width: size, height: size * 0.72 }}>
      {/* HP bar */}
      <div className="absolute -top-3 left-0 right-0 flex gap-0.5">
        {segs.map((_, i) => (
          <div key={i} className="flex-1 h-1.5"
            style={{ background: i < t.hpLeft ? t.color : "rgba(255,255,255,0.12)", boxShadow: i < t.hpLeft ? `0 0 5px ${t.color}` : "none" }} />
        ))}
      </div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          background: `linear-gradient(150deg, ${t.color}26, #0E1118 65%)`,
          border: `2px solid ${t.color}AA`,
          boxShadow: `0 0 36px ${t.color}33, inset 0 0 24px rgba(0,0,0,0.7)`,
        }}
      >
        <div className="font-display text-2xl leading-none" style={{ color: t.color }}>{t.label}</div>
        <div className="font-mono-custom text-[8px] tracking-[0.3em] uppercase mt-1 text-white/40">{t.sub}</div>
        <div className="font-mono-custom text-[8px] tracking-widest uppercase mt-2 px-1.5 py-0.5 border border-white/15 text-white/30">
          ARMOR {t.hpLeft}/{t.maxHp}
        </div>
      </div>
      {/* Corner bolts */}
      {[["6%", "8%"], ["6%", "88%"], ["86%", "8%"], ["86%", "88%"]].map(([top, left], i) => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
          style={{ top, left, background: `${t.color}88`, boxShadow: `0 0 4px ${t.color}66` }} />
      ))}
      {/* Crack overlays as damage accrues */}
      {cracked && (
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute top-[20%] left-[15%] w-[40%] h-px bg-white/30 rotate-[24deg]" />
          <div className="absolute top-[55%] left-[45%] w-[35%] h-px bg-white/25 -rotate-[18deg]" />
        </div>
      )}
      {critical && (
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute top-[35%] left-[30%] w-[50%] h-px bg-white/40 rotate-[55deg]" />
          <div className="absolute top-[70%] left-[10%] w-[45%] h-px bg-white/30 rotate-[8deg]" />
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 0.6, repeat: Infinity }}
            className="absolute inset-0" style={{ background: `${t.color}14` }} />
        </div>
      )}
    </div>
  );
}

function ChipBody({ t }: { t: TargetInst }) {
  return (
    <div className="relative">
      {/* Motion-blur streak */}
      <div className="absolute top-1/2 right-full -translate-y-1/2 h-px w-10"
        style={{ background: `linear-gradient(to left, ${t.color}88, transparent)` }} />
      <div
        className="font-mono-custom text-[11px] uppercase tracking-widest px-3 py-1.5 whitespace-nowrap"
        style={{
          color: t.color,
          border: `1px solid ${t.color}`,
          background: "rgba(8,12,18,0.92)",
          boxShadow: `0 0 16px ${t.color}44`,
        }}
      >
        {t.label}
      </div>
    </div>
  );
}

function PodBody({ t, size }: { t: TargetInst; size: number }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-lg"
      style={{
        width: size, height: size * 0.8,
        background: `linear-gradient(160deg, ${t.color}22, #0E1118 70%)`,
        border: `1.5px solid ${t.color}BB`,
        boxShadow: `0 0 28px ${t.color}33`,
      }}
    >
      {/* HP pips */}
      <div className="absolute top-1.5 right-1.5 flex gap-0.5">
        {Array.from({ length: t.maxHp }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full"
            style={{ background: i < t.hpLeft ? t.color : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>
      <div className="font-mono-custom text-[8px] tracking-[0.3em] uppercase text-white/30 mb-1">POD</div>
      <div className="font-bold text-[12px] text-center px-2 leading-tight" style={{ color: t.color }}>{t.label}</div>
    </div>
  );
}

function ReconBody({ t, size }: { t: TargetInst; size: number }) {
  return (
    // Generous invisible hit padding around a tiny visual
    <div className="relative flex items-center justify-center" style={{ width: size + 26, height: size + 26 }}>
      <motion.div
        className="absolute rounded-full"
        style={{ width: size + 18, height: size + 18, border: `1px solid ${t.color}55` }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <div className="relative rounded-full flex items-center justify-center"
        style={{ width: size, height: size, border: `2px solid ${t.color}`, boxShadow: `0 0 18px ${t.color}66` }}>
        <div className="rounded-full" style={{ width: size * 0.45, height: size * 0.45, border: `1.5px solid ${t.color}` }} />
        <div className="absolute rounded-full" style={{ width: 4, height: 4, background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
      </div>
    </div>
  );
}

function BadgeBody({ t, size }: { t: TargetInst; size: number }) {
  const shieldClip = "polygon(50% 0%, 100% 18%, 100% 62%, 50% 100%, 0% 62%, 0% 18%)";
  return (
    <div className="relative" style={{ width: size, height: size * 1.15 }}>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          clipPath: shieldClip,
          background: `linear-gradient(170deg, ${t.color}2E, #0E1118 75%)`,
          border: `1.5px solid ${t.color}`,
          boxShadow: `0 0 22px ${t.color}44`,
        }}
      >
        <div className="font-mono-custom text-[9px] tracking-wider text-center leading-tight px-1" style={{ color: t.color }}>
          {t.label}
        </div>
        <div className="font-mono-custom text-[7px] tracking-[0.25em] mt-1 text-white/35">{t.sub}</div>
      </div>
    </div>
  );
}

function FlareBody({ t, size }: { t: TargetInst; size: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow trail below */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-1"
        style={{ height: size * 2.2, background: `linear-gradient(to bottom, ${t.color}AA, transparent)` }} />
      <motion.div
        className="absolute rounded-full"
        style={{ width: size, height: size, background: `radial-gradient(circle, #fff 0%, ${t.color} 40%, transparent 70%)` }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <div className="rounded-full" style={{ width: size * 0.3, height: size * 0.3, background: "#fff", boxShadow: `0 0 24px ${t.color}` }} />
    </div>
  );
}

// ─── MOVEMENT WRAPPERS ──────────────────────────────────────────────────────
// Outer motion.div owns the looping movement; the inner content swaps to a
// DestroyBurst on death so the explosion rides the (still-moving) wrapper.

function TargetMover({ stage, t, i, total, reduced, coarse, children }: {
  stage: StageDef; t: TargetInst; i: number; total: number;
  reduced: boolean; coarse: boolean; children: React.ReactNode;
}) {
  const rnd = useMemo(() => mulberry32(t.seed), [t.seed]);
  // Pre-roll randoms (stable across renders)
  const cfg = useMemo(() => {
    const r1 = rnd(), r2 = rnd(), r3 = rnd(), r4 = rnd();
    return { r1, r2, r3, r4 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.seed]);

  const speed = stage.speed * (coarse ? 0.85 : 1);
  const common = "absolute";
  const interactiveProps = { "data-target-id": t.id };

  switch (stage.kind) {
    case "drones": {
      const left = 12 + (i * 76) / Math.max(1, total - 1) + (cfg.r1 - 0.5) * 6; // % across
      const top = 24 + ((i % 2 === 0 ? cfg.r2 : 1 - cfg.r2) * 38);
      return (
        <motion.div
          {...interactiveProps}
          className={common}
          style={{ left: `${left}%`, top: `${top}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={reduced ? { opacity: 1, scale: 1 } : {
            opacity: 1, scale: 1,
            y: [0, -14 - cfg.r3 * 12, 0, 10 + cfg.r4 * 8, 0],
            x: [0, 10 + cfg.r4 * 14, 0, -8 - cfg.r3 * 10, 0],
          }}
          transition={reduced ? { duration: 0.4 } : { duration: (4.5 + cfg.r1 * 2) / speed, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        >
          {children}
        </motion.div>
      );
    }
    case "vaults": {
      const left = i === 0 ? 18 : 60;
      return (
        <motion.div
          {...interactiveProps}
          className={common}
          style={{ left: `${left}%`, top: "38%" }}
          initial={{ opacity: 0, y: 24 }}
          animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
          transition={reduced ? { duration: 0.4 } : { duration: 5 / speed, repeat: Infinity, ease: "easeInOut", delay: i * 0.4, opacity: { duration: 0.4, repeat: 0 } }}
        >
          {children}
        </motion.div>
      );
    }
    case "chips": {
      const ltr = i % 2 === 0;
      const top = 20 + ((i * 9) % 55) + cfg.r1 * 4;
      const dur = (8 + cfg.r2 * 4) / speed;
      if (reduced) {
        return (
          <motion.div {...interactiveProps} className={common}
            style={{ left: `${10 + ((i * 23) % 75)}%`, top: `${top}%` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        );
      }
      return (
        <motion.div
          {...interactiveProps}
          className={common}
          style={{ left: 0, top: `${top}%` }}
          initial={{ x: ltr ? "-18vw" : "115vw" }}
          animate={{ x: ltr ? "115vw" : "-18vw" }}
          transition={{ duration: dur, repeat: Infinity, ease: "linear", delay: (i * dur) / total }}
        >
          {children}
        </motion.div>
      );
    }
    case "pods": {
      const angle0 = (360 / total) * i;
      if (reduced) {
        return (
          <motion.div {...interactiveProps} className={common}
            style={{ left: `${18 + (i % 2) * 48}%`, top: `${24 + Math.floor(i / 2) * 34}%` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        );
      }
      return (
        // Orbit: parent rotates around screen center, child counter-rotates
        <motion.div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{ width: 0, height: 0 }}
          initial={{ rotate: angle0 }}
          animate={{ rotate: angle0 + 360 }}
          transition={{ duration: 38 / speed, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            {...interactiveProps}
            className="absolute pointer-events-auto"
            style={{ left: "min(31vw, 360px)", top: 0, translateX: "-50%", translateY: "-50%" }}
            initial={{ rotate: -angle0, opacity: 0 }}
            animate={{ rotate: -(angle0 + 360), opacity: 1 }}
            transition={{ rotate: { duration: 38 / speed, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.4 } }}
          >
            {children}
          </motion.div>
        </motion.div>
      );
    }
    case "recon": {
      if (reduced) {
        return (
          <motion.div {...interactiveProps} className={common} style={{ left: "48%", top: "45%" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        );
      }
      return (
        <motion.div
          {...interactiveProps}
          className={common}
          style={{ left: 0, top: 0 }}
          initial={{ x: "20vw", y: "40vh", opacity: 0 }}
          animate={{
            x: ["20vw", "70vw", "45vw", "80vw", "25vw", "60vw", "20vw"],
            y: ["40vh", "30vh", "62vh", "48vh", "60vh", "32vh", "40vh"],
            opacity: 1,
          }}
          transition={{ duration: 13 / speed, repeat: Infinity, ease: "easeInOut", opacity: { duration: 0.5, repeat: 0 } }}
        >
          {children}
        </motion.div>
      );
    }
    case "badges": {
      const left = 8 + ((i * 16 + cfg.r1 * 8) % 82);
      const dur = (13 + cfg.r2 * 5) / speed;
      if (reduced) {
        return (
          <motion.div {...interactiveProps} className={common}
            style={{ left: `${left}%`, top: `${20 + ((i * 13) % 55)}%` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        );
      }
      return (
        <motion.div
          {...interactiveProps}
          className={common}
          style={{ left: `${left}%`, top: 0 }}
          initial={{ y: "108vh" }}
          animate={{ y: "-22vh", x: [0, (cfg.r3 - 0.5) * 60, 0] }}
          transition={{
            y: { duration: dur, repeat: Infinity, ease: "linear", delay: (i * dur) / 7 },
            x: { duration: 4 + cfg.r4 * 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {children}
        </motion.div>
      );
    }
    case "flare": {
      if (reduced) {
        return (
          <motion.div {...interactiveProps} className={common} style={{ left: "48%", top: "38%" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        );
      }
      return (
        <motion.div
          {...interactiveProps}
          className={common}
          style={{ left: "calc(50% - 26px)", top: 0 }}
          initial={{ y: "108vh" }}
          animate={{ y: ["108vh", "26vh", "24vh", "26vh", "108vh"] }}
          transition={{ duration: 7 / speed, times: [0, 0.32, 0.5, 0.68, 1], repeat: Infinity, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      );
    }
  }
}

// ─── ARENA ──────────────────────────────────────────────────────────────────

export type DamageResult = { points: number; destroyed: boolean };
export type ArenaHandle = { damage: (id: string) => DamageResult | null };

export const StageArena = forwardRef<ArenaHandle, {
  stage: StageDef;
  salt: number;       // run id — changes force a clean respawn
  coarse: boolean;    // touch devices: bigger targets
}>(function StageArena({ stage, salt, coarse }, ref) {
  const reduced = !!useReducedMotion();
  const initial = useMemo(() => {
    const all = buildTargets(stage, salt);
    // chips keep a reserve pool; others spawn everything at once
    return stage.kind === "chips" ? all.slice(0, 4) : all;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.index, salt]);

  // The arena is remounted (keyed) per stage/run, so refs init once per run.
  // Damage resolution lives outside setState updaters to stay StrictMode-safe.
  const [targets, setTargets] = useState<TargetInst[]>(initial);
  const targetsRef = useRef<TargetInst[]>(initial);
  const reserveRef = useRef<TargetInst[]>(stage.kind === "chips" ? buildTargets(stage, salt).slice(4) : []);
  const destroyedRef = useRef(0);

  const commit = (next: TargetInst[]) => {
    targetsRef.current = next;
    setTargets(next);
  };

  useImperativeHandle(ref, () => ({
    damage(id: string): DamageResult | null {
      const prev = targetsRef.current;
      const idx = prev.findIndex(t => t.id === id && !t.dead);
      if (idx === -1) return null;
      const t = prev[idx];
      const hpLeft = t.hpLeft - 1;
      const destroyed = hpLeft <= 0;
      const next = [...prev];
      next[idx] = { ...t, hpLeft: Math.max(0, hpLeft), dead: destroyed };
      commit(next);
      if (destroyed) {
        destroyedRef.current += 1;
        // Remove the corpse after the explosion plays; refill chips if needed
        setTimeout(() => {
          let out = targetsRef.current.filter(x => x.id !== id);
          if (stage.kind === "chips" && destroyedRef.current < stage.count) {
            const refill = reserveRef.current.shift();
            if (refill) out = [...out, refill];
          }
          commit(out);
        }, 600);
      }
      return { points: stage.pointsPerHit + (destroyed ? stage.destroyBonus : 0), destroyed };
    },
  }), [stage]);

  const size = Math.round(stage.sizePx * (coarse ? 1.4 : 1));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {targets.map((t, i) => (
          <TargetMover key={t.id} stage={stage} t={t} i={i} total={initial.length} reduced={reduced} coarse={coarse}>
            <div className="relative" style={{ pointerEvents: t.dead ? "none" : "auto" }}>
              {t.dead ? (
                <DestroyBurst color={t.color} size={size} />
              ) : (
                <>
                  {stage.kind === "drones" && <DroneBody t={t} size={size} />}
                  {stage.kind === "vaults" && <VaultBody t={t} size={size} />}
                  {stage.kind === "chips" && <ChipBody t={t} />}
                  {stage.kind === "pods" && <PodBody t={t} size={size} />}
                  {stage.kind === "recon" && <ReconBody t={t} size={size} />}
                  {stage.kind === "badges" && <BadgeBody t={t} size={size} />}
                  {stage.kind === "flare" && <FlareBody t={t} size={size} />}
                  {t.hpLeft < t.maxHp && <HitFlash hpLeft={t.hpLeft} />}
                </>
              )}
            </div>
          </TargetMover>
        ))}
      </AnimatePresence>
    </div>
  );
});
