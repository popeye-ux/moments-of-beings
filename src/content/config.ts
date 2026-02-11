import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    /** 標籤，選填 */
    tags: z.array(z.string()).optional(),
    /** 是否為草稿（true = 不發布，不出現在列表與內頁） */
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog,
};
