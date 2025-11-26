import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog/posts";

export async function GET() {
  const posts = await getAllBlogPosts();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com";

  const rssItems = posts
    .slice(0, 20) // Latest 20 posts
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      const link = `${baseUrl}/en/blog/${post.slug}`;

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${post.category}]]></category>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Australian Property Investment Blog</title>
    <description>Expert guides and insights on Australian property investment, FIRB requirements, and investment strategies</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-AU</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
