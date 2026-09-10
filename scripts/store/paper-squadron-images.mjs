// Shop listing images for the Paper Plane Template Pack.
//
// Two rules. Every page shown is a real printed page from the PDF, screenshot
// rather than mocked up. And every plane shown is drawn by the fold engine
// wearing its actual livery, so what a buyer sees on the listing is what comes
// out of their printer.
import { pagePng, renderAll } from './canvas.mjs';
import { paperSquadron as kit, planes } from '../../src/content/paper-squadron.ts';
import { model, sheetHeight } from '../../src/render/documents/planes/parts.ts';
import { foldedPreview } from '../../src/render/livery.ts';

const PRODUCT = 'paper-squadron';
const png = (name) => pagePng(PRODUCT, name);

const pages = {
  start: await png('00_Start-Here-01'),
  folding: await png('01_Flight-School-01'),
  trimming: await png('01_Flight-School-03'),
  squadron: await png('01_Flight-School-04'),
  foldHawk: await png('02_Fold-Instructions-03'),
  foldArrow: await png('02_Fold-Instructions-02'),
  foldHammer: await png('02_Fold-Instructions-07'),
  tplHawk: await png('03_Plane-Templates-03'),
  tplHammer: await png('03_Plane-Templates-07'),
  tplBoomerang: await png('03_Plane-Templates-08'),
  log: await png('04_Flight-Log-01'),
  challenges: await png('04_Flight-Log-03'),
  badges: await png('05_Hangar-Extras-01'),
  target: await png('05_Hangar-Extras-03'),
  certs: await png('05_Hangar-Extras-04'),
};

const h = sheetHeight('A4');
const plane = Object.fromEntries(planes.map((p) => [p.id, foldedPreview(p, model(p, 'A4'), h)]));

const CSS = `
  body { background:var(--paper-tint); color:var(--ink); font-family:var(--font-text); }
  .canvas { width:100%; height:100%; padding:64px; display:flex; flex-direction:column; }
  .page { border:1px solid rgba(20,22,26,.16); box-shadow:0 10px 28px rgba(20,22,26,.16); background:#fff; }
  .big { font-family:var(--font-display); font-size:70px; line-height:0.94; letter-spacing:-0.02em; margin:0; }
  .mid { font-family:var(--font-display); font-size:52px; line-height:0.98; letter-spacing:-0.02em; margin:0; }
  .kicker { font-family:var(--font-signage); font-weight:600; letter-spacing:.2em;
            text-transform:uppercase; font-size:19px; color:var(--hi); }
  .sub { font-size:26px; line-height:1.42; color:var(--ink-soft); }
  .facts { display:flex; gap:46px; }
  .facts .k { font-family:var(--font-signage); font-weight:600; letter-spacing:.16em;
              text-transform:uppercase; font-size:16px; color:var(--ink-faint); }
  .facts .v { font-size:24px; font-weight:600; }
  .grid { display:grid; gap:22px; }
  .cap { font-family:var(--font-signage); font-weight:600; letter-spacing:.14em;
         text-transform:uppercase; font-size:15px; color:var(--ink-faint); margin-top:10px; }
  .thumb { display:flex; flex-direction:column; min-height:0; }
  .thumb img { width:100%; flex:1 1 0; min-height:0; object-fit:cover; object-position:top center; }
  .brandbar { display:flex; justify-content:space-between; align-items:center;
              border-top:3px solid var(--ink); padding-top:20px; margin-top:auto; }
  .brandbar .l { font-family:var(--font-signage); font-weight:600; letter-spacing:.2em;
                 text-transform:uppercase; font-size:17px; }
  ul.big-bullets { margin:0; padding-left:26px; font-size:25px; line-height:1.5; }
  ul.big-bullets li { margin-bottom:12px; }
  .fleet { display:grid; gap:14px 26px; }
  .fleet .row { display:flex; align-items:center; gap:16px; }
  .fleet svg { width:150px; height:auto; flex:0 0 auto; }
  .fleet .nm { font-family:var(--font-display); font-size:21px; line-height:1 }
  .fleet .wh { font-size:17px; color:var(--ink-faint); line-height:1.25 }
  .planebox { flex:1 1 0; min-height:0; display:flex; align-items:center; justify-content:center; }
  .planebox svg { width:100%; height:100%; }
  .finxl { font-family:var(--font-signage); font-size:20px; font-weight:700; letter-spacing:.18em;
           text-transform:uppercase; border:2px solid var(--ink); padding:8px 16px; display:inline-block; }
`;

const brandbar = (right) => `<div class="brandbar">
  <span class="l">${kit.seriesName}</span>
  <span class="l" style="color:var(--ink-faint)">${right}</span></div>`;

const IMAGES = [
  {
    name: '01-hero',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">Printable paper planes &middot; instant download</div>
      <h1 class="big" style="margin-top:14px">Ten paper planes<br/>that actually fly</h1>
      <div style="display:flex;gap:36px;align-items:center;flex:1;margin:26px 0;min-height:0">
        <div style="width:42%;flex:0 0 auto">
          <p class="sub" style="margin:0">Every fold drawn out step by step, and the design already printed on the
          sheet you fold.</p>
          <p class="sub" style="margin:18px 0 0">Ordinary printer paper. No glue, no scissors, no tape.</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:30px;min-width:0;height:100%">
          <div class="planebox">${plane.hawk}</div>
          <div class="planebox">${plane.hammer}</div>
        </div>
      </div>
      <div class="facts" style="margin-bottom:26px">
        <div><div class="k">For</div><div class="v">${kit.ageRange}</div></div>
        <div><div class="k">Planes</div><div class="v">10</div></div>
        <div><div class="k">Sheets</div><div class="v">34</div></div>
        <div><div class="k">Paper</div><div class="v">A4 and US Letter</div></div>
      </div>
      ${brandbar('Instant download &middot; print at home')}
    </div>`,
  },
  {
    name: '02-the-ten-planes',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">Ten planes, ten different flights</div>
      <h1 class="mid" style="margin-top:12px">No two of them do<br/>the same thing</h1>
      <div class="fleet" style="grid-template-columns:1fr 1fr;margin:34px 0;flex:1;align-content:start">
        ${planes.map((p) => `<div class="row">
          <div style="width:150px;flex:0 0 auto">${plane[p.id]}</div>
          <div><div class="nm">${p.name.toUpperCase()}</div>
            <div class="wh">${p.best} &middot; ${p.tagline}</div></div>
        </div>`).join('')}
      </div>
      ${brandbar('Distance &middot; hang time &middot; accuracy &middot; stunts')}
    </div>`,
  },
  {
    name: '03-every-fold-drawn',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">The part everyone else gets wrong</div>
      <h1 class="mid" style="margin-top:12px">Every fold drawn,<br/>in the right order</h1>
      <p class="sub" style="max-width:900px;margin-top:16px">One sheet per plane. Each step shows the model as it
      is now and the fold to make next, at the same size every time, so you can see it shrinking as you go.</p>
      <div style="display:flex;gap:26px;flex:1;margin:28px 0;min-height:0">
        <img class="page" src="${pages.foldHawk}" style="width:47%;object-fit:cover;object-position:top"/>
        <div style="flex:1;display:flex;flex-direction:column;gap:20px">
          <ul class="big-bullets">
            <li>A line language a six-year-old learns once</li>
            <li>What each fold is for, and the mistake to avoid</li>
            <li>How to throw that plane, and what to bend if it dives</li>
            <li>The finished plane from above and head on</li>
          </ul>
          <img class="page" src="${pages.trimming}" style="width:100%;flex:1;min-height:0;object-fit:cover;object-position:top"/>
        </div>
      </div>
      ${brandbar('Works in black and white')}
    </div>`,
  },
  {
    name: '04-the-templates',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">The bit that makes it a template pack</div>
      <h1 class="mid" style="margin-top:12px">The fold lines are<br/>already on the paper</h1>
      <p class="sub" style="max-width:880px;margin-top:16px">Print the template, fold along the printed lines, and
      the plane comes out right first time &mdash; wearing a livery that lands exactly where it should.</p>
      <div class="grid" style="grid-template-columns:repeat(3,1fr);flex:1;margin:28px 0;min-height:0">
        ${[[pages.tplHawk, 'Hawk &middot; template 3'], [pages.tplHammer, 'Hammer &middot; template 7'],
           [pages.tplBoomerang, 'Boomerang &middot; template 8']]
          .map(([src, cap]) => `<div class="thumb"><img class="page" src="${src}"/><div class="cap">${cap}</div></div>`).join('')}
      </div>
      <p class="sub" style="margin-bottom:22px"><strong>Nothing is printed on the part that folds away</strong>,
      so a template costs about half the ink you would expect.</p>
      ${brandbar('Ten templates, two paper sizes')}
    </div>`,
  },
  {
    name: '05-whats-inside',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">What you download</div>
      <h1 class="mid" style="margin-top:12px">34 printable sheets,<br/>ready to go</h1>
      <div class="grid" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);margin-top:32px;flex:1;min-height:0">
        ${[[pages.foldArrow, 'Fold sheets &middot; 10'], [pages.tplHawk, 'Templates &middot; 10'],
           [pages.folding, 'Flight school &middot; 5'], [pages.log, 'Flight log &middot; 3'],
           [pages.challenges, 'Challenge cards &middot; 12'], [pages.certs, 'Certificates &amp; badges']]
          .map(([src, cap]) => `<div class="thumb"><img class="page" src="${src}"/><div class="cap">${cap}</div></div>`).join('')}
      </div>
      ${brandbar('Instant download &middot; PDF')}
    </div>`,
  },
  {
    name: '06-make-it-a-contest',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">After the folding</div>
      <h1 class="mid" style="margin-top:12px">Turn it into<br/>a competition</h1>
      <p class="sub" style="max-width:880px;margin-top:16px">Three contests, not one &mdash; furthest, longest in
      the air, closest to the target. Different children win different ones, which is the point of having ten
      different planes.</p>
      <div style="display:flex;gap:24px;flex:1;margin:28px 0;min-height:0">
        <img class="page" src="${pages.log}" style="width:32%;object-fit:cover;object-position:top"/>
        <img class="page" src="${pages.target}" style="width:32%;object-fit:cover;object-position:top"/>
        <img class="page" src="${pages.challenges}" style="width:32%;object-fit:cover;object-position:top"/>
      </div>
      <p class="sub" style="margin-bottom:22px">Flight log, target rings, a throwing line, twelve challenge cards,
      pilot licences and three award certificates.</p>
      ${brandbar('Party, classroom, rainy Saturday')}
    </div>`,
  },
  {
    name: '07-printing',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">Before you buy</div>
      <h1 class="mid" style="margin-top:12px">It will print on<br/>your printer</h1>
      <div style="display:flex;gap:44px;margin-top:34px;flex:1;min-height:0">
        <div style="flex:1">
          <ul class="big-bullets">
            <li><strong>A4 and US Letter</strong> in the same download, each drawn separately so the fold lines
              land in the right place on both</li>
            <li><strong>Ordinary printer paper.</strong> Not card, not photo paper</li>
            <li><strong>Black and white</strong> works throughout</li>
            <li><strong>Single-sided.</strong> No glue, scissors or tape needed to fly</li>
            <li>Corner ticks on every template prove your printer did not shrink the page</li>
          </ul>
          <div style="margin-top:34px"><span class="finxl">Instant download</span></div>
        </div>
        <img class="page" src="${pages.start}" style="width:42%;object-fit:contain;object-position:top;align-self:flex-start"/>
      </div>
      ${brandbar('34 sheets &middot; 6 PDFs &middot; 2 paper sizes')}
    </div>`,
  },
  {
    name: '08-first-edition',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="kicker">Honest label</div>
        <span class="finxl">${kit.edition}</span>
      </div>
      <h1 class="mid" style="margin-top:14px">Every fold is computed,<br/>not traced.</h1>
      <p class="sub" style="max-width:900px;margin-top:24px">The diagrams are not drawings of paper planes. They
      are generated by a folding model that knows where every crease lands, which is why the printed fold lines on
      the template match the diagrams exactly, and why the design finishes on the outside of the plane rather than
      inside it.</p>
      <div style="display:flex;gap:26px;flex:1;align-items:flex-start;margin-top:30px;min-height:0">
        <div class="panel panel--warn" style="flex:1;padding:28px">
          <div class="panel__title" style="font-size:16px">What that buys you</div>
          <ul class="big-bullets" style="font-size:21px">
            <li>Fold lines that are in the right place on both paper sizes</li>
            <li>A fold that would not lie flat cannot ship: the build refuses it</li>
            <li>Ink only where the design will still be visible</li>
          </ul>
        </div>
        <div style="width:44%">${plane.kestrel}</div>
      </div>
      ${brandbar(`${kit.publisherUrl}`)}
    </div>`,
  },
];

await renderAll({ theme: 'flight', out: 'store/planes/images', css: CSS, images: IMAGES });
