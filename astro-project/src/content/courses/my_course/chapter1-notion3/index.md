+++
title = "Tags"
description = "Comment gérer les tags pour le référencement."
weight = 4
lastmod = 2025-08-24T15:29:20+02:00
emoji = "🏷️"
reading_length = "40s"
draft = true
+++
Dans le fichier `_index.md` il est conseillé de préciser les paramètres `tags`
pour le référencement par l'outil de recherche. Les Tags sont aussi présents et
automatiquement indexés dans la section `/tags/` du site généré.

Ils sont affichés avec une couleur par défaut, ou bien une qui doit être
précisée dans le fichier `/styles/tags.scss` depuis la racine du dépôt, avec la
classe CSS `tag-<nom-du-tag>`.

Toutes les pages avec un certain tag sont automatiquement indexées depuis
la section `/tags/<nom-du-tag>/`. Il est possible d'ajouter une description
personnalisée à un tag en écrivant dans le fichier markdown
`/content/tags/<nom-du-tag>/_index.md`. Les champs du *front-matter* sont les
suivants:

{{< file "file" "./content/tags/my-tag/_index.md" >}}

```md
+++
title = "Mon tag personnalisé"
description = """
Cette page rassemble les tutos et posts autour d'un certain thème. Il s'agit de
Lectus eleifend est, ultricies eu odio, porta dui et sed.
"""
link = "https://fr.lipsum.com/"
+++
```
