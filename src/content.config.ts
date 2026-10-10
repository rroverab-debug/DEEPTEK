// Blog articles live in src/content/blog/<lang>/<slug>.md. An article and its
// translation share the same file name, so /blog/x/ and /ar/blog/x/ pair up.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Shown in search results: aim for 140 to 160 characters.
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['websites', 'marketing', 'ai', 'it']),
    tags: z.array(z.string()).default([]),
    // Short questions and answers shown at the end and marked up for search.
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
