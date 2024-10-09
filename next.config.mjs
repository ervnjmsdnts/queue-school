/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: function (config, { isServer }) {
    // Your other webpack configs

    config.experiments = { ...config.experiments, asyncWebAssembly: true }

    return config
  }
};

export default nextConfig;
