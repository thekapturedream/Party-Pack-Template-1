// Pinterest pins, 2:3 vertical, built from real pages of the kit. Pinterest is
// the second channel in docs/go-to-market.md and the one that compounds, so the
// pins show the actual evidence sheets rather than styled stock photography.
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';

const OUT = 'store/pins';
await mkdir(OUT, { recursive: true });

const tokens = await readFile('src/design/tokens.css', 'utf8');
const fonts = await readFile('assets/fonts/fonts.css', 'utf8');
const png = async (n) => `data:image/png;base64,${(await readFile(`dist/preview/${n}.png`)).toString('base64')}`;

const page = {
  cipher: await png('02_Player-Pack-04'),
  cover: await png('02_Player-Pack-01'),
  host: await png('01_Host-Guide-01'),
  clock: await png('02_Player-Pack-05'),
  plan: await png('02_Player-Pack-03'),
  door: await png('05_Party-Extras-01'),
};

const W = 1000, H = 1500;

const shell = (body) => `<!doctype html><html><head><meta charset="utf-8"/>
<style>${fonts}${tokens}
  *{box-sizing:border-box}
  body{margin:0;width:${W}px;height:${H}px;background:var(--paper-tint);
       font-family:var(--font-text);color:var(--ink);-webkit-font-smoothing:antialiased}
  .pin{width:${W}px;height:${H}px;padding:64px 58px;display:flex;flex-direction:column}
  .kicker{font-family:var(--font-signage);font-weight:600;letter-spacing:.2em;
          text-transform:uppercase;font-size:20px;color:var(--evidence)}
  h1{font-family:var(--font-display);font-weight:900;font-size:70px;line-height:1.0;
     letter-spacing:-.015em;margin:16px 0 0}
  h1.sm{font-size:58px}
  .sub{font-size:27px;line-height:1.4;color:var(--ink-soft);margin-top:20px}
  .art{flex:1;position:relative;margin:34px 0;min-height:0}
  .art img{position:absolute;border:1px solid rgba(18,20,26,.16);
           box-shadow:0 18px 44px rgba(18,20,26,.22);background:#fff;
           max-height:100%;width:auto}
  .art img.wide{width:auto}
  .foot{display:flex;justify-content:space-between;align-items:center;
        border-top:3px solid var(--ink);padding-top:22px}
  .foot span{font-family:var(--font-signage);font-weight:600;letter-spacing:.18em;
             text-transform:uppercase;font-size:19px}
  .foot .muted{color:var(--ink-faint)}
  .facts{display:flex;gap:34px;margin-top:6px}
  .fact{font-family:var(--font-signage);font-weight:500;letter-spacing:.1em;
        text-transform:uppercase;font-size:18px;color:var(--ink-faint)}
</style></head><body>${body}</body></html>`;

const PINS = [
  {
    name: 'pin-01-how-to-run',
    body: `<div class="pin">
      <div class="kicker">Ages 9&ndash;12</div>
      <h1>How to run an<br/>escape room<br/>birthday party</h1>
      <p class="sub">What you actually need, how the hour runs,
         and why it works when soft play has stopped working.</p>
      <div class="art">
        <img src="${page.host}" style="height:88%;left:0;top:6%;transform:rotate(-4deg)"/>
        <img src="${page.plan}" style="height:88%;right:0;top:12%;transform:rotate(4deg)"/>
      </div>
      <div class="foot"><span>thekapture.com</span><span class="muted">Free puzzle inside</span></div>
    </div>`,
  },
  {
    name: 'pin-02-free-puzzle',
    body: `<div class="pin">
      <div class="kicker">Free printable</div>
      <h1>One real puzzle,<br/>free</h1>
      <p class="sub">A code-breaking puzzle from a printable escape room,
         with its hints and its solution. Try it before you buy anything.</p>
      <div class="art">
        <img src="${page.cipher}" style="height:100%;left:50%;top:0;transform:translateX(-50%)"/>
      </div>
      <div class="facts">
        <span class="fact">A4 + US Letter</span>
        <span class="fact">Black &amp; white</span>
        <span class="fact">8 minutes</span>
      </div>
      <div class="foot" style="margin-top:22px"><span>thekapture.com</span><span class="muted">Ages 9&ndash;12</span></div>
    </div>`,
  },
  {
    name: 'pin-03-the-kit',
    body: `<div class="pin">
      <div class="kicker">Printable escape room</div>
      <h1 class="sm">25 sheets.<br/>One afternoon.<br/>No props.</h1>
      <p class="sub">A museum mystery for a birthday party. Fifteen minutes to set up,
         an hour to play, and you never have to solve anything yourself.</p>
      <div class="art">
        <img src="${page.cover}" style="height:80%;left:0;top:8%;transform:rotate(-5deg)"/>
        <img src="${page.clock}" style="height:86%;left:50%;top:6%;transform:translateX(-50%) rotate(1deg)"/>
        <img src="${page.door}" style="height:80%;right:0;top:10%;transform:rotate(6deg)"/>
      </div>
      <div class="foot"><span>thekapture.com</span><span class="muted">Instant download</span></div>
    </div>`,
  },
  {
    name: 'pin-04-indoor-ideas',
    body: `<div class="pin">
      <div class="kicker">Indoor party ideas</div>
      <h1 class="sm">Ten is the<br/>hardest age<br/>to book for</h1>
      <p class="sub">Soft play is beneath them and laser tag is over in forty minutes.
         Five indoor formats that actually hold the room for an hour.</p>
      <div class="art">
        <img src="${page.cipher}" style="height:88%;left:0;top:6%;transform:rotate(-4deg)"/>
        <img src="${page.door}" style="height:70%;right:0;top:18%;transform:rotate(5deg)"/>
      </div>
      <div class="foot"><span>thekapture.com</span><span class="muted">Free puzzle inside</span></div>
    </div>`,
  },
];

const browser = await chromium.launch();
for (const pin of PINS) {
  const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await p.setContent(shell(pin.body), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${OUT}/${pin.name}.jpg`, type: 'jpeg', quality: 90 });
  await p.close();
  console.log(`${OUT}/${pin.name}.jpg`);
}
await browser.close();
