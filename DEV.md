# Develop on FormaTux's engine

## Code structure

This description of the code structure also explains how Astro Starlight has
been customized to fit with the need of a reactive website with docs content
organized as posts.

```sh
content/                      # The content in src/content/docs (symlinked with
                              #   stow)
src/
├── app                       # JS for the interactivity (lib + svelte runes)
├── assets                    
│   ├── scripts               # static browser js
│   └── styles                # tailwindcss style sheets (global or layout-wide)
├── components                # astro components + svelte components
│   ├── overrides             # overriding parts of the starlight layout
│   ├── sections              # additional components
│   └── ui                    # additional components
├── content                   # md and json content in all the languages
│   ├── contributors          # md pages to declare the contributor collection
│   ├── docs                  # default content md pages supported by starlight
│   └── i18n                  # texts of the custom ui in all supported languages
├── content.config.ts         # definition of the content collections
├── images                    # global images
│   ├── starlight             # global images for the starlight ui
│   └── ...                   
├── layouts                   # Custom layouts for some pages
├── pages                     # definition of the sitemap and the layouts for
│   │                         #   each route coming in addition the starlight's
│   ├── 404.astro             # fallback page for not found routes
│   ├── [...lang]             # custom routes in each language
│   └── ...                   
├── routeData.ts              # starlight middleware to customize route
│                             #   relationships for pages generated from
│                             #   "content/docs/**/*.md"
└── utils                     
    ├── filter_language.ts    
    ├── indexing.ts           
    ├── navigation.ts         
    ├── starlight-sidebar.ts  
    ├── ui.ts                 
    └── utils.ts              
astro.config.mjs              # The astro config entrypoint
tests/                        # The tests of the utils functions and
                              #   interactivity JS
```

## References

- [ScrewFast README](https://github.com/mearashadowfax/ScrewFast)
- [Astro Starlight documentation](https://starlight.astro.build/) *(most
important pages)*
- [Astro documentation](https://docs.astro.build/) *(most
important pages)*
- ~~[Preline UI Documentation](https://preline.co/docs)~~ *(will be soon
removed)*
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [html-minifier-terser Documentation](https://github.com/terser/html-minifier-terser)
- [Svelte documentation](https://svelte.dev/docs/svelte/overview)
- [Svelte Integration in Astro](https://docs.astro.build/en/guides/integrations-guide/svelte/)
- ~~[Vercel Documentation](https://vercel.com/docs)~~ *(may not be used)*
