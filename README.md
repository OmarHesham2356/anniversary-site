# Anniversary Website Template

A private, mobile-first, interactive anniversary website that you can fork,
push one button, and make your own. It unfolds a personal digital love
letter: splash screen → music → relationship timer → memories timeline →
photo gallery → love envelope → letter.

Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS +
Framer Motion + Cloudinary** for private media storage.

> Everything personal lives in **one configuration file**. You never touch
> React components to customize the site.

---

## Features

- **Splash screen** — full-screen opening with a pulsing heart; tapping it
  enters the experience (and starts the music within the same tap, so it
  works on iOS/Android autoplay policies).
- **Relationship timer** — live days / hours / minutes / seconds since your
  start date.
- **Memory timeline** — scroll-revealed milestones with optional photos.
- **Photo gallery** — swipeable, mobile-first gallery with captions.
- **Background music** — autoplaying song with floating play / pause / mute
  controls.
- **Interactive love letter** — a sealed envelope that opens into your letter.
- **Private media** — photos and audio are served from Cloudinary with
  `authenticated` delivery and server-signed URLs, never publicly enumerable.
- **Responsive + accessible** — mobile-first, reduced-motion aware,
  keyboard-friendly.
- **NFC-friendly** — open it from an NFC card or a printed QR code.

---

## Tech stack & architecture

```
GitHub (public template)
        │
        ▼
    Vercel (hosting)
        │
        ▼
   Next.js App (App Router)
        │
   ┌────┴────┐
   │         │
   ▼         ▼
config/   Cloudinary SDK  ── server-only ──   .env.local
anniversaryData.ts          (CLOUDINARY_*)     (gitignored)
   │         │
   └────┬────┘
       ▼
Authenticated Cloudinary media
       │
   signed delivery URLs (server-generated, never exposed secret)
       ▼
    Browser
```

Each person using this template connects their **own Cloudinary account**.
The template never depends on, or knows about, the original author's media.

---

## Requirements

- **Node.js 18+** and **npm** (any recent LTS works).
- A **Cloudinary account** ([cloudinary.com](https://cloudinary.com)) — the
  free plan is plenty.
- **Vercel account** only if you want to deploy (also free).

---

## Quick start

```bash
git clone <your-fork-url>
cd <project-directory>
npm install
```

Then two configuration steps: environment variables and personal content.

### 1. Environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Cloudinary credentials (see
[Cloudinary setup](#cloudinary-setup) below):

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`.env.local` is **gitignored and must never be committed**. These three
variables are **server-only** — the API secret never reaches the browser.

### 2. Personal content

```bash
cp config/anniversaryData.example.ts config/anniversaryData.ts
```

Open `config/anniversaryData.ts` and replace the placeholder values with
your real content. This file is **gitignored**, so your names, dates,
captions, and letter text never end up in the repository.

Then run it:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Cloudinary setup (use YOUR OWN account)

Every photo and the background song are stored privately in **your**
Cloudinary account.

1. **Create a Cloudinary account** at <https://cloudinary.com>.
2. In the **Console → Dashboard**, copy the **Cloud name**, **API Key**, and
   **API Secret** into `.env.local`.
3. **Create an upload preset for private delivery** so photos are stored as
   `authenticated`, never public:
   - Console → Settings → Upload → **Add upload preset**.
   - Name it e.g. `authenticated-media`.
   - Set **Delivery type: authenticated**.
   - Save.
4. **Upload your photos** in Console → **Media Library**:
   - Create folders `relationship` → `relationship/photos`.
   - Upload your photos into `relationship/photos` using the
     `authenticated-media` preset so they are stored privately.
   - Copy each photo's **public ID** (e.g. `relationship/photos/memory-01`).
5. **Upload your background song**:
   - Create a folder `relationship/audio` and upload your MP3 there (using
     the same authenticated preset).
   - Cloudinary treats MP3s as the **video** resource type automatically;
     the site already handles this.
   - Copy the **public ID** (e.g. `relationship/audio/our-song`).
6. Put those public IDs into `config/anniversaryData.ts`.

> Authenticated assets can only be fetched with a valid **signed delivery
> URL**, which the server generates on the fly. This is why the media never
> appears in the HTML or in any public search — even though the site is
> public, the photos stay private.

---

## Customizing the site

Everything you change lives in `config/anniversaryData.ts`. No components
need editing.

| What do you want to change? | Where in `anniversaryData.ts` |
| --- | --- |
| Couple names | `couple.personOne`, `couple.personTwo` (+ nicknames) |
| Relationship start date | `relationship.startDate` |
| Splash screen text | `splash.subtitle`, `splash.startLabel`, `splash.soundHint` |
| Hero intro line | `hero.intro` |
| Section headings | `sectionTitles.timeline`, `sectionTitles.gallery`, `sectionTitles.letter` |
| Timeline milestones | `timeline[]` → `date`, `title`, `description`, optional `imagePublicId` |
| Gallery photos & captions | `gallery[]` → `publicId`, `caption` |
| Background song | `music.publicId`, `music.title`, `music.artist` |
| Love letter | `letter.greeting`, `letter.paragraphs[]`, `letter.signature` |
| Envelope hint | `envelope.tapToOpen` |
| Footer line | `footer.line` |
| Browser tab title / description | `metadata.title`, `metadata.description` |
| Accent colors | `theme.accentColor`, `theme.accentSoftColor` |

### Replace a photo

```ts
gallery: [
  {
    publicId: "relationship/photos/memory-01", // <-- your Cloudinary public ID
    caption: "Our first date",
  },
],
```

Upload the new photo in your Cloudinary Media Library (authenticated
preset), copy its public ID, and paste it in — done. The gallery re-renders
with the new image.

### Replace the song

```ts
music: {
  publicId: "relationship/audio/our-song", // <-- your public ID
  title: "Our Song",
},
```

Same idea — upload your MP3 as an authenticated asset and reference its
public ID.

### Missing photos (optional timeline images / empty captions)

Timeline `imagePublicId` is optional — leave it out for milestones with no
photo. Gallery `caption` is also optional. If an asset can't be found, the
site shows a gentle placeholder heart instead of breaking.

### Accent colors (optional)

The default look is warm roses (`#b3575a`). To re-theme:

```ts
theme: {
  accentColor: "#3b82f6",
  accentSoftColor: "#60a5fa",
},
```

Leave the fields out to keep the defaults.

---

## Deployment (Vercel)

1. Push your repository to GitHub (the template files only).
2. Import the repository on [vercel.com](https://vercel.com/new).
3. Add the **same three environment variables** in the Vercel project
   settings, **Production** and Preview:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Deploy.

> Tip: put your real `config/anniversaryData.ts` contents into the deployed
> project too (e.g. paste it in Vercel or keep it local and deploy from this
> machine). That file is gitignored, so it won't come from GitHub.

---

## Privacy notes

This repository is safe to share. It contains **only** source code, types,
and the placeholder template. The following never get committed:

- `config/anniversaryData.ts` — real names, dates, captions, letter text,
  and Cloudinary public IDs (gitignored)
- `.env.local` — real Cloudinary credentials (gitignored)
- `public/images/*`, `public/audio/*`, `public/videos/*` — personal media
  (gitignored)

The Cloudinary API secret never leaves the server. The `/api/media` route
rejects any public ID that isn't declared in `config/anniversaryData.ts`, so
even with a public site, only your listed assets can be requested — and only
via server-generated signed URLs.

## Project structure

```
app/
  layout.tsx            # fonts, metadata, theme injection
  page.tsx              # renders the experience from the config
  api/media/route.ts    # server-side signed URL generation (whitelisted IDs)
components/
  AnniversaryExperience.tsx
  SplashScreen.tsx
  RelationshipTimer.tsx
  MemoryTimeline.tsx
  PhotoGallery.tsx
  AudioPlayer.tsx
  LoveEnvelope.tsx
  Footer.tsx
  Section.tsx
  ProtectedImage.tsx
config/
  anniversaryData.example.ts   # placeholder template (committed)
  anniversaryData.ts           # YOUR real content (gitignored)
lib/
  cloudinary.ts        # Cloudinary SDK, server-only
  media-url.ts         # client-side signed-URL hook
  anniversary-data.ts  # config access + dev validation
  dates.ts
types/
  anniversary.ts       # config types
```

---

## Troubleshooting

- **Photos show a heart placeholder** — the asset isn't reachable. Make
  sure it was uploaded with the **authenticated** delivery preset, the
  public ID matches exactly, and the three Cloudinary env vars are correct.
- **Music doesn't play** — confirm `music.publicId` exists under a
  `relationship/audio/` public ID (MP3s use the video resource type, which
  the site expects). Browsers block autoplay until the splash heart tap.
- **`/api/media` returns 404** — the public ID is whitelisted but no such
  authenticated asset exists in your account, or the credentials are wrong.
- **Site is blank after clone** — you haven't created
  `config/anniversaryData.ts` yet (run
  `cp config/anniversaryData.example.ts config/anniversaryData.ts`).