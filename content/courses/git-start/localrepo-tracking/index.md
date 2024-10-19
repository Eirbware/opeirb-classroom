+++
title = "Traque des fichiers"
description = "Ajoutez vos premiers fichiers pour que Git traque leurs changements."
weight = 2
lastmod = 2024-08-16T17:17:05+02:00
emoji = "➕"
reading_length = "50s"
draft = true
+++

*Alice vous a envoyé une [archive]({{% relref "." %}}pizzeirb-start.zip) 🗃️
avec le premier code pour votre site de commandes de pizzas. Téléchargez-le et
désarchivez tout dans votre nouveau dépôt.*

Supposons que vous ayiez ajouté du code dans votre dépôt pour obtenir
l'arborescence suivante:

{{< file "terminal" "shell" >}}

```sh
~/pizzeirb$ tree
.
├── Makefile
├── main.py
└── website_builder
    ├── __init__.py
    └── _builder.py
```

Git aura alors directement détecté des changements par rapport à l'état courant
du dépôt (i.e. un dépôt vide pour le moment) et vous signalera alors l'ensemble
de ces fichiers comme **non-traqués**.
Pour le savoir, la commande `git status` est d'une aide précieuse.

<div class="box box-green">
  Cette commande fournit 80% des informations dont vous avez besoin pour
  comprendre ce que vous êtes en train de faire en matières de versionnage avec
  votre code source. Pensez à l'utiliser sans modération.
</div>

Un affichage similaire sera alors rendu :

{{< file "terminal" "shell" >}}

```sh
~/pizzeirb$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	Makefile
	main.py
	website_builder/

nothing added to commit but untracked files present (use "git add" to track)
```

*Dans cette situation*, tous les fichiers ici vont être assujettis à des
changements qui doivent être sauvegardés à mesure que le projet avancera. On va
donc **traquer ces fichiers**. Pour cela, il doivent être **indexés par Git**
et leur ajout à l'index s'effectue à l'aide de la commande `git add`

## git add

Cette commande prend en argument tous les fichiers que vous souhaitez ajouter à
l'index. Vous pouvez les écrire à la chaîne et même spécifier des dossiers pour
que tous les fichiers à l'intérieur soient ajoutés.

Dans notre cas, toutes les commandes ci-dessous agiront de manière équivalente:

{{< file "terminal" "shell" >}}

```sh
# les wildcards du shell Linux sont intéressantes à utiliser
# pour ajouter de manière intelligente et pointue certains fichiers
~/pizzeirb$ git add Makefile main.py website_builder/*.py 
~/pizzeirb$ git add Makefile main.py website_builder
~/pizzeirb$ git add .
```

Après avoir exécuté l'une d'elles, vous pouvez observer le nouvel état de
l'index avec à nouveau `git status`. Tous nos fichiers y sont désormais, comme
voulu :

{{< file "terminal" "shell" >}}

```sh
~/pizzeirb$ git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   Makefile
	new file:   main.py
	new file:   website_builder/__init__.py
	new file:   website_builder/_builder.py
```

Maintenant que nos fichiers sont traquables il est temps de sauvegarder leur
première version.
