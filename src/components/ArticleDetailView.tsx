import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Clock, Calendar, Share2, Check } from 'lucide-react';
import { BlogPost, AuthorProfile } from '../types';
import { formatDate } from '../utils/dateUtils';

interface ArticleDetailViewProps {
  post: BlogPost;
  onBack: () => void;
  author: AuthorProfile;
  allPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  post,
  onBack,
  author,
  allPosts,
  onSelectPost
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `https://sahansandaruwan.github.io/?post=${post.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Dynamic SEO, GEO, and AEO Head Updates (Title, Description, Schema JSON-LD)
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescTag = document.querySelector('meta[name="description"]');
    const originalDesc = metaDescTag ? metaDescTag.getAttribute('content') : '';

    document.title = `${post.title} — ${author.name}`;
    if (metaDescTag) {
      metaDescTag.setAttribute('content', post.excerpt);
    }

    // Set Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    const originalCanonical = canonicalTag ? canonicalTag.getAttribute('href') : '';
    const postUrl = `https://sahansandaruwan.github.io/?post=${post.slug}`;
    if (canonicalTag) {
      canonicalTag.setAttribute('href', postUrl);
    } else {
      canonicalTag = document.createElement('link');
      (canonicalTag as HTMLLinkElement).rel = 'canonical';
      canonicalTag.setAttribute('href', postUrl);
      document.head.appendChild(canonicalTag);
    }

    // Inject BlogPosting JSON-LD for AI Search & Answer Engines (AEO/GEO)
    const scriptId = 'jsonld-blog-posting';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    scriptEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "url": postUrl,
      "author": {
        "@type": "Person",
        "name": author.name
      },
      "publisher": {
        "@type": "Person",
        "name": author.name
      },
      "timeRequired": `PT${post.readTimeMinutes}M`
    });

    return () => {
      document.title = originalTitle;
      if (metaDescTag && originalDesc) {
        metaDescTag.setAttribute('content', originalDesc);
      }
      if (canonicalTag && originalCanonical) {
        canonicalTag.setAttribute('href', originalCanonical);
      }
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [post, author]);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find previous and next articles
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen pb-20 animate-fade-in relative">
      
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-current/10 z-50">
        <div 
          className="h-full bg-current transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Article Reader Area */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12">
        
        {/* Back Navigation Button */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <button
            id="article-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono-reader opacity-70 hover:opacity-100 hover:underline transition-all group py-2 min-h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to essays</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 text-[10px] font-mono-reader opacity-70 hover:opacity-100 transition-all border border-current/10 px-3 py-1.5 rounded-full bg-current/5"
            title="Copy permalink"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
                <span>Permalink</span>
              </>
            )}
          </button>
        </div>

        {/* Post Header */}
        <header className="mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-current/10 space-y-3 sm:space-y-4">
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs font-mono-reader px-2.5 py-1 rounded bg-current/5 border border-current/10 opacity-80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-hn-reader font-bold tracking-tight leading-tight break-words">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg opacity-80 leading-relaxed font-hn-reader">
              {post.excerpt}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs font-mono-reader opacity-60 pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTimeMinutes} min read
            </span>
          </div>
        </header>

        {/* Article Body */}
        <article className="markdown-body font-hn-reader">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>

        {/* Author Note / Signoff */}
        <div className="mt-16 pt-8 border-t border-current/10 flex items-start gap-4 text-sm opacity-90 font-hn-reader">
          {author.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-11 h-11 rounded-full object-cover border border-current/20 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-current/10 flex items-center justify-center font-bold text-lg shrink-0 border border-current/20">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-base">{author.name}</p>
            <p className="opacity-70 text-xs mt-0.5">{author.tagline}</p>
            <p className="opacity-60 text-xs mt-2">
              Thank you for reading. If you enjoyed this essay, feel free to explore others or connect.
            </p>
          </div>
        </div>

        {/* Related Essays (pSEO & Interlinking) */}
        {allPosts.length > 1 && (
          <div className="mt-16 pt-10 border-t border-current/10 space-y-6">
            <h3 className="text-[10px] font-mono-reader uppercase tracking-widest opacity-40">Related Essays</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {allPosts
                .filter(p => p.id !== post.id)
                .slice(0, 4)
                .map(related => (
                  <button
                    key={related.id}
                    onClick={() => {
                      onSelectPost(related);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-left group space-y-2 block"
                  >
                    <p className="text-[10px] font-mono-reader opacity-40 group-hover:opacity-60 transition-opacity">
                      {formatDate(related.date)}
                    </p>
                    <h4 className="text-sm font-hn-reader font-bold group-hover:underline leading-snug">
                      {related.title}
                    </h4>
                    <p className="text-xs font-hn-reader opacity-60 line-clamp-2 leading-relaxed italic">
                      {related.excerpt}
                    </p>
                  </button>
                ))
              }
            </div>
          </div>
        )}

        {/* Prev / Next Navigation */}
        <div className="mt-12 pt-6 border-t border-current/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <button
              id={`prev-post-btn-${prevPost.id}`}
              onClick={() => onSelectPost(prevPost)}
              className="p-4 rounded-lg border border-current/10 hover:border-current/30 text-left transition-all group bg-current/5"
            >
              <span className="text-[10px] font-mono-reader uppercase tracking-wider opacity-50 block mb-1">
                ← Previous Essay
              </span>
              <span className="font-hn-reader font-bold text-sm group-hover:underline line-clamp-1 block">
                {prevPost.title}
              </span>
            </button>
          ) : <div />}

          {nextPost && (
            <button
              id={`next-post-btn-${nextPost.id}`}
              onClick={() => onSelectPost(nextPost)}
              className="p-4 rounded-lg border border-current/10 hover:border-current/30 text-right transition-all group sm:col-start-2 bg-current/5"
            >
              <span className="text-[10px] font-mono-reader uppercase tracking-wider opacity-50 block mb-1">
                Next Essay →
              </span>
              <span className="font-hn-reader font-bold text-sm group-hover:underline line-clamp-1 block">
                {nextPost.title}
              </span>
            </button>
          )}
        </div>

      </main>
    </div>
  );
};
