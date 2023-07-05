+++
title="Traduction"
description="Traduire le plugin"
weight=20
chapter=false
+++

Vous pouvez contribuer à la traduction de ce plugin Peertube.
Les traductions sont gérées par le logiciel [Weblate](https://weblate.org/),
via [l'instance Weblate de Framasoft](https://weblate.framasoft.org/).

{{% notice warning %}}
Ne modifiez jamais directement les fichiers dans le dossier `languages` du plugin,
vous risqueriez de créer des conflits.
{{% /notice %}}

## Comment faire

* Créez-vous un compte: https://weblate.framasoft.org/accounts/register/
* Validez votre email en cliquant sur le lien reçu
* Choisissez votre mot de passe, et configurez votre compte
* Allez sur le projet du plugin de tchat: https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/
* Choisissez la langue que vous voulez traduire
* Il ne vous reste plus qu'à ajouter les traductions manquantes, ou corriger celles qui vous semblent erronées.

{{% notice warning %}}
Il peut y avoir des chaînes «assez techniques».
Si vous n'êtes pas sûr⋅e à 100% du sens, ou de la traduction,
il vaut mieux ne pas la traduire du tout ;
ainsi la version anglaise s'affichera.
{{% /notice %}}

## Traduction de la documentation

Pour l'instant, cela n'est pas encore géré dans Weblate. Je suis encore à la recherche de la bonne
solution technique.

Voir la page de documentation dédiée à la documentation.

## Ajout d'une nouvelle langue

Si la langue qui vous intéresse n'est pas présente, assurez-vous d'abord qu'elle est bien supportée par Peertube.
Si c'est le cas, vous pouvez [ouvrir un ticket](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues)
pour en demander l'ajout.

## Ajout de nouveau segment / utilisation dans le code

Si vous travaillez sur une nouvelle fonctionnalité, et que vous avez besoin de nouveaux segments,
créez les directement dans Weblate.
La version anglaise est obligatoire, commencez par celle-ci.

Chaque segment est lié à une clé (par exemple `use_chat`).
Choisissez une clé en anglais, suffisamment explicite, et en minuscule.

Si vous avez besoin de tester vos localisations sans attendre la fusion venant de Weblate,
vous pouvez modifier les fichiers `languages/*.yml`, mais évitez de les commit
(pour minimiser le risque de conflits).

### Utiliser un segment dans le code front-end

Avant d'utiliser une chaîne en front-end, il faut déclarer une nouvelle constante dans `client/@types/global.d.ts`.
La constante doit :

* commencer par le préfixe "LOC_"
* utiliser la clé de la chaîne, en majuscule
* vous ne devez déclarer que son type, pas sa valeur

Par exemple, pour utiliser "use_chat", vous devez déclarer :
e, to use "use_chat", you have to declare:

```typescript
declare const LOC_USE_CHAT: string
```

Le script `build-client.js` va lire ce fichier `client/@types/global.d.ts`, chercher pour de telles constantes, et charger leurs valeurs depuis le fichier de langue.

Vous pouvez maintenant utiliser `peertubeHelpers.translate(LOC_USE_CHAT)` dans votre code.

### Utiliser un segment dans le code back-end

En théorie, les seules parties du code qui ont besoin de traductions sont les déclarations de paramètres et la génération de données standardisées (ActivityPub, RSS, ...).
Ici on a besoin de récupérer les chaînes anglaises à partir des clés de traduction.

Note: vous ne devriez jamais avoir besoin d'autres langues que l'anglais pour le code backend.
Les traductions doivent se faire coté front-end.

Il y a un module `lib/loc.ts` qui fourni une function `loc()`.
Passez juste la clé pour récupérer la phrase anglaise: `loc('diagnostic')`.
