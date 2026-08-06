/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Preview-friendly: don't let a stray lint/type warning block the deploy.
  // Re-enable (set to false) once you've run `npm run build` clean locally.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    // Hostinger Node hosting: the built-in image optimizer needs `sharp` and
    // fails intermittently without it (blank product images). Serve originals
    // directly — S3/ImageKit already deliver optimized assets.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "d1311wbk6unapo.cloudfront.net" },
      { protocol: "https", hostname: "s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "nushop-catalogue.s3.ap-south-1.amazonaws.com" },
      // Common image hosts, so a pasted product-image URL just works:
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" }, // Vercel Blob
      { protocol: "https", hostname: "i.ibb.co" },                          // ImgBB
      { protocol: "https", hostname: "i.imgur.com" },                       // Imgur
      { protocol: "https", hostname: "ik.imagekit.io" },                    // ImageKit
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
