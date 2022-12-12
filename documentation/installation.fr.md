# Installation du plugin peertube-plugin-livechat 🇫🇷

🇬🇧 English version / version anglaise [here](./installation.md).
🇩🇪 German version / deutsche Version [hier](./installation.de.md).
🇯🇵 Japanese version / 日本語バージョン [こちら](./installation.ja.md).

**Avant de mettre à jour vers une nouvelle version majeure, merci de lire les notes de version, et la liste des éventuelles modifications non rétro-compatibles : [CHANGELOG](../CHANGELOG.md).**

Pour installer ou mettre à jour ce plugin, utilisez simplement l'interface web d'administration de votre Peertube.

## IMPORTANT NOTE

Depuis la version v6.0.0, ce plugin ne nécessite plus l'installation de Prosody.

Si vous utilisiez ce plugin avant, et que vous aviez installé Prosody manuellement, vous pouvez le désinstaller en tout sécurité.

Si vous utilisiez l'image docker spéciale de Peertube (qui incluais Prosody), vous pouvez basculer sur l'image officielle de Peertube.

## Problème connu: compatibilité CPU

L'AppImage Prosody inclue dans le plugin ne fonctionne que sur des CPU x86_64.
Elle n'est pas compatible avec d'autres architectures CPU telles que arm64.

Pour l'instant, je n'ai pas réussi à le faire fonctionner sur d'autres architectures.
Pour être notifié des évolutions sur le sujet, vous pouvez vous abonner et commenter
[ce ticket](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/124).

Pour utiliser le plugin, vous allez devoir installer manuellement Prosody sur
votre serveur (voir plus bas).

Une fois cela fait, vous aurez à cocher le paramètre `Use system Prosody` du plugin.

### Installation autres que Docker

Pour les installations standard, vous avez juste à installer le paquet `prosody` officiellement
disponible pour votre distribution linux.

Par exemple, sur Debian/Ubuntu:

```bash
sudo apt install prosody
```

Vous pouvez alors désactiver le service qui démarre automatiquement quand vous
installé le paquet (le plugin va lancer son propre processus Prosody, et n'a pas
besoin que le service tourne sur le serveur).
Par exemple, sur Debian/Ubuntu (et les autres distributions se basant sur Systemd):

```bash
sudo systemctl disable prosody && sudo systemctl stop prosody
```

Attention: ne désactivez pas Prosody s'il est utilisé par un autre service sur
votre serveur, par exemple pour Jitsi.

### Docker

Vous allez devoir générer une image de Peertube qui inclu Prosody dans le même
conteneur que Peertube.
Je sais que ce n'est pas la façon de faire standard avec Docker, mais gardez
en tête que ceci est une solution de contournement temporaire.

Pour générer cette image, merci de vous référer à la documentation de Docker.
Le fichier Docker pour générer l'image devrait être:

```Docker
FROM chocobozzz/peertube:production-bullseye

RUN apt -y update && apt install -y prosody && apt -y clean
```

### Yunohost

Vous avez à désactiver `metronome` (le serveur XMPP utilisé par Yunohost),
et installer`prosody`.

Ceci est déjà fait par l'application Yunohost Peertube, étant donné que c'était
un pré-requis pour les version du plugin antérieures à la v6.0.0.

Mais il se pourrait que ce soit retiré de l'application Yunohost Peertube dans un
futur proche (pour éviter les inconvénients de cette méthode).
Je dois discuter avec l'équipe Yunohost, pour décider de la bonne façon de faire
pour minimiser les inconvénients et maximiser la compatibilité.
