Cabinet Frontend — Next.js
==========================

Description
-----------
Frontend Next.js (React) pour l'interface utilisateur du cabinet médical. L'application utilise Next.js (App Router), React, et des composants côté client.

Prérequis
---------
- Node 18+ recommandé
- `npm` ou `pnpm`

Variables d'environnement
-------------------------
- Créez un fichier `.env.local` à la racine de `cabinet_frontend` contenant au minimum:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` (ou l'URL vers votre backend)

Installation
------------
1. `cd cabinet_frontend`
2. `npm install`

Démarrer en développement
-------------------------
- `npm run dev`

Build et production
--------------------
- `npm run build`
- `npm start` ou `npm run start` (selon la configuration dans `package.json`)

Tests et qualité
----------------
- Le projet peut contenir des scripts `lint` ou `test` dans `package.json` — exécutez `npm run lint` / `npm test` si fournis.

Fichiers utiles
---------------
- Pages / App: `src/app`
- Composants réutilisables: `src/components`
- Contexte / hooks: `src/context`, `src/hooks`

Dépannage
---------
- Si le front ne communique pas avec le backend, vérifiez `NEXT_PUBLIC_API_BASE_URL` et les règles CORS du backend (`cabinet/config`).
- Pour des erreurs de build, exécutez `npm run build` localement et lisez les logs produits.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
