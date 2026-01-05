# Contributing on content

The content of the website is distributed as so in the sitemap:

```sh
content/template/
├── courses
│   └── your-course
│       ├── index.mdx
│       ├── first-page.mdx
│       ├── second-page.md
│       └── my-third-page
│           ├── index.md
│           └── first-subpage.mdx
├── tips
│   └── your-tuto.mdx
└── fr
    ├── courses
    │   └── your-course
    │       ├── index.mdx       
    │       ├── first-page.mdx  
    │       ├── second-page.mdx 
    │       └── my-third-page.md
    └── tips
        └── your-tuto.mdx
```

It is written with markdown, markdoc or mdx files and mut be put in the
`./src/content/docs/` directory to be rendered by the FormaTux's generating
engine.  
However, all the source content can be divided in modular external directories
with the file structure above. We provide a command-line interface to only
render the content you want.

Assuming your specific content is in the `./content/actual/<CONTENT_DIR>`
directory, you can correctly structure it in the `./src/content/docs/`
directory with the command below which creates the relevant symlinks:

```sh
just toggle-content <CONTENT_DIR> true
```

To disable its rendering (so remove all the symlinks), just run:

```sh
just toggle-content <CONTENT_DIR> false
```

## Generate a new content module

This copy a template of course and tutorial in your directory in
`./content/actual/`:

```sh
just init-template <CONTENT_DIR>
```

## Required content

### Course

When you write a new course, you must write a `index.md{,x}` with the post
attributes in the frontmatter (markdown header), i.e. the author, the
publication date, the read time, etc. See the template for a model of
frontmatter.

### Tips

The same post attributes are also required in the frontmatter.

## Enhance your content

Once editing your course or your small tutorial, structure your pages and their
individual layout as you wish, and enjoy the fancy components provided by
Starlight.

References:

- [https://starlight.astro.build/guides/authoring-content/](Writing markdown
pages in Starlight)
- [https://starlight.astro.build/components/using-components/](Add Starlight
special components)
