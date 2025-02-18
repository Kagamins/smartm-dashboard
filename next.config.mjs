
import "dotenv/config"; //
/** @type {import('next').NextConfig} */

const nextConfig = { env: {
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ryjcmqncutzamvlgherw.supabase.co',
        port: '',
         search: '',
      },
    ],
  },
 
};

export default nextConfig;
