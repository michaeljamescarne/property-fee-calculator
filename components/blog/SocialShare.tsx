"use client";

import { Share2, Twitter, Linkedin, Facebook, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface SocialShareProps {
  title: string;
  url: string;
  excerpt?: string;
}

export function SocialShare({ title, url, excerpt }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : url;
  const shareText = `${title}${excerpt ? ` - ${excerpt}` : ""}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const [hasNativeShare, setHasNativeShare] = useState(false);

  // Check for native share on mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.share) {
      setHasNativeShare(true);
    }
  }, []);

  const handleNativeShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || title,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error occurred
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <div className="flex items-center gap-2">
        {hasNativeShare && (
          <Button variant="outline" size="sm" onClick={handleNativeShare} className="rounded">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.twitter, "_blank", "noopener,noreferrer")}
          className="rounded"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.linkedin, "_blank", "noopener,noreferrer")}
          className="rounded"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.facebook, "_blank", "noopener,noreferrer")}
          className="rounded"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.email)}
          className="rounded"
          aria-label="Share via Email"
        >
          <Mail className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="rounded"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
