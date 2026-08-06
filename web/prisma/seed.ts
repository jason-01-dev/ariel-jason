import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const username = process.env.ADMIN_USERNAME || "ariel";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const displayName = process.env.ADMIN_DISPLAY_NAME || "Ariel J. Tshibangu";
  const email = process.env.ADMIN_EMAIL || "ariel243tshibangu@gmail.com";

  // Nettoyage listes (pas AdminUser / Settings si on veut conserver — on reset tout pour seed propre)
  await prisma.navLink.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.techItem.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skillBlock.deleteMany();
  await prisma.educationItem.deleteMany();

  await prisma.adminUser.upsert({
    where: { username },
    update: {
      displayName,
      email,
      passwordHash: hashPassword(password),
    },
    create: {
      username,
      displayName,
      email,
      passwordHash: hashPassword(password),
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      aboutExcellenceItems: [
        "Audit de sécurité & modélisation des menaces",
        "Architectures full-stack évolutives",
        "Intégration CI/CD & environnements cloud",
      ],
      aboutBody1:
        "Spécialiste en ingénierie logicielle et cybersécurité, j'allie les meilleures pratiques de développement agile (TDD, CI/CD) avec les normes de sécurité OWASP.",
      aboutBody2:
        "De l'optimisation des requêtes PostgreSQL à la sécurisation des flux d'authentification et l'automatisation des déploiements cloud, je garantis évolutivité, performance et fiabilité.",
      heroDescription:
        "Je transforme vos idées en réalités numériques sécurisées et performantes. Je conçois des applications web et mobiles fiables, axées sur une architecture moderne et une sécurité de pointe.",
    },
  });

  // Si excellence vide après update {}, force
  await prisma.siteSettings.update({
    where: { id: "main" },
    data: {
      aboutExcellenceItems: [
        "Audit de sécurité & modélisation des menaces",
        "Architectures full-stack évolutives",
        "Intégration CI/CD & environnements cloud",
      ],
    },
  });

  await prisma.navLink.createMany({
    data: [
      { label: "Accueil", href: "#accueil", sortOrder: 1 },
      { label: "À propos", href: "#about", sortOrder: 2 },
      { label: "Éducation", href: "#education", sortOrder: 3 },
      { label: "Compétences", href: "#competences", sortOrder: 4 },
      { label: "Actualités", href: "#tech", sortOrder: 5 },
      { label: "Projets", href: "#projets", sortOrder: 6 },
      { label: "Témoignages", href: "#temoignages", sortOrder: 7 },
      { label: "Contact", href: "#contact", sortOrder: 8 },
    ],
  });

  await prisma.educationItem.createMany({
    data: [
      {
        title: "Licence en Sciences Informatiques",
        school: "Université de Kinshasa",
        description:
          "Spécialisation en génie logiciel, bases de données, algorithmique et sécurité des systèmes d'information.",
        sortOrder: 1,
      },
      {
        title: "Certificat en Développement Web & Programmation",
        school: "BYU-Idaho (2024–Présent)",
        description:
          "Programme professionnel axé sur le développement concret, la gestion de projets techniques et les technologies web modernes.",
        sortOrder: 2,
      },
      {
        title: "Formations continues en ligne",
        school: "FreeCodeCamp, Coursera & Udemy",
        description:
          "Apprentissage continu sur les frameworks récents, les pratiques DevOps (Docker, CI/CD) et l'audit de sécurité web.",
        sortOrder: 3,
      },
    ],
  });

  await prisma.skillBlock.createMany({
    data: [
      {
        title: "Développement Front-End",
        description:
          "Création d'interfaces utilisateur modernes, réactives et accessibles, optimisées pour le SEO et l'ergonomie.",
        icon: "fa-solid fa-desktop",
        tags: ["React.js", "Next.js", "JavaScript / TypeScript", "Tailwind CSS", "Redux / Context API"],
        sortOrder: 1,
      },
      {
        title: "Développement Back-End",
        description:
          "Conception d'APIs RESTful/GraphQL, d'architectures microservices et de bases de données sécurisées.",
        icon: "fa-solid fa-server",
        tags: ["Laravel", "Node.js", "Python (Django)", "PostgreSQL", "Redis"],
        sortOrder: 2,
      },
      {
        title: "Sécurité, Cloud & DevOps",
        description:
          "Mise en œuvre des principes OWASP, gestion d'infrastructures AWS et automatisation des déploiements.",
        icon: "fa-solid fa-lock",
        tags: ["AWS Cloud Practitioner", "OWASP Top 10", "Docker", "GitHub Actions", "Gestion IAM", "Linux / SysAdmin"],
        sortOrder: 3,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "Plateforme e-commerce sécurisée",
        description:
          "Boutique en ligne complète avec gestion du stock, paiement sécurisé et audit contre les injections SQL et XSS.",
        tags: ["Laravel", "React"],
        linkLabel: "Voir le projet",
        linkUrl: "/devellopment.html",
        sortOrder: 1,
      },
      {
        title: "Application mobile de gestion",
        description:
          "Application cross-platform fluide offrant la synchronisation des données en temps réel et un mode hors-ligne résilient.",
        tags: ["Flutter", "Firebase"],
        linkLabel: "Démo app",
        linkUrl: "/mobile.html",
        sortOrder: 2,
      },
      {
        title: "Contributions open-source",
        description:
          "Correction de failles de sécurité, optimisation de scripts backend et partage de modules de code réutilisables.",
        tags: ["Python", "Sécurité"],
        linkLabel: "Mon GitHub",
        linkUrl: "https://github.com/jason-01-dev",
        sortOrder: 3,
      },
    ],
  });

  await prisma.siteSettings.update({
    where: { id: "main" },
    data: {
      techTitle: "Articles & notes",
      techIntro: "Mes analyses, notes techniques et publications — uniquement mon contenu.",
      newsAutoSync: false,
    },
  });

  await prisma.techItem.createMany({
    data: [
      {
        category: "Cybersécurité",
        title: "Pourquoi la sécurité by design change tout sur un projet web",
        description:
          "Intégrer l'OWASP et la modélisation des menaces dès le premier sprint évite les correctifs coûteux en production.",
        content:
          "Trop de projets traitent la sécurité comme une case à cocher en fin de livraison. En pratique, les failles les plus graves naissent d'une architecture mal cadrée : authentification faible, secrets dans le code, validation des entrées absente.\n\nLa sécurité by design consiste à poser les bonnes questions dès le design : qui accède à quoi, quels flux sont critiques, quelles données sont sensibles. On documente les menaces, on choisit des patterns éprouvés (sessions sécurisées, principe du moindre privilège) et on automatise les contrôles dans la CI.\n\nRésultat : moins de dette, des audits plus sereins, et une confiance accrue des utilisateurs comme des partenaires.",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
        tags: ["OWASP", "Architecture", "Bonnes pratiques"],
        featured: true,
        published: true,
        origin: "manual",
        sortOrder: 1,
      },
      {
        category: "Full-Stack",
        title: "Full-stack et cybersécurité : un duo plus fort ensemble",
        description:
          "Maîtriser le front, le back et la sécu permet de livrer des produits complets sans zones d'ombre entre les équipes.",
        content:
          "Un développeur full-stack qui comprend la cybersécurité voit les risques là où d'autres ne voient que des features. Un formulaire, une API, un cookie : chaque élément a un impact sécurité.\n\nSur mes projets, je relie toujours l'UX, la performance et la protection des données. Ce n'est pas optionnel : c'est ce qui rend une application crédible en production.",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
        tags: ["Full-Stack", "Sécurité", "Produit"],
        featured: false,
        published: true,
        origin: "manual",
        sortOrder: 2,
      },
      {
        category: "DevOps",
        title: "CI/CD : livrer vite sans sacrifier la qualité",
        description:
          "Pipelines, tests automatisés et déploiements reproductibles : la base d'une équipe sereine.",
        content:
          "Un bon pipeline CI/CD ne se contente pas de « build & deploy ». Il exécute les tests, scanne les dépendances, valide la config et documente chaque release.\n\nDocker, GitHub Actions et des environnements proches de la prod réduisent les surprises. L'objectif : pouvoir livrer souvent, avec un filet de sécurité.",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        tags: ["CI/CD", "Docker", "GitHub Actions"],
        featured: false,
        published: true,
        origin: "manual",
        sortOrder: 3,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "Jean-Marc Kabila",
        authorRole: "Product Owner",
        company: "Projet e-commerce",
        content:
          "Ariel a livré une plateforme stable et sécurisée. Communication claire, respect des délais et une vraie exigence sur la qualité du code.",
        rating: 5,
        published: true,
        sortOrder: 1,
      },
      {
        authorName: "Sarah Mbuyi",
        authorRole: "CTO",
        company: "Startup fintech",
        content:
          "Excellent travail sur l'API et la sécurisation des flux d'authentification. On a gagné en fiabilité et en clarté technique.",
        rating: 5,
        published: true,
        sortOrder: 2,
      },
      {
        authorName: "David Okito",
        authorRole: "Lead développeur",
        company: "Équipe mobile",
        content:
          "Collaboration fluide sur l'app de gestion. Ariel anticipe les risques, documente bien et propose des solutions concrètes.",
        rating: 5,
        published: true,
        sortOrder: 3,
      },
    ],
  });

  // fingerprint seed (debug)
  createHash("sha256").update(username).digest("hex").slice(0, 8);

  console.log("═══════════════════════════════════════");
  console.log(" Seed OK — contenu 100% + compte proprio");
  console.log(` Username : ${username}`);
  console.log(` Password : ${password}`);
  console.log(" Admin    : /admin");
  console.log("═══════════════════════════════════════");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
