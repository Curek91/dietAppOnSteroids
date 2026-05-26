import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DietApp — aplikacja dla trenerów personalnych i ich klientów";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "linear-gradient(135deg, #fb923c 0%, #f97316 45%, #f59e0b 100%)",
          color: "white",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700
            }}
          >
            D
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: -0.5
            }}
          >
            DietApp
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: -2.5,
              lineHeight: 1.02,
              maxWidth: 980
            }}
          >
            Prowadź klientów. Nie tabelki.
          </div>
          <div
            style={{
              fontSize: 26,
              opacity: 0.92,
              maxWidth: 980,
              lineHeight: 1.3
            }}
          >
            Zamień WhatsApp, Excel i PDF-y w jeden system.
            Plany, check-iny, zdjęcia, AI-asystent.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.9
          }}
        >
          <span>dietapp.pl</span>
          <span>14 dni za darmo — bez karty</span>
        </div>
      </div>
    ),
    size
  );
}
