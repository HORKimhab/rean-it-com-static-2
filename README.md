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

## Note

``` bash
# Template course thumbinal
<div class="course-card cursor-pointer group" onclick="openCourse(0)">
  <div class="aspect-[16/9] rounded-sm border border-gray-200 overflow-hidden mb-3 bg-gray-100">
    <img
      src="./images/course-java-spring.jpg"
      alt="Java Spring Boot Full Stack course thumbnail"
      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    >
  </div>
  <div class="min-w-0">
    <h3 class="text-[17px] leading-tight font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
      Java Spring Boot Full Stack: eCommerce Project Masterclass
    </h3>
    <p class="text-sm text-slate-500 truncate">Faisal Memon (EmbarkX), EmbarkX Official</p>
  </div>
</div>
```

## TODO

- [ ] Sync my Youtube Course dynamically 
