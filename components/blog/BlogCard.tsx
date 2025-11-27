"use client";

import Link from "next/link";
import { Calendar, Clock, Star } from "lucide-react";
import type { BlogPost } from "@/lib/blogContentProcessor";
import { formatBlogDate, getCategoryColor, generateBlogUrl } from "@/lib/blog/blog-utils";

interface BlogCardProps {
  post: BlogPost;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const postUrl = generateBlogUrl(locale, post.slug);
  const categoryColor = getCategoryColor(post.category);
  const formattedDate = formatBlogDate(post.date, locale);

  return (
    <Link href={postUrl}>
      <article
        className={`group border border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg hover:border-blue-600 transition-all cursor-pointer h-full flex flex-col ${
          post.featured ? "ring-2 ring-blue-200" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryColor}`}
            >
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">{post.excerpt}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-block px-2 py-0.5 text-gray-500 text-xs">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
          {post.readTime && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
