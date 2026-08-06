type Item = {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
};

export default function TechSection({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: Item[];
}) {
  return (
    <section id="tech" className="scroll-reveal mx-auto max-w-[1100px] px-[5%] py-16">
      <h2 className="section-title">{title}</h2>
      <p className="mt-4 mb-10 max-w-xl text-[var(--text-muted)]">{intro}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="card p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              {item.category}
            </div>
            <h3 className="mb-2 flex items-center gap-2 text-[1.1rem] font-bold text-[#f1f5f9]">
              <i className={`${item.icon} text-base text-[var(--accent)]`} />
              {item.title}
            </h3>
            <p className="text-[0.95rem] text-[var(--text-muted)]">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="tech-tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
