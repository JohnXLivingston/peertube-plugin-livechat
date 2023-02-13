+++
title="Documenter"
description="Documenter le plugin, ou traduire la documentation."
weight=50
chapter=false
+++

## Généralités

Toujours vous annoncer avant de commencer à travailler (en créant un ticket ou
en commentant un ticket existant). Ceci afin d'éviter que plusieurs personnes
travaillent sur la même chose et entrent en conflit.

Merci d'utiliser la branche `develop`.
La branche `main` est réservée aux versions publiées, pour que la documentation
affichée reste synchronisée avec la version publiée du plugin.

Le code source de la documentation se trouve dans le dossier
`support/documentation/content` du dépot de code.

La documentation est générée via l'outils [Hugo](https://gohugo.io/).
Celui-ci doit être installé sur votre machine pour pouvoir prévisualiser la
documentation.

Le thème utilisé est [hugo-theme-learn](https://learn.netlify.app/).
Il est recommandé d'en lire la documentation avant de commencer.

## Traductions

La langue principale est l'anglais (code `en`).

Les différentes traductions d'un même fichier sont côte-à-côte dans
l'arborescence, et sont identifiées par un code langue dans l'extension du
nom de fichier. Exemple: `_index.fr.md` est la tranduction française de
`_index.en.md`.

Attention, un fichier de traduction manquant n'apparaitra pas dans les menus
du site générés.
**On veillera donc toujours à créer les fichiers pour toutes les langues**, même
si la traduction n'est pas encore disponible.

Pour cela, il y a un script `doc-generate-missing-translations.sh` à la racine
du dépot. Quand on ajoute un nouveau fichier, il suffit de créer la version
anglaise, puis de lancer ce script. Il va créer toutes les traductions
manquantes, on y mettant un message type invitant l'utilisateur⋅rice à lire la
version anglaise.

## Prévisualiser

Pour prévisualiser vos modification, il suffit de lancer:

```bash
hugo serve -s support/documentation/
```

Puis d'ouvrir votre navigateur à l'adresse
[http://localhost:1313/peertube-plugin-livechat/](http://localhost:1313/peertube-plugin-livechat/).
Cette page se raffraichira automatiquement à chaque modification.

## Publication

La publication de la documentation est automatique, dès que les modifications
sont fusionnées dans la branche `main`.
