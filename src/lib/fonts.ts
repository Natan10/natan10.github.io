import localFont from "next/font/local";

// Self-hosted full JetBrains Mono (OFL). The Google Fonts subsets omit the
// box-drawing and block glyphs the ASCII banner and section frames need.
export const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
});
