/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false
    }
    return config
  },
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_ENVIO_HYPERSYNC_URL: process.env.NEXT_PUBLIC_ENVIO_HYPERSYNC_URL,
    NEXT_PUBLIC_LIGHTHOUSE_API_KEY: process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
  }
}

export default nextConfig;