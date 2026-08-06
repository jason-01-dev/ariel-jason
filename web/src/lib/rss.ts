export type ParsedRssItem = {
  externalId: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string | null;
  publishedAt: Date;
};

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

function stripHtml(s: string): string {
  return decodeEntities(s)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagContent(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m ? decodeEntities(m[1].trim()) : "";
}

function attr(block: string, tag: string, attrName: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attrName}=["']([^"']+)["'][^>]*/?>`, "i");
  const m = block.match(re);
  return m ? decodeEntities(m[1]) : "";
}

function extractImage(block: string, description: string): string | null {
  const enclosure = attr(block, "enclosure", "url");
  if (enclosure && /\.(jpg|jpeg|png|webp|gif)/i.test(enclosure)) return enclosure;

  const media = attr(block, "media:content", "url") || attr(block, "media:thumbnail", "url");
  if (media) return media;

  const img = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (img?.[1]) return decodeEntities(img[1]);

  return null;
}

function parseDate(raw: string): Date {
  if (!raw) return new Date();
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/** Parse RSS 2.0 et Atom basique */
export function parseFeedXml(xml: string): ParsedRssItem[] {
  const items: ParsedRssItem[] = [];

  // RSS <item>
  const rssBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (const block of rssBlocks) {
    const title = stripHtml(tagContent(block, "title"));
    const link =
      stripHtml(tagContent(block, "link")) ||
      attr(block, "link", "href") ||
      stripHtml(tagContent(block, "guid"));
    const rawDesc =
      tagContent(block, "description") ||
      tagContent(block, "content:encoded") ||
      tagContent(block, "summary");
    const description = stripHtml(rawDesc).slice(0, 500);
    const guid = stripHtml(tagContent(block, "guid")) || link;
    const pub =
      tagContent(block, "pubDate") ||
      tagContent(block, "dc:date") ||
      tagContent(block, "published");
    if (!title || !link) continue;
    items.push({
      externalId: guid || link,
      title,
      description: description || title,
      link,
      imageUrl: extractImage(block, rawDesc),
      publishedAt: parseDate(pub),
    });
  }

  if (items.length > 0) return items;

  // Atom <entry>
  const atomBlocks = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const block of atomBlocks) {
    const title = stripHtml(tagContent(block, "title"));
    const link = attr(block, "link", "href") || stripHtml(tagContent(block, "id"));
    const rawDesc = tagContent(block, "summary") || tagContent(block, "content");
    const description = stripHtml(rawDesc).slice(0, 500);
    const id = stripHtml(tagContent(block, "id")) || link;
    const pub = tagContent(block, "updated") || tagContent(block, "published");
    if (!title || !link) continue;
    items.push({
      externalId: id || link,
      title,
      description: description || title,
      link,
      imageUrl: extractImage(block, rawDesc),
      publishedAt: parseDate(pub),
    });
  }

  return items;
}

export async function fetchFeedXml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "ArielPortfolioNewsBot/1.0 (+https://localhost)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    // Next.js cache
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Feed HTTP ${res.status} — ${url}`);
  }
  return res.text();
}
