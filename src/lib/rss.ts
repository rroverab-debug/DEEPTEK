// Builds an RSS feed for one language, so readers and aggregators can follow the blog.
import type { Lang } from '../i18n';
import { categories, getPosts, postPath } from './blog';
import { content } from '../i18n';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function rss(lang: Lang, base: URL) {
  const { site } = content(lang);
  const posts = await getPosts(lang);
  const home = new URL(lang === 'ar' ? '/ar/blog/' : '/blog/', base).href;
  const items = posts
    .map((p) => {
      const link = new URL(postPath(p), base).href;
      return `<item><title>${esc(p.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><category>${esc(categories[p.data.category][lang])}</category><description>${esc(p.data.description)}</description></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(lang === 'ar' ? `مدونة ${site.name}` : `${site.name} Blog`)}</title><link>${home}</link><atom:link href="${home}rss.xml" rel="self" type="application/rss+xml"/><description>${esc(site.description)}</description><language>${lang === 'ar' ? 'ar-AE' : 'en-AE'}</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
