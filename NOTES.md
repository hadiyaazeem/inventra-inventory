# Design Notes & Trade-offs

## Data modeling
- `ON DELETE RESTRICT` on `products.category_id` / `products.supplier_id` enforces the brief's referential-integrity requirement at the database layer, not just in application code — a category or supplier with products cannot be deleted, full stop, even if a future code path forgets to check first.
- `stock_movements.product_id` cascades on delete: deleting a product also clears its movement history, since an orphaned ledger for a product that no longer exists isn't meaningful here.
- SQLite `CHECK` constraints (`unit_price >= 0`, `quantity_in_stock >= 0`, `quantity > 0` on movements) back up the same rules the API validates, so the invariant holds even against a direct DB write.
- Indexes on `sku`, `name`, `category_id`, `supplier_id` cover the documented search/filter paths.

## Stock movement atomicity
Recording a movement and updating `quantity_in_stock` happen inside a single `better-sqlite3` transaction. `better-sqlite3` is synchronous, which removes an entire class of race condition that would otherwise need row locking or optimistic concurrency to handle correctly, at the cost of single-writer throughput — an acceptable trade for this scale.

## Auth is additive, not load-bearing
Per the brief's FAQ, authentication is a stretch goal. The API stays fully usable without a token; when a valid JWT *is* sent, `req.user` is populated so role checks (`requireRole('ADMIN')`) can apply to destructive routes. This means the core CRUD/business-rule requirements don't depend on auth working, but the RBAC stretch goal layers cleanly on top.

## Why SQLite over Postgres/MySQL
Zero external service to stand up, trivial to seed and reset, and `better-sqlite3`'s synchronous API keeps the movement-atomicity logic simple. The trade-off is a single writer and no built-in replication — fine for an assessment/demo, and called out under "Known limitations" in the README rather than glossed over.

## Color theme
Retired the navy/blue/indigo/cyan "enterprise SaaS" palette for a warm charcoal (stone) background with copper (primary), teal (secondary), and gold (accent) — still dark, but a different hue family end to end rather than a recolor of the same structure. `--color-warning` was deliberately kept apart from the copper/gold brand pair (shifted toward red-orange) so a "low stock" badge is never visually mistaken for a brand-colored button. The chart categorical/status palette in `frontend/src/components/charts/palette.ts` was left untouched — it's independently validated for lightness/contrast/color-vision-deficiency safety against a dark surface and isn't meant to track brand hue changes 1:1.

## Design-system overhaul (fonts, shapes, backdrop)
Went further than a recolor: swapped Inter/Plus Jakarta Sans for IBM Plex Sans/Plex Mono (a technical-documentation pairing that fits an ops tool better than a generic SaaS font), sharply reduced every border radius (8–20px → 3–10px), and replaced glassmorphism (blurred translucent cards, floating gradient "glow orb" blobs, a soft dot-grid backdrop) with a flat, solid, crisply-bordered "spec sheet" look: hard offset shadows instead of soft glows, a blueprint-style crossed-line grid instead of dots, faint outline rings instead of blurred blobs for decorative accents, and a copper top-accent stripe as a repeatable signature on every card. Functional blur (modal scrims, dropdown popovers, sticky table headers) was intentionally kept — that's a legibility aid, not the decorative glassmorphism look being replaced.

## Landing page restructure
Beyond re-skinning, the landing page's actual composition changed: the hero went from a full-bleed cinematic photo background with centered copy and decorative floating "scan node" particles to an asymmetric two-column layout — left-aligned headline/copy/CTAs with a compact stat strip, right side the warehouse photo contained in a bordered panel rather than a background image. The section order changed and two previously-unused, fully-built sections (`CategoriesPreview`, `SuppliersPreview` — both pull live data from the API) were brought into the page, alongside `HowItWorks`, which was also previously wired up but unused.

## Deployment fixes (see README for the full list)
The original zip worked correctly when run locally or via `docker-compose`, but had several issues that only surface once frontend and backend become two independently-addressed services on Railway: a missing `.dockerignore` risking a native-module ABI mismatch, an nginx config that crashed on boot outside the compose network, a stale dev-proxy URL, and no way to point a production frontend build at a backend on a different domain. All four are fixed; none were business-logic bugs.
