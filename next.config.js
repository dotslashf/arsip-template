/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import TerserPlugin from "terser-webpack-plugin";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: true,
          },
        }),
      ];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  output: "standalone",
  httpAgentOptions: {
    keepAlive: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: "storage.googleapis.com",
        protocol: "https",
        pathname: "/arsip-template/**",
      },
    ],
  },
};

export default config;
