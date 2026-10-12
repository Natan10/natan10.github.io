import type { Content } from "@/content/types";
import type { Dictionary } from "@/lib/dictionary";
import { Identity } from "./identity";
import { OutputStream } from "./output-stream";
import { Prompt } from "./prompt";
import {
  Contact,
  Experience,
  Projects,
  Skills,
  Takeaways,
} from "./sections";

export function BufferWindow({
  content,
  dict,
}: {
  content: Content;
  dict: Dictionary;
}) {
  return (
    <div className="w-full bg-surface-container-low border border-outline-variant flex flex-col">
      <div
        aria-hidden="true"
        className="w-full bg-surface-container-lowest px-space-md py-space-xs flex items-center justify-between gap-space-sm text-label-sm"
      >
        <div className="flex items-center gap-space-sm min-w-0 text-on-surface-variant">
          <span className="text-secondary font-bold">BUF #1:</span>
          <span className="text-primary font-bold truncate">
            ~/.terminal/profile.vim
          </span>
          <span className="text-primary-container">[RO]</span>
        </div>
        <div className="hidden sm:flex items-center gap-space-md text-on-surface-variant">
          <span className="text-secondary">UTF-8</span>
          <span className="bg-surface-container px-space-xs py-0.5 text-on-surface">
            VIM 9.1
          </span>
        </div>
      </div>

      <Prompt />

      <div
        id="terminal-screen"
        className="p-space-md sm:p-space-lg flex flex-col gap-space-lg min-h-80 text-body-md"
      >
        <OutputStream />
        <Identity profile={content.profile} dict={dict} />
        <Experience content={content} dict={dict} />
        <Skills content={content} dict={dict} />
        <Projects content={content} dict={dict} />
        <Takeaways content={content} dict={dict} />
        <Contact content={content} dict={dict} />
      </div>
    </div>
  );
}
