# Bienvenu sur le guide de contribution pour le plugin peertube-plugin-livechat

Intéressé⋅e pour contribuer ? Super !

## Code de conduite

Merci de lire le [code de conduite](CODE_OF_CONDUCT.fr.md) (ou la version [anglaise](CODE_OF_CONDUCT.md)).

## Traduction

Vous pouvez nous aider à traduire ce plugin Peertube en créant ou modifiant des fichiers de traduction dans le dossier `languages`.

Merci de travailler sur la branche `develop`, et de faire vos _pull request_ sur cette branche.

Si la langue dans laquelle vous souhaitez traduire n'existe pas encore, créez un fichier `code.json` dans le dossier `languages`, où `code` est le code langue.
Le code langue doit être dans le même format que les codes langues de Peertube (voir la [documentation Peertube](https://github.com/Chocobozzz/PeerTube/blob/develop/support/doc/translation.md)).
Ensuite, ajoutez le fichier de langue dans le fichier [package.json](package.json), sous la clé `translations`.

Les traductions sont sous la forme suivante dans le fichier de langue :

- les fichiers sont au [format JSON](https://www.json.org)
- les clés JSON sont le texte en anglais (voir les clés existantes dans [le fichier de traduction français](languages/fr.json), qui fait référence)
- la valeur JSON est la traduction
- NB: il n'y a pas de fichier de traduction pour l'anglais (c'est la façon de fonctionner de Peertube)

## Donnez vos retours

Vous n'avez pas besoin de coder pour commencer à contribuer à ce plugin !
Les autres formes de contributions sont également précieuses, parmis lesquelles : vous pouvez tester le plugin et remonter les bugs que vous rencontrez, partager vos retours d'expérience, proposer des fonctionnalités qui vous intéressent, remonter vos remarques sur l'interface, le design, etc.

## Développer et proposer des modifications de code

Toujours annoncer les fonctionnalités sur lesquelles vous voulez travailler en créant un ticket ou en commentant un ticket existant, avant de commencer à travailler dessus. Et annoncez clairement à la communauté que vous commencez à travailler dessus. Ceci afin d'éviter que plusieurs personnes travaillent sur la même chose et entrent en conflit.

Merci d'utiliser la branche `develop`. La branche `main` est réservée aux versions publiées, pour que la documentation affichée reste synchronisée avec la version publiée du plugin.

Pour clôner le dépot :

```bash
# Cloner le dépot
git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git
# Passer sur la branche develop
git checkout develop
# Initialiser les sous-modules. Cette commande est à refaire si jamais la version d'un l'un des sous-module change.
git submodule update --init --recursive

# Installer les dépendances NPM et compiler le plugin pour la première fois :
npm install

# Compiler le plugin après une modification :
npm run build

# Si vous avez un fork du dépot, ajoutez le en remote (exemple) :
git remote add me git@github.com:MON_COMPTE_GITHUB/peertube-plugin-livechat.git

# Créez une branche locale pour vos développements et placez vous dessus (exemple) :
git checkout mon_developpement # NB: si un ticket y est associé, utilisé le nom fix_1234 (où 1234 est le numéro du ticket)
# Pour proposer vos modifications, poussez votre branche sur votre dépot (exemple) :
git push --set-upstream me mon_developpement
# Rendez-vous ensuite sur votre dépot github avec votre navigateur web pour proposer la Pull Request (voir les instructions complémentaires ci-dessous)
```

Quand vous êtes prêt⋅e à montrer votre code pour avoir un retour, soumettez une Pull Request *draft*.
Quand vous êtes prêt⋅e pour une relecture de code avant merge, soumettez une Pull Request. Dans tous les cas, merci de lier votre Pull Request au ticket concerné en utilisant la syntax de GitHub : «fixes #issue_number».

Le code du front-end est dans le dossier `client`. Le code backend dans `server`. Il y a du code partagé entre les deux dans `shared`.

Pour les instructions génériques concernant le développement de plugins (building, installation, ...), merci de vous référer à la [documentation Peertube](https://docs.joinpeertube.org/contribute-plugins?id=write-a-plugintheme).

Vous pouvez *builder* le plugin avec des infos de debug supplémentaires en utilisant :

```bash
NODE_ENV=dev npm run build
```
