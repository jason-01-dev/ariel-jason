# Déploiement production

## Architecture

- **App** : Next.js dans le dossier `web/`
- **Hébergement** : Vercel (Root Directory = `web`)
- **Base** : PostgreSQL managée (**Neon** recommandé, gratuit)

## 1. Postgres Neon (une fois)

1. Crée un compte : https://console.neon.tech  
2. Nouveau projet → copie la **connection string** (avec `?sslmode=require`)  
3. En local (optionnel) pour initialiser les tables :

```bash
cd web
# .env.production.local (ne pas commit)
DATABASE_URL="postgresql://...@...neon.tech/neondb?sslmode=require"
ADMIN_USERNAME="ariel"
ADMIN_PASSWORD="TON_MOT_DE_PASSE_FORT"
ADMIN_DISPLAY_NAME="Ariel J. Tshibangu"
ADMIN_EMAIL="ariel243tshibangu@gmail.com"
ADMIN_SECRET="long-random-hex"

npx prisma db push
npx tsx prisma/seed.ts
```

## 2. Variables Vercel

Project Settings → Environment Variables (Production) :

| Variable | Exemple |
|----------|---------|
| `DATABASE_URL` | URL Neon avec sslmode=require |
| `ADMIN_USERNAME` | `ariel` |
| `ADMIN_PASSWORD` | mot de passe fort |
| `ADMIN_DISPLAY_NAME` | Ariel J. Tshibangu |
| `ADMIN_EMAIL` | ton email |
| `ADMIN_SECRET` | 64+ caractères aléatoires |

## 3. Projet Vercel

- **Root Directory** : `web`  
- **Framework** : Next.js  
- **Build** : `prisma generate && next build` (déjà dans `package.json`)  
- **Install** : `npm install`  

Si le repo est déjà lié à Vercel, un `git push` sur `main` redéploie.

## 4. Admin en ligne

`https://ton-domaine.vercel.app/admin`

## Notes

- Les uploads locaux (`/public/uploads`) ne persistent **pas** sur Vercel : utilise des **URLs d’images** (ou Cloudinary).  
- Ne commit jamais `.env`.
