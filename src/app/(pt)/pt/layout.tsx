import type { ReactNode } from "react";
import { RootShell } from "@/components/root-shell";
import { buildMetadata } from "@/lib/site-metadata";
import "../../globals.css";

export const metadata = buildMetadata("pt");

export default function RootLayout({ children }: { children: ReactNode }) {
  return <RootShell language="pt">{children}</RootShell>;
}
