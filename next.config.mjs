import optimizeLocales from '@react-aria/optimize-locales-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   compiler: {
      styledComponents: true,
      // removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
   },
   experimental: {
      webVitalsAttribution: ['CLS', 'LCP'],
      staleTimes: {
         dynamic: 10,
         static: 180,
      },
   },
   eslint: {
      dirs: ['src'],
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
         },
      ],
   },
   webpack(config) {
      config.plugins.push(
         optimizeLocales.webpack({
            locales: ['id-ID', 'en-US'],
         })
      )
      return config
   },
}

export default nextConfig

