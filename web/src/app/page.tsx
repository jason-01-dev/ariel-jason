import Image from "next/image";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import TechNewsSection from "@/components/TechNewsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();
  const s = content.settings;

  return (
    <>
      <Navbar logoText={s.logoText} links={content.navLinks} />
      <ScrollReveal />

      <header
        id="accueil"
        className="mx-auto flex min-h-[88vh] max-w-[1100px] items-center px-[5%] pb-12 pt-28"
      >
        <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[rgba(14,165,233,0.25)] bg-[rgba(14,165,233,0.08)] px-3.5 py-1.5 text-[0.8rem] font-medium text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {s.heroBadge}
            </div>
            <h1 className="mb-3 text-[clamp(2.1rem,4vw,3rem)] font-bold leading-tight tracking-tight text-white">
              {s.heroGreeting} <span className="text-[var(--accent)]">{s.heroName}</span>
            </h1>
            <h2 className="mb-5 text-xl font-medium text-[var(--text-muted)]">{s.heroSubtitle}</h2>
            <p className="max-w-xl text-[var(--text-muted)]">{s.heroDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={s.heroCtaPrimaryHref} className="btn-primary">
                {s.heroCtaPrimaryLabel} <i className="fa-solid fa-arrow-right" />
              </a>
              <a href={s.heroCtaSecondaryHref} className="btn-secondary">
                {s.heroCtaSecondaryLabel}
              </a>
            </div>
          </div>

          <div className="justify-self-start md:justify-self-center">
            <Image
              src={s.heroPhotoUrl}
              alt={s.heroName}
              width={260}
              height={260}
              className="rounded-xl border border-[var(--border)] object-cover shadow-lg"
              priority
              unoptimized={s.heroPhotoUrl.startsWith("http")}
            />
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="scroll-reveal mx-auto max-w-[1100px] px-[5%] py-16">
          <h2 className="section-title">{s.aboutTitle}</h2>
          <p className="mt-4 mb-10 max-w-xl text-[var(--text-muted)]">{s.aboutIntro}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_2fr]">
            <div className="card p-7">
              <p className="mb-4 whitespace-pre-line">{s.aboutBody1}</p>
              <p className="mb-6 whitespace-pre-line">{s.aboutBody2}</p>
              <div className="flex flex-wrap gap-3">
                <a href={s.aboutCvPdfUrl} download className="btn-secondary">
                  <i className="fa-solid fa-download" /> Télécharger mon CV
                </a>
                <a href={s.aboutCvWebUrl} target="_blank" className="btn-primary" rel="noreferrer">
                  <i className="fa-solid fa-arrow-up-right-from-square" /> Version web
                </a>
              </div>
            </div>

            <div className="card flex flex-col justify-center p-7">
              <h3 className="mb-4 font-bold text-[var(--accent)]">{s.aboutExcellenceTitle}</h3>
              <ul className="flex list-none flex-col gap-3 text-[var(--text-muted)]">
                {s.aboutExcellenceItems.map((item) => (
                  <li key={item}>
                    <i className="fa-solid fa-check mr-2 text-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="education" className="scroll-reveal mx-auto max-w-[1100px] px-[5%] py-16">
          <h2 className="section-title">{s.educationTitle}</h2>
          <p className="mt-4 mb-10 max-w-xl text-[var(--text-muted)]">{s.educationIntro}</p>

          <div className="ml-1.5 flex flex-col border-l-2 border-[var(--border)] pl-6">
            {content.education.map((item) => (
              <div key={item.id} className="relative pb-7 last:pb-0">
                <span className="absolute -left-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-dark)] bg-[var(--accent-strong)] shadow-[0_0_0_1px_var(--border)]" />
                <h3 className="mb-1 text-[1.1rem] font-bold text-white">{item.title}</h3>
                <div className="mb-1.5 text-sm font-medium text-[var(--accent)]">{item.school}</div>
                <p className="text-[var(--text-muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="competences" className="scroll-reveal mx-auto max-w-[1100px] px-[5%] py-16">
          <h2 className="section-title">{s.skillsTitle}</h2>
          <p className="mt-4 mb-10 max-w-xl text-[var(--text-muted)]">{s.skillsIntro}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {content.skills.map((block) => (
              <article key={block.id} className="card p-6">
                <h3 className="mb-3 flex items-center gap-2 text-[1.1rem] font-bold text-[#f1f5f9]">
                  <i className={`${block.icon} text-base text-[var(--accent)]`} />
                  {block.title}
                </h3>
                <p className="text-[0.95rem] text-[var(--text-muted)]">{block.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {block.tags.map((tag) => (
                    <span key={tag} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <TechNewsSection title={s.techTitle} intro={s.techIntro} items={content.tech} />

        <section id="projets" className="scroll-reveal mx-auto max-w-[1100px] px-[5%] py-16">
          <h2 className="section-title">{s.projectsTitle}</h2>
          <p className="mt-4 mb-10 max-w-xl text-[var(--text-muted)]">{s.projectsIntro}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {content.projects.map((p) => (
              <article key={p.id} className="card flex flex-col overflow-hidden">
                {p.showImage && p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="h-44 w-full object-cover bg-[var(--bg-elevated)]"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold text-white">{p.title}</h3>
                    <p className="text-[var(--text-muted)]">{p.description}</p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span key={tag} className="tech-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={p.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] no-underline hover:text-sky-300"
                    >
                      {p.linkLabel} <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <TestimonialsSection
          title={s.testimonialsTitle}
          intro={s.testimonialsIntro}
          items={content.testimonials}
        />

        <section id="contact" className="scroll-reveal mx-auto max-w-[1100px] px-[5%] py-16">
          <h2 className="section-title">{s.contactTitle}</h2>
          <p className="mt-4 mb-10 max-w-xl text-[var(--text-muted)]">{s.contactIntro}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="card p-7">
              <h3 className="mb-3 text-lg font-bold text-white">Coordonnées directes</h3>
              <p className="text-[var(--text-muted)]">
                N&apos;hésitez pas à me joindre par e-mail, téléphone ou via mes réseaux.
              </p>

              <div className="mt-6 flex flex-col gap-2">
                {[
                  {
                    href: `mailto:${s.contactEmail}`,
                    icon: "fa-solid fa-envelope",
                    label: "E-mail",
                    value: s.contactEmail,
                  },
                  {
                    href: s.contactWhatsappUrl,
                    icon: "fa-brands fa-whatsapp",
                    label: "WhatsApp / Téléphone",
                    value: s.contactPhone,
                  },
                  {
                    href: s.contactGithubUrl,
                    icon: "fa-brands fa-github",
                    label: "Profil GitHub",
                    value: s.contactGithubLabel,
                  },
                ].map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-center gap-3 border-b border-[var(--border)] py-3 text-[var(--text-main)] no-underline last:border-0 hover:text-[var(--accent)]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--accent)]">
                      <i className={c.icon} />
                    </div>
                    <div>
                      <div className="text-[0.8rem] text-[var(--text-muted)]">{c.label}</div>
                      <div>{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <ContactForm endpoint={s.contactFormEndpoint} />
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-[var(--border)] bg-[var(--bg-elevated)] px-[5%] py-8 text-center text-sm text-[var(--text-muted)]">
        <p>
          &copy; 2026 {s.siteName}. {s.footerText}
        </p>
      </footer>
    </>
  );
}
