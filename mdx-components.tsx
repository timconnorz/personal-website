import type { MDXComponents } from 'mdx/types'
import { Blockquote } from 'flowbite-react';

const myBlockquote = (props: any) => {
    return (
        <Blockquote {...props} />
    )
}
  

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        blockquote: myBlockquote,
      }
}