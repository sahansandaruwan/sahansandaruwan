import { BlogPost } from '../types';

interface Frontmatter {
  title?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  slug?: string;
  isDraft?: boolean;
  featured?: boolean;
}

/**
 * Intelligent frontmatter & Markdown parser.
 * Handles YAML frontmatter between `---` boundaries or auto-infers fields from raw markdown content and filenames.
 */
export function parseMarkdownPost(filepath: string, rawContent: string): BlogPost {
  // Extract filename without extension and path
  const pathParts = filepath.split('/');
  const filename = pathParts[pathParts.length - 1];
  const filenameWithoutExt = filename.replace(/\.md$/, '');

  let frontmatter: Frontmatter = {};
  let bodyContent = rawContent.trim();

  // Parse Frontmatter if delimiter exists
  const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (frontmatterMatch) {
    const yamlBlock = frontmatterMatch[1];
    bodyContent = frontmatterMatch[2].trim();

    yamlBlock.split('\n').forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim().toLowerCase();
        let value = line.slice(colonIndex + 1).trim();

        // Strip quotes if wrapped
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        if (key === 'title') frontmatter.title = value;
        else if (key === 'date') frontmatter.date = value;
        else if (key === 'excerpt') frontmatter.excerpt = value;
        else if (key === 'slug') frontmatter.slug = value;
        else if (key === 'draft' || key === 'isdraft') frontmatter.isDraft = value.toLowerCase() === 'true';
        else if (key === 'featured') frontmatter.featured = value.toLowerCase() === 'true';
        else if (key === 'tags') {
          if (value.startsWith('[') && value.endsWith(']')) {
            frontmatter.tags = value
              .slice(1, -1)
              .split(',')
              .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
              .filter(Boolean);
          } else {
            frontmatter.tags = value.split(',').map((t) => t.trim()).filter(Boolean);
          }
        }
      }
    });
  }

  // --- Intelligent Fallbacks ---

  // 1. Title Fallback: Find first `# Heading` in markdown or humanize filename
  let title = frontmatter.title;
  if (!title) {
    const headingMatch = bodyContent.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1].trim();
    } else {
      // e.g. "first-post" -> "First Post"
      title = filenameWithoutExt
        .replace(/^\d{4}-\d{2}-\d{2}-/, '') // strip date prefix if present
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  }

  // 2. Date Fallback: Extract YYYY-MM-DD from filename or default to today
  let date = frontmatter.date;
  if (!date) {
    const dateInFilenameMatch = filenameWithoutExt.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateInFilenameMatch) {
      date = dateInFilenameMatch[1];
    } else {
      date = new Date().toISOString().split('T')[0];
    }
  }

  // 3. Excerpt Fallback: Extract first paragraph of body text (stripping markdown headings/images/formatting)
  let excerpt = frontmatter.excerpt;
  if (!excerpt) {
    const paragraphs = bodyContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith('#') && !p.startsWith('---') && !p.startsWith('```'));

    if (paragraphs.length > 0) {
      // Clean up markdown syntax for excerpt
      const cleanPara = paragraphs[0]
        .replace(/[*_#`>]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\s+/g, ' ');

      excerpt = cleanPara.length > 140 ? cleanPara.slice(0, 140) + '...' : cleanPara;
    } else {
      excerpt = 'Read full essay...';
    }
  }

  // 4. Slug Fallback
  const slug = frontmatter.slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  // 5. Reading Time Calculation (~200 words/min)
  const plainText = bodyContent.replace(/```[\s\S]*?```/g, '').replace(/<[^>]+>/g, '');
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: `file-${filenameWithoutExt}`,
    title,
    slug,
    excerpt,
    content: bodyContent,
    date,
    readTimeMinutes,
    tags: frontmatter.tags || [],
    isDraft: frontmatter.isDraft || false,
    featured: frontmatter.featured || false,
  };
}

/**
 * Auto-detects all .md files inside the `/post/` directory using Vite glob imports.
 */
export function autoLoadGitHubFolderPosts(): BlogPost[] {
  try {
    // Glob load all markdown files inside /post/ and /post/ subdirectories
    const modules = (import.meta as any).glob('/post/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

    const detectedPosts: BlogPost[] = [];

    for (const [filepath, rawContent] of Object.entries(modules)) {
      if (typeof rawContent === 'string' && rawContent.trim()) {
        const post = parseMarkdownPost(filepath, rawContent);
        detectedPosts.push(post);
      }
    }

    // Sort by date descending
    return detectedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.warn('Failed to auto-load /post/ markdown directory:', error);
    return [];
  }
}
