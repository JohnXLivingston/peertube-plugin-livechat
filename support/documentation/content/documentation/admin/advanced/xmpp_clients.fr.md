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
Voir plus loin pour une explication plus détaillée.

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

Si vous **n'utilisez pas le port standard `5269`**, vous devez ajouter un autre enregistrement SRV pour
`_xmpp-server._tcp.votre_instance.tld.` (pareil que précédemment, mais en enlevant le préfixe `room.`).
Bien sûr, vous pouvez l'ajouter même si vous utilisez le port standard. Cela fonctionnera également.

### Utilisation de certificats de confiance

Les certificats auto-signés que le plugin utilise par défaut peuvent ne pas convenir à tous les serveurs distants.
En effet, ceux-ci peuvent les refuser pour raison de sécurité.

Il est possible d'utiliser des certificats validés par une autorité de certification.
Cependant cela demande des connaissances d'administration système avancées.
En effet, devant la multitude de cas possibles, il est impossible de documenter ici toutes les situations.
La présente documentation va donc se contenter de vous expliquer le but à atteindre, et donner un example
qui ne conviendra qu'à une situation «basique» (installation manuelle de Peertube, avec utilisation de letsencrypt).
Si vous êtes dans une autre situation (installation Docker, certificats signés par une autre autorité, etc...), il
vous faudra adapter la démarche.

#### Principe de base

À vous de générer des certificats valides pour les domaines `votre_instance.tld` et `room.votre_instance.tld`.
Vous pouvez utiliser n'importe quelle [méthode supportées par Prosody](https://prosody.im/doc/certificates).

Vous devez ensuite placer ces certificats dans un dossier qui sera accessible au user `peertube`, puis indiquer
ce dossier dans le paramètre du plugin «Dossiers des certificats».

{{% notice tip %}}
Si vous voulez utiliser l'utilitaire ProsodyCtl (pour importer des certificats
letsencrypts, générer des certificats, etc...), cet utilitaire est disponible
(une fois Peertube démarré) en utilisant la commande qui suit (en adaptant le chemin vers votre dossier data Peertube,
et en remplaçant «xxx» par les arguments que vous souhaitez passer à prosodyctl) :
`sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl xxx`
{{% /notice %}}

Le plugin va vérifier une fois par jour si des fichiers ont été modifiés dans ce dossier, et recharger Prosody le cas échéant.

#### Méthode dans le cas simple

Nous supposons ici que votre installation de Peertube est «classique» (pas d'utilisation de Docker), et que les
certificats sont générés par letsencrypt, en utilisant l'outils certbot.

Tout d'abord, on va devoir créer un certificat pour le sous-domain `room.votre_instance.tld` : c'est l'uri du composant
MUC (salons de discussion XMPP). Même si les connections se font sur `votre_instance.tld`, il va nous falloir un
certificat valide pour ce sous-domaine.

Commencez donc par paraméter une entrée DNS pour `room.votre_instance.tld`, qui pointe sur votre serveur.
Vous pouvez tout à faire faire une entrée CNAME (ou une entrée A et une entrée AAAA).

Ensuite, nous allons utiliser nginx (déjà installé pour votre Peertube) pour générer le certificat certbot.
On va créer un nouveau site. Dans le fichier `/etc/nginx/site-available/room.peertube`, ajoutez:

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name room.votre_instance.tld;

  location /.well-known/acme-challenge/ {
    default_type "text/plain";
    root /var/www/certbot;
  }
  location / { return 301 https://votre_instance.tld; }
}
```

Ensuite on active ce site:

```bash
ln -s /etc/nginx/sites-available/room.peertube /etc/nginx/sites-enabled/
systemc reload nginx
```

On prépare ensuite le dossier dans lequel on va plus tard importer les certificats.
On suppose ici que vous avez déjà le plugin actif. On va créer le dossier suivant (s'il n'existe pas déjà),
avec le user `peertube` pour être sûr qu'il n'y a pas de problème de droits:

```bash
sudo -u peertube mkdir /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/certs
```

Il faut maintenant configurer ce dossier dans les paramètres du plugin, pour «Dossiers des certificats».
C'est important de le faire avant la suite, sinon le script d'import des certificats va les placer au mauvais endroit.

On va configurer certbot pour qu'il importe les certificats générés dans le dossier de Prosody.
On va pouvoir utiliser l'utilistaire ProsodyCtl packagé dans le plugin.

Note: pour qu'il soit disponible, il faut que le plugin ai démarré au moins une fois.

On va créer un fichier `/etc/letsencrypt/renewal-hooks/deploy/prosody.sh` contenant:

```bash
#!/bin/sh
/var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl \
  --root \
  --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \
  cert import \
  room.votre_instance.tld votre_instance.tld /etc/letsencrypt/live
```

Puis on demande à générer le certificat :

```bash
certbot -d room.videos.john-livingston.fr
```

Si certbot vous propose plusieurs méthodes pour générer le certificat, choisissez «nginx».

Normalement vous devriez maintenant trouver les certificats dans le dossier configuré.

Note: la première fois que vous faites tout ça, il va falloir recharger Prosody. Le plus simple pour cela est de
redémarrer Peertube.

#### Méthode en cas d'utilisation de Docker

Merci de vous référer à la documentation en anglais.

### En cas de problème

Si cela ne fonctionne pas, vous pouvez utiliser l'outils de diagnostic
(un bouton se trouve en haut de la page des paramètres du plugin),
et notamment regarder ce que dit la section «Prosody check».
