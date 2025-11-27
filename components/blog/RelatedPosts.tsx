"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@/lib/blogContentProcessor";
import { formatBlogDate, generateBlogUrl, getCategoryColor } from "@/lib/blog/blog-utils";

interface RelatedPostsProps {
  posts: BlogPost[];
  locale: string;
}

export default function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        Related Articles
      </h3>

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => {
          const postUrl = generateBlogUrl(locale, post.slug);
          const categoryColor = getCategoryColor(post.category);
          const formattedDate = formatBlogDate(post.date, locale);

          return (
            <Link key={post.slug} href={postUrl} className="group">
              <Card className="border border-gray-200 hover:border-blue-600 hover:shadow-md transition-all h-full">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{formattedDate}</span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-1 text-sm text-blue-600 font-medium pt-2">
                      Read more
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
