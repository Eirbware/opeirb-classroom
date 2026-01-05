# FormaTux (ScrewFast-based version)

This project started from the [ScrewFast
template](https://github.com/mearashadowfax/ScrewFast). It is powered by [Astro
Starlight](https://starlight.astro.build/) (see also
[Astro](https://docs.astro.build/)), [Tailwind
CSS](https://tailwindcss.com/docs) and
[Svelte](https://svelte.dev/docs/svelte/overview).

Please read the documentation pages for details about :

- [contributing on FormaTux's content]("./CONTRIBUTING.md")
- [contributing on FormaTux's engine]("./DEV.md")

## Install

Works for NodeJS >= 24.4.1. Also requires `justfile` and GNU `stow`.

```sh
# install both deps and dev deps
npm install
```

## Monitor performances

**Requirements:** ensure the dev dependencies are installed and Chromium is
available on your system (in Ubuntu, install the `chromium-browser` apt
package).

1. Build the site

   ```sh
   npm run build
   ```

2. Preview it in one process

   ```sh
   npm run preview
   ```

3. Monitor with lighthouse :

   ```sh
   npm run monitor
   ```

Once lighthouse had ended, you can stop the preview in the other process. The
result is in an html file at the root of the repository
(`localhost_*.report.html`).

> Do not trust the performance score if your serving environment and chromium
> browser have limited performances (e.g. it will be lower in a small personal
> laptop than in production)  
> The starter template has a score greater than `96%` in production (see
> [https://screwfast.uk](https://screwfast.uk) on [Page Speed
> Insights](https://pagespeed.web.dev/))
