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

- [x] Display course thumbinalUrl
- [ ] Sync my Youtube Course dynamically, include correct playlist thumbinal, correct this thumbnailUrl, fit thumbinal on frontend 

## YouTube playlist import

Set `YOUTUBE_API_KEY` in your local Worker env before using the playlist import form.

Example for `.dev.vars`:

```bash
YOUTUBE_API_KEY=your-youtube-data-api-key
```

The import endpoint is `GET /api/youtube/playlist?playlistId=...`.
It preserves private or unavailable playlist entries when YouTube returns them, but it does not bypass YouTube access control.

## Batch playlist sync script

Use the bash script when you want to sync multiple playlists in one run and save the combined result to a JSON file.

Examples:

```bash
bash scripts/sync-youtube-playlist.sh \
  --playlist "https://www.youtube.com/playlist?list=PLxxxx" \
  --playlist "PLyyyy" \
  --output tmp/youtube-playlists.json \
  --pretty


bash scripts/sync-youtube-playlist.sh \
  --playlist "PLJHKcCDS2DoFAdyJhJkza68NBJC_7sh6-" \
  --output tmp/youtube-playlists.json \
  --pretty
```

```bash
npm run sync:youtube -- \
  --input playlists.txt \
  --output tmp/youtube-playlists.json \
  --pretty
```

`playlists.txt` can contain one playlist URL or playlist ID per line. Blank lines and `#` comments are ignored.

If YouTube does not expose the real playlist cover image you want, add manual overrides in:

- `tmp/youtube-playlist-overrides.json`

Example:

```json
{
  "PLJHKcCDS2DoFAdyJhJkza68NBJC_7sh6-": {
    "thumbnailUrl": "https://i.ytimg.com/pl_c/PLJHKcCDS2DoFAdyJhJkza68NBJC_7sh6-/studio_square_thumbnail.jpg?sqp=..."
  }
}
```

Or pass a custom override file:

```bash
bash scripts/sync-youtube-playlist.sh \
  --playlist "PLJHKcCDS2DoFAdyJhJkza68NBJC_7sh6-" \
  --overrides tmp/youtube-playlist-overrides.json \
  --output tmp/youtube-playlists.json \
  --pretty
```

The script:

- reads `YOUTUBE_API_KEY` from the environment, `.dev.vars`, or `.env`
- fetches playlist metadata, playlist items, and video durations
- supports manual playlist thumbnail overrides
- supports multiple playlist inputs in a single run
- preserves private or unavailable items as placeholders when YouTube returns them

## Build synced playlists into the app

After the sync script writes `tmp/youtube-playlists.json`, generate the browser data file used by the static site:

```bash
npm run build:youtube-data
```

This creates:

- `src/youtube-sync-data.js`

The frontend loads that file automatically and merges the synced playlists into the course catalog.

Typical workflow:

```bash
npm run sync:youtube -- \
  --playlist "PLJHKcCDS2DoFAdyJhJkza68NBJC_7sh6-" \
  --output tmp/youtube-playlists.json \
  --pretty

npm run build:youtube-data
```
