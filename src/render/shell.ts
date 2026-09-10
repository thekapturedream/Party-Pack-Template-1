import { readFileSync } from 'node:fs';

/** A product's visual identity: its tokens and its brand components, layered
 *  on the shared page system. Files are read once, at module load. */
const THEMES = {
  museum: ['src/design/museum/tokens.css', 'src/design/museum/sheet.css', 'assets/fonts/fonts.css'],
  flight: ['src/design/flight/tokens.css', 'src/design/flight/sheet.css', 'assets/fonts/flight.css'],
} as const;

export type Theme = keyof typeof THEMES;

const pageCss = readFileSync('src/design/page.css', 'utf8');
const themeCss = Object.fromEntries(
  Object.entries(THEMES).map(([name, [tokens, sheet, fonts]]) => [name, {
    tokens: readFileSync(tokens, 'utf8'),
    sheet: readFileSync(sheet, 'utf8'),
    fonts: readFileSync(fonts, 'utf8'),
  }]),
) as Record<Theme, { tokens: string; sheet: string; fonts: string }>;

export type PaperSize = 'A4' | 'Letter';

const PAPER: Record<PaperSize, { w: string; h: string; label: string; mm: [number, number] }> = {
  A4: { w: '210mm', h: '297mm', label: 'A4', mm: [210, 297] },
  Letter: { w: '215.9mm', h: '279.4mm', label: 'US Letter', mm: [215.9, 279.4] },
};

export function paperVars(size: PaperSize): string {
  const { w, h } = PAPER[size];
  return `:root { --page-w: ${w}; --page-h: ${h}; }`;
}

export function paperLabel(size: PaperSize): string {
  return PAPER[size].label;
}

/** Width ÷ height of the sheet. Fold geometry is expressed in these units, so
 *  every diagram is drawn at the proportions of the paper it will print on. */
export function paperRatio(size: PaperSize): number {
  const [w, h] = PAPER[size].mm;
  return w / h;
}

/** Wraps finished sheets in a self-contained printable document. */
export function html(
  theme: Theme,
  title: string,
  size: PaperSize,
  sheets: string[],
  extraCss = '',
): string {
  const t = themeCss[theme];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>${t.fonts}</style>
<style>${t.tokens}</style>
<style>${paperVars(size)}</style>
<style>${pageCss}</style>
<style>${t.sheet}</style>
<style>${extraCss}</style>
</head>
<body>${sheets.join('\n')}</body>
</html>`;
}

/** One printed page. */
export function sheet(
  inner: string,
  opts: { tint?: boolean; flush?: boolean; punched?: boolean; cls?: string } = {},
): string {
  const cls = ['sheet', opts.tint ? 'sheet--tint' : '', opts.flush ? 'sheet--flush' : '',
    opts.punched ? 'punches' : '', opts.cls ?? ''].filter(Boolean).join(' ');
  return `<section class="${cls}">${inner}</section>`;
}

export function runhead(mark: string, note: string): string {
  return `<header class="runhead"><span class="runhead__mark">${mark}</span><span class="runhead__note">${note}</span></header>`;
}

export function runfoot(left: string, right: string): string {
  return `<footer class="runfoot"><span>${left}</span><span>${right}</span></footer>`;
}

/** Standard page frame: head, flexible body, foot. */
export function framed(head: string, body: string, foot: string): string {
  return `${head}<div class="sheet__body">${body}</div>${foot}`;
}
