# 🖥️ Opeirb-classroom 🎓

- 🇫🇷 French version [here](./README.fr.md)

> E-learning platform by the ENSEIRB-MATMECA's students, for the students.

This website aims to host several formats of online teaching posts about
computer science dev tools.

It has been started from a fork of the open-source [_`fireship.io`_
website](https://github.com/fireship-io/fireship.io) (history of the fork in
[this repo](https://github.com/Convolutio/opeirb-classroom.git)).

## Website overview

The following kinds of courses are available:

- ***Standard courses*** (`/courses` section): a range of chapters to deal with
a dense topic, following a given pedagogic arc.
- ***Ad hoc tutorials*** (`/tips` section): one page to quickly deal with a
punctual topic.
- ***Challenges*** (`/challenges` section): one page with a problem, in order to
learn with a more practice. (*not developed yet*)

## Contribute

To edit or add new content, all that users have to do is writing in Markdown
files in the `./content` folder. For each kind of content (`courses`, `tips`,
...), an archetype folder with many useful placeholders in its markdown files
can be generated thanks to the handy Hugo command below:

```sh
# in the repository's root
hugo new content ./content/<the-section-you-want>/<title-of-your-post>
```

For instance, an entire file tree in a new directory in the `./content` one can
be created with the command below:

```sh
# in the repository's root
hugo new content ./content/courses/<title-of-the-tutorial>
```

According to the path of each markdown page, the good layout is inferred and
then everyone can make content of a given kind from a same structure.

To get all the layout features that the Markdown syntax can enable, writers
might also want to read the placeholders of the course that the command above
generates and also check those doc pages :
[Built-in front-matter fields](https://gohugo.io/content-management/front-matter/#fields),
[Built-in shortcodes](https://gohugo.io/content-management/shortcodes/#embedded-shortcodes)

They might also need to read [this
page](https://gohugo.io/content-management/organization/) to know more about
how to correctly organize markdown files in the `./content` directory.

## Render the website

### Install dependencies

First, install [Hugo Extended](https://gohugo.io/getting-started/installing/)
ver `0.129.0` or greater.

Then, in the cloned repository's root, run the following command:

```bash
npm install
```

#### Connect with a backend

By writing the following credentials in the `app/.env.local` file, the application
features will be functional with the main backend :

```.env
VITE_POCKETBASE_URL=https://admin.forma.eirb.fr
```

But we recommend to setup your own pocketbase server for a playground usage.
See the [documentation page](./backend/README.md) to initiate a backend.

```.env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### Build for production

The layout uses Svelte components defined in the `app` directory, and these
components use `.scss` sheets in the `style` directory. Then, the files in both
theses folders must be built by the Vite framework with the command below

```bash
npm run vbuild
```

Then, the markdown content can be rendered in the deployable site in the
`public` directory by running this command

```bash
hugo
```

Both the commands above are bundled in the **production building command** below

```bash
npm run build
```

### Development rendering

#### Edit content only

First, build once the Svelte components in the `static` directory by running the
vite building command:

```bash
npm run vbuild
```

Then the website can be rendered with watching over the content by running the
Hugo dev server:

```bash
npm run hugo
```

If you want your draft pages to be rendered, then run

```bash
npm run hugo-dev
```

Check it on `http://localhost:6969/`.

#### Edit components and layout

Both the layout and the Hugo website can be concurrently built with watching
engines for development over as well the Markdown content as the
layout/application layer. To do that

```bash
npm run start
```

To do that with the draft pages rendered by Hugo, run

```bash
npm run dev
```

Check it on on `http://localhost:6969/`.

## Developing Components

Create a Svelte file in the `app/components` directory. It must have a custom
element tag.

```svelte
<svelte:options customElement="hi-mom" />

<script>
  export let greeting: string;
</script>

<h1>Hi Mom! {greeting}</h1>
```

Export the component from `app/main.ts`:

```ts
export * from "./components/hi-mom.svelte";
```

Now use it in anywhere in your HTML or Markdown.

```html
<hi-mom greeting="i made a web component"></hi-mom>
```

**Note:** A weird caveat with Svelte web components is that all styles must be
encapsulated. You can use Tailwind, BUT only with `@apply` in the component.
Global styles will not work.

- `npm run svelte-dev`: Runs components in isolation. Serves `app/index.html`
as a playground for components.
- `npm run check`: Checks _typescript_ and _svelte_ syntax (scss checks have
been removed in cause of the non-removable and polluting `unknownAtRules`
warnings.
- `npm run test`: Runs Vitest for running tests over all `.test.ts` modules.
Feel free to use it without moderation.
