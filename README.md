# Cloudflare Worker Deploy Guide

This project deploys a Cloudflare Worker that serves `src/index.html` through `src/index.js`.

## Required files

Keep these files and directories in the repository:

- `src/`
- `wrangler.toml`
- `package.json`
- `.nvmrc`
- `.env.example`
- `.github/workflows/deploy.yml`
- `.gitignore`

Local-only files are ignored by `.gitignore`, including:

- `node_modules/`
- `.wrangler/`
- `.env`
- `.dev.vars`
- `dist/`
- `coverage/`

## Push to GitHub

Use Node.js version from `.nvmrc`:

```bash
nvm use
```

Commit and push:

```bash
git add .
git commit -m "Setup Cloudflare Worker deployment"
git push origin main
```

## Deploy to Cloudflare manually

Install dependencies:

```bash
npm install
```

Optional local development:

```bash
npm run dev
```

Dry run:

```bash
npm run deploy:dry-run
```

Deploy:

```bash
npm run deploy
```

Before manual deploy, authenticate Wrangler or provide credentials through environment variables.

## Deploy from GitHub Actions

The workflow file is:

- `.github/workflows/deploy.yml`

It supports:

- manual deploy from the GitHub Actions tab only

Add these repository secrets in GitHub:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Then run:

1. Open `Actions` > `Deploy Worker` > `Run workflow`

## How Cloudflare upload is limited

`wrangler.toml` is configured so Cloudflare only receives the Worker entry and imported modules:

- `src/index.js`
- `src/index.html`

GitHub file selection is controlled separately by `.gitignore`.
