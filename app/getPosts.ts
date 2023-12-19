// TypeScript
"use server"
import { StoryProps } from "@/components/Story";
import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'app/posts');
const imagesDirectory = path.join(process.cwd(), 'public');

const getPosts = async (): Promise<StoryProps[]> => {
  const slugs = fs.readdirSync(postsDirectory);
  const posts: StoryProps[] = [];

  await Promise.all(slugs.filter(slug => !slug.includes('.')).map(async slug => {
    const { metadata } = await import(`./posts/${slug}/page.mdx`);
    const link = metadata?.link ? metadata.link : `/posts/${slug}`;
    posts.push({
      slug,
      title: metadata.title,
      link,
      description: metadata.description,
      tag: metadata.tag,
      date: metadata.date,
    });
  }));

  return posts;
};

export default getPosts;