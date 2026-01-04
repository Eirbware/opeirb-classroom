// https://docs.astro.build/en/guides/content-collections/#defining-collections

import { z, defineCollection, reference } from 'astro:content';
import { i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';
import type { ImageFunction } from 'astro/content/config';

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


const optionalPostObjectSchema = (image: ImageFunction) => z.object({
  readTime: z.number().optional(),  // in minutes
  mainAuthor: reference("contributors").optional(),
  pubDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
  cardImage: image().optional(),
  cardImageAlt: z.string().optional(),
});

const postObjectSchema = (image: ImageFunction) => z.object({
  readTime: z.number(),  // in minutes
  mainAuthor: reference("contributors"),
  pubDate: z.date(),
  tags: z.array(z.string()).optional(),
  cardImage: image(),
  cardImageAlt: z.string(),
});

const courseLangingPageCollection = defineCollection({
  loader: glob({ pattern: '**/courses/*/index.{md,mdx}', base: "./src/content/docs" }),
  schema: docsSchema({ extend: ({image}) => postObjectSchema(image) }),
});

const tipsCollection = defineCollection({
  loader: glob({ pattern: '{*/,}tips/[^_]*.{md,mdx}', base: "./src/content/docs/" }),
  schema: docsSchema({ extend: ({image}) => postObjectSchema(image) }),
});

const i18n = defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema({
      extend: z.object({
        'title.index.courses': z.string().optional(),
        'title.index.tips': z.string().optional(),
        'title.catalogue.courses': z.string().optional(),
        'title.catalogue.tips': z.string().optional(),
        'description.index.courses': z.string().optional(),
        'description.index.tips': z.string().optional(),
        'description.catalogue.courses': z.string().optional(),
        'description.catalogue.tips': z.string().optional(),

        'navbar.login.button': z.string().optional(),
        'navbar.login.title': z.string().optional(),
        'navbar.login.subTitle': z.string().optional(),
        'navbar.login.registerBtn': z.string().optional(),
      }),
    }),
  });

export const collections = {
  docs: defineCollection({ schema: docsSchema({
    extend: ({image}) => optionalPostObjectSchema(image)
  }) }),
  i18n,
  'contributors': contributors,
  'courses': courseLangingPageCollection,
  'tips': tipsCollection,
};
