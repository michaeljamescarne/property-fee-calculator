/**
 * Blog Content Processing Utility
 *
 * This utility processes markdown content and converts it to properly formatted HTML
 * for use in blog posts. It handles:
 * - Converting markdown tables to styled HTML tables
 * - Converting markdown links to styled HTML links
 * - Ensuring consistent formatting
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  tags: string[];
  content: string;
}

/**
 * Processes inline markdown in text (bold, italic, links)
 * Used for processing markdown inside table cells
 */
function processInlineMarkdown(text: string): string {
  if (typeof window !== "undefined") {
    return text; // Client-side, return as-is
  }

  try {
    // Process bold (**text** or __text__)
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');

    // Process italic (*text* or _text_)
    text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    text = text.replace(/_(.+?)_/g, '<em class="italic">$1</em>');

    // Process links [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
    );

    return text;
  } catch (error) {
    console.error("Error processing inline markdown:", error);
    return text; // Return original on error
  }
}

/**
 * Converts markdown table syntax to styled HTML table
 */
export function convertMarkdownTableToHTML(markdownTable: string): string {
  try {
    const lines = markdownTable
      .trim()
      .split("\n")
      .filter((line) => line.trim());

    if (lines.length < 3) return markdownTable; // Not a valid table

    // Extract header row (first line)
    const headerLine = lines[0];
    const headers = headerLine
      .split("|")
      .map((h) => h.trim())
      .filter((h) => h && !h.match(/^-+$/)); // Filter out separator-only cells

    // Validate headers exist
    if (headers.length === 0) {
      return markdownTable; // Invalid table, return original
    }

    // Find separator row (usually line 1, contains dashes)
    // Skip it - we don't need it

    // Extract data rows (start from line 2, after header and separator)
    const dataRows = lines
      .slice(2) // Skip header (line 0) and separator (line 1)
      .map((line) => {
        return line
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell && !cell.match(/^-+$/)); // Filter out separator-only cells
      })
      .filter((row) => row.length > 0); // Keep rows with data

    // Build HTML table
    let htmlTable = '<table class="w-full border-collapse border border-gray-300 mb-6">\n';

    // Header
    htmlTable += "  <thead>\n";
    htmlTable += '    <tr class="bg-gray-50">\n';
    headers.forEach((header) => {
      // Process inline markdown (bold, italic, links)
      const processedHeader = processInlineMarkdown(header);
      htmlTable += `      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">${processedHeader}</th>\n`;
    });
    htmlTable += "    </tr>\n";
    htmlTable += "  </thead>\n";

    // Body
    htmlTable += "  <tbody>\n";
    dataRows.forEach((row) => {
      // Create a new array to avoid mutating the original
      let processedRow = [...row];

      // Pad row to match header length if needed
      while (processedRow.length < headers.length) {
        processedRow.push("");
      }
      // Truncate if longer
      if (processedRow.length > headers.length) {
        processedRow = processedRow.slice(0, headers.length);
      }

      htmlTable += '    <tr class="hover:bg-gray-50">\n';
      processedRow.forEach((cell) => {
        // Process inline markdown (bold, italic, links)
        const processedCell = processInlineMarkdown(String(cell || ""));
        htmlTable += `      <td class="border border-gray-300 px-4 py-3">${processedCell}</td>\n`;
      });
      htmlTable += "    </tr>\n";
    });
    htmlTable += "  </tbody>\n";
    htmlTable += "</table>";

    return htmlTable;
  } catch (error) {
    console.error("Error converting markdown table to HTML:", error);
    // Return original markdown on error to prevent breaking the page
    return markdownTable;
  }
}

/**
 * Removes excessive blank lines before tables to prevent spacing issues
 */
export function removeExcessiveSpacingBeforeTables(content: string): string {
  // Pattern to match heading followed by blank lines and then a table
  const headingTablePattern = /(###? .+?)\n(\n+)(<table)/g;

  return content.replace(headingTablePattern, (match, heading, blankLines, table) => {
    // Keep only one blank line before the table
    return `${heading}\n${table}`;
  });

  // Also handle cases where there's text followed by blank lines and then a table
  const textTablePattern = /([^\n])\n(\n+)(<table)/g;
  return content.replace(textTablePattern, (match, text, blankLines, table) => {
    // Keep only one blank line before the table
    return `${text}\n${table}`;
  });
}

/**
 * Converts any date value to a string format (YYYY-MM-DD)
 * Handles Date objects, strings, and other types
 */
function normalizeDate(date: unknown): string {
  if (!date) {
    return new Date().toISOString().split("T")[0];
  }

  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }

  if (typeof date === "string") {
    // If it's already a string in YYYY-MM-DD format, return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Try to parse and format it
    try {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0];
      }
    } catch {
      // Fall through to default
    }
  }

  // Default to today's date if we can't parse it
  return new Date().toISOString().split("T")[0];
}

/**
 * Converts markdown links to styled HTML links
 * Ensures link text is not split across elements
 */
export function convertMarkdownLinksToHTML(content: string): string {
  // Pattern to match markdown links: [text](url)
  // More robust pattern that handles nested brackets and parentheses
  const linkPattern = /\[((?:[^\]]|\[[^\]]*\])*)\]\(([^)]+)\)/g;

  return content.replace(linkPattern, (match, text, url) => {
    // Trim whitespace from text and URL
    const cleanText = text.trim();
    const cleanUrl = url.trim();

    // Skip if text or URL is empty
    if (!cleanText || !cleanUrl) {
      return match;
    }

    // Determine if it's an external link
    const isExternal = cleanUrl.startsWith("http") && !cleanUrl.includes("propertycosts.com.au");

    // Escape HTML in text to prevent issues
    const escapedText = cleanText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (isExternal) {
      return `<a href="${cleanUrl}" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">${escapedText}</a>`;
    } else {
      return `<a href="${cleanUrl}" class="text-blue-600 hover:text-blue-800 underline">${escapedText}</a>`;
    }
  });
}

/**
 * Processes markdown content and converts it to properly formatted HTML
 * Uses remark to convert markdown to HTML with proper formatting
 */
export function processMarkdownContent(content: string): string {
  // Only load Node.js modules on the server
  if (typeof window !== "undefined") {
    return content;
  }

  try {
    // Pre-process: Convert markdown tables to HTML before remark processes them
    // This prevents tables from being wrapped in <p> tags
    let preprocessedContent = content;
    const tablePattern = /^(\|.*\|[\s\S]*?)(?=\n\n|\n[^|]|$)/gm;
    preprocessedContent = preprocessedContent.replace(tablePattern, (match) => {
      const lines = match
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      // Check if it's a valid markdown table: has header, separator with dashes, and at least one data row
      if (lines.length >= 3) {
        const hasHeader = lines[0].includes("|");
        const hasSeparator =
          lines[1].includes("|") && (lines[1].includes("-") || lines[1].includes(":"));
        const hasDataRows = lines.slice(2).some((line) => line.includes("|"));

        if (hasHeader && hasSeparator && hasDataRows) {
          return "\n\n" + convertMarkdownTableToHTML(match) + "\n\n";
        }
      }
      return match;
    });

    // Dynamic import to avoid bundling issues (server-side only)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { remark } = require("remark");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const remarkHtml = require("remark-html");

    // Process markdown with remark (synchronously)
    // remarkHtml.default is the plugin function
    const processor = remark().use(remarkHtml.default, { sanitize: false });
    const processed = processor.processSync(preprocessedContent);

    let htmlContent = String(processed);

    // Enhance HTML with additional styling classes
    // Add Tailwind classes to headings
    htmlContent = htmlContent.replace(/<h1>/g, '<h1 class="text-4xl font-bold mt-8 mb-4">');
    htmlContent = htmlContent.replace(/<h2>/g, '<h2 class="text-3xl font-bold mt-8 mb-4">');
    htmlContent = htmlContent.replace(/<h3>/g, '<h3 class="text-2xl font-semibold mt-6 mb-3">');
    htmlContent = htmlContent.replace(/<h4>/g, '<h4 class="text-xl font-semibold mt-4 mb-2">');

    // Add Tailwind classes to paragraphs
    htmlContent = htmlContent.replace(/<p>/g, '<p class="mb-4 leading-relaxed">');

    // Remove <p> tags inside <li> tags (remark-html wraps list item content in <p>)
    // This fixes the issue where list items show content twice
    // Handle both cases: <li><p>content</p></li> and <li class="..."><p>content</p></li>
    htmlContent = htmlContent.replace(
      /<li([^>]*)>\s*<p[^>]*>(.*?)<\/p>\s*<\/li>/gs,
      "<li$1>$2</li>"
    );

    // Add Tailwind classes to lists
    htmlContent = htmlContent.replace(
      /<ul>/g,
      '<ul class="list-disc list-inside mb-4 space-y-2 ml-4">'
    );
    htmlContent = htmlContent.replace(
      /<ol>/g,
      '<ol class="list-decimal list-inside mb-4 space-y-2 ml-4">'
    );
    htmlContent = htmlContent.replace(/<li>/g, '<li class="mb-1">');

    // Add Tailwind classes to links (if not already styled)
    // Use a more robust pattern that checks if class attribute already exists
    htmlContent = htmlContent.replace(
      /<a(?![^>]*\bclass=)([^>]*href=)/g,
      '<a class="text-blue-600 hover:text-blue-800 underline"$1'
    );

    // Also handle links that already have attributes but no class
    htmlContent = htmlContent.replace(/<a([^>]*\s+)(href=)/g, (match, attrs, hrefAttr) => {
      // Check if class is already in attributes
      if (attrs.includes("class=")) {
        return match;
      }
      // Insert class before href
      return `<a${attrs}class="text-blue-600 hover:text-blue-800 underline" ${hrefAttr}`;
    });

    // Add Tailwind classes to blockquotes
    htmlContent = htmlContent.replace(
      /<blockquote>/g,
      '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">'
    );

    // Add Tailwind classes to code blocks
    htmlContent = htmlContent.replace(
      /<code>/g,
      '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">'
    );
    htmlContent = htmlContent.replace(
      /<pre>/g,
      '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">'
    );
    htmlContent = htmlContent.replace(/<\/pre>/g, "</code></pre>");

    // Add Tailwind classes to strong/bold
    htmlContent = htmlContent.replace(/<strong>/g, '<strong class="font-bold">');
    htmlContent = htmlContent.replace(/<b>/g, '<b class="font-bold">');

    // Add Tailwind classes to emphasis/italic
    htmlContent = htmlContent.replace(/<em>/g, '<em class="italic">');
    htmlContent = htmlContent.replace(/<i>/g, '<i class="italic">');

    // Convert markdown tables that were wrapped in <p> tags back to proper HTML tables
    // Pattern: <p> with markdown table syntax inside
    const wrappedTablePattern = /<p[^>]*>\s*(\|.*\|[\s\S]*?)\s*<\/p>/g;
    htmlContent = htmlContent.replace(wrappedTablePattern, (match, tableContent) => {
      const lines = tableContent.trim().split("\n");
      // Check if it's a valid markdown table (has header, separator, and data rows)
      if (
        lines.length >= 3 &&
        lines[0].includes("|") &&
        lines[1].includes("|") &&
        lines[1].includes("-")
      ) {
        return convertMarkdownTableToHTML(tableContent);
      }
      return match; // Return original if not a valid table
    });

    // Also handle tables that might be in multiple <p> tags
    const multiParagraphTablePattern = /(<p[^>]*>\s*\|[^<]*\|[^<]*<\/p>\s*)+/g;
    htmlContent = htmlContent.replace(multiParagraphTablePattern, (match) => {
      // Extract all table rows from the <p> tags
      const rowMatches = match.match(/<p[^>]*>\s*(\|[^<]*\|)\s*<\/p>/g);
      if (rowMatches && rowMatches.length >= 3) {
        const tableRows = rowMatches
          .map((pTag) => {
            const rowMatch = pTag.match(/<p[^>]*>\s*(\|[^<]*\|)\s*<\/p>/);
            return rowMatch ? rowMatch[1].trim() : "";
          })
          .filter((row) => row);

        if (tableRows.length >= 3) {
          const tableContent = tableRows.join("\n");
          return convertMarkdownTableToHTML(tableContent);
        }
      }
      return match;
    });

    // Ensure tables have proper styling (if they exist)
    htmlContent = htmlContent.replace(
      /<table>/g,
      '<table class="w-full border-collapse border border-gray-300 mb-6">'
    );
    htmlContent = htmlContent.replace(/<thead>/g, "<thead>");
    htmlContent = htmlContent.replace(/<tbody>/g, "<tbody>");
    htmlContent = htmlContent.replace(
      /<th>/g,
      '<th class="border border-gray-300 px-4 py-3 text-left font-semibold bg-gray-50">'
    );
    htmlContent = htmlContent.replace(/<td>/g, '<td class="border border-gray-300 px-4 py-3">');

    // Remove excessive spacing before tables
    htmlContent = removeExcessiveSpacingBeforeTables(htmlContent);

    return htmlContent;
  } catch (error) {
    console.error("Error processing markdown content:", error);
    // Fallback to basic processing
    let processedContent = content;

    // Convert markdown tables to HTML tables BEFORE processing
    // Pattern to match markdown tables (header, separator with dashes, and data rows)
    const tablePattern = /(\|.*\|[\s\S]*?)(?=\n\n|\n[^|]|$)/g;
    processedContent = processedContent.replace(tablePattern, (match) => {
      const lines = match
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      // Check if it's a valid markdown table: has header, separator with dashes, and at least one data row
      if (lines.length >= 3) {
        const hasHeader = lines[0].includes("|");
        const hasSeparator = lines[1].includes("|") && lines[1].includes("-");
        const hasDataRows = lines.slice(2).some((line) => line.includes("|"));

        if (hasHeader && hasSeparator && hasDataRows) {
          return "\n\n" + convertMarkdownTableToHTML(match) + "\n\n";
        }
      }
      return match;
    });

    // Convert markdown links to HTML links
    processedContent = convertMarkdownLinksToHTML(processedContent);

    return processedContent;
  }
}

/**
 * Creates a blog post with processed content
 */
export function createBlogPost(
  slug: string,
  title: string,
  excerpt: string,
  date: string | Date | unknown,
  readTime: string,
  category: string,
  featured: boolean,
  tags: string[],
  markdownContent: string
): BlogPost {
  const processedContent = processMarkdownContent(markdownContent);

  // Ensure date is always a string
  const normalizedDate = normalizeDate(date);

  return {
    slug,
    title,
    excerpt,
    date: normalizedDate,
    readTime,
    category,
    featured,
    tags,
    content: processedContent,
  };
}

/**
 * Get all blog posts for a locale
 * Reads markdown files from content/blog directory
 * Server-side only function
 */
export function getAllBlogPosts(_locale: string): BlogPost[] {
  // Only load Node.js modules on the server
  if (typeof window !== "undefined") {
    return [] as BlogPost[];
  }

  try {
    // Dynamic import to avoid bundling issues (server-side only)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const matter = require("gray-matter");

    const blogDir = path.join(process.cwd(), "content", "blog");

    if (!fs.existsSync(blogDir)) {
      return [];
    }

    const files = fs.readdirSync(blogDir).filter((file: string) => file.endsWith(".md"));

    const posts = files
      .map((file: string) => {
        try {
          const filePath = path.join(blogDir, file);
          const fileContents = fs.readFileSync(filePath, "utf8");

          // Skip empty files
          if (!fileContents || fileContents.trim().length === 0) {
            return null;
          }

          // Parse frontmatter
          const { data, content } = matter(fileContents);

          // Extract slug from filename
          const slug = file.replace(/\.md$/, "");

          // Ensure date is always a string
          const dateString = normalizeDate(data.date);

          // Create blog post
          return createBlogPost(
            slug,
            data.title || slug,
            data.excerpt || content.substring(0, 150) + "...",
            dateString,
            data.readTime || "5 min read",
            data.category || "General",
            data.featured || false,
            data.tags || [],
            content
          );
        } catch (error) {
          console.error(`Error processing blog post ${file}:`, error);
          return null;
        }
      })
      .filter((post: BlogPost | null): post is BlogPost => post !== null)
      .sort((a: BlogPost, b: BlogPost) => {
        // Sort by date, newest first
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}

/**
 * Get a single blog post by slug and locale
 * Returns null if not found
 * Server-side only function
 */
export function getBlogPost(slug: string, _locale: string): BlogPost | null {
  // Only load Node.js modules on the server
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    // Dynamic import to avoid bundling issues (server-side only)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const matter = require("gray-matter");

    const filePath = path.join(process.cwd(), "content", "blog", `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");

    // Skip empty files
    if (!fileContents || fileContents.trim().length === 0) {
      return null;
    }

    // Parse frontmatter
    const { data, content } = matter(fileContents);

    // Ensure date is always a string
    const dateString = normalizeDate(data.date);

    // Create blog post
    return createBlogPost(
      slug,
      data.title || slug,
      data.excerpt || content.substring(0, 150) + "...",
      dateString,
      data.readTime || "5 min read",
      data.category || "General",
      data.featured || false,
      data.tags || [],
      content
    );
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}
