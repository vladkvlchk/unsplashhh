import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/unsplash-image-loader.ts",
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
  },
};

export default nextConfig;
