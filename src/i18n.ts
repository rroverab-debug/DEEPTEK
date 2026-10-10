// Language helpers. English lives at the root (/), Arabic under /ar/.
// Components read the language from the URL, so pages and components
// only need `langOf(Astro.url)`; nothing has to be passed down as props.
import * as en from './data/site';
import * as ar from './data/site.ar';

export type Lang = 'en' | 'ar';
export const langs: Lang[] = ['en', 'ar'];

export const langOf = (url: URL): Lang => (url.pathname === '/ar' || url.pathname.startsWith('/ar/') ? 'ar' : 'en');

export const dirOf = (lang: Lang) => (lang === 'ar' ? 'rtl' : 'ltr');

/** Site content (copy, projects, services) in the given language. */
export const content = (lang: Lang) => (lang === 'ar' ? ar : en);

/** Prefix an internal path such as '/contact/' for the given language. */
export const localize = (path: string, lang: Lang) => (lang === 'ar' ? `/ar${path}` : path);

/** The same page in the other language, e.g. '/ar/work/' <-> '/work/'. */
export const switchPath = (pathname: string, to: Lang) => {
  const bare = pathname.replace(/^\/ar(?=\/|$)/, '') || '/';
  return localize(bare, to);
};

/** Pick the string for the current language from a { en, ar } pair. */
export const pick = <T>(lang: Lang, pair: { en: T; ar: T }): T => pair[lang];
