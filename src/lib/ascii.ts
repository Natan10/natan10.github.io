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
  N: [
    "███╗   ██╗",
    "████╗  ██║",
    "██╔██╗ ██║",
    "██║╚██╗██║",
    "██║ ╚████║",
    "╚═╝  ╚═══╝",
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

export function asciiBanner(word: string): string {
  const letters = [...word.toUpperCase()].map((ch) => {
    const glyph = glyphs[ch];
    if (!glyph) throw new Error(`No ASCII glyph for "${ch}"`);
    return glyph;
  });
  return Array.from({ length: 6 }, (_, row) =>
    letters.map((glyph) => glyph[row]).join(""),
  ).join("\n");
}
