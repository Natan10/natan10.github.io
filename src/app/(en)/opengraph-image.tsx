import { site } from "@/content/site";
import { renderSocialImage } from "@/lib/social-image";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderSocialImage();
}
