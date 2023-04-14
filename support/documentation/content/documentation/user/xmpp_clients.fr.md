+++
title="Clients XMPP"
description="Se connecter au tchat avec un client XMPP"
weight=40
chapter=false
+++

Ce module de tchat repose sur le protocole XMPP, aussi connu sous le nom de Jabber.
Il est donc possible de se connecter aux tchats en utilisant des
[logiciels clients XMPP](https://fr.wikipedia.org/wiki/Clients_XMPP).
Cela peut par exemple être utile pour faciliter les opérations de modération.

{{% notice info %}}
Les fonctions décrites dans cette page doivent être activées et configurées par
les administrateur⋅rices de votre instance Peertube. Il se peut donc que vous
n'y ayez pas accès.
{{% /notice %}}

## Connexion à votre compte Peertube

{{% notice warning %}}
Cette fonctionnalité n'est pas encore disponible, et viendra dans une
prochaine version du plugin.
{{% /notice %}}

## Connexion en utilisant un compte XMPP externe

Si cette fonctionnalité est activée sur votre instance, vous pouvez vous
connecter aux tchats Peertube en utilisant un compte XMPP quelconque.

Pour obtenir l'adresse du salon à rejoindre, vous pouvez utiliser la fenêtre
de «partage» du tchat, dont le bouton est situé au dessus du tchat:

![Partage](/peertube-plugin-livechat/images/share_button.png?classes=shadow,border&height=200px)

{{% notice info %}}
Par défaut, le bouton de partage n'est visible que pour le ou la propriétaire de la vidéo,
et les admins/modérateur⋅rices de l'instance.
Toutefois, les admins peuvent décider d'afficher ce bouton pour tout le monde.
{{% /notice %}}

Ensuite, dans la modale qui s'affiche, choississez «Connexion avec un client XMPP»:

![Partage XMPP](/peertube-plugin-livechat/images/share_xmpp_dialog.png?classes=shadow,border&height=200px)

Il vous suffit ensuite, soit de cliquer sur «ouvrir», soit de copier/coller l'adresse du salon dans votre client XMPP
(en utilisant la fonctionnalité «rejoindre un salon»).
