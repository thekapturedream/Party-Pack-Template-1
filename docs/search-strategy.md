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
