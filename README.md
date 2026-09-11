# Unsplashhh

A mini Unsplash clone: browse, search and save beautiful, freely usable photos powered by the [Unsplash API](https://unsplash.com/documentation).

## Features

- Masonry photo feed in the Unsplash style — images fill the free space based on their aspect ratios
- Two feed layouts (3 and 5 columns) switchable with a toggle, persisted in a cookie so SSR renders the right layout immediately
- Page-based pagination with URL sync and background prefetch of adjacent pages
- Photo details page with author, likes, publish date, views, downloads, location and tags
- Tag pages — clicking a tag opens a collection feed driven by the same logic as the home feed
- Photo search
- Fully server-side rendered, responsive and adaptive at 1440 / 1024 / 768 / 375
- Bonus: basic registration (session cookie) and a profile collection to save / remove photos

## Tech stack

- [Next.js](https://nextjs.org) (App Router, SSR, React Compiler enabled)
- TypeScript
- SCSS modules
- [TanStack Query](https://tanstack.com/query) — client cache hydrated from the server
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) — forms and validation

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` based on [.env.example](.env.example) and set your Unsplash access key:

   ```bash
   cp .env.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script               | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the dev server               |
| `npm run build`      | Production build                   |
| `npm run start`      | Serve the production build         |
| `npm run lint`       | Run ESLint                         |
| `npm run type-check` | Run the TypeScript compiler checks |

A husky `pre-push` hook runs `type-check` and `build` before every push.

## Architecture notes

- **SSR + client cache.** Every page is rendered on the server: feed data is prefetched into a TanStack Query client and dehydrated into the HTML. After hydration, page switches happen client-side through the query cache (with adjacent pages prefetched in the background), while the URL stays shareable and server-renderable.
- **API layer.** All Unsplash requests run on the server (`src/lib/unsplash/api.ts`) with the access key kept out of the browser; responses are cached by the Next.js Data Cache and trimmed to the exact fields the UI needs to keep payloads small. Thin route handlers (`/api/photos`, `/api/search`) expose the same fetchers to the client cache.
- **Performance on slow devices.** The masonry layout is pure CSS (`column-count`) with zero JavaScript, layout shift is prevented via aspect ratios, images load through the Unsplash CDN with a custom `next/image` loader (`auto=format`, exact `sizes` per column layout), dominant-color placeholders show instantly, offscreen cards skip rendering via `content-visibility`, and the React Compiler memoizes components automatically.
- **Constants.** Every non-trivial literal (API config, breakpoints, storage keys, routes, validation limits) lives in `src/constants`.

## Testing recommendations

The most valuable places to add tests, in priority order:

1. **Unit — pure logic** (`vitest`): `getPaginationRange` (window/ellipsis edge cases), `parsePageParam` / `parseColumnCount` (invalid input fallbacks), `unsplashImageLoader` (URL param handling), and the zod schemas.
2. **Unit — collection store**: `collectionStore` toggle/subscribe behavior and storage-event sync between tabs.
3. **Integration — feed** (Testing Library + MSW): `PhotoFeed` pagination flow, loading / error / empty states, and the columns toggle.
4. **E2E** (Playwright): search → results → photo → tag → tag feed journey, registration flow, saving/removing a photo from the profile collection, and an SSR smoke test (photos present in the initial HTML with JS disabled).
