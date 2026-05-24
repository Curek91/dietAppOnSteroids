import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DietApp — dla trenerów i ich klientów",
    short_name: "DietApp",
    description:
      "Diety, treningi, postępy i AI-coach. Jedna aplikacja dla Ciebie i Twoich klientów.",
    start_url: "/app",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#f97316",
    lang: "pl",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" }
    ]
  };
}
