# Portfolio Ariel J. Tshibangu (CMS propriétaire)

Next.js + TypeScript + PostgreSQL + Prisma  
**100 % du contenu** est gérable depuis `/admin` avec ton compte propriétaire.

## Compte propriétaire

Après `npm run db:setup` :

| Champ | Valeur par défaut (dev) |
|-------|-------------------------|
| URL admin | http://localhost:3000/admin |
| Identifiant | `ariel` |
| Mot de passe | `admin123` |

Change-les dans `.env` **avant** le seed, ou via l’onglet **Mon compte** (mot de passe).

```env
ADMIN_USERNAME="ariel"
ADMIN_PASSWORD="change-me-strong-password"
ADMIN_DISPLAY_NAME="Ariel J. Tshibangu"
ADMIN_EMAIL="ariel243tshibangu@gmail.com"
ADMIN_SECRET="long-random-secret"
DATABASE_URL="postgresql://..."
```

## Contenu 100 % éditable

| Onglet admin | Contenu |
|--------------|---------|
| Mon compte | Profil + mot de passe |
| Marque & SEO | Nom site, logo, footer, meta |
| Accueil | Badge, titres, photo, boutons |
| À propos | Textes, CV, domaines d’excellence |
| Éducation | Liste formations (CRUD + publish) |
| Compétences | Blocs stack (CRUD) |
| Infos tech | Cartes techniques (CRUD) |
| Projets | Projets (CRUD) |
| Témoignages | Témoignages validés uniquement (CRUD) |
| Contact | Email, tel, GitHub, Formspree |
| Menu | Liens navbar (CRUD) |

**Pas de commentaires publics.**

## Démarrage

```bash
cd web
npm install

# Docker Desktop démarré
docker compose up -d

npx prisma generate
npm run db:setup
npm run dev
```

- Site : http://localhost:3000  
- Admin : http://localhost:3000/admin  

## Production (Vercel + Neon)

1. Root Directory = `web`
2. Env : `DATABASE_URL`, `ADMIN_*`, `ADMIN_SECRET`
3. Build : `prisma generate && next build`
4. Une fois : `npx prisma db push` + `npm run db:seed` pointant sur la DB prod
