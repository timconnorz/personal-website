import nextMDX from '@next/mdx';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkEmbedder from '@remark-embedder/core';
import oembedTransformer from '@remark-embedder/transformer-oembed';
import remarkFrontmatter from 'remark-frontmatter';

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkBreaks, 
      remarkGfm,
      // [remarkEmbedder, { transformers: [oembedTransformer] }],
    ],
    rehypePlugins: [rehypeHighlight],
  },
});

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Other Next.js config options
};

export default withMDX(nextConfig);
