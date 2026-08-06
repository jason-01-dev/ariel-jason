type Item = {
  id: string;
  authorName: string;
  authorRole: string;
  company: string | null;
  content: string;
  rating: number;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mb-3 flex gap-0.5 text-amber-400" aria-label={`Note ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`fa-solid fa-star text-xs ${i < rating ? "" : "opacity-25"}`} />
      ))}
    </div>
  );
}

export default function TestimonialsSection({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: Item[];
}) {
  return (
    <section id="temoignages" className="scroll-reveal mx-auto max-w-[1100px] px-[5%] py-16">
      <h2 className="section-title">{title}</h2>
      <p className="mt-4 mb-10 max-w-xl text-[var(--text-muted)]">{intro}</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((t) => (
          <article key={t.id} className="card flex flex-col p-6">
            <Stars rating={t.rating} />
            <p className="mb-5 flex-1 text-[0.95rem] leading-relaxed text-[var(--text-main)]">
              &ldquo;{t.content}&rdquo;
            </p>
            <div className="border-t border-[var(--border)] pt-4">
              <div className="font-semibold text-white">{t.authorName}</div>
              <div className="text-sm text-[var(--text-muted)]">
                {t.authorRole}
                {t.company ? ` · ${t.company}` : ""}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
