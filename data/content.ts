export const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#expertise" },
  { label: "Contact", href: "#contact" },
];

export const expertise = [
  {
    number: "01",
    title: ["Full-Stack", "Development"],
    description:
      "End-to-end product builds — from data models to pixel-perfect interfaces, shipped fast and built to last.",
    tags: ["Next.js", "TypeScript", "Node"],
  },
  {
    number: "02",
    title: ["AI &", "Automation"],
    description:
      "Voice agents, LLM pipelines and automation systems that do real work, not demos.",
    tags: ["Gemini", "FastAPI", "LangChain"],
  },
  {
    number: "03",
    title: ["UI / UX", "Development"],
    description:
      "Interfaces engineered with the same care as a brand — motion, type and layout working as one system.",
    tags: ["Figma", "GSAP", "Design Systems"],
  },
  {
    number: "04",
    title: ["Creative", "Technology"],
    description:
      "Experimental, scroll-driven, cinematic web experiences that make a portfolio feel like a film.",
    tags: ["WebGL", "Three.js", "Motion"],
  },
] as const;

export const projects = [
  {
    number: "01",
    slug: "emma",
    title: "EMMA",
    category: "AI Voice Agent",
    image: "/images/projects/emma.jpg",
    tags: ["Python", "FastAPI", "Gemini"],
  },
  {
    number: "02",
    slug: "cruzz-nexus",
    title: "Cruzz Nexus",
    category: "Discord Bot",
    image: "/images/projects/cruzz-nexus.jpg",
    tags: ["Python", "Discord.py", "SQLite"],
  },
  {
    number: "03",
    slug: "findflex",
    title: "FindFlex Shopping",
    category: "Shopify E-Commerce",
    image: "/images/projects/findflex.jpg",
    tags: ["Shopify", "Dropshipping", "Marketing"],
  },
  {
    number: "04",
    slug: "ecolearn",
    title: "EcoLearn+",
    category: "AI Climate Education",
    image: "/images/projects/ecolearn.jpg",
    tags: ["React", "OpenAI", "Education"],
  },
] as const;

export const caseStudy = {
  label: "Case Study / 01",
  eyebrow: "From idea to real impact.",
  title: "EMMA",
  subtitle: "AI Voice Agent",
  description:
    "An AI receptionist designed for natural voice conversations with businesses — built using Gemini, FastAPI and modern web technologies.",
  problem: {
    title: "The Problem",
    body: "Businesses miss calls, lose customers and can't handle inquiries around the clock.",
  },
  process: {
    title: "The Process",
    body: "Developed an AI voice agent using Gemini, real-time voice pipelines and a business knowledge base.",
  },
  result: {
    title: "The Result",
    body: "Automated inquiries, a better customer experience and measurable business value.",
  },
  tech: ["Python", "FastAPI", "Gemini AI", "WebSocket", "React", "ElevenLabs"],
  stats: [
    { value: "-60%", label: "Missed Calls" },
    { value: "24/7", label: "Available" },
    { value: "2", label: "Languages (EN / DE)" },
  ],
};

export const moreProjects = [
  {
    number: "02",
    slug: "cruzz-nexus",
    title: "Cruzz Nexus",
    category: "Discord Bot",
    image: "/images/projects/cruzz-nexus.jpg",
    tags: ["Python", "Discord.py", "SQLite"],
  },
  {
    number: "03",
    slug: "findflex",
    title: "FindFlex Shopping",
    category: "Shopify Store",
    image: "/images/projects/findflex.jpg",
    tags: ["Shopify", "Dropshipping", "Marketing"],
  },
  {
    number: "04",
    slug: "ecolearn",
    title: "EcoLearn+",
    category: "AI Climate Education",
    image: "/images/projects/ecolearn.jpg",
    tags: ["React", "OpenAI", "Education"],
  },
] as const;

export const aboutStats = [
  { value: "8+", label: "Projects" },
  { value: "4+", label: "Years Experience" },
  { value: "AI", label: "Enthusiast" },
];

export const socialLinks = [
  { label: "Email", href: "mailto:hello@dericandrews.dev" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

export const siteMeta = {
  name: "Deric Andrews",
  role: "Full-Stack Developer / AI Creator",
  email: "hello@dericandrews.dev",
  year: "2026",
};
