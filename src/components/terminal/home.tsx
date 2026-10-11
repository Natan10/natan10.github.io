import { getContent } from "@/content";
import { getDictionary } from "@/lib/dictionaries";
import type { Language } from "@/lib/i18n";
import { BufferWindow } from "./buffer-window";
import { Hero } from "./hero";
import { MusicStrip } from "./music-strip";
import { PageBody } from "./page-body";
import { Statusline } from "./statusline";
import { TerminalProvider } from "./terminal-provider";

/** The whole page, rendered in one language. */
export function Home({ language }: { language: Language }) {
  const content = getContent(language);
  const dict = getDictionary(language);
  return (
    <TerminalProvider language={language} dict={dict} cv={content.cv} playlist={content.playlist}>
      <PageBody>
        <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pb-20">
          <Hero dict={dict} language={language} />
          <BufferWindow content={content} dict={dict} />
        </div>
      </PageBody>
      <MusicStrip />
      <Statusline />
    </TerminalProvider>
  );
}
