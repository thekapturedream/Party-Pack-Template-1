# Printable kits, authored as code

Printable products, written as TypeScript and rendered to print-ready PDFs, sold as
instant downloads in the Wix store **The Kapture**. Two titles so far:

- **The Vanishing Exhibit** — a museum-mystery escape room, ages 9–12, £22.
- **Paper Plane Template Pack** — ten printable paper planes, ages 6–12, £12.

## Architecture

Plain TypeScript run directly by Node 22's type stripping. No bundler, no
framework. Two dependencies: Playwright (renders HTML to PDF) and pdf-lib (verifies
the output). Content is data; rendering is functions over that data.

```
src/products.ts              THE CATALOGUE. Every script takes a product slug.
src/design/page.css          the page system: geometry, type scale, primitives.
                             Shared, brand-free. Both products load it first.
src/design/museum/           tokens + components for the escape room
src/design/flight/           tokens + components for the plane pack
src/content/types.ts         Kit / Puzzle / Hint shapes
src/content/plane-types.ts   Squadron / Plane / Livery shapes
src/content/*.ts             one file per title
src/render/shell.ts          HTML document, page wrappers, paper sizes, themes
src/render/figures.ts        escape-room figures (clocks, floor plan, cipher key)
src/render/fold/             the fold engine — see below
src/render/livery.ts         what gets printed on a plane template
src/render/readme.ts         the plain-text file at the top of each customer zip
src/render/documents/        one file per printed document; planes/ for the pack
scripts/fetch-fonts.mjs      embeds latin subsets as base64 (committed)
scripts/check-fit.mjs        fails if any sheet overflows its page
scripts/preview.mjs          PNG of every sheet, for visual QA
scripts/store-images.mjs     shop images; compositions in scripts/store/
scripts/pins.mjs             Pinterest pins; compositions in scripts/store/
scripts/package.mjs          assembles the customer zips
store/                       escape-room listing; store/planes/ for the pack
```

## Commands

Every script takes a product slug: `vanishing-exhibit` or `paper-squadron`.
Omitting it means "all products" where that makes sense.

```
node src/build.ts                          every PDF, both products, both sizes
node src/build.ts paper-squadron --html    one product, keeping the HTML
node src/build.ts paper-squadron 02_       one document of it
node scripts/check-fit.mjs                 REQUIRED before shipping
node scripts/check-pages.mjs               REQUIRED before shipping
node scripts/preview.mjs paper-squadron    PNG per sheet
node scripts/store-images.mjs paper-squadron
node scripts/pins.mjs paper-squadron
node scripts/package.mjs paper-squadron    writes release/<name>-v<version>.zip
```

Output goes to `dist/<product>/{A4,Letter,html,preview}`.

## The fold engine

`src/render/fold/` is the part worth understanding before touching the plane pack.
It is a small flat-folding model: it tracks each facet of the paper and an affine
map back to where that facet lies on the unfolded sheet. Everything else follows
from that map.

- **Every diagram is computed, not drawn.** A plane is a list of moves in the
  words the caption uses ("bring this edge onto that line"); the engine works out
  the crease, the resulting shape, and the arrow.
- **The crease pattern printed on a template is the same geometry**, mapped back
  through the facets. That is why folding along the printed lines works.
- **The livery is clipped to the facets that never move**, which are exactly the
  outside of the finished plane. Nothing is printed where it folds away.
- **A fold that would not lie flat fails the build.** This caught four bad
  sequences while the ten planes were being written, two of them only on US
  Letter. If you get "the flap does not land on the paper", the fold is wrong,
  not the engine.
- `foldedPreview` in `livery.ts` draws the finished plane wearing its livery, by
  pulling the artwork through the inverse of those maps. Use it to check a livery
  lands where you meant without folding anything.

## Rules that are easy to break

- **Run `check-fit` after every content edit.** US Letter is 18mm shorter than A4;
  copy that fits A4 routinely overflows Letter, and print has no scrollbar to warn you.
- **Run `check-pages` too.** The sheet counts in `src/products.ts` are quoted on
  the Start Here sheet, in the zip's readme and in the shop listing; a document
  that gains or loses a page makes three documents wrong at once.
- **Never show the answer key in a shop image or preview.** It prints the solution.
- **Never show a plane template without its fold lines.** The printed crease
  pattern is the thing being sold; without it the sheet looks like clip art.
- **Re-run the free sample's leak audit after any content edit.** The escape room
  sample must not name another puzzle's answer. Two leaked at first: a character's
  first name is puzzle 1's answer and a room name is puzzle 2's, and both appeared
  in flavour text. `free-sample.ts` neutralises them for the sample only.
- **Brass is reserved** for the one letter that travels from an evidence sheet to
  the Recovery Slip. **Air blue is reserved** for how a plane behaves in the air —
  flight paths, wing creases — and never for a fold you make now.
- **No full-page dark fills, in either product.** Both listings promise cheap
  black-and-white printing, and a template flooded with ink comes out damp and
  curled and will not fly.
- Fonts are committed as base64 (`assets/fonts/fonts.css` for the museum,
  `flight.css` for the planes) so builds are reproducible offline. Re-run
  `fetch-fonts.mjs <set>` only to change the typefaces.

## Design invariants

**Escape room.** Six puzzles, six kinds of thinking, so no single child dominates.
Puzzles 4 and 5 are self-checking: two independent routes reach the same number, so
a team knows it is right without the host. Puzzle 5 cross-references sheets 1 and 2,
which rewards keeping the papers out. The six key letters spell the finale word.

**Plane pack.** Ten planes across six flight behaviours, so no single child wins
everything and the fly-off has three separate contests. Every fold sequence is a
traditional fold — the dart, the Nakamura lock, the nose-band glider, the
concertina nose — of the kind taught in playgrounds for decades; the pack claims
the drawing, the crease pattern and the livery, not the folds. Which side of the
sheet faces up is derived from whether the "fold in half" step is a mountain fold,
never stored twice: get it wrong and the livery ends up inside the plane.

## Wix

The Kapture: site ID `16ae0aa1-e41c-4192-9921-5c9511e1cb88`, Studio, GBP,
**Wix Stores Catalog V1**. Only V1 endpoints (`/stores/v1/...`) work on this site.

**Catalog V1 cannot create digital products via API.** Re-tested end to end on
10 September 2026 rather than taken on trust; all four routes fail:

- `POST /stores/v1/products` with `productType: "digital"` →
  `400 product.productType digital is not supported`. (A name over 80 characters
  errors *first* and masks this, which is how it can look as though digital works.)
- Any `/stores/v3/...` endpoint → `428 CATALOG_V1_SITE_CALLING_CATALOG_V3_API`.
- Create as `physical`, then `PATCH` `productType` to `digital` →
  **200 OK and silently ignored.** Reads back `physical`.
- `PATCH` a `digitalFile` onto a physical product → **200 OK and silently
  ignored.** Reads back absent.

The last two matter more than the first: this API returns success and changes
nothing. Never trust a 200 on `productType` or `digitalFile` — read the product
back before acting on it, and never make a product visible until you have.

Moving to Catalog V3 is not an escape hatch: migrating an existing site to the new
catalog is an open Wix feature request with no self-serve path, and the Catalog
Versioning API is read-only. Wix's suggested workaround is a new site, which would
split this business across two properties and is out of the question.

So a digital product is created once by hand, then maintained through the V1 API;
only creation is blocked. `store/listing.md` holds the paste-ready copy, the
dashboard link, and the media IDs of the files already in the site's Media Manager.

Live product: `8f485df2-a9f6-8dcd-2b9c-61c2b4ff21d8`, £22.00, visible.
Lead-capture form: `b56d509c-a85c-4e75-98ae-3b1424af6a41`.

The Paper Plane Template Pack's zip, eight shop images and two free-plane PDFs are
already uploaded and labelled `paper-planes`; **the product itself still has to be
created by hand**, for the same Catalog V1 reason. Paste-ready copy, the media IDs
and the dashboard link are in `store/planes/listing.md`.

Three things the API cannot do on this site: create a digital product, add a page
to the site, and turn a form schema into a live form with a URL. The Forms API
creates schemas only — no standalone namespace, no share URL, no publish method —
so the free-sample gate lives on a published artifact page instead, and leads are
synced into Wix Contacts and Email Subscriptions by hand. Everything else about a product —
description, media, ribbon, SKU, SEO, visibility — is API-writable, and hidden
products need `includeHiddenProducts: true` to come back from Query Products.

No secrets are stored in this repo and none are needed: all Wix calls go through
the authenticated Wix MCP tools.

**A free product is not an option.** Wix Stores checkout rejects a zero-balance
order, so the sample cannot be sold at £0 to capture an email at checkout.

**Wix Blog posts are the only on-domain page the API can create.** Write the copy
as markdown in `content/posts/`, convert it with
`POST /ricos/v1/ricos-document/convert/to-ricos` rather than hand-authoring Ricos
JSON, then `POST /blog/v3/draft-posts?publish=true`. That is the route for every
future landing page while the Editor is out of reach. Six posts are live; see
`docs/search-strategy.md` for which query each one catches. The newest,
`how-to-fold-a-paper-airplane-that-actually-flies`, is the first page on this
domain aimed at a query with real search volume.

**Everything we share points at thekapture.com.** The default shareable is the
product page; the posts feed it. No claude.ai artifact, no third-party host — a
link on someone else's domain builds someone else's asset. The free sample is
ungated on purpose: a gate trades reach for addresses, which is the wrong trade at
zero traffic.

**Payments are live**, confirmed in the dashboard on 9 September 2026: Stripe
(cards), PayPal and AliPay all active at checkout, business location United
Kingdom, store currency GBP. No API reports this — Wix's payment endpoints list
only what is *possible* in a country — so the dashboard is the only source, and
agent sessions see a Stripe sandbox (`acct_1SVx4v3mIHJCnHM5`, `livemode: false`)
unless the live account is authorised for them. **Delivery is still unproven:**
no real order has run, so nothing has exercised the download email or the buyer's
copy of the archive. One buy-and-refund settles it.

**This session's Chromium cannot reach the internet** — every host fails with
`ERR_CONNECTION_RESET` through the agent proxy, while curl succeeds. Playwright is
still fine for rendering local HTML, which is all the build needs. Do not attempt
live-site browser QA from here.

Marketing plan, channel ranking and the customer journey: `docs/go-to-market.md`,
whose second half covers what changes with two products at two prices.
