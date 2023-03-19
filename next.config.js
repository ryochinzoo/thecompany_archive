const { withSuperjson } = require('next-superjson')

module.exports = withSuperjson()({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    loader: "akamai",
    path: "",
    domains: ["localhost", "thecompanyberlin.myshopify.com"],//configs.STRAPI_DOMAIN in Zukunft https://strapi.io/blog/how-to-use-image-and-preview-in-your-nextjs-strapi-blog
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  experimental: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
})