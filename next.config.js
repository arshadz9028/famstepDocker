// next.config.js
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: isProd ? "https://famstep.com" : "http://localhost:3000",
    BASE_URL: isProd ? "https://famstep.com" : "http://localhost:3000",
    SOCKET_URL: isProd ? "https://famstep.com" : "http://localhost:3000",
  },
  transpilePackages: [
    // antd & deps
    "@ant-design",
    "@rc-component",
    "antd",
    "rc-cascader",
    "rc-checkbox",
    "rc-collapse",
    "rc-dialog",
    "rc-drawer",
    "rc-dropdown",
    "rc-field-form",
    "rc-image",
    "rc-input",
    "rc-input-number",
    "rc-mentions",
    "rc-menu",
    "rc-motion",
    "rc-notification",
    "rc-pagination",
    "rc-picker",
    "rc-progress",
    "rc-rate",
    "rc-resize-observer",
    "rc-segmented",
    "rc-select",
    "rc-slider",
    "rc-steps",
    "rc-switch",
    "rc-table",
    "rc-tabs",
    "rc-textarea",
    "rc-tooltip",
    "rc-tree",
    "rc-tree-select",
    "rc-upload",
    "rc-util",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "famstep-storage.s3.ap-south-1.amazonaws.com",
      },
      //   {
      //     protocol: 'https',
      //     hostname: 'organic-blowfish-20.rshare.io',
      // },
    ],
    domains: ['your-image-domains.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",

   // Add Webpack configuration for video files
   webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/, // Add support for video files
      type: "asset/resource",
      generator: {
        filename: "static/videos/[name][ext]", // Specify the output folder
      },
    });
    return config;
  },

  // Example: If you have rewrites/redirects
  async rewrites() {
    return [
      // Your rewrites
    ]
  },
};

module.exports = nextConfig;
