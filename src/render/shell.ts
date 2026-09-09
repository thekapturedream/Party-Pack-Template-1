import { readFileSync } from 'node:fs';

const tokens = readFileSync('src/design/tokens.css', 'utf8');
const sheetCss = readFileSync('src/design/sheet.css', 'utf8');
const fonts = readFileSync('assets/fonts/fonts.css', 'utf8');

export type PaperSize = 'A4' | 'Letter';

const PAPER: Record<PaperSize, { w: string; h: string; label: string }> = {
  A4: { w: '210mm', h: '297mm', label: 'A4' },
  Letter: { w: '215.9mm', h: '279.4mm', label: 'US Letter' },
};

export function paperVars(size: PaperSize): string {
  const { w, h } = PAPER[size];
  return `:root { --page-w: ${w}; --page-h: ${h}; }`;
}

export function paperLabel(size: PaperSize): string {
  return PAPER[size].label;
}

/** Wraps finished sheets in a self-contained printable document. */
export function html(title: string, size: PaperSize, sheets: string[], extraCss = ''): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>${fonts}</style>
<style>${tokens}</style>
<style>${paperVars(size)}</style>
<style>${sheetCss}</style>
<style>${extraCss}</style>
</head>
<body>${sheets.join('\n')}</body>
</html>`;
}

/** One printed page. */
export function sheet(
  inner: string,
  opts: { tint?: boolean; flush?: boolean; punched?: boolean } = {},
): string {
  const cls = ['sheet', opts.tint ? 'sheet--tint' : '', opts.flush ? 'sheet--flush' : '',
    opts.punched ? 'punches' : ''].filter(Boolean).join(' ');
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
