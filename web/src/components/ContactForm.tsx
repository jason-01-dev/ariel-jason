"use client";

import { useState, useEffect, FormEvent } from "react";

/**
 * Formulaire monté côté client uniquement pour les champs.
 * Évite les erreurs d'hydratation causées par les extensions
 * (LastPass, Dashlane, etc.) qui injectent data-has-listeners.
 */
export default function ContactForm({ endpoint }: { endpoint: string }) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  // Placeholder stable (même HTML serveur + 1er paint client)
  if (!mounted) {
    return (
      <div className="card flex min-h-[360px] flex-col gap-4 p-7" aria-hidden>
        <h3 className="text-lg font-bold text-white">Envoyer un message</h3>
        <div className="h-11 animate-pulse rounded-lg bg-[var(--bg-elevated)]" />
        <div className="h-11 animate-pulse rounded-lg bg-[var(--bg-elevated)]" />
        <div className="h-28 animate-pulse rounded-lg bg-[var(--bg-elevated)]" />
        <div className="h-11 animate-pulse rounded-lg bg-[var(--accent-strong)]/30" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-4 p-7" suppressHydrationWarning>
      <h3 className="text-lg font-bold text-white">Envoyer un message</h3>
      <div>
        <label className="mb-1.5 block text-[0.85rem] text-[var(--text-muted)]">Votre nom</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Jean Dupont"
          className="form-input"
          autoComplete="name"
          suppressHydrationWarning
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[0.85rem] text-[var(--text-muted)]">Adresse e-mail</label>
        <input
          type="email"
          name="email"
          required
          placeholder="jean@exemple.com"
          className="form-input"
          autoComplete="email"
          suppressHydrationWarning
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[0.85rem] text-[var(--text-muted)]">Message</label>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="Parlons de votre projet..."
          className="form-input min-h-[110px] resize-y"
          suppressHydrationWarning
        />
      </div>
      <button
        type="submit"
        className="btn-primary w-full justify-center border-0"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Envoi..." : "Envoyer le message"}{" "}
        <i className="fa-solid fa-paper-plane" />
      </button>
      {status === "ok" && (
        <p className="text-sm text-emerald-400">Message envoyé. Je vous répondrai rapidement.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">
          Échec de l&apos;envoi. Réessayez ou contactez-moi par e-mail.
        </p>
      )}
    </form>
  );
}
