import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/unsplash-image-loader.ts",
  },
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
};

export default nextConfig;
