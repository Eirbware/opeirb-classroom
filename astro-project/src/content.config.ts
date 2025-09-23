import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const baseObject = {
  title: z.string(),
  description: z.string(),
  weight: z.optional(z.number()),
  draft: z.boolean().optional().default(false),
  vimeo: z.optional(z.string()),
  youtube: z.optional(z.string()),
};

const contributors = defineCollection({
  loader: glob({ pattern: "[^_]*.md", base: './src/content/contributors' }),
  schema: ({ image }) => z.object({
    ...baseObject,
    authorname: z.optional(z.string()),
    date: z.date(),
    logo: image(),
    links: z.optional(z.record(z.string())),
  })
});

const tags = defineCollection({
  loader: glob({ pattern: ["*.md", "*/index.md"], base: './src/content/tags' }),
  schema: ({ image }) => z.object({
    ...baseObject,
    logo: z.optional(image()),
    link: z.optional(z.string()),
  })
});

const courses = defineCollection({
  loader: glob({ pattern: "*/index.md", base: './src/content/courses' }),
  schema: ({ image }) => z.object({
    ...baseObject,
    cover: z.optional(image()),
    lastmod: z.date(),
    tags: z.array(z.string()),
    // same as tags, but this should reference a tag
    // with an authored page and a logo
    stack: z.array(reference("tags")),
    author: reference("contributors")
  })
});

const courseChapters = defineCollection({
  loader: glob({ pattern: ["*/(*|*/index).md", "!*/index.md"], base: './src/content/courses' }),
  schema: ({image}) => z.object({
    lastmod: z.date(),
    emoji: z.string(),
    chapter_start: z.optional(z.string()),
    reading_length: z.optional(z.string()),
    quiz: z.optional(z.object({
      question: z.string(),
      choices: z.array(z.string()),
      answerNumber: z.number(),
      prizePicture: image()
    }))
  })
});

export const collections = { contributors, tags, courses, courseChapters };
