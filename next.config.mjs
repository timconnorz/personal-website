import nextMDX from '@next/mdx';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
// import remarkEmbedder from '@remark-embedder/core';
// import oembedTransformer from '@remark-embedder/transformer-oembed';
// import remarkFrontmatter from 'remark-frontmatter';
// import recmaNextjsStaticProps from 'recma-nextjs-static-props'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // remarkFrontmatter,
      // remarkMdxFrontmatter,
      // remarkMDXNext,
      remarkBreaks, 
      remarkGfm,
      // [remarkEmbedder, { transformers: [oembedTransformer] }],
    ],
    rehypePlugins: [rehypeHighlight],
    // recmaPlugins: [recmaNextjsStaticProps],
  },
});

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false, 
  }
  // Other Next.js config options
};

export default withMDX(nextConfig);

