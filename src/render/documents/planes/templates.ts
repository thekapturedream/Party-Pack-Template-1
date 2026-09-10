import type { Squadron } from '../../../content/plane-types.ts';
import { printSideUp } from '../../../content/plane-types.ts';
import { html, sheet, type PaperSize } from '../../shell.ts';
import { templateSvg } from '../../livery.ts';
import { model, sheetHeight } from './parts.ts';

/** The sheets that become planes.
 *
 *  Each one is the whole page and nothing else: no running head, no margin, no
 *  page furniture. Anything printed here has to survive being folded eight
 *  times, so the page carries only three things — the livery, the fold lines,
 *  and four corner ticks that prove the printer did not scale the page. */
export function planeTemplates(kit: Squadron, size: PaperSize): string {
  const h = sheetHeight(size);
  const sheets = kit.planes.map((p) =>
    sheet(templateSvg(p, model(p, size), h, printSideUp(p)), { flush: true, cls: 'template' }));
  return html('flight', `${kit.title} — Plane Templates`, size, sheets);
}
