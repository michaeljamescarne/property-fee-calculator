import { getAllBlogPosts } from "@/lib/blogContentProcessor";
import Link from "next/link";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const posts = getAllBlogPosts(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
            <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
