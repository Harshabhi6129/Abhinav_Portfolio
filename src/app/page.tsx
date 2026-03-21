'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Mail, ExternalLink, FileText,
  ArrowRight, ChevronDown, X, Terminal, Zap, Globe
} from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Palette: Blue-black bg · Warm white text · Electric amber accent
// Fonts: Bebas-like via CSS · DM Mono body
// Shape: Angular, sharp, diagonal cuts, bento grid

// ─── DATA ─────────────────────────────────────────────────────────────────────
const DATA = {
  name: "ABHINAV K",
  nameShort: "AK",
  title: "Software Engineer",
  subtitle: "Backend Systems · Distributed Architecture · AI Engineering",
  email: "abhinavkuwork@gmail.com",
  phone: "(716) 319-4521",
  links: {
    github: "https://github.com/Harshabhi6129/",
    linkedin: "https://www.linkedin.com/in/abhinavku6129/",
    resume: "https://drive.google.com/file/d/14GU4ES4sRr4HspjUHnl2xBfZGtXolcAS/view",
    medium: "https://medium.com/@harsha6129abhi",
    research: "https://link.springer.com/chapter/10.1007/978-981-97-6318-4_28",
  },
  companies: [
    {
      id: "wf",
      role: "Software Engineer",
      org: "Wells Fargo",
      time: "May 2025 – Present",
      location: "CA, United States",
      color: "#C8102E",
      stack: ["Spring Boot", "Apache Kafka", "Oracle 19c", "Redis", "OpenShift", "Micrometer", "Grafana"],
      headline: "Risk Evaluation & Rule Management at scale — 2–3M daily transaction events",
      points: [
        "Led Risk Evaluation and Rule Management microservices processing 2–3M daily transaction events via Spring Boot, Spring Kafka, Oracle 19c, and Redis on OpenShift at sub-second SLA.",
        "Introduced Redis-backed rule metadata cache with PostgreSQL config store and atomic version-swap refresh to handle 300+ compliance rules, reducing p95 latency from 620ms → 340ms.",
        "Enforced write-path idempotency via composite unique constraints, JPA transactional boundaries, and manual offset commit to resolve duplicate Oracle audit records from Kafka at-least-once delivery, reducing replay defects 80%.",
        "Implemented graceful shutdown, partition-aware readiness probes, and Micrometer/Grafana lag dashboards for rolling OpenShift deployments across 24+ Kafka partitions, cutting deployment latency spikes 40%.",
      ],
      metrics: [
        { label: "Daily Events", value: "3M+" },
        { label: "Latency Cut", value: "45%" },
        { label: "Defects Reduced", value: "80%" },
        { label: "Kafka Partitions", value: "24+" },
      ],
    },
    {
      id: "ibm",
      role: "Software Developer",
      org: "IBM",
      time: "July 2021 – May 2024",
      location: "India",
      color: "#1F70C1",
      stack: ["Spring Boot", "Spring Cloud", "Kafka", "PostgreSQL", "MongoDB", "AWS EKS", "gRPC", "Docker", "K8s"],
      headline: "Provisioning Orchestrator automating 1,500+ sandbox environments annually",
      points: [
        "Built Provisioning Orchestrator and Access Governance services using Spring Boot, Kafka, PostgreSQL, MongoDB, and AWS EKS, automating 1,500+ sandbox environments annually and reducing provisioning time from days to minutes.",
        "Enforced deterministic state machine in PostgreSQL with optimistic concurrency control and transactional Kafka task dispatch to handle concurrent AWS failures, reducing manual remediation 60%.",
        "Offloaded synchronous AWS SDK calls to partition-keyed Kafka workers with MongoDB execution tracking and idempotent IAM operations, improving provisioning success rates 30%.",
        "Enforced Spring Security OAuth2, JWT validation, Hibernate tenant-scoped filters, and AWS SDK expiration sweeps, reducing unauthorized access incidents 70%.",
        "Extracted Access Governance with gRPC internal validation, Kafka eventual consistency, and Kubernetes Ingress rate limiting from a monolith, reducing deployment blast radius 40%.",
        "Instrumented Micrometer timers per AWS operation and wired SNS/SQS failure fan-out for better observability, reducing MTTR 45%.",
        "Introduced Testcontainers-based PostgreSQL and Kafka integration tests in Jenkins CI, reducing release defects 50%.",
      ],
      metrics: [
        { label: "Envs Automated", value: "1,500+" },
        { label: "Access Incidents ↓", value: "70%" },
        { label: "MTTR Reduction", value: "45%" },
        { label: "Release Defects ↓", value: "50%" },
      ],
    },
  ],
  skillBento: [
    { label: "Java", size: "lg", group: "lang" },
    { label: "Spring Boot", size: "lg", group: "framework" },
    { label: "Apache Kafka", size: "lg", group: "infra" },
    { label: "AWS", size: "lg", group: "cloud" },
    { label: "Python", size: "md", group: "lang" },
    { label: "React.js", size: "md", group: "framework" },
    { label: "Kubernetes", size: "md", group: "infra" },
    { label: "PostgreSQL", size: "md", group: "db" },
    { label: "Docker", size: "md", group: "infra" },
    { label: "Redis", size: "sm", group: "db" },
    { label: "MongoDB", size: "sm", group: "db" },
    { label: "gRPC", size: "sm", group: "framework" },
    { label: "OAuth2 / JWT", size: "sm", group: "security" },
    { label: "Microservices", size: "sm", group: "arch" },
    { label: "Spring Security", size: "sm", group: "security" },
    { label: "FastAPI", size: "sm", group: "framework" },
    { label: "Node.js", size: "sm", group: "framework" },
    { label: "TypeScript", size: "sm", group: "lang" },
    { label: "Terraform", size: "sm", group: "infra" },
    { label: "Prometheus", size: "sm", group: "obs" },
    { label: "Grafana", size: "sm", group: "obs" },
    { label: "OpenShift", size: "sm", group: "infra" },
    { label: "LLM / HuggingFace", size: "sm", group: "ai" },
    { label: "PyTorch", size: "sm", group: "ai" },
  ],
  skillCategories: [
    { name: "Programming", items: ["Java", "Python", "TypeScript", "Go", "SQL", "C/C++"] },
    { name: "Frameworks", items: ["Spring Boot", "Spring Cloud", "Spring WebFlux", "Spring Batch", "React.js", "Node.js", "FastAPI", "GraphQL"] },
    { name: "Databases", items: ["PostgreSQL", "Oracle DB", "MySQL", "MongoDB", "DynamoDB", "Cassandra"] },
    { name: "Messaging & Cache", items: ["Apache Kafka", "RabbitMQ", "AWS SQS/SNS", "Redis"] },
    { name: "Cloud", items: ["AWS (EC2, S3, RDS, Lambda, EKS, IAM, CloudWatch)", "Azure DevOps", "GCP", "OpenShift"] },
    { name: "Observability", items: ["Prometheus", "Grafana", "Micrometer", "ELK Stack", "Splunk"] },
    { name: "DevOps", items: ["Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions", "Maven"] },
    { name: "Security", items: ["OAuth2", "JWT", "RBAC", "Spring Security", "AWS IAM"] },
    { name: "AI / ML", items: ["PyTorch", "HuggingFace", "OpenAI API", "LangChain", "ChromaDB"] },
    { name: "Testing", items: ["JUnit 5", "Mockito", "Testcontainers", "Jest", "Cucumber"] },
  ],
  featuredProjects: [
    {
      id: "jobgenie",
      title: "Job Genie",
      blurb: "AI-powered talent acquisition platform. Parses JDs and ranks candidates using NLP + ML — reduces sourcing time by 80%.",
      tools: ["React.js", "FastAPI", "TensorFlow", "OpenAI", "PostgreSQL", "Docker"],
      code: "https://github.com/Harshabhi6129/Job-Genie",
      accent: "#F5A623",
    },
    {
      id: "medilink",
      title: "MediLink",
      blurb: "Production-grade collaborative clinical network. Doctors share cases, access AI insights, and democratize medical knowledge.",
      tools: ["React", "TypeScript", "Tailwind CSS", "System Design"],
      code: "https://github.com/Harshabhi6129/MediLink",
      demo: "https://medilink-rust.vercel.app/",
      accent: "#00E5A0",
    },
    {
      id: "nocode",
      title: "No-Code ML Platform",
      blurb: "Automated ML fine-tuning and model recommendation. Orchestrates distributed GPU-backed training workloads — reduces setup time by 50%.",
      tools: ["FastAPI", "PyTorch", "HuggingFace", "Google Gemini", "DynamoDB", "S3", "Docker", "AWS EC2", "React", "WebSockets"],
      accent: "#7C6EFA",
    },
  ],
  moreProjects: [
    {
      title: "Prompt Refinement & AI Chat",
      blurb: "Full-stack prompt designer with real-time chat, MongoDB storage, and document parsing.",
      tools: ["React", "Node.js", "MongoDB", "OpenAI"],
    },
    {
      title: "PINTOS OS Development",
      blurb: "Enhanced Pintos (C, x86) with priority donation, MLFQ, sync primitives. 90%+ test coverage.",
      tools: ["C", "x86 Assembly"],
    },
    {
      title: "Sentiment Analysis",
      blurb: "Airline tweet classifier with 84.6% accuracy. TF-IDF, SMOTE, sarcasm detection.",
      tools: ["Python", "NLP", "ML"],
      code: "https://github.com/Harshabhi6129/Sentiment-Analysis-with-Tone-Detection",
    },
    {
      title: "Real-Time AI Virtual Mouse",
      blurb: "Hands-free cursor control via CV + DL. Gesture recognition and virtual keyboard.",
      tools: ["Python", "OpenCV", "Deep Learning"],
      code: "https://github.com/Harshabhi6129/Real-Time-AI-Virtual-Mouse-System-Using-Deep-Learning",
    },
    {
      title: "Persona AI",
      blurb: "Conversational agent with memory + ChromaDB context retrieval and adaptive tone.",
      tools: ["OpenAI", "ChromaDB", "Streamlit"],
      code: "https://github.com/Harshabhi6129/Persona_AI",
    },
    {
      title: "Next-Word Prediction (LSTM-GRU)",
      blurb: "Sequence model demo with Streamlit interface.",
      tools: ["Python", "LSTM", "GRU"],
      code: "https://github.com/Harshabhi6129/Next-Word-Prediction-using-LSTM-GRU",
    },
  ],
  certifications: [
    {
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issued: "Mar 2024",
      expires: "Mar 2027",
      link: "#",
      tier: "gold",
    },
    {
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      issued: "Feb 2024",
      expires: "Feb 2027",
      link: "#",
      tier: "gold",
    },
    {
      title: "AWS Certified ML Engineer – Associate",
      issuer: "Amazon Web Services",
      issued: "May 2025",
      expires: "May 2028",
      link: "https://www.credly.com/badges/481a3796-1871-4387-8933-3351381f80af/linked_in_profile",
      tier: "gold",
    },
    {
      title: "Career Essentials in Generative AI",
      issuer: "Microsoft & LinkedIn",
      issued: "Sep 2024",
      link: "https://www.linkedin.com/learning/certificates/868ae44056adbc0bf99c92c394ec3d1187d484883cc00c6758d689658bbf46d7",
      tier: "silver",
    },
    {
      title: "BCG — GenAI",
      issuer: "BCG X",
      issued: "Jan 2025",
      link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/SKZxezskWgmFjRvj9/gabev3vXhuACr48eb_SKZxezskWgmFjRvj9_o9Qv8ETNTrDdS37xy_1736139681637_completion_certificate.pdf",
      tier: "silver",
    },
    {
      title: "Tata Group — Data Visualisation",
      issuer: "Tata Group",
      issued: "Jan 2025",
      link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/ifobHAoMjQs9s6bKS/MyXvBcppsW2FkNYCX_ifobHAoMjQs9s6bKS_o9Qv8ETNTrDdS37xy_1737607135331_completion_certificate.pdf",
      tier: "silver",
    },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const groupColors: Record<string, string> = {
  lang: "#F5A623",
  framework: "#00D4FF",
  infra: "#7C6EFA",
  cloud: "#FF6B6B",
  db: "#00E5A0",
  security: "#FFB347",
  arch: "#C084FC",
  obs: "#34D399",
  ai: "#F472B6",
};

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const step = target / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(Math.floor(cur));
      if (cur >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target, duration, start]);
  return count;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// Scanline removed — was hurting text readability

// Section label chip
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span
        className="font-mono text-xs tracking-[0.3em] uppercase px-2 py-1"
        style={{ color: "#F5A623", border: "1px solid #F5A62344", background: "#F5A62308" }}
      >
        {number}
      </span>
      <span className="font-mono text-xs tracking-[0.25em] uppercase text-white/40">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

// Animated metric
function Metric({ value, label, inView }: { value: string; label: string; inView: boolean }) {
  const isNum = /^\d+/.test(value);
  const num = isNum ? parseInt(value.replace(/\D/g, ""), 10) : 0;
  const suffix = isNum ? value.replace(/^\d+/, "") : value;
  const counted = useCountUp(num, 1200, inView && isNum);

  return (
    <div className="text-center">
      <div className="font-mono text-2xl font-bold" style={{ color: "#F5A623" }}>
        {isNum ? `${counted}${suffix}` : value}
      </div>
      <div className="text-xs text-white/50 mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}

// Company Modal
function CompanyModal({ company, onClose }: { company: typeof DATA.companies[0]; onClose: () => void }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setInView(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#080C12]/80 backdrop-blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        style={{
          background: "#0E1118",
          border: `1px solid ${company.color}44`,
          boxShadow: `0 0 80px ${company.color}22, 0 0 0 1px ${company.color}22`,
        }}
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10" style={{ background: `${company.color}18` }}>
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="ml-3 font-mono text-xs text-white/40 flex-1 text-center">
            {company.org.toLowerCase().replace(/\s/g, "-")}.session
          </span>
          <button onClick={onClose} className="text-white/30 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: company.color }}>
                {company.time} · {company.location}
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                {company.org}
              </h2>
              <p className="text-white/60 mt-1">{company.role}</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-8 p-4 border-l-2" style={{ borderColor: company.color, background: `${company.color}08` }}>
            <p className="text-white/80 font-medium">{company.headline}</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-8 p-5 border border-white/10" style={{ background: "#080C12" }}>
            {company.metrics.map(m => (
              <Metric key={m.label} value={m.value} label={m.label} inView={inView} />
            ))}
          </div>

          {/* Stack */}
          <div className="mb-8">
            <div className="font-mono text-xs text-white/40 tracking-widest uppercase mb-3">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {company.stack.map(s => (
                <span key={s} className="font-mono text-xs px-2 py-1 border border-white/15 text-white/70">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="font-mono text-xs text-white/40 tracking-widest uppercase mb-4">Achievements</div>
            <ul className="space-y-3">
              {company.points.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex gap-3 text-sm text-white/75 leading-relaxed"
                >
                  <span className="font-mono text-xs mt-0.5 flex-none" style={{ color: company.color }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {p}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── SECTION ROADMAP (left-side sticky rail) ──────────────────────────────────

const NAV_SECTIONS = [
  { id: "home",          label: "Home",         num: "—"  },
  { id: "about",         label: "About",        num: "00" },
  { id: "experience",    label: "Experience",   num: "01" },
  { id: "skills",        label: "Skills",       num: "02" },
  { id: "education",     label: "Education",    num: "03" },
  { id: "projects",      label: "Projects",     num: "04" },
  { id: "certifications",label: "Certs",        num: "05" },
  { id: "research",      label: "Research",     num: "06" },
  { id: "writing",       label: "Writing",      num: "07" },
  { id: "contact",       label: "Contact",      num: "08" },
];

function SectionRoadmap() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-1"
    >
      {/* Vertical line */}
      <div
        className="absolute left-[9px] top-0 bottom-0 w-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />

      {NAV_SECTIONS.map(({ id, label, num }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className="group relative flex items-center gap-3"
            style={{ paddingLeft: "24px" }}
          >
            {/* Dot */}
            <span
              className="absolute left-0 flex items-center justify-center"
              style={{ width: 18, height: 18 }}
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  background: isActive ? "#F5A623" : "rgba(255,255,255,0.2)",
                  boxShadow: isActive ? "0 0 8px #F5A623" : "none",
                }}
              />
            </span>

            {/* Label — slides in on hover / active */}
            <span
              className="font-mono-custom text-[10px] tracking-widest uppercase whitespace-nowrap transition-all duration-200"
              style={{
                color: isActive ? "#F5A623" : "rgba(255,255,255,0.25)",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateX(0)" : "translateX(-4px)",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 6 }}>{num}</span>
              {label}
            </span>

            {/* Show label on hover even if not active */}
            <style>{`
              a:hover > span:last-child {
                opacity: 1 !important;
                transform: translateX(0) !important;
                color: rgba(255,255,255,0.6) !important;
              }
            `}</style>
          </a>
        );
      })}
    </nav>
  );
}

// ─── BOTTOM QUICK-NAV BAR ─────────────────────────────────────────────────────

function BottomNavBar() {
  const [active, setActive] = useState("home");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling 200px
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Show all sections except "home" in the bottom bar
  const items = NAV_SECTIONS.filter(s => s.id !== "home");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="flex items-center gap-1 px-2 py-2"
            style={{
              background: "rgba(14,17,24,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.08)",
            }}
          >
            {items.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="relative font-mono-custom text-[10px] tracking-widest uppercase px-3 py-1.5 transition-all duration-200"
                  style={{
                    color: isActive ? "#080C12" : "rgba(255,255,255,0.4)",
                    background: isActive ? "#F5A623" : "transparent",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [selectedCompany, setSelectedCompany] = useState<typeof DATA.companies[0] | null>(null);
  const [activeSkillGroup, setActiveSkillGroup] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const q = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: q }]);
    setChatLoading(true);

    try {
      const KB = `You are Abhinav K's AI assistant. Be concise (≤80 words), friendly, and accurate.
Abhinav K — MS CS, UB (2024-25). 4 yrs SWE experience.
Current: Software Engineer @ Wells Fargo (May 2025-present) — Risk microservices, Kafka, Spring Boot, Oracle 19c, OpenShift.
Past: Software Developer @ IBM (2021-2024) — Provisioning Orchestrator, AWS EKS, Spring Boot, gRPC.
Top Skills: Java, Spring Boot, Kafka, AWS, Kubernetes, PostgreSQL, MongoDB, Redis, Python, React, FastAPI, Docker, gRPC, OAuth2.
Education: MS CS @ University at Buffalo.
Certs: AWS Solutions Architect, AWS Developer, AWS ML Engineer, Microsoft GenAI.
Projects: Job Genie (AI recruitment), MediLink (clinical network), No-Code ML Platform (GPU training), Persona AI (conversational agent).
Contact: abhinavkuwork@gmail.com | linkedin.com/in/abhinavku6129`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, knowledgeBase: KB }),
      });
      const data = await res.json();
      const answer =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.text ||
        "I couldn't generate a response. Try again!";
      setChatMessages(prev => [...prev, { role: "ai", text: answer }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "ai", text: "Something went wrong. Please try again!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;700&display=swap');

        :root {
          --bg: #12141D;
          --surface: #0E1118;
          --border: rgba(255,255,255,0.08);
          --text: #E8E4DC;
          --muted: rgba(232,228,220,0.45);
          --amber: #F5A623;
          --amber-dim: rgba(245,166,35,0.12);
        }

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          cursor: none;
        }

        ::selection { background: var(--amber); color: #000; }

        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }

        /* All interactive elements also hide system cursor */
        a, button, input, textarea { cursor: none; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--amber); }

        /* Clip-path decorations */
        .clip-top { clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%); }
        .clip-bottom { clip-path: polygon(0 0, 100% 0, 100% 95%, 0 100%); }

        /* Bento tile hover */
        .bento-tile:hover {
          border-color: var(--amber) !important;
          background: var(--amber-dim) !important;
        }

        /* Glitch effect on hero name */
        @keyframes glitch {
          0%, 100% { clip-path: none; transform: none; }
          20% { clip-path: polygon(0 20%, 100% 20%, 100% 21%, 0 21%); transform: translate(-2px, 0); }
          21% { clip-path: none; transform: none; }
          60% { clip-path: polygon(0 65%, 100% 65%, 100% 70%, 0 70%); transform: translate(2px, 0); }
          61% { clip-path: none; transform: none; }
        }

        .glitch { position: relative; }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: inherit;
          color: inherit;
        }
        .glitch::before {
          color: #0ff;
          animation: glitch 4s infinite;
          clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
        }
        .glitch::after {
          color: #f0f;
          animation: glitch 4s infinite 0.1s;
          clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%);
        }

        /* Progress bar */
        #progress { position: fixed; top: 0; left: 0; height: 2px; background: var(--amber); z-index: 10000; transition: width 0.1s; }

        /* Amber underline animate */
        @keyframes expand { from { width: 0; } to { width: 100%; } }
        .amber-underline::after {
          content: '';
          display: block;
          height: 4px;
          background: var(--amber);
          animation: expand 0.8s 0.5s ease-out both;
        }

        /* Card hover lift */
        .lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .lift:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(245,166,35,0.12); }

        /* Animated ambient blobs */
        @keyframes blobDrift1 {
          0%,100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(-60px, 80px) scale(1.08); }
          66%      { transform: translate(40px, -50px) scale(0.94); }
        }
        @keyframes blobDrift2 {
          0%,100% { transform: translate(0, 0) scale(1); }
          40%      { transform: translate(70px, -60px) scale(1.1); }
          70%      { transform: translate(-30px, 40px) scale(0.92); }
        }
        @keyframes blobPulse {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.3); opacity: 0.6; }
        }
      `}</style>
      
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Progress Bar */}
      <ScrollProgress />

      {/* Section roadmap — left-side sticky dots */}
      <SectionRoadmap />

      {/* Bottom quick-nav bar */}
      <BottomNavBar />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5" style={{ background: "rgba(8,12,18,0.92)", backdropFilter: "blur(12px)" }}>
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          {/* Logo — AK·23 */}
          <a href="#home" className="flex items-center gap-3 group" title="AK · Abhinav Kusampudi">
            <div className="flex items-center" style={{ gap: 0 }}>
              {/* AK block */}
              <div
                className="flex items-center justify-center font-mono-custom font-bold text-sm h-9 px-2.5"
                style={{ background: "#F5A623", color: "#080C12", letterSpacing: "0.05em" }}
              >
                AK
              </div>
              {/* Barrel connector line */}
              <div style={{ width: 12, height: 3, background: "#F5A623", marginTop: 0, alignSelf: "center" }} />
              {/* 23 block */}
              <div
                className="flex items-center justify-center font-mono-custom font-bold text-xs h-9 px-2"
                style={{
                  background: "transparent",
                  color: "#F5A623",
                  border: "1px solid #F5A62366",
                  letterSpacing: "0.08em",
                }}
              >
                23
              </div>
            </div>
          </a>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              ["About", "#about"],
              ["Skills", "#skills"],
              ["Experience", "#experience"],
              ["Education", "#education"],
              ["Projects", "#projects"],
              ["Certs", "#certifications"],
              ["Research", "#research"],
              ["Writing", "#writing"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="font-mono-custom text-xs tracking-widest uppercase px-3 py-2 text-white/40 hover:text-white transition"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <a href={DATA.links.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition p-1">
              <Github className="w-4 h-4" />
            </a>
            <a href={DATA.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition p-1">
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={DATA.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-custom text-xs tracking-widest uppercase px-4 py-2 transition"
              style={{ background: "#F5A623", color: "#080C12" }}
            >
              Resume
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header id="home" ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
        {/* Animated ambient blobs — no lines, pure glow */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Amber — top right, slow drift */}
          <div
            className="absolute rounded-full"
            style={{
              width: 700, height: 700,
              top: "-15%", right: "-10%",
              background: "radial-gradient(circle, rgba(245,166,35,0.13) 0%, transparent 70%)",
              animation: "blobDrift1 18s ease-in-out infinite",
              filter: "blur(40px)",
            }}
          />
          {/* Deep blue — bottom left */}
          <div
            className="absolute rounded-full"
            style={{
              width: 600, height: 600,
              bottom: "-10%", left: "-8%",
              background: "radial-gradient(circle, rgba(31,112,193,0.12) 0%, transparent 70%)",
              animation: "blobDrift2 22s ease-in-out infinite",
              filter: "blur(50px)",
            }}
          />
          {/* Faint amber — center, pulsing */}
          <div
            className="absolute rounded-full"
            style={{
              width: 400, height: 400,
              top: "40%", left: "45%",
              background: "radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 65%)",
              animation: "blobPulse 10s ease-in-out infinite",
              filter: "blur(60px)",
            }}
          />
        </div>

        {/* Ghost AK-47 — sits outside overflow-hidden so it's fully visible */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <AK47Ghost />
        </div>

        {/* Bottom fade to next section */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #080C12)", zIndex: 3 }}
        />

        {/* Ammo counter — top-right corner of hero */}
        <div
          aria-hidden
          className="absolute top-24 right-6 font-mono-custom text-xs text-white/15 text-right select-none pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <div className="text-[10px] tracking-widest uppercase mb-1">AMMO</div>
          <div className="font-display text-4xl" style={{ color: "rgba(245,166,35,0.2)", fontFamily: "'Bebas Neue',sans-serif" }}>
            AK·47
          </div>
          <div className="text-[10px] tracking-[0.3em] mt-1">7.62×39mm</div>
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-7xl px-6 py-20 w-full"
        >
          {/* Status chip */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 font-mono-custom text-xs tracking-widest uppercase mb-10"
            style={{ color: "#F5A623", border: "1px solid #F5A62344", padding: "6px 14px", background: "#F5A62308" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-pulse" />
            Open to Opportunities · Software Engineer
          </motion.div>

          {/* Name — massive display type */}
          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display glitch text-white leading-none"
              data-text={DATA.name}
              style={{
                fontSize: "clamp(64px, 14vw, 200px)",
                letterSpacing: "-0.01em",
              }}
            >
              {DATA.name}
            </motion.h1>
          </div>

          {/* Amber underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-1 mb-8"
            style={{ background: "#F5A623", maxWidth: "60%" }}
          />

          {/* Subtitle row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16"
          >
            <div>
              <p className="font-mono-custom text-white/60 text-sm tracking-[0.15em] uppercase mb-2">
                {DATA.subtitle}
              </p>
              <p className="text-white/50 text-sm max-w-md leading-relaxed">
                4 years building mission-critical systems at IBM & Wells Fargo. MS CS @ University at Buffalo.
                Obsessed with correctness, throughput, and making complex systems feel simple.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 md:gap-12">
              {[
                { v: "4+", l: "Years" },
                { v: "2", l: "Companies" },
                { v: "3M+", l: "Events/day" },
              ].map(s => (
                <div key={s.l}>
                  <div className="font-display text-5xl" style={{ color: "#F5A623" }}>{s.v}</div>
                  <div className="font-mono-custom text-xs text-white/40 uppercase tracking-widest">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-wrap gap-4 mt-12"
          >
            <a
              href="#experience"
              className="inline-flex items-center gap-2 font-mono-custom text-sm tracking-widest uppercase px-6 py-3 lift"
              style={{ background: "#F5A623", color: "#080C12" }}
            >
              View Work <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${DATA.email}`}
              className="inline-flex items-center gap-2 font-mono-custom text-xs tracking-widest uppercase px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition lift"
            >
              <Mail className="w-4 h-4" /> Get in Touch
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
          <span className="font-mono-custom text-xs text-white/20 tracking-widest uppercase">Scroll</span>
        </motion.div>
      </header>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section id="about" className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel number="00" label="About" />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-display text-6xl md:text-7xl text-white mb-6 leading-none">
                BUILDING<br />
                <span style={{ color: "#F5A623" }}>SYSTEMS</span><br />
                THAT SCALE
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                Software Engineer with 4 years of experience designing and deploying scalable backend and distributed systems across
                financial services and cloud infrastructure.
              </p>
              <p className="text-white/60 leading-relaxed">
                Proficient in Java and the Spring ecosystem, building event-driven Kafka pipelines, enforcing OAuth2/JWT security,
                optimizing relational and NoSQL databases, and operating containerized services on AWS and OpenShift with
                Prometheus/Grafana observability and CI/CD automation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4"
            >
              {[
                { icon: <Terminal className="w-4 h-4" />, label: "Current", value: "SWE @ Wells Fargo", sub: "Risk microservices · OpenShift" },
                { icon: <Globe className="w-4 h-4" />, label: "Education", value: "MS CS · UB", sub: "Graduating Dec 2025" },
                { icon: <Zap className="w-4 h-4" />, label: "Focus", value: "Distributed Systems", sub: "Kafka · Spring · AWS" },
                { icon: <Mail className="w-4 h-4" />, label: "Contact", value: DATA.email, sub: DATA.phone },
              ].map(row => (
                <div
                  key={row.label}
                  className="flex items-center gap-4 p-4 border border-white/8"
                  style={{ background: "#0E1118" }}
                >
                  <div className="w-8 h-8 flex items-center justify-center border border-white/10 flex-none" style={{ color: "#F5A623" }}>
                    {row.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono-custom text-xs text-white/40 tracking-widest uppercase">{row.label}</div>
                    <div className="text-white text-sm font-medium truncate">{row.value}</div>
                  </div>
                  <div className="font-mono-custom text-xs text-white/30 text-right">{row.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ────────────────────────────────────────────── */}
      <section id="experience" className="py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel number="01" label="Experience" />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-display text-5xl md:text-6xl text-white mb-8 leading-none">
                CHRONOLOGY<br />
                <span style={{ color: "#F5A623" }}>OF DEPLOYMENTS</span>
              </h3>
              <p className="text-white/50 text-sm max-w-md leading-relaxed mb-12">
                Mission-critical systems engineering. Click a deployment to view the tactical breakdown, stack details, and impact metrics.
              </p>

              {/* Timeline */}
              <div className="space-y-4">
                {DATA.companies.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedCompany(c)}
                    className="group relative flex items-center justify-between p-6 border border-white/8 hover:border-white/20 transition-all cursor-none overflow-hidden"
                    style={{ background: "#0E1118" }}
                  >
                    {/* Hover bg color */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none"
                      style={{ background: c.color }}
                    />
                    
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="font-display text-4xl opacity-10 group-hover:opacity-20 transition" style={{ color: c.color }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div className="font-mono-custom text-[10px] tracking-widest uppercase mb-1" style={{ color: c.color }}>
                          {c.time}
                        </div>
                        <h4 className="text-xl font-bold text-white tracking-tight">{c.org}</h4>
                        <div className="text-white/40 text-xs tracking-wider uppercase mt-1">{c.role}</div>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <div
                        className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-white/40 group-hover:bg-white/5 transition"
                      >
                        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual element for experience — tactical readout */}
            <div className="hidden md:flex flex-col justify-center">
              <div className="relative p-8 border border-white/5" style={{ background: "rgba(255,255,255,0.01)" }}>
                {/* Corner caps */}
                <div className="absolute top-0 left-0 w-8 h-px bg-[#F5A62344]" />
                <div className="absolute top-0 left-0 w-px h-8 bg-[#F5A62344]" />
                <div className="absolute bottom-0 right-0 w-8 h-px bg-[#F5A62344]" />
                <div className="absolute bottom-0 right-0 w-px h-8 bg-[#F5A62344]" />

                <div className="font-mono-custom text-[10px] text-white/20 tracking-[0.4em] uppercase mb-8">System Status: Optimal</div>
                
                <div className="space-y-6">
                  {[
                    { label: "High Throughput", val: "3M+ Daily Trans", color: "#F5A623" },
                    { label: "Low Latency", val: "340ms p95", color: "#00D4FF" },
                    { label: "High Availability", val: "99.9% Uptime", color: "#00E5A0" },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-[10px] mb-2">
                        <span className="text-white/40 uppercase tracking-widest">{stat.label}</span>
                        <span style={{ color: stat.color }}>{stat.val}</span>
                      </div>
                      <div className="h-1 bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full"
                          style={{ background: stat.color, filter: `drop-shadow(0 0 4px ${stat.color}66)` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border border-white/5">
                    <div className="text-2xl font-bold text-white">4+</div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest">Yrs Experience</div>
                  </div>
                  <div className="text-center p-4 border border-white/5">
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest">SLA Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ─────────────────────────────────────────────────── */}
      <section id="skills" className="py-28 bg-[#0E1118] clip-top clip-bottom">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel number="02" label="Weaponry" />
          
          <div className="mb-16">
            <h2 className="font-display text-6xl md:text-7xl text-white mb-6 leading-none">
              TACTICAL<br />
              <span style={{ color: "#F5A623" }}>TOOLKIT</span>
            </h2>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed">
              The primary stack I use to build scalable architecture. Sorted by group—hover a tag to highlight related weaponry.
            </p>
          </div>

          {/* Group Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/5">
            <button
              onClick={() => setActiveSkillGroup(null)}
              className="font-mono-custom text-[10px] tracking-widest uppercase px-4 py-2 transition"
              style={{
                background: activeSkillGroup === null ? "#F5A623" : "transparent",
                color: activeSkillGroup === null ? "#080C12" : "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              All
            </button>
            {DATA.skillCategories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveSkillGroup(cat.name)}
                className="font-mono-custom text-[10px] tracking-widest uppercase px-4 py-2 transition"
                style={{
                  background: activeSkillGroup === cat.name ? "#F5A623" : "transparent",
                  color: activeSkillGroup === cat.name ? "#080C12" : "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {DATA.skillBento
              .filter(skill => {
                if (!activeSkillGroup) return true;
                const category = DATA.skillCategories.find(c => c.name === activeSkillGroup);
                return category?.items.includes(skill.label);
              })
              .map((skill, idx) => {
                return (
                  <motion.div
                    key={skill.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.02, duration: 0.4 }}
                    className="bento-tile group relative overflow-hidden p-5 border border-white/8 transition-all duration-300"
                    style={{
                      background: "#080C12",
                      gridColumn: skill.size === "lg" ? "span 1" : "auto"
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                      style={{ background: groupColors[skill.group] }}
                    />
                    <div className="font-mono-custom text-[10px] text-white/20 tracking-[0.2em] uppercase mb-2">
                      {skill.group}
                    </div>
                    <div className="text-white font-bold tracking-tight text-lg group-hover:translate-x-1 transition-transform">
                      {skill.label}
                    </div>
                    
                    {/* Background marker code highlight */}
                    <div className="absolute -bottom-2 -right-2 font-mono-custom text-[32px] font-black opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.07] transition">
                      {skill.label.substring(0, 2).toUpperCase()}
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ──────────────────────────────────────────────── */}
      <section id="education" className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <SectionLabel number="03" label="Training" />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block relative p-12 overflow-hidden border border-white/10"
            style={{ background: "#0E1118", maxWidth: "800px" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5A623]" />
            
            <div className="font-mono-custom text-amber-500 text-xs tracking-widest uppercase mb-4">Master of Science</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-2 leading-tight">UNIVERSITY AT BUFFALO</h2>
            <div className="text-white/50 font-mono-custom tracking-widest uppercase mb-8">Computer Science · GPA 3.7 / 4.0</div>
            
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-8">
              <div className="text-left">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Location</div>
                <div className="text-white/80">New York, USA</div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Duration</div>
                <div className="text-white/80">Aug 2024 – Dec 2025</div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Specialization</div>
              <div className="flex flex-wrap justify-center gap-2">
                {["Distributed Systems", "Cloud Computing", "AI Systems", "OS Development", "Data Engineering"].map(s => (
                  <span key={s} className="px-3 py-1 border border-white/10 text-white/60 text-xs font-mono-custom uppercase tracking-wider">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            
            {/* UB Logo ghost (faint) */}
            <div className="absolute -bottom-10 -right-10 font-black text-[120px] text-white/[0.02] select-none pointer-events-none">UB</div>
          </motion.div>
        </div>
      </section>

      {/* ── PROJECTS ───────────────────────────────────────────────── */}
      <section id="projects" className="py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel number="04" label="Arsenal" />
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2">
              <h2 className="font-display text-6xl md:text-8xl text-white mb-6 leading-none">
                DEPLOYED<br />
                <span style={{ color: "#F5A623" }}>SOLUTIONS</span>
              </h2>
            </div>
            <div className="flex items-end justify-end">
              <p className="text-white/40 text-sm max-w-xs text-right leading-relaxed font-mono-custom uppercase tracking-wider">
                Experimental & Production-grade repositories.
              </p>
            </div>
          </div>

          {/* Featured Projects Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {DATA.featuredProjects.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative flex flex-col p-8 border border-white/8 hover:border-white/20 transition-all lift"
                style={{ background: "#0E1118" }}
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none"
                  style={{ background: p.accent }}
                />
                
                <div className="font-mono-custom text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: p.accent }}>
                  {p.id}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:translate-x-1 transition-transform">
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8 flex-1">
                  {p.blurb}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {p.tools.slice(0, 4).map(t => (
                    <span key={t} className="font-mono-custom text-[10px] px-2 py-0.5 border border-white/10 text-white/30 uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <div className="flex-1" />
                  <a href={p.code || "#"} className="font-mono-custom text-[10px] tracking-widest uppercase text-white/40 hover:text-white transition">
                    View Specs
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* More Projects List */}
          <div className="border-t border-white/5 pt-12">
            <h3 className="font-mono-custom text-xs text-white/20 tracking-[0.4em] uppercase mb-8">Secondary Arsenal</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DATA.moreProjects.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 border border-white/5 hover:border-white/10 hover:bg-white/[0.01] transition-colors flex flex-col group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-bold text-white/80 group-hover:text-white transition">{p.title}</h4>
                    {p.code && (
                      <a href={p.code} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1">{p.blurb}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tools.map(t => (
                      <span key={t} className="text-[9px] font-mono-custom text-white/20 uppercase tracking-widest">{t}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ────────────────────────────────────────── */}
      <section id="certifications" className="py-28 bg-[#0E1118]">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel number="05" label="Credentials" />
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-display text-6xl text-white mb-6 leading-none">
                VERIFIED<br />
                <span style={{ color: "#F5A623" }}>EXPERTISE</span>
              </h2>
              <p className="text-white/50 text-sm max-w-md leading-relaxed mb-10">
                Cloud architecture and AI engineering certifications from AWS, Microsoft, and industry leaders.
              </p>
              
              <div className="p-6 border-l-2 border-[#F5A623] bg-[#F5A62305]">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-4 h-4 text-[#F5A623]" />
                  <span className="font-mono-custom text-xs text-white uppercase tracking-widest">Current Focus</span>
                </div>
                <p className="text-sm text-white/60">Preparing for AWS Certified Security Specialty to deepen infrastructure hardening skills.</p>
              </div>
            </div>

            <div className="space-y-3">
              {DATA.certifications.map(c => (
                <a
                  key={c.title}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-5 border border-white/5 hover:border-white/20 transition-all bg-[#080C12]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-[#F5A62344] transition"
                    >
                      <FileText className="w-4 h-4 text-white/30 group-hover:text-[#F5A623] transition" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/80 group-hover:text-white transition">{c.title}</h4>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{c.issuer} · {c.issued}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/60 transition" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESEARCH ─────────────────────────────────────────────── */}
      <section id="research" className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel number="06" label="R&D" />
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="font-display text-6xl text-white mb-6 leading-none">
                ACADEMIC<br />
                <span style={{ color: "#F5A623" }}>QUERIES</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                Publications and research focusing on edge computing, security, and cloud orchestrators.
              </p>
            </div>

            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 border border-white/8 hover:border-[#F5A62344] transition-colors bg-[#0E1118] relative group"
              >
                <div className="absolute top-0 right-0 p-4 font-mono-custom text-[10px] text-white/20 uppercase tracking-widest">Springer Nature · 2024</div>
                <div className="font-mono-custom text-amber-500 text-xs tracking-widest uppercase mb-4">Published Paper</div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight leading-snug">
                  Performance Evaluation & Optimization for Sustainable Crop Water Management • DoSCI-2024
                </h3>
                <p className="text-white/50 text-sm mb-8 leading-relaxed">
                  Performance evaluation and optimization of crop water management system based on IoT and Deep Learning. Published in Springer Nature, 2024.
                </p>
                <a
                  href={DATA.links.research}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono-custom text-xs tracking-widest uppercase py-2 border-b border-[#F5A623] text-white hover:text-[#F5A623] transition"
                >
                  Read Publication <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WRITING ──────────────────────────────────────────────── */}
      <section id="writing" className="py-28 bg-[#080C12] clip-top">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel number="07" label="Writing" />
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div>
              <h2 className="font-display text-7xl text-white leading-none mb-4">
                WRITING<br />
                <span style={{ color: "#F5A623" }}>LOGS</span>
              </h2>
              <p className="text-white/60 text-sm max-w-md leading-relaxed">
                Occasional notes on engineering, AI, and shipping well-crafted software. Posts are hosted on Medium.
              </p>
            </div>
            <a
              href={DATA.links.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-custom text-xs tracking-widest uppercase px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition lift"
            >
              Visit Medium
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                t: "Tech’s Biggest Frenemies: A Guide to the Co-opetition Circus", 
                d: "A guide to the absurd and hilarious world of tech giants collaborating while competing. Welcome to the co-opetition circus.",
                date: "Nov 16, 2025",
                read: "5 min read"
              },
              { 
                t: "When AI Forgets: The Curious Case of Context Overload", 
                d: "Exploring the challenges of context window limitations and how AI models behave when conversations drift.",
                date: "Jun 11, 2025",
                read: "4 min read"
              },
              { 
                t: "Deep Learning Model Evaluations and Validations: A Comprehensive Guide", 
                d: "Building a model is only half the battle. This guide covers the critical validation steps to ensure performance beyond training data.",
                date: "Feb 28, 2025",
                read: "8 min read"
              },
            ].map(post => (
              <div key={post.t} className="p-6 border border-white/5 hover:bg-white/[0.01] transition relative group">
                <div className="absolute top-4 right-6 text-white/10 group-hover:text-[#F5A62344] transition-colors"><ExternalLink className="w-4 h-4" /></div>
                <h4 className="text-lg font-bold text-white/90 mb-2 group-hover:text-white transition">{post.t}</h4>
                <p className="text-sm text-white/40 leading-relaxed mb-4">{post.d}</p>
                <div className="flex items-center gap-4 font-mono-custom text-[10px] text-white/20 uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span>{post.read}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────── */}
      <section id="contact" className="py-32 bg-[#0E1118]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <SectionLabel number="08" label="Comm-Link" />
          <h2 className="font-display text-7xl md:text-9xl text-white mb-8 leading-none">
            ESTABLISH<br />
            <span style={{ color: "#F5A623" }}>CONTACT</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            Looking for a Software Engineer who prioritizes system integrity and high-throughput architecture? Let's discuss your next deployment.
          </p>

          <div className="flex flex-col items-center gap-12">
            <a
              href={`mailto:${DATA.email}`}
              className="group relative inline-block p-10 border border-white/10 hover:border-[#F5A62344] transition-all lift overflow-hidden h-40 w-full max-w-md"
            >
              <div className="absolute top-4 right-6 font-mono-custom text-[10px] text-white/20 uppercase tracking-widest group-hover:text-[#F5A62344] transition">Email</div>
              <div className="text-white text-3xl font-bold tracking-tight mb-2 group-hover:scale-105 transition-transform">{DATA.email}</div>
              <div className="font-mono-custom text-amber-500 text-xs tracking-widest uppercase">Click to Dispatch</div>
              <div className="absolute -bottom-8 -right-8 font-display text-[120px] text-white/[0.02] select-none pointer-events-none transition group-hover:text-[#F5A62305]">@</div>
            </a>

            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: "LinkedIn", href: DATA.links.linkedin, icon: <Linkedin className="w-5 h-5" /> },
                { label: "GitHub", href: DATA.links.github, icon: <Github className="w-5 h-5" /> },
                { label: "Twitter", href: "#", icon: <Globe className="w-5 h-5" /> },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 border border-white/5 hover:border-white/20 text-white/40 hover:text-white transition lift h-16 w-48"
                >
                  {link.icon}
                  <span className="font-mono-custom text-xs tracking-widest uppercase">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-white/5 bg-[#080C12]">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="font-display text-4xl text-white/20 select-none">AK·47</div>
            <div className="text-[10px] font-mono-custom text-white/20 uppercase tracking-[0.3em] leading-relaxed">
              Designed for correctness.<br />
              Deployed Dec 2024.
            </div>
          </div>
          
          <div className="text-[10px] font-mono-custom text-white/15 uppercase tracking-[0.4em] text-center md:text-right">
            &copy; 2024 Abhinav Kusampudi. CC BY-NC 4.0.<br />
            Lat 42.8864° N, Long 78.8784° W
          </div>
        </div>
      </footer>

      {/* ── MODALS & FLOATING ─────────────────────────────────────── */}

      <AnimatePresence>
        {selectedCompany && (
          <CompanyModal
            company={selectedCompany}
            onClose={() => setSelectedCompany(null)}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 flex items-center justify-center transition-all lift"
        style={{
          background: "#F5A623",
          color: "#080C12",
          boxShadow: "0 0 40px rgba(245,166,35,0.4), inset 0 0 0 1px rgba(255,255,255,0.2)",
        }}
      >
        <Terminal className="w-6 h-6" />
      </button>

      {/* Chat Interface — Terminal Style */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 32 }}
            className="fixed bottom-24 right-6 z-[70] w-[400px] h-[500px] flex flex-col overflow-hidden shadow-2xl border border-[#F5A62344]"
            style={{ background: "#0E1118" }}
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: "#F5A62315" }}>
              <div className="flex gap-1.5 mr-2">
                <button onClick={() => setChatOpen(false)} className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="font-mono-custom text-[10px] text-[#F5A623] tracking-widest uppercase flex-1">
                SYSTEM_SHELL (AK-v47)
              </span>
              <button onClick={() => setChatOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono-custom text-xs scrollbar-hide">
              <div className="text-white/30 hidden sm:block">
                Authentication successful.<br />
                Initializing knowledge_base.db...<br />
                Ready for queries.
              </div>

              {chatMessages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-[#F5A623]" : "text-white/80"}>
                  <span className="opacity-40 mr-2">{m.role === "user" ? ">" : "AK_AI:"}</span>
                  {m.text}
                </div>
              ))}
              
              {chatLoading && (
                <div className="text-white/30 animate-pulse">
                  <span className="mr-2">AK_AI:</span> Processing query...
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleChat} className="p-4 bg-[#080C12] border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="font-mono-custom text-[#F5A623] text-sm font-bold animate-pulse">$</span>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask me anything about Abhinav..."
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono-custom text-xs placeholder:text-white/10"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── UTILITY COMPONENTS ────────────────────────────────────────────────────────

// 1. Interactive Cursor with Tactical Ring & Bullet Effects
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const [bullets, setBullets] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const playShot = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // 1. The Blast (White Noise)
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(3000, ctx.currentTime);
        noiseFilter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        // 2. The Recoil/Thump (Low-freq sine)
        const thump = ctx.createOscillator();
        const thumpGain = ctx.createGain();
        thump.type = 'sine';
        thump.frequency.setValueAtTime(120, ctx.currentTime);
        thump.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.08);
        
        thumpGain.gain.setValueAtTime(0.5, ctx.currentTime);
        thumpGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        
        thump.connect(thumpGain);
        thumpGain.connect(ctx.destination);

        noise.start();
        thump.start();
        noise.stop(ctx.currentTime + 0.12);
        thump.stop(ctx.currentTime + 0.12);
      } catch (e) {
        console.error("Audio error", e);
      }
    };

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const down = (e: MouseEvent) => {
      setClicking(true);
      playShot();
      // Spawn bullet hole
      const newId = Date.now();
      setBullets(prev => [...prev.slice(-10), { x: e.clientX, y: e.clientY, id: newId }]);
      // Repair hole after 5 seconds
      setTimeout(() => {
        setBullets(prev => prev.filter(b => b.id !== newId));
      }, 4500);
    };
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Bullet Holes — persistent on page during session */}
      {bullets.map(b => (
        <motion.div
          key={b.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          className="absolute w-4 h-4"
          style={{ left: b.x - 8, top: b.y - 8 }}
        >
          {/* Hole */}
          <div 
            className="w-full h-full rounded-full bg-[#000] border border-white/20" 
            style={{ 
              boxShadow: "0 0 12px rgba(0,0,0,0.9), inset 0 0 4px rgba(255,255,255,0.1)",
              filter: "drop-shadow(0 0 2px rgba(245,166,35,0.2))" 
            }} 
          />
          {/* Cracks */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 -rotate-45" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-white/20 rotate-12" />
        </motion.div>
      ))}

      {/* Cursor Dot */}
      <motion.div
        className="fixed w-1.5 h-1.5 rounded-full bg-[#F5A623] z-[10000]"
        animate={{ x: pos.x - 3, y: pos.y - 3, scale: clicking ? 2 : 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.1 }}
      />

      {/* Ring (Smooth lag) */}
      <motion.div
        className="fixed w-10 h-10 border border-[#F5A623] rounded-full z-[10000] flex items-center justify-center"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: clicking ? 0.8 : 1,
          opacity: 0.4,
          borderColor: clicking ? "#FF5F57" : "#F5A623"
        }}
        transition={{ type: "spring", damping: 20, stiffness: 120, mass: 0.5 }}
      >
        {/* Reticle Lines */}
        <div className="absolute top-0 h-2 w-px bg-[#F5A62366]" />
        <div className="absolute bottom-0 h-2 w-px bg-[#F5A62366]" />
        <div className="absolute left-0 w-2 h-px bg-[#F5A62366]" />
        <div className="absolute right-0 w-2 h-px bg-[#F5A62366]" />
      </motion.div>
    </div>
  );
}

// 2. Scroll Progress Bar (Top)
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return <motion.div id="progress" style={{ width }} />;
}

// 3. AK-47 Ghost SVG Background Decoration
function AK47Ghost() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl opacity-[0.02] mix-blend-screen pointer-events-none select-none overflow-visible">
       <svg viewBox="0 0 1000 400" className="w-full h-auto text-[#E8E4DC]">
        <path fill="currentColor" d="M100,200 L150,200 L180,180 L350,180 L350,170 L380,170 L380,180 L450,180 L450,165 L500,165 L500,180 L800,180 L810,195 L950,205 L950,225 L880,225 L880,350 L840,350 L820,225 L600,225 L580,380 L520,380 L520,225 L380,225 L380,280 L320,280 L320,225 L180,225 L100,250 Z" />
        {/* Simple geometric outline of an assault rifle for the 'ghost' feel */}
      </svg>
    </div>
  );
}
