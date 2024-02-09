/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nifty-league.s3.amazonaws.com',
        port: '',
        pathname: '/degens/**',
      },
      {
        protocol: 'https',
        hostname: 'nifty-league.s3.amazonaws.com',
        port: '',
        pathname: '/assets/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/invite/:ref_code(\\w{1,})',
        has: [
          {
            type: 'header',
            key: 'User-Agent',
            value: '.*(iPhone|iPad|iPod).*',
          },
        ],
        destination: process.env.NEXT_PUBLIC_APPLE_STORE_LINK,
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        has: [
          {
            type: 'header',
            key: 'User-Agent',
            value: '.*(Mobile|Android).*',
          },
        ],
        destination: process.env.NEXT_PUBLIC_GOOGLE_PLAY_LINK,
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        destination: '/?ref=:ref_code',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'niftyleague',
    project: 'nifty-smashers-web',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
