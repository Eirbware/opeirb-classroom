+++
title = "Création du dépôt"
description = "Initialisez un dépôt dans lequel mettre vos fichiers à traquer"
weight = 1
lastmod = 2024-08-16T17:17:05+02:00
emoji = "📂"
chapter_start = "Le dépôt local"
reading_length = "30s"
draft = true
+++

## Un dépôt ?

Tout projet informatique se caractérise par une **arborescence de *fichiers
source*** située dans un **dossier**. Git est capable de traiter ce dossier en
tant que ***dépôt*** (en anglais ***repository***) pour comparer l'état de
chacun de ses fichiers avec des sauvegardes précédentes dans le temps.

<div class="box">
  On verra qu'un dépôt peut être le <b><i>clone</i></b> d'un autre dépôt distant,
  i.e. que plusieurs dossiers (la plupart du temps sur des machines
  différentes) peuvent être liés pour synchroniser leur contenu et leur
  historique.
</div>

Pour démarrer notre projet, on va transformer un dossier vide en dépôt grace à
la commande `git init`.

{{< file "terminal" "shell" >}}

```sh
~$ mkdir pizzeirb
~$ cd pizzeirb
~$ git init
```

Et voilà ! Git a à présent tout ce qu'il faut pour travailler dans votre
nouveau dépôt. Vous pouvez le vérifier en observant la présence d'un dossier
`.git` au sein de votre dossier `pizzeirb`.

{{< file "terminal" "shell" >}}

```sh
~/pizzeirb$ ls -a
# . .. .git
```
