/**
 * 文章型別與 Content Collection 轉換
 * 列表來自 src/content/blog/*.md
 */
import type { CollectionEntry } from 'astro:content';
import { withBase } from '../utils/url';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  imageSrc?: string;
  imageAlt?: string;
  content?: string;
  tags?: string[];
}

const EXCERPT_MAX_LENGTH = 100;

function truncateExcerpt(text: string): string {
  if (text.length <= EXCERPT_MAX_LENGTH) return text;
  return text.slice(0, EXCERPT_MAX_LENGTH) + '…';
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

/** 將 Content Collection 的 entry 轉成 Post（列表與內頁共用） */
export function entryToPost(entry: CollectionEntry<'blog'>): Post {
  const { data } = entry;
  return {
    slug: withBase(`blog/${entry.slug}`),
    title: data.title,
    excerpt: truncateExcerpt(data.description),
    date: formatDate(data.pubDate),
    imageSrc: data.image ? withBase(data.image.replace(/^\//, '')) : undefined,
    imageAlt: data.imageAlt,
    tags: data.tags,
  };
}

/** 供內頁 time[datetime] 使用的 ISO 日期字串 */
export function toISODateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** 將多個 entry 轉成 Post 陣列並依日期新到舊排序 */
export function entriesToPosts(entries: CollectionEntry<'blog'>[]): Post[] {
  return entries
    .map(entryToPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** 只取已發布文章（排除 draft: true）的 filter，給 getCollection 使用 */
export const publishedFilter = ({ data }: { data: { draft?: boolean } }) => data.draft !== true;

const DEFAULT_PER_PAGE = 9;

/** 分頁用：依頁碼取得該頁文章與上一頁/下一頁 URL */
export function getPagination(
  posts: Post[],
  currentPage: number,
  basePath = withBase('blog'),
  perPage = DEFAULT_PER_PAGE
) {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const page = Math.max(1, Math.min(currentPage, totalPages));
  const start = (page - 1) * perPage;
  const postsForPage = posts.slice(start, start + perPage);
  const prevUrl = page > 1 ? (page === 2 ? basePath : `${basePath}/page/${page - 1}`) : null;
  const nextUrl = page < totalPages ? `${basePath}/page/${page + 1}` : null;
  return { postsForPage, currentPage: page, totalPages, prevUrl, nextUrl };
}

/** 依年份分組（年份由大到小） */
export function getPostsGroupedByYear(posts: Post[]): { year: string; posts: Post[] }[] {
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(post);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, posts]) => ({ year, posts }));
}
