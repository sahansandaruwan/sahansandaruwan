import React from 'react';
import { BlogPost } from '../types';
import { formatDate } from '../utils/dateUtils';

interface ArticleCardProps {
  post: BlogPost;
  onSelect: (post: BlogPost) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ post, onSelect }) => {
  const formattedDate = formatDate(post.date);

  return (
    <div
      id={`article-row-${post.id}`}
      onClick={() => onSelect(post)}
      className="group cursor-pointer py-2.5 sm:py-2 flex items-baseline justify-between gap-3 sm:gap-4 transition-colors hover:opacity-100 opacity-85 active:opacity-100 min-h-[40px]"
    >
      <div className="flex items-baseline gap-3 sm:gap-6 min-w-0 flex-1">
        {/* Date column */}
        <span className="text-xs font-mono-reader opacity-50 shrink-0 whitespace-nowrap min-w-[72px] sm:min-w-[90px]">
          {formattedDate}
        </span>

        {/* Title link */}
        <h2 className="text-sm sm:text-base font-hn-reader font-medium tracking-tight group-hover:underline underline-offset-4 line-clamp-2 sm:line-clamp-none break-words">
          {post.title}
        </h2>
      </div>

      {/* Read time */}
      <span className="text-xs font-mono-reader opacity-40 shrink-0 hidden sm:inline ml-2 whitespace-nowrap">
        {post.readTimeMinutes} min
      </span>
    </div>
  );
};
