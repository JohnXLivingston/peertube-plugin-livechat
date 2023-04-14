+++
title="Clients XMPP"
description="Autoriser la connexion en utilisant des clients XMPP."
weight=30
chapter=false
+++

Ce module de tchat repose sur le protocole XMPP, aussi connu sous le nom de Jabber.
Il est donc possible de se connecter aux tchats en utilisant des
[logiciels clients XMPP](https://fr.wikipedia.org/wiki/Clients_XMPP).
Cela peut par exemple être utile pour faciliter les opérations de modération.

Pour la documentation utilisateur⋅rice associé à ces fonctionnalités, veuillez
vous référer à la page [de documentation utilisateur⋅rice](/peertube-plugin-livechat/fr/documentation/user/xmpp_clients/).

{{% notice info %}}
L'activation de ces fonctionnalités demande des changements de configuration
sur le serveur, et sur les enregistrements DNS. Il n'est pas possible de les
activer uniquement depuis l'interface de Peertube, et cela demande d'avoir
quelques compétences basiques d'admin système.
{{% /notice %}}

## Connexion à votre compte Peertube

{{% notice warning %}}
Cette fonctionnalité n'est pas encore disponible, et viendra dans une
prochaine version du plugin.
{{% /notice %}}

## Connexion en utilisant un compte XMPP externe

Pour activer cette fonctionnalité, il va falloir paraméter votre serveur et vos
enregistrements DNS, de sorte que les clients XMPP puissent trouver et accéder
au serveur [Prosody](https://prosody.im) que ce plugin utilise en interne.

### Paramètres du plugin

Commencez par aller dans les paramètres du plugin livechat de votre instance,
puis activez le paramètre «Autoriser les connexions aux salons via des comptes XMPP externes».
En cochant celui-ci, de nouveaux champs apparaissent en dessous.

Tout d'abord, le champs «Port Prosody serveur vers serveur». Celui-ci prend par
défaut la valeur 5269, qui est le port standard pour ce service.
Vous pouvez toutefois changer pour un autre port, si celui-ci est déjà utilisé
sur votre serveur.

Ensuite, le champs «Interfaces réseau pour les connexions serveur vers serveur»
vous permet d'indiquer sur quelles interfaces réseau le serveur doit écouter.
La valeur par défaut «*, ::» indique d'écouter sur toutes les addresses IP.
Vous pouvez changer ces valeurs, si vous souhaiter n'écouter que sur certaines
IP. La syntaxe est expliquée à coté du champs.

Pour le champs «Dossiers des certificats», vous pouvez le laisser vide.
Dans ce cas là, le plugin va générer automatiquement des certificats auto-signés.
Il se pourrait que certains serveurs XMPP refusent de se connecter, cela dépendant
de leur paramétrage.
Dans ce cas, vous pouvez indiquer ici un chemin sur le serveur, dans lequel vous
placerez des certificats à utiliser par le module.
Charge à vous de les générer et de les renouveller.
Vous pouvez vous référer à la documentation de [Prosody](https://prosody.im/doc/certificates).

{{% notice tip %}}
Si vous voulez utiliser l'utilitaire ProsodyCtl pour importer des certificats
letsencrypts, cet utilitaire est disponible (une fois Peertube démarré) en utilisant
la commande qui suit (en adaptant le chemin vers votre dossier data Peertube,
et en remplaçant «xxx» par les arguments que vous souhaitez passer à
prosodyctl):
`sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl xxx`
{{% /notice %}}

### Pare-feu

Vous devez ouvrir le port configuré (5269 par défaut) sur votre pare-feu.

Si vous utilisez Docker pour votre Peertube, il faut modifier le fichier
`docker-compose.yml` pour ouvrir le port 5269 du conteneur `peertube` au
monde extérieur.

### DNS

Vous devez ajouter un [enregistrement DNS](https://prosody.im/doc/dns) permettant
aux serveurs distant de trouver le composant «room.votre_instance.tld».

Le plus simple pour cela est d'ajouter un enregistrement SRV pour le
[sous-domaine](https://prosody.im/doc/dns#subdomains) «room»:

* nom de l'enregistrement: _xmpp-server._tcp.room.votre_instance.tld. (remplacez «votre_instance.tld» par la valeur adéquate)
* TTL: 3600
* class: IN
* SRV: 0
* priority: 0
* weight: 5
* port: 5269 (adaptez si vous avez changé le port)
* target: votre_instance.tld. (remplacez par la valeur adéquate)

Attention à bien conserver le point après «votre_instance.tld».

En utilisant la commande `dig` pour vérifier votre enregistrement,
vous devriez obtenir un résultat similaire à celui-ci:

```bash
$ dig +short _xmpp-server._tcp.room.videos.john-livingston.fr. SRV
0 5 5269 videos.john-livingston.fr.
```
