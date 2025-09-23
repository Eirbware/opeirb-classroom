+++
title = "Pages de mémo"
description = """Ajoutez une ou plusieurs cheatsheet(s) à votre tuto."""
weight = 7
lastmod = 2025-08-24T15:29:20+02:00
emoji = "🧠"
reading_length = "15s"
chapter_start = "Chapitre 3"
draft = true
+++

## Ajouter 1 page

Il suffit de créer un fichier `memo.md` ou bien un dossier `./memo` avec un
fichier `index.md` à l'intérieur et de potentielles autres ressources.

## Ajouter plusieurs pages

Il suffit de créer un dossier `./memo` avec plusieurs pages à l'intérieur pour
chaque cheatsheet et un fichier `_index.md` comme ceci:

{{< file "file" "./content/courses/example-course/memo/_index.md" >}}

```toml
+++
title = "Le titre que vous voulez pour votre index"
+++
```

On rappelle qu'une page peut être un simple fichier markdown ou bien un dossier
avec un fichier `index.md` à l'intérieur et de potentielles autres ressources.

## Accéder aux pages de mémo

Elles sont accessibles à l'aide d'un gros bouton au début de la page d'arrivée
dans le tutoriel.
