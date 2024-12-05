+++
title = "Votre second commit"
description = "Apprenez à ne sélectionner que quelques changements pour votre second commit."
weight = 3
lastmod = 2024-08-16T17:17:05+02:00
emoji = "➕"
reading_length = "50s"
draft = true
+++

`make build` pour créer les pages du site

Le dossier `build` va pop

`make serve` pour voir le rendu de votre site sur `http://localhost:5555` sur
votre navigateur



Changez le script python `main.py` d'écriture du site et relancez `make build`.
Si vous actualisez sur votre navigateur, le contenu a été mise à jour.

Vous pouvez observer les changements par rapport à votre dernier commit avec
`git diff`. Seuls les changements sur les fichiers déjà traqués
(donc ici sur `main.py`) sont affichés.

## Ignorez des fichiers non traqués

Les fichiers dans le dossier `build` sont changés à chaque exécution du script
d'écriture du site et leurs changements ne sont par conséquent pas intéressant
à traquer dans le versionnage.

Avec `git status` vous pouvez observer qu'ils sont toujours signalés comme non
traqués et ajoutables au tracking. Faites taire ces signaux en les **ignorant**.
Ceci se fait en crééant un fichier `.gitignore` et en écrivant ça dedans

{{% file "file" "gitignore" %}}
```sh
build
```

Ainsi, tous les fichiers non-traqués dans le dossier `build/` à côté du
`.gitignore` seront ignorés par `git status` et ne pourront pas être ajoutés
par `git add`.

## Effectuer votre second commit

Modifiez le fichier `main.py` pour changer le titre, ajouter ce changement et

