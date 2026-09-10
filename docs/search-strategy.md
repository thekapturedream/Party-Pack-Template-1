# Catching search queries

Researched 9 September 2026 against live results, not from memory.

## You cannot see who searched. You can only be there when they do.

There is no lawful way to obtain the identity of someone who typed a query. What
"catching search queries" actually means is three different mechanics, and they
need separating because they cost different things.

1. **Rank for the query.** Free, slow, compounding, and yours permanently. This
   is the on-domain posts.
2. **Bid on the query.** Instant, priced per click, gone when you stop paying.
3. **Answer the query where it is asked out loud.** Free, immediate, and the only
   one that also tells you how parents phrase the problem themselves.

The third is the one most people skip, and for a product with no audience it is
the fastest of the three.

## What the results actually look like

**"free printable escape room" is wide open.** The current page-one results are a
Scribd upload, a clipart-library page, a 2018 PDF and two kindergarten teaching
blogs. Almost all of it is aimed at five to eight-year-olds. Nothing on that page
is written for nine to twelve, and nothing on it is as well made as our sample.
That is the single best-value gap available, and it is now covered:
`/post/a-free-printable-escape-room-puzzle-for-ages-9-to-12`.

**The commercial queries are crowded but not closed.** Lock Paper Scissors, Escape
Room Geeks, MysteryLocks and Escape Kit hold the head terms. Do not fight them
there.

**Etsy's winning pattern is age-specific long tail.** The listings that rank carry
titles like "Girls 10th Birthday Escape Room Kit" and "Girls 11th Birthday Escape
Room Kit" — one seller running near-duplicate listings, one per age. Etsy rewards
that in a way Google does not. Worth copying on Etsy, not worth copying on the
blog.

**Teachers Pay Teachers is a live marketplace for exactly this.** Search results
for free printable escape rooms surface TPT directly. Our licence already covers
classroom use, and TPT's audience is the same one `docs/lead-generation.md`
identifies. It is a second marketplace, not a distraction.

## The query map

| Intent | Query shape | What catches it | State |
|---|---|---|---|
| Panic | "indoor birthday party ideas for 10 year olds" | Post: indoor party ideas | Live |
| Research | "escape room birthday party ideas" | Post: how to run the hour | Live |
| Build it myself | "how to make an escape room at home" | Post: the six puzzle types | Live |
| Try before buying | "free printable escape room" | Post: the free puzzle | Live |
| Ready to buy | "printable escape room kit ages 9-12" | Product page, and Etsy | Live, weak on Google |
| Institutional | "escape room classroom activity", "library holiday activity" | Post: classroom and library | Live |

Every row is now covered. The institutional post is the one the school and
library emails in `store/outreach.md` link to, so the outreach and the search
work share an asset rather than each needing their own.

The weakest row is "ready to buy". The product page is live but will not outrank
Lock Paper Scissors or Escape Room Geeks on Google, which is the argument for
Etsy carrying that intent instead.

One caveat about the domain: thekapture.com's blog also carries posts about
photography, nonprofits and web design. Mixed topics dilute how clearly Google
reads what the site is about. Not worth deleting anything, but every new post
should be on this subject until the cluster is established.


## Channels beyond ranking and posting

Checked on 10 September 2026, in order of effort against likely return.

**Google Merchant Center: recommended against, having checked properly.**

The technical half is fine. The product page already emits correct Product
structured data — Wix generates it, verified live: `Product`, `Offer`, `Brand`,
price `22` in `GBP`, `availability: InStock`. Nothing on our side is missing.

Google's policy is the problem. It excludes eBooks and PDFs from Shopping ads
outright. Free listings are the exception where a PDF can still earn clicks, so
the upside here is free listings only, never Shopping ads. Against that, digital
and printable products are routinely rejected, approval is often reversed later,
and a Merchant Center suspension for digital goods can take the linked Google Ads
account with it, which is difficult to undo.

A narrow upside against an account-level downside is a bad trade for a £22
printable. Do not connect it now.

There is also no route: no Wix API connects Merchant Center on its own. The only
API reference to it is a *setting* on a Google Ads account — the Account API can
update "the linked Merchant Center account" — which requires installing the Wix
Google Ads app and creating a Google Ads account first. That is the paid channel
this document defers, and it is precisely the account that a suspension would put
at risk.

Revisit only if the catalogue grows into something where the free listings are
worth the exposure, and connect Merchant Center on its own rather than through a
Google Ads account, so a suspension cannot cascade.

**Etsy carries transactional intent instead.** It is a marketplace with buying
intent already in it, no policy problem with printables, and it is already the
first step of the plan.

**Teachers Pay Teachers.** A live marketplace for exactly this material, and it
surfaced in the search results for free printable escape rooms. The licence
already covers classroom use, the classroom post is already written, and the
audience is the same one `docs/lead-generation.md` targets. It is a second
marketplace alongside Etsy rather than a distraction, and the same assets serve
both. Do it after Etsy, so there is one channel's worth of evidence first.

**Roundup links.** Template 4 in `store/outreach.md`. Several pages ranking for
"free printable escape room" are lists of other people's resources, and being
added to one sends referral traffic immediately while telling Google what this
domain is about. That second effect matters here more than usual, because the
blog also carries photography and web-design posts.

**Topical clustering, done 10 September 2026.** All five posts are now in one
category, which also created an indexable landing page:
`/blog/categories/escape-rooms-and-party-games`. It groups the cluster for Google
and gives outreach a single link that shows everything at once. Put every future
post in the same category.

**Video.** Pinterest and Facebook both favour video over static images, and a
thirty-second silent pan across the printed sheets needs no script, no face and
no voice. Descript and OpusClip are connected to this project if it is ever worth
making. Not yet: the static pins have not been tested, so there is nothing to
improve on.

## The instrument: Google Search Console

This is the only thing that shows real queries rather than guesses. It is free,
and until it is connected nobody knows which of the five posts is being found.

1. Add `thekapture.com` as a domain property at search.google.com/search-console.
2. Verify by DNS. Wix domains do this through the Wix dashboard's SEO tools,
   which handles the record for you.
3. Submit `https://www.thekapture.com/sitemap.xml`. All five posts are already in
   it and Wix regenerates it on publish.
4. Wait two weeks. Then read the Performance report by query, not by page.

What to do with it: any query showing impressions but no clicks means the title
and description are wrong for what the searcher wanted, and those are editable
through the Blog API in minutes. Any query with clicks but no sales means the
post is not connecting to the product. Those are different fixes, and the
combined number hides which one you have.

## Answering the question where it is asked

UK parents ask this out loud on Mumsnet, constantly, in threads titled almost
exactly like our posts: "Ideas for 10th birthday party games", "Suggestions for
10th birthday party at home", "Party for a 10 year old", "At home birthday party
ideas for 10 year old girl". The answers they get are spa parties, pizza making
and pass-the-parcel. **Escape rooms barely appear.** That is a live gap in a
public forum.

Read the rules before posting. Mumsnet restricts promotion by businesses, and a
post that reads as an advert is deleted and remembered. What is acceptable is
being a person who answers the question, with the free puzzle mentioned only
where it is genuinely the answer. If in doubt, answer the question and link
nothing; the name is the point.

Reddit's r/Parenting and r/Mommit have the same shape and the same rules.

Set up a saved search or an alert for the recurring phrasings rather than
browsing: "10th birthday party at home", "escape room party", "11th birthday
ideas". Answer two or three a week, properly, and never more.

## Paid search, and when

Last, and only after Search Console has run for a month. At £22 with roughly £11
of margin, the gate allows £8 of acquisition cost, which is one or two clicks on
a competitive party term. Paying for traffic before the free channels have shown
what converts is buying data at the worst available price.

If it is ever run, bid on the specific long tail — "printable escape room 10 year
old" — never the head term, and send the click to the product page rather than a
post.


---

## The sixth post: paper planes

[How to fold a paper airplane that actually
flies](https://www.thekapture.com/post/how-to-fold-a-paper-airplane-that-actually-flies)
— post id `9f9c5aa6-668e-4ccb-80c5-0a6c5b2216d7`, source in
`content/posts/paper-airplane-that-flies-far.md`.

**Query it catches:** "how to fold a paper airplane that flies far", and the long
tail around it — "why does my paper airplane dive", "how to throw a paper
airplane", "paper airplane instructions for kids".

**Why it is different from the other five.** Those five answer questions that a
parent planning a party might type, and the honest position on them is that the
volume is thin. This one answers a question a very large number of people type
every week, most of them children. The competition is correspondingly harder —
there are thousands of paper plane pages — but the post has something almost none
of them have: it is about the four things that make planes fail rather than a
list of designs, and it ends with a free plane that works.

**What to watch.** This is the first page on the domain where Search Console
should show impressions within weeks rather than months. If it does not, the
problem is the domain's authority rather than the post, and the answer is Pinterest
and Etsy rather than more posts.

**Do not write a second paper plane post yet.** Wait for this one to show
impressions and see which queries it actually lands on. Writing three more first
is how the escape room ended up with five posts and no data.
