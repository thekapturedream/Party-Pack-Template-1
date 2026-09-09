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

Wix Stores Catalog V1 **cannot create digital products through its API** — it
returns `product.productType digital is not supported`, and Wix does not allow a
product's type to be changed after creation, so a physical placeholder would have
to be deleted rather than converted. The product therefore has to be created once
in the dashboard. Everything it needs is already uploaded.

1. Open **Wix dashboard → Store Products → New Product → Digital Product**.
2. Paste the name, description, price, ribbon and SKU above.
3. **Digital file:** click the upload field and choose *Media Manager*. The file
   is already there, uploaded as private: `The-Vanishing-Exhibit-v1.0.zip`.
4. **Images:** add all six from the Media Manager, in this order —
   `vanishing-exhibit-01-hero` … `06-playtest-edition`. Image 1 is the one that
   shows in search and social, so it must stay first.
5. Fill in the SEO panel from the section above.
6. Save and set the product visible.

## After launch

- Publish `Free-Sample.pdf` (in `dist/`, not in the paid zip) as a free download or
  an email opt-in. It is evidence 3 printed exactly as it appears in the kit, plus
  its hints and solution, so a parent can judge the reading age before paying.
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
