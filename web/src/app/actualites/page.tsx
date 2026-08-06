import Link from "next/link";
import { getPublishedArticles, getSiteContent } from "@/lib/data";
import { formatDateFr } from "@/lib/date-fr";

export const dynamic = "force-dynamic";

export default async function ActualitesIndexPage() {
  const [articles, content] = await Promise.all([
    getPublishedArticles(),
    getSiteContent(),
  ]);
  const s = content.settings;

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-[5%] py-4">
          <Link href="/" className="font-bold text-white no-underline hover:text-[var(--accent)]">
            <i className="fa-solid fa-code mr-2 text-[var(--accent)]" />
            {s.logoText}
          </Link>
          <Link href="/#tech" className="text-sm text-[var(--text-muted)] no-underline hover:text-white">
            ← Portfolio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-[5%] py-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          Publications
        </p>
        <h1 className="mb-3 text-3xl font-bold text-white">{s.techTitle}</h1>
        <p className="mb-10 max-w-2xl text-[var(--text-muted)]">{s.techIntro}</p>

        {articles.length === 0 ? (
          <div className="card p-8 text-center text-[var(--text-muted)]">
            Aucun article pour le moment.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/actualites/${a.id}`}
                className="card group flex flex-col overflow-hidden no-underline transition hover:border-[var(--border-hover)] sm:flex-row"
              >
                {a.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.imageUrl}
                    alt=""
                    className="h-44 w-full object-cover sm:h-auto sm:w-52"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-[var(--bg-elevated)] text-[var(--accent)] sm:h-auto sm:w-52">
                    <i className="fa-solid fa-newspaper text-2xl opacity-50" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                    <span className="font-semibold uppercase text-[var(--accent)]">{a.category}</span>
                    <span>{formatDateFr(a.publishedAt)}</span>
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-white group-hover:text-[var(--accent)]">
                    {a.title}
                  </h2>
                  <p className="line-clamp-2 flex-1 text-sm text-[var(--text-muted)]">
                    {a.description}
                  </p>
                  <span className="mt-3 text-sm font-semibold text-[var(--accent)]">
                    Lire l&apos;article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
