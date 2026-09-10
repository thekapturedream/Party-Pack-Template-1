// Shop listing images for The Vanishing Exhibit.
//
// They reuse the kit's own design tokens so the listing and the product read as
// one thing, and they show real pages rather than a styled photograph of
// something we did not make.
import { pagePng, renderAll } from './canvas.mjs';
import { vanishingExhibit as kit } from '../../src/content/vanishing-exhibit.ts';

const PRODUCT = 'vanishing-exhibit';
const png = (name) => pagePng(PRODUCT, name);

const pages = {
  cover: await png('02_Player-Pack-01'),
  nightLog: await png('02_Player-Pack-02'),
  plan: await png('02_Player-Pack-03'),
  cipher: await png('02_Player-Pack-04'),
  clock: await png('02_Player-Pack-05'),
  mirror: await png('02_Player-Pack-07'),
  slip: await png('02_Player-Pack-08'),
  host: await png('01_Host-Guide-01'),
  hostSetup: await png('01_Host-Guide-02'),
  hints: await png('03_Hint-Cards-01'),
  door: await png('05_Party-Extras-01'),
  invite: await png('05_Party-Extras-02'),
  certs: await png('05_Party-Extras-06'),
};

const CSS = `  body { background:var(--paper-tint); }
  .canvas { width:100%; height:100%; padding:64px; display:flex; flex-direction:column; }
  .page { border:1px solid rgba(18,20,26,.16); box-shadow:0 10px 28px rgba(18,20,26,.14); background:#fff; }
  .fan { position:relative; flex:1; }
  .fan img { position:absolute; width:38%; border:1px solid rgba(18,20,26,.16);
             box-shadow:0 14px 34px rgba(18,20,26,.18); background:#fff; }
  .big { font-size:64px; line-height:1.02; letter-spacing:-.01em; }
  .kicker { font-family:var(--font-signage); font-weight:600; letter-spacing:.2em;
            text-transform:uppercase; font-size:19px; color:var(--evidence); }
  .sub { font-size:26px; line-height:1.4; color:var(--ink-soft); }
  .facts { display:flex; gap:48px; }
  .facts .k { font-family:var(--font-signage); font-weight:600; letter-spacing:.16em;
              text-transform:uppercase; font-size:16px; color:var(--ink-faint); }
  .facts .v { font-size:24px; font-weight:600; }
  .grid { display:grid; gap:22px; flex:1 1 0; min-height:0; }
  .cap { font-family:var(--font-signage); font-weight:600; letter-spacing:.14em;
         text-transform:uppercase; font-size:15px; color:var(--ink-faint); margin-top:10px; }
  .thumb { display:flex; flex-direction:column; min-height:0; }
  .thumb img { width:100%; flex:1 1 0; min-height:0; object-fit:cover; object-position:top center; }
  .brandbar { display:flex; justify-content:space-between; align-items:center;
              border-top:2px solid var(--ink); padding-top:20px; margin-top:auto; }
  .brandbar .l { font-family:var(--font-signage); font-weight:600; letter-spacing:.2em;
                 text-transform:uppercase; font-size:17px; }
  .stampxl { font-size:22px; padding:10px 18px; border-width:2px; }
  ul.big-bullets { margin:0; padding-left:26px; font-size:25px; line-height:1.5; }
  ul.big-bullets li { margin-bottom:12px; }
`;

const brandbar = (right) => `<div class="brandbar">
  <span class="l">${kit.seriesName}</span>
  <span class="l" style="color:var(--ink-faint)">${right}</span></div>`;

const IMAGES = [
  {
    name: '01-hero',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">Printable escape room &middot; instant download</div>
      <h1 class="display big" style="margin-top:14px">${kit.title}</h1>
      <p class="sub" style="max-width:760px;margin-top:18px">A museum mystery for a birthday afternoon.
      Six puzzles, one hour, and a host guide that means you do not have to solve anything first.</p>
      <div class="fan">
        <img src="${pages.host}" style="left:2%; top:14%; transform:rotate(-5deg)"/>
        <img src="${pages.cipher}" style="left:31%; top:6%; transform:rotate(1.5deg)"/>
        <img src="${pages.cover}" style="left:60%; top:15%; transform:rotate(6deg)"/>
      </div>
      <div class="facts" style="margin-bottom:26px">
        <div><div class="k">For</div><div class="v">${kit.ageRange}</div></div>
        <div><div class="k">Players</div><div class="v">${kit.players}</div></div>
        <div><div class="k">Set up</div><div class="v">${kit.prepMinutes} minutes</div></div>
        <div><div class="k">Play</div><div class="v">${kit.playMinutes}</div></div>
      </div>
      ${brandbar('A4 and US Letter')}
    </div>`,
  },
  {
    name: '02-whats-inside',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">What you download</div>
      <h1 class="display" style="font-size:52px;margin-top:12px">25 printable sheets,<br/>ready to go</h1>
      <div class="grid" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);margin-top:32px">
        ${[[pages.host, 'Host guide · 6 sheets'], [pages.cover, 'Player pack · 8 sheets'],
           [pages.cipher, 'Six evidence sheets'], [pages.hints, 'Hint cards · 18 + 6'],
           [pages.invite, 'Invitations'], [pages.certs, 'Certificates']]
          .map(([src, cap]) => `<div class="thumb"><img class="page" src="${src}"/><div class="cap">${cap}</div></div>`).join('')}
      </div>
      ${brandbar('Instant download &middot; print at home')}
    </div>`,
  },
  {
    name: '03-the-puzzles',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">Six puzzles, six kinds of thinking</div>
      <h1 class="display" style="font-size:52px;margin-top:12px">No single child<br/>runs away with it</h1>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px 44px;margin:36px 0;flex:1;align-content:start">
        ${kit.puzzles.map((p) => `<div style="display:flex;gap:18px;align-items:baseline;
            border-bottom:1px solid var(--rule);padding-bottom:14px">
          <span style="font-family:var(--font-signage);font-weight:600;font-size:26px;color:var(--evidence)">${p.number}</span>
          <div><div style="font-family:var(--font-display);font-weight:900;font-size:25px">${p.title}</div>
          <div style="font-size:19px;color:var(--ink-faint)">${p.kind} &middot; ${p.minutes} min</div></div>
        </div>`).join('')}
      </div>
      <p class="sub" style="max-width:900px">Elimination, direction, code-breaking, telling the time, arithmetic and
      perception. Two puzzles send the team back to sheets they have already solved.</p>
      ${brandbar(`Ages 9&ndash;12`)}
    </div>`,
  },
  {
    name: '04-how-it-works',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">How your afternoon goes</div>
      <h1 class="display" style="font-size:52px;margin-top:12px">Fifteen minutes of you.<br/>An hour of them.</h1>
      <div style="display:flex;gap:34px;margin:38px 0 30px">
        ${[['1', 'Print', 'One player pack per team. Black and white is fine.'],
           ['2', 'Cut and hide', 'Cut the hint cards. Tape the finale envelope behind a mirror.'],
           ['3', 'Read the briefing', 'Six lines, printed for you. Then hand out evidence 1.'],
           ['4', 'Give hints', 'Three strengths per puzzle, so you nudge without solving.']]
          .map(([n, t, d]) => `<div style="flex:1">
            <div style="font-family:var(--font-signage);font-weight:600;font-size:22px;color:var(--evidence)">${n}</div>
            <div style="font-family:var(--font-display);font-weight:900;font-size:26px;margin:8px 0 8px">${t}</div>
            <div style="font-size:19px;line-height:1.45;color:var(--ink-soft)">${d}</div></div>`).join('')}
      </div>
      <div style="flex:1;position:relative">
        <img class="page" src="${pages.hostSetup}" style="position:absolute;width:44%;left:0;top:0"/>
        <img class="page" src="${pages.slip}" style="position:absolute;width:44%;right:0;top:34px"/>
      </div>
      <p class="sub" style="margin-bottom:24px">You never have to solve a puzzle. Every answer and a worked solution
      are on the answer key.</p>
      ${brandbar('No props, no apps, no batteries')}
    </div>`,
  },
  {
    name: '05-printing',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div class="kicker">Before you buy</div>
      <h1 class="display" style="font-size:52px;margin-top:12px">It will print<br/>on your printer</h1>
      <div style="display:flex;gap:44px;margin-top:34px;flex:1">
        <div style="flex:1">
          <ul class="big-bullets">
            <li><strong>A4 and US Letter</strong> in the same download</li>
            <li><strong>Black and white</strong> throughout, no full-page backgrounds</li>
            <li><strong>Single-sided</strong>, plain paper</li>
            <li><strong>PDF</strong>, opens on anything</li>
            <li>Nothing needs colour to be solved</li>
          </ul>
          <div style="margin-top:34px;display:flex"><span class="stamp stampxl">Instant download</span></div>
        </div>
        <img class="page" src="${pages.door}" style="width:42%;object-fit:cover;object-position:top"/>
      </div>
      ${brandbar('25 sheets &middot; 6 PDFs &middot; 2 paper sizes')}
    </div>`,
  },
  {
    name: '06-playtest-edition',
    w: 1200, h: 1200,
    body: `<div class="canvas">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="kicker">Honest label</div>
        <span class="stamp stamp--ink stampxl">${kit.edition}</span>
      </div>
      <h1 class="display" style="font-size:52px;margin-top:14px">Checked on paper.<br/>Not yet on a room<br/>full of nine-year-olds.</h1>
      <p class="sub" style="max-width:820px;margin-top:26px">Every puzzle has been worked through and every sheet has
      been checked to fit A4 and US Letter. What has not happened yet is a real party. So this is sold as a playtest
      edition, and it is priced accordingly.</p>
      <div style="margin-top:34px;display:flex;gap:26px;flex:1;align-items:flex-start">
        <div class="panel panel--host" style="flex:1;padding:28px">
          <div class="panel__title" style="font-size:16px">What you get for that</div>
          <ul class="big-bullets" style="font-size:21px">
            <li>Every later version of this kit, free</li>
            <li>A direct line to change it: tell us what dragged</li>
            <li>The full kit, not a cut-down one</li>
          </ul>
        </div>
        <img class="page" src="${pages.mirror}" style="width:40%"/>
      </div>
      ${brandbar('Try the free sample first')}
    </div>`,
  },
];


await renderAll({ theme: 'museum', out: 'store/images', css: CSS, images: IMAGES });
