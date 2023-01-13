const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'src', 'styles')],
    },
    webpack(options) {
        return process.env.NODE_ENV === 'production'
            ? options
            : {
                  ...options,
                  optimization: {
                      moduleIds: 'deterministic',
                  },
              }
    },
    swcMinify: process.env.NODE_ENV === 'production',
    images: {
        domains: ['aether.localhost'],
    },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
