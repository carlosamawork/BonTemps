const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Sanity's CDN is the optimizer — next/image must NOT re-encode on top
      // of it (that second q75/WebP pass was the heavy compression). See
      // sanityImageLoader.ts.
      loader: 'custom',
      loaderFile: './sanityImageLoader.ts',
      minimumCacheTTL: 2592000, // 30 days = 24*60*60*30
      deviceSizes: [768, 1024, 1280, 1440, 2560], // Screens sizes
      imageSizes: [], // Prevents small image sizes from being generated
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cdn.sanity.io",
        },
        
      ],
      domains: ['localhost', 'cdn.sanity.io'],
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    reactStrictMode: false,
    trailingSlash: true,
    
  };

module.exports = nextConfig
