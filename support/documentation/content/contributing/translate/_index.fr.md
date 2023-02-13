+++
title="Traduction"
description="Traduire le plugin"
weight=20
chapter=false
+++

Vous pouvez nous aider à traduire ce plugin Peertube en créant ou modifiant des fichiers de traduction dans le dossier `languages`.

Merci de travailler sur la branche `develop`, et de faire vos _pull request_ sur cette branche.

Si la langue dans laquelle vous souhaitez traduire n'existe pas encore, créez un fichier `code.json` dans le dossier `languages`, où `code` est le code langue.
Le code langue doit être dans le même format que les codes langues de Peertube (voir la [documentation Peertube](https://github.com/Chocobozzz/PeerTube/blob/develop/support/doc/translation.md)).
Ensuite, ajoutez le fichier de langue dans le fichier `package.json`, sous la clé `translations`.

Les traductions sont sous la forme suivante dans le fichier de langue :

- les fichiers sont au [format JSON](https://www.json.org)
- les clés JSON sont le texte en anglais (voir les clés existantes dans [le fichier de traduction français](languages/fr.json), qui fait référence)
- la valeur JSON est la traduction
- NB: il n'y a pas de fichier de traduction pour l'anglais (c'est la façon de fonctionner de Peertube)
