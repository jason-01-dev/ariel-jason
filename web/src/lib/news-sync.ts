import { prisma } from "./prisma";
import { NEWS_FEEDS, inferCategory } from "./news-feeds";
import { fetchFeedXml, parseFeedXml } from "./rss";

export type SyncResult = {
  ok: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  feeds: { name: string; imported: number; error?: string }[];
  lastSyncAt: string;
};

/**
 * Importe les actualités RSS (dédupliquées) + conserve les articles manuels.
 */
export async function syncTechNews(options?: {
  force?: boolean;
}): Promise<SyncResult> {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: { id: "main" },
    update: {},
  });

  if (!options?.force && !settings.newsAutoSync) {
    return {
      ok: true,
      imported: 0,
      skipped: 0,
      errors: ["Sync automatique désactivée dans les paramètres."],
      feeds: [],
      lastSyncAt: settings.newsLastSyncAt?.toISOString() || "",
    };
  }

  // Éviter trop de syncs rapprochées (sauf force)
  if (!options?.force && settings.newsLastSyncAt) {
    const hours = settings.newsSyncIntervalHours || 6;
    const next = settings.newsLastSyncAt.getTime() + hours * 60 * 60 * 1000;
    if (Date.now() < next) {
      return {
        ok: true,
        imported: 0,
        skipped: 0,
        errors: [],
        feeds: [],
        lastSyncAt: settings.newsLastSyncAt.toISOString(),
      };
    }
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];
  const feedsReport: SyncResult["feeds"] = [];

  for (const feed of NEWS_FEEDS) {
    let feedImported = 0;
    try {
      const xml = await fetchFeedXml(feed.url);
      const items = parseFeedXml(xml).slice(0, feed.limit);

      for (const item of items) {
        const externalId = `${feed.id}:${item.externalId}`.slice(0, 190);
        const existing = await prisma.techItem.findUnique({
          where: { externalId },
        });
        if (existing) {
          skipped++;
          continue;
        }

        // Aussi dédup par URL source
        if (item.link) {
          const byUrl = await prisma.techItem.findFirst({
            where: { sourceUrl: item.link },
          });
          if (byUrl) {
            skipped++;
            continue;
          }
        }

        const category = inferCategory(
          `${item.title} ${item.description}`,
          feed.defaultCategory
        );

        await prisma.techItem.create({
          data: {
            category,
            title: item.title.slice(0, 200),
            description: item.description.slice(0, 2000) || item.title,
            content: "",
            imageUrl: item.imageUrl,
            source: feed.name,
            sourceUrl: item.link,
            tags: [feed.name, category],
            featured: false,
            published: true,
            publishedAt: item.publishedAt,
            origin: "rss",
            externalId,
            sortOrder: 0,
          },
        });
        imported++;
        feedImported++;
      }

      feedsReport.push({ name: feed.name, imported: feedImported });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${feed.name}: ${msg}`);
      feedsReport.push({ name: feed.name, imported: 0, error: msg });
    }
  }

  // Mettre le plus récent en "à la une" s'il n'y en a pas déjà un featured publié
  const featuredCount = await prisma.techItem.count({
    where: { published: true, featured: true },
  });
  if (featuredCount === 0) {
    const latest = await prisma.techItem.findFirst({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
    if (latest) {
      await prisma.techItem.update({
        where: { id: latest.id },
        data: { featured: true },
      });
    }
  }

  const now = new Date();
  await prisma.siteSettings.update({
    where: { id: "main" },
    data: { newsLastSyncAt: now },
  });

  return {
    ok: errors.length < NEWS_FEEDS.length,
    imported,
    skipped,
    errors,
    feeds: feedsReport,
    lastSyncAt: now.toISOString(),
  };
}

/** Appelé côté page publique : sync soft si l'intervalle est dépassé */
export async function maybeAutoSyncNews(): Promise<void> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    if (!settings?.newsAutoSync) return;

    const hours = settings.newsSyncIntervalHours || 6;
    if (settings.newsLastSyncAt) {
      const next = settings.newsLastSyncAt.getTime() + hours * 60 * 60 * 1000;
      if (Date.now() < next) return;
    }

    // Ne bloque pas trop longtemps la page
    await syncTechNews({ force: false });
  } catch {
    // silencieux sur le public
  }
}
