// Helpers for the blog: posts per language, labels and reading time.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Post = CollectionEntry<'blog'>;
export type Category = Post['data']['category'];

export const categories: Record<Category, { en: string; ar: string }> = {
  websites: { en: 'Websites', ar: 'المواقع' },
  marketing: { en: 'Marketing & SEO', ar: 'التسويق وتحسين البحث' },
  ai: { en: 'AI automation', ar: 'الأتمتة بالذكاء الاصطناعي' },
  it: { en: 'IT', ar: 'تقنية المعلومات' },
};

/** File name without the language folder, shared by an article and its translation. */
export const slugOf = (post: Post) => post.id.split('/').pop()!;

export const langOfPost = (post: Post): Lang => (post.id.startsWith('ar/') ? 'ar' : 'en');

export async function getPosts(lang: Lang) {
  const all = await getCollection('blog', (p) => langOfPost(p) === lang && !p.data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function readingMinutes(post: Post) {
  const words = (post.body ?? '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const formatDate = (date: Date, lang: Lang) =>
  date.toLocaleDateString(lang === 'ar' ? 'ar-AE-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const postPath = (post: Post) => `${langOfPost(post) === 'ar' ? '/ar' : ''}/blog/${slugOf(post)}/`;
