import Link from "next/link";
import { formatDateFr } from "@/lib/date-fr";

export type NewsItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  tags: string[];
  featured?: boolean;
  publishedAt?: string | Date;
};

function NewsCardBody({ item, featured }: { item: NewsItem; featured?: boolean }) {
  return (
    <>
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          className={`w-full bg-[var(--bg-elevated)] object-cover ${
            featured ? "h-56 min-h-[220px] md:h-full" : "h-44"
          }`}
        />
      ) : (
        <div
          className={`flex items-center justify-center bg-gradient-to-br from-sky-900/40 to-slate-900 text-[var(--accent)] ${
            featured ? "h-56 min-h-[220px] md:h-full" : "h-44"
          }`}
        >
          <i className="fa-solid fa-newspaper text-3xl opacity-60" />
        </div>
      )}

      <div className="flex flex-col p-5 md:p-6">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-[rgba(14,165,233,0.12)] px-2 py-0.5 font-semibold uppercase tracking-wide text-[var(--accent)]">
            {item.category}
          </span>
          {item.featured && (
            <span className="rounded bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-300">
              À la une
            </span>
          )}
          <span className="text-[var(--text-muted)]">{formatDateFr(item.publishedAt)}</span>
        </div>

        <h3
          className={`mb-2 font-bold leading-snug text-white transition group-hover:text-[var(--accent)] ${
            featured ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {item.title}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {item.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-xs">
          <span className="text-[var(--text-muted)]">
            <i className="fa-regular fa-clock mr-1 opacity-70" />
            Article
          </span>
          <span className="font-semibold text-[var(--accent)]">
            Lire l&apos;article <i className="fa-solid fa-arrow-right text-[0.65rem]" />
          </span>
        </div>
      </div>
    </>
  );
}

function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const className = `card group block overflow-hidden no-underline transition hover:border-[var(--border-hover)] ${
    featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
  }`;

  return (
    <Link href={`/actualites/${item.id}`} className={className}>
      <NewsCardBody item={item} featured={featured} />
    </Link>
  );
}

export default function TechNewsSection({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: NewsItem[];
}) {
  const featured = items.find((i) => i.featured) || items[0];
  const rest = items.filter((i) => i.id !== featured?.id);

  return (
    <section id="tech" className="scroll-reveal mx-auto max-w-[1100px] px-[5%] py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            <i className="fa-solid fa-newspaper" />
            Mes publications
          </div>
          <h2 className="section-title">{title}</h2>
          <p className="mt-4 max-w-xl text-[var(--text-muted)]">{intro}</p>
        </div>
        {items.length > 0 && (
          <Link
            href="/actualites"
            className="btn-secondary text-sm no-underline"
          >
            Tous les articles <i className="fa-solid fa-arrow-right" />
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-8 text-center text-[var(--text-muted)]">
          Aucun article publié pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featured && <NewsCard item={featured} featured />}
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
