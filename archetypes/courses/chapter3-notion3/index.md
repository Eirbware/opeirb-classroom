+++
title = "Progression"
description = """Comment le système de progression marche."""
weight = 9
lastmod = 2024-12-11T14:31:07+01:00
emoji = "✏️"
reading_length = "40s"
draft = true

[quiz]
question = "Ma question est la suivante: où est la réponse D ?"
choices = ["Reponse1", "MonAutreReponse", "une autre réponse", "réponse D"]
answerNumber = 4
prizePictureName = "gg"
+++

Côté utilisateur, la progression s'accomplit en validant des chapitres, soit en
le marquant comme complet, soit en complétant son quiz s'il est mentionné.

## Créer un quiz

Il suffit d'ajouter dans le *front-matter* de la page markdown le paramètre
`quiz` avec le prototype comme ci-dessous :

```toml
[quiz]
question = "Ma question est la suivante: où est la réponse D ?"
choices = ["Reponse1", "MonAutreReponse", "une autre réponse", "réponse D"]
answerNumber = 4
prizePictureName = "gg"
```

Le paramètre `prizePictureName` est un nom de fichier d'une image `.webp` que
vous pouvez mettre en asset du cours, dans le fichier
`./content/<id-du-cours>/img/prizes/<prizePictureName>.webp` en partant de la
racine du repo.

Le paramètre `answerNumber` doit être un entier entre 1 et le nombre de
réponses inclus.

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
