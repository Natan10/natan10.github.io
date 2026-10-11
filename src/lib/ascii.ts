// "ANSI Shadow" glyphs, six rows each.
const glyphs: Record<string, string[]> = {
  A: [
    " █████╗ ",
    "██╔══██╗",
    "███████║",
    "██╔══██║",
    "██║  ██║",
    "╚═╝  ╚═╝",
  ],
  E: [
    "███████╗",
    "██╔════╝",
    "█████╗  ",
    "██╔══╝  ",
    "███████╗",
    "╚══════╝",
  ],
  I: [
    "██╗",
    "██║",
    "██║",
    "██║",
    "██║",
    "╚═╝",
  ],
  M: [
    "███╗   ███╗",
    "████╗ ████║",
    "██╔████╔██║",
    "██║╚██╔╝██║",
    "██║ ╚═╝ ██║",
    "╚═╝     ╚═╝",
  ],
  N: [
    "███╗   ██╗",
    "████╗  ██║",
    "██╔██╗ ██║",
    "██║╚██╗██║",
    "██║ ╚████║",
    "╚═╝  ╚═══╝",
  ],
  O: [
    " ██████╗ ",
    "██╔═══██╗",
    "██║   ██║",
    "██║   ██║",
    "╚██████╔╝",
    " ╚═════╝ ",
  ],
  R: [
    "██████╗ ",
    "██╔══██╗",
    "██████╔╝",
    "██╔══██╗",
    "██║  ██║",
    "╚═╝  ╚═╝",
  ],
  T: [
    "████████╗",
    "╚══██╔══╝",
    "   ██║   ",
    "   ██║   ",
    "   ██║   ",
    "   ╚═╝   ",
  ],
};

function asciiWord(word: string): string[] {
  const letters = [...word.toUpperCase()].map((ch) => {
    const glyph = glyphs[ch];
    if (!glyph) throw new Error(`No ASCII glyph for "${ch}"`);
    return glyph;
  });
  return Array.from({ length: 6 }, (_, row) =>
    letters.map((glyph) => glyph[row]).join(""),
  );
}

/**
 * One block per word, stacked with a blank row between them, so a full name
 * stays as narrow as its longest word instead of one very wide line.
 */
export function asciiBanner(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map((word) => asciiWord(word).join("\n"))
    .join("\n\n");
}
