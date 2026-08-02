export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string; // ISO date string (YYYY-MM-DD)
  readTimeMinutes: number;
  tags: string[];
  isDraft?: boolean;
  featured?: boolean;
}

export type ReadingTheme = 'light' | 'sepia' | 'hn' | 'dark' | 'midnight';
export type ReaderFontFamily = 'hn' | 'serif' | 'sans' | 'mono';
export type ReaderFontSize = 'sm' | 'md' | 'lg' | 'xl';
export type ReaderLineHeight = 'compact' | 'normal' | 'relaxed';

export interface ReaderSettings {
  theme: ReadingTheme;
  fontFamily: ReaderFontFamily;
  fontSize: ReaderFontSize;
  lineHeight: ReaderLineHeight;
  showReadingProgress: boolean;
  focusMode: boolean;
}

export interface AuthorProfile {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  github?: string;
  linkedin?: string;
  location?: string;
  avatarUrl?: string;
}
