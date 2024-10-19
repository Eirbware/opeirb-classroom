+++
lastmod = 2024-07-16T17:17:05+02:00
title = "Les bases de Git"
description = "Comprenez les mécanismes fondamentaux de Git pour versionner votre code source et travailler en collaboration."
type = "courses"
tags = ["git", "github", "linux"]

author = "Eirbware"
stack = ["git", "linux", "thor", "github"]
draft = true
+++

[Git](https://git-scm.com/) est un outil incontournable dans votre parcours à
l'ENSEIRB-MATMECA. Que ce soit pour rédiger pendant plusieurs semaines un long
rapport ou bien pour développer un programme complexe sur plusieurs mois avec
des collègues, l'ingénieur que vous êtes aura très souvent besoin de
**versionner son travail**, ne serait-ce que pour le comparer avec un état
antérieur dans le temps plus convenable ou bien pour le fusionner avec celui de
quelqu'un d'autre qui l'a poursuivi en autonomie.

## 📕 Ce que ce cours va aborder

En suivant ce cours, vous serez capable de

- **traquer automatiquement l'historique d'une sélection de fichiers** au sein
d'un projet informatique
- **sauvegarder l'état instantané d'une sélection de changements** sous forme
de ***commit*** afin de composer l'historique de votre projet
- **faire diverger l'historique** de votre projet dans plusieurs chemins
différents grâce au concept de ***branches***
- **comparer plusieurs états** de votre projet pour entâmer des ***fusions***
ou bien des ***retours en arrière***
- maîtriser le système de ***dépôt local*** et de ***dépôt distant*** pour
faire évoluer votre projet depuis plusieurs machines, notamment dans le cadre
d'un **travail collaboratif**

Vous apprendrez donc à utiliser les commandes fondamentales de Git pour
accomplir tout ça. Un peu de configuration sera aussi abordée pour pouvoir
utiliser Git en tout confort sur n'importe quelle machine.

> Une digression sur le protocole SSH s'imposera aussi

## 🤓 Prérequis

On assume que vous êtes sur une machine Linux et que Git y est déjà installé.
On suppose aussi que vous avez des outils pour établir des connexions SSH et
construire des clés, i.e. que vous êtes en mesure d'exécuter les commandes
`ssh` et `ssh-keygen`.

Il sera possible de se connecter avec un dépôt distant depuis
[Thor](https://thor.enseirb-matmeca.fr/) ou [Github](https://github.com/). Si
vous voulez tenter avec Github, la création d'un compte sera nécessaire.

Pour suivre le cours avec l'exemple utilisé, [Python](https://www.python.org/)
et un navigateur seront nécessaires sur votre machine.

## 🚀 Comment on se lance ?

*Il était une école qui avait tout gagné et dans laquelle Alice 👩 et vous
souhaitez mettre en place une application 📱 pour enregistrer des commandes de
pizzas 🍕. Pour le moment, vous vous contentez de vous attaquer aux fondations
🏗️ de votre programme. Mais, rien que dans cette première étape, vous allez
devoir proprement versionner votre travail si vous ne voulez pas que votre
collaboration avec Alice ne sombre dans le chaos...*
