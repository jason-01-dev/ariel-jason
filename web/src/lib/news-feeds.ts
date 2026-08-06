/**
 * Flux RSS tech / cyber jugés fiables pour la veille.
 * Tu peux en ajouter ici plus tard.
 */
export type NewsFeed = {
  id: string;
  name: string;
  url: string;
  /** Rubrique par défaut si on ne détecte pas mieux */
  defaultCategory: string;
  /** Max d'articles à prendre par flux à chaque sync */
  limit: number;
};

export const NEWS_FEEDS: NewsFeed[] = [
  {
    id: "techcrunch",
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    defaultCategory: "Startups & Tech",
    limit: 5,
  },
  {
    id: "theverge",
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    defaultCategory: "Tech & Innovation",
    limit: 5,
  },
  {
    id: "ars",
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    defaultCategory: "Science & Tech",
    limit: 5,
  },
  {
    id: "wired",
    name: "WIRED",
    url: "https://www.wired.com/feed/rss",
    defaultCategory: "Culture tech",
    limit: 4,
  },
  {
    id: "mittr",
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    defaultCategory: "Recherche & IA",
    limit: 4,
  },
  {
    id: "krebs",
    name: "Krebs on Security",
    url: "https://krebsonsecurity.com/feed/",
    defaultCategory: "Cybersécurité",
    limit: 4,
  },
  {
    id: "bleeping",
    name: "BleepingComputer",
    url: "https://www.bleepingcomputer.com/feed/",
    defaultCategory: "Cybersécurité",
    limit: 4,
  },
  {
    id: "hn",
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
    defaultCategory: "Communauté tech",
    limit: 5,
  },
];

/** Déduit une rubrique à partir du titre / résumé */
export function inferCategory(text: string, fallback: string): string {
  const t = text.toLowerCase();
  if (/(security|cve|ransomware|malware|hacker|breach|phishing|cyber)/i.test(t)) {
    return "Cybersécurité";
  }
  if (/(ai|artificial intelligence|machine learning|llm|gpt|openai|deepmind)/i.test(t)) {
    return "Intelligence artificielle";
  }
  if (/(cloud|aws|azure|google cloud|kubernetes|docker|devops)/i.test(t)) {
    return "Cloud & DevOps";
  }
  if (/(iphone|android|mobile|app store|smartphone)/i.test(t)) {
    return "Mobile";
  }
  if (/(startup|funding|venture|ipo|acquisition)/i.test(t)) {
    return "Startups";
  }
  if (/(chip|semiconductor|gpu|nvidia|intel|hardware)/i.test(t)) {
    return "Hardware";
  }
  return fallback;
}
