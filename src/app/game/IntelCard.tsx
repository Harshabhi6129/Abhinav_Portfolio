'use client';

// ─── "INTEL UNLOCKED" CARDS ─────────────────────────────────────────────────
// Terminal-styled reveal cards shown after each stage. Content is the REAL
// portfolio data from data.ts — the game is just the lock on the door.

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, ExternalLink, Mail, FileText } from "lucide-react";
import { DATA } from "../data";
import { groupColors } from "../data";
import type { SectionKey, UnlockStatus } from "./storage";

const AMBER = "#F5A623";

const SECTION_TITLES: Record<SectionKey, string> = {
  about: "PERSONNEL FILE",
  experience: "DEPLOYMENT RECORDS",
  skills: "WEAPONS MANIFEST",
  projects: "MISSION ARCHIVE",
  education: "TRAINING DOSSIER",
  certs: "COMMENDATIONS",
  contact: "COMM-LINK",
};

function MonoLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-mono-custom text-[10px] text-white/35 tracking-[0.25em] uppercase mb-2">{children}</div>;
}

function AboutIntel() {
  return (
    <div>
      <div className="font-display text-5xl text-white leading-none mb-1">{DATA.name}</div>
      <div className="font-mono-custom text-xs tracking-widest uppercase mb-4" style={{ color: AMBER }}>
        {DATA.title} · {DATA.subtitle}
      </div>
      <p className="text-white/60 text-sm leading-relaxed mb-6">
        4 years building mission-critical systems at IBM &amp; Wells Fargo. MS CS @ University at Buffalo.
        Obsessed with correctness, throughput, and making complex systems feel simple.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { v: "4+", l: "Years" },
          { v: "2", l: "Companies" },
          { v: "10+", l: "Projects" },
        ].map(s => (
          <div key={s.l} className="text-center p-3 border border-white/10 bg-[#080C12]">
            <div className="font-display text-3xl" style={{ color: AMBER }}>{s.v}</div>
            <div className="font-mono-custom text-[9px] text-white/40 uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceIntel() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {DATA.companies.map(c => (
        <div key={c.id} className="p-4 border bg-[#080C12]" style={{ borderColor: `${c.color}66`, boxShadow: `0 0 24px ${c.color}14` }}>
          <div className="font-mono-custom text-[9px] tracking-widest uppercase mb-1" style={{ color: c.color }}>{c.time}</div>
          <div className="font-display text-2xl text-white leading-none">{c.org}</div>
          <div className="text-white/50 text-xs mb-3">{c.role}</div>
          <p className="text-white/60 text-xs leading-relaxed mb-3">{c.headline}</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {c.metrics.map(m => (
              <div key={m.label} className="p-2 border border-white/8 text-center">
                <div className="font-mono-custom text-sm font-bold" style={{ color: c.color }}>{m.value}</div>
                <div className="text-[8px] text-white/40 uppercase tracking-widest">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {c.stack.slice(0, 4).map(s => (
              <span key={s} className="font-mono-custom text-[9px] px-1.5 py-0.5 border border-white/15 text-white/50">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsIntel() {
  return (
    <div>
      <MonoLabel>Primary Loadout</MonoLabel>
      <div className="flex flex-wrap gap-2 mb-6">
        {DATA.skillBento.filter(s => s.size === "lg").map(s => (
          <span
            key={s.label}
            className="font-mono-custom text-xs uppercase tracking-widest px-3 py-1.5"
            style={{ color: groupColors[s.group], border: `1px solid ${groupColors[s.group]}88`, background: `${groupColors[s.group]}0D` }}
          >
            {s.label}
          </span>
        ))}
      </div>
      <MonoLabel>Full Arsenal</MonoLabel>
      <div className="space-y-2">
        {DATA.skillCategories.slice(0, 6).map(cat => (
          <div key={cat.name} className="flex gap-3 text-xs">
            <span className="font-mono-custom text-white/35 uppercase tracking-wider w-32 flex-none">{cat.name}</span>
            <span className="text-white/65">{cat.items.join(" · ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsIntel() {
  return (
    <div className="space-y-3">
      {DATA.featuredProjects.map(p => (
        <div key={p.id} className="p-3 border border-white/8 bg-[#080C12] flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm" style={{ color: p.accent }}>{p.title}</div>
            <p className="text-white/50 text-xs leading-relaxed mt-1 line-clamp-2">{p.blurb}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {p.tools.slice(0, 4).map(t => (
                <span key={t} className="font-mono-custom text-[8px] px-1.5 py-0.5 border border-white/10 text-white/35 uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-none" data-ui>
            {p.code && (
              <a href={p.code} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                <Github className="w-4 h-4" />
              </a>
            )}
            {"demo" in p && p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationIntel() {
  const e = DATA.education;
  return (
    <div className="text-center">
      <div className="font-mono-custom text-xs tracking-widest uppercase mb-3" style={{ color: AMBER }}>{e.degree}</div>
      <div className="font-display text-5xl text-white leading-none mb-2">{e.school.toUpperCase()}</div>
      <div className="font-mono-custom text-xs text-white/45 tracking-widest uppercase mb-6">
        GPA {e.gpa} · {e.time} · {e.location}
      </div>
      <MonoLabel>Specialization</MonoLabel>
      <div className="flex flex-wrap justify-center gap-2">
        {e.specialization.map(s => (
          <span key={s} className="px-3 py-1 border border-white/12 text-white/60 text-xs font-mono-custom uppercase tracking-wider">{s}</span>
        ))}
      </div>
    </div>
  );
}

function CertsIntel() {
  return (
    <div className="space-y-2">
      {DATA.certifications.map(c => (
        <div key={c.title} className="flex items-center gap-3 p-3 border border-white/8 bg-[#080C12]">
          <span
            className="w-2.5 h-2.5 rounded-full flex-none"
            style={{
              background: c.tier === "gold" ? AMBER : "#C0C0C0",
              boxShadow: `0 0 8px ${c.tier === "gold" ? AMBER : "#C0C0C0"}66`,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white/85 truncate">{c.title}</div>
            <div className="font-mono-custom text-[9px] text-white/35 uppercase tracking-widest">{c.issuer} · {c.issued}</div>
          </div>
          {c.link !== "#" && (
            <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition flex-none" data-ui>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export function ContactIntel() {
  return (
    <div className="text-center">
      <a
        href={`mailto:${DATA.email}`}
        className="inline-flex items-center gap-3 font-display text-3xl text-white hover:text-[#F5A623] transition mb-2"
        data-ui
      >
        <Mail className="w-6 h-6" style={{ color: AMBER }} />
        {DATA.email}
      </a>
      <div className="font-mono-custom text-xs text-white/40 tracking-widest mb-6">{DATA.phone}</div>
      <div className="flex flex-wrap justify-center gap-3" data-ui>
        {[
          { label: "LinkedIn", href: DATA.links.linkedin, icon: <Linkedin className="w-4 h-4" /> },
          { label: "GitHub", href: DATA.links.github, icon: <Github className="w-4 h-4" /> },
          { label: "Resume", href: DATA.links.resume, icon: <FileText className="w-4 h-4" /> },
          { label: "Medium", href: DATA.links.medium, icon: <ExternalLink className="w-4 h-4" /> },
        ].map(l => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-[#F5A62366] text-white/55 hover:text-white transition font-mono-custom text-xs tracking-widest uppercase"
          >
            {l.icon}
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

const SECTION_BODIES: Record<SectionKey, () => React.JSX.Element> = {
  about: AboutIntel,
  experience: ExperienceIntel,
  skills: SkillsIntel,
  projects: ProjectsIntel,
  education: EducationIntel,
  certs: CertsIntel,
  contact: ContactIntel,
};

// ─── THE CARD SHELL ─────────────────────────────────────────────────────────

export default function IntelCard({ section, status, onContinue, isLast }: {
  section: SectionKey;
  status: UnlockStatus;
  onContinue: () => void;
  isLast: boolean;
}) {
  const Body = SECTION_BODIES[section];
  const cleared = status === "cleared";
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center px-4 py-8" data-ui>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: "rgba(8,12,18,0.88)", backdropFilter: "blur(8px)" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 36, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{
          background: "#0E1118",
          border: `1px solid ${AMBER}44`,
          boxShadow: `0 0 80px ${AMBER}22, 0 0 0 1px ${AMBER}22`,
        }}
      >
        {/* Diagonal stamp */}
        <div
          aria-hidden
          className="absolute top-8 right-[-44px] rotate-[35deg] font-mono-custom text-[10px] tracking-[0.4em] uppercase px-12 py-1 select-none pointer-events-none"
          style={{
            color: cleared ? AMBER : "rgba(255,255,255,0.45)",
            border: `1px solid ${cleared ? AMBER : "rgba(255,255,255,0.3)"}`,
            background: "#0E1118",
          }}
        >
          {cleared ? "Unlocked" : "Bypassed"}
        </div>

        {/* Terminal header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10" style={{ background: `${AMBER}14` }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="ml-3 font-mono-custom text-[10px] text-white/40 flex-1">{section}.intel</span>
          <span
            className="font-mono-custom text-[9px] tracking-widest uppercase px-2 py-0.5"
            style={{
              color: cleared ? AMBER : "rgba(255,255,255,0.5)",
              border: `1px solid ${cleared ? `${AMBER}66` : "rgba(255,255,255,0.2)"}`,
            }}
          >
            {cleared ? "STATUS: CLEARED" : "STATUS: BYPASSED"}
          </span>
        </div>

        <div className="p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="font-mono-custom text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: AMBER }}>
              ◢ INTEL UNLOCKED
            </div>
            <div className="font-display text-3xl text-white mb-6">{SECTION_TITLES[section]}</div>
            <Body />
          </motion.div>

          <div className="mt-8 pt-5 border-t border-white/8 flex items-center justify-between">
            <div className="font-mono-custom text-[9px] text-white/25 tracking-widest uppercase">
              {cleared ? "Target neutralized · Intel decrypted" : "Stage bypassed · Intel released"}
            </div>
            <button
              onClick={onContinue}
              className="font-mono-custom text-xs tracking-widest uppercase px-6 py-3 transition hover:opacity-90"
              style={{ background: AMBER, color: "#080C12" }}
            >
              {isLast ? "VIEW DEBRIEF ▸" : "CONTINUE ▸"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
