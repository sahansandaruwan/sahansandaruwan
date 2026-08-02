import React, { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { BlogPost, ReadingTheme } from './types';
import { INITIAL_POSTS, INITIAL_AUTHOR } from './data/initialPosts';
import { autoLoadGitHubFolderPosts } from './utils/mdAutoLoader';
import { searchEssays } from './utils/search';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailView } from './components/ArticleDetailView';
import { AboutView } from './components/AboutView';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'articles' | 'about'>('articles');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<ReadingTheme>(() => {
    try {
      const saved = localStorage.getItem('minimalist_blog_theme');
      return (saved as ReadingTheme) || 'hn';
    } catch {
      return 'hn';
    }
  });

  // Dynamically loaded posts from GitHub repository /post/ folder + persistent custom posts
  const [posts] = useState<BlogPost[]>(() => {
    const filePosts = autoLoadGitHubFolderPosts();
    try {
      const saved = localStorage.getItem('minimalist_blog_posts');
      if (saved) {
        const savedPosts = JSON.parse(saved) as BlogPost[];
        const combined = [...filePosts];
        savedPosts.forEach((sp) => {
          if (!combined.some((p) => p.id === sp.id || p.slug === sp.slug)) {
            combined.push(sp);
          }
        });
        return combined.length > 0 ? combined : INITIAL_POSTS;
      }
    } catch {
      // ignore
    }
    return filePosts.length > 0 ? filePosts : INITIAL_POSTS;
  });

  // Save theme update to LocalStorage
  useEffect(() => {
    localStorage.setItem('minimalist_blog_theme', theme);
  }, [theme]);

  // Keyboard shortcuts (Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered and Ranked Posts using Intelligent Search Algorithm
  const filteredPosts = useMemo(() => {
    return searchEssays(posts, searchQuery);
  }, [posts, searchQuery]);

  // Theme wrapper class
  const themeClass = `theme-${theme}`;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClass}`}>
      
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedPost(null);
        }}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        isSearchOpen={isSearchOpen}
        theme={theme}
        setTheme={setTheme}
        blogName={INITIAL_AUTHOR.name}
        avatarUrl={INITIAL_AUTHOR.avatarUrl}
      />

      {/* Global Search Bar Drawer */}
      {isSearchOpen && (
        <div className="border-b border-current/15 bg-current/5 py-3 sm:py-4 px-4 sm:px-6 animate-fade-in sticky top-16 z-20 backdrop-blur-md">
          <div className="max-w-2xl mx-auto flex items-center gap-2 sm:gap-3">
            <Search className="w-4 h-4 opacity-60 shrink-0" />
            <input
              id="global-search-input"
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays by title, topic, or keyword..."
              className="w-full bg-transparent text-base sm:text-sm font-sans-reader focus:outline-none placeholder:opacity-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-mono-reader opacity-60 hover:opacity-100 px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 rounded opacity-60 hover:opacity-100 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      {selectedPost ? (
        /* Full Article Reader View */
        <ArticleDetailView
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          author={INITIAL_AUTHOR}
          allPosts={filteredPosts}
          onSelectPost={(post) => setSelectedPost(post)}
        />
      ) : activeTab === 'about' ? (
        /* About View */
        <AboutView author={INITIAL_AUTHOR} />
      ) : (
        /* Minimalist Essays Feed View (Paul Graham Style) */
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12 animate-fade-in space-y-6">
          
          {/* Welcome Intro Header */}
          <section className="pb-4 border-b border-current/10 flex items-baseline justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-hn-reader font-bold tracking-tight">
                Essays
              </h1>
              <p className="text-xs opacity-70 font-hn-reader mt-1">
                Writing on technology, design, and software systems.
              </p>
            </div>
            <span className="text-xs font-mono-reader opacity-50">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'essay' : 'essays'}
            </span>
          </section>

          {/* Search Active Filter Indicator */}
          {searchQuery && (
            <div className="flex items-center justify-between text-xs font-mono-reader p-2 rounded bg-current/5 border border-current/10">
              <span>
                Search results for <strong>"{searchQuery}"</strong> ({filteredPosts.length})
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="opacity-70 hover:opacity-100 underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Line by Line Essay List */}
          {filteredPosts.length === 0 ? (
            <div className="py-12 opacity-60 font-hn-reader space-y-1">
              <p className="text-sm">No essays found for "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-mono-reader underline hover:opacity-100"
              >
                Clear search query
              </button>
            </div>
          ) : (
            <div className="divide-y divide-current/5">
              {filteredPosts.map((post) => (
                <ArticleCard
                  key={post.id}
                  post={post}
                  onSelect={(p) => setSelectedPost(p)}
                />
              ))}
            </div>
          )}

        </main>
      )}

      {/* Minimalist Site Footer */}
      <footer className="mt-20 border-t border-current/10 py-8 text-xs font-mono-reader opacity-60 transition-colors">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {INITIAL_AUTHOR.name}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedPost(null);
                setActiveTab('articles');
              }}
              className="hover:underline"
            >
              Essays
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setSelectedPost(null);
                setActiveTab('about');
              }}
              className="hover:underline"
            >
              About
            </button>
            <span>•</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:underline"
            >
              Top ↑
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
