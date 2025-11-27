import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/blogContentProcessor";

export async function generateStaticParams() {
  // Return empty array for now - blog posts are loaded dynamically
  return [];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = getBlogPost(slug, locale);

  if (!post) {
    notFound();
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            {post.date && (
              <>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>•</span>
              </>
            )}
            {post.readTime && (
              <>
                <span>{post.readTime}</span>
                {post.category && <span>•</span>}
              </>
            )}
            {post.category && (
              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {post.category}
              </span>
            )}
          </div>
          {post.excerpt && <p className="text-lg text-gray-600 leading-relaxed">{post.excerpt}</p>}
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none 
            prose-headings:font-semibold prose-headings:text-gray-900 
            prose-h1:text-4xl prose-h1:font-bold prose-h1:leading-tight prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-3xl prose-h2:font-semibold prose-h2:leading-snug prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:leading-snug prose-h3:mb-3 prose-h3:mt-6
            prose-h4:text-xl prose-h4:font-semibold prose-h4:leading-snug prose-h4:mb-2 prose-h4:mt-4
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:text-gray-600 prose-ul:my-4 prose-ul:pl-6
            prose-ol:text-gray-600 prose-ol:my-4 prose-ol:pl-6
            prose-li:my-2 prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-4
            prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded prose-pre:p-4 prose-pre:my-4
            prose-img:rounded prose-img:my-4 prose-img:shadow-sm
            prose-hr:border-gray-200 prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
