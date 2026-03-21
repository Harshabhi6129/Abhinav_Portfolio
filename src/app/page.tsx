'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, FileText, Rocket, Cpu, Sparkles, ArrowRightCircle, GraduationCap, BookOpen, PenTool, Server, Brain, Award, Code2, Database, Cloud, Wrench } from "lucide-react";

// ---------- TYPES ----------
interface Certification {
  title: string;
  issuer: string;
  icon: string;
  issued?: string;
  expires?: string;
  credentialId?: string;
  link?: string;
}

// ---------- DATA ----------
const DATA = {
  name: "Abhinav K",
  motto: "Design • Build • Solve • Repeat",
  email: "abhinavkuwork@gmail.com",
  phone: "(716) 319-4521",
  location: "USA",
  links: {
    github: "https://github.com/Harshabhi6129/",
    linkedin: "https://www.linkedin.com/in/harsha-abhinav/",
    resume: "https://drive.google.com/file/d/14GU4ES4sRr4HspjUHnl2xBfZGtXolcAS/view",
    medium: "https://medium.com/@harsha6129abhi",
    research: "https://link.springer.com/chapter/10.1007/978-981-97-6318-4_28",
  },
  skills: [
    "Java", "Spring Boot", "React.js", "Node.js", "Python", "FastAPI", "Kafka", "Redis", "PostgreSQL", "MongoDB",
    "Docker", "Kubernetes", "AWS", "CI/CD", "gRPC", "OAuth2", "RBAC", "Microservices", "LLM Apps", "HuggingFace",
  ],
  skillCategories: [
    {
      category: "Programming",
      skills: ["Java", "Python", "JavaScript", "TypeScript", "Go", "SQL", "C/C++"],
    },
    {
      category: "Frameworks",
      skills: ["Spring Boot", "Spring Cloud", "Spring WebFlux", "Spring Batch", "Spring Actuator", "React.js", "Node.js", "Express", "GraphQL"],
    },
    {
      category: "Databases",
      skills: ["PostgreSQL", "Oracle DB", "MySQL", "MongoDB", "DynamoDB", "Cassandra"],
    },
    {
      category: "Messaging, Streaming & Cache",
      skills: ["Apache Kafka", "RabbitMQ", "AWS SQS/SNS", "Redis"],
    },
    {
      category: "Cloud",
      skills: ["AWS (EC2, S3, RDS, Lambda, EKS, IAM, CloudWatch, SNS, SQS)", "Azure (Azure DevOps)", "GCP", "OpenShift"],
    },
    {
      category: "Observability",
      skills: ["Prometheus", "Grafana", "Micrometer", "AWS CloudWatch", "ELK Stack", "Splunk"],
    },
    {
      category: "Security",
      skills: ["OAuth2", "JWT", "RBAC", "AWS IAM"],
    },
    {
      category: "DevOps & Infrastructure",
      skills: ["Docker", "Kubernetes", "Terraform", "Jenkins", "Git", "Maven", "Gradle", "Linux", "Bash", "Postman", "JMeter", "Jira"],
    },
    {
      category: "Testing",
      skills: ["JUnit", "Mockito", "Testcontainers", "Jest", "Cucumber"],
    },
    {
      category: "Methodologies",
      skills: ["Agile", "Scrum", "System Design", "Event-Driven Architecture", "Microservices", "CI/CD"],
    },
  ],
  projects: [
    {
      title: "Job Genie",
      blurb: "AI-powered talent acquisition platform that transforms recruitment by parsing job descriptions and ranking candidates with NLP and ML, reducing sourcing time by 80%.",
      tools: ["React.js", "FastAPI", "TensorFlow", "OpenAI", "PostgreSQL", "Docker"],
      code: "https://github.com/Harshabhi6129/Job-Genie",
    },
    {
      title: "MediLink",
      blurb: "A production-grade frontend prototype for a collaborative clinical network, enabling doctors to share cases, access AI insights, and democratize medical knowledge.",
      tools: ["React", "TypeScript", "Tailwind CSS", "UI/UX", "System Design"],
      code: "https://github.com/Harshabhi6129/MediLink",
      demo: "https://medilink-rust.vercel.app/",
    },
    {
      title: "No-Code ML Training Platform",
      blurb: "Automated ML fine-tuning and model recommendation using FastAPI, PyTorch, HuggingFace, Google Gemini APIs, DynamoDB, S3, Docker, and AWS EC2, orchestrating distributed GPU-backed training workloads with a React dashboard and WebSocket monitoring—reducing setup time from hours to minutes (50%).",
      tools: ["FastAPI", "PyTorch", "HuggingFace", "Google Gemini APIs", "DynamoDB", "S3", "Docker", "AWS EC2", "React", "WebSockets"],
    },
    {
      title: "Prompt Refinement & AI Chat Application",
      blurb: "Full-stack prompt designer that converts naive input into structured prompts via option-driven forms (length, format, theme, document parsing) with MongoDB storage and real-time chat interface.",
      tools: ["React", "Node.js", "Express", "MongoDB", "OpenAI API"],
    },
    {
      title: "PINTOS Operating System Development",
      blurb: "Enhanced Pintos (C, x86) with priority donation, MLFQ, and sync primitives; refactored 5K+ LOC, raised test coverage above 90%, and improved multithreaded throughput by 30%.",
      tools: ["C", "x86 Assembly", "Operating Systems"],
    },
    {
      title: "Sentiment Analysis with Tone Detection",
      blurb: "Analyzes airline tweets with Multinomial Naïve Bayes achieving 84.6% accuracy. Classifies sentiment (Positive/Neutral/Negative), detects sarcasm, and categorizes negative feedback by reason. Features TF-IDF vectorization, SMOTE for class imbalance, and real-time prediction for customer feedback analysis.",
      tools: ["Python", "NLP", "Machine Learning", "Jupyter", "TF-IDF"],
      code: "https://github.com/Harshabhi6129/Sentiment-Analysis-with-Tone-Detection",
    },
    {
      title: "Real-Time AI Virtual Mouse",
      blurb: "Hands-free cursor control with CV + DL; precise gesture recognition and virtual keyboard for accessibility.",
      tools: ["Python", "OpenCV", "Deep Learning"],
      code: "https://github.com/Harshabhi6129/Real-Time-AI-Virtual-Mouse-System-Using-Deep-Learning",
    },
    {
      title: "Persona AI",
      blurb: "Conversational agent with memory + context retrieval (ChromaDB) and adaptive tone. Streamlit-based UI.",
      tools: ["OpenAI", "ChromaDB", "Python", "Streamlit"],
      code: "https://github.com/Harshabhi6129/Persona_AI",
      demo: "https://personaai-eypmjae...streamlit.app/",
    },
    {
      title: "Next-Word Prediction (LSTM-GRU)",
      blurb: "Sequence model for next-word prediction with Streamlit demo.",
      tools: ["Python", "LSTM", "GRU", "Streamlit"],
      code: "https://github.com/Harshabhi6129/Next-Word-Prediction-using-LSTM-GRU",
      demo: "https://next-word-prediction-using-lstm-gru-bsm7yqdjbzsbc4hz4mezz t.streamlit.app/",
    },
    {
      title: "Time-Series Forecasting (RNN/LSTM)",
      blurb: "PyTorch notebook demonstrating robust forecasting with industry-standard metrics.",
      tools: ["PyTorch", "Pandas", "TensorBoard"],
      code: "https://github.com/Harshabhi6129/Time-Series-Forecasting-with-RNN-LSTM-using-PyTorch",
    },
  ],
  experience: [
    {
      role: "Software Engineer",
      org: "Wells Fargo",
      time: "May 2025 – Present",
      location: "CA, United States",
      points: [
        "Led Risk Evaluation and Rule Management microservices processing 2–3M daily transaction events via Spring Boot, Spring Kafka, Oracle 19c, and Redis on OpenShift at sub-second SLA.",
        "Introduced Redis-backed rule metadata cache with PostgreSQL config store and atomic version-swap refresh to handle 300+ compliance rules and high-TPS Hibernate hydration, reducing p95 latency from 620ms to 340ms.",
        "Enforced write-path idempotency via composite unique constraints, JPA transactional boundaries, and manual offset commit to resolve duplicate Oracle audit records from Kafka at-least-once delivery, reducing replay defects 80%.",
        "Implemented graceful shutdown, partition-aware readiness probes, and Micrometer/Grafana lag dashboards for rolling OpenShift deployments across 24+ Kafka partitions, cutting deployment latency spikes 40%.",
      ],
    },
    {
      role: "Software Developer",
      org: "IBM",
      time: "July 2021 – May 2024",
      location: "India",
      points: [
        "Built Provisioning Orchestrator and Access Governance services using Spring Boot, Kafka, PostgreSQL, MongoDB, and AWS EKS, automating 1,500+ sandbox environments annually and reducing provisioning time from days to minutes.",
        "Enforced deterministic state machine in PostgreSQL with optimistic concurrency control and transactional Kafka task dispatch to handle concurrent AWS failures, reducing manual remediation 60%.",
        "Offloaded synchronous AWS SDK calls to partition-keyed Kafka workers with MongoDB execution tracking and idempotent IAM operations, improving provisioning success rates 30%.",
        "Enforced Spring Security OAuth2, JWT validation, Hibernate tenant-scoped filters, and AWS SDK expiration sweeps, reducing unauthorized access incidents 70%.",
        "Extracted Access Governance with gRPC internal validation, Kafka eventual consistency, and Kubernetes Ingress rate limiting from a monolith, reducing deployment blast radius 40%.",
        "Instrumented Micrometer timers per AWS operation and wired SNS/SQS failure fan-out for better observability, reducing MTTR 45%.",
        "Introduced Testcontainers-based PostgreSQL and Kafka integration tests in Jenkins CI, reducing release defects 50%.",
      ],
    },
  ],
  education: [
    {
      program: "Master of Science in Computer Science",
      school: "University at Buffalo, The State University of New York",
      time: "Aug 2024 – Dec 2025",
      details: "Coursework includes Database management, Data Structures and Algorithms, Distributed Systems, Object-Oriented Programming (OOPs), Cloud Computing, Software Development, Operating Systems, Artificial Intelligence, Machine Learning, Deep Learning.",
      focus: [
        "Distributed Systems",
        "Cloud Computing",
        "Artificial Intelligence",
        "Machine Learning",
        "Deep Learning",
        "Software Development",
        "Database Management",
        "Operating Systems",
      ],
    },
  ],
  certifications: [
    {
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issued: "Mar 2024",
      expires: "Mar 2027",
      link: "#",
      icon: "award",
    },
    {
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      issued: "Feb 2024",
      expires: "Feb 2027",
      link: "#",
      icon: "award",
    },
    {
      title: "Career Essentials in Generative AI",
      issuer: "Microsoft and LinkedIn",
      issued: "Sep 2024",
      link: "https://www.linkedin.com/learning/certificates/868ae44056adbc0bf99c92c394ec3d1187d484883cc00c6758d689658bbf46d7",
      icon: "award",
    },
    {
      title: "AWS Certified Machine Learning Engineer – Associate",
      issuer: "Amazon Web Services",
      issued: "May 2025",
      expires: "May 2028",
      link: "https://www.credly.com/badges/481a3796-1871-4387-8933-3351381f80af/linked_in_profile",
      icon: "award",
    },
    {
      title: "BCG - GenAI",
      issuer: "BCG X",
      issued: "Jan 2025",
      credentialId: "9ZHCkLQTWjyz2sh3J",
      link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/SKZxezskWgmFjRvj9/gabev3vXhuACr48eb_SKZxezskWgmFjRvj9_o9Qv8ETNTrDdS37xy_1736139681637_completion_certificate.pdf",
      icon: "award",
    },
    {
      title: "Tata Group - Data Visualisation",
      issuer: "Tata Group",
      issued: "Jan 2025",
      credentialId: "oj5SXty9NLDWfCPqk",
      link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/ifobHAoMjQs9s6bKS/MyXvBcppsW2FkNYCX_ifobHAoMjQs9s6bKS_o9Qv8ETNTrDdS37xy_1737607135331_completion_certificate.pdf",
      icon: "award",
    },
  ],
};

// ---------- HELPERS ----------
const Section: React.FC<{ id: string; title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ id, title, icon, children }) => (
  <section id={id} className="relative scroll-mt-24 py-20">
    <div className="mx-auto max-w-6xl px-6">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex items-center gap-3 text-3xl font-bold tracking-tight text-white/90"
      >
        <span className="inline-grid place-items-center rounded-xl bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur">
          {icon}
        </span>
        {title}
      </motion.h2>
      {children}
    </div>
  </section>
);

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl ${className}`}
  >
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
    <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-[conic-gradient(at_10%_10%,#22d3ee33,transparent_30%,#a78bfa33_60%,transparent_90%)] blur-xl" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/20">
    {children}
  </span>
);

// ---------- MAIN COMPONENT ----------
export default function Portfolio() {
  const [selectedJob, setSelectedJob] = useState<typeof DATA.experience[0] | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState<{ question: string; answer: string } | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const question = chatInput;
    setChatInput("");
    setShowChat(false);
    setChatResponse({ question, answer: "Thinking..." });

    try {
      const KNOWLEDGE_BASE = `You are Abhinav's AI assistant. Answer concisely (under 100 words) from this knowledge:

Abhinav K - MS CS at UBuffalo (2024-25), SDE with 4 years of experience.
Contact: abhinavkuwork@gmail.com | (716) 319-4521
Links: LinkedIn: linkedin.com/in/harsha-abhinav | GitHub: github.com/Harshabhi6129

Experience:
- Software Engineer, Wells Fargo (May 2025-Present): Risk Evaluation microservices, Spring Boot, Kafka, OpenShift.
- Software Developer, IBM (July 2021-May 2024): Provisioning Orchestrator, AWS EKS, Spring Boot, Kafka.

Skills: Java, Python, React, Node.js, Spring Boot, Kafka, AWS, Docker, K8s, PostgreSQL, MongoDB, Redis, Microservices, AI/ML, JUnit, Mockito, Testcontainers.

Top Projects:
- No-Code ML Training Platform: FastAPI, PyTorch, HuggingFace, Google Gemini APIs, DynamoDB, S3, Docker, AWS EC2, React.

Certs: AWS Solutions Architect, AWS Developer, Microsoft Essentials in Generative AI.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          knowledgeBase: KNOWLEDGE_BASE
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error('API Error:', data);
        throw new Error(data.error?.message || 'API request failed');
      }
      console.log('Full Gemini Response:', JSON.stringify(data, null, 2));

      if (data.error) {
        console.error('Gemini Error:', data.error);
        throw new Error(data.error.message);
      }

      // Try multiple paths to get the answer
      let answer = data.candidates?.[0]?.content?.parts?.[0]?.text
        || data.candidates?.[0]?.output
        || data.text
        || data.response;

      console.log('Extracted answer:', answer);

      if (!answer) {
        console.error('No answer found. Full response:', data);
        console.error('Candidates:', data.candidates);
        throw new Error('No answer generated. Check console for details.');
      }

      // Format markdown to HTML for better readability
      answer = answer
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\* /g, '\n• ') // Bullet points
        .replace(/\n/g, '<br/>'); // Line breaks

      setChatResponse({ question, answer });
    } catch (error) {
      console.error('Chat Error:', error);
      let errorMessage = 'Something went wrong. Please try again!';

      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('quota')) {
          errorMessage = 'Rate limit reached! Please wait a moment and try again.';
        } else if (error.message.includes('SAFETY') || error.message.includes('blocked')) {
          errorMessage = 'Response was blocked by safety filters. Try rephrasing your question.';
        } else {
          errorMessage = error.message;
        }
      }

      setChatResponse({
        question,
        answer: `⚠️ ${errorMessage}`
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pointer-events-none fixed z-[9999] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/50"
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
        />
      ))}
      {/* Global FX */}
      <BackgroundFX />

      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 mx-auto w-full backdrop-blur supports-[backdrop-filter]:bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <a href="#home" className="group flex items-center gap-3">
            <span className="inline-grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/40 to-fuchsia-400/40 ring-1 ring-white/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold tracking-wider text-white/80 group-hover:text-white">
              {DATA.name}
            </span>
          </a>
          <div className="hidden items-center gap-4 md:flex">
            {[
              ["About", "about"],
              ["Skills", "skills"],
              ["Experience", "experience"],
              ["Education", "education"],
              ["Projects", "projects"],
              ["Certifications", "certifications"],
              ["Research", "research"],
              ["Blog", "blog"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full px-3 py-1 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a aria-label="GitHub" href={DATA.links.github} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 hover:bg-white/10">
              <Github className="h-5 w-5" />
            </a>
            <a aria-label="LinkedIn" href={DATA.links.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 hover:bg-white/10">
              <Linkedin className="h-5 w-5" />
            </a>
            <a aria-label="Email" href={`mailto:${DATA.email}`} className="rounded-full p-2 hover:bg-white/10">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="home" className="relative flex min-h-screen items-center">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-28 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/20">
              <Rocket className="h-5 w-5" />
              Building delightful, high-impact software
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              {DATA.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-white/80">{DATA.motto}</p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              I design robust backends, craft intuitive interfaces, and wire AI into real products. Good software should feel like
              magic — fast, reliable, and a little bit bold.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={DATA.links.resume} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black transition hover:bg-white">
                <FileText className="h-4 w-4" /> View Resume
              </a>
              <a href="#projects" className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur transition hover:bg-white/10">
                <ArrowRightCircle className="h-4 w-4" /> Explore Projects
              </a>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            {/* Hero Visual */}
            <div className="relative aspect-square w-full max-w-[520px] rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/10 to-emerald-500/10 p-1 shadow-[0_0_80px_-20px_rgba(34,211,238,0.35)]">
              <div className="relative h-full w-full rounded-[2rem] bg-black/40 p-6 ring-1 ring-white/10 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(120px_80px_at_20%_10%,#22d3ee22,transparent),radial-gradient(160px_120px_at_80%_80%,#a78bfa22,transparent)]" />
                <div className="relative z-10 grid h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto mb-4 w-16 rounded-2xl bg-white/10 p-3 ring-1 ring-white/20">
                      <Cpu className="mx-auto h-10 w-10" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Engineer • Builder • Explorer</p>
                    <p className="mt-2 text-white/70">Java • Spring • React • FastAPI • AWS • K8s</p>
                  </div>
                </div>
              </div>

              {/* Virtual Assistant */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="fixed bottom-8 right-8 z-50 cursor-pointer"
                onClick={() => setShowChat(true)}
              >
                <div className="relative">
                  {/* Character */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-1 shadow-[0_0_30px_rgba(34,211,238,0.5)] ring-2 ring-white/20"
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-purple-900">
                      {/* Animated Face */}
                      <div className="relative h-16 w-16">
                        {/* Eyes */}
                        <motion.div
                          animate={{ scaleY: [1, 0.1, 1] }}
                          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1.5 }}
                          className="absolute left-2 top-3 flex gap-3"
                        >
                          <div className="h-5 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                          <div className="h-5 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Speech Bubble */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{
                      opacity: [0.9, 1, 0.9],
                      scale: [1, 1.05, 1],
                      y: [0, -5, 0]
                    }}
                    transition={{
                      delay: 1.5,
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -left-48 top-0 w-44 rounded-2xl border border-cyan-400/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-xl"
                  >
                    <p className="text-xs font-medium text-white">👋 Hey! Ask me anything about Harsha!</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ABOUT */}
      <Section id="about" title="About" icon={<PenTool className="h-5 w-5" />}>
        <GlassCard>
          <p className="text-white/80">
            Software Engineer with 4 years of experience designing and deploying scalable backend and distributed systems across financial services and cloud infrastructure. Proficient in Java and the Spring ecosystem, building event-driven Kafka pipelines, enforcing OAuth2/JWT security, optimizing relational and NoSQL databases, and operating containerized services on AWS and OpenShift with Prometheus/Grafana observability and CI/CD automation.
          </p>
        </GlassCard>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Technical Skills" icon={<Code2 className="h-5 w-5" />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DATA.skillCategories.map((cat) => (
            <GlassCard key={cat.category}>
              <div className="mb-4 flex items-center gap-2">
                {cat.category.includes("Programming") && <Code2 className="h-5 w-5 text-cyan-400" />}
                {cat.category.includes("Web") && <Cpu className="h-5 w-5 text-fuchsia-400" />}
                {cat.category.includes("Database") && <Database className="h-5 w-5 text-emerald-400" />}
                {cat.category.includes("Cloud") && <Cloud className="h-5 w-5 text-blue-400" />}
                {cat.category.includes("Tools") && <Wrench className="h-5 w-5 text-amber-400" />}
                {cat.category.includes("Competencies") && <Brain className="h-5 w-5 text-violet-400" />}
                <h3 className="font-semibold text-white/90">{cat.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience" icon={<Server className="h-5 w-5" />}>
        <div className="grid gap-6 md:grid-cols-2">
          {DATA.experience.map((job) => (
            <ExperienceCard key={job.org} job={job} onKnowMore={() => setSelectedJob(job)} />
          ))}
        </div>
      </Section>

      {/* CHAT MODAL */}
      {showChat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={() => setShowChat(false)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg rounded-3xl border border-cyan-400/30 bg-[#0b0d17]/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <button
              onClick={() => setShowChat(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <span className="text-xl">×</span>
            </button>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-purple-900">
                  <div className="relative h-6 w-6">
                    <div className="absolute left-0.5 top-1 flex gap-2">
                      <div className="h-3 w-1.5 rounded-full bg-white" />
                      <div className="h-3 w-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold">Ask Me Anything!</h3>
                <p className="text-sm text-white/60">Powered by Gemini AI • I know everything about Harsha</p>
              </div>
            </div>
            <form onSubmit={handleChatSubmit} className="space-y-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="e.g., What are his skills? Tell me about his projects..."
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                autoFocus
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-semibold text-white transition hover:from-cyan-400 hover:to-blue-400"
              >
                Ask 🚀
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Skills", "Experience", "Projects", "AI/ML", "Contact"].map((q) => (
                <button
                  key={q}
                  onClick={() => setChatInput(`Tell me about his ${q.toLowerCase()}`)}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/20 transition hover:bg-white/20"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* CHAT RESPONSE MODAL */}
      {chatResponse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={() => setChatResponse(null)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-400/30 bg-[#0b0d17]/95 p-8 shadow-2xl backdrop-blur-xl"
          >
            <button
              onClick={() => setChatResponse(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <span className="text-xl">×</span>
            </button>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-purple-900">
                  <div className="relative h-6 w-6">
                    <div className="absolute left-0.5 top-1 flex gap-2">
                      <div className="h-3 w-1.5 rounded-full bg-white" />
                      <div className="h-3 w-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/60">You asked:</p>
                <p className="mt-1 font-semibold text-cyan-400">{chatResponse.question}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="leading-relaxed text-white/90" dangerouslySetInnerHTML={{ __html: chatResponse.answer }} />
            </div>
            <button
              onClick={() => {
                setChatResponse(null);
                setShowChat(true);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Ask Another Question
            </button>
          </motion.div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={() => setSelectedJob(null)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/20 bg-[#0b0d17]/95 p-8 shadow-2xl backdrop-blur-xl"
          >
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <span className="text-xl">×</span>
            </button>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">{selectedJob.role}</h3>
                <p className="text-lg text-white/70">{selectedJob.org}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70 ring-1 ring-white/20">{selectedJob.time}</span>
            </div>
            <ul className="mt-6 space-y-3 text-white/80">
              {selectedJob.points.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-cyan-400/70 shadow-[0_0_10px_2px_#22d3ee99]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}

      {/* EDUCATION */}
      <Section id="education" title="Education" icon={<GraduationCap className="h-5 w-5" />}>
        <div className="grid gap-6">
          {DATA.education.map((edu) => (
            <GlassCard key={edu.school}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{edu.program}</h3>
                  <p className="text-white/70">{edu.school}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/20">
                  {edu.time}
                </span>
              </div>
              <p className="mt-3 text-white/80">{edu.details}</p>
              {edu.focus && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {edu.focus.map((f) => (
                    <Badge key={f}>{f}</Badge>
                  ))}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" title="Projects" icon={<Brain className="h-5 w-5" />}>
        <div className="grid gap-6 md:grid-cols-2">
          {DATA.projects.map((pr) => (
            <GlassCard key={pr.title}>
              <h3 className="text-xl font-semibold">{pr.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {pr.tools.map((tool) => (
                  <Badge key={tool}>{tool}</Badge>
                ))}
              </div>
              <p className="mt-3 text-white/80">{pr.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {pr.code && (
                  <a href={pr.code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black hover:bg-white">
                    <Github className="h-4 w-4" /> Code <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {pr.demo && (
                  <a href={pr.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/90 hover:bg-white/10">
                    Live Demo <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* CERTIFICATIONS */}
      <Section id="certifications" title="Certifications" icon={<Award className="h-5 w-5" />}>
        <div className="grid gap-6 md:grid-cols-2">
          {DATA.certifications.map((cert) => (
            <GlassCard key={cert.title}>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-amber-400/20 p-3 ring-1 ring-amber-400/30">
                  <Award className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{cert.title}</h3>
                  <p className="mt-1 text-white/70">{cert.issuer}</p>
                  {cert.issued && (
                    <p className="mt-1 text-sm text-white/60">
                      Issued {cert.issued}
                      {cert.expires && ` · Expires ${cert.expires}`}
                    </p>
                  )}
                  {cert.credentialId && (
                    <p className="mt-1 text-xs text-white/50">Credential ID: {cert.credentialId}</p>
                  )}
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      View Credential <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* RESEARCH */}
      <Section id="research" title="Research & Publication" icon={<BookOpen className="h-5 w-5" />}>
        <GlassCard>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">IoT-Based Estimation of Daily Evapotranspiration</h3>
              <p className="text-white/70">Performance Evaluation & Optimization for Sustainable Crop Water Management • DoSCI-2024</p>
            </div>
            <a href={DATA.links.research} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black hover:bg-white">
              Read Publication <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-white/80">
            Presented at an international symposium, this work evaluates methods for accurate daily ET prediction to optimize irrigation
            strategies — blending domain models with practical IoT workflows.
          </p>
        </GlassCard>
      </Section>

      {/* BLOG */}
      <Section id="blog" title="Writing" icon={<PenTool className="h-5 w-5" />}>
        <GlassCard>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-semibold">Occasional notes on engineering, AI, and shipping well-crafted software</h3>
              <p className="text-white/70">Posts are hosted on Medium.</p>
            </div>
            <a href={DATA.links.medium} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10">
              Visit Medium <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </GlassCard>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact" icon={<Mail className="h-5 w-5" />}>
        <GlassCard>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold">Let&apos;s build something people love</h3>
              <p className="mt-2 text-white/80">
                Open to software engineering roles, research collaborations, and tinkering on ambitious ideas. Drop a note — I reply.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a href={`mailto:${DATA.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black hover:bg-white">
                  <Mail className="h-4 w-4" /> {DATA.email}
                </a>
                <a href={DATA.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a href={DATA.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(120px_80px_at_20%_10%,#22d3ee22,transparent),radial-gradient(160px_120px_at_80%_80%,#a78bfa22,transparent)]" />
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl">
                <p className="text-sm text-white/70">Quick intro</p>
                <p className="mt-2 text-white/80">
                  I care about code quality, meaningful abstractions, and shipping. My favorite pull requests are the ones that remove
                  more code than they add.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>Design with intent</Badge>
                  <Badge>Ship with confidence</Badge>
                  <Badge>Measure & iterate</Badge>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </Section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/10 py-10text-center text-white/60">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm">© {new Date().getFullYear()} {DATA.name}. Built with React, Tailwind & Framer Motion.</p>
        </div>
      </footer>

      {/* EXTRA STYLES */}
      <style>{`
        .noise {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.04"/></svg>');
        }
        .shine {
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
        }
        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .floaty {
          animation: floaty 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ---------- EXPERIENCE CARD ----------
function ExperienceCard({ job, onKnowMore }: { job: typeof DATA.experience[0]; onKnowMore: () => void }) {
  const getCompanyIcon = (org: string) => {
    if (org.includes('JPMorgan')) return <Server className="h-6 w-6 text-blue-400" />;
    if (org.includes('Buffalo')) return <GraduationCap className="h-6 w-6 text-purple-400" />;
    if (org.includes('Bajaj')) return <Cpu className="h-6 w-6 text-emerald-400" />;
    if (org.includes('Wells Fargo')) return <Code2 className="h-6 w-6 text-amber-400" />;
    return <Server className="h-6 w-6 text-cyan-400" />;
  };

  return (
    <GlassCard>
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
          {getCompanyIcon(job.org)}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{job.role}</h3>
              <p className="text-white/70">{job.org}</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/20">{job.time}</span>
          </div>
          <button
            onClick={onKnowMore}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <span>Know More</span>
            <ArrowRightCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

// ---------- BACKGROUND FX ----------
function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* animated gradient blobs */}
      <motion.div
        animate={{
          x: [0, 200, -150, 0],
          y: [0, -150, 100, 0],
          scale: [1, 1.3, 0.7, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-24 top-[-10%] h-[50rem] w-[50rem] rounded-full bg-cyan-500/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -200, 150, 0],
          y: [0, 150, -100, 0],
          scale: [1, 0.7, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-24 bottom-[-10%] h-[50rem] w-[50rem] rounded-full bg-fuchsia-500/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -180, 180, 0],
          y: [0, 180, -180, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[45rem] w-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/25 blur-[120px]"
      />
      {/* angled grid */}
      <div className="absolute inset-0 opacity-[0.08] [mask-image:radial-gradient(closest-side,black,transparent)]">
        <div className="absolute -left-40 -top-40 h-[200%] w-[200%] rotate-[18deg] bg-[linear-gradient(to_right,transparent_49%,rgba(255,255,255,0.35)_50%,transparent_51%)] bg-[length:24px_24px]" />
      </div>
      {/* stars */}
      <div className="noise absolute inset-0" />
      {/* soft spotlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,255,255,0.2),transparent)]" />
    </div>
  );
}
