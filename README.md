# Drip: prototype fashion store

A prototype e-commerce site for **Drip**, a fictional Irish high-street fashion
brand. It works from homepage to checkout, but there is **no payment step**:
nobody can pay or place a real order. All products, prices, reviews and
sustainability figures are fictional sample data.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui.

## Run it on your computer

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where to change things

| What | File |
| --- | --- |
| All 48 products (names, prices, colours, sizes, fabric, sample figures) | `src/lib/products.ts` |
| Pieces on the homepage clothing rail | `src/lib/rail.ts` |
| Delivery prices, free-delivery threshold, returns days | `src/lib/store.ts` |
| Take-back, repair and target figures (sample data) | `src/lib/impact.ts` |
| Header menus and footer links | `src/lib/navigation.ts` |
| Colours, fonts and spacing (design system) | `src/app/globals.css` |

## Photos (Unsplash)

Photos are hotlinked from Unsplash (never re-hosted). Their links and credits
live in `src/lib/image-data.ts`, written by `scripts/fetch-images.ts`.

To re-run the script you need a free Unsplash access key in `.env.local`
(this file is git-ignored, so the key never goes to GitHub):

```
UNSPLASH_ACCESS_KEY=your-access-key
```

```bash
npm run images:fetch
```

Demo keys allow 50 requests per hour. The script counts its requests, stops
at the limit and saves its progress; run it again an hour later to finish.
Hand-checked choices are listed in `PICKS` at the top of the script.

The live site does **not** need the key.

## Checks

```bash
npm run lint
npm run build
```
