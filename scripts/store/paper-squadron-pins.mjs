// Pinterest pins for the Paper Plane Template Pack. Vertical 2:3, built from
// real printed pages and from planes drawn by the fold engine, because a pin
// that promises something the PDF does not contain is the fastest way to a
// refund and a bad review.
import { pagePng, renderAll } from './canvas.mjs';
import { planes } from '../../src/content/paper-squadron.ts';
import { model, sheetHeight } from '../../src/render/documents/planes/parts.ts';
import { foldedPreview } from '../../src/render/livery.ts';

const PRODUCT = 'paper-squadron';
const png = (n) => pagePng(PRODUCT, n);

const page = {
  foldHawk: await png('02_Fold-Instructions-03'),
  foldArrow: await png('02_Fold-Instructions-02'),
  trimming: await png('01_Flight-School-03'),
  throwing: await png('01_Flight-School-02'),
  tplHammer: await png('03_Plane-Templates-07'),
  tplHawk: await png('03_Plane-Templates-03'),
  log: await png('04_Flight-Log-01'),
  target: await png('05_Hangar-Extras-03'),
  sample: await png('Free-Sample-02'),
};

const h = sheetHeight('A4');
const plane = Object.fromEntries(planes.map((p) => [p.id, foldedPreview(p, model(p, 'A4'), h)]));

const W = 1000, H = 1500;

const CSS = `
  *{box-sizing:border-box}
  body{margin:0;width:${W}px;height:${H}px;background:var(--paper-tint);font-family:var(--font-text);color:var(--ink);
       -webkit-font-smoothing:antialiased}
  .pin{width:${W}px;height:${H}px;padding:62px 56px;display:flex;flex-direction:column}
  .kicker{font-family:var(--font-signage);font-weight:600;letter-spacing:.2em;
          text-transform:uppercase;font-size:20px;color:var(--hi)}
  h1{font-family:var(--font-display);font-size:70px;line-height:0.96;letter-spacing:-.02em;margin:16px 0 0}
  h1.sm{font-size:56px}
  .sub{font-size:27px;line-height:1.4;color:var(--ink-soft);margin-top:20px}
  .art{flex:1;position:relative;margin:32px 0;min-height:0;display:flex;flex-direction:column;
       gap:24px;justify-content:center}
  .art img{border:1px solid rgba(20,22,26,.16);box-shadow:0 18px 44px rgba(20,22,26,.22);background:#fff}
  .planebox{flex:1 1 0;min-height:0;display:flex;align-items:center;justify-content:center}
  .planebox svg{width:100%;height:100%}
  .foot{display:flex;justify-content:space-between;align-items:center;
        border-top:3px solid var(--ink);padding-top:22px}
  .foot span{font-family:var(--font-signage);font-weight:600;letter-spacing:.18em;
             text-transform:uppercase;font-size:19px}
  .foot .muted{color:var(--ink-faint)}
  .fleet{display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;flex:1;align-content:center;min-height:0}
  .fleet .row{display:flex;align-items:center;gap:12px}
  .fleet .nm{font-family:var(--font-display);font-size:19px;line-height:1}
  .fleet .wh{font-size:15px;color:var(--ink-faint)}
`;

const PINS = [
  {
    name: 'pin-01-ten-planes',
    body: `<div class="pin">
      <div class="kicker">Ages 6&ndash;12 &middot; printable</div>
      <h1>Ten paper planes<br/>that actually fly</h1>
      <p class="sub">Every fold drawn out, and the design already printed on the sheet you fold.</p>
      <div class="art">
        <div class="planebox">${plane.hawk}</div>
        <div class="planebox">${plane.boomerang}</div>
      </div>
      <div class="foot"><span>Kapture Flight School</span><span class="muted">thekapture.com</span></div>
    </div>`,
  },
  {
    name: 'pin-02-how-to-fold',
    body: `<div class="pin">
      <div class="kicker">Step by step</div>
      <h1 class="sm">How to fold a<br/>paper plane that<br/>really flies</h1>
      <p class="sub">One sheet per plane. Every fold drawn at the same size, so you can see it shrinking as you go.</p>
      <div class="art">
        <img src="${page.foldHawk}" style="width:100%;flex:1;min-height:0;object-fit:cover;object-position:top"/>
      </div>
      <div class="foot"><span>Free plane inside</span><span class="muted">thekapture.com</span></div>
    </div>`,
  },
  {
    name: 'pin-03-why-it-dives',
    body: `<div class="pin">
      <div class="kicker">The one page that fixes it</div>
      <h1 class="sm">Why your paper<br/>plane dives, and<br/>how to stop it</h1>
      <p class="sub">Bend the back corners of the wings. That is nearly the whole secret, and it is on one page.</p>
      <div class="art">
        <img src="${page.trimming}" style="width:100%;flex:1;min-height:0;object-fit:cover;object-position:top"/>
      </div>
      <div class="foot"><span>Kapture Flight School</span><span class="muted">thekapture.com</span></div>
    </div>`,
  },
  {
    name: 'pin-04-the-squadron',
    body: `<div class="pin">
      <div class="kicker">Ten planes, ten flights</div>
      <h1 class="sm">One for distance.<br/>One that comes back.</h1>
      <div class="fleet">
        ${planes.map((p) => `<div class="row"><div style="width:96px;flex:0 0 auto">${plane[p.id]}</div>
          <div><div class="nm">${p.name.toUpperCase()}</div><div class="wh">${p.best}</div></div></div>`).join('')}
      </div>
      <div class="foot"><span>Printable &middot; A4 and US Letter</span><span class="muted">thekapture.com</span></div>
    </div>`,
  },
  {
    name: 'pin-05-free-plane',
    body: `<div class="pin">
      <div class="kicker">Free printable</div>
      <h1>A free paper<br/>plane to print<br/>and fold</h1>
      <p class="sub">The Sparrow. Four folds, no scissors, no glue. Print it, fold it, fly it this afternoon.</p>
      <div class="art">
        <img src="${page.sample}" style="width:100%;flex:1;min-height:0;object-fit:cover;object-position:top"/>
      </div>
      <div class="foot"><span>Free download</span><span class="muted">thekapture.com</span></div>
    </div>`,
  },
  {
    name: 'pin-06-rainy-day',
    body: `<div class="pin">
      <div class="kicker">Indoor activity</div>
      <h1 class="sm">A rainy Saturday,<br/>ten paper planes<br/>and a target</h1>
      <p class="sub">Furthest, longest in the air, closest to the target. Three contests, so different children win
      different ones.</p>
      <div class="art">
        <img src="${page.target}" style="width:100%;flex:1;min-height:0;object-fit:cover;object-position:top"/>
      </div>
      <div class="foot"><span>Flight log inside</span><span class="muted">thekapture.com</span></div>
    </div>`,
  },
];

await renderAll({ theme: 'flight', out: 'store/planes/pins', css: CSS, images: PINS.map((p) => ({ ...p, w: W, h: H })), scale: 2, bare: true, jpegOnly: true, quality: 90 });
