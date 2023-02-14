+++
title="Traduction"
description="Traduire le plugin"
weight=20
chapter=false
+++

Vous pouvez nous aider à traduire ce plugin Peertube en créant ou modifiant des fichiers de traduction dans le dossier `languages`.

{{% notice info %}}
Pour le moment, les traductions se font directement dans le dépôt git.
Plus tard en 2023, des outils de traduction en ligne seront mis en place
(probablement [Weblate](https://weblate.org)).
Le processus de traduction en sera plus simple.
{{% /notice %}}

{{% notice tip %}}
Merci de travailler sur la branche `develop`, et de faire vos _pull request_ sur cette branche.
{{% /notice %}}

## Chaîne applicatives standard

Si la langue dans laquelle vous souhaitez traduire n'existe pas encore, créez un fichier `code.json` dans le dossier `languages`, où `code` est le code langue.
Le code langue doit être dans le même format que les codes langues de Peertube (voir la [documentation Peertube](https://github.com/Chocobozzz/PeerTube/blob/develop/support/doc/translation.md)).
Ensuite, ajoutez le fichier de langue dans le fichier `package.json`, sous la clé `translations`.

Les traductions sont sous la forme suivante dans le fichier de langue :

- les fichiers sont au [format JSON](https://www.json.org)
- les clés JSON sont le texte en anglais (voir les clés existantes dans [le fichier de traduction français](languages/fr.json), qui fait référence)
- la valeur JSON est la traduction
- NB: il n'y a pas de fichier de traduction pour l'anglais (c'est la façon de fonctionner de Peertube)

## Traduction des paramètres du plugin

Dans la page des paramètres du plugin, il y a des chaînes de texte plus compliquées.
Elles peuvent contenir du code HTML, des retours à la ligne, ...
Il est donc compliqué de les maintenir dans des fichiers JSON.

C'est pourquoi le processus de traduction est différent pour les traductions de paramètres.

Les traductions des paramètres sont définies dans des fichiers [YAML](https://fr.wikipedia.org/wiki/YAML).
Elles n'utilisent pas l'anglais comme clé, mais des clés standardisées,
comme par exemple `list_rooms_label`.

Au contraire des chaînes applicatives standard, il y a aussi un fichier de
configuration pour l'anglais.

Ces fichiers sont dans le dossier `languages/settings`.
Si le fichier de la langue qui vous intéresse n'existe pas, vous
n'avez qu'à créer un fichier nommé `code.yml` où `code` est le code
de la langue (voir plus haut).

Ensuite, vous pouvez copier les clés du fichier HTML de référence
`languages/settings/en.yml`, et traduire les chaînes de texte.

Si vous ne voulez pas traduire une chaîne, vous pouvez l'ignorer,
ou utiliser `null` ou `~` comme valeur.

{{% notice warning %}}
Il peut y avoir des chaînes «assez techniques».
Si vous n'êtes pas sûr⋅e à 100% du sens, ou de la traduction,
il vaut mieux ne pas la traduire du tout ;
ainsi la version anglaise s'affichera.
{{% /notice %}}
