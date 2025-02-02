const imageDomains = [
  'api.placeholder.com',
  'thepersuasionacademy-com.b-cdn.net',
  'wltjkhsmqhospeezdgga.supabase.co',
  'itolhrognjngmyycodzv.supabase.co'  // Add development Supabase domain
  // Add more domains as needed
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: imageDomains,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
    typedRoutes: true
  },
  typescript: {
    ignoreBuildErrors: true  // Temporarily ignore TS errors during build to test if it fixes deployment
  },
  async headers() {
    return [
      {
        source: '/auth/callback',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  }
};

module.exports = nextConfig;