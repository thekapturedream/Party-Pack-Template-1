import type { Kit } from '../../content/types.ts';
import { html, sheet, type PaperSize } from '../shell.ts';

const line = (w: string) =>
  `<span style="display:inline-block;width:${w};border-bottom:0.3mm solid var(--ink-faint);height:1em"></span>`;

const EMBLEM = `<svg viewBox="0 0 60 60" width="17mm" height="17mm" role="presentation">
  <circle cx="30" cy="30" r="27.5" fill="none" stroke="#a31621" stroke-width="1.6"/>
  <circle cx="30" cy="30" r="22.5" fill="none" stroke="#a31621" stroke-width="0.7"/>
  <text x="30" y="36.5" text-anchor="middle" font-family="Georgia, serif" font-size="18"
    font-weight="700" fill="#a31621">MM</text>
</svg>`;

function head(tab: string, note: string): string {
  return `<header class="runhead"><span class="tab">${tab}</span>
    <span class="runhead__note">${note}</span></header>`;
}

function foot(kit: Kit, right: string): string {
  return `<footer class="runfoot"><span>${kit.title} &middot; Party extras</span><span>${right}</span></footer>`;
}

/** A full-page notice for the door. Museum signage, not a party poster. */
function doorSign(kit: Kit): string {
  return sheet(`
    <div style="height:100%;border:1.6mm solid var(--ink);padding:var(--space-6) var(--space-5);
      display:flex;flex-direction:column;justify-content:space-between;text-align:center">
      <div>
        <div style="display:flex;justify-content:center">${EMBLEM}</div>
        <div class="label label--ink" style="letter-spacing:0.3em;margin-top:var(--space-3)">The Marlow Museum</div>
        <hr class="rule rule--strong" style="margin:var(--space-3) auto;width:26mm"/>
      </div>
      <div>
        <h1 class="display" style="font-size:60pt;line-height:0.95">Junior<br/>Curators<br/>only</h1>
        <div style="display:flex;justify-content:center;margin-top:var(--space-5)">
          <span class="stamp" style="font-size:14pt">Case 12 &middot; in progress</span>
        </div>
      </div>
      <div>
        <p class="lead" style="margin:0 auto;max-width:104mm">The Clockwork Cartographer is missing.
        Beyond this door, everyone is working.</p>
        <hr class="rule" style="margin:var(--space-4) auto;width:26mm"/>
        <div class="caption">${kit.seriesName} &middot; ${kit.title}</div>
      </div>
    </div>`, { tint: true });
}

/** The invitation. It goes to other children, so it is written as a summons
 *  from the museum rather than as a party invitation from a parent. */
function invitations(kit: Kit): string {
  const card = () => `
    <div class="cutcard" style="justify-content:space-between;padding:var(--space-4);background:var(--paper-tint)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-3)">
        <div class="label label--ink" style="letter-spacing:0.26em">The Marlow Museum</div>
        <span class="stamp stamp--sm" style="white-space:nowrap">Urgent</span>
      </div>
      <div class="cols cols--2" style="align-items:end;gap:var(--space-5);flex:1;margin:var(--space-3) 0">
        <div>
          <h2 class="h1" style="font-size:22pt;max-width:14ch">You are needed on Case 12</h2>
          <p class="small" style="margin:var(--space-3) 0 0">The Clockwork Cartographer vanished from its case
          overnight. Six pieces of evidence are waiting and the museum opens at ten. We are appointing you a
          Junior Curator for one afternoon.</p>
        </div>
        <div class="panel" style="background:var(--paper)">
          <div class="panel__title">Your appointment</div>
          <div class="stack-2">
            <div class="small">Curator &nbsp;${line('34mm')}</div>
            <div class="small">Date &nbsp;${line('40mm')}</div>
            <div class="small">Time &nbsp;${line('40mm')}</div>
            <div class="small">Where &nbsp;${line('37mm')}</div>
            <div class="small">Reply to &nbsp;${line('33mm')}</div>
          </div>
        </div>
      </div>
      <div style="border-top:var(--hairline) solid var(--rule);padding-top:2.5mm;display:flex;
        justify-content:space-between;align-items:baseline;gap:var(--space-2)">
        <span class="caption">Bring a pencil. Bring a suspicious mind.</span>
        <span class="label">Ages 9&ndash;12 &middot; about an hour</span>
      </div>
    </div>`;

  return sheet(
    `<div class="cutgrid" style="grid-template-rows:repeat(2,1fr)">${card()}${card()}</div>`,
    { flush: true },
  );
}

function badgesAndTokens(kit: Kit): string {
  const badge = () => `
    <div class="cutcard" style="align-items:center;justify-content:center;text-align:center;padding:var(--space-2)">
      <div class="label label--ink" style="letter-spacing:0.16em;font-size:6.5pt">Marlow Museum</div>
      <div style="font-family:var(--font-display);font-size:11pt;font-weight:900;margin:0.8mm 0 0">Junior Curator</div>
      <div style="width:10mm;height:0.6mm;background:var(--evidence);margin:1.6mm auto"></div>
      <div style="border-bottom:0.3mm solid var(--ink-faint);width:84%;height:7mm"></div>
      <div class="caption" style="font-size:6.5pt;margin-top:0.8mm">Name</div>
    </div>`;

  const token = () => `
    <div class="cutcard" style="align-items:center;justify-content:center;text-align:center;padding:2mm;
      background:var(--evidence-tint);border-color:var(--evidence)">
      <div class="label label--evidence" style="font-size:6.5pt">One hint</div>
      <div style="font-family:var(--font-display);font-size:16pt;font-weight:900;line-height:1;
        color:var(--evidence)">?</div>
    </div>`;

  return sheet(`
    ${head('Badges and hint tokens', kit.title)}
    <div class="sheet__body">
      <p class="small">Cut along the dashed lines. Badges take a safety pin or a loop of tape. Give each team three
      hint tokens if you want them to spend hints rather than ask for them.</p>
      <div class="cutgrid grow" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);
        margin-top:var(--space-3)">
        ${Array.from({ length: 12 }, badge).join('')}
      </div>
      <div class="cutgrid" style="grid-template-columns:repeat(6,1fr);height:22mm;margin-top:var(--space-3)">
        ${Array.from({ length: 6 }, token).join('')}
      </div>
    </div>
    ${foot(kit, 'Cut along the dashed lines')}`);
}

function sealsAndLabels(kit: Kit): string {
  const label = (n: number, title: string, kind: string) => `
    <div class="cutcard" style="justify-content:center;padding:var(--space-3);background:var(--paper-tint)">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <span class="label label--ink">Marlow Museum</span>
        <span class="label label--evidence">Evidence</span>
      </div>
      <div style="display:flex;align-items:baseline;gap:var(--space-2);margin:1.5mm 0 0">
        <span style="font-family:var(--font-display);font-size:24pt;font-weight:900;line-height:1">${n}</span>
        <span style="font-family:var(--font-display);font-size:11pt;font-weight:700">${title}</span>
      </div>
      <div class="caption" style="margin-top:1mm">${kind}</div>
      <div style="margin-top:auto;padding-top:2mm;border-top:var(--hairline) dashed var(--rule)">
        <span class="caption">Do not open until the Curator says so.</span>
      </div>
    </div>`;

  return sheet(`
    ${head('Evidence envelope labels', kit.title)}
    <div class="sheet__body">
      <p class="small">Optional. If you want to hand the evidence out in envelopes rather than as loose sheets, tape one
      label to each. It makes the middle of the game feel like a real handover.</p>
      <div class="cutgrid grow" style="grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,1fr);
        margin-top:var(--space-3)">
        ${kit.puzzles.map((p) => label(p.number, p.title, p.kind)).join('')}
      </div>
    </div>
    ${foot(kit, 'Cut along the dashed lines')}`);
}

function finaleCard(kit: Kit): string {
  return sheet(
    `<div class="cutgrid" style="grid-template-rows:repeat(2,1fr)">
      <div class="cutcard" style="justify-content:center;text-align:center;padding:var(--space-5);
        background:var(--paper-tint)">
        <div style="display:flex;justify-content:center;margin-bottom:var(--space-3)">
          <span class="stamp" style="font-size:13pt">Case 12 &middot; closed</span>
        </div>
        <h1 class="display" style="font-size:38pt;margin:var(--space-2) 0">You found it.</h1>
        <p class="lead" style="max-width:120mm;margin:0 auto">The Clockwork Cartographer was never stolen. Mira Kell
        found the case lock broken, knew someone meant to take it that night, and hid it where it could keep watch over
        the whole gallery at once &mdash; facing north, in a mirror.</p>
        <hr class="rule" style="width:26mm;margin:var(--space-4) auto"/>
        <p class="small" style="margin:0">The museum opens at ten. You made it with time to spare.</p>
      </div>
      <div class="cutcard" style="justify-content:center;padding:var(--space-4)">
        <div class="label label--ink">Curator&rsquo;s note &mdash; put this in the envelope with the prize</div>
        <p class="small" style="margin:var(--space-2) 0 0">Write the finders&rsquo; names here before you hide it:</p>
        <div class="stack-2" style="margin-top:var(--space-3)">
          <div class="small">${line('72mm')} &nbsp;&nbsp; ${line('72mm')}</div>
          <div class="small">${line('72mm')} &nbsp;&nbsp; ${line('72mm')}</div>
          <div class="small">${line('72mm')} &nbsp;&nbsp; ${line('72mm')}</div>
        </div>
        <p class="caption" style="margin-top:var(--space-3)">Recovered on ${line('30mm')} at the ${line('40mm')} Museum.</p>
      </div>
    </div>`, { flush: true });
}

function certificates(kit: Kit): string {
  const cert = () => `
    <div class="cutcard" style="justify-content:center;text-align:center;padding:var(--space-4) var(--space-5);
      border:0.7mm solid var(--ink)">
      ${EMBLEM}
      <div class="label label--ink" style="letter-spacing:0.28em;margin-top:var(--space-1)">The Marlow Museum</div>
      <h2 class="display" style="font-size:26pt;margin:var(--space-1) 0">Certificate of Recovery</h2>
      <p class="small" style="margin:0 0 var(--space-3)">awarded to</p>
      <div style="border-bottom:0.4mm solid var(--ink);height:9mm;width:80%;margin:0 auto var(--space-2)"></div>
      <p class="small" style="max-width:108mm;margin:0 auto">Junior Curator, for the recovery of the Clockwork
      Cartographer from Case 12, and for keeping a clear head under the clock.</p>
      <div style="display:flex;justify-content:space-between;gap:var(--space-4);margin-top:var(--space-4);width:100%">
        <div style="flex:1"><div style="border-bottom:0.3mm solid var(--ink-faint);height:7mm"></div>
          <div class="caption">Date</div></div>
        <div style="flex:1"><div style="border-bottom:0.3mm solid var(--ink-faint);height:7mm"></div>
          <div class="caption">Curator</div></div>
        <div style="flex:1"><div style="border-bottom:0.3mm solid var(--ink-faint);height:7mm"></div>
          <div class="caption">Hints unspent</div></div>
      </div>
    </div>`;

  return sheet(
    `<div class="cutgrid" style="grid-template-rows:repeat(2,1fr);gap:6mm">${cert()}${cert()}</div>`,
    { flush: true },
  );
}

export function partyExtras(kit: Kit, size: PaperSize): string {
  return html('museum', `${kit.title} — Party Extras`, size, [
    doorSign(kit),
    invitations(kit),
    badgesAndTokens(kit),
    sealsAndLabels(kit),
    finaleCard(kit),
    certificates(kit),
  ], `.sheet--flush { padding: 10mm; }`);
}
