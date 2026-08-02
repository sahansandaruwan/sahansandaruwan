import { BlogPost } from '../types';
import { formatDate, getYear } from './dateUtils';

export interface SearchResult {
  post: BlogPost;
  score: number;
}

/**
 * Intelligent multi-field search and ranking algorithm for essays.
 * Evaluates titles, excerpts, content body, tags, and publication dates with weighted relevance scoring.
 */
export function searchEssays(posts: BlogPost[], query: string): BlogPost[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Split query into individual keywords/tokens (filtered for empty strings)
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const scoredResults: SearchResult[] = [];

  for (const post of posts) {
    if (post.isDraft) continue;

    let score = 0;
    const titleLower = post.title.toLowerCase();
    const excerptLower = (post.excerpt || '').toLowerCase();
    const contentLower = (post.content || '').toLowerCase();
    const tagsLower = (post.tags || []).map((t) => t.toLowerCase());
    const dateFormatted = formatDate(post.date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).toLowerCase();
    const yearStr = getYear(post.date);

    // 1. Exact Title Match
    if (titleLower === normalizedQuery) {
      score += 100;
    }
    // 2. Title Starts With Query
    else if (titleLower.startsWith(normalizedQuery)) {
      score += 60;
    }
    // 3. Title Contains Full Query
    else if (titleLower.includes(normalizedQuery)) {
      score += 40;
    }

    // 4. Token-level Title Matches
    for (const token of tokens) {
      if (titleLower.includes(token)) {
        score += 20;
      }
    }

    // 5. Tag Matches
    for (const tag of tagsLower) {
      if (tag === normalizedQuery) {
        score += 30;
      } else if (tag.includes(normalizedQuery)) {
        score += 20;
      } else {
        for (const token of tokens) {
          if (tag.includes(token)) {
            score += 10;
          }
        }
      }
    }

    // 6. Excerpt Matches
    if (excerptLower.includes(normalizedQuery)) {
      score += 20;
    } else {
      for (const token of tokens) {
        if (excerptLower.includes(token)) {
          score += 8;
        }
      }
    }

    // 7. Date / Year Matches
    if (dateFormatted.includes(normalizedQuery) || yearStr === normalizedQuery) {
      score += 25;
    }

    // 8. Content Matches (Frequency capped)
    if (contentLower.includes(normalizedQuery)) {
      score += 10;
    } else {
      let contentTokenHits = 0;
      for (const token of tokens) {
        if (contentLower.includes(token)) {
          contentTokenHits++;
        }
      }
      if (contentTokenHits > 0) {
        score += Math.min(contentTokenHits * 3, 12);
      }
    }

    // Include post if it has any match score > 0
    if (score > 0) {
      scoredResults.push({ post, score });
    }
  }

  // Sort by score descending, then by date descending
  return scoredResults
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .map((res) => res.post);
}
