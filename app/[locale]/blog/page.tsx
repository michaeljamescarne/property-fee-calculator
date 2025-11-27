import { getAllBlogPosts } from "@/lib/blogContentProcessor";
import Link from "next/link";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const posts = getAllBlogPosts(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Blog</h1>
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No blog posts available yet.</p>
          <p className="text-sm text-gray-600">
            Blog posts will appear here once they are published.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
              <article className="border border-gray-200 rounded p-6 bg-white hover:shadow-md hover:border-blue-600 transition-all cursor-pointer">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">{post.title}</h2>
                <p className="text-gray-600">{post.excerpt}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  {post.category && (
                    <>
                      <span>•</span>
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
