# FormaTux (ScrewFast-based version)

This project is powered by the [ScrewFast template](https://github.com/mearashadowfax/ScrewFast).

See the following documentation pages for all information about the base
framework of this repository:

- [ScrewFast README](https://github.com/mearashadowfax/ScrewFast) *(the most
important page)*
- [Astro Starlight documentation](https://starlight.astro.build/)
- [Astro documentation](https://docs.astro.build/)
- [Preline UI Documentation](https://preline.co/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [html-minifier-terser Documentation](https://github.com/terser/html-minifier-terser)

## Install

Works for NodeJS >= 24.4.1

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
