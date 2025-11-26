import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/blog/SocialShare";
import { getAllBlogPosts, getBlogPost, getBlogPostAdjacent } from "@/lib/blog/posts";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const post = await getBlogPost(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  try {
    const post = await getBlogPost(slug);
    const { previous, next } = await getBlogPostAdjacent(slug);

    return (
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <Button variant="ghost" className="mb-8" asChild>
          <Link href={`/${locale}/blog`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to articles
          </Link>
        </Button>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("en-AU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <SocialShare
          title={post.title}
          url={`/${locale}/blog/${post.slug}`}
          excerpt={post.excerpt}
        />

        <footer className="mt-16 border-t pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {previous ? (
              <Button variant="outline" className="justify-start" asChild>
                <Link href={`/${locale}/blog/${previous.slug}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {previous.title}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button variant="outline" className="justify-end" asChild>
                <Link href={`/${locale}/blog/${next.slug}`}>
                  {next.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <span />
            )}
          </div>
        </footer>
      </article>
    );
  } catch {
    notFound();
  }
}
