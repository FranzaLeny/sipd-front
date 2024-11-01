import optimizeLocales from '@react-aria/optimize-locales-plugin'

// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
   reactStrictMode: true,
   distDir:
      process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BUILD_FOLDER : undefined,
   output: process.env.NEXT_PUBLIC_OUTPUT,
   compiler: {
      styledComponents: true,
      // removeConsole: process.env.NEXT_PUBLIC_SHOW_CONSOLE !== 'true',
   },
   experimental: {
      webVitalsAttribution: ['CLS', 'LCP'],
      staleTimes: {
         dynamic: 10,
         static: 180,
      },
      // typedRoutes: true,
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
   async redirects() {
      return [
         {
            source: '/api/auth/:path*',
            destination: '/auth/:path*',
            permanent: true,
         },
      ]
   },
}

export default nextConfig
