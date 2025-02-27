import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  experimental: {
    // Disable the Suspense error if you're not using Suspense boundaries
    reactMode: 'concurrent',
  },
};

module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}
