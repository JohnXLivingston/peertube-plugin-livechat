# Installation du plugin peertube-plugin-livechat 🇫🇷

🇬🇧 English version [here](./installation.md).

**IMPORTANT :** ce plugin ne fonctionne malheureusement pas (encore) tout seul, il doit se reposer sur des outils externes.

**Avant de mettre à jour vers une nouvelle version majeure, merci de lire les notes de version, et la liste des éventuelles modifications non rétro-compatibles : [CHANGELOG](../CHANGELOG.md).**

Ce plugin peut être utilisé de plusieurs manières différentes :

| Mode | Description | Documentation
---|---|---
**Serveur Prosody controllé par Peertube (recommandé)** | Ce plugin peut lancer un processus [Prosody](https://prosody.im) et l'auto-configurer. | [Documentation](./prosody.md). **C'est le mode recommandé**
**Se connecter à un serveur XMPP existant avec ConverseJS** | Vous pouvez utiliser un serveur Jabber/XMPP externe. Ce serveur doit pouvoir utiliser le protocole BOSH ou Websocket, accepter les connexions anonymes, et accepter la création de salons de discussion. |[Documentation](./conversejs.md)
** Utiliser un outil de chat externe :** | Vous pouvez utiliser un outils de chat externe, si celui-ci peut être inclu dans une iframe. | [Documentation](./external.md)

Pour les deux premiers modes, la connexion vers le serveur XMPP est faite via la bibliothèque javascript [ConverseJS](https://conversejs.org/).

Il y a de la documentation pour des paramètres communs aux différents modes ici : [common settings documentation](./common.md).
