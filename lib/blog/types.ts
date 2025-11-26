export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: string;
  coverImage?: string;
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};
