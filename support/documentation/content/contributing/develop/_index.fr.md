+++
title="Développer"
description="Développer et proposer des modifications de code"
weight=40
chapter=false
+++

Toujours annoncer les fonctionnalités sur lesquelles vous voulez travailler en créant un ticket ou en commentant un ticket existant, avant de commencer à travailler dessus. Et annoncez clairement à la communauté que vous commencez à travailler dessus. Ceci afin d'éviter que plusieurs personnes travaillent sur la même chose et entrent en conflit.

Merci d'utiliser la branche `develop`. La branche `main` est réservée aux versions publiées, pour que la documentation affichée reste synchronisée avec la version publiée du plugin.

Pré-requis pour compiler le plugin:

- vous devez avoir installé `npm`
- vous devez avoir installé les venv python (paquet `python3-venv` sous Debian par exemple)

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

## ESBuild vs Typescript

Ce plugin utilise ESBuild pour compiler le code front-end, comme le plugin `peertube-plugin-quickstart` officiel.
ESBuild peut gérer Typescript, mais ne vérifie pas les types
(voir [la documentation ESBuild](https://esbuild.github.io/content-types/#typescript)).
C'est pourquoi on compile d'abord Typescript avec l'option `-noEmit`, juste pour vérifier les types (`check:client:ts` dans le fichier package.json).
Ensuite, si tout est ok, on lance ESBuild pour générer le javascript compilé.
