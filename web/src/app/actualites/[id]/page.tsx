import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById, getPublishedArticles, getSiteContent } from "@/lib/data";
import { formatDateFr } from "@/lib/date-fr";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, content, others] = await Promise.all([
    getArticleById(id),
    getSiteContent(),
    getPublishedArticles(),
  ]);

  if (!article) notFound();

  const s = content.settings;
  const related = others.filter((a) => a.id !== article.id).slice(0, 3);

  // Paragraphes depuis le corps (sauts de ligne) ou description
  const bodyText = (article.content && article.content.trim()) || article.description;
  const paragraphs = bodyText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(11,15,20,0.95)] backdrop-blur">
        <div className="mx-auto flex max-w-[760px] items-center justify-between px-[5%] py-3.5">
          <Link href="/" className="font-bold text-white no-underline hover:text-[var(--accent)]">
            <i className="fa-solid fa-code mr-2 text-[var(--accent)]" />
            {s.logoText}
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/actualites" className="text-[var(--text-muted)] no-underline hover:text-white">
              Articles
            </Link>
            <Link href="/#tech" className="text-[var(--text-muted)] no-underline hover:text-white">
              Portfolio
            </Link>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-[760px] px-[5%] py-10 pb-20">
        <Link
          href="/actualites"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] no-underline hover:text-[var(--accent)]"
        >
          <i className="fa-solid fa-arrow-left" /> Tous les articles
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-[rgba(14,165,233,0.12)] px-2.5 py-1 font-semibold uppercase tracking-wide text-[var(--accent)]">
            {article.category}
          </span>
          <time className="text-[var(--text-muted)]" dateTime={article.publishedAt}>
            {formatDateFr(article.publishedAt)}
          </time>
          {article.featured && (
            <span className="rounded bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-300">
              À la une
            </span>
          )}
        </div>

        <h1 className="mb-5 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-white">
          {article.title}
        </h1>

        <p className="mb-8 border-l-2 border-[var(--accent)] pl-4 text-lg leading-relaxed text-[var(--text-muted)]">
          {article.description}
        </p>

        {article.imageUrl && (
          <figure className="mb-10 overflow-hidden rounded-xl border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt=""
              className="max-h-[420px] w-full object-cover"
            />
          </figure>
        )}

        <div className="prose-article space-y-5 text-[1.05rem] leading-[1.8] text-[#e2e8f0]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-[var(--border)] pt-6">
            {article.tags.map((tag) => (
              <span key={tag} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {article.sourceUrl && (
          <p className="mt-6 text-sm text-[var(--text-muted)]">
            Lien connexe :{" "}
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)]"
            >
              {article.source || article.sourceUrl}
            </a>
          </p>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/actualites" className="btn-secondary no-underline">
            ← Retour aux articles
          </Link>
          <Link href="/" className="btn-primary no-underline">
            Accueil portfolio
          </Link>
        </div>

        {related.length > 0 && (
          <aside className="mt-16 border-t border-[var(--border)] pt-10">
            <h2 className="mb-5 text-lg font-bold text-white">Autres articles</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/actualites/${r.id}`}
                  className="card block p-4 no-underline transition hover:border-[var(--border-hover)]"
                >
                  <div className="mb-1 text-xs uppercase text-[var(--accent)]">{r.category}</div>
                  <div className="text-sm font-semibold text-white leading-snug">{r.title}</div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </article>
    </div>
  );
}
