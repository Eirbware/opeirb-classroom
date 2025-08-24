import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const contributors = defineCollection({
  loader: glob({ pattern: "*.md", base: './src/content/contributors' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    authorname: z.optional(z.string()),
    description: z.string(),
    date: z.date(),
    logo: image(),
    links: z.optional(z.record(z.string())),
  })
});

const tags = defineCollection({
  loader: glob({ pattern: ["*.md", "*/index.md"], base: './src/content/tags' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    logo: z.optional(image()),
    link: z.optional(z.string()),
  })
});

const courses = defineCollection({
  loader: glob({ pattern: "*/_index.md", base: './src/content/courses' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    cover: z.optional(image()),
    lastmod: z.date(),
    draft: z.boolean(),
    tags: z.array(z.string()),
    // same as tags, but this should reference a tag
    // with an authored page and a logo
    stack: z.array(reference("tags")),
    author: reference("contributors")
  })
});

const courseChapters = defineCollection({
  loader: glob({ pattern: "*/*.md", base: './src/content/courses' })
});

export const collections = { contributors, tags, courses };
