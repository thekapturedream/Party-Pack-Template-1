# Shop listing — The Vanishing Exhibit

Everything here is ready to paste into the Wix dashboard. The media is already in
The Kapture's Media Manager (see **Assets** at the bottom).

---

## Product name

```
The Vanishing Exhibit — Printable Escape Room Kit, Ages 9–12
```

## Price

**£22.00 GBP.** The store's currency is GBP. The nearest comparable product,
Lock Paper Scissors' *The Lost Mummy*, sells at US$29; £22 is roughly US$28, so
this tests the same willingness to pay rather than undercutting into a different
market. It is a playtest edition, which is what justifies sitting just under the
reference price rather than a discount we would later have to unwind.

## Ribbon

```
Playtest edition
```

## SKU

```
MMM-01-VE
```

## Description

Paste `store/description.html` into the product description. It is plain HTML,
which is what Wix Stores Catalog V1 accepts.

## SEO

- **Title:** Printable Escape Room Birthday Kit for Kids 9–12 | The Vanishing Exhibit
- **Slug:** `the-vanishing-exhibit-printable-escape-room-kit`
- **Meta description:** A printable museum-mystery escape room for a children's
  birthday party. Six puzzles, 45–60 minutes of play, 15 minutes to set up, and a
  host guide so you never have to solve anything. A4 and US Letter, instant download.

---

## Creating the product

**This one step has to happen in the dashboard.** Wix Stores Catalog V1 cannot
create digital products through its API — it returns
`product.productType digital is not supported` — and Wix does not allow a
product's type to be changed after creation, so a physical placeholder would have
to be deleted rather than converted.

Moving the site to Catalog V3, which does support digital products via API, is not
available: migrating an existing site to the new product catalog is an open Wix
feature request with no self-serve path and no published timeline, and the Catalog
Versioning API is read-only (its only method is Get Catalog Version). Wix's own
suggested workaround is starting a new site, which we are not doing — it would
split The Kapture's members, orders, domain and analytics across two properties.

So: create it once, by hand. Everything it needs is already uploaded.

**Start here:** https://manage.wix.com/dashboard/16ae0aa1-e41c-4192-9921-5c9511e1cb88/wix-stores/products/new-product

1. Choose **Digital Product** as the product type. This cannot be changed later.
2. Paste the name, description, price, ribbon and SKU above.
3. **Digital file:** use the upload field, choose *Media Manager*. The file is
   already there as a private file: `The-Vanishing-Exhibit-v1.0.zip`.
4. **Images:** add all six from the Media Manager, searching the label
   `vanishing-exhibit`, in numbered order. Image 1 shows in search and social, so
   it must stay first.
5. Fill in the SEO panel from the section above.
6. Save, then set the product visible.

Product list afterwards: https://manage.wix.com/dashboard/16ae0aa1-e41c-4192-9921-5c9511e1cb88/wix-stores/products

Once the product exists, its price, description, images, ribbon and visibility can
all be maintained through the V1 API. Only creation is blocked.

## After launch

- The free sample is **published and linked from the product page**:
  - A4: `https://16ae0aa1-e41c-4192-9921-5c9511e1cb88.usrfiles.com/ugd/53eacf_a6fe9751255040dc9197d917464221dc.pdf`
  - US Letter: `https://16ae0aa1-e41c-4192-9921-5c9511e1cb88.usrfiles.com/ugd/53eacf_326a7d8ff3cb42e2909a13edf19aeb5e.pdf`
  It gives away one puzzle of six and three of twenty-five sheets. Re-upload both
  files whenever the sample changes; the URLs are stable per file, not per version.
- **The email gate is live, on a page outside Wix.** Wix's Forms API creates form
  *schemas* only: there is no standalone namespace, no share URL and no publish
  method, and no API anywhere adds a page to an existing Wix site. So the gate is
  a published artifact instead:

  **https://claude.ai/code/artifact/01797344-e450-45ee-ae16-f2b4237f3e1a**

  It captures first name, email and marketing consent, writes each lead to the
  artifact's database, and releases both PDFs on submit. If the database
  capability fails to load it releases the download anyway after four seconds:
  a broken gate must never cost a real parent the sample.

  Leads are pulled out with the artifact `read_db` action on `leads`, then pushed
  into Wix with `POST /contacts/v5/contacts` and
  `POST /email-marketing/v1/email-subscriptions`, so Wix stays the system of
  record. That sync is manual, not automatic.

  The Wix form schema (`b56d509c-a85c-4e75-98ae-3b1424af6a41`) is still there and
  still correct, for whenever someone can reach the Editor.

  **The artifact defaults to owner-only sharing.** It has to be set public from the
  page's own share menu before a customer can open it, and before the product
  description should point at it.
- Direct sample links (still in the product description; remove them once the gate
  page is public, or the gate is decorative):
  - A4: `https://16ae0aa1-e41c-4192-9921-5c9511e1cb88.usrfiles.com/ugd/53eacf_a6fe9751255040dc9197d917464221dc.pdf`
  - US Letter: `https://16ae0aa1-e41c-4192-9921-5c9511e1cb88.usrfiles.com/ugd/53eacf_326a7d8ff3cb42e2909a13edf19aeb5e.pdf`
- **On-domain landing page, live:**
  https://www.thekapture.com/post/how-to-run-an-escape-room-birthday-party-for-9-to-12-year-olds
  Created and published entirely through the API. Wix Blog posts are the only page
  type the API can add to an existing site, so this is how anything on the domain
  gets built from here. Markdown goes through
  `POST /ricos/v1/ricos-document/convert/to-ricos`, then Create Draft Post and
  Publish Draft Post. Post id `731601c4-923c-45cc-9ae2-d480429ffe38`.
- The post currently links straight to the sample PDFs, because the artifact gate
  is still owner-only and a public post must not carry a link that 404s. Swap the
  two PDF links for the gate link the moment sharing is public.
- Marketing plan and channel ranking: `docs/go-to-market.md`.
- The commercial gate from the brief: **10 purchases from 300 qualified visits, at
  no more than £8 acquisition cost per order.** At £22 that leaves roughly £11 per
  sale toward development and overhead.
- Everything a buyer reads promises free future versions in exchange for playtest
  notes. Honour that before shipping v1.1.

---

## Assets already in the Media Manager

| File | Media ID | Visibility |
|---|---|---|
| The-Vanishing-Exhibit-v1.0.zip | `53eacf_3a2b68e159804a338fa5b3b0c1be913a.zip` | private |
| 01 hero | `53eacf_fb9e82e7d64144f1a26d3e8a61c709dd~mv2.jpg` | public |
| 02 what's inside | `53eacf_87d916a41bb74e42ab09d53c191afb34~mv2.jpg` | public |
| 03 the puzzles | `53eacf_364537fb377a4c94affc5fcab217b23d~mv2.jpg` | public |
| 04 how it works | `53eacf_bcb074ad9ffa47d49b9c0d06c954252c~mv2.jpg` | public |
| 05 printing | `53eacf_ec420f5298d145f8a31ff3386ec1fe7c~mv2.jpg` | public |
| 06 playtest edition | `53eacf_2261c0fb0c034559ab4048f8962b3c1a~mv2.jpg` | public |

All are labelled `vanishing-exhibit` in the Media Manager, so searching that word
finds the set.

## Spoiler rule for marketing

The answer key page prints the solution in full. Never use it in a listing image,
a social post or a preview. The six store images were built with that rule and the
generator in `scripts/store-images.mjs` deliberately does not reference it.
