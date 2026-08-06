"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

type Tab =
  | "account"
  | "brand"
  | "hero"
  | "about"
  | "education"
  | "skills"
  | "tech"
  | "projects"
  | "testimonials"
  | "contact"
  | "nav";

const TABS: { id: Tab; label: string }[] = [
  { id: "account", label: "Mon compte" },
  { id: "brand", label: "Marque & SEO" },
  { id: "hero", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "education", label: "Éducation" },
  { id: "skills", label: "Compétences" },
  { id: "tech", label: "Articles" },
  { id: "projects", label: "Projets" },
  { id: "testimonials", label: "Témoignages" },
  { id: "contact", label: "Contact" },
  { id: "nav", label: "Menu" },
];

type Settings = Record<string, unknown>;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("hero");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    username: "",
    displayName: "",
    email: "",
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "" });
  const [settings, setSettings] = useState<Settings>({});
  const [education, setEducation] = useState<Record<string, unknown>[]>([]);
  const [skills, setSkills] = useState<Record<string, unknown>[]>([]);
  const [tech, setTech] = useState<Record<string, unknown>[]>([]);
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([]);
  const [nav, setNav] = useState<Record<string, unknown>[]>([]);

  const [eduForm, setEduForm] = useState({
    title: "",
    school: "",
    description: "",
    published: true,
  });
  const [skillForm, setSkillForm] = useState({
    title: "",
    description: "",
    icon: "fa-solid fa-code",
    tags: "",
    published: true,
  });
  const [techForm, setTechForm] = useState({
    category: "Notes",
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    source: "",
    sourceUrl: "",
    tags: "",
    featured: false,
    published: true,
  });
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tags: "",
    linkLabel: "Voir le projet",
    linkUrl: "#",
    imageUrl: "",
    showImage: true,
    published: true,
  });
  const [tForm, setTForm] = useState({
    authorName: "",
    authorRole: "",
    company: "",
    content: "",
    rating: 5,
    published: true,
  });
  const [navForm, setNavForm] = useState({ label: "", href: "#", published: true });
  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3500);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const me = await fetch("/api/auth/me");
      if (!me.ok) {
        setAuthed(false);
        return;
      }
      const meData = await me.json();
      setProfile({
        username: meData.username,
        displayName: meData.displayName || "",
        email: meData.email || "",
      });
      setAuthed(true);

      const [s, e, sk, te, pr, tm, n] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/education"),
        fetch("/api/skills"),
        fetch("/api/tech"),
        fetch("/api/projects"),
        fetch("/api/testimonials"),
        fetch("/api/nav"),
      ]);

      if (s.ok) setSettings(await s.json());
      if (e.ok) setEducation(await e.json());
      if (sk.ok) setSkills(await sk.json());
      if (te.ok) setTech(await te.json());
      if (pr.ok) setProjects(await pr.json());
      if (tm.ok) setTestimonials(await tm.json());
      if (n.ok) setNav(await n.json());
    } catch {
      flash("Erreur de chargement (DB / session).");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setLoginError("Identifiant ou mot de passe incorrect.");
      return;
    }
    setPassword("");
    await loadAll();
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      /* ignore */
    }
    setAuthed(false);
    setSettings({});
    setEducation([]);
    setSkills([]);
    setTech([]);
    setProjects([]);
    setTestimonials([]);
    setNav([]);
    window.location.href = "/admin";
  }

  function goToSite() {
    window.location.href = "/";
  }

  async function saveSettings(e?: FormEvent) {
    e?.preventDefault();
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setSettings(await res.json());
      flash("Paramètres enregistrés.");
    } else flash("Échec de la sauvegarde.");
  }

  function setField(key: string, value: unknown) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: profile.displayName,
        email: profile.email,
      }),
    });
    if (res.ok) flash("Profil mis à jour.");
    else flash("Échec mise à jour profil.");
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pwdForm),
    });
    if (res.ok) {
      setPwdForm({ currentPassword: "", newPassword: "" });
      flash("Mot de passe changé.");
    } else {
      const err = await res.json().catch(() => ({}));
      flash(err.error || "Échec changement mot de passe.");
    }
  }

  async function crudCreate(url: string, body: unknown, reload: () => Promise<void>) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      flash("Élément ajouté.");
      await reload();
    } else flash("Échec création.");
  }

  async function crudPatch(url: string, body: unknown) {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      flash("Mis à jour.");
      await loadAll();
    } else flash("Échec mise à jour.");
  }

  async function crudDelete(url: string) {
    if (!confirm("Supprimer cet élément ?")) return;
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok) {
      flash("Supprimé.");
      await loadAll();
    } else flash("Échec suppression.");
  }

  const input = "form-input";
  const label = "mb-1 block text-xs text-[var(--text-muted)]";
  const field = (key: string, lab: string, multiline = false) => (
    <div key={key}>
      <label className={label}>{lab}</label>
      {multiline ? (
        <textarea
          className={`${input} min-h-[90px]`}
          value={String(settings[key] ?? "")}
          onChange={(e) => setField(key, e.target.value)}
        />
      ) : (
        <input
          className={input}
          value={String(settings[key] ?? "")}
          onChange={(e) => setField(key, e.target.value)}
        />
      )}
    </div>
  );

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <h1 className="mb-1 text-2xl font-bold text-white">Compte propriétaire</h1>
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          Connecte-toi pour modifier 100 % du contenu du portfolio.
        </p>
        <form onSubmit={login} className="card flex flex-col gap-4 p-6">
          <div>
            <label className={label}>Identifiant</label>
            <input
              className={input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className={label}>Mot de passe</label>
            <input
              type="password"
              className={input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {loginError && <p className="text-sm text-red-400">{loginError}</p>}
          <button type="submit" className="btn-primary justify-center border-0">
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          Par défaut après seed : <code>ariel</code> / <code>admin123</code>
        </p>
        <button
          type="button"
          onClick={goToSite}
          className="mt-3 text-center text-sm text-[var(--accent)] underline-offset-2 hover:underline"
        >
          ← Retour au site
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Administration</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {profile.displayName || profile.username} · contrôle total du site
          </p>
        </div>
        <div className="relative z-20 flex gap-2">
          <button type="button" onClick={goToSite} className="btn-secondary">
            Voir le site
          </button>
          <button type="button" onClick={logout} className="btn-secondary">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id ? "btn-primary border-0 py-2 text-sm" : "btn-secondary py-2 text-sm"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {message && <p className="mb-4 text-sm text-emerald-400">{message}</p>}
      {loading && <p className="mb-4 text-sm text-[var(--text-muted)]">Chargement…</p>}

      {/* ACCOUNT */}
      {tab === "account" && (
        <div className="space-y-6">
          <form onSubmit={saveProfile} className="card grid gap-3 p-6 md:grid-cols-2">
            <h2 className="md:col-span-2 text-lg font-bold text-white">Profil propriétaire</h2>
            <div>
              <label className={label}>Identifiant (non modifiable)</label>
              <input className={input} value={profile.username} disabled />
            </div>
            <div>
              <label className={label}>Nom affiché</label>
              <input
                className={input}
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={label}>E-mail</label>
              <input
                className={input}
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
              Enregistrer le profil
            </button>
          </form>

          <form onSubmit={changePassword} className="card grid gap-3 p-6 md:grid-cols-2">
            <h2 className="md:col-span-2 text-lg font-bold text-white">Changer le mot de passe</h2>
            <div>
              <label className={label}>Mot de passe actuel</label>
              <input
                type="password"
                className={input}
                value={pwdForm.currentPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={label}>Nouveau mot de passe</label>
              <input
                type="password"
                className={input}
                value={pwdForm.newPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>
      )}

      {/* BRAND */}
      {tab === "brand" && (
        <form onSubmit={saveSettings} className="card grid gap-3 p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-bold text-white">Marque & SEO</h2>
          {field("siteName", "Nom du site")}
          {field("logoText", "Texte logo navbar")}
          {field("footerText", "Texte footer")}
          {field("metaTitle", "Titre SEO (onglet navigateur)")}
          <div className="md:col-span-2">{field("metaDescription", "Description SEO", true)}</div>
          <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
            Enregistrer
          </button>
        </form>
      )}

      {/* HERO */}
      {tab === "hero" && (
        <form onSubmit={saveSettings} className="card grid gap-3 p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-bold text-white">Section Accueil</h2>
          {field("heroBadge", "Badge disponibilité")}
          {field("heroGreeting", "Salutation (ex: Bonjour, je suis)")}
          {field("heroName", "Nom mis en avant")}
          {field("heroSubtitle", "Sous-titre / métier")}
          <div className="md:col-span-2">{field("heroDescription", "Description", true)}</div>
          <div className="md:col-span-2">
            <ImageUpload
              label="Photo de présentation (modifiable)"
              value={String(settings.heroPhotoUrl ?? "")}
              onChange={(url) => setField("heroPhotoUrl", url || "/images/ariel.jpg")}
              previewClassName="h-48 w-48 rounded-xl object-cover"
            />
          </div>
          {field("heroCtaPrimaryLabel", "Bouton principal — texte")}
          {field("heroCtaPrimaryHref", "Bouton principal — lien")}
          {field("heroCtaSecondaryLabel", "Bouton secondaire — texte")}
          {field("heroCtaSecondaryHref", "Bouton secondaire — lien")}
          <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
            Enregistrer l&apos;accueil
          </button>
        </form>
      )}

      {/* ABOUT */}
      {tab === "about" && (
        <form onSubmit={saveSettings} className="card grid gap-3 p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-bold text-white">Section À propos</h2>
          {field("aboutTitle", "Titre section")}
          {field("aboutIntro", "Intro", true)}
          <div className="md:col-span-2">{field("aboutBody1", "Paragraphe 1", true)}</div>
          <div className="md:col-span-2">{field("aboutBody2", "Paragraphe 2", true)}</div>
          {field("aboutCvPdfUrl", "Lien CV PDF")}
          {field("aboutCvWebUrl", "Lien CV web")}
          {field("aboutExcellenceTitle", "Titre domaines d'excellence")}
          <div className="md:col-span-2">
            <label className={label}>Domaines d&apos;excellence (1 par ligne)</label>
            <textarea
              className={`${input} min-h-[110px]`}
              value={
                Array.isArray(settings.aboutExcellenceItems)
                  ? (settings.aboutExcellenceItems as string[]).join("\n")
                  : String(settings.aboutExcellenceItems ?? "")
              }
              onChange={(e) => setField("aboutExcellenceItems", e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
            Enregistrer à propos
          </button>
        </form>
      )}

      {/* EDUCATION */}
      {tab === "education" && (
        <div className="space-y-6">
          <form onSubmit={saveSettings} className="card grid gap-3 p-6">
            <h2 className="text-lg font-bold text-white">Titres de section</h2>
            {field("educationTitle", "Titre")}
            {field("educationIntro", "Intro", true)}
            <button type="submit" className="btn-primary border-0 justify-center">
              Enregistrer titres
            </button>
          </form>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await crudCreate("/api/education", eduForm, loadAll);
              setEduForm({ title: "", school: "", description: "", published: true });
            }}
            className="card grid gap-3 p-6 md:grid-cols-2"
          >
            <h2 className="md:col-span-2 text-lg font-bold text-white">Ajouter une formation</h2>
            <input
              className={input}
              placeholder="Diplôme / titre"
              value={eduForm.title}
              onChange={(e) => setEduForm({ ...eduForm, title: e.target.value })}
              required
            />
            <input
              className={input}
              placeholder="École"
              value={eduForm.school}
              onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
              required
            />
            <textarea
              className={`${input} md:col-span-2 min-h-[80px]`}
              placeholder="Description"
              value={eduForm.description}
              onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
              Ajouter
            </button>
          </form>

          <div className="space-y-3">
            {education.map((item) => (
              <div key={String(item.id)} className="card p-5">
                <div className="font-semibold text-white">{String(item.title)}</div>
                <div className="text-sm text-[var(--accent)]">{String(item.school)}</div>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{String(item.description)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-secondary py-2 text-sm"
                    onClick={() =>
                      crudPatch(`/api/education/${item.id}`, { published: !item.published })
                    }
                  >
                    {item.published ? "Dépublier" : "Publier"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary py-2 text-sm text-red-300"
                    onClick={() => crudDelete(`/api/education/${item.id}`)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS */}
      {tab === "skills" && (
        <div className="space-y-6">
          <form onSubmit={saveSettings} className="card grid gap-3 p-6">
            <h2 className="text-lg font-bold text-white">Titres de section</h2>
            {field("skillsTitle", "Titre")}
            {field("skillsIntro", "Intro", true)}
            <button type="submit" className="btn-primary border-0 justify-center">
              Enregistrer titres
            </button>
          </form>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await crudCreate("/api/skills", skillForm, loadAll);
              setSkillForm({
                title: "",
                description: "",
                icon: "fa-solid fa-code",
                tags: "",
                published: true,
              });
            }}
            className="card grid gap-3 p-6 md:grid-cols-2"
          >
            <h2 className="md:col-span-2 text-lg font-bold text-white">Ajouter un bloc compétences</h2>
            <input
              className={input}
              placeholder="Titre"
              value={skillForm.title}
              onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
              required
            />
            <input
              className={input}
              placeholder="Icône FA"
              value={skillForm.icon}
              onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
            />
            <textarea
              className={`${input} md:col-span-2 min-h-[80px]`}
              placeholder="Description"
              value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              required
            />
            <input
              className={`${input} md:col-span-2`}
              placeholder="Tags (virgules)"
              value={skillForm.tags}
              onChange={(e) => setSkillForm({ ...skillForm, tags: e.target.value })}
            />
            <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
              Ajouter
            </button>
          </form>

          <div className="space-y-3">
            {skills.map((item) => (
              <div key={String(item.id)} className="card p-5">
                <div className="font-semibold text-white">
                  <i className={`${String(item.icon)} mr-2 text-[var(--accent)]`} />
                  {String(item.title)}
                </div>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{String(item.description)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-secondary py-2 text-sm"
                    onClick={() =>
                      crudPatch(`/api/skills/${item.id}`, { published: !item.published })
                    }
                  >
                    {item.published ? "Dépublier" : "Publier"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary py-2 text-sm text-red-300"
                    onClick={() => crudDelete(`/api/skills/${item.id}`)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARTICLES (contenu propriétaire uniquement) */}
      {tab === "tech" && (
        <div className="space-y-6">
          <form onSubmit={saveSettings} className="card grid gap-3 p-6">
            <h2 className="text-lg font-bold text-white">Rubrique Articles</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Espace 100 % personnel : tes analyses et notes. Les visiteurs ouvrent chaque article
              sur une page de lecture dédiée.
            </p>
            {field("techTitle", "Titre de la rubrique")}
            {field("techIntro", "Introduction", true)}
            <button type="submit" className="btn-primary border-0 justify-center">
              Enregistrer titres
            </button>
          </form>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await crudCreate(
                "/api/tech",
                {
                  ...techForm,
                  imageUrl: techForm.imageUrl || null,
                  source: techForm.source || null,
                  sourceUrl: techForm.sourceUrl || null,
                  tags: techForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
                  origin: "manual",
                },
                loadAll
              );
              setTechForm({
                category: "Notes",
                title: "",
                description: "",
                content: "",
                imageUrl: "",
                source: "",
                sourceUrl: "",
                tags: "",
                featured: false,
                published: true,
              });
            }}
            className="card grid gap-3 p-6 md:grid-cols-2"
          >
            <h2 className="md:col-span-2 text-lg font-bold text-white">Nouvel article</h2>
            <input
              className={input}
              placeholder="Catégorie (Cybersécurité, Dev, Opinion…)"
              value={techForm.category}
              onChange={(e) => setTechForm({ ...techForm, category: e.target.value })}
              required
            />
            <input
              className={input}
              placeholder="Titre"
              value={techForm.title}
              onChange={(e) => setTechForm({ ...techForm, title: e.target.value })}
              required
            />
            <textarea
              className={`${input} md:col-span-2 min-h-[80px]`}
              placeholder="Chapô / résumé (affiché sur la carte et en intro)"
              value={techForm.description}
              onChange={(e) => setTechForm({ ...techForm, description: e.target.value })}
              required
            />
            <textarea
              className={`${input} md:col-span-2 min-h-[180px]`}
              placeholder="Corps de l'article (texte complet lu par les visiteurs — un paragraphe par ligne)"
              value={techForm.content}
              onChange={(e) => setTechForm({ ...techForm, content: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <ImageUpload
                label="Image de couverture"
                value={techForm.imageUrl}
                onChange={(url) => setTechForm({ ...techForm, imageUrl: url })}
              />
            </div>
            <input
              className={input}
              placeholder="Lien connexe (optionnel)"
              value={techForm.sourceUrl}
              onChange={(e) => setTechForm({ ...techForm, sourceUrl: e.target.value })}
            />
            <input
              className={input}
              placeholder="Libellé du lien (optionnel)"
              value={techForm.source}
              onChange={(e) => setTechForm({ ...techForm, source: e.target.value })}
            />
            <input
              className={`${input} md:col-span-2`}
              placeholder="Tags (virgules)"
              value={techForm.tags}
              onChange={(e) => setTechForm({ ...techForm, tags: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <input
                type="checkbox"
                checked={techForm.featured}
                onChange={(e) => setTechForm({ ...techForm, featured: e.target.checked })}
              />
              Mettre à la une
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <input
                type="checkbox"
                checked={techForm.published}
                onChange={(e) => setTechForm({ ...techForm, published: e.target.checked })}
              />
              Publier
            </label>
            <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
              Publier l&apos;article
            </button>
          </form>

          <div className="space-y-3">
            {tech.map((item) => (
              <div key={String(item.id)} className="card overflow-hidden md:flex">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={String(item.imageUrl)}
                    alt=""
                    className="h-36 w-full object-cover md:h-auto md:w-44"
                  />
                ) : null}
                <div className="flex-1 p-5">
                  <div className="text-xs uppercase text-[var(--accent)]">
                    {String(item.category)}
                    {item.featured ? " · À la une" : ""}
                  </div>
                  <div className="font-semibold text-white">{String(item.title)}</div>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{String(item.description)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/actualites/${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary py-2 text-sm no-underline"
                    >
                      Lire
                    </a>
                    <button
                      type="button"
                      className="btn-secondary py-2 text-sm"
                      onClick={() =>
                        crudPatch(`/api/tech/${item.id}`, { published: !item.published })
                      }
                    >
                      {item.published ? "Dépublier" : "Publier"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary py-2 text-sm"
                      onClick={() =>
                        crudPatch(`/api/tech/${item.id}`, { featured: !item.featured })
                      }
                    >
                      {item.featured ? "Retirer de la une" : "Mettre à la une"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary py-2 text-sm text-red-300"
                      onClick={() => crudDelete(`/api/tech/${item.id}`)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {tab === "projects" && (
        <div className="space-y-6">
          <form onSubmit={saveSettings} className="card grid gap-3 p-6">
            <h2 className="text-lg font-bold text-white">Titres de section</h2>
            {field("projectsTitle", "Titre")}
            {field("projectsIntro", "Intro", true)}
            <button type="submit" className="btn-primary border-0 justify-center">
              Enregistrer titres
            </button>
          </form>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await crudCreate(
                "/api/projects",
                {
                  ...projectForm,
                  imageUrl: projectForm.imageUrl || null,
                },
                loadAll
              );
              setProjectForm({
                title: "",
                description: "",
                tags: "",
                linkLabel: "Voir le projet",
                linkUrl: "#",
                imageUrl: "",
                showImage: true,
                published: true,
              });
            }}
            className="card grid gap-3 p-6 md:grid-cols-2"
          >
            <h2 className="md:col-span-2 text-lg font-bold text-white">Ajouter un projet</h2>
            <input
              className={input}
              placeholder="Titre"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              required
            />
            <input
              className={input}
              placeholder="Tags (virgules)"
              value={projectForm.tags}
              onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
            />
            <textarea
              className={`${input} md:col-span-2 min-h-[80px]`}
              placeholder="Description"
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              required
            />
            <input
              className={input}
              placeholder="Libellé lien"
              value={projectForm.linkLabel}
              onChange={(e) => setProjectForm({ ...projectForm, linkLabel: e.target.value })}
            />
            <input
              className={input}
              placeholder="URL lien"
              value={projectForm.linkUrl}
              onChange={(e) => setProjectForm({ ...projectForm, linkUrl: e.target.value })}
            />
            <div className="md:col-span-2">
              <ImageUpload
                label="Photo du projet"
                value={projectForm.imageUrl}
                onChange={(url) => setProjectForm({ ...projectForm, imageUrl: url })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)] md:col-span-2">
              <input
                type="checkbox"
                checked={projectForm.showImage}
                onChange={(e) => setProjectForm({ ...projectForm, showImage: e.target.checked })}
              />
              Afficher la photo sur le site public
            </label>
            <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
              Ajouter
            </button>
          </form>

          <div className="space-y-3">
            {projects.map((item) => (
              <div key={String(item.id)} className="card overflow-hidden md:flex">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={String(item.imageUrl)}
                    alt=""
                    className="h-36 w-full object-cover md:h-auto md:w-40"
                  />
                ) : null}
                <div className="flex-1 p-5">
                  <div className="font-semibold text-white">{String(item.title)}</div>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{String(item.description)}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Photo : {item.showImage ? "affichée" : "masquée"}
                    {!item.imageUrl ? " · aucune image" : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-secondary py-2 text-sm"
                      onClick={() =>
                        crudPatch(`/api/projects/${item.id}`, { published: !item.published })
                      }
                    >
                      {item.published ? "Dépublier" : "Publier"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary py-2 text-sm"
                      onClick={() =>
                        crudPatch(`/api/projects/${item.id}`, { showImage: !item.showImage })
                      }
                    >
                      {item.showImage ? "Masquer la photo" : "Montrer la photo"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary py-2 text-sm text-red-300"
                      onClick={() => crudDelete(`/api/projects/${item.id}`)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {tab === "testimonials" && (
        <div className="space-y-6">
          <form onSubmit={saveSettings} className="card grid gap-3 p-6">
            <h2 className="text-lg font-bold text-white">Titres de section</h2>
            {field("testimonialsTitle", "Titre")}
            {field("testimonialsIntro", "Intro", true)}
            <button type="submit" className="btn-primary border-0 justify-center">
              Enregistrer titres
            </button>
          </form>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await crudCreate(
                "/api/testimonials",
                { ...tForm, company: tForm.company || null },
                loadAll
              );
              setTForm({
                authorName: "",
                authorRole: "",
                company: "",
                content: "",
                rating: 5,
                published: true,
              });
            }}
            className="card grid gap-3 p-6 md:grid-cols-2"
          >
            <h2 className="md:col-span-2 text-lg font-bold text-white">Ajouter un témoignage</h2>
            <input
              className={input}
              placeholder="Nom"
              value={tForm.authorName}
              onChange={(e) => setTForm({ ...tForm, authorName: e.target.value })}
              required
            />
            <input
              className={input}
              placeholder="Rôle"
              value={tForm.authorRole}
              onChange={(e) => setTForm({ ...tForm, authorRole: e.target.value })}
              required
            />
            <input
              className={`${input} md:col-span-2`}
              placeholder="Entreprise"
              value={tForm.company}
              onChange={(e) => setTForm({ ...tForm, company: e.target.value })}
            />
            <textarea
              className={`${input} md:col-span-2 min-h-[90px]`}
              placeholder="Citation"
              value={tForm.content}
              onChange={(e) => setTForm({ ...tForm, content: e.target.value })}
              required
            />
            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              Note
              <select
                className={`${input} w-auto`}
                value={tForm.rating}
                onChange={(e) => setTForm({ ...tForm, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <input
                type="checkbox"
                checked={tForm.published}
                onChange={(e) => setTForm({ ...tForm, published: e.target.checked })}
              />
              Publier
            </label>
            <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
              Ajouter
            </button>
          </form>

          <div className="space-y-3">
            {testimonials.map((item) => (
              <div key={String(item.id)} className="card p-5">
                <div className="font-semibold text-white">{String(item.authorName)}</div>
                <div className="text-sm text-[var(--text-muted)]">
                  {String(item.authorRole)}
                  {item.company ? ` · ${String(item.company)}` : ""}
                </div>
                <p className="mt-2 text-sm">{String(item.content)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-secondary py-2 text-sm"
                    onClick={() =>
                      crudPatch(`/api/testimonials/${item.id}`, {
                        published: !item.published,
                      })
                    }
                  >
                    {item.published ? "Dépublier" : "Publier"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary py-2 text-sm text-red-300"
                    onClick={() => crudDelete(`/api/testimonials/${item.id}`)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTACT */}
      {tab === "contact" && (
        <form onSubmit={saveSettings} className="card grid gap-3 p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-bold text-white">Section Contact</h2>
          {field("contactTitle", "Titre")}
          <div className="md:col-span-2">{field("contactIntro", "Intro", true)}</div>
          {field("contactEmail", "E-mail")}
          {field("contactPhone", "Téléphone affiché")}
          {field("contactWhatsappUrl", "URL WhatsApp")}
          {field("contactGithubUrl", "URL GitHub")}
          {field("contactGithubLabel", "Label GitHub affiché")}
          {field("contactFormEndpoint", "Endpoint formulaire (Formspree)")}
          <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
            Enregistrer contact
          </button>
        </form>
      )}

      {/* NAV */}
      {tab === "nav" && (
        <div className="space-y-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await crudCreate("/api/nav", navForm, loadAll);
              setNavForm({ label: "", href: "#", published: true });
            }}
            className="card grid gap-3 p-6 md:grid-cols-2"
          >
            <h2 className="md:col-span-2 text-lg font-bold text-white">Lien de menu</h2>
            <input
              className={input}
              placeholder="Libellé"
              value={navForm.label}
              onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
              required
            />
            <input
              className={input}
              placeholder="Lien (#about, /page...)"
              value={navForm.href}
              onChange={(e) => setNavForm({ ...navForm, href: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary border-0 md:col-span-2 justify-center">
              Ajouter au menu
            </button>
          </form>

          <div className="space-y-3">
            {nav.map((item) => (
              <div
                key={String(item.id)}
                className="card flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <span className="font-semibold text-white">{String(item.label)}</span>
                  <span className="ml-2 text-sm text-[var(--text-muted)]">{String(item.href)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-secondary py-2 text-sm"
                    onClick={() =>
                      crudPatch(`/api/nav/${item.id}`, { published: !item.published })
                    }
                  >
                    {item.published ? "Masquer" : "Afficher"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary py-2 text-sm text-red-300"
                    onClick={() => crudDelete(`/api/nav/${item.id}`)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
