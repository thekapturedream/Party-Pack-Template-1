# Party Pack Template — Marlow Museum Mysteries

Printable party-game kits, authored as code and rendered to print-ready PDFs.
First title: **The Vanishing Exhibit**, a museum-mystery escape room for ages 9–12,
sold as an instant download in the Wix store **The Kapture**.

## Who it is for

Two audiences, and they do not want the same thing.

- **Players, 9–12.** This age rejects anything that reads as "for kids" — primary
  colour, rounded playful shapes, cartoon mascots. What lands is high contrast,
  real-looking artefacts and a slightly serious register: a case file, not a
  worksheet. Design decisions follow from that, not from studio taste.
- **Buyer, a parent.** Wants proof it will work and proof it will print. The
  wrapper sheets (Start Here, Host Guide cover) and the shop images stay calm and
  legible; the play materials are dense and artefact-like.

## Architecture

Plain TypeScript run directly by Node 22's type stripping. No bundler, no
framework. Two dependencies: Playwright (renders HTML to PDF) and pdf-lib (verifies
the output). Content is data; rendering is functions over that data; a new title is
a new file in `src/content/`.

```
src/design/tokens.css        colour, type, spacing — single source of truth
src/design/sheet.css         .sheet page system and artefact components
src/content/types.ts         Kit / Puzzle / Hint shapes
src/content/*.ts             one file per kit: story, puzzles, answers, hints
src/render/shell.ts          HTML document + page wrappers
src/render/figures.ts        SVG/CSS figures (clock faces, floor plan, cipher key)
src/render/documents/*.ts    one file per printed document
src/build.ts                 renders every document to A4 and US Letter
scripts/fetch-fonts.mjs      embeds latin subsets as base64 (run once; committed)
scripts/check-fit.mjs        fails if any sheet overflows its page
scripts/preview.mjs          PNG of every sheet, for visual QA
scripts/store-images.mjs     shop listing images, built from real pages
scripts/package.mjs          assembles the customer zip
store/                       listing copy, description HTML, shop images
```

## Commands

```
node src/build.ts            build every PDF into dist/A4 and dist/Letter
node src/build.ts --html     also write dist/html, needed by the scripts below
node scripts/check-fit.mjs   REQUIRED before shipping; print silently truncates
node scripts/preview.mjs A4  PNG per sheet into dist/preview
node scripts/store-images.mjs
node scripts/package.mjs     writes release/<title>-v<version>.zip
```

`build.ts` takes optional slug filters, e.g. `node src/build.ts 02_Player`.

## Rules that are easy to break

- **Run `check-fit` after every content edit.** US Letter is 18mm shorter than A4;
  copy that fits A4 routinely overflows Letter, and print has no scrollbar to warn you.
- **Never show the answer key in a shop image or preview.** It prints the solution.
- **Re-run the free sample's leak audit after any content edit.** The sample must
  not name another puzzle's answer. Two leaked at first: a character's first name
  is puzzle 1's answer and a room name is puzzle 2's, and both appeared in flavour
  text. `free-sample.ts` neutralises them for the sample only; the kit keeps its
  wording, where the answers are already known by the time they appear.
- **Brass is reserved** for the one letter that travels from an evidence sheet to
  the Recovery Slip. Nothing else may use it, or the mechanic stops reading.
- **No full-page dark fills.** The listing promises cheap black-and-white printing.
- Fonts are committed as base64 in `assets/fonts/fonts.css` so builds are
  reproducible offline. Re-run `fetch-fonts.mjs` only to change the typefaces.

## Puzzle design invariants

Six puzzles, six kinds of thinking, so no single child dominates. Puzzles 4 and 5
are self-checking: two independent routes reach the same number, so a team knows it
is right without the host. Puzzle 5 cross-references sheets 1 and 2, which rewards
keeping the papers out. The six key letters spell the finale word.

## Wix

The Kapture: site ID `16ae0aa1-e41c-4192-9921-5c9511e1cb88`, Studio, GBP,
**Wix Stores Catalog V1**. Only V1 endpoints (`/stores/v1/...`) work on this site.

**Catalog V1 cannot create digital products via API** — it rejects
`productType: "digital"` — and Wix does not allow a product's type to be changed
afterwards. Moving to Catalog V3 is not an escape hatch: migrating an existing site
to the new catalog is an open Wix feature request with no self-serve path, and the
Catalog Versioning API is read-only. Wix's suggested workaround is a new site,
which would split this business across two properties and is out of the question.

So a digital product is created once by hand, then maintained through the V1 API;
only creation is blocked. `store/listing.md` holds the paste-ready copy, the
dashboard link, and the media IDs of the files already in the site's Media Manager.

No secrets are stored in this repo and none are needed: all Wix calls go through
the authenticated Wix MCP tools.
