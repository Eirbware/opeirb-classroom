import { sveltePreprocess } from 'svelte-preprocess';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [sveltePreprocess({
    scss: {
      prependData: `
@reference '${path.resolve('./src/styles/app.scss')}';
`
    },
    css: {
      prependData: `
@reference '${path.resolve('./src/styles/app.scss')}';
`
    },
    postcss: {
      plugins: [tailwindcss]
    },
  })],
};
