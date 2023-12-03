import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import fauxRemarkEmbedder from '@remark-embedder/core'
import fauxOembedTransformer from '@remark-embedder/transformer-oembed'
const remarkEmbedder = fauxRemarkEmbedder.default
const oembedTransformer = fauxOembedTransformer.default

const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: true },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack: function (config) {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: '@mdx-js/loader',
          options: {
            rehypePlugins: [],
            remarkPlugins: [
              remarkBreaks,
              remarkGfm,
              [remarkEmbedder, { transformers: [oembedTransformer] }]
            ]
          }
        }
      ]
    })
    return config
  }
}

export default nextConfig