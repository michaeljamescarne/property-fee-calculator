"use client";

import { useEffect, useRef } from "react";
import type { BlogPost } from "@/lib/blogContentProcessor";

interface HubSpotBlogTrackingProps {
  post: BlogPost;
  locale: string;
  userEmail?: string;
}

/**
 * HubSpot Blog Post Tracking Component
 * 
 * Tracks:
 * - Page views
 * - Time on page
 * - Scroll depth
 * - Engagement metrics
 */
export default function HubSpotBlogTracking({
  post,
  locale,
  userEmail,
}: HubSpotBlogTrackingProps) {
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const hasTrackedViewRef = useRef<boolean>(false);
  const engagementIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track initial page view using HubSpot JavaScript API
  useEffect(() => {
    if (hasTrackedViewRef.current) return;
    hasTrackedViewRef.current = true;

    // Wait for HubSpot tracking script to load
    const trackPageView = () => {
      if (typeof window !== "undefined" && window._hsq) {
        // Track custom event via HubSpot JavaScript API
        // Using trackEvent method for custom behavioral events
        window._hsq.push([
          "trackEvent",
          {
            id: "blog_post_view",
            value: {
              post_slug: post.slug,
              post_title: post.title,
              post_category: post.category,
              locale: locale,
            },
          },
        ]);

        // Also identify user if email is available
        if (userEmail) {
          window._hsq.push(["identify", { email: userEmail }]);
        }
      } else {
        // Retry after a short delay if HubSpot script hasn't loaded yet
        setTimeout(trackPageView, 100);
      }
    };

    trackPageView();
  }, [post.slug, post.title, post.category, locale, userEmail]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      if (scrollPercent > maxScrollRef.current) {
        maxScrollRef.current = scrollPercent;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Track engagement when user leaves page
  useEffect(() => {
    const trackEngagement = () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);

      // Only track if user spent meaningful time on page
      if (timeOnPage >= 5 && typeof window !== "undefined" && window._hsq) {
        // Track engagement via HubSpot JavaScript API (no API scopes needed)
        window._hsq.push([
          "trackEvent",
          {
            id: "blog_post_engagement",
            value: {
              post_slug: post.slug,
              time_on_page_seconds: timeOnPage,
              scroll_depth_percent: maxScrollRef.current,
            },
          },
        ]);
      }
    };

    // Track engagement periodically (every 30 seconds)
    engagementIntervalRef.current = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeOnPage >= 30 && timeOnPage % 30 === 0 && typeof window !== "undefined" && window._hsq) {
        // Track periodic engagement via HubSpot JavaScript API
        window._hsq.push([
          "trackEvent",
          {
            id: "blog_post_engagement",
            value: {
              post_slug: post.slug,
              time_on_page_seconds: timeOnPage,
              scroll_depth_percent: maxScrollRef.current,
            },
          },
        ]);
      }
    }, 30000);

    // Track on page unload
    const handleBeforeUnload = () => {
      trackEngagement();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (engagementIntervalRef.current) {
        clearInterval(engagementIntervalRef.current);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      trackEngagement(); // Final tracking on component unmount
    };
  }, [post.slug, userEmail]);

  // This component doesn't render anything
  return null;
}

// Extend Window interface for HubSpot tracking queue
declare global {
  interface Window {
    _hsq?: Array<unknown>;
  }
}

