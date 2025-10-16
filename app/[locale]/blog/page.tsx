'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock blog posts data - will be replaced with dynamic content
const blogPosts = [
  {
    slug: 'ultimate-firb-guide-2025',
    title: 'Ultimate FIRB Guide 2025: Complete Foreign Investment Rules',
    excerpt: 'Everything foreign investors need to know about FIRB approval, fees, and requirements for Australian property investment.',
    date: '2025-01-15',
    readTime: '12 min read',
    category: 'FIRB Guide',
    featured: true,
    tags: ['FIRB', 'Foreign Investment', 'Property Rules']
  },
  {
    slug: 'stamp-duty-calculator-by-state',
    title: 'Stamp Duty Calculator by State: Complete 2025 Comparison',
    excerpt: 'Compare stamp duty rates and foreign buyer surcharges across all Australian states and territories.',
    date: '2025-01-12',
    readTime: '8 min read',
    category: 'Costs & Fees',
    featured: true,
    tags: ['Stamp Duty', 'State Comparison', 'Foreign Buyer Surcharge']
  },
  {
    slug: 'chinese-buyers-guide-australian-property',
    title: 'Chinese Investor\'s Guide to Australian Property Investment',
    excerpt: 'A comprehensive guide for Chinese nationals investing in Australian real estate, including cultural considerations and banking requirements.',
    date: '2025-01-10',
    readTime: '15 min read',
    category: 'Investment Guide',
    featured: false,
    tags: ['Chinese Investors', 'Property Investment', 'Cultural Guide']
  },
  {
    slug: 'visa-types-firb-requirements',
    title: 'Visa Types & FIRB Requirements: Complete Breakdown',
    excerpt: 'Detailed breakdown of FIRB requirements by visa category, including temporary residents, students, and permanent residents.',
    date: '2025-01-08',
    readTime: '10 min read',
    category: 'Visa & Residency',
    featured: false,
    tags: ['Visa Types', 'FIRB Requirements', 'Temporary Residents']
  },
  {
    slug: 'new-vs-established-property-foreign-buyers',
    title: 'New vs Established Property: What Foreign Buyers Need to Know',
    excerpt: 'Compare the FIRB rules, costs, and investment potential of new versus established properties for foreign investors.',
    date: '2025-01-05',
    readTime: '7 min read',
    category: 'Property Types',
    featured: false,
    tags: ['New Property', 'Established Property', 'FIRB Rules']
  }
];

export default function BlogPage() {
  const t = useTranslations('Blog');

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{t('featured')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {post.featured && 'Featured'}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        {t('readMore')} <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <h2 className="text-3xl font-bold mb-8">{t('allPosts')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                  {post.featured && (
                    <Badge variant="outline" className="text-xs">Featured</Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-AU', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      {t('readMore')} <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="py-12">
            <h3 className="text-3xl font-bold mb-4">{t('cta.title')}</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <Button size="lg" asChild>
              <Link href="/firb-calculator">
                {t('cta.button')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
