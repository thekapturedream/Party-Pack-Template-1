# Shop listing — Paper Plane Template Pack

Everything here is ready to paste into the Wix dashboard. The media is already in
The Kapture's Media Manager (see **Assets** at the bottom).

---

## Product name

```
Paper Plane Template Pack — 10 Printable Paper Airplanes with Fold Instructions, Ages 6–12
```

## Price

**£12.00 GBP.**

Deliberately below *The Vanishing Exhibit* at £22, and deliberately above the
£3–£6 single-template PDFs that fill the Etsy results. Those are a page of
pictures; this is 34 sheets with printed crease patterns, a flight school and a
scoring system. £12 sits where a parent reads "a proper thing" rather than "a
cheap thing" without needing to be talked into it, and it gives the catalogue a
second, lower entry point — someone who will not risk £22 on an unknown shop
will risk £12, and the escape room is what they buy next.

## Ribbon

```
First edition
```

## SKU

```
KFS-01-PPT
```

## Description

Paste `store/planes/description.html` into the product description. It is plain
HTML, which is what Wix Stores Catalog V1 accepts.

## SEO

- **Title:** Printable Paper Airplane Templates with Fold Instructions | 10 Planes, Ages 6–12
- **Slug:** `paper-plane-template-pack-printable-paper-airplanes`
- **Meta description:** Ten printable paper plane templates with the fold lines
  printed on the sheet and every fold drawn step by step. Distance, hang time,
  accuracy and a boomerang. A4 and US Letter, instant download, ages 6–12.

---

## Creating the product

**Four fields in the dashboard, then the API does the rest.**

This is the one step the API cannot do, and it is not for want of trying. Tested
directly against this site on 10 September 2026, all three routes fail:

| Attempt | Result |
|---|---|
| `POST /stores/v1/products` with `productType: "digital"` | `400 — product.productType digital is not supported` |
| Any `/stores/v3/...` endpoint | `428 — CATALOG_V1_SITE_CALLING_CATALOG_V3_API` |
| Create as `physical`, then `PATCH` the type to `digital` | **200 OK, silently ignored.** Reads back as `physical` |
| `PATCH` a `digitalFile` onto a physical product | **200 OK, silently ignored.** Reads back absent |

The last two are the dangerous ones: they return success and change nothing. Do
not trust a 200 from this API on either field — always read the product back.

### What to do

**Open:** https://manage.wix.com/dashboard/16ae0aa1-e41c-4192-9921-5c9511e1cb88/wix-stores/products/new-product

1. Product type: **Digital**. This is the choice that cannot be changed later.
2. **Name** — paste:
   `Paper Plane Template Pack — 10 Printable Paper Airplanes, Ages 6–12`
   (Catalog V1 caps names at 80 characters; this is 67.)
3. **Price:** `12.00`
4. **Digital file:** upload field → *Media Manager* → `Paper-Plane-Template-Pack-v1.0.zip`
   (already there, private, 2.1MB)
5. Save. Leave it hidden.

Nothing else needs typing. Description, images, ribbon, SKU, SEO and visibility
are all API-writable once the product exists.

### Then, in a session

Ask Claude to finish the product. The steps, in order:

1. `POST /stores/v1/products/query` with `includeHiddenProducts: true` to find the
   new product's id.
2. `PATCH /stores/v1/products/{id}` with `description` (the HTML from
   `store/planes/description.html`), `ribbon: "First edition"`, `sku: "KFS-01-PPT"`.
3. `POST /stores/v1/products/{id}/media` with the eight `mediaId` values from the
   Assets table below, **in numbered order** — image 1 is what shows in search
   and social.
4. `PATCH` the `seoData` slug and meta description from the SEO section above.
5. Read the product back and confirm `productType: "digital"` and that
   `digitalFile.fileName` is the plane zip and not the escape room's.
6. `PATCH { visible: true }` last, only after step 5 passes.

Step 5 is not optional. A product that charges for planes and delivers the escape
room is the worst failure available here, and two of the API calls above are known
to fail silently.

## The on-domain post

Live, and it is the thing to share until the product exists:

```
https://www.thekapture.com/post/how-to-fold-a-paper-airplane-that-actually-flies
```

Post id `9f9c5aa6-668e-4ccb-80c5-0a6c5b2216d7`; source markdown in
`content/posts/paper-airplane-that-flies-far.md`. It answers "how to fold a paper
airplane that flies far", which is a far higher-volume query than anything the
escape room can reach.

**One dependency.** Its last section links to the product page, at the slug set
in step 5 above. That link 404s until the product is created, so create the
product first. Everything else in the post — including both free-plane links —
works now.

## The free plane

Three sheets: a cover, the Sparrow's fold sheet, and the Sparrow's template. It
is a whole working plane rather than a taste of one, because a sample that cannot
be flown proves nothing. Both are already public in the Media Manager:

- A4: `https://16ae0aa1-e41c-4192-9921-5c9511e1cb88.usrfiles.com/ugd/53eacf_ca1b6fe4f4cf4c249da8b96ead6c7f46.pdf`
- US Letter: `https://16ae0aa1-e41c-4192-9921-5c9511e1cb88.usrfiles.com/ugd/53eacf_1dd7941747724725961d495b10d2079a.pdf`

Re-upload both whenever the sample changes; the URLs are stable per file, not per
version.

Ungated, for the same reason as the escape room's: a gate trades reach for
addresses, which is the wrong trade at zero traffic.

## Spoiler rule

There is no answer key to leak here, so the escape room's spoiler rule does not
apply. The rule that does: **never show a template sheet without its fold lines
visible.** The printed crease pattern is the thing being sold, and a template
photographed without it looks like a page of clip art.

## What is unproven

Same honesty as the first product, and the same label on the listing.

- Every fold sequence is computed by the folding model in `src/render/fold`, and
  a sequence that would not lie flat fails the build. That is a strong guarantee
  about the *geometry*.
- It is not a guarantee about the *paper*. Nobody has yet folded all ten from a
  real printer on real 80gsm and thrown them down a corridor. The flight claims
  come from the designs being traditional folds that are known to fly, not from
  a stopwatch in this house.
- **Fold one of each before the first sale**, starting with the Hammer and the
  Boomerang, which are the two most likely to disappoint. If a plane needs a
  tweak, the fix is a number in `src/content/paper-squadron.ts`, not a redraw.

## Assets already in the Media Manager

All labelled `paper-planes`, so searching that word finds the set.

| File | Media ID | Visibility |
|---|---|---|
| Paper-Plane-Template-Pack-v1.0.zip | `53eacf_64d4dac7007d47539f4a8839fcbbc218.zip` | private |
| 01 hero | `53eacf_507b86fb3cd74a2f9033459edfd8dd0a~mv2.jpg` | public |
| 02 the ten planes | `53eacf_52617c502d3443d495e23865c08c79d1~mv2.jpg` | public |
| 03 every fold drawn | `53eacf_953b1beb399145ab8292b449ef51388c~mv2.jpg` | public |
| 04 the templates | `53eacf_898104b543f445d28620ca076002ff45~mv2.jpg` | public |
| 05 what's inside | `53eacf_876c1244410b4e1fa459e48470fe0050~mv2.jpg` | public |
| 06 make it a contest | `53eacf_7929d3b00ee04be8b24484090216b41d~mv2.jpg` | public |
| 07 printing | `53eacf_d906114d7d5c455ebef3dd856fa260e4~mv2.jpg` | public |
| 08 first edition | `53eacf_648b1f53fed64bc1ad76d0d03b530bd7~mv2.jpg` | public |
| Free plane, A4 | `53eacf_ca1b6fe4f4cf4c249da8b96ead6c7f46.pdf` | public |
| Free plane, US Letter | `53eacf_1dd7941747724725961d495b10d2079a.pdf` | public |

## Rebuilding any of it

```
node src/build.ts paper-squadron --html
node scripts/check-fit.mjs paper-squadron      # required before shipping
node scripts/preview.mjs paper-squadron
node scripts/store-images.mjs paper-squadron
node scripts/pins.mjs paper-squadron
node scripts/package.mjs paper-squadron
```
