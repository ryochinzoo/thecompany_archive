const { withSuperjson } = require('next-superjson')
const { i18n } = require('./next-i18next.config')

module.exports = withSuperjson()({
  /*
  async redirects() {
    return [
      {
        source: '/',
        destination: '/coming_soon/',
        permanent: true,
      },
    ]
  },
  */
  i18n,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    loader: "akamai",
    path: "",
    domains: ["217.160.55.87", 'cdn.shopify.com', "127.0.0.1", "localhost", "thecompanyberlin.myshopify.com"],//configs.STRAPI_DOMAIN in Zukunft https://strapi.io/blog/how-to-use-image-and-preview-in-your-nextjs-strapi-blog
  },
  webpack(config, options,) {
    
    config.module.rules.push({
      test: /\.(jpe?g|png|svg|gif|ico|eot|ttf|woff|woff2|mp4|pdf|webm|txt)$/,
      type: 'asset',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]'
      },
    });

    return config;
  },
  future: { webpack5: true },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  experimental: {
    // Enables the styled-components SWC transform
    largePageDataBytes: 128 * 100000,
  },
})