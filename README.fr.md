# 🖥️ Opeirb-classroom 🎓

> Formations en ligne rédigées par les étudiants de l'ENSEIRB-MATMECA, pour les étudiants.

Ce site a pour but d'héberger plusieurs formats de publications en ligne pour
aider les étudiants à maîtriser des outils de développement informatique.

Il a été démarré à partir d'un fork du site open-source [_`fireship.io`_](https://github.com/fireship-io/fireship.io) (l'historique du fork est
consultable sur [ce
dépôt](https://github.com/Convolutio/opeirb-classroom.git)).

## Tour du site

Les types suivants de formation sont proposés:

- ***Tutoriel standard*** (section `/courses`): ensemble de chapitres pour aborder avec
une certaine ligne éditoriale un sujet dense.
- ***Tutoriel ponctuel*** (section `/tips`): une page pour traiter rapidement
  d'un sujet plus épisodique.
- ***Défis*** (section `/challenges`): une page avec un problème pour
  apprendre avec encore plus de pratique. (*à développer*)

## Contribuer

Pour modifier ou ajouter du contenu, il suffit d'éditer des fichiers Markdown
dans le dossier `./content`. Pour chaque type de contenu (`courses`, `tips`,
...) un dossier d'archétype avec de nombreux éléments par défaut dans ses
fichiers markdown peut être facilement généré grâce aux commandes Hugo
ci-dessous. 

```sh
# in the repository's root
hugo new content ./content/<the-section-you-want>/<title-of-your-post>
```

Par exemple, une arborescence complète de fichiers dans un nouveau dossier dans
`./content` peut être créé avec la commande ci-dessous:

```sh
# in the repository's root
hugo new content ./content/courses/<title-of-the-tutorial>
```

Selon le chemin de chaque fichier markdown, le bon layout est déduit et ainsi
chacun peut publier du contenu d'un certain type en se basant sur une structure
commune.

Pour obtenir toutes les fonctionnalités de layout que la syntaxe Markdown
offre, n'hésitez pas à lire la documentation située dans le cours généré par
défaut avec la commande au-dessus. Ces pages peuvent aussi être utiles:
[Built-in front-matter fields](https://gohugo.io/content-management/front-matter/#fields),
[Built-in shortcodes](https://gohugo.io/content-management/shortcodes/#embedded-shortcodes)

Vous pourriez aussi vouloir lire [cette
page](https://gohugo.io/content-management/organization/) pour en savoir plus
sur la manière d'organiser les fichiers markdown dans le dossier `./content`.

## Rendu du site

### Installation des dépendances

Vous avez besoin des dépendances suivantes:

- [Hugo en version Étendue](https://gohugo.io/getting-started/installing/) >= `0.129.0`
- NodeJS >= `24.4.1`

Ensuite, à la racine de ce dépôt cloné, exécutez la commande suivante :

```bash
npm install
```

Une installation rapide et isolée de tout l'environnement peut être accomplie
avec `conda` et `just`:

```sh
just conda-full-install
# ensuite, exécuter
# $ conda activate ./.opeirbclass-env/
# avant de travailler dans votre shell
```

Pour tout enlever de manière pure

```sh
just conda-full-clean
```

#### Connexion avec un backend de développement

En précisant les données qui suivent dans le fichier `app/.env.local`, les
fonctionnalités applicatives seront disponibles.

```.env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### Compilation pour la production

Le layout utilise des components Svelte définis dans le dossier `app`, et ces
components utilisent des feuilles de style `.scss` définis dans le dossier
`style`. Ensuite, les fichiers dans ces deux dossiers sont compilés avec
l'outil Vite grâce à la commande ci-dessous.

```bash
npm run vbuild
```

Enfin, le contenu markdown peut être rendu et déployé depuis le dossier
`public` en exécutant cette commande

```bash
hugo
```

Ces deux commandes sont rassemblées dans cette **commande complète de
compilation**.

```bash
npm run build
```

### Rendu du site pendant le développement

#### Édition du contenu uniquement

Tout d'abord, les components Svelte doivent être compilés dans le dossier
`static` en exécutant cette commande Vite.

```bash
npm run vbuild
```

Ensuite, le site peut être rendu en temps réel en surveillant les fichiers de
contenu grâce au serveur de développement d'Hugo :

```bash
npm run hugo
```

Si vous souhaitez que les pages de brouillon soient rendues, alors exécutez

```bash
npm run hugo-dev
```

Vous pouvez alors accéder au site avec le lien `http://localhost:6969/`.

#### Édition des components ou du layout

Le layout comme le site Hugo peuvent être compilés en concurrence grâce à des
watchers aussi bien sur le contenu Markdown que sur la couche de layout et
d'application. Pour faire cela

```bash
npm run start
```

Pour faire cela avec les pages de brouillon de rendues, exécutez

```bash
npm run dev
```

Le rendu est alors consultable sur le lien `http://localhost:6969/`.

## Développer des components

Il suffit de créer un fichier Svelte dans le dossier `app/components` avec un tag
personnalisé.

```svelte
<svelte:options customElement="hi-mom" />

<script>
  export let greeting: string;
</script>

<h1>Hi Mom! {greeting}</h1>
```

Le component peut ensuite être exporté à partir du fichier central
`app/main.ts` :

```ts
export * from "./components/hi-mom.svelte";
```

Enfin, il est utilisable n'importe dans les templates HTML ou dans le contenu
Markdown

```html
<hi-mom greeting="i made a web component"></hi-mom>
```

**Attention:** Les web-components Svelte n'appliquent que du style encapsulé.
Il est donc possible d'utiliser Tailwind, mais uniquement avec la règle
`@apply` et aucun style global ne peut être utlisé.

- `npm run svelte-dev`: Exécute des components en isolation et sert uniquement
le fichier `app/index.html` pour tester les components.
- `npm run check`: Vérifie la syntaxe et le typage de _typescript_ et de
_svelte_ (les vérification du scss ont été retirées à cause du trop grand
nombre de fausses alertes de type `unknownAtRules`).
- `npm run test`: Exécute Vitest pour mener des tests dans tous les fichiers
`.test.ts`. À exploiter sans modération.
