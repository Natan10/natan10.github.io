import { BufferWindow } from "@/components/terminal/buffer-window";
import { Hero } from "@/components/terminal/hero";
import { Statusline } from "@/components/terminal/statusline";
import { TerminalProvider } from "@/components/terminal/terminal-provider";

export default function Home() {
  return (
    <TerminalProvider>
      <main className="w-full pb-12 bg-background min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pb-20">
          <Hero />
          <BufferWindow />
        </div>
      </main>
      <Statusline />
    </TerminalProvider>
  );
}
