// https://docs.astro.build/en/guides/content-collections/#defining-collections

import { z, defineCollection, reference } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

const productsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/products" }),
    schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    main: z.object({
      id: z.number(),
      content: z.string(),
      imgCard: image(),
      imgMain: image(),
      imgAlt: z.string(),
    }),
    tabs: z.array(
      z.object({
        id: z.string(),
        dataTab: z.string(),
        title: z.string(),
      })
    ),
    longDescription: z.object({
      title: z.string(),
      subTitle: z.string(),
      btnTitle: z.string(),
      btnURL: z.string(),
    }),
    descriptionList: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ),
    specificationsLeft: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ),
    specificationsRight: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ).optional(),
    tableData: z.array(
      z.object({
        feature: z.array(z.string()),
        description: z.array(z.array(z.string())),
      })
    ).optional(),
    blueprints: z.object({
      first: image().optional(),
      second: image().optional(),
    }),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: ({ image }) => z.object ({
  title: z.string(),
  description: z.string(),
  contents: z.array(z.string()),
  role: z.string().optional(),
  mainAuthor: reference("contributors"),
  pubDate: z.date(),
  cardImage: image(),
  cardImageAlt: z.string(),
  readTime: z.number(),
  tags: z.array(z.string()).optional(),
  }),
});

const insightsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/insights" }),
  schema: ({ image }) => z.object ({
  title: z.string(),
  description: z.string(),
  // contents: z.array(z.string()),
  cardImage: image(),
  cardImageAlt: z.string(),
  }),
});

const contributors = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: './src/content/contributors' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    authorname: z.optional(z.string()),
    authorImage: image(),
    authorImageAlt: z.string(),
    date: z.date(),
    links: z.optional(z.record(z.string())),
  })
});

const courseLangingPageCollection = defineCollection({
  loader: glob({ pattern: '**/_course-landing.{md,mdx}', base: "./src/content/docs" }),
  schema: ({ image }) => z.object ({
  title: z.string(),
  description: z.string(),
  contents: z.array(z.string()),
  role: z.string().optional(),
  mainAuthor: reference("contributors"),
  pubDate: z.date(),
  cardImage: image(),
  cardImageAlt: z.string(),
  readTime: z.number(),
  tags: z.array(z.string()).optional(),
  }),
});

const tipsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/tips" }),
  schema: docsSchema({ extend: z.object({
    editUrl: z.union([z.string(), z.literal(false)]).optional(),
    mainAuthor: reference("contributors"),
    role: z.string().optional(),
    tags: z.array(z.string()).optional(),
    pubDate: z.date(),
    readTime: z.number(),
  }) })
})

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  'contributors': contributors,
  'courses': courseLangingPageCollection,
  'tips': tipsCollection,
  'products': productsCollection,
  'blog': blogCollection,
  'insights': insightsCollection,
};
