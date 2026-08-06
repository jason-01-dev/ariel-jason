import { prisma } from "./prisma";

export type SiteContent = {
  settings: {
    siteName: string;
    logoText: string;
    footerText: string;
    metaTitle: string;
    metaDescription: string;
    heroBadge: string;
    heroGreeting: string;
    heroName: string;
    heroSubtitle: string;
    heroDescription: string;
    heroPhotoUrl: string;
    heroCtaPrimaryLabel: string;
    heroCtaPrimaryHref: string;
    heroCtaSecondaryLabel: string;
    heroCtaSecondaryHref: string;
    aboutTitle: string;
    aboutIntro: string;
    aboutBody1: string;
    aboutBody2: string;
    aboutCvPdfUrl: string;
    aboutCvWebUrl: string;
    aboutExcellenceTitle: string;
    aboutExcellenceItems: string[];
    educationTitle: string;
    educationIntro: string;
    skillsTitle: string;
    skillsIntro: string;
    techTitle: string;
    techIntro: string;
    projectsTitle: string;
    projectsIntro: string;
    testimonialsTitle: string;
    testimonialsIntro: string;
    contactTitle: string;
    contactIntro: string;
    contactEmail: string;
    contactPhone: string;
    contactWhatsappUrl: string;
    contactGithubUrl: string;
    contactGithubLabel: string;
    contactFormEndpoint: string;
  };
  navLinks: { id: string; label: string; href: string }[];
  education: { id: string; title: string; school: string; description: string }[];
  skills: {
    id: string;
    title: string;
    description: string;
    icon: string;
    tags: string[];
  }[];
  tech: {
    id: string;
    category: string;
    title: string;
    description: string;
    content: string;
    imageUrl: string | null;
    source: string | null;
    sourceUrl: string | null;
    tags: string[];
    featured: boolean;
    publishedAt: string;
    origin: string;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    linkLabel: string;
    linkUrl: string;
    imageUrl: string | null;
    showImage: boolean;
  }[];
  testimonials: {
    id: string;
    authorName: string;
    authorRole: string;
    company: string | null;
    content: string;
    rating: number;
  }[];
};

const defaultSettings: SiteContent["settings"] = {
  siteName: "Ariel J. Tshibangu",
  logoText: "Ariel J. Tshibangu",
  footerText: "Tous droits réservés.",
  metaTitle: "Ariel J. Tshibangu | Développeur Full-Stack & Expert en Cybersécurité",
  metaDescription:
    "Portfolio d'Ariel J. Tshibangu — Développeur Full-Stack & Expert en Cybersécurité.",
  heroBadge: "Disponible pour projets & opportunités",
  heroGreeting: "Bonjour, je suis",
  heroName: "Ariel J. Tshibangu",
  heroSubtitle: "Développeur Full-Stack & Expert en Cybersécurité",
  heroDescription:
    "Je transforme vos idées en réalités numériques sécurisées et performantes. Je conçois des applications web et mobiles fiables, axées sur une architecture moderne et une sécurité de pointe.",
  heroPhotoUrl: "/images/ariel.jpg",
  heroCtaPrimaryLabel: "Découvrir mes projets",
  heroCtaPrimaryHref: "#projets",
  heroCtaSecondaryLabel: "Me contacter",
  heroCtaSecondaryHref: "#contact",
  aboutTitle: "À propos",
  aboutIntro: "Conception d'applications de bout en bout avec une sécurité intégrée dès le départ.",
  aboutBody1:
    "Spécialiste en ingénierie logicielle et cybersécurité, j'allie les meilleures pratiques de développement agile (TDD, CI/CD) avec les normes de sécurité OWASP.",
  aboutBody2:
    "De l'optimisation des requêtes PostgreSQL à la sécurisation des flux d'authentification et l'automatisation des déploiements cloud, je garantis évolutivité, performance et fiabilité.",
  aboutCvPdfUrl: "/images/arieltsh.pdf",
  aboutCvWebUrl: "/static/cv.html",
  aboutExcellenceTitle: "Domaines d'excellence",
  aboutExcellenceItems: [
    "Audit de sécurité & modélisation des menaces",
    "Architectures full-stack évolutives",
    "Intégration CI/CD & environnements cloud",
  ],
  educationTitle: "Éducation & parcours",
  educationIntro: "Mon parcours académique et ma formation continue.",
  skillsTitle: "Expertise & stack technique",
  skillsIntro: "Un ensemble d'outils modernes pour propulser vos projets web et mobiles.",
  techTitle: "Articles & notes",
  techIntro: "Mes analyses, notes techniques et publications — uniquement mon contenu.",
  projectsTitle: "Projets récents",
  projectsIntro: "Aperçu de mes réalisations techniques en web, mobile et open-source.",
  testimonialsTitle: "Témoignages",
  testimonialsIntro: "Retours de clients et collaborateurs. Uniquement des témoignages validés.",
  contactTitle: "Restons en contact",
  contactIntro: "Un projet en tête ? Une opportunité de collaboration ? Contactez-moi directement.",
  contactEmail: "ariel243tshibangu@gmail.com",
  contactPhone: "+243 819 754 518",
  contactWhatsappUrl: "https://wa.me/243819754518",
  contactGithubUrl: "https://github.com/jason-01-dev",
  contactGithubLabel: "github.com/jason-01-dev",
  contactFormEndpoint: "https://formspree.io/f/mwvgjvwr",
};

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const [settings, navLinks, education, skills, tech, projects, testimonials] =
      await Promise.all([
        prisma.siteSettings.findUnique({ where: { id: "main" } }),
        prisma.navLink.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.educationItem.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.skillBlock.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.techItem.findMany({
          where: { published: true },
          orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { sortOrder: "asc" }],
        }),
        prisma.project.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.testimonial.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
        }),
      ]);

    return {
      settings: settings
        ? {
            siteName: settings.siteName,
            logoText: settings.logoText,
            footerText: settings.footerText,
            metaTitle: settings.metaTitle,
            metaDescription: settings.metaDescription,
            heroBadge: settings.heroBadge,
            heroGreeting: settings.heroGreeting,
            heroName: settings.heroName,
            heroSubtitle: settings.heroSubtitle,
            heroDescription: settings.heroDescription,
            heroPhotoUrl: settings.heroPhotoUrl,
            heroCtaPrimaryLabel: settings.heroCtaPrimaryLabel,
            heroCtaPrimaryHref: settings.heroCtaPrimaryHref,
            heroCtaSecondaryLabel: settings.heroCtaSecondaryLabel,
            heroCtaSecondaryHref: settings.heroCtaSecondaryHref,
            aboutTitle: settings.aboutTitle,
            aboutIntro: settings.aboutIntro,
            aboutBody1: settings.aboutBody1,
            aboutBody2: settings.aboutBody2,
            aboutCvPdfUrl: settings.aboutCvPdfUrl,
            aboutCvWebUrl: settings.aboutCvWebUrl,
            aboutExcellenceTitle: settings.aboutExcellenceTitle,
            aboutExcellenceItems: settings.aboutExcellenceItems,
            educationTitle: settings.educationTitle,
            educationIntro: settings.educationIntro,
            skillsTitle: settings.skillsTitle,
            skillsIntro: settings.skillsIntro,
            techTitle: settings.techTitle,
            techIntro: settings.techIntro,
            projectsTitle: settings.projectsTitle,
            projectsIntro: settings.projectsIntro,
            testimonialsTitle: settings.testimonialsTitle,
            testimonialsIntro: settings.testimonialsIntro,
            contactTitle: settings.contactTitle,
            contactIntro: settings.contactIntro,
            contactEmail: settings.contactEmail,
            contactPhone: settings.contactPhone,
            contactWhatsappUrl: settings.contactWhatsappUrl,
            contactGithubUrl: settings.contactGithubUrl,
            contactGithubLabel: settings.contactGithubLabel,
            contactFormEndpoint: settings.contactFormEndpoint,
          }
        : defaultSettings,
      navLinks: navLinks.map((n) => ({ id: n.id, label: n.label, href: n.href })),
      education: education.map((e) => ({
        id: e.id,
        title: e.title,
        school: e.school,
        description: e.description,
      })),
      skills: skills.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        icon: s.icon,
        tags: s.tags,
      })),
      tech: tech.map((t) => ({
        id: t.id,
        category: t.category,
        title: t.title,
        description: t.description,
        content: t.content,
        imageUrl: t.imageUrl,
        source: t.source,
        sourceUrl: t.sourceUrl,
        tags: t.tags,
        featured: t.featured,
        publishedAt: t.publishedAt.toISOString(),
        origin: t.origin,
      })),
      projects: projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tags: p.tags,
        linkLabel: p.linkLabel,
        linkUrl: p.linkUrl,
        imageUrl: p.imageUrl,
        showImage: p.showImage,
      })),
      testimonials: testimonials.map((t) => ({
        id: t.id,
        authorName: t.authorName,
        authorRole: t.authorRole,
        company: t.company,
        content: t.content,
        rating: t.rating,
      })),
    };
  } catch {
    return {
      settings: defaultSettings,
      navLinks: [
        { id: "1", label: "Accueil", href: "#accueil" },
        { id: "2", label: "À propos", href: "#about" },
        { id: "3", label: "Éducation", href: "#education" },
        { id: "4", label: "Compétences", href: "#competences" },
        { id: "5", label: "Actualités", href: "#tech" },
        { id: "6", label: "Projets", href: "#projets" },
        { id: "7", label: "Témoignages", href: "#temoignages" },
        { id: "8", label: "Contact", href: "#contact" },
      ],
      education: [],
      skills: [],
      tech: [],
      projects: [],
      testimonials: [],
    };
  }
}

export type TechItemDTO = SiteContent["tech"][number];
export type TestimonialDTO = SiteContent["testimonials"][number];

export async function getPublishedArticles(): Promise<SiteContent["tech"]> {
  try {
    const items = await prisma.techItem.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return items.map((t) => ({
      id: t.id,
      category: t.category,
      title: t.title,
      description: t.description,
      content: t.content,
      imageUrl: t.imageUrl,
      source: t.source,
      sourceUrl: t.sourceUrl,
      tags: t.tags,
      featured: t.featured,
      publishedAt: t.publishedAt.toISOString(),
      origin: t.origin,
    }));
  } catch {
    return [];
  }
}

export async function getArticleById(id: string): Promise<SiteContent["tech"][number] | null> {
  try {
    const t = await prisma.techItem.findFirst({
      where: { id, published: true },
    });
    if (!t) return null;
    return {
      id: t.id,
      category: t.category,
      title: t.title,
      description: t.description,
      content: t.content,
      imageUrl: t.imageUrl,
      source: t.source,
      sourceUrl: t.sourceUrl,
      tags: t.tags,
      featured: t.featured,
      publishedAt: t.publishedAt.toISOString(),
      origin: t.origin,
    };
  } catch {
    return null;
  }
}
