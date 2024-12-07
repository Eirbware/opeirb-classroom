+++
title = "Progression"
description = """Comment le système de progression marche."""
weight = 9
lastmod = {{ .Date }}
emoji = "✏️"
reading_length = "40s"
draft = true

[quiz]
question = "Ma question est la suivante: où est la réponse D ?"
choices = ["Reponse1", "MonAutreReponse", "une autre réponse", "réponse D"]
answerNumber = 4
prizePictureName = "1"
+++

Côté utilisateur, la progression s'accomplie en cliquant le bouton de marquage
d'un chapitre ou bien en complétant le quiz qui lui est attaché, s'il y en a un.

## Créer un quiz

Il suffit d'ajouter dans le fichier markdown la balise HTML suivante (qui est
en réalité un component Svelte):

```md
<quiz-modal options="Reponse1:MonAutreReponse:une autre réponse encore:réponse D" answer="réponse D" prize="1">
  <h6>Ma question est la suivante: où est la réponse D ?</h6>
</quiz-modal>
```

Le paramètre `prize` est un numéro correspondant à une image `.webp` que vous
pouvez mettre en asset du cours, dans le fichier
`./content/<id-du-cours>/img/prizes/<numero>.webp` en partant de la racine du
repo.

Il faut également mettre le bouton de complétion en mode quiz pour obliger
l'utilisateur à compléter le quiz. Ceci se fait en mettant le champ `quiz` à
`true` dans le front-matter du chapitre

```toml
+++
quiz = true
+++
```
## XP Gagné

Par défaut, valider un chapitre fait gagner 150 points d'xp. Un quiz fait
rapporter en supplément :

- 5 points si la personne a fait strictement plus de 2 essais avant répondre
correctement
- 25 points si elle a eu 2 essais
- 50 si elle a répondu du premier coup

> [!WARNING]
> Tant qu'un chapitre n'a pas été certifié par un administrateur du serveur
> d'Opeirb-Classroom, un chapitre ne rapportera qu'**1 point** d'xp.
> Ceci permet de favoriser l'xp gagné dans des chapitres qui seront réellement
> publiés par les administrateurs.
