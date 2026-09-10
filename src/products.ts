/** The catalogue. One entry per sellable download; the build, the fit check,
 *  the previews, the shop images and the release zip all read this. */
import type { PaperSize } from './render/shell.ts';
import { museumReadme, flightReadme } from './render/readme.ts';

import { vanishingExhibit } from './content/vanishing-exhibit.ts';
import { playerPack } from './render/documents/player-pack.ts';
import { hostGuide } from './render/documents/host-guide.ts';
import { answerKey } from './render/documents/answer-key.ts';
import { hintCards } from './render/documents/hint-cards.ts';
import { partyExtras } from './render/documents/party-extras.ts';
import { startHere } from './render/documents/start-here.ts';
import { freeSample } from './render/documents/free-sample.ts';

import { paperSquadron } from './content/paper-squadron.ts';
import { planeStartHere } from './render/documents/planes/start-here.ts';
import { flightSchool } from './render/documents/planes/flight-school.ts';
import { foldInstructions } from './render/documents/planes/fold-instructions.ts';
import { planeTemplates } from './render/documents/planes/templates.ts';
import { flightLog } from './render/documents/planes/flight-log.ts';
import { hangarExtras } from './render/documents/planes/hangar-extras.ts';
import { planeFreeSample } from './render/documents/planes/free-sample.ts';

export interface DocSpec {
  slug: string;
  render: (size: PaperSize) => string;
  /** Sheets this document prints to. Kept here so Start Here, the readme and
   *  the shop listing all quote the same numbers without anyone counting. */
  sheets: number;
  /** One line for the contents table. */
  summary: string;
  /** Documents the buyer prints; a free sample is published separately. */
  inBundle: boolean;
}

export interface Product {
  /** Folder name under dist/ and release/, and the argument scripts take. */
  slug: string;
  title: string;
  version: string;
  /** Filename stem of the customer zip, before the version. */
  releaseName: string;
  documents: DocSpec[];
  /** The plain-text file at the top of the zip. */
  readme: (docs: DocSpec[]) => string;
}

export const PRODUCTS: Product[] = [
  {
    slug: 'vanishing-exhibit',
    title: vanishingExhibit.title,
    version: vanishingExhibit.version,
    releaseName: 'The-Vanishing-Exhibit',
    readme: (docs) => museumReadme(vanishingExhibit, docs),
    documents: [
      { slug: '00_Start-Here', render: (s) => startHere(vanishingExhibit, s), sheets: 1,
        summary: 'What to print, in what order.', inBundle: true },
      { slug: '01_Host-Guide', render: (s) => hostGuide(vanishingExhibit, s), sheets: 6,
        summary: 'Setup, running order, hints, the finale, troubleshooting.', inBundle: true },
      { slug: '02_Player-Pack', render: (s) => playerPack(vanishingExhibit, s), sheets: 8,
        summary: 'Briefing, six evidence sheets, the Recovery Slip.', inBundle: true },
      { slug: '03_Hint-Cards', render: (s) => hintCards(vanishingExhibit, s), sheets: 2,
        summary: 'Eighteen hint cards and six Curator cards, to cut out.', inBundle: true },
      { slug: '04_Answer-Key', render: (s) => answerKey(vanishingExhibit, s), sheets: 2,
        summary: 'Every answer, with a worked solution.', inBundle: true },
      { slug: '05_Party-Extras', render: (s) => partyExtras(vanishingExhibit, s), sheets: 6,
        summary: 'Door sign, invitations, badges, tokens, labels, certificates.', inBundle: true },
      { slug: 'Free-Sample', render: (s) => freeSample(vanishingExhibit, s), sheets: 3,
        summary: 'One puzzle of six, given away.', inBundle: false },
    ],
  },
  {
    slug: 'paper-squadron',
    title: paperSquadron.title,
    version: paperSquadron.version,
    releaseName: 'Paper-Plane-Template-Pack',
    readme: (docs) => flightReadme(paperSquadron, docs),
    documents: [
      { slug: '00_Start-Here', render: (s) => planeStartHere(paperSquadron, s), sheets: 1,
        summary: 'What to print, in what order.', inBundle: true },
      { slug: '01_Flight-School', render: (s) => flightSchool(paperSquadron, s), sheets: 5,
        summary: 'How to fold sharply, throw properly, trim a plane and fix a bad flight.', inBundle: true },
      { slug: '02_Fold-Instructions', render: (s) => foldInstructions(paperSquadron, s), sheets: 10,
        summary: 'One sheet per plane: every fold, drawn step by step.', inBundle: true },
      { slug: '03_Plane-Templates', render: (s) => planeTemplates(paperSquadron, s), sheets: 10,
        summary: 'One sheet per plane: printed livery with the fold lines already on it.', inBundle: true },
      { slug: '04_Flight-Log', render: (s) => flightLog(paperSquadron, s), sheets: 3,
        summary: 'Record sheets, the fly-off scoring card and twelve challenge cards.', inBundle: true },
      { slug: '05_Hangar-Extras', render: (s) => hangarExtras(paperSquadron, s), sheets: 5,
        summary: 'Squadron badges, pilot licences, runway markers, target rings, award certificates.', inBundle: true },
      { slug: 'Free-Sample', render: (s) => planeFreeSample(paperSquadron, s), sheets: 3,
        summary: 'One plane, complete, given away.', inBundle: false },
    ],
  },
];

export function product(slug: string): Product {
  const found = PRODUCTS.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown product "${slug}". Known: ${PRODUCTS.map((p) => p.slug).join(', ')}`);
  return found;
}
