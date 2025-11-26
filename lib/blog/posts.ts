import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";
import type { BlogPostMeta, BlogPost } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

type FrontMatter = {
  title?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  coverImage?: string;
};

async function readMarkdownFile(fileName: string) {
  const filePath = path.join(BLOG_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  return { data: data as FrontMatter, content };
}

function createExcerpt(content: string, fallback?: string) {
  if (fallback) return fallback;
  const stripped = content.replace(/[#>*_`]/g, "").trim();
  return stripped.slice(0, 220) + (stripped.length > 220 ? "…" : "");
}

function formatReadTime(content: string, fallback?: string) {
  if (fallback) return fallback;
  const stats = readingTime(content);
  const minutes = Math.max(1, Math.ceil(stats.minutes));
  return `${minutes} min read`;
}

export const getAllBlogPosts = cache(async (): Promise<BlogPostMeta[]> => {
  const files = await fs.readdir(BLOG_DIR);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const slugFromFile = file.replace(/\.md$/, "");
        const { data, content } = await readMarkdownFile(file);
        const slug = data.slug ?? slugFromFile;

        return {
          slug,
          title: data.title ?? slug.replace(/-/g, " "),
          excerpt: createExcerpt(content, data.excerpt),
          date: data.date ?? new Date().toISOString(),
          category: data.category ?? "General",
          tags: data.tags ?? [],
          featured: Boolean(data.featured),
          coverImage: data.coverImage,
          readTime: formatReadTime(content),
        } satisfies BlogPostMeta;
      })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export const getBlogPost = cache(async (slug: string): Promise<BlogPost> => {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const exists = await fs
    .stat(filePath)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    throw new Error(`Blog post ${slug} not found`);
  }

  const { data, content } = await readMarkdownFile(`${slug}.md`);
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? slug.replace(/-/g, " "),
    excerpt: createExcerpt(content, data.excerpt),
    date: data.date ?? new Date().toISOString(),
    category: data.category ?? "General",
    tags: data.tags ?? [],
    featured: Boolean(data.featured),
    coverImage: data.coverImage,
    readTime: formatReadTime(content, data.readTime as string | undefined),
    contentHtml,
  };
});

export const getBlogPostAdjacent = cache(
  async (
    slug: string
  ): Promise<{
    previous?: BlogPostMeta;
    next?: BlogPostMeta;
  }> => {
    const posts = await getAllBlogPosts();
    const index = posts.findIndex((post) => post.slug === slug);
    return {
      previous: index < posts.length - 1 ? posts[index + 1] : undefined,
      next: index > 0 ? posts[index - 1] : undefined,
    };
  }
);
