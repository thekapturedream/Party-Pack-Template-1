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

## The links to share

Everything we hand out points at **thekapture.com**. Nothing points at a
claude.ai artifact, a usrfiles.com PDF, or any other host we do not own. A link on
someone else's domain builds someone else's asset, and it looks wrong on a pin.

**The default shareable is the product page.** When there is one link to give,
this is it.

```
https://www.thekapture.com/product-page/the-vanishing-exhibit-printable-escape-room-kit-ages-9-12
```

Three on-domain posts feed it. Each answers a question parents search before they
search for a product, and each links to the product page and to the free puzzle.

| Post | Search intent it answers |
|---|---|
| [/post/how-to-run-an-escape-room-birthday-party-for-9-to-12-year-olds](https://www.thekapture.com/post/how-to-run-an-escape-room-birthday-party-for-9-to-12-year-olds) | "escape room birthday party ideas" |
| [/post/indoor-birthday-party-ideas-for-10-year-olds-that-actually-fill-an-hour](https://www.thekapture.com/post/indoor-birthday-party-ideas-for-10-year-olds-that-actually-fill-an-hour) | "indoor birthday party ideas for 10 year olds" |
| [/post/how-to-make-an-escape-room-at-home-the-six-puzzles-that-work-with-kids](https://www.thekapture.com/post/how-to-make-an-escape-room-at-home-the-six-puzzles-that-work-with-kids) | "how to make an escape room at home" |
| [/post/a-free-printable-escape-room-puzzle-for-ages-9-to-12](https://www.thekapture.com/post/a-free-printable-escape-room-puzzle-for-ages-9-to-12) | "free printable escape room" |
| [/post/running-an-escape-room-in-a-classroom-or-library](https://www.thekapture.com/post/running-an-escape-room-in-a-classroom-or-library) | "escape room classroom activity" |

Post ids, for updating them through the API:
`731601c4-923c-45cc-9ae2-d480429ffe38`,
`f69faf7d-a2dd-41d2-9325-5f41d241895a`,
`9993ed77-9f88-43b5-84f5-a00d55ba9ca4`,
`9ba362fa-16de-4d39-8e35-fbc261e0d767`,
`aee97567-0991-4aed-853e-ea6f814af2b7`.
Their markdown sources are in `content/posts/`, except the first, which was
published before we kept sources; recover it with Convert From Ricos Document if
it ever needs editing.

Wix Blog posts remain the only page type the API can add to this site. Write
markdown, convert with `POST /ricos/v1/ricos-document/convert/to-ricos`, then
`POST /blog/v3/draft-posts?publish=true`. That is the route for every future
landing page while the Editor is out of reach.

## The free sample, and why it is not gated

The sample is two PDFs in the Media Manager:

- A4: `https://16ae0aa1-e41c-4192-9921-5c9511e1cb88.usrfiles.com/ugd/53eacf_a6fe9751255040dc9197d917464221dc.pdf`
- US Letter: `https://16ae0aa1-e41c-4192-9921-5c9511e1cb88.usrfiles.com/ugd/53eacf_326a7d8ff3cb42e2909a13edf19aeb5e.pdf`

Re-upload both whenever the sample changes; the URLs are stable per file, not per
version. They give away one puzzle of six and three sheets of twenty-five.

**The posts link straight to them, with no email gate.** That is deliberate. A
gate trades reach for addresses, which is the right trade once traffic exists and
the wrong one at zero: every point of friction now costs a reader we cannot yet
replace. Build the list after there is something to build it from.

Two gate implementations already exist for when that day comes. The Wix form
schema `b56d509c-a85c-4e75-98ae-3b1424af6a41` is correct and waiting for someone
who can reach the Editor. A published artifact page also works, captures name,
email and consent, and releases both PDFs on submit — but it lives on claude.ai,
so it fails the domain rule above and is a fallback, not the plan.

## Payments, and the one thing still unproven

**Payments are live.** Confirmed in the dashboard on 9 September 2026: Stripe for
cards, plus PayPal and AliPay, all active at checkout. Business location United
Kingdom, store currency GBP.

No API will tell you this. Wix's payment endpoints report only which methods are
*possible* in a country, never which a merchant has connected, so the dashboard is
the only source:

```
https://manage.wix.com/dashboard/16ae0aa1-e41c-4192-9921-5c9511e1cb88/payments
```

Agent sessions see a Stripe sandbox (`acct_1SVx4v3mIHJCnHM5`, `livemode: false`)
rather than the live account. To let a session read real orders and revenue,
authorise the live account for it through the Stripe tools, which issue a fresh
consent URL on request.

**Delivery has never been exercised.** No real order has run, so nothing has
tested the download email or the buyer's copy of the archive. Buy the kit with a
real card and refund it. A store that charges correctly and delivers nothing is
the worse failure, and it is the one still open.

## The 81 contacts are not a mailing list

The CRM holds 81 contacts, from site members, the Wix app, seven Stores contacts,
and manual admin entries. **Every one has `subscriptionStatus: UNSET`** — nobody
has recorded an opt-in to marketing email.

That makes them unusable for a launch campaign. This is a UK business, so consent
matters, and Wix Email Marketing will not send to unsubscribed contacts anyway.
Do not treat this number as an audience. The list to sell to is the one built
from sample downloads, and it does not exist yet.

## Everything else after launch

- Marketing plan, channel ranking and what to do first: `docs/go-to-market.md`.
- Etsy listing, paste-ready: `store/etsy-listing.md`. Pinterest copy: `store/pins/pin-copy.md`.
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
