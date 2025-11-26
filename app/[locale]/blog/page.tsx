import { getAllBlogPosts } from "@/lib/blog/posts";
import BlogClient from "@/components/blog/BlogClient";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const posts = await getAllBlogPosts();

  return <BlogClient posts={posts} locale={locale} />;
}
