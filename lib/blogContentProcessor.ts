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
 * Converts markdown table syntax to styled HTML table
 */
export function convertMarkdownTableToHTML(markdownTable: string): string {
  const lines = markdownTable.trim().split('\n');
  if (lines.length < 3) return markdownTable; // Not a valid table
  
  // Extract header row
  const headerLine = lines[1];
  const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
  
  // Extract separator row (skip it)
  // const separatorLine = lines[2];
  
  // Extract data rows
  const dataRows = lines.slice(3).map(line => {
    return line.split('|').map(cell => cell.trim()).filter(cell => cell);
  }).filter(row => row.length > 0);
  
  // Build HTML table
  let htmlTable = '<table class="w-full border-collapse border border-gray-300 mb-6">\n';
  
  // Header
  htmlTable += '  <thead>\n';
  htmlTable += '    <tr class="bg-gray-50">\n';
  headers.forEach(header => {
    htmlTable += `      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">${header}</th>\n`;
  });
  htmlTable += '    </tr>\n';
  htmlTable += '  </thead>\n';
  
  // Body
  htmlTable += '  <tbody>\n';
  dataRows.forEach(row => {
    htmlTable += '    <tr class="hover:bg-gray-50">\n';
    row.forEach(cell => {
      htmlTable += `      <td class="border border-gray-300 px-4 py-3">${cell}</td>\n`;
    });
    htmlTable += '    </tr>\n';
  });
  htmlTable += '  </tbody>\n';
  htmlTable += '</table>';
  
  return htmlTable;
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
 * Converts markdown links to styled HTML links
 */
export function convertMarkdownLinksToHTML(content: string): string {
  // Pattern to match markdown links: [text](url)
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  return content.replace(linkPattern, (match, text, url) => {
    // Determine if it's an external link
    const isExternal = url.startsWith('http') && !url.includes('propertycosts.com.au');
    
    if (isExternal) {
      return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
    } else {
      return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
    }
  });
}

/**
 * Processes markdown content and converts it to properly formatted HTML
 */
export function processMarkdownContent(content: string): string {
  let processedContent = content;
  
  // Convert markdown tables to HTML tables
  const tablePattern = /(\|.*\|[\s\S]*?)(?=\n\n|\n[^|]|$)/g;
  processedContent = processedContent.replace(tablePattern, (match) => {
    // Check if this looks like a markdown table
    const lines = match.trim().split('\n');
    if (lines.length >= 3 && lines[1].includes('|') && lines[2].includes('|')) {
      return convertMarkdownTableToHTML(match);
    }
    return match;
  });
  
  // Convert markdown links to HTML links
  processedContent = convertMarkdownLinksToHTML(processedContent);
  
  // Remove excessive spacing before tables
  processedContent = removeExcessiveSpacingBeforeTables(processedContent);
  
  return processedContent;
}

/**
 * Creates a blog post with processed content
 */
export function createBlogPost(
  slug: string,
  title: string,
  excerpt: string,
  date: string,
  readTime: string,
  category: string,
  featured: boolean,
  tags: string[],
  markdownContent: string
): BlogPost {
  const processedContent = processMarkdownContent(markdownContent);
  
  return {
    slug,
    title,
    excerpt,
    date,
    readTime,
    category,
    featured,
    tags,
    content: processedContent
  };
}

/**
 * Get all blog posts for a locale
 * Returns empty array for now - blog posts will be added later
 */
export function getAllBlogPosts(locale: string): BlogPost[] {
  // Return empty array for now
  return [];
}

/**
 * Get a single blog post by slug and locale
 * Returns null if not found
 */
export function getBlogPost(slug: string, locale: string): BlogPost | null {
  // Return null for now - blog posts will be added later
  return null;
}

/**
 * Instructions for using this utility:
 * 
 * 1. Create your blog content in markdown format
 * 2. Use this utility to process it:
 *    const blogPost = createBlogPost(
 *      'your-slug',
 *      'Your Title',
 *      'Your excerpt...',
 *      '2025-01-15',
 *      '12 min read',
 *      'Category',
 *      true,
 *      ['tag1', 'tag2'],
 *      yourMarkdownContent
 *    );
 * 3. Add the processed blogPost to your blogPosts object
 * 
 * This ensures:
 * - Tables are properly converted to HTML with styling
 * - Links are properly formatted with external link handling
 * - Consistent formatting across all blog posts
 * - No manual string replacement needed
 */
