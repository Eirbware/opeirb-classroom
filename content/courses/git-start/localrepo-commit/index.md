+++
title = "Sauvegarde d'une version"
description = "Ajoutez une version de votre projet à son historique"
weight = 3
lastmod = 2024-08-16T17:17:05+02:00
emoji = "📸"
reading_length = "50s"
draft = true
+++

L'historique d'un projet dans un dépôt Git est une arborescence plus ou moins
complexe de ***commits***. Un commit est une entité contenant les informations
suivantes :

- son **auteur**
- son **message de description**
- son **identifiant** dans l'historique
- son **commit ascendant direct** dans l'historique
- ses **changements par rapport à son ancêtre**, i.e.
  - des fichiers non traqués qui ont été ajoutés
  - des modifications au sein de fichiers déjà traqués

  Il ne s'agit ni plus ni moins des changements qu'on ajoute à l'index avec
`git add`

## 🪶 Configuration de l'auteur

L'auteur d'un commit est l'utilisateur déclaré dans le dépôt depuis sa
configuration. Il se paramètre indépendamment des **commits*** avec `git config
user`.

{{< file "terminal" "shell" >}}

```sh
~/pizzeirb$ git config user.name Bob

~/pizzeirb$ git config user.email bob.eirbware@enseirb-matmeca.fr

```

<div class="box box-blue">
  Comme beaucoup d'éléments de configuration dans Git, il est possible de
  configurer vos informations d'utilisateur une seule fois pour l'ensemble des
  dépôts situés dans votre répertoire utilisateur, grâce à la <b>configuration
  globale</b>, en ajoutant l'option <code>--global</code> dans l'appel de
  <code>git config</code>.
</div>

## Création du commit

Avec l'auteur configuré, il est enfin possible de créer un commit. *Dans notre
situation*, la seule information qu'il reste à fournir est en effet le
**message de description** du commit, puisqu'on nos changements ont déjà été
indexés dans le chapitre d'avant.

<div class="box">
  Vous pourriez vous dire que le commit ancêtre à notre nouveau commit n'a pas
  encore été précisé non-plus. C'est vrai, mais à notre stade il n'y a pas
  encore besoin de le préciser car notre historique est vide. Nous verrons
  aussi dans les chapitres suivants que ce commit ancêtre est déterminé
  automatiquement par Git selon un certain mécanisme.
</div>

Pour créer le commit et rentrer son message il suffit d'entrer la commande `git
commit`.

{{< file "terminal" "shell" >}}

```sh
~/pizzeirb$ git commit
```

Git va alors ouvrir un éditeur de code dans lequel vous pouvez entrer votre
message. Une fois le fichier associé au message rempli, enregistré et fermé. Le
commit est officiellement créé !

<div class="box box-green">
  Vous pouvez également directement entrer la description de votre commit dans
  la commande `git commit` en ajoutant l'option `-m`:

  {{< file "terminal" "shell" >}}
  {{< highlight shell >}}
  ~/pizzeirb$ git commit -m "feat: pizzeirb initial commit"
  {{</ highlight >}}

</div>

## Description d'un commit

### Qu'est-ce qu'on écrit ?

L'idée est toujours de résumer sur la première ligne l'ensemble de vos
changements puis d'écrire dans les lignes suivantes les détails qui seraient
bons à prendre en compte de la part de vos collègues s'ils doivent utiliser vos
changements.

Des conventions d'écriture pour les titres des commits sont appliquées dans les
équipes de développement pour harmoniser la lecture de l'historique des projets
d'informatique. La plus utilisée est
[celle-ci](https://www.conventionalcommits.org/en/v1.0.0/) mais il en existe
des plus exotiques qui sont parfois très plaisantes à utiliser comme la
convention des [gitmojis 😃](https://gitmoji.dev/).

### Éditeur de code

L'éditeur de code ouvert par défaut pour écrire le commit est généralement
Nano. Pour utiliser votre éditeur favori, configurez le champ `core.editor` de
git. Il est conseillé de le faire au niveau global :

{{< file "terminal" "shell" >}}

```sh
# Entrez le nom que vous devez entrer pour lancer votre éditeur depuis votre
# terminal
~$ git config --global core.editor vscode
~$ git config --global core.editor codium
~$ git config --global core.editor emacs
~$ git config --global core.editor nvim
~$ git config --global core.editor vim
```
