# Frise Mecquoise

Application Vue 3 + Vite pour afficher une frise chronologique de la période mecquoise de la Sîra.

Le projet est désormais structuré pour la production avec :

- un **frontend** Vue hébergé sur Vercel,
- un **backend Node.js** dans `backend/`,
- des **liens personnalisés par professeur**,
- un chargement des chapitres via API.

## Structure

```text
src/       Frontend Vue
backend/   API Node.js
```

## Prérequis

- Node.js 20+
- npm

## Installation

```powershell
npm install
```

Si tu veux exécuter aussi le backend localement :

```powershell
Set-Location backend
npm install
```

## Configuration

Copie les exemples d’environnement :

```powershell
Copy-Item .env.example .env.local
Copy-Item backend\.env.example backend\.env
```

Adapte ensuite :

- `VITE_API_BASE_URL` vers l’URL du backend
- `VITE_DEFAULT_TEACHER_SLUG` vers le profil de démonstration

## Développement

### Frontend seul

```powershell
npm run dev
```

### Backend seul

```powershell
npm --prefix backend run dev
```

### Frontend + backend en parallèle

```powershell
npm run dev:full
```

## Production

### Build frontend

```powershell
npm run build
```

### Lancer le backend en production

```powershell
npm --prefix backend run start
```

## Routes backend

- `GET /api/health`
- `GET /api/teachers`
- `GET /api/teachers/:slug`
- `GET /api/teachers/:slug/timeline`
- `GET /api/chapters`
- `GET /api/chapters/:id`

## Exemple de liens enseignants

- `/t/prof-demo`
- `/t/prof-amine`
- `/t/prof-sara`
- `/t/prof-hassan`

Chaque lien charge uniquement les chapitres autorisés pour ce professeur.

