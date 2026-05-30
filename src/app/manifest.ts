import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KraftyBrix",
    short_name: "KraftyBrix",
    description: "Premium brick-built automotive collectibles.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#FF2D20",
    icons: [
      { src: "/logo.png", sizes: "any", type: "image/png" },
    ],
  };
}
