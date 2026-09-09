# Getting The Vanishing Exhibit in front of people

Written 9 September 2026, after the listing went live. Everything here is about
one question: the store now works, but nobody is walking past it.

## The problem to be honest about first

The Kapture's store had zero products until today, and a store with no products
has no traffic. The gate in the original brief — 10 purchases from 300 qualified
visits, at no more than £8 acquisition cost — assumes 300 qualified visits exist.
They do not.

This is the standard failure mode for digital products. New sellers routinely
spend months building a standalone store with no audience and make no sales, then
break through only when they put the product where buying intent already is.

So the first job is demand, not conversion. The listing is finished; do not spend
more time polishing it until people are seeing it.

## Where to be visible, ranked by how fast it can produce evidence

### 1. Etsy — for demand, not margin

Etsy is where people already type "printable escape room". Lock Paper Scissors,
Escape Room Geeks, MysteryLocks, PaperEscapeCo and It's a Lock all sell into this
market, and Etsy carries a large listing set for the same search.

Fees run about 6.5% per sale plus listing costs, so margin is worse than selling
direct. Take that trade knowingly. What Etsy buys is not profit, it is the answer
to whether parents want this at all, and the first reviews, which are the single
hardest asset to acquire from a standing start.

List the same kit at the same price. Do not discount to buy rank; a lower price
tells you a different thing than the one we need to learn.

### 2. Pinterest — the discovery engine for party planning

Pinterest is where parents plan parties, and pins keep working for months rather
than hours. This suits a product with no news value and year-round demand.

Pin the actual pages, not styled stock photography. The evidence sheets are the
product's argument: a photograph of a case file with a coded card on it says more
than a flat-lay of balloons.

Three pins are built and waiting in `store/pins`, 1000 × 1500, generated from real
sheets by `scripts/pins.mjs`: one for the how-to post, one for the free puzzle, one
for the kit. Regenerate rather than editing them by hand. Titles, descriptions,
boards and destination URLs are written out in `store/pins/pin-copy.md`.

### 3. Search, on thekapture.com

The free sample is the SEO asset, not the product page. Parents search problems
before products: "escape room birthday party ideas for 10 year olds", "what to do
at a 10th birthday party indoors", "printable escape room for kids". Those are
long-tail, low-competition, and they convert into sample downloads rather than
straight into sales.

Three posts are live, each aimed at a different query, each linking to the free
puzzle and to the product page:

- `/post/how-to-run-an-escape-room-birthday-party-for-9-to-12-year-olds`
- `/post/indoor-birthday-party-ideas-for-10-year-olds-that-actually-fill-an-hour`
- `/post/how-to-make-an-escape-room-at-home-the-six-puzzles-that-work-with-kids`

Wix Blog posts are the only page the API can add to this site, so this is also the
only way more pages get built until someone can reach the Editor. The markdown
sources live in `content/posts/`.

Wix's AI Marketing Agent (Kleo) does keyword research, page optimisation, blog
posts and a monthly content plan, and the SEO half is free. It requires review and
approval before anything publishes, so it drafts, it does not post unsupervised.
Connect Google Search Console first, or it has nothing to work from — and until
that is connected, nobody knows which of these three posts is being found.

### 4. Parent and teacher communities

Facebook parent groups and local school groups are high intent and free, and they
punish anything that reads as advertising. The only version that works is genuine
participation: answer the "what do I do for my 10 year old's birthday" posts, and
mention the free sample when it is actually the answer.

The licence already permits classroom, library and club use, which opens teachers
and home educators as a second audience without any product changes. Teachers Pay
Teachers is the adjacent marketplace if that audience responds.

### 5. Seasonality

Birthdays happen year-round. That is an unusually good property: unlike Christmas
or Halloween printables, there is no dead half of the year, and no cliff after a
single date. Plan for steady spend rather than a seasonal push.

## The customer journey, and what runs each step

| Stage | What happens | Runs on |
|---|---|---|
| Discovery | Pinterest pin, Etsy search, or a blog post answering a party-planning question | Pinterest, Etsy, Kleo for SEO content |
| Try | Free sample, ungated, linked from every post | Wix Blog post + Media Manager PDFs |
| Nurture | Two emails: the sample, then one asking how it went with a link to the full kit | Wix Automations, Wix Email Marketing |
| Buy | Product page, £22, instant download | Wix Stores |
| Deliver | Secure archive attached to the product | Wix Stores digital product |
| Learn | Ask every buyer what dragged and what landed; the listing promises free future versions for this | Wix Inbox, Wix Automations |
| Repeat | Kit two, sold to the list built by the sample | Wix Email Marketing |

The step that matters most is **Learn**. The product is a playtest edition and the
listing makes a promise in exchange for feedback. That promise is also the cheapest
research budget available: buyers will tell you what to fix before you build kit two.

## Wix's AI agents — what is actually worth using

- **Front desk agent (Juno). Do not build on it.** Wix's own help centre says
  "Starting October 2026, the Front Desk Agent will no longer be supported."
  That is next month. Wix directs users to the Wix Inbox instead.
- **Kleo, the AI Marketing Agent.** The relevant one. SEO, social posts, email
  campaigns and Google Ads from one place, with review-and-approve before anything
  publishes. SEO is free; social and email have monthly quotas; new Premium plans
  include the AI credits. Connect Google Search Console during onboarding or the
  SEO half has nothing to work from.
- **Aria.** Free, in the dashboard from day one, general business and site
  assistant. Useful for analytics questions, not a growth channel.
- **Alfred, the phone agent.** Not for a £22 digital download. Nobody phones about
  a printable.

Treat Kleo as a drafting assistant with a review gate, not an autopilot. It cannot
tell you whether parents want the product; it can only make more of what you point
it at.

## Do these, in this order

Everything above is the map. This is the route. Nothing here needs a budget.

**1. Buy the kit once, with a real card, and refund it.** Payments are confirmed
live — Stripe, PayPal and AliPay are all active at checkout — so this is no longer
about whether money can be taken. It is about delivery, which nothing has
exercised: whether the download email arrives and whether the archive opens for
the buyer. A store that charges correctly and delivers nothing is the worse
failure. Ten minutes, and it is the last thing between here and traffic.

**2. List on Etsy.** `store/etsy-listing.md` is written to be pasted: title, price,
all thirteen tags, the description, and which of the existing images goes in which
slot. Same price as the direct listing. This is the only channel with buying intent
already in it, and the only realistic source of the first review.

**3. Set up the three Pinterest boards and pin the three pins.**
`store/pins/pin-copy.md` has the titles, descriptions and destination URLs. Two to
three pins a week, never a burst.

**4. Connect Google Search Console** to the site, so the three posts start
reporting impressions and queries. This costs nothing and is the difference
between knowing and guessing in six weeks.

**5. Answer party questions where parents already ask them.** Facebook parent
groups and local school groups, genuinely, without a pitch. Mention the free
puzzle only when it is actually the answer. This is slow, free, and the only
channel that also tells you how parents describe the problem in their own words.

**6. Five family playtests.** Still the real gate. Do not spend money widening the
top of the funnel for a product that has never been run at a real party.

Paid ads stay last. At £22 with roughly £11 of margin, a £8 acquisition cost leaves
almost nothing, and paying for traffic before the free channels have told you what
converts is buying data at the worst possible price.

## What is actually connected, checked 9 September 2026

Read through Wix's Publisher API rather than assumed.

| Channel | State |
|---|---|
| Facebook | Connected, six pages under one Facebook login: The Kapture (default), Kapture Studio, Kapture Academy, Spa_ces, Shugar, Shugar Jewelry |
| Instagram | Not connected |
| Pinterest | Not connected |
| LinkedIn, YouTube, TikTok, Google Business Profile | Not connected |

Instagram and Pinterest cannot be connected through the API on this plan: Get
Connect Url returns 428, `metasite is ineligible for feature`. So Pinterest stays
a manual channel, which is what `store/pins/pin-copy.md` already assumes. Nothing
to change there, but do not plan on automating it.

Facebook is the one channel Wix can publish to today, and The Kapture page is the
default. It is a studio page rather than a parenting audience, so treat it as a
place to be findable rather than a source of demand. Post the pins there because
it is free, not because it will sell.

## There is no email list, and no lawful way to manufacture one

This was checked properly rather than assumed, because getting it wrong is an ICO
complaint and a burned sending domain.

- **Wix Contacts: 81, all unusable.** Every one has an unset email subscription
  status. Nobody opted in.
- **The seven Wix Stores contacts do not qualify for the soft opt-in.** PECR's
  soft opt-in covers marketing a *similar* product to someone whose address you
  took during a sale. The Kapture's prior sales are photography and web design. A
  children's party printable is not similar to those.
- **Google Contacts is not reachable** from this toolset at all — only Gmail,
  Drive and Calendar are connected.
- **The mailbox holds no inbound interest.** A search across two years for escape
  rooms, party kits, birthday parties and printables returned five results, all
  unrelated newsletters. There are no warm leads to work.

Harvesting addresses out of a personal address book or a mailbox and mailing them
a product promotion is direct marketing without consent. Do not do it. It is also
commercially poor: an unconsented list produces spam complaints, which is how a
sending domain gets throttled before the first real campaign.

The lawful routes, in order of value:

1. **Build the list from sample downloads.** Someone who downloads a free puzzle
   and ticks a box has given consent, and is by definition in the market. That
   list does not exist yet, which is the actual problem to solve.
2. **Write personally to people you genuinely know with a child of nine to
   twelve.** One-to-one messages, individually written, are not a mail merge.
   Perhaps twenty exist. Ask them to run it and tell you what dragged — which is
   also the five playtests the product still needs.
3. **Ask every buyer for feedback.** The listing already promises free future
   versions in exchange for it, and a buyer's address carries the soft opt-in for
   the next kit, because that genuinely is a similar product.

## The 81 contacts are not a shortcut

The CRM holds 81 contacts. Every one has an unset email subscription status, so
none has opted in to marketing. They cannot be mailed a launch announcement, and
Wix Email Marketing will not send to them regardless. Build the list from sample
downloads instead; that is what the Try step is for.

## What to measure, and when to stop

The gate from the brief still applies, but measure it where the traffic actually
is rather than on thekapture.com alone:

- 10 purchases from 300 qualified visits
- acquisition cost no higher than £8 per order
- at £22, that leaves roughly £11 per sale toward development and overhead

Add one leading indicator: **sample downloads to purchases**. If downloads are
healthy and purchases are not, the product or the price is wrong. If downloads are
weak, the channel or the message is wrong. Those need different fixes, and the
combined number hides which one you have.

Five family playtests still come before any of this is worth scaling.
