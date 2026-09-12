# Unsplashhh

A mini Unsplash clone: browse, search and save beautiful, freely usable photos powered by the [Unsplash API](https://unsplash.com/documentation).

**Live demo:** [unsplashhh.vercel.app](https://unsplashhh.vercel.app)

## Features

- Masonry photo feed in the Unsplash style — images fill the free space based on their aspect ratios
- Two feed layouts (3 and 5 columns) switchable with a toggle, persisted in a cookie so SSR renders the right layout immediately
- Page-based pagination with URL sync and background prefetch of adjacent pages
- Photo details page with author, likes, publish date, views, downloads, location and tags
- Tag pages — clicking a tag opens a collection feed driven by the same logic as the home feed
- Photo search
- Fully server-side rendered, responsive and adaptive at 1440 / 1024 / 768 / 375
- Bonus: basic registration and login (session in an httpOnly cookie; registered users are kept in another httpOnly cookie with salted scrypt password hashes as a demo stand-in for a database) and a profile collection to save / remove photos

## Tech stack

- [Next.js](https://nextjs.org) (App Router, SSR)
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
| `npm run test`       | Run unit and integration tests     |
| `npm run test:watch` | Run tests in watch mode            |
| `npm run test:e2e`   | Run Playwright end-to-end tests    |

A husky `pre-push` hook runs `type-check` and `build` before every push.

## Architecture notes

- **SSR + client cache.** Every page is rendered on the server: feed data is prefetched into a TanStack Query client and dehydrated into the HTML. After hydration, page switches happen client-side through the query cache (with adjacent pages prefetched in the background), while the URL stays shareable and server-renderable.
- **API layer.** All Unsplash requests run on the server (`src/lib/unsplash/api.ts`) with the access key kept out of the browser; responses are cached by the Next.js Data Cache and trimmed to the exact fields the UI needs to keep payloads small. Thin route handlers (`/api/photos`, `/api/search`) expose the same fetchers to the client cache.
- **Performance on slow devices.** The masonry layout is pure CSS (`column-count`) with zero JavaScript, layout shift is prevented via aspect ratios, images load through the Unsplash CDN with a custom `next/image` loader (`auto=format`, exact `sizes` per column layout), dominant-color placeholders show instantly, offscreen cards skip rendering via `content-visibility`, and list components are memoized with `React.memo`.
- **Auth model (demo-grade).** Registered users live in an httpOnly cookie with salted scrypt password hashes (capped by the encoded cookie size limit — roughly a dozen accounts, fewer with non-ASCII names), and the session cookie holds plain, unsigned identity JSON. This keeps the bonus feature infrastructure-free; it is not a production auth design — that would need a real user store and signed or server-side sessions.
- **Constants.** Every non-trivial literal (API config, breakpoints, storage keys, routes, validation limits) lives in `src/constants`.

## Testing

**Unit & integration** — `npm run test` (Vitest + Testing Library + MSW, colocated `*.test.ts(x)` files):

- pure logic: `getPaginationRange` window/ellipsis edge cases, `parsePageParam` / `parseColumnCount` fallbacks, `unsplashImageLoader` URL handling, zod schemas, password hashing and verification helpers;
- contract tests for the Unsplash API layer: auth and versioning headers, pagination params, trimming responses to exactly the fields the UI consumes, totals with and without the `X-Total` header, typed 404 / error handling;
- `collectionStore`: toggle/subscribe behavior, persistence, cross-tab storage-event sync, corrupted-data recovery;
- `PhotoFeed` integration with a mocked API: skeleton → photos, error and rate-limit states with retry, empty state, columns toggle with cookie persistence, pagination URL updates and background prefetch of the next page.

**End-to-end** — `npm run test:e2e` (Playwright, chromium; run `npx playwright install chromium` once):

- SSR smoke test (photos and pagination present in the server-rendered HTML), pagination, the columns toggle, the search → photo → tag journey, registration validation and the full profile collection flow;
- axe accessibility checks of the feed, photo and registration pages;
- visual regression snapshots of the masonry grid at 3 and 5 columns, rendered from fixture data with stubbed images so the layout stays deterministic.

E2E journeys run against the real Unsplash API, so a valid `UNSPLASH_ACCESS_KEY` with free rate limit is required (the demo tier allows 50 requests/hour; one cold run consumes about 8 of them, repeat runs mostly hit the server-side cache).

## CI

A GitHub Actions workflow runs ESLint, the TypeScript check, the unit/integration suite and a production build on every push and pull request to `main`. The husky `pre-push` hook mirrors the type-check and build locally.
