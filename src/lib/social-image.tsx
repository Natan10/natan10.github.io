import { ImageResponse } from "next/og";
import { shared } from "@/content/shared";
import { site } from "@/content/site";

// Colours mirror the default warm theme in globals.css. The image holds only
// the owner's name, title and tags, none of which change with the language.
export function renderSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#1a1208",
          color: "#f2dfce",
          fontFamily: "monospace",
          border: "4px solid #46483a",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#9ed0c5" }}>
          {"~/portfolio $ whoami"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#c4d27e",
            marginTop: 24,
          }}
        >
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 44, marginTop: 8 }}>
          {site.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#c7c8b6",
            marginTop: 40,
          }}
        >
          {shared.profile.tags.join(" · ")}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
