var relearn_search_index=[{breadcrumb:"Peertube livechat",content:`Qu’est ce que le plugin livechat ? Ce plugin pour Peertube permet d’intégrer un système de «chat» (clavardage) à coté des vidéos.
Par défaut, une fois le plugin installé sur votre instance Peertube, un salon de discussion sera automatiquement créé pour chaque diffusion en direct.
Sur la capture d’écran ci-dessous, vous pouvez voir une page classique de vidéo Peertube, avec un salon de discussion sur la droite (cliquez sur l’image pour la voir en plein écran) :
Le salon sera accessible pour les spectateur⋅rices, même si celleux-ci n’ont pas de compte sur votre instance. Ces utilisateur⋅rices «anonymes» auront juste à choisir un pseudonyme avant de pouvoir parler dans le tchat.
Par défaut, le chat est affiché à côté de la vidéo. Mais vous pouvez l’ouvrir dans un autre onglet du navigateur, en utilisant le bouton situé au-dessus :
Astuce Vous pouvez tester le plugin livechat via cette page de démo.
Installation En tant qu’administrateur⋅rice Peertube, vous pouvez installer ce plugin sur votre instance simplement en utilisant la boutique de plugin incluse dans l’interface d’administration de Peertube. Cherchez «livechat», puis cliquez sur «installer» : et voilà !
Possibilités du livechat Le plugin a de nombreuses fonctionnalités avancées. Il utilise le standard XMPP «sous le capot», ce qui permet aux adminstrateur⋅rices d’activer des fonctionnalités avancées (se connecter en utilisant des clients XMPP, bots de tchat, pont vers d’autres protocoles, …). Plus d’informations dans les sections correspondantes de cette documentation.
Fédération Peertube fait parti du fédiverse : vous pouvez créer un réseau d’instances Peertube, en partageant le contenu entre elles.
Ce plugin est capable de gérer la fédération : quand vous regardez un direct d’une instance distante, vous rejoindrez le tchat avec votre compte local. Vous serez automatiquement connecté avec votre pseudonyme et votre avatar.
Bien sûr, pour que la fédération fonctionne, le plugin doit être installé sur les deux instances.
Modération Parfois, vous devez protéger votre communauté contre les personnes mal intentionnées. En tant qu’administrateur⋅rice d’instance, vous pouvez choisir de désactiver la fédération pour le plugin livechat. Si des acteur⋅rices distant⋅es se comportent mal, les streameur⋅euses, les modérateur⋅rices et les administrateur⋅rices peuvent bannir ou mettre en sourdine des utilisateur⋅ices.
Bot de tchat Ce plugin via avec un bot de tchat intégré. Veuillez vous référer à sa documentation pour plus d’informations.
Vous pouvez également brancher tout autre bot de tchat XMPP, en utilisant les Composants XMPP externes. Pour cela, vous avez juste à configurer les accès des composants externes via la page des paramètres du plugin.
Persistance du tchat En rejoignant un salon, vous verrez les anciens messages. Même ceux envoyés avant que vous ne rejoignez le salon.
Ce comportement peut changer salon par salon, et la durée de rétention peut être choisie par les administrateur⋅rices de l’instance.
Intégrer le tchat dans vos directs Lorsque vous utilisez un logiciel tel que OBS pour votre diffusion en direct, vous pouvez intégrer le tchat dans le flux vidéo. C’est par exemple utile pour les rediffusions.
Dans la capture d’écran suivante, vous pouvez voir une rediffusion de direct où le contenu du tchat est inclus dans le bas de la vidéo :
Dans la capture d’écran suivante, vous pouvez voir une configuration OBS, où le chat est inclus en tant que source dans la scène actuelle (la couleur de fond peut être modifiée et peut être transparente) :
Autres usages Par défaut, chaque streameur⋅euse peut activer/désactiver le tchat pour leurs directs.
Mais au niveau de l’instance, les administrateur⋅rices peuvent choisir d’activer le tchat pour toutes les vidéos (directs et/ou vidéo à la demande).
Vous pouvez également activer le tchat pour des vidéos à la demande spécifiques. C’est comme cela que fonctionne la page de démo : ce n’est pas un direct, mais j’ai activé le tchat spécifiquement pour cette vidéo.`,description:"Introduction",tags:[],title:"Introduction",uri:"/peertube-plugin-livechat/fr/intro/index.html"},{breadcrumb:"Peertube livechat > Contribuer",content:` Astuce Ce code de conduite est adapté du Contributor Covenant, version 2.1, disponible à l’adresse https://www.contributor-covenant.org/version/2/1/code_of_conduct.html. Les traductions sont disponibles à l’adresse https://www.contributor-covenant.org/translations. Les cas de comportements abusifs, harcelants ou tout autre comportement inacceptables peuvent être signalés aux dirigeant·e·s de la communauté responsables de l’application du code de conduite à git.[at].john-livingston.fr.
Our Pledge We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation.
We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.
Our Standards Examples of behavior that contributes to a positive environment for our community include:
Demonstrating empathy and kindness toward other people Being respectful of differing opinions, viewpoints, and experiences Giving and gracefully accepting constructive feedback Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience Focusing on what is best not just for us as individuals, but for the overall community Examples of unacceptable behavior include:
The use of sexualized language or imagery, and sexual attention or advances of any kind Trolling, insulting or derogatory comments, and personal or political attacks Public or private harassment Publishing others’ private information, such as a physical or email address, without their explicit permission Other conduct which could reasonably be considered inappropriate in a professional setting Enforcement Responsibilities Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.
Community leaders have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, and will communicate reasons for moderation decisions when appropriate.
Scope This Code of Conduct applies within all community spaces, and also applies when an individual is officially representing the community in public spaces. Examples of representing our community include using an official e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event.
Enforcement Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement by mail at git.[at].john-livingston.fr. All complaints will be reviewed and investigated promptly and fairly.
All community leaders are obligated to respect the privacy and security of the reporter of any incident.
Enforcement Guidelines Community leaders will follow these Community Impact Guidelines in determining the consequences for any action they deem in violation of this Code of Conduct:
1. Correction Community Impact: Use of inappropriate language or other behavior deemed unprofessional or unwelcome in the community.
Consequence: A private, written warning from community leaders, providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate. A public apology may be requested.
2. Warning Community Impact: A violation through a single incident or series of actions.
Consequence: A warning with consequences for continued behavior. No interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, for a specified period of time. This includes avoiding interactions in community spaces as well as external channels like social media. Violating these terms may lead to a temporary or permanent ban.
3. Temporary Ban Community Impact: A serious violation of community standards, including sustained inappropriate behavior.
Consequence: A temporary ban from any sort of interaction or public communication with the community for a specified period of time. No public or private interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, is allowed during this period. Violating these terms may lead to a permanent ban.
4. Permanent Ban Community Impact: Demonstrating a pattern of violation of community standards, including sustained inappropriate behavior, harassment of an individual, or aggression toward or disparagement of classes of individuals.
Consequence: A permanent ban from any sort of public interaction within the community.
Attribution This Code of Conduct is adapted from the Contributor Covenant, version 2.1, available at https://www.contributor-covenant.org/version/2/1/code_of_conduct.html.
Community Impact Guidelines were inspired by Mozilla’s code of conduct enforcement ladder.
For answers to common questions about this code of conduct, see the FAQ at https://www.contributor-covenant.org/faq. Translations are available at https://www.contributor-covenant.org/translations.`,description:"Convention de Code de conduite Contributeur⋅rices",tags:[],title:"Code de conduite",uri:"/peertube-plugin-livechat/fr/contributing/codeofconduct/index.html"},{breadcrumb:"Peertube livechat",content:` Documentation utilisateur⋅riceDocumentation utilisateur⋅rice du plugin peertube-plugin-livechat
Pour les spectateur⋅ricesComment tchater pour les spectateur⋅rices
OBSDocumentation pour diffuser le contenu du tchat à l'aide d'OBS.
Clients XMPPSe connecter au tchat avec un client XMPP
Pour les streameur⋅eusesComment mettre en place le tchat pour vos diffusions en direct
Quelques basiquesQuelques informations de base sur comment configurer et utiliser le tchat pour vos directs
Configuration de la chaîneConfiguration des salons de discussion des chaînes Peertube
AnnouncementsRoom owners and administrators can send special announcements in the chat.
ModérationFonctions de modération avancées du plugin peertube-plugin-livechat
Conditions d'utilisationConfigurer les conditions d'utilisation des tchats de la chaîne
Mode lentMode lent du plugin peertube-plugin-livechat
Délai de modérationPlugin peertube-plugin-livechat délai de modération
Emojis personnalisésEmojis personnalisés du plugin peertube-plugin-livechat
Emojis only modePlugin peertube-plugin-livechat emojis only mode
SondagesYou can create polls to ask viewers their opinion
Tâches / listes de choses à faireVous pouvez gérer les tâches et les listes de tâches avec votre équipe de modération.
Moderation notesPlugin peertube-plugin-livechat moderation notes
Bot de tchatConfiguration du bot de tchat
Documentation d'installationInstallation du plugin peertube-plugin-livechat
En cas de problèmeQuelques erreurs classiques, et solutions de contournement.
Problème connu : compatibilité CPUPour l'instant le plugin ne supporte de base que les architectures CPU x86_64 et arm64. Veuillez trouver ici des instructions pour le faire fonctionner sur d'autres architectures CPU.
Mise à jour depuis une version antérieure à 6.0.0Notes importantes pour la mise à jour depuis une ancienne version du plugin.
Documentation administrateur⋅riceAdministration du Plugin Peertube Livechat
ParamètresParamètres du Plugin Peertube Livechat
Authentification externeParamètres du Plugin Peertube Livechat - Authentification Externe
Prosody mod_firewallAdvanced firewall rules for the Prosody server
Usage avancéQuelques fonctionnalités avancées
Clients XMPPAutoriser la connexion en utilisant des clients XMPP
Utiliser MatterbridgeUtiliser Matterbridge pour faire un pont vers d'autres tchats`,description:"Documentation du plugin",tags:[],title:"Documentation",uri:"/peertube-plugin-livechat/fr/documentation/index.html"},{breadcrumb:"Peertube livechat > Documentation",content:` Pour les spectateur⋅ricesComment tchater pour les spectateur⋅rices
OBSDocumentation pour diffuser le contenu du tchat à l'aide d'OBS.
Clients XMPPSe connecter au tchat avec un client XMPP
Pour les streameur⋅eusesComment mettre en place le tchat pour vos diffusions en direct
Quelques basiquesQuelques informations de base sur comment configurer et utiliser le tchat pour vos directs
Configuration de la chaîneConfiguration des salons de discussion des chaînes Peertube
AnnouncementsRoom owners and administrators can send special announcements in the chat.
ModérationFonctions de modération avancées du plugin peertube-plugin-livechat
Conditions d'utilisationConfigurer les conditions d'utilisation des tchats de la chaîne
Mode lentMode lent du plugin peertube-plugin-livechat
Délai de modérationPlugin peertube-plugin-livechat délai de modération
Emojis personnalisésEmojis personnalisés du plugin peertube-plugin-livechat
Emojis only modePlugin peertube-plugin-livechat emojis only mode
SondagesYou can create polls to ask viewers their opinion
Tâches / listes de choses à faireVous pouvez gérer les tâches et les listes de tâches avec votre équipe de modération.
Moderation notesPlugin peertube-plugin-livechat moderation notes
Bot de tchatConfiguration du bot de tchat
Special charactersThe bot can automatically moderate messages containing too many special characters.
No duplicate messageThe bot can automatically moderate duplicate messages.
Mots interditsLe bot peut automatiquement modérer les messages contenant des mots interdits.
Messages pré-enregistrésLe bot peut envoyer des messages périodiquement.
CommandesLe bot peut répondre à différentes commandes.`,description:"Documentation utilisateur⋅rice du plugin peertube-plugin-livechat",tags:[],title:"Documentation utilisateur⋅rice",uri:"/peertube-plugin-livechat/fr/documentation/user/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation d'installation",content:`Je viens juste d’installer/mettre-à-jour le plugin, mais rien ne se passe Si vous venez juste d’installer/mettre-à-jour le plugin, et que rien ne se passe (pas de tchat, pas de paramètres, des boutons qui ne fonctionnent pas dans les paramètres, …), essayez juste de recharger la page.
Outil de diagnostic Si le tchat ne fonctionne pas, il y a un outil de diagnostic dans la page des paramètres du plugin.
Ouvrez les paramètres du plugin, et cliquez sur le bouton “lancer le diagnostique”.
S’il y a une erreur sur la page de diagnostique, vous pouvez chercher une solution sur cette page, ou si vous ne trouvez pas de réponse, vous référer à la page de documentation «évolutions / bugs».
Le tchat ne se charge pas Appels d’API interne Dans certains cas (comme par exemple les installation Peertube sous Docker), l’outil de diagnostique affiche une erreur appelée “API Prosody Peertube is KO”.
Dans ce cas, essayez de changer le paramètre “Url Peertube pour les appels d’API”, en mettant http://127.0.0.1:9000 (si c’est bien le port 9000 qui est utilisé par votre Peertube, demandez aux administrateur⋅rices de votre instance si vous ne savez pas).
Veuillez vous référer à la page d’aide pour ce paramètre.
Websocket Si tout est OK d’après l’outil de diagnostique, mais que la fenêtre de tchat reste vide : cela peut être un soucis Websocket. Depuis la version 5.0.0 de Peertube, il y a de la configuration supplémentaire à faire du côté du serveur. Vérifiez avec les administrateur⋅rices de votre instance s’iels n’ont pas oublié d’appliquer les changements listés dans les notes de version 5.0.0 de Peertube.
Vous pouvez confirmer si c’est un problème de Websocket en ouvrant la console de votre navigateur, et en vérifiant s’il y a des journaux d’erreur mentionnant une connexion Websocket échouée.
Si vous ne pouvez pas corriger cela tout de suite, vous pouvez déactiver Websocket en décochant “Désactiver Websocket” dans la page des paramètres du plugin. En pareil cas, vous devriez aussi décocher “Ne pas publier les informations de tchats”, car la fédération du tchat ne fonctionnera pas sans Websocket.`,description:"Quelques erreurs classiques, et solutions de contournement.",tags:[],title:"En cas de problème",uri:"/peertube-plugin-livechat/fr/documentation/installation/troubleshooting/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation administrateur⋅rice",content:`Cette section décrit la page de configuration du plugin.
Conditions d’utilisation du tchat de la chaîne Vous pouvez configurer un message de “conditions d’utilisation” qui sera affiché aux utilisateur⋅rices qui rejoignent vos salons de discussion.
Pour plus d’informations sur cette fonctionnalité, veuillez vous référer à la documentation des conditions d’utilisations de la chaîne.
Information La modification de ce paramètre redémarre le serveur de tchat et tous les utilisateur⋅rices seront déconnecté⋅es pendant une courte période.
Lister les salons de tchat existants Lorsque vous appuyez sur le bouton “Lister les salles”, toutes les salles de chat existantes sont listées. Vous pouvez alors les trouver et les modérer.
Fédération Les paramètres suivants concernent la fédération avec d’autres instances Peertube et d’autres logiciels du fediverse.
Ne pas afficher les tchats distants En cochant ce paramètre, votre instance n’affichera jamais les tchats sur les vidéos distantes.
Ne pas publier les informations de tchats En cochant ce paramètre, votre instance ne publiera pas les informations de tchat sur le fédivers. Les instances Peertube distantes ne sauront pas qu’un tchat est associé aux vidéos.
Attention : si vous aviez déjà des tchats en cours, il est possible que les informations aient déjà été publiées. Il faudra attendre la prochaine mise à jour des vidéos pour que les informations soient dépubliées. De même, si vous désactivé ce paramètre, il faudra attendre que les vidéos soient mises à jour pour à nouveau publier les informations. Cette mise à jour intervient entre autre quand un live reprend ou s’arrête.
Attention : ce paramètre ne joue que sur la publication d’informations via le protocole ActivityPub. Il n’empêchera pas une application distante de détecter autrement la présence de tchat, et de tenter de s’y connecter.
Authentification Désactiver les jetons livechat Si vous avez des problèmes avec les jetons d’authentification à long terme, vous pouvez désactiver cette fonctionnalité ici.
Authentification externe Voir la page de documentation détaillée :
Authentification Externe
Configuration avancée de la chaîne Les paramètres suivants concernent les options de chaîne avancées : les utilisateur⋅rices pourront personnaliser leurs chaînes, activer le bot de modération, …
Désactiver la configuration avancée des chaînes et le bot de modération Si vous rencontrez un problème avec cette fonctionnalité, vous pouvez la désactiver.
Comportement en chat Type de salon Vous pouvez choisir d’avoir des salons séparés pour chaque vidéo, ou de les grouper par chaîne.
Ouvrir automatiquement le tchat Quand on regarde une vidéo, le tchat va automatiquement s’ouvrir.
Montrer le bouton «ouvrir dans une nouvelle fenêtre» Il y aura un bouton pour ouvrir le tchat dans une nouvelle fenêtre.
Montrer le bouton «partager le lien du salon» Cette fonctionnalité permet d’activer une fenêtre modale “partager le lien du chat”. Avec cette modale, vous pouvez générer des URL pour rejoindre le tchat. Le tchat peut être personnalisé (mode lecture seule, utilisation du thème actuel, …).
Vous pouvez par exemple générer une URL en lecture seule et l’utiliser dans OBS pour intégrer le chat dans votre flux en direct !
Ce paramètre vous permet de choisir qui peut accéder à cette fenêtre modale.
Les utilisateur⋅rices peuvent activer le tchat pour leurs directs Si coché, il y aura pour tous les directs une case à cocher dans les propriétés qui permettra d’activer/désactiver le tchat.
Le⋅a propriétaire de la vidéo pourra activer le tchat en ligne.
Activer le tchat pour tous les directs Si coché, il y aura un tchat pour tous les directs.
Activer le tchat pour toutes les vidéos «non-direct» Activer le tchat pour toutes les vidéos «non-direct»
Activer le tchat pour ces vidéos Activer le tchat pour ces vidéos
Masquer les tchats pour les utilisateur⋅rices anonymes Si coché, les utilisteur⋅rices non connecté⋅es ne verront pas les tchats. Cette fonctionnalité est encore expérimentale. Si vous l’avez activée, il est hautement recommandé d’également cocher «Ne pas publier les informations de tchats». Sinon certains outils tierces ne pourraient tenter d’ouvrir le tchat, et auraient des résultats imprédictibles.
Note : pour l’instant, c’est fonctionnalité masque simplement le tchat. Dans une future version, le tchat sera remplacé par un message précisant «merci de vous connecter […]». Voir les notes de publication de la version 5.7.0 pour plus d’informations.
Bannir l’IP des utilisateur⋅rices anonymes, quand iels sont banni⋅es des salons En activant cette option, à chaque fois qu’un⋅e utilisateur⋅rice anonyme est banni⋅e d’un salon, son IP sera également bannie du serveur de tchat. Attention : si votre instance est ouverte aux inscriptions, un⋅e utilisateur⋅rice pourrait créer un salon piégé, y inviter des personnes, et automatiquement bannir les IPs des utilisateur⋅rices anonymes. La liste des IPs bannie n’est pas enregistrée, et sera effacée au redémarrage du serveur, ou si vous changez certains paramètres du plugin. Les IPs bannies sont journalisées dans les journaux du serveur Prosody, donc les admins du serveur peuvent éventuellement utiliser des outils externes (comme par exemple fail2ban) pour bannir les IPs plus largement.
Note importante : Si vous activez cette fonctionnalité, et que vous utilisez un reverse proxy personnalisé devant Peertube, merci de vous assurer que vous avez correctement configuré celui-ci pour faire suivre les IPs réelles des utilisateur⋅rices à Peertube. Sinon cela pourrait bloquer tous les utilisateur⋅rices anonymes d’un coup.
Personnalisation de l’apparence Jeu d’avatars Vous pouvez choisir parmi plusieurs jeux différents les avatars par défaut qui seront utilisés pour les utilisateurs du tchat.
Sepia (mascotte Peertube) : Générateur d’avatars Peertube de David Revoy, Licence CC-By
Chats : Générateur d’avatar de chat de David Revoy, Licence CC-By
Oiseaux : Générateur d’avatar d’oiseaux de David Revoy, Licence CC-By
Fennecs (mascotte Mobilizon) : Générateur d’avatar fénnec/mobilizon de David Revoy, licence CC-By
Abstrait : Générateur d’avatar abstrait de David Revoy, licence CC-By
Anciens avatars Sepia (ceux inclus dans les versions précédentes du plugin) : Basé sur le travail de David Revoy, licence AGPL-v3
Si vous ne voyez pas le changement immédiatement, cela peut être dû au cache de votre navigateur. Effacez le stockage de session de votre navigateur ou redémarrez-le.
Thème ConverseJS Vous pouvez choisir le thème à utiliser pour ConverseJS :
Thème Peertube : il s’agit d’un thème spécial, conçu spécialement pour l’intégration dans Peertube. Thème ConverseJS par défaut : c’est le thème ConverseJS par défaut. Thème ConverseJS cyberpunk : il s’agit d’un thème fourni par ConverseJS. Détection automatique des couleurs Essaie de détecter automatiquement les couleurs du thème courant de l’utilisateur⋅rice.
Quand ce paramètre est activé, le plugin essaie de détecter automatiquement les couleurs à appliquer au thème du tchat.
Si cela ne fonctionne pas correctement pour certains de vos thèmes Peertube, vous pouvez désactiver cette option. Vous pouvez rapporter les bugs sur le gestionnaire de ticket . N’oubliez pas de préciser pour quel thème cela ne fonctionne pas.
Attribut de style de l’iframe du tchat Styles additionnels à appliquer sur l’iframe du tchat.
Exemple : height:400px;
Paramètres avancés du tchat Utiliser le serveur Prosody installé sur le système Le plugin est livré avec une AppImage qui est utilisée pour exécuter le serveur XMPP Prosody. Si cet AppImage ne fonctionne pas, vous pouvez vous rabattre sur la version de Prosody qui est packagé pour votre serveur. Installez simplement le paquet prosody.
Ce paramètre ne devrait être utilisé que si le plugin est cassé et en attente d’un correctif.
Désactiver Websocket Avec Peertube >= 5.0.0, ce plugin va essayer d’utiliser Websocket pour les connexions au tchat. Si le navigateur de l’utilisateur⋅rice ou sa connexion n’est pas compatible, le navigateur va automatiquement passer au protocole BOSH. Mais, dans de rare cas, cela pourrait échouer. Par exemple si vous avez un reverse proxy devant votre Peertube qui ne permettrait pas les connexions Websocket. Dans ce cas, vous pouvez cocher cette option pour désactiver les connexions Websocket.
Port Prosody Le port qui va être utilisé par le serveur Prosody.
Changez-le si ce port est déjà utilisé sur votre serveur.
Vous pouvez fermer ce port sur votre pare-feu, il ne sera pas accédé par le monde extérieur.
Note : cela pourrait changer dans un futur proche, car il est prévu d’ajouter des paramètres pour autoriser les connexions externes.
Url Peertube pour les appels d’API Merci de ne pas toucher à ce paramètre si vous ne savez pas ce que vous faites.
Dans de rare cas, le serveur Prosody ne peut appeler l’API de Peertube en utilisant l’url publique. Vous pouvez utiliser ce paramètre pour personnaliser l’url que les modules Prosody utiliseront pour les API Peertube (par exemple, en mettant «http://localhost:9000» ou «http://127.0.0.1:9000»).
Si ce paramètre est laissé vide, et que vous utilisez Peertube >= 5.1, le plugin va utiliser les valeurs de votre fichier de configuration Peertube pour devenir sur quelle interface et quel port les requêtes doivent être faites.
En dernier recours, cela utilisera l’URI publique de votre instance. Donc les appels d’API passeront à traver Nginx. Cela peut échouer dans certains cas : par exemple si vous êtes dans un conteneur Docker pour lequel le hostname publique ne résoud pas sur la bonne IP. Dans ce cas, essayez de changer le paramètre “Url Peertube pour les appels d’API”, en mettant http ://127.0.0.1 :9000 (si c’est bien le port 9000 qui est utilisé par votre Peertube, demandez aux administrateur⋅rices de votre instance si vous ne savez pas).
Enregistrer les salons par défaut Si coché, le contenu des salons sera enregistré par défaut. Quand un⋅e utilisateur⋅rice rejoint un salon, iel pourra voir ce qui a été dit avant.
À noter qu’il est toujours possible d’activer/désactiver cette fonctionnalité pour un salon spécifique, en changeant ses paramètres.
Expiration des journaux de salon Vous pouvez choisir combien de temps le contenu des salons est gardé sur le serveur. La valeur peut être :
60 : le contenu sera sauvegardé pour 60 secondes. Vous pouvez remplacer 60 par n'importe quelle valeur entière. 1d : le contenu sera sauvegardé pour 1 jour. Vous pouvez remplacer 1 par n'importe quelle valeur entière. 1w : le contenu sera sauvegardé pour 1 semaine. Vous pouvez remplacer 1 par n'importe quelle valeur entière. 1m : le contenu sera sauvegardé pour 1 mois. Vous pouvez remplacer 1 par n'importe quelle valeur entière. 1y : le contenu sera sauvegardé pour 1 année. Vous pouvez remplacer 1 par n'importe quelle valeur entière. never : le contenu ne sera jamais effacé. Autoriser les connexions aux salons via des comptes XMPP externes En activant cette option, il sera possible de se connecter aux salons en utilisant des comptes XMPP externes via des clients XMPP.
Attention, activer cette option peut demander une configuration au niveau du serveur et des enregistrements DNS. Pour en savoir plus, merci de vous référer à la documentation: Autoriser les connexions avec des comptes XMPP externes. Port Prosody serveur vers serveur Le port à utiliser pour les connexions XMPP s2s (server to server).
Il est recommandé d’utiliser le port standard 5269. Sinon vous devrez configurer un enregistrement DNS spécifique .
Interfaces réseau pour les connexions serveur vers serveur Les interfaces réseau sur lesquelles écouter pour les connexions s2s (server to server).
Une liste d’IP séparées par des virgules (les espaces seront retirés). On pourra utiliser «*» pour écouter sur toutes les IPv4, et «::» pour toutes les IPv6.
Exemples de configuration possible:
*, :: * 127.0.0.1, ::1 172.18.0.42 Dossiers des certificats Si ce champ est vide, le plugin va générer et utiliser des certificats auto-signés.
Si vous voulez utiliser d’autres certificats, vous avez juste à spécifier ici le dossier où Prosody peut les trouver. Note : l’utilisateur «peertube» doit avoir un accès en lecture à ce dossier.
Activer les connexions client vers serveur Autoriser les clients XMPP à se connecter au serveur Prosody.
Cette option seule n’autorise que les connexions de clients sur le localhost.
Ce paramètre permet aux clients XMPP de se connecter au serveur Prosody intégré. Pour l’instant, cette option n’autorise que les connexions des clients sur le localhost.
Par exemple, cette option peut permettre à une instance Matterbridge (une fois qu’elle pourra utiliser une connexion anonyme) sur la même machine de faire le lien entre votre tchat et d’autres services tels qu’une salle Matrix.
Port Prosody client vers serveur Le port à utiliser pour les connexions XMPP c2s (client to server).
Les clients XMPP devront utiliser ce port pour se connecter.
Changez ce port si le port est déjà utilisé sur votre serveur.
Pour l’instant, vous pouvez garder ce port fermé sur votre pare-feu, il sera inaccessible depuis l’extérieur (Prosody n’écoute que le localhost).
Note : cela pourrait prochainement changer, car il est prévu d’ajouter une fonction permettant d’activer les connexions externes.
Interfaces réseau client vers serveur Les interfaces réseau sur lesquelles écouter pour les connexions c2s (client to server).
Ce paramètre est fourni pour les utilisateur⋅ices avancé⋅es. Ne changez pas ce paramètre si vous ne comprenez pas entièrement ce que cela signifie.<br< Une liste d’IP séparées par des virgules (les espaces seront retirés). On pourra utiliser «*» pour écouter sur toutes les IPv4, et «::» pour toutes les IPv6.
Exemples de configuration possible:
*, :: * 127.0.0.1, ::1 127.0.0.1, ::1, 172.18.0.42 Activer les composants externes personnalisés Prosody Ce paramètre permet aux composants externes XMPP de se connecter au serveur. Par défaut cette option n’autorise que les connexions des composants sur localhost. Vous devez changer la valeur du paramètre «Interfaces réseau pour les composants Prosody externes» pour écouter sur d’autres interfaces réseau.
Cette fonction pourrait être utilisée pour connecter des ponts ou des robots.
Plus d’informations sur les composants externes de Prosody [ici] (https://prosody.im/doc/components).
Activer les composants externes personnalisés Prosody Pour permettre l’utilisation de composants XMPP externes.
Cette option seule n’autorise que les connexions depuis le localhost.
Vous devez configurer les interfaces sur lesquelles écouter et ouvrir les ports sur votre pare-feu pour rendre cela disponible à des serveurs distants.
Cette fonctionnalité peut, par exemple, être utilisée pour connecter des bots aux salons.
Port pour les composants externe Prosody Le port à utiliser pour les XMPP components.
Changez ce port s’il est déjà utilisé sur votre serveur.
Vous pouvez garder ce port fermé sur votre pare-feu si vous n’autorisez pas l’accès sur les interfaces autre que localhost.
Interfaces réseau pour les composants Prosody externes Les interfaces réseau sur lesquelles écouter pour les composants externes.
Une liste d’IP séparées par des virgules (les espaces seront retirés). On pourra utiliser «*» pour écouter sur toutes les IPv4, et «::» pour toutes les IPv6.
Exemples :
*,:: * 127.0.0.1,::1 172.18.0.42 Composants externes Les composants externes à déclarer :
Un par ligne. Utilisez le format «nom_du_composant:passphrase_secrete» (les espaces seront retirés). Vous pouvez ajouter des commentaires: tout ce qui se trouve après un caractère # sera retiré, et les lignes vides ignorées. Le nom ne peut contenir que des caractères alphanumériques latins et des points. Si le nom ne contient que des caractères alphanumériques, il sera suffixé avec le domaine XMPP. Par exemple, «bridge» deviendra «bridge.votre_domaine.tld». Vous pouvez aussi spécifier un nom de domaine complet, mais vous devrez vous assurer que votre configuration DNS est correcte. N'utilisez que des caractères alphanumériques dans la passphrase secrète (utilisez au moins 15 caractères). Activer mod_firewall pour Prosody You can enable mod_firewall on your Prosody server.
For more information, please check the documentation.`,description:"Paramètres du Plugin Peertube Livechat",tags:[],title:"Paramètres",uri:"/peertube-plugin-livechat/fr/documentation/admin/settings/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice",content:`Rejoindre les salons de discussion Quand vous regardez une vidéo Peertube qui a le tchat activé, vous le verrez à coté de celle-ci :
Il y a deux cas d’usages légèrement différents, dépendant de si vous avez un compte sur l’instance Peertube ou non. Voir plus bas pour plus d’informations.
Si vous n’avez pas de compte Peertube Avertissement Cette fonction peut être désactivée par les administrateur⋅rices de l’instance.
Si vous n’êtes pas identifié⋅e sur l’instance Peertube où vous regardez la vidéo, vous allez automatiquement rejoindre le tchat. Un pseudonyme aléatoire vous sera assigné (quelque chose de la forme «Anonyme 12345»).
Avant de pouvoir parler dans le salon, vous allez devoir choisir un pseudonyme dans le champ au bas de la fenêtre.
Se connecter à l’aide d’un fournisseur d’authentification externe Avertissement Cette fonction peut être désactivée par les administrateur⋅rices de l’instance.
L’instance Peertube peut configurer des fournisseurs d’authentification externes (comptes Mastodon, comptes Google, …). Dans ce cas, vous verrez un bouton “Se connecter avec un compte externe”, qui ouvrira une boîte de dialogue modale. Dans cette modale de dialogue, il y aura des boutons pour se connecter en utilisant un compte distant.
Une fois que vous vous êtes connecté au compte distant et que l’accès vous a été accordé, votre pseudonyme et votre avatar (le cas échéant) seront automatiquement récupérés. Aucune autre donnée ne sera stockée. Ces données seront automatiquement supprimées quelques heures après que vous ayez quitté le tchat.
Si vous avez un compte Peertube Si vous êtes connecté avec votre compte Peertube, vous allez automatiquement rejoindre le salon, en utilisant votre pseudonyme Peertube et votre avatar.
Astuce Si vous regardez un direct sur une instance où vous n’avez pas de compte, mais que vous avez un compte Peertube sur une autre instance : sous réserve que le plugin livechat soit installé sur les deux instances, vous pouvez rejoindre le tchat avec votre compte. Pour cela, ouvrez la vidéo sur votre instance (vous pouvez par exemple copier/coller l’url de la vidéo dans le champs de recherche de votre instance).
Si vous avez un compte Peertube sur une autre instance Peertube Information Cette fonctionnalité arrive avec le plugin livechat version 9.0.0. Si vous avez un compte Peertube, mais pas sur l’instance courante, il y a un bouton “Se connecter avec un compte externe”. Ce bouton va ouvrir un fenêtre de dialogue où vous pourrez entrer l’URL de votre instance Peertube. Une fois celle-ci entrée, cela vérifiera sur le plugin livechat est disponible sur l’instance distante, et si la vidéo y est disponible. Dans ce cas, vous serez redirigé vers la vidéo sur l’instance distante.
Tchatter Pour envoyer des messages, saisissez les simplement dans le champ «message» en bas de l’écran. Vous pouvez les envoyer en tapant la touche entrée de votre clavier, ou en cliquant sur le bouton «envoyer».
Si vous voulez ajouter des retours à la ligne à vos messages, vous pouvez utiliser la combinaison de touche «shift + entrée».
Vous pouvez ajouter des emojis à vos messages. Vous pouvez par exemple utiliser le menu emojis, ou directement taper les raccourcis du type :smiley:.
Vous pouvez mentionner d’autres participant⋅es. Pour cela, vous pouvez taper les premières lettres du pseudo, puis appuyer sur la touche tabulation. Vous pouvez aussi taper le caractère @ : cela ouvrira directement un menu. Vous pouvez également cliquer sur un pseudonyme dans la liste des participant⋅es pour insérer celui-ci dans le champs de saisie de message.
Liste des participant⋅es Pour voir la liste des participant⋅es, ouvrez juste le menu droit :
Vous pouvez constater que certain⋅es participant⋅es ont des droits spéciaux (modérateur⋅rice, propriétaire, …).
Menu déroulant du tchat Il y a un menu déroulant au dessus du tchat, comprenant quelques fonctionnalités avancées. Cela est particulièrement utile pour les fonctions de modération. Les fonctionnalités disponibles dépendent de votre niveau d’accès.
Ouvrir en plein écran Au dessus du tchat, il y a un bouton qui permet de l’ouvrir en plein écran. Cela l’ouvrira dans un nouvel onglet du navigateur avec le contenu suivant :
Cela peut être plus facile de tchatter en utilisant un onglet de navigateur complet.
Changer de pseudonyme Vous pouvez changer de pseudonyme en tapant /nick votre_nouveau_pseudo dans le champs de message.
Vous pouvez également changer votre pseudonyme en utilisant le menu déroulant du tchat.`,description:"Comment tchater pour les spectateur⋅rices",tags:[],title:"Pour les spectateur⋅rices",uri:"/peertube-plugin-livechat/fr/documentation/user/viewers/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`This page describes the different source code folders and their content.
build files Files in the root dir that begins with build- are files used to build the plugin. See the package.json file for more information.
assets assets/images The assets/images folder contains all icons files used by the plugin.
There is also the assets/images/avatars folders, which contains avatars used for anonymous chat users. These files are used to generate multiple avatars (see the build-avatars.js script for more information).
assets/images/avatars/legacy contains legacy avatar set (livechat versions until 8.1.0 included) assets/images/avatars/sepia contains new sepia avatar set, based on the work of David Revoy (see copyright informations) assets/images/avatars/cat contains new cats avatar set, based on the work of David Revoy (see copyright informations) assets/images/avatars/bird contains new birds avatar set, based on the work of David Revoy (see copyright informations) assets/images/avatars/fenec contains new fenecs avatar set, based on the work of David Revoy (see copyright informations) assets/images/avatars/abstract contains new abstract avatar set, based on the work of David Revoy (see copyright informations) assets/styles The assets/styles folder contains the livechat plugin SCSS source files.
build The build folder is not part of the source code, but is used to put some files during the build process.
For example, build-conversejs.js use the folder build/conversejs to build a customized ConverseJS version.
client The client folder contains the front-end source code.
Files like client/common-client-plugin.ts, admin-plugin-client-plugin.ts, … are the base files that are loaded by Peertube for different “scopes” (common, videowatch, …). Please refer to the Peertube plugin documentation for more information.
conversejs The conversejs folder contains code relative to the use of ConverseJS.
conversejs/custom The conversejs/custom folder contains some files that are used to customize ConverseJS. See the build-conversejs.sh script for more information.
dist The dist folder is where goes all files created during the build process. It is not part of the source code.
documentation The folder documentation is deprecated. We only keep files in this folder to avoid dead links (links to these files were shared on many websites or social media posts).
The source code for the new documentation is in support/documentation/content/en, and is used to generate the documentation web site.
languages The folder languages contains the languages files. These files are translated using Weblate).
prosody-modules The prosody-modules folder contains some modules used by Prosody.
Some of them are “officials” plugins, others are specific to this plugin.
server The server folder contains the backend source code.
shared The shared folder contains comme code that will be used both on frontend and backend.
support/documentation The support/documentation contains the documentation source code.
vendor The vendor folder is not part of the source code. It is used during the build process to download some external source code.`,description:"Source code organization",tags:[],title:"Source code",uri:"/peertube-plugin-livechat/fr/technical/sourcecode/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses > Bot de tchat",content:`Interdire les caractères spéciaux Information Cette fonctionnalité arrive avec le plugin livechat version 12.0.0. Configuration En activant cette option, le robot de modération supprimera automatiquement les messages contenant plus de X caractères spéciaux. Les caractères spéciaux sont ceux qui n’entrent pas dans l’une de ces catégories : lettres, chiffres, symboles de ponctuation, symboles monétaires, émojis.
Tolérance Nombre de caractères spéciaux à accepter dans un message avant de le supprimer.
Raison Raison à affiche à côté des messages supprimés
Également modérer les messages des modérateur⋅rices Par défaut, les messages des modérateur⋅rices ne seront pas affectés par cette fonctionnalité. En cochant cette option, leur messages seront également supprimés.`,description:"The bot can automatically moderate messages containing too many special characters.",tags:[],title:"Special characters",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/bot/special_chars/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses > Bot de tchat",content:`Pas de message en double Information Cette fonctionnalité arrive avec le plugin livechat version 12.0.0. Configuration En activant cette option, le robot de modération modérera automatiquement les messages en double. Cela signifie que si un⋅e utilisateur⋅rice envoie deux fois le même message en l’espace de X secondes, le deuxième message sera supprimé.
Intervalle de temps Intervalle, en secondes, pendant lequel un⋅e utilisateur⋅rice ne peut pas renvoyer le même message.
Raison Raison à affiche à côté des messages supprimés
Également modérer les messages des modérateur⋅rices Par défaut, les messages des modérateur⋅rices ne seront pas affectés par cette fonctionnalité. En cochant cette option, leur messages seront également supprimés.`,description:"The bot can automatically moderate duplicate messages.",tags:[],title:"No duplicate message",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/bot/no_duplicate/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation administrateur⋅rice",content:`Les utilisateur⋅rices qui ne sont pas connecté⋅es à votre instance Peertube rejoignent le chat en utilisant des “comptes anonymes” (iels peuvent librement choisir un surnom, et se verront attribuer un avatar aléatoire).
Vous pouvez activer des méthodes d’authentification externes pour permettre aux utilisateur⋅rices de créer des comptes pour tchater. Dans ce cas, leur pseudo et leur avatar seront automatiquement initialisés avec les informations du compte distant.
Ces “utilisateur⋅rices de comptes externes” seront plus faciles à modérer que les comptes anonymes.
Cela permet également à l’utilisateur⋅ice de rejoindre le tchat sans créer de compte Peertube (dans le cas où votre instance a fermé l’enregistrement par exemple, ou sans attendre l’approbation du compte).
Cette page décrit les méthodes d’authentification disponibles.
Pour la documentation utilisateur⋅rice, veuillez vous référer à la page de documentation utilisateur⋅rice
OpenID Connect Avertissement Cette fonctionnalité est encore expérimentale. Cette fonctionnalité arrive avec le plugin livechat version >= 9.0.0.
Vous pouvez configurer un fournisseur externe compatible avec OpenID Connect.
Ainsi, vous pouvez par exemple utiliser votre site web pour l’authentification unique (Single Sign-On).
Les logiciels CMS les plus répandus (Wordpess, …) proposent des modules implémentant OpenID Connect.
Pour activer cette fonctionnalité, vous devez d’abord créer un client du côté de votre fournisseur (consultez la documentation relative à l’activation d’OpenID Connect). Ensuite, allez dans les paramètres du plugin, et activez “Utiliser un fournisseur OpenID Connect”.
Note : si vous souhaitez restreindre les urls de redirection autorisées du côté du fournisseur (bonne pratique de sécurité), le plugin vous indiquera l’url à autoriser. Il suffit de la copier dans la configuration de votre application OpenID Connect.
Vous devez maintenant remplir certains paramètres.
Libellé pour le bouton de connexion Ce libellé va être affiché aux utilisateur⋅rices, en tant que libellé du bouton de connection OIDC.
Il s’agit du libellé du bouton dans la capture d’écran suivante :
Pour l’instant il n’est pas possible de localiser ce libellé.
URL de découverte (Discovery URL) Votre fournisseur OpenID Connect doit implémenter l’URL de découverte (discovery URL). Définissez ici l’url de découverte, qui devrait être quelque chose comme https://example.com/.well-known/openid-configuration.
Note : si votre fournisseur utilise le chemin standard /.well-known/openid-configuration, vous pouvez l’omettre. Par exemple, https://accounts.google.com fonctionnera.
ID Client (Client ID) L’identifiant du client de votre application (Client ID).
Secret client (Client Secret) La clé secrète de votre application (Client secret).
Google, Facebook, … En plus de cela, vous pouvez également configurer un ou plusieurs fournisseurs Open ID Connect “standards” (Google, Facebook, …).
Pour ces fournisseurs, l’url de découverte et l’étiquette du bouton sont prédéfinies. Il suffit de créer une application OAuth2 du côté du fournisseur et de configurer l’ID et le secret du client.
Si vous pensez à un fournisseur standard qui n’est pas disponible, vous pouvez en demander la mise en œuvre en ouvrant un nouveau ticket.
En cas de problème Si le bouton n’apparaît pas pour les utilisateur⋅rices finaux, il se peut qu’il y ait un problème de configuration. Vous pouvez essayer l’outil de diagnostic pour obtenir plus d’informations.
Note : si vous êtes connecté⋅e à votre compte Peertube, le bouton ne s’affichera jamais. Utilisez une fenêtre de navigation privée pour tester.
Si le bouton s’affiche mais ne fonctionne pas, vérifiez les journaux de Peertube. Cela peut être dû au fait que le service distant n’utilise pas des scopes ou des noms d’attributs standard.
Plus à venir… D’autres méthodes d’authentification seront mises en œuvre à l’avenir.`,description:"Paramètres du Plugin Peertube Livechat - Authentification Externe",tags:[],title:"Authentification externe",uri:"/peertube-plugin-livechat/fr/documentation/admin/external_auth/index.html"},{breadcrumb:"Peertube livechat > Documentation",content:` Information Avant de mettre à jour le plugin vers une nouvelle version majeure, merci de lire les notes de version, et la liste des éventuelles modifications non rétro-compatibles : CHANGELOG.
Astuce Pour installer ou mettre à jour ce plugin, utilisez simplement l’interface web d’administration de votre Peertube.
Vous trouverez ci-dessous d’autres instructions :
En cas de problèmeQuelques erreurs classiques, et solutions de contournement.
Problème connu : compatibilité CPUPour l'instant le plugin ne supporte de base que les architectures CPU x86_64 et arm64. Veuillez trouver ici des instructions pour le faire fonctionner sur d'autres architectures CPU.
Mise à jour depuis une version antérieure à 6.0.0Notes importantes pour la mise à jour depuis une ancienne version du plugin.`,description:"Installation du plugin peertube-plugin-livechat",tags:[],title:"Documentation d'installation",uri:"/peertube-plugin-livechat/fr/documentation/installation/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses > Bot de tchat",content:`Vous pouvez configurer quelques mots qui seront automatiquement modérés par le bot (les messages contenant de tels mots seront instantanément supprimés). Vous pouvez aussi ajouter une raison optionnelle, qui sera affichée à la place des messages supprimés. Quelques exemples de configuration sont fournis sur la page de documentation.
Vous pouvez remplir plusieurs champs «Mots ou expressions interdites"». Quand un⋅e utilisateur⋅rice envoie un message qui correspond à l’un des critère configuré, le message sera automatiquement supprimé.
Mots ou expressions interdites Dans ce champs, vous pouvez mettre plusieurs mots, groupes de mots, ou «expressions régulières».
Un mot ou une expression par ligne. Si vous mettez plusieurs mots sur une même ligne, seuls les messages contenant la séquence entière seront supprimés.
Chaque fois qu’un⋅e utilisateur⋅rice envoi un message, ces mots seront testés. Si le message contient l’un d’entre eux, le message sera supprimé.
Vous pouvez par exemple remplir ce champs avec une liste d’insultes.
Pour avoir quelques exemples, merci de vous référer aux suggestions de mots interdits.
Si vous avez des listes de mots utiles, vous êtes les bienvenu⋅es pour contribuer à cette page de suggestion. Elles sont dans le dossier support/forbidden_words du code source. Veuillez vous référer au guide de contribution pour plus d’informations.
Astuce Ces mots ne sont pas sensibles à la casse.
Astuce Vous pouvez combiner un délai de modération court (1 seconde par exemple) avec le bot dé modération pour supprimer les messages contenant des gros mots avant même qu’un⋅e utilisateur⋅rice non-modérateur⋅rice ne les voie.
Avertissement Cette fonction est encore expérimentale. Il pourrait y avoir quelques problèmes avec les alphabets non-latin. Si c’est le cas, vous pouvez ouvrir un ticket pour signaler votre problème.
Considérer comme une expression régulière En cochant cette option, chaque ligne du champs «Mots ou expressions interdites» sera considéré comme une expression régulière.
Également modérer les messages des modérateur⋅rices Par défaut, les messages des modérateur⋅rices ne seront pas affectés par cette fonctionnalité. En cochant cette option, leur messages seront également supprimés.
Raison Raison à affiche à côté des messages supprimés
Commentaires Vous pouvez ajouter ici quelques commentaires sur cette règle, pour vous rappeler comment et pourquoi vous l’avez créé. Ces commentaires sont purement indicatifs, et n’ont pas d’influence sur le comportement du bot.`,description:"Le bot peut automatiquement modérer les messages contenant des mots interdits.",tags:[],title:"Mots interdits",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/bot/forbidden_words/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation d'installation",content:`L’AppImage Prosody inclue dans le plugin ne fonctionne que sur des CPU x86_64 et arm64. Elle n’est pas compatible avec d’autres architectures CPU.
Pour utiliser le plugin, vous allez devoir installer manuellement Prosody sur votre serveur (voir plus bas).
Note : la version de Prosody devrait être supérieure ou égale à 0.12.0. Si vous utilisez une version plus ancienne, il pourrait y avoir des bugs sur la fédération du tchat, et d’autres comportements inattendus.
Une fois cela fait, vous aurez à cocher le paramètre Use system Prosody du plugin.
Installation autres que Docker Pour les installations standard, vous avez juste à installer le paquet prosody officiellement disponible pour votre distribution linux.
Par exemple, sur Debian/Ubuntu :
sudo apt install prosodyVous pouvez alors désactiver le service qui démarre automatiquement quand vous installé le paquet (le plugin va lancer son propre processus Prosody, et n’a pas besoin que le service tourne sur le serveur). Par exemple, sur Debian/Ubuntu (et les autres distributions se basant sur Systemd) :
sudo systemctl disable prosody && sudo systemctl stop prosodyAttention : ne désactivez pas Prosody s’il est utilisé par un autre service sur votre serveur, par exemple pour Jitsi.
Docker Vous allez devoir générer une image de Peertube qui inclu Prosody dans le même conteneur que Peertube. Je sais que ce n’est pas la façon de faire standard avec Docker, mais gardez en tête que ceci est une solution de contournement temporaire.
Pour générer cette image, merci de vous référer à la documentation de Docker. Le fichier Docker pour générer l’image devrait être :
FROM chocobozzz/peertube:production-bullseye RUN apt -y update && apt install -y prosody && apt -y cleanYunohost Vous avez à désactiver metronome (le serveur XMPP utilisé par Yunohost), et installerprosody.
Ceci est déjà fait par l’application Yunohost Peertube, étant donné que c’était un pré-requis pour les version du plugin antérieures à la v6.0.0.
Mais il se pourrait que ce soit retiré de l’application Yunohost Peertube dans un futur proche (pour éviter les inconvénients de cette méthode). Je dois discuter avec l’équipe Yunohost, pour décider de la bonne façon de faire pour minimiser les inconvénients et maximiser la compatibilité.`,description:"Pour l'instant le plugin ne supporte de base que les architectures CPU x86_64 et arm64. Veuillez trouver ici des instructions pour le faire fonctionner sur d'autres architectures CPU.",tags:[],title:"Problème connu : compatibilité CPU",uri:"/peertube-plugin-livechat/fr/documentation/installation/cpu_compatibility/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:` Avertissement This page describes experimental features. These features are available with the plugin version >= 7.2.0.
Introduction Peertube is part of the Fediverse. So Peertube video can be watched from other Peertube instances, and from various other softwares:
from a Mastodon (or other fediverse application) instance, from a mobile app (Fedilab, Tusky, …), from desktop fediverse app, … This livechat plugin is using well known standards, so it is possible to join chat rooms even when not viewing the video on Peertube.
There are basically 2 ways to join the chat room associated to a video:
opening a web page (with an url like https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535), using a XMPP client (and joining a room like xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join) Avertissement Joining the chat using a XMPP client is not always possible. It requires some DNS and server configuration. It will only be possible if instance’s admins have correctly setup the external XMPP clients connection feature.
Avertissement Don’t try to gues these url and connection methods yourself. Please report to next chapters.
Chat discovery Using ActivityPub The livechat plugin adds some data in Video ActivityPub objects, so that the chat can be discovered.
Information This requires Peertube >= 5.1
This follows the FEP-1970 recommendations.
Avertissement At the time of the writing, this FEP is in draft status, and the livechat plugin is a Proof-of-concept. Until the FEP is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
Basically, the chat will be declared as attachments on the Video object, using the discussion relation.
By default, here is an example of what you will get:
{ "@context": [ "https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1", { "RsaSignature2017": "https://w3id.org/security#RsaSignature2017" }, { // ... } ], "to": [ "https://www.w3.org/ns/activitystreams#Public" ], "cc": [ "https://yourinstance.tld/accounts/root/followers" ], "type": "Video", "id": "https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535", "name": "The video title", // ... "url": [ /* ... */ ], "attachment": [ { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" } ] }In case the instance has activated the external XMPP clients connection feature:
{ "@context": [ "https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1", { "RsaSignature2017": "https://w3id.org/security#RsaSignature2017" }, { // ... } ], "to": [ "https://www.w3.org/ns/activitystreams#Public" ], "cc": [ "https://yourinstance.tld/accounts/root/followers" ], "type": "Video", "id": "https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535", "name": "The video title", // ... "url": [ /* ... */ ], "attachment": [ { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" }, { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join" } ] }Algorithm If you want to display the chat in a web page or in an iframe, here is what you should do:
get the Video ActivityPub object, if there is no attachment key, stop. loop through the attachment values (if attachment is not an array, just iterate on this single value) search for an entry with rel === discussion, and with href using the https scheme (that begins with https://) if found, open this href If you want to open the chat room using the XMPP protocol:
get the Video ActivityPub object, if there is no attachment key, stop. loop through the attachment values (if attachment is not an array, just iterate on this single value) search for an entry with rel === discussion, and with href using the xmpp scheme (that begins with xmpp://) if found, open this xmpp uri with your client, or connect to the XMPP room at that address Additional notes In the ActivityPub object, there is also a peertubeLiveChat entry. Don’t use the content of this entry. This is specific to the livechat plugin, and can be changed or removed in a near future. It is currently required for some endpoint discovery.
Using Podcast RSS feed The livechat plugin adds some data in Podcast RSS feeds under the <podcast:liveItem>, so that the chat can be discovered for live streams.
Information This requires Peertube >= 5.2
Information The <podcast:chat> element is currently only supported for live streams.
This follows the <podcast:chat> proposal.
Avertissement At the time of the writing, this proposal is in draft status, and the livechat plugin is a Proof-of-concept. Until the proposal is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
Basically, the chat will be declared as tag under on the <podcast:liveItem> element.
By default, here is an example of what you will get:
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z"> <title>The video title</title> <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid> <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link> <podcast:socialInteract uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" protocol="activitypub" accountUrl="https://yourinstance.tld/a/youraccount" /> <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" /> <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true"> <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" /> </podcast:alternateEnclosure> <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" /> <podcast:chat server="yourinstance.tld" protocol="xmpp" embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" /> </podcast:liveItem>In case the instance has activated the external XMPP clients connection feature:
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z"> <title>The video title</title> <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid> <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link> <podcast:socialInteract uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" protocol="activitypub" accountUrl="https://yourinstance.tld/a/youraccount" /> <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" /> <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true"> <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" /> </podcast:alternateEnclosure> <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" /> <podcast:chat server="yourinstance.tld" protocol="xmpp" space="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld" embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" /> </podcast:liveItem>Algorithm If you want to display the chat in a web page or in an iframe, here is what you should do:
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub if there is no <podcast:chat> element under the <podcast:liveItem>, stop. loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and an embedUrl attribute if found, open this embedUrl If you want to open the chat room using the XMPP protocol:
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and a space attribute space should be an XMPP JID for a MUC if found, open this XMPP JID with your client after converting it to a join URI, or connect to the XMPP room at that address `,description:"Displaying the livechat with 3rd party software.",tags:[],title:"Third party",uri:"/peertube-plugin-livechat/fr/technical/thirdparty/index.html"},{breadcrumb:"Peertube livechat > Contribuer",content:`Vous pouvez contribuer à la traduction de ce plugin Peertube. Les traductions sont gérées par le logiciel Weblate, via l’instance Weblate de Framasoft.
Avertissement Ne modifiez jamais directement les fichiers dans le dossier languages du plugin, vous risqueriez de créer des conflits.
Comment faire Créez-vous un compte : https://weblate.framasoft.org/accounts/register/ Validez votre email en cliquant sur le lien reçu Choisissez votre mot de passe, et configurez votre compte Allez sur le projet du plugin de tchat : https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/ Choisissez la langue que vous voulez traduire Il ne vous reste plus qu’à ajouter les traductions manquantes, ou corriger celles qui vous semblent erronées. Avertissement Il peut y avoir des chaînes «assez techniques». Si vous n’êtes pas sûr⋅e à 100% du sens, ou de la traduction, il vaut mieux ne pas la traduire du tout ; ainsi la version anglaise s’affichera.
Traductions de ConverseJS Ce plugin s’appuie sur ConverseJS pour l’affichage du tchat. ConverseJS a ses propres traductions, sur sa propre instance Weblate. Vous pouvez également traduire directement dans le dépôt de code. Pour plus d’information, veuillez vous référer à la documentation de traduction de ConverseJS.
Ajouter une nouvelle langue Si la langue qui vous intéresse n’est pas présente, assurez-vous d’abord qu’elle est bien supportée par Peertube. Si c’est le cas, vous pouvez ouvrir un ticket pour en demander l’ajout.
Ajout de nouveau segment / utilisation dans le code Si vous travaillez sur une nouvelle fonctionnalité, et que vous avez besoin de nouveaux segments, créez les directement dans Weblate. La version anglaise est obligatoire, commencez par celle-ci.
Chaque segment est lié à une clé (par exemple use_chat). Choisissez une clé en anglais, suffisamment explicite, et en minuscule.
Si vous avez besoin de tester vos localisations sans attendre la fusion venant de Weblate, vous pouvez modifier les fichiers languages/*.yml, mais évitez de les commit (pour minimiser le risque de conflits).
Utiliser un segment dans le code front-end Avant d’utiliser une chaîne en front-end, il faut déclarer une nouvelle constante dans client/@types/global.d.ts. La constante doit :
commencer par le préfixe “LOC_” utiliser la clé de la chaîne, en majuscule vous ne devez déclarer que son type, pas sa valeur Par exemple, pour utiliser “use_chat”, vous devez déclarer :
declare const LOC_USE_CHAT: stringLe script build-client.js va lire ce fichier client/@types/global.d.ts, chercher pour de telles constantes, et charger leurs valeurs depuis le fichier de langue.
Vous pouvez maintenant utiliser peertubeHelpers.translate(LOC_USE_CHAT) dans votre code.
Utiliser un segment dans le code back-end En théorie, les seules parties du code qui ont besoin de traductions sont les déclarations de paramètres et la génération de données standardisées (ActivityPub, RSS, …). Ici on a besoin de récupérer les chaînes anglaises à partir des clés de traduction.
Note : vous ne devriez jamais avoir besoin d’autres langues que l’anglais pour le code backend. Les traductions doivent se faire coté front-end.
Il y a un module lib/loc.ts qui fourni une function loc(). Passez juste la clé pour récupérer la phrase anglaise : loc('diagnostic').
Traduction de la documentation La traduction de la documentation est faite en utilisant le composant Weblate correspondant.
Il y a un «shortcode Hugo» spécifique qui vous permet d’afficher une chaîne issue de l’application. Si vous voulez par exemple afficher le libellé du bouton «open_chat_new_window», vous pouvez utiliser le code suivant dans le fichier markdown de la documentation :
{{% livechat_label open_chat_new_window %}}Vous pouvez également empêcher qu’une page entière ne soit traduite en ajoutant livechatnotranslation:true dans la section Yaml Font Matter du fichier :
--- title: "Third party" description: "Displaying the livechat with 3rd party software." weight: 20 chapter: false livechatnotranslation: true ---Ne traduisez jamais une chaîne dans le fichier livechat.en.pot, ce serait ignoré. À la place, éditez directement le fichier markdown.
Si une chaîne contient un lien, vous pouvez le changer pour le lien correct dans la langue cible. Par exemple, si c’est un lien vers la documentation, vous pouvez ajouter le code langue dans l’url.
Certaines chaînes sont des blocs de code. Ne les traduisez pas. Toutefois vous pouver traduire les commentaires, ou les paramètres si c’est pertinent.
Si vous avez un doute, ne traduisez pas, et demandez plutôt quoi faire.
L’outils utilisé pour gérer les traductions de la documentation peut avoir des comportements étranges. Quand j’ajoute une phrase qui ressemble à une phrase existante, il va parfois copier les traductions. Donc quand vous avez des traductions marquées comme «à vérifier», veuillez vous assurer qu’il n’a pas copié une traduction qui n’a rien à voir avec la version anglaise avant de valider.
Si vous n’êtes pas sûr du contexte d’une chaîne de texte, vous pouvez vérifier l’emplacement de la chaîne source dans le panneau droit de Weblate, et ouvrir la page de documentation correspondante. Par exemple, pour une chaîne localisée dans le fichier support/documentation/content/en/documentation/user/streamers.md, l’url correspondante est https://livingston.frama.io/peertube-plugin-livechat/documentation/user/streamers/.
Recommandations génériques Merci d’être inclusif⋅ve dans vos phrasés, et merci de respecter le code de conduite.`,description:"Traduire le plugin",tags:[],title:"Traduction",uri:"/peertube-plugin-livechat/fr/contributing/translate/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation administrateur⋅rice > Usage avancé",content:`Ce module de tchat repose sur le protocole XMPP, aussi connu sous le nom de Jabber. Il est donc possible de se connecter aux tchats en utilisant des logiciels clients XMPP. Cela peut par exemple être utile pour faciliter les opérations de modération.
Pour la documentation utilisateur⋅rice associé à ces fonctionnalités, veuillez vous référer à la page de documentation utilisateur⋅rice.
Information L’activation de ces fonctionnalités demande des changements de configuration sur le serveur, et sur les enregistrements DNS. Il n’est pas possible de les activer uniquement depuis l’interface de Peertube, et cela demande d’avoir quelques compétences basiques d’admin système.
Connexion à votre compte Peertube Avertissement Cette fonctionnalité n’est pas encore disponible, et viendra dans une prochaine version du plugin.
Connexion en utilisant un compte XMPP externe Pour activer cette fonctionnalité, il va falloir paraméter votre serveur et vos enregistrements DNS, de sorte que les clients XMPP puissent trouver et accéder au serveur Prosody que ce plugin utilise en interne.
Paramètres du plugin Commencez par aller dans les paramètres du plugin livechat de votre instance, puis activez le paramètre «Autoriser les connexions aux salons via des comptes XMPP externes». En cochant celui-ci, de nouveaux champs apparaissent en dessous.
Tout d’abord, le champs «Port Prosody serveur vers serveur». Celui-ci prend par défaut la valeur 5269, qui est le port standard pour ce service. Vous pouvez toutefois changer pour un autre port, si celui-ci est déjà utilisé sur votre serveur.
Ensuite, le champs «Interfaces réseau pour les connexions serveur vers serveur» vous permet d’indiquer sur quelles interfaces réseau le serveur doit écouter. La valeur par défaut «*, ::» indique d’écouter sur toutes les addresses IP. Vous pouvez changer ces valeurs, si vous souhaiter n’écouter que sur certaines IP. La syntaxe est expliquée à coté du champs.
Pour le champs «Dossiers des certificats», vous pouvez le laisser vide. Dans ce cas là, le plugin va générer automatiquement des certificats auto-signés. Il se pourrait que certains serveurs XMPP refusent de se connecter, cela dépendant de leur paramétrage. Dans ce cas, vous pouvez indiquer ici un chemin sur le serveur, dans lequel vous placerez des certificats à utiliser par le module. Charge à vous de les générer et de les renouveller. Voir plus loin pour une explication plus détaillée.
Pare-feu Vous devez ouvrir le port configuré (5269 par défaut) sur votre pare-feu.
Si vous utilisez Docker pour votre Peertube, il faut modifier le fichier docker-compose.yml pour ouvrir le port 5269 du conteneur peertube au monde extérieur.
DNS Vous devez ajouter des enregistrements DNS permettant aux serveurs distant de trouver les composants «room.votre_instance.tld» et «external.votre_instance.tld».
Le plus simple pour cela est d’ajouter des enregistrements SRV pour les sous-domaines «room» et «external» :
nom de l’enregistrement : _xmpp-server._tcp.room.votre_instance.tld. (remplacez «votre_instance.tld» par la valeur adéquate)
TTL: 3600
class: IN
SRV: 0
priority: 0
weight: 5
port: 5269 (adaptez si vous avez changé le port)
target: votre_instance.tld. (remplacez par la valeur adéquate)
nom de l’enregistrement : _xmpp-server._tcp.external.votre_instance.tld. (remplacez «votre_instance.tld» par la valeur adéquate)
TTL: 3600
class: IN
SRV: 0
priority: 0
weight: 5
port: 5269 (adaptez si vous avez changé le port)
target: votre_instance.tld. (remplacez par la valeur adéquate)
Attention à bien conserver le point après «votre_instance.tld».
En utilisant la commande dig pour vérifier vos enregistrements, vous devriez obtenir un résultat similaire à celui-ci :
$ dig +short _xmpp-server._tcp.room.videos.john-livingston.fr. SRV 0 5 5269 videos.john-livingston.fr. $ dig +short _xmpp-server._tcp.external.videos.john-livingston.fr. SRV 0 5 5269 videos.john-livingston.fr.Si vous n’utilisez pas le port standard 5269, vous devez ajouter un autre enregistrement SRV pour _xmpp-server._tcp.votre_instance.tld. (pareil que précédemment, mais en enlevant le préfixe room.). Bien sûr, vous pouvez l’ajouter même si vous utilisez le port standard. Cela fonctionnera également.
Utilisation de certificats de confiance Les certificats auto-signés que le plugin utilise par défaut peuvent ne pas convenir à tous les serveurs distants. En effet, ceux-ci peuvent les refuser pour raison de sécurité.
Il est possible d’utiliser des certificats validés par une autorité de certification. Cependant cela demande des connaissances d’administration système avancées. En effet, devant la multitude de cas possibles, il est impossible de documenter ici toutes les situations. La présente documentation va donc se contenter de vous expliquer le but à atteindre, et donner un example qui ne conviendra qu’à une situation «basique» (installation manuelle de Peertube, avec utilisation de letsencrypt). Si vous êtes dans une autre situation (installation Docker, certificats signés par une autre autorité, etc…), il vous faudra adapter la démarche.
Principe de base À vous de générer des certificats valides pour les domaines votre_instance.tld et room.votre_instance.tld. Vous pouvez utiliser n’importe quelle méthode supportées par Prosody.
Vous devez ensuite placer ces certificats dans un dossier qui sera accessible au user peertube, puis indiquer ce dossier dans le paramètre du plugin «Dossiers des certificats».
Astuce If you want to use the ProsodyCtl utility to import certificates, this utility is available (once Peertube is started) using the following command (adapting the path to your Peertube data folder, and replacing “xxx” with the arguments you wish to pass to prosodyctl): sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua xxx
Le plugin va vérifier une fois par jour si des fichiers ont été modifiés dans ce dossier, et recharger Prosody le cas échéant.
Méthode dans le cas simple Nous supposons ici que votre installation de Peertube est «classique» (pas d’utilisation de Docker), et que les certificats sont générés par letsencrypt, en utilisant l’outils certbot.
Tout d’abord, on va devoir créer un certificat pour le sous-domain room.votre_instance.tld : c’est l’uri du composant MUC (salons de discussion XMPP). Même si les connections se font sur votre_instance.tld, il va nous falloir un certificat valide pour ce sous-domaine.
Commencez donc par paramétrer une entrée DNS pour room.votre_instance.tld, qui pointe sur votre serveur. Vous pouvez tout à fait faire une entrée CNAME (ou une entrée A et une entrée AAAA).
Ensuite, nous allons utiliser nginx (déjà installé pour votre Peertube) pour générer le certificat certbot. On va créer un nouveau site. Dans le fichier /etc/nginx/site-available/room.peertube, ajoutez :
server { listen 80; listen [::]:80; server_name room.votre_instance.tld; location /.well-known/acme-challenge/ { default_type "text/plain"; root /var/www/certbot; } location / { return 301 https://votre_instance.tld; } }Ensuite on active ce site :
ln -s /etc/nginx/sites-available/room.peertube /etc/nginx/sites-enabled/ systemc reload nginxOn prépare ensuite le dossier dans lequel on va plus tard importer les certificats. On suppose ici que vous avez déjà le plugin actif. On va créer le dossier suivant (s’il n’existe pas déjà), avec le user peertube pour être sûr qu’il n’y a pas de problème de droits :
sudo -u peertube mkdir /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/certsIl faut maintenant configurer ce dossier dans les paramètres du plugin, pour «Dossiers des certificats». C’est important de le faire avant la suite, sinon le script d’import des certificats va les placer au mauvais endroit.
On va configurer certbot pour qu’il importe les certificats générés dans le dossier de Prosody. On va pouvoir utiliser l’utilistaire ProsodyCtl packagé dans le plugin.
Note : pour qu’il soit disponible, il faut que le plugin ai démarré au moins une fois.
On va créer un fichier /etc/letsencrypt/renewal-hooks/deploy/prosody.sh contenant :
#!/bin/sh /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl \\ --root \\ --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ cert import \\ room.votre_instance.tld votre_instance.tld /etc/letsencrypt/livePuis on demande à générer le certificat :
certbot -d room.videos.john-livingston.frSi certbot vous propose plusieurs méthodes pour générer le certificat, choisissez «nginx».
Normalement vous devriez maintenant trouver les certificats dans le dossier configuré.
Note : la première fois que vous faites tout ça, il va falloir recharger Prosody. Le plus simple pour cela est de redémarrer Peertube.
Méthode en cas d’utilisation de Docker Cette méthode marche avec le guide Docker officiel de Peertube.
Tout d’abord, assurez-vous de créer une entrée DNS pour room.your_instance.tld, qui pointe vers votre serveur. Vous pouvez utiliser une entrée CNAME (ou une entrée A et une entrée AAAA). Ceci est nécessaire pour que Let’s Encrypt valide le domaine pour la génération du certificat.
Entrez le répertoire où se trouve votre fichier docker-compose.yml.
Ouvrez un shell dans le conteneur certbot :
docker exec -it certbot /bin/shLancez certbot :
certbotUne série d’invites vous sera présentée. Entrez 2 pour le type d’authentification :
How would you like to authenticate with the ACME CA? Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2Enter the domain name room.your_instance.tld:
Please enter the domain name(s) you would like on your certificate (comma and/or space separated) (Enter 'c' to cancel): room.your_instance.tldEnter the directory where the PeerTube webserver serves requests for Let’s Encrypt, /var/www/certbot:
Input the webroot for <room.your_instance.tld>: (Enter 'c' to cancel): /var/www/certbotVous devriez obtenir un résultat semblable à celui qui suit :
Successfully received certificate. Certificate is saved at: /etc/letsencrypt/live/room.your_instance.tld/fullchain.pem Key is saved at: /etc/letsencrypt/live/room.your_instance.tld/privkey.pemExécutez la commande suivante à l’intérieur du conteneur certbot pour donner un accès en lecture aux nouveaux certificats et clés privées au groupe peertube. Note : Cette commande rendra également les fichiers accessibles en lecture au groupe dont l’identifiant est 999 sur le système hôte. Vérifiez les groupes sur votre système pour évaluer le risque avant d’exécuter cette commande.
chown -R root:999 /etc/letsencrypt/live; \\ chmod 750 /etc/letsencrypt/live; \\ chown -R root:999 /etc/letsencrypt/archive; \\ chmod 750 /etc/letsencrypt/archive; \\ find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} \\;Sortez du conteneur certbot :
exitModifiez votre fichier docker-compose.yml, en changeant la ligne entrypoint sous le service certbot par ce qui suit. C’est la même chose que ci-dessus, mais elle doit être exécutée automatiquement après chaque renouvellement de certificat.
entrypoint: /bin/sh -c "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot; chown -R root:999 /etc/letsencrypt/live; chmod 750 /etc/letsencrypt/live; chown -R root:999 /etc/letsencrypt/archive; chmod 750 /etc/letsencrypt/archive; find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} +; sleep 12h & wait $\${!}; done;"En continuant à modifier docker-compose.yml, ajoutez le volume certbot dans le conteneur peertube. Il devrait ressembler à ceci :
volumes: - ./docker-volume/certbot/conf:/etc/letsencryptRedémarrez vos services :
docker-compose down; docker-comopse up -dDans les paramètres du plugin livechat à partir des paramètres d’administration de PeerTube, définissez le répertoire des certificats comme suit :
/etc/letsencrypt/liveSauvegardez les paramètres du plugin et vérifiez que Prosody peut voir les certificats :
docker-compose exec -u peertube \\ peertube \\ /data/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun \\ prosodyctl \\ --config /data/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ check certsEn cas de problème Si cela ne fonctionne pas, vous pouvez utiliser l’outils de diagnostic (un bouton se trouve en haut de la page des paramètres du plugin), et notamment regarder ce que dit la section «Prosody check».`,description:"Autoriser la connexion en utilisant des clients XMPP",tags:[],title:"Clients XMPP",uri:"/peertube-plugin-livechat/fr/documentation/admin/advanced/xmpp_clients/index.html"},{breadcrumb:"Peertube livechat > Documentation",content:` ParamètresParamètres du Plugin Peertube Livechat
Authentification externeParamètres du Plugin Peertube Livechat - Authentification Externe
Prosody mod_firewallAdvanced firewall rules for the Prosody server
Usage avancéQuelques fonctionnalités avancées
Clients XMPPAutoriser la connexion en utilisant des clients XMPP
Utiliser MatterbridgeUtiliser Matterbridge pour faire un pont vers d'autres tchats`,description:"Administration du Plugin Peertube Livechat",tags:[],title:"Documentation administrateur⋅rice",uri:"/peertube-plugin-livechat/fr/documentation/admin/index.html"},{breadcrumb:"Peertube livechat > Contribuer",content:"Vous n’avez pas besoin de coder pour commencer à contribuer à ce plugin ! Les autres formes de contributions sont également précieuses, parmis lesquelles : vous pouvez tester le plugin et remonter les bugs que vous rencontrez, partager vos retours d’expérience, proposer des fonctionnalités qui vous intéressent, remonter vos remarques sur l’interface, le design, etc.",description:"Donnez vos retours",tags:[],title:"Donnez vos retours",uri:"/peertube-plugin-livechat/fr/contributing/feedback/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses > Bot de tchat",content:`Vous pouvez configurer quelques timers qui enverront des messages à intervalle régulier. Ces messages seront envoyés par le bot toutes les X minutes. Vous pouvez par exemple faire en sorte que le bot envoie des informations de sponsoring toutes les 5 minutes.
Astuce S’il n’y a pas d’utilisateur⋅rice dans le salon, le bot n’enverra pas de message.
Timer Vous pouvez configurer quelques timers qui enverront des messages à intervalle régulier. Ces messages seront envoyés par le bot toutes les X minutes. Vous pouvez par exemple faire en sorte que le bot envoie des informations de sponsoring toutes les 5 minutes.
Un message par ligne. S’il y a plusieurs messages, le bot en choisira un aléatoirement toutes les X minutes.
Envoyer toutes les X minutes Le bot enverra les messages toutes les X minutes`,description:"Le bot peut envoyer des messages périodiquement.",tags:[],title:"Messages pré-enregistrés",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/bot/quotes/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation administrateur⋅rice",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 11.0.0. You can enable mod_firewall on your Prosody server.
Doing so, Peertube admins will be able to define advanced firewall rules.
Avertissement These rules could be used to run arbitrary code on the server. If you are a hosting provider, and you don’t want to allow Peertube admins to write such rules, you can disable the online editing by creating a disable_mod_firewall_editing file in the plugin directory (plugins/data/peertube-plugin-livechat/disable_mod_firewall_editing). This is opt-out, as Peertube admins can already run arbitrary code just by installing any plugin. You can still use mod_firewall by editing files directly on the server.
Edit rules First, you must enable the feature in the plugin settings.
Just bellow the settings, you will find a “Configure mod_firewall” button. This button will open a configuration page.
Here you can add several configuration files.
You can enable/disable each files.
Files will be loaded in the alphabetical order. You can use a number as prefix to easily choose the order.
Information You can also edit these firewall rules directly on the server, in the plugins/data/peertube-plugin-livechat/prosody/mod_firewall_config/ directory. File names must only contains alphanumerical characters, underscores and hyphens. The extension must be .pfw, or .pfw.disabled if you want to disable a file. Please be sure that the peertube system user has write access to these files, else the web editing interface will fail. Once you have edited these files, you must reload prosody. This can be done by saving the plugin settings, or saving the mod_firewall configuration in the web interface, or by restarting Peertube.
When you save the configuration, the server will automatically reload it, and your rules will apply immediatly. You can check that there is no parsing error in the Prosody error log. To do so, you can read the plugins/data/peertube-plugin-livechat/prosody/prosody.err file, or use the diagnostic tool that will show last Prosody errors.
Examples Don’t hesitate to share your rules. To do so, you can for example edit this page.`,description:"Advanced firewall rules for the Prosody server",tags:[],title:"Prosody mod_firewall",uri:"/peertube-plugin-livechat/fr/documentation/admin/mod_firewall/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses > Bot de tchat",content:`Vous pouvez configurer le bot pour répondre à des commandes. Une commande est un message qui commence par un “!”, comme par exemple “!help” qui appellera la commande “help”.
Vous pouvez paramétrer différentes commandes.
Commande La commande, sans le “!” au début. Par exemple “help”, “sponsor”, …
Message Le message à envoyer.`,description:"Le bot peut répondre à différentes commandes.",tags:[],title:"Commandes",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/bot/commands/index.html"},{breadcrumb:"Peertube livechat > Contribuer",content:`Toujours annoncer les fonctionnalités sur lesquelles vous voulez travailler en créant un ticket ou en commentant un ticket existant, avant de commencer à travailler dessus.Et annoncez clairement à la communauté que vous commencez à travailler dessus. Ceci afin d’éviter que plusieurs personnes travaillent sur la même chose et entrent en conflit.
Les Pull Request sont à faire sur la branche main.
Remarque Jusqu’à mars 2023, il fallait contribuer sur la branche develop. Cette procédure est désormais obsolète.
Pré-requis pour compiler le plugin Il est hautement recommandé d’être familier avec les concepts suivants :
Git NodeJS NPM Typescript Pour construire le module, vous avez besoin d’avoir installé les paquets suivants :
git npm (>=8.x) nodejs (>=14.x) build-essential coreutils wget reuse Veuillez noter que ce plugin a besoin d’une AppImage du serveur XMPP Prosody. Cette AppImage est fournie par le project Prosody AppImage. Le script build-prosody.sh télécharge les binaires attachés à ce dépôt distant, et vérifie que les sommes de contrôles sha256 sont correctes.
Développer Clonez le dépôt, construisez le plugin, et créez votre branche de fonctionnalité :
# Cloner le dépot. N'oubliez pas le --recursive, pour clôner les sous-modules. git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git --recursive cd peertube-plugin-livechat # Installer les dépendances NPM et compiler le plugin pour la première fois : npm install # Compiler le plugin après une modification : npm run build # Si vous avez un fork du dépot, ajoutez le en remote (exemple) : git remote add me git@github.com:MON_COMPTE_GITHUB/peertube-plugin-livechat.git # Créez une branche locale pour vos développements et placez vous dessus (exemple) : git checkout mon_developpement # NB: si un ticket y est associé, utilisé le nom fix_1234 (où 1234 est le numéro du ticket) # Pour proposer vos modifications, poussez votre branche sur votre dépot (exemple) : git push --set-upstream me mon_developpement # Rendez-vous ensuite sur votre dépot github avec votre navigateur web pour proposer la Pull Request (voir les instructions complémentaires ci-dessous)Quand vous êtes prêt⋅e à montrer votre code pour avoir un retour, soumettez une Pull Request draft. Quand vous êtes prêt⋅e pour une relecture de code avant merge, soumettez une Pull Request. Dans tous les cas, merci de lier votre Pull Request au ticket concerné en utilisant la syntax de GitHub : «fixes #issue_number».
Le code du front-end est dans le dossier client. Le code backend dans server. Il y a du code partagé entre les deux dans shared.
Pour les instructions génériques concernant le développement de plugins (building, installation, …), merci de vous référer à la documentation Peertube.
Vous pouvez builder le plugin avec des infos de debug supplémentaires en utilisant :
NODE_ENV=dev npm run buildCe plugin est conforme à la norme REUSE : il utilise des en-têtes SPDX pour identifier les informations de licence de son code source. Plus d’informations sur le site REUSE. Vous pouvez utiliser l’outil en ligne de commande reuse pour vous aider à mettre à jour les en-têtes. La commande npm run lint utilisera la commande reuse pour vérifier la conformité. N’oubliez pas d’ajouter vos informations de copyright dans les en-têtes SPDX lorsque vous modifiez du code.
ESBuild versus Typescript Ce plugin utilise ESBuild pour compiler le code front-end, comme le plugin peertube-plugin-quickstart officiel. ESBuild peut gérer Typescript, mais ne vérifie pas les types (voir la documentation ESBuild). C’est pourquoi on compile d’abord Typescript avec l’option -noEmit, juste pour vérifier les types (check:client:ts dans le fichier package.json). Ensuite, si tout est ok, on lance ESBuild pour générer le javascript compilé.
Debug Mode Il existe un mode de debug pour le plugin, qui va raccourcir le délais de certaines actions. Par exemple, il va faire tourner les journaux toutes les deux minutes, au lieu de tous les jours. Cela permet de tester plus facilement certaines actions, pour lesquelles il faudrait normalement attendre des heures ou des jours.
Pour activer ce mode, il suffit de créer un fichier /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/debug_mode (en adaptant /var/www/peertube/storage/ à votre installation le cas échéant).
La simple existance de ce fichier suffit à déclencher le mode debug. Pour être sûr qu’il est pris en compte, vous pouvez redémarrer votre instance Peertube.
Ce fichier peut également contenir du JSON qui pourra activer d’autres options. Pour en avoir la liste, vous pouvez regarder le code de server/lib/debug.ts. Redémarrez Peertube après chaque modification de son contenu.
Avertissement N’activer jamais ce mode sur un serveur de production, ni même sur un serveur public. Cela pourrait poser des problèmes de sécurité.
Redémarrer Prosody Pour redémarrer Prosody quand le mode debug est activé, vous pouvez appeler l’API http://votre_instance.tld/plugins/livechat/router/api/restart_prosody. Cet appel n’a pas besoin d’authentification. Il peut se faire depuis une ligne de commande, par exemple avec \`curl http://votre_instance.tld/plugins/livechat/router/api/restart_prosody.
debugger Prosody Il est possible de connecter l’AppImage Prosody à un debugger distant en utilisant MobDebug.
Pour cela, placer MobDebug dans un dossier accessible par le user peertube. Ensuite, ajouter cela dans le fichier debug_mode du plugin :
{ "debug_prosody": { "debugger_path": "/le_chemin_vers_mobdebug/src", "host": "localhost", "port": "8172" } }host et port sont optionnels. debugger_path doit pointer vers le dossier où se trouve le fichier .lua de MobDebug.
Redémarrer Peertube.
Lancer votre serveur de debug.
Pour que Prosody se connecte au debugger, appelez l’API http://votre_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true. Cet appel n’a pas besoin d’authentification. Il peut se faire depuis une ligne de commande, par exemple avec curl http://votre_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true. Vous pouvez même configurer votre serveur de debuggage pour lancer cette commande automatiquement.
Prosody va alors redémarrer en se connectant au debugger.
Environnement de développement rapide via Docker Un tutoriel est disponible sur le forum Peertube pour expliquer comment monter rapidement un environnement de développement en utilisant Docker.
Un dépot a été crée sur la base de ce tutoriel : pt-plugin-dev.
Note : pour une raison obscure, Prosody n’arrive pas à résoudre les adresses DNS des conteneurs quand la librairie lua-unbound est utilisée. Pour contourner cela, il y a un «dirty hack» : il suffit de créer une fichier /data/plugins/data/peertube-plugin-livechat/no_lua_unbound dans vos docker-volumes, puis de les redémarrer.
Reconstruire et installer rapidement le plugin Lorsque vous faites des modifications, vous n’avez pas besoin de reconstruire le projet complet, et de réinstaller le plugin sur votre environnement de développement. Vous pouvez ne construire que la partie modifiée (par exemple, si vous n’avez modifié que les fichiers clients : npm run build:client). Vous trouverez la liste des scripts de construction disponibles dans le fichier package.json.
Lorsque le plugin est déjà installé sur votre instance de développement, et que vous n’avez modifié aucune dépendance, vous pouvez installer rapidement votre travail en suivant les étapes suivantes :
reconstruire les parties nécessaires du plugin (client, styles, …), écraser le contenu de data/plugins/node_modules/peertube-plugin-livechat/dist/ de votre instance de développement par le contenu du dossier dist du plugin, changer récursivement le propriétaire des fichiers plugins/node_modules/peertube-plugin-livechat/dist/ pour votre utilisateur peertube, Redémarrez votre instance. Tests de performance Le dépôt livechat-perf-test contient quelques outils pour effectuer des tests de performance. Ils peuvent être utilisés pour évaluer les améliorations du code source, ou trouver les goulots d’étranglement.`,description:"Développer",tags:[],title:"Développer",uri:"/peertube-plugin-livechat/fr/contributing/develop/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice",content:`OBS est un logiciel populaire de diffusion en direct, libre et open source, avec des capacités avancées pour vos diffusions. Dans la présente page, vous allez trouver quelques conseils pour gérer les tchats de vos directs en utilisant OBS.
Overlay OBS Vous pouvez facilement inclure le tchat dans votre flux vidéo.
Vous pouvez utiliser la fonction «Partager le lien du salon de discussion» pour générer une URL vers votre tchat. Le bouton devrait se trouver près du tchat si vous êtes le⋅a propriétaire de la vidéo (à moins qu’il n’ait été désactivé par les administrateur⋅rices de votre serveur).
Cochez la case à cocher «Lecture seule» dans la modale.
Utilisez alors ce lien en tant que «source navigateur web» dans OBS.
Vous pouvez utiliser l’option «Arrière plan transparent (pour l’intégration dans le stream, avec OBS par exemple)» pour obtenir un fond transparent dans OBS. Si vous souhaitez personnaliser la transparence de l’arrière-plan, vous pouvez ajouter ce CSS dans les paramètres de la source navigateur dans OBS :
:root { --livechat-transparent: rgba(255 255 255 / 90%) !important; } Dans l’extrait CSS précédent, vous pouvez bien sûr changer la couleur ou la transparence, en adaptant les valeurs de couleur.
Remarque : vous pouvez personnaliser les couleurs. Ce n’est pas encore documenté, mais vous pouvez essayer ceci : dans la fenêtre modale, cochez «utiliser les couleurs actuelles du thème», puis essayez de modifier manuellement les valeurs de couleur dans l’URL. Vous devez utiliser des valeurs de couleur CSS valides, et elles doivent être correctement encodées dans l’URL.
Dock OBS Information Cette fonctionnalité arrive avec le plugin livechat version 10.1.0. Avertissement Cette fonction peut être désactivée par les administrateur⋅rices de l’instance.
Vous pouvez utiliser les “Dock internet personnalisés” d’OBS pour intégrer le tchat dans votre OBS pendant le direct. Le plugin livechat offre la possibilité de créer un jeton à long terme qui peut vous identifier automatiquement pour rejoindre le tchat, de sorte que vous n’ayez pas à entrer votre mot de passe dans OBS.
Pour ce faire, il suffit d’utiliser la fonctionnalité “Partager le lien du salon de discussion” et d’ouvrir l’onglet “Dock”. À partir de là, vous pouvez créer un nouveau jeton en utilisant le bouton “+”.
Ensuite, copiez l’URL et utilisez le menu “Docks / Docks internet personnalisés” de votre OBS pour ajouter un dock avec cette URL.
Une fois que vous l’aurez fait, vous aurez un nouveau dock connecté au tchat avec votre compte.
Astuce Les jetons sont valables pour rejoindre n’importe quel salon de discussion. Vous n’avez pas besoin de générer des tokens séparés pour chacun de vos salons. Vous pouvez également personnaliser le pseudo qui sera utilisé en changeant le paramètre n dans l’url.
Ne communiquez ces liens à personne, car ils leur permettraient de se connecter en tant que vous-même.
Si un jeton est compromis ou n’est plus nécessaire, vous pouvez le révoquer.
Information Ces jetons peuvent être utilisés à d’autres fins, comme la connexion à votre compte avec des robots ou des clients XMPP. Cette fonctionnalité n’est pas encore documentée et n’est pas officiellement supportée. Il convient donc de l’utiliser avec précaution.
Mélanger plusieurs tchats dans votre flux en direct Vous pouvez utiliser l’extension social_stream browser extension pour mélanger plusieurs sources de tchat (Peertube, Twitch, Youtube, Facebook, …) et inclure leurs contenus dans votre flux en direct. La compatibilité avec ce plugin a été ajoutée dans les versions récentes.`,description:"Documentation pour diffuser le contenu du tchat à l'aide d'OBS.",tags:[],title:"OBS",uri:"/peertube-plugin-livechat/fr/documentation/user/obs/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation administrateur⋅rice",content:` Clients XMPPAutoriser la connexion en utilisant des clients XMPP
Utiliser MatterbridgeUtiliser Matterbridge pour faire un pont vers d'autres tchats`,description:"Quelques fonctionnalités avancées",tags:[],title:"Usage avancé",uri:"/peertube-plugin-livechat/fr/documentation/admin/advanced/index.html"},{breadcrumb:"Peertube livechat > Contribuer",content:`Généralités Toujours vous annoncer avant de commencer à travailler (en créant un ticket ou en commentant un ticket existant). Ceci afin d’éviter que plusieurs personnes travaillent sur la même chose et entrent en conflit.
Le travail de documentation se fait sur la branche main.
Le code source de la documentation se trouve dans le dossier support/documentation/content du dépot de code.
La documentation est générée via l’outils Hugo. Celui-ci doit être installé sur votre machine pour pouvoir prévisualiser la documentation.
The minimum required version for Hugo is 0.121.0. It was tested using version 0.132.2.
The used theme is hugo-theme-relearn. You should read its documentation before starting editing the documentation.
Quand une version du plugin est publiée, ou quand la documentation est mise à jour, les mainteneur⋅euses du plugin fusionnerons la branche main dans la branche documentation. Ce qui aura pour effet de déclencher les pipelines github et gitlab pour mettre à jour les versions publiées.
Traductions La langue principale est l’anglais (code en).
Le dossier support/documentation/content/enne contient que les fichiers de documentation en anglais.
La documentation est traduite en utilisant Weblate (voir la documentation sur la traduction). Pour cela, on utilise l’outils po4a, comme nous le verrons plus loin dans cette page.
Ajout d’une nouvelle langue Dans le fichier support/documentation/config.toml, inspirez vous de la section [Languages.fr] pour déclarer la nouvelle langue.
Si les traductions ne sont pas complètes, ce n’est pas grave, la version anglaise sera utilisée pour les chaînes manquantes.
Prévisualiser Pour prévisualiser vos modification, il suffit de lancer :
hugo serve -s support/documentation/ Puis d’ouvrir votre navigateur à l’adresse http://localhost:1313/peertube-plugin-livechat/. Cette page se raffraichira automatiquement à chaque modification.
Mettre à jour les fichiers de localisation et générer les traductions de la documentation Pour l’instant, vous n’avez que la version anglaise. Pour mettre à jour les chaînes et générer les traductions, vous devez lancer le script doc-translate.sh.
Pour cela, assurez vous d’avoir po4a (version >= 0.69) installé sur votre ordinateur.
Avertissement Certaines distributions linux (comme Debian Bullseye par exemple) ont une version trop ancienne de po4a. Veillez à installer une version compatible. Si vous utilisez Debian Bullseye par exemple, vous pouvez télécharger le fichier Bookworm po4a.deb depuis https://packages.debian.org, et l’installer manuellement.
Pour gérer les traductions, il suffit de faire :
npm run doc:translate Vous pouvez ensuite prévisualiser le résultat en utilisant hugo serve -s support/documentation/, et en utilisant le sélecteur de langue.
Écrire la documentation Éditez seulement les fichiers anglais dans support/documentation/content/en.
Ensuite, avant de commiter, lancez toujours npm run doc:translate, afin que les changements dans les fichiers anglais puissent être propagés dans le fichier support/documentation/po/livechat.en.pot.
Vous pouvez utiliser le code court livechat_label pour utiliser des chaînes de l’application. Voir ici : Traduction de la documentation.
Il est possible d’empêcher un fichier d’être traduit, en utilisant livechatnotranslation : true dans la section Yaml Font Matter. Voir ici : Traduction de la documentation.
Veuillez utiliser l’option livechatnotranslation pour la documentation technique. Nous ne voulons pas traduire la documentation technique, afin d’éviter les problèmes liés à une mauvaise traduction.
Pour faciliter le travail des traducteur⋅rices, évitez de faire des paragraphes trop longs.
Pour l’instant il n’est pas possible d’utiliser des tableaux Markdown : les outils de translation ne savent pas les gérer.
Avertissement There may be links to this documentation elsewhere on the web. Try not to change the urls of the documentation pages. Or at the very least, put links to the new location on the previous url.
When a new feature is released, you can use the livechat_version_notice short code to display an infobox with the version with which the features is available. This short code takes the version number as parameter. Here is an example:
Information Cette fonctionnalité arrive avec le plugin livechat version 12.0.0. Que faire si je ne peux pas utiliser hugo et/ou po4a ? Il suffit d’éditer les fichiers markdown en anglais, et de spécifier que vous ne pouvez pas compiler les traductions lorsque vous faites votre Pull Request.
Publication La publication de la documentation est automatique, dès que les modifications sont fusionnées dans la branche documentation.`,description:"Documenter le plugin, ou traduire la documentation.",tags:[],title:"Documentation",uri:"/peertube-plugin-livechat/fr/contributing/document/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation d'installation",content:`IMPORTANT NOTE Depuis la version v6.0.0, ce plugin ne nécessite plus l’installation de Prosody.
Si vous utilisiez ce plugin avant, et que vous aviez installé Prosody manuellement, vous pouvez le désinstaller en tout sécurité.
Si vous utilisiez l’image docker spéciale de Peertube (qui incluais Prosody), vous pouvez basculer sur l’image officielle de Peertube.`,description:"Notes importantes pour la mise à jour depuis une ancienne version du plugin.",tags:[],title:"Mise à jour depuis une version antérieure à 6.0.0",uri:"/peertube-plugin-livechat/fr/documentation/installation/upgrade_before_6.0.0/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin stores some data on the server, in the /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/ folder. This page describes these data.
prosody The prosody folder is used by the Prosody XMPP server to store its data and logs.
prosodyAppImage This plugin uses the Prosoxy XMPP server in background. This server code is embedded as an AppImage.
When the plugin starts, it deflate this AppImage in the prosodyAppImage folder.
serverInfos To handle federation between Peertube instances, the plugin needs to store some information concerning remote instances (available protocols, …).
The plugin stores these data in the serverInfos/instance_uri folder (where instance_uri is replaced by the instance uri).
In each instance’s folder, there can be these files:
last-update: json file containing the timestamp of the last information update. So we can avoid refreshing too often. ws-s2s: if the server allows XMPP S2S Websocket connections, here are the endpoint information s2s: if the server allows direct XMPP S2S connections, here are the port and url information videoInfos To handle federation the plugin needs to store some information about remote videos.
So, each time we open a new remote chat, a file videoInfos/remote/instance_uri/video_uuid.json is created (where instance_uri is the origin instance uri, and video_uuid is the video uuid).
This JSON files contain some data about the remote chat (is it enabled, are anonymous users authorized, which protocol can we use, …). These data can then be read by the Prosody server to connect to the remote chat.
Moreover, when the current instance builds such data for local videos, it stores it in videoInfos/local/video_uuid.json (where video_uuid is the video uuid).
channelConfigurationOptions The channelConfigurationOptions folder contains JSON files describing channels advanced configuration. Filenames are like 1.json where 1 is the channel id. The content of the files are similar to the content sent by the front-end when saving these configuration.
room-channel/muc_domain.json Some parts of the plugin need a quick way to get the channel id from the room Jabber ID, or the all room Jabber ID from a channel id. We won’t use SQL queries, because we only want such information for video that have a chatroom.
So we will store in the room-channel/muc_domain.json file (where muc_domain is the current MUC domain, something like room.instance.tld) a JSON object representing these relations).
In the JSON object, keys are the channel ID (as string), values are arrays of strings representing the rooms JIDs local part (without the MUC domain).
When a chatroom is created, the corresponding entry will be added.
Here is a sample file:
{ "1": [ "8df24108-6e70-4fc8-b1cc-f2db7fcdd535" ] }This file is loaded at the plugin startup into an object that can manipulate these data.
So we can easily list all rooms for a given channel id or get the channel id for a room JID (Jabber ID).
Note: we include the MUC domain (room.instance.tld) in the filename in case the instance domain changes. In such case, existing rooms could get lost, and we want a way to ignore them to avoid gettings errors.
Note: there could be some inconsistencies, when video or rooms are deleted. The code must take this into account, and always double check room or channel existence. There will be some cleaning batch, to delete deprecated files.
bot/muc_domain The bot/muc_domain (where muc_domain is the current MUC domain) folder contains configuration files that are read by the moderation bot. This bot uses the xmppjs-chat-bot package.
Note: we include the MUC domain (room.instance.tld) in the dirname in case the instance domain changes. In such case, existing rooms could get lost, and we want a way to ignore them to avoid gettings errors.
bot/muc_domain/moderation.json The bot/muc_domain/moderation.json file contains the moderation bot global configuration. This bot uses the xmppjs-chat-bot package, see it’s README file for more information.
Note: this includes the bot username and password. Don’t let it leak.
bot/muc_domain/rooms The bot/muc_domain/rooms folder contains room configuration files. See the xmppjs-chat-bot package help for more information.
emojis/channel The emojis/channel folder contains custom emojis definitions for channels.
For example, the channel 1 will contain:
emojis/channel/1/definition.json: the JSON file containing the emojis definitions emojis/channel/1/files/42.png: N image files (png, jpg, …), using numbers as filenames. tokens The tokens folder contains long term token to connect to the chat. See the LivechatProsodyAuth class for more information.`,description:"Data files and folders used on the server",tags:[],title:"Plugin storage",uri:"/peertube-plugin-livechat/fr/technical/data/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation administrateur⋅rice > Usage avancé",content:`Ce qui suit est basé sur un tutoriel pour utiliser Matterbridge avec le plugin : Matterbridge + Peertube
Pré-requis Plugin PeerTube livechat version 3.2.0 ou supérieure. Matterbridge version 1.22.4 ou supérieure. La solution la plus simple consiste à faire tourner l’instance PeerTube et Matterbridge sur le même serveur.
Connexions internes uniquement (version simple) Vous devez activer Activer les connexions client vers serveur dans les paramètres du plugin livechat.
Cela permettra aux clients XMPP de l’hôte local de se connecter au serveur XMPP Prosody.
Vous devrez peut-être ajouter une ligne à votre /etc/hosts :
127.0.0.1 anon.example.org room.example.org Remplacez example.org par le nom de domaine de votre instance. Vous pouvez ensuite poursuivre avec la configuration de Matterbridge ci-dessous.
Autoriser les connexions externes (avancé) Par défaut, le serveur interne XMPP Prosody n’écoute que sur localhost (127.0.0.1).
Sur les versions de livechat >= 10.1.0, un nouvel appel d’option interfaces client vers serveur a été ajouté pour permettre de changer cela.
Cela permet d’ajouter une liste d’adresses IP sur lesquelles écouter, séparées par des virgules (les espaces seront supprimés).
Vous pouvez également utiliser * pour écouter sur toutes les interfaces IPv4, et :: pour toutes les interfaces IPv6. Cela permet un accès externe à l’interface client-serveur.
Ensuite, vous devez ouvrir le port C2S (par défaut 52822, mais vérifiez les paramètres du plugin pour obtenir la valeur actuelle) dans votre pare-feu afin qu’il soit accessible depuis l’internet. Si vous ne souhaitez pas utiliser les connexions C2S pour autre chose que votre service Matterbridge, vous devriez restreindre l’accès à ce port à l’IP de votre serveur Matterbridge.
Vous devez également ajouter des enregistrements DNS (A et AAAA) pour anon.example.org et room.example.org (remplacez example.org par votre nom de domaine actuel).
Si vous utilisez un port autre que 5222 (port standard XMPP), vous devez également définir l’enregistrement SRV xmpp-client sur le port correct.
Configurer Matterbridge Dans la version 1.22.4, Matterbridge a ajouté la prise en charge des connexions anonymes XMPP, nécessaires pour se connecter au serveur Prosody intégré.
Ainsi, dans le fichier de configuration TOML, il faut mettre :
[xmpp.mypeertube] Anonymous=true Server="anon.example.org:52822" Muc="room.example.org" Nick="Matterbridge" RemoteNickFormat="[{PROTOCOL}] <{NICK}> " NoTLS=true Remplacez example.org par le nom de domaine de votre instance. Remplacez 52822 par le port actuel si vous l’avez changé. mypeertube peut être remplacé par un autre nom. L’utilisation de peertube comme pseudonyme (Nick) fournira l’icône PeerTube pour les messages superposés, ce qui peut également être fait avec la modification de la configuration de la superposition. Le paramètre NoTLS=true permet de se connecter à un serveur avec des certificats auto-signés. Vous pouvez désormais ajouter ce compte aux passerelles et faire le pont des canaux de tchat.
Information Cette documentation utilise un compte anonyme pour connecter la passerelle au tchat. Mais depuis la version 10.1.0 de livechat, il existe une nouvelle façon de générer un jeton d’authentification à long terme, qui permet de se connecter en utilisant son compte. Ceci est utilisé pour les docks OBS. L’utilisation de cette fonctionnalité à d’autres fins n’est pas documentée et n’est pas encore officiellement supportée. Si vous voulez l’utiliser quand même, vous pouvez demander un jeton en appelant le point de terminaison /plugins/livechat/router/api/auth/tokens. Pour obtenir les en-têtes et le corps de requête nécessaires, regardez simplement ce qui se passe lorsque vous générez un nouveau jeton pour les docks OBS.`,description:"Utiliser Matterbridge pour faire un pont vers d'autres tchats",tags:[],title:"Utiliser Matterbridge",uri:"/peertube-plugin-livechat/fr/documentation/admin/advanced/matterbridge/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice",content:`Ce module de tchat repose sur le protocole XMPP, aussi connu sous le nom de Jabber. Il est donc possible de se connecter aux tchats en utilisant des logiciels clients XMPP. Cela peut par exemple être utile pour faciliter les opérations de modération.
Information Les fonctions décrites dans cette page doivent être activées et configurées par les administrateur⋅rices de votre instance Peertube. Il se peut donc que vous n’y ayez pas accès.
Connexion à votre compte Peertube Avertissement Cette fonctionnalité n’est pas encore disponible, et viendra dans une prochaine version du plugin.
Connexion en utilisant un compte XMPP externe Si cette fonctionnalité est activée sur votre instance, vous pouvez vous connecter aux tchats Peertube en utilisant un compte XMPP quelconque.
Pour obtenir l’adresse du salon à rejoindre, vous pouvez utiliser la fenêtre de «partage» du tchat, dont le bouton est situé au dessus du tchat :
Information Par défaut, le bouton de partage n’est visible que pour le ou la propriétaire de la vidéo, et les admins/modérateur⋅rices de l’instance. Toutefois, les admins peuvent décider d’afficher ce bouton pour tout le monde.
Then, choose “Connexion avec un client XMPP”:
Il vous suffit ensuite, soit de cliquer sur «ouvrir», soit de copier/coller l’adresse du salon dans votre client XMPP (en utilisant la fonctionnalité «rejoindre un salon»).`,description:"Se connecter au tchat avec un client XMPP",tags:[],title:"Clients XMPP",uri:"/peertube-plugin-livechat/fr/documentation/user/xmpp_clients/index.html"},{breadcrumb:"Peertube livechat",content:`Intéressé⋅e pour contribuer ? Super !
Code de conduiteConvention de Code de conduite Contributeur⋅rices
TraductionTraduire le plugin
Donnez vos retoursDonnez vos retours
DévelopperDévelopper
DocumentationDocumenter le plugin, ou traduire la documentation.`,description:"Contribuer",tags:[],title:"Contribuer",uri:"/peertube-plugin-livechat/fr/contributing/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a “slow mode” feature, to rate limit the number of messages that a user can send to a given MUC room. At time of writing, there were no XEP to describe such feature. Please find below a XEP draft, that will be submitted for review.
Avertissement Work In Progress, this page is not done yet. For an updated version of this document, you can check the draft XEP XMP file.
XEP: MUC Slow Mode Abstract: This specification describes a way to rate limit messages a single user can send to a MUC room, from the room configuration to the server and client handling of such a feature.
Author: John Livingston
1. Introduction There are some contexts in which you want to be able to rate limit MUC messages. This could have multiple motivations: avoid flooding, garantee a better readability of the room when there are hundreds of active users, …
This specification propose a new option to MUC rooms, allowing room owners to fix a duration that users MUST wait between two messages. We will also specify how the server MUST reject messages send too quickly, and how clients SHOULD handle this feature (by preventing users to send messages without waiting the delay to be over).
2. Terminology Clients: the client software used by end-users to join MUC rooms.
Moderator: A room role that is usually associated with room admins but that can be granted to non-admins.
MUC: The multi-user chat protocol for text-based conferencing.
Participant: An occupant who does not have admin status; in a moderated room, a participant is further defined as having voice (in contrast to a visitor). A participant has a role of “participant”.
Role: A temporary position or privilege level within a room, distinct from a user’s long-lived affiliation with the room; the possible roles are “moderator”, “participant”, and “visitor” (it is also possible to have no defined role). A role lasts only for the duration of an occupant’s visit to a room. See XEP-0045.
Room administrator: A user empowered by the room owner to perform administrative functions such as banning users; however, a room administrator is not allowed to change the room configuration or to destroy the room. An admin has an affiliation of “admin”. See XEP-0045.
Room owner: users that have special access to a room, and that can edit room configuration. See XEP-0045 - Owner Use Cases.
Service Discovery Extensions: XEP-0128: Service Discovery Extensions.
Slow Mode: feature allowing to rate limit user messages in a MUC room.
Slow Mode duration: when the Slow Mode feature is active, specifies the duration, in seconds, users must wait between two text messages.
3. Requirements This document addresses the following requirements:
How to allow room owners to enable and configure the feature by editing the MUC room discovery information. How to enable and configure the feature without allowing room owners to change the configuration. How the server MUST reject messages that does not respect the parameters. How clients SHOULD handle rooms with such feature enabled. 4. MUC configuration 4.1 Activating Slow Mode in the MUC Room configuration Your implementation MAY allow the Slow Mode feature to be set room by room, by its owners.
If room owners can configure the Slow Mode feature, the server MUST add a muc#roomconfig_slow_mode_duration field in the room configuration form.
This field MUST have its type equal to text-single.
This field SHOULD use Data Forms Validation, having its datatype equal to xs:integer.
The value of the field MUST be a positive integer, so you MUST add a range validation, as described in RFC-0122.
0 value means that the slow mode is disabled for this room. Any positive value is the duration, in seconds, users must wait between two messages.
Here is an example of response the server could send when a client is querying room configuration form:
<iq from='coven@chat.shakespeare.lit' id='config1' to='crone1@shakespeare.lit/desktop' type='result'> <query xmlns='http://jabber.org/protocol/muc#owner'> <x xmlns='jabber:x:data' type='form'> <title>Configuration for "coven" Room</title> <instructions> Complete this form to modify the configuration of your room. </instructions> <field type='hidden' var='FORM_TYPE'> <value>http://jabber.org/protocol/muc#roomconfig</value> </field> <field var='muc#roomconfig_slow_mode_duration' type='text-single' label='Slow Mode (0=disabled, any positive integer= users can send a message every X seconds.)' > <validate xmlns='http://jabber.org/protocol/xdata-validate' datatype='xs:integer'> <range min='0'/> </validate> <value>20</value> </field> <!-- and any other field... --> </x> </query> </iq>If the configuration is changed, the server SHOULD send a status code 104, as specified in XEP-0045 - Notification of configuration changes.
4.2 Client discovering The feature can be enabled on a room:
by the room owner, if your implementation allow them to set this option by a server-wide parameter In other words: you can enable this feature, without adding the field in the room configuration form. This allows for example server admins to apply a rate limit server-wide, or to set the slow mode programmatically on any wanted criteria (number of users in the room, current server load, room context, …).
In any case, to allow clients to discover that the feature is active, the server MUST respond on room information queries by adding a muc#roominfo_slow_mode_duration field. This field type MUST be text-single, and its value MUST be a positive integer.
0 value means that the slow mode is disabled for this room. Any positive value is the duration, in seconds, users must wait between two messages. Any invalid (non-positive integer) value sent by the server MUST be considered as equal to 0 (in case of a bad implementation).
Here is an example of response the server could send when a client is querying room information:
<iq from='coven@chat.shakespeare.lit' id='ik3vs715' to='hag66@shakespeare.lit/pda' type='result'> <query xmlns='http://jabber.org/protocol/disco#info'> <identity category='conference' name='The place to be' type='text'/> <feature var='http://jabber.org/protocol/muc'/> <x xmlns='jabber:x:data' type='result'> <field var='FORM_TYPE' type='hidden'> <value>http://jabber.org/protocol/muc#roominfo</value> </field> <field var='muc#roominfo_slow_mode_duration' type='text-single'> <value>2</value> </field> <!-- and any other field... --> </x> </query> </iq>If the slow mode duration has changed (either because the room configuration was modified, or because a server parameter has changed), the server SHOULD send a status code 104, as specified in XEP-0045 - Notification of configuration changes.
5. Server-side rate limiting When the Slow Mode is enabled, server MUST NOT accept two consecutive messages from the same user, to the same room, until the slow mode duration has elapsed. Only messages containing at least one <body/> element must be taking into account (to avoid counting chatstate messages for example).
Room administrators and owners MUST NOT be rate limited.
If a user bypass the limit, the server MUST reply an error stanza, that respects RFC 6120, especially:
error_type MUST be wait, as described in RFC 6120 - Stanzas error - Syntax, error_condition MUST be policy-violation, as described in RFC 6120 - Stanzas error - Defined Stream Error Conditions, the stanza SHOULD contain a <text> element explaining why the message was rejected, and this message SHOULD mention the slow mode duration so that user can understand why they can’t post their message. Here is an example or error stanza:
<message xmlns="jabber:client" type="error" to="crone1@shakespeare.lit/desktop" id="528df978-aa6b-422a-b987-056a810c4733" from="coven@chat.shakespeare.lit" > <error type="wait"> <policy-violation xmlns="urn:ietf:params:xml:ns:xmpp-stanzas" /> <text xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"> You have exceeded the limit imposed by the slow mode in this room. You have to wait 2 seconds between messages. Please try again later </text> </error> </message>6. Client handling When a participant joins a room, the client SHOULD request room information as described in section “4.2 Client discovering”, and look for the muc#roominfo_slow_mode_duration field.
If this field is present, and contains a valid strictly positive integer value, the client SHOULD display an information somewhere, to tell users that there is a slow mode limitation that applies to this room. This information MAY also be displayed to users for which the rate limit does not apply (administrators, owners, …).
Moreover, each time a participant sends a text message, the client SHOULD prevent the user to send another message before the timeout is passed. This MAY be done either by disabling the input field, or the submit button. If the user has at least the administrator acces level, the client SHOULD NOT disable the input field or the submit button.
To avoid some frustrating behaviour, in case there is some lag on the server for example, the client MAY start counting time after receiving the message echo. Indeed, if the first message is processed with some delay by the server, it could consider that the duration is not passed yet when receiving the next one.
7. Security Considerations As a same user can join a room with multiple sessions and/or nicknames, the server MUST use the appropriate key to identify the account, and apply the same limits to all user’s sessions.
Appendices Appendix A: Document information TO BE DONE
Appendix B: Author Information John Livingston
Website: https://www.john-livingston.fr
Appendix C: Legal Notices TO BE DONE
Appendix D: Relation to XMPP The Extensible Messaging and Presence Protocol (XMPP) is defined in the XMPP Core (RFC 6120) and XMPP IM (RFC 6121) specifications contributed by the XMPP Standards Foundation to the Internet Standards Process, which is managed by the Internet Engineering Task Force in accordance with RFC 2026. Any protocol defined in this document has been developed outside the Internet Standards Process and is to be understood as an extension to XMPP rather than as an evolution, development, or modification of XMPP itself.
Appendix E: Discussion Venue TO BE DONE
Appendix F: Requirements Conformance The following requirements keywords as used in this document are to be interpreted as described in RFC 2119: “MUST”, “SHALL”, “REQUIRED”; “MUST NOT”, “SHALL NOT”; “SHOULD”, “RECOMMENDED”; “SHOULD NOT”, “NOT RECOMMENDED”; “MAY”, “OPTIONAL”.`,description:"MUC Slow mode XEP",tags:[],title:"MUC Slow mode",uri:"/peertube-plugin-livechat/fr/technical/slow_mode/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The poll system relies on two thinks:
mod_muc_polls Prosody module on the backend polls Converse plugin on the frontend Backend mod_muc_polls is a Prosody modules that implements polls in MUC. This module could be used on any Prosody server, and has no code specific to the livechat plugin.
The way this module works could be standardized one day, by writing a XEP.
Poll creation This module adds the http://jabber.org/protocol/muc#x-poll disco features on muc-disco#info.
Room’s owner and admin can retrieve a http://jabber.org/protocol/muc#x-poll form by sending the relevant iq query. This forms contains relevant fields (the poll question, the duration, choices, …). Once the form submitted, a new poll is created. Any previous existing poll will end (if not already ended).
The current poll is stored in room._data.current_poll.
For now, any ended poll is not kept.
Poll starts When a poll is started, a groupchat message is broadcasted in the MUC room. This message is sent in the name of the poll creator (same from, same occupant-id). This message contains the question, the different choices, and some instructions (in english).
This message also contains some specific XML tags. These tags could be use by any compatible client to display the poll as they want.
Here an Example of this start message:
<message id='25Plgjj2TdemFuomNuKZ9bxRQFLbiVHwc8_4' to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client' from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root' type='groupchat'> <body>The poll question 1: Choice 1 label 2: Choice 2 label Send a message with an exclamation mark followed by your choice number to vote. Example: !1 </body> <occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/> <x-poll id='_eZQ4j4YLHTK' xmlns='http://jabber.org/protocol/muc#x-poll-message' end='1720177157' votes='0'> <x-poll-question>The poll question</x-poll-question> <x-poll-choice choice='1' votes='0'>Choice 1 label</x-poll-choice> <x-poll-choice choice='2' votes='0'>Choice 2 label</x-poll-choice> </x-poll> <stanza-id xmlns='urn:xmpp:sid:0' id='dOASuopT9kW5OgAKvhZo0Irm' by='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost'/> </message>Note: the end attribute is the poll end date timestamp. The votes attributes are the number of votes (total on x-poll and per choice on each x-poll-choice tag). The choice attribute is the key to use to vote for this choice (choice='1' can by voted by sending !1).
Poll votes Users can then vote by sending messages in the room, using the format “!1”.
These groupchat messages will be intercepted by the module, and counted as votes.
If the “anonymous votes” feature is enabled, vote will be taken into account, but the message will be bounced with an error saying: “Your vote is taken into account. Votes are anonymous, they will not be shown to other participants.”
This means that you can vote with any XMPP clients!
If an occupant votes multiple times, their vote will be updated.
If an occupant is muted (has visitor role), votes won’t be counted.
When there are new votes, messages are broadcated so that compatible clients can update the current vote progress. These messages are debounced: the module waits 5 seconds after a vote to send the update message, and only send one for all votes that were done in those 5 seconds. These messages are groupchat message without body, and with some specific urn:xmpp:hints. They contains the x-poll tag with same meta data as above. The message is also sent as the poll creator (from and occupant-id).
Here is an example:
<message id='jm9dsXD73eXxlAP2M4dOhay7oXBlQb91LVBf' to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client' from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root' type='groupchat'> <occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/> <no-copy xmlns='urn:xmpp:hints'/> <no-store xmlns='urn:xmpp:hints'/> <no-permanent-store xmlns='urn:xmpp:hints'/> <x-poll id='06yCKW_hoZSx' xmlns='http://jabber.org/protocol/muc#x-poll-message' end='1720177925' votes='1'> <x-poll-question>The poll question</x-poll-question> <x-poll-choice choice='1' votes='1'>Choice 1 label</x-poll-choice> <x-poll-choice choice='2' votes='0'>Choice 2 label</x-poll-choice> </x-poll> </message>Note: Standards XMPP clients won’t be able to show the progress.
When a user joins the MUC, a similar message will be sent to this user (and this user only, to the new occupant session to be more specific). This is done so that any compatible client can immediatly show the poll.
Note: clients should ignored x-poll data from archived messages, and only consider data coming from unarchived messages. Otherwise they could show some outdated data.
Poll end When the poll ends, a new groupchat message is broadcasted in the room.
Here is an example:
<message id='GVqv1YcwI0GZb0myKhmtEqRa9fvWlCbDdF7R' to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client' from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root' type='groupchat'> <body>The poll question This poll is now over. 1: Choice 1 label 2: Choice 2 label </body> <occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/> <x-poll id='_eZQ4j4YLHTK' votes='5' xmlns='http://jabber.org/protocol/muc#x-poll-message' end='1720177157' over='' > <x-poll-question>The poll question</x-poll-question> <x-poll-choice choice='1' votes='3'>Choice 1 label</x-poll-choice> <x-poll-choice choice='2' votes='2'>Choice 2 label</x-poll-choice> </x-poll> <stanza-id xmlns='urn:xmpp:sid:0' id='CwiijSxawB8QOP4NN-Li6jP0' by='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost'/> </message>Please note the over attributes that indicated that the poll is over.
If users are voting just after the poll ends (less than 30 seconds after the poll end), and the vote is anonymous, their votes will be bounced, to avoid leaking votes for late users.
Security Following tags will be stripped of any incoming groupchat message: x-poll, x-poll-question, x-poll-choice. This is to avoid any poll spoofing.
Fronted The poll Converse plugin does multiple things.
It checks for the http://jabber.org/protocol/muc#x-poll disco feature to show the “create poll” button.
It uses standards XMPP forms to get the poll creation form and submit it.
It uses the parseMUCMessage hook to check if messages have x-poll data.
If so, and if message are not archived, it creates or updates the poll banner.
When clicking on a choice in the banner, it just sends a message in the chat ("!1" for example).
As the backend does no localization, it also translate on the fly the english sentences coming from the backend (in the form definition, in poll start/end message, and in bounce/error messages).`,description:"Polls technical documentation",tags:[],title:"Sondages",uri:"/peertube-plugin-livechat/fr/technical/polls/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`You can set terms & conditions on the instance level (called “global terms”), or at the streamers’ channels level (called “muc terms”, as it is related to muc rooms).
Backend The mod_muc_peertubelivechat_terms prosody modules handles the terms configuration.
It has a configuration option for the global terms. It also adds muc terms in the room data.
When a new occupant session is opened, this modules sends them messages containing the global and muc terms (if set).
Here is an example of sent messages:
<message xmlns="jabber:client" id="_iRSEs061gi5GBjF7zGh7f-M" type="groupchat" to="root@p1.localhost/QH1H89H1" from="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost/Peertube"> <body>The global terms.</body> <x-livechat-terms type="global" /> <delay xmlns="urn:xmpp:delay" stamp="2024-06-25T11:02:25Z" /> <stanza-id by="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost" xmlns="urn:xmpp:sid:0" id="InoL5fonvOoR8X9gOlAYsz_N" /> <no-copy xmlns='urn:xmpp:hints'/> <no-store xmlns='urn:xmpp:hints'/> <no-permanent-store xmlns='urn:xmpp:hints'/> </message> <message xmlns="jabber:client" id="_iRSEs061gi5GBjF7zGh7f-M" type="groupchat" to="root@p1.localhost/QH1H89H1" from="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost/Peertube"> <body>The muc terms.</body> <x-livechat-terms type="muc" /> <delay xmlns="urn:xmpp:delay" stamp="2024-06-25T11:02:25Z" /> <stanza-id by="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost" xmlns="urn:xmpp:sid:0" id="InoL5fonvOoR8X9gOlAYsz_N" /> <no-copy xmlns='urn:xmpp:hints'/> <no-store xmlns='urn:xmpp:hints'/> <no-permanent-store xmlns='urn:xmpp:hints'/> </message>Notice the x-livechat-terms tag.
Standard XMPP clients will show these messages as standard message.
Message are sent from a “service nickname”: this occupant does not exist. The service nickname is an option of the module (livechat use “Peertube”, hard coded for now). This nickname is reserved, no-one can spoof it (the module will bounce any request to use this nickname). We must do so, because without nickname, some XMPP clients won’t show the messages (tested with Gajim).
We also add a delay tag, to trick the moderation bot (see comments in code). This also ensure clients will not drop the message because there is no occupant with this name.
We also add some urn:xmpp:hints to avoid storing or copying these messages.
When muc terms are updated, the new terms will be broadcasted.
To avoid anyone spoofing terms & conditions, incoming message stanza are filtered, and any x-livechat-terms tag will be removed.
Message history is disabled for message containing the x-livechat-terms, so that messages broadcasted when the terms change are not stored by muc_mam modume (“Message Archiving Management”).
Frontend For standard XMPP clients, terms will be shown as delayed messages.
For the livechat frontend, there is a livechat-converse-terms Converse plugin that will intercept these messages, and prevent them to be shown in the chat history.
It will also create infobox at the top of the chat to display the terms content. If muc terms are updated, the new terms will be shown.
Users can hide the terms. To remember that a user has already hidden the terms, we store the content in localStorage. We will only show terms again if the content in this localStorage changes. We do so for both global terms and muc terms, in two separate localStorage keys. The keys in localstorage does not depends on the room JID or the origin peertube instance. This means that message will be shown again:
if terms are modified if the user switch to another channel if the user switch to a video from a different peertube instance `,description:"Terms&Conditions implementation",tags:[],title:"Terms&Conditions",uri:"/peertube-plugin-livechat/fr/technical/terms/index.html"},{breadcrumb:"Peertube livechat",content:`Si vous avez des demandes de nouvelles fonctionnalités, des bugs, ou des difficultés à installer et utiliser le plugin, vous pouvez utiliser l’outils Github issue tracker. Si possible, merci d’y écrire en anglais ; mais le français sera accepté.
Pour avoir un aperçu de la feuille de routes pour les fonctionnalités à venir, vous pouvez vous référer à :
ce projet github. les jalons sur github. Si vous êtes webdesigner ou avez une expertise en ConverseJS/Prosody/XMPP et souhaitez participer à l’évolution de ce plugin, n’hésitez pas à me contacter.`,description:"Évolutions / suivi des bugs",tags:[],title:"Évolutions / Bugs",uri:"/peertube-plugin-livechat/fr/issues/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a Task Application. The present document describes how this is implemented.
Basics This features relies on XEP-0060: Publish-Subscribe. This XEP provide a way to store and retrieve items, and to receive push notifications when an item is created/deleted/modified.
There is a Prosody Module, mod_pubsub_peertubelivechat, to implement some specific use of the pubsub mechanism.
This module is also used for Moderator Notes.
We use the JID+NodeID addressing to specify some nodes related to each MUC room. The JID is the MUC room JID, the NodeID is functionnality we want to address.
This modules implement the “livechat-tasks” node, to handle tasks and task lists.
The “livechat-tasks” node contains two type of objects: Task and TaskList (XML Namespaces: urn:peertube-plugin-livechat:tasklist and urn:peertube-plugin-livechat:task). Tasks have an attribute containing their task list id.
On the front-end, we have the livechat-converse-tasks plugin for ConverseJS.
Workflow Here is the basic workflow used to subscribe to tasks/task-lists, and receive existing items.
the browsers connect to the chat, and ConverseJS uses the XMPP discovery to get the room features. mod_pubsub_peertubelivechat declares two features: urn:peertube-plugin-livechat:tasklist and urn:peertube-plugin-livechat:task. the browsers detect these feature, and checks that the user has admin or owner affiliation on the MUC component. if not, won’t display the Task Application, and stops here. if yes, we will continue: display the Task Application. Create a new PubSubManager object, that will subscribe to the pubsub node. The backend receives the subscription request, test user rights (must be owner/admin on the MUC), and adds the user to the subscribers. Note: a user with multiple browsers tabs will send multiple subscription requests, but this is not an issue. If the node did not exist, the backend automatically created it, and use the MUC name to create a first task-list with that name. Once subscribed, the frontend will request all current entries. The backend tests rights, and send all node entries. On the frontend, the PubSubManager handles the response by dispatching received items to the correct frontend component. Note: on the backend side, we subscribe all users with the “publisher” affiliation level. This allows them to publish items, but not change the node configuration.
Here is the worflow to create/modify/delete items:
the frontend send a publish request. backend checks rights. backend sends notifications to all subscribers, including the current users. On the front-end PubSubManager receives the notification, and dispatch it to the relevant component. Unsubscribing When users leaves a MUC room, they are automatically unsubscribed from the “livechat-tasks” node related to this room.
When users lose the owner/admin affiliation, they are removed from the “livechat-tasks” node subscriptions.
Items Here we describes the content of node items.
Listes de tâches Item tag: tasklist XML Namespace: urn:peertube-plugin-livechat:tasklist item childs: name: the text content is the task list name Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="45cf7543-67bf-4d03-bb5d-a55038a0512a:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <tasklist xmlns="urn:peertube-plugin-livechat:tasklist"> <name>Task List Name</name> </tasklist> </item> </publish> </pubsub> </iq>Tâches Item tag: task XML Namespace: urn:peertube-plugin-livechat:task item attributes: done: if present and equal to “true”, means that the task is done list: the list id order: the order of the task in the task list item childs: name: the text content is the task name description: the text content is the task description Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="9fd9a162-1b6c-4b38-a2a1-2485b34f0d8d:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <task list="8302c024-c16e-4fbd-aca7-c94cdb2025de" order="0" done="true" xmlns="urn:peertube-plugin-livechat:task" > <name>The task name</name> <description>here is the description</description> </task> </item> </publish> </pubsub> </iq>Note: in the above example, we added done="true" just for the example. Don’t add the attribute if you want not the task to be marked as done (or if you want to undone the task).`,description:"Task Application technical overview",tags:[],title:"Tasks overview",uri:"/peertube-plugin-livechat/fr/technical/tasks/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a Moderation Notes Application. The present document describes how this is implemented.
Basics This features relies on XEP-0060: Publish-Subscribe. This XEP provide a way to store and retrieve items, and to receive push notifications when an item is created/deleted/modified.
There is a Prosody Module, mod_pubsub_peertubelivechat, to implement some specific use of the pubsub mechanism.
This module is also used for Tasks.
We use the JID+NodeID addressing to specify some nodes related to each MUC room. The JID is the MUC room JID, the NodeID is functionnality we want to address.
This modules implement the “livechat-notes” node, to handle moderator notes.
The “livechat-notes” node contains one type of objects: Note (XML Namespaces: urn:peertube-plugin-livechat:note).
On the front-end, we have the livechat-converse-notes plugin for ConverseJS.
Workflow / Unsubscribing This is basically the same as for Tasks.
Items Here we describes the content of note items.
Item tag: note XML Namespace: urn:peertube-plugin-livechat:note item attributes: order: the order of the note in the note list item childs: description: the text content of the note note-about: an optional tag, if the note is associated to a participant The note-about tag, if present, has following structure:
Item tag: note-about XML Namespace: none item attributes: jid: the JID of the occupant nick the nick of the occupant, at time of note creation item childs: occupant-id: see XEP-0421. Example:
<iq from="user@example.com" id="64da7e38-4dd5-4f55-b46f-297232232971:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client"> <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-notes"> <item id="8ab78df9-a7b9-4315-943d-c340935482af"> <note order="11" xmlns="urn:peertube-plugin-livechat:note" > <description>Some text.</description> <note-about jid="khkecy3nkddwxdllgzdub-dv@anon.p1.localhost" nick="Mickey" > <occupant-id id="ga4mR2IKEvRKuzN1gJYVafCTbY1gNvgNvNReqdVKexI=" xmlns="urn:xmpp:occupant-id:0" /> </note-about> </note> </item> </publish> </pubsub> </iq>`,description:"Moderator Notes Application technical overview",tags:[],title:"Moderator notes overview",uri:"/peertube-plugin-livechat/fr/technical/moderation_notes/index.html"},{breadcrumb:"Peertube livechat",content:` Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
SondagesPolls technical documentation
Terms&ConditionsTerms&Conditions implementation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview`,description:"Technical documentation",tags:[],title:"Technical documentation",uri:"/peertube-plugin-livechat/fr/technical/index.html"},{breadcrumb:"Peertube livechat",content:`Si vous avez des questions ou souhaitez parler de ce plugin, vous pouvez rejoindre ce salon XMPP avec n’importe quel client Jabber : plugin-livechat-support@room.im.yiny.org.
Si vous souhaitez supporter le projet financièrement, vous pouvez me contacter par mail à l’adresse git.[arobase].john-livingston.fr, ou passer par mon profil Liberapay.`,description:"Contacter l'auteur",tags:[],title:"Me contacter",uri:"/peertube-plugin-livechat/fr/contact/index.html"},{breadcrumb:"Peertube livechat",content:`Les fichiers package.json, COPYRIGHT et LICENSE contiennent les informations sur la licence du présent logiciel (en anglais).
Le plugin est maintenu par John Livingston.
Merci à David Revoy pour son travail sur la mascotte de Peertube, Sepia. Le design est en licence CC-By, et les fichiers SVG utilisés pour créer certains logos et avatars en GPLv3.0.
Merci à Framasoft pour avoir rendu Peertube possible, pour le support financier, et pour héberger les traductions du projet sur leur instance Weblate.
Merci à ritimo pour le support financier.
Merci à Code Lutin et à la Rétribution Copie Publique pour le support financier.
Merci à NlNet et au fond NGI0 Entrust pour le support financier.
Merci à Octopuce pour le support financier.
Et merci à toustes les contributeur⋅rices individuel⋅les qui ont fait un don via ma page liberapay.`,description:"Crédits pour le plugin",tags:[],title:"Crédits",uri:"/peertube-plugin-livechat/fr/credits/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:`Activer le tchat pour vos diffusions en direct Avertissement Les administrateur⋅rices de l’instance peuvent choisir de désactiver ou activer le tchat dans certains cas spécifiques. Les informations dans cette section ne sont applicables que dans le cas par défaut.
Quand vous créez ou modifiez un direct Peertube, il y a un onglet «paramètres du plugins» :
Dans l’onglet «paramètres du plugin», il y a une case à cocher «Activer le salon de discussion». Cochez ou décochez la simplement pour activer ou désactiver le tchat associé à votre vidéo.
Astuce Il peut y avoir d’autres paramètres dans cet onglet, en fonction des plugins installés sur votre instance Peertube.
Tchat par chaîne Au niveau de l’instance, les administrateur⋅rices peuvent choisir si les salons de discussions sont uniques par vidéo, ou s’ils vont être uniques par chaîne. Veuillez contacter les administrateur⋅rices de votre instance pour plus d’information sur la façon dont est configuré le plugin livechat.
Partager le tchat Au dessus du tchat, il y a un bouton «Partager le lien du salon de discussion».
Ce bouton ouvre une popup, où vous trouverez une url pour rejoindre le tchat. Vous pouvez partager cette url.
L’onglet “Intégration” fournit des liens pour intégrer le tchat dans des sites web ou dans votre flux vidéo en direct.
Vous pouvez personnaliser certaines options :
Lecture seule : vous ne pourrez que lire le tchat, et non y écrire. Ceci est utile pour inclure le contenu du tchat dans vos diffusions directes (voir la documentation OBS). Utiliser les couleurs du thème courant : si coché, les couleurs de votre thème courant seront ajoutés à l’url, de sorte que ls personnes ouvrant ce lien auront le même jeu de couleurs. Générer une iframe pour intégrer le tchat dans un site web : à la place d’une url, vous aurez un extrait HTML que vous pouvez ajouter à votre site web pour inclure le tchat. Pour plus d’information sur l’onglet “Dock”, veuillez vous référer à la documentation OBS.
Dans l’onglet “Web”, l’URL fournie ouvre le tchat dans l’interface Peertube. Vous pouvez partager ce lien avec d’autres utilisateurs pour les inviter à rejoindre le tchat.
La popup «Partager le lien du salon de discussion» peut également contenir un onglet «Connexion avec un client XMPP». Cet onglet n’est disponible que si les admintrateur⋅rices de votre instance ont activé et configuré correctement cette option. En utilisant cette option, vous pouvez fournir un lien permettant de rejoindre le salon en utilisant n’importe quel client XMPP. En utilisant de tels logiciels, il sera par exemple plus simple de gérer les actions de modération.
Modération Veuillez vous référer à la documentation de modération.
Inclure plusieurs tchats dans votre flux en direct Veuillez vous référer à la documentation OBS.
Persistance du tchat Par défaut, le tchat est persistant. Cela veut dire que le contenu des salons sera conservé pendant un moment. Les utilisateur⋅rices qui le rejoignent pourront voir les messages envoyés avant leur arrivée.
Vous pouvez changer le comportement de la persistance. Ouvrez le menu déroulant, et cliquez sur «Configurer».
Il y a plusieurs options qui peuvent être changées.
Vous pouvez par exemple définir la valeur par défaut, et la valeur maximum du nombre de messages à retourner à 0. Ainsi les personnes rejoignant le salon ne pourront voir les messages envoyés précédemment.
Vous pouvez aussi décocher «activer l’archivage» : si décoché, les messages seront nettoyés si le serveur redémarre.
En décochant «Persistant», le salon sera effacé quand il n’y aura plus de participant⋅es.
Détruire le contenu du tchat Si vous voulez détruire le contenu du tchat, ouvrez le menu déroulant, et cliquez sur «Détruire». Une popup va s’ouvrir, demandant confirmation.
Le tchat sera automatiquement recréé à chaque fois que quelqu’un essayera de le rejoindre, tant que la vidéo existe et qu’elle a le paramètre «Activer le salon de discussion» activé.`,description:"Quelques informations de base sur comment configurer et utiliser le tchat pour vos directs",tags:[],title:"Quelques basiques",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/basics/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 8.0.0, et peut être désactivée par les admins de votre instance.
Dans le menu gauche de Peertube, il y a une entrée «Salons de discussion» :
Ce lien «Salons de discussion» vous emmène sur une liste de vos chaînes. En cliquant sur une chaîne, vous pourrez effectuer certains réglages pour vos chaînes :
Ici vous pouvez configurer :
Conditions d’utilisation du tchat de la chaîne Valeur par défaut pour Silencier les utilisateur⋅rices anonymes Le mode lent Le bot de tchat Emojis personnalisés Nouvelles fonctionnalités à venir… `,description:"Configuration des salons de discussion des chaînes Peertube",tags:[],title:"Configuration de la chaîne",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/channel/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice",content:` Quelques basiquesQuelques informations de base sur comment configurer et utiliser le tchat pour vos directs
Configuration de la chaîneConfiguration des salons de discussion des chaînes Peertube
AnnouncementsRoom owners and administrators can send special announcements in the chat.
ModérationFonctions de modération avancées du plugin peertube-plugin-livechat
Conditions d'utilisationConfigurer les conditions d'utilisation des tchats de la chaîne
Mode lentMode lent du plugin peertube-plugin-livechat
Délai de modérationPlugin peertube-plugin-livechat délai de modération
Emojis personnalisésEmojis personnalisés du plugin peertube-plugin-livechat
Emojis only modePlugin peertube-plugin-livechat emojis only mode
SondagesYou can create polls to ask viewers their opinion
Tâches / listes de choses à faireVous pouvez gérer les tâches et les listes de tâches avec votre équipe de modération.
Moderation notesPlugin peertube-plugin-livechat moderation notes
Bot de tchatConfiguration du bot de tchat
Special charactersThe bot can automatically moderate messages containing too many special characters.
No duplicate messageThe bot can automatically moderate duplicate messages.
Mots interditsLe bot peut automatiquement modérer les messages contenant des mots interdits.
Messages pré-enregistrésLe bot peut envoyer des messages périodiquement.
CommandesLe bot peut répondre à différentes commandes.`,description:"Comment mettre en place le tchat pour vos diffusions en direct",tags:[],title:"Pour les streameur⋅euses",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 12.0.0. Room owners and administrators can send special announcements in the chat.
These messages will be more visible than standard messages.
To send announcements, owners and administrators will have a “Message type” selector on the top of the message field:
There are several message types:
Standard: to send a standard message. Highlight: these messages will simply be highlighted in a blue box. Announcement: these messages will be in a green box, and a bold “Announcement” title will be added. Warning: these messages will be in a rend box, and a bold “Announcement” title will be added. Information User that are not owner or administrator of the chatroom can’t send such messages.
Avertissement Note: Standards XMPP clients will display announcements as standard messages.`,description:"Room owners and administrators can send special announcements in the chat.",tags:[],title:"Announcements",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/announcements/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Avertissement Cette section est encore incomplète.
Avertissement Cette page décrit le comportement des versions de livechat >= 10.0.0. Il y a eu quelques changements dans la façon dont nous gérons les droits d’accès pour les administrateur⋅rices et modérateur⋅rices de Peertube.
Le bot de tchat Vous pouvez utiliser un bot de tchat, qui vous aidera pour la modération. Veuillez vous référer à la documentation du bot de tchat pour plus d’informations.
Accéder aux outils de modération Vous pouvez accéder aux paramètres de la salle et aux outils de modération en utilisant le menu déroulant du tchat en haut à droite de celui-ci.
Astuce Le⋅a propriétaire de la vidéo sera le⋅a propriétaire du salon de discussion. Cela signifie qu’iel peut configurer le salon, le supprimer, promouvoir d’autres utilisateur⋅rices en tant qu’administrateur⋅rices, …
Astuce Depuis la version 10.0.0 de livechat, les administrateur⋅rices et modérateur⋅rices de l’instance Peertube n’ont pas de droits particuliers par défaut sur les salons. Cependant, iels ont un bouton spécial disponible en haut du chat : “Devenir modérateur⋅rice”. En cliquant sur ce bouton, iels auront un accès propriétaire à la salle.
Vous pouvez utiliser les commandes de modération ConverseJS pour modérer le salon. Lorsque vous ouvrez la salle de discussion en plein écran, un menu avec des commandes dédiées s’affiche en haut à droite.
Silencier les utilisateur⋅rices anonymes Information Cette fonctionnalité arrive avec le plugin livechat version 10.2.0. Vous pouvez empêcher les utilisateur⋅rices anonymes d’envoyer des messages. Dans ce cas, seuls les utilisateur⋅rices enregistré⋅es pourront parler dans le tchat.
Pour activer ou désactiver cette fonctionnalité, utilisez le menu déroulant du chat, puis ouvrez le menu “configurer”. Dans le formulaire, vous trouverez une case à cocher “Silencier les utilisateur⋅rices anonymes”.
Les utilisateur⋅rices anonymes n’auront pas le champ message, et verront l’invite suivante : “Seuls les utilisateur⋅rices enregistré⋅es peuvent envoyer des messages.”
Lorsque cette fonction est activée, les utilisateur⋅rices anonymes se voient attribuer le rôle de “visiteur”. Vous pouvez changer leur rôle en “participant⋅e” si vous voulez permettre à certain⋅es d’entre elleux de parler.
Si vous modifiez la configuration de la salle, tous les utilisateur⋅rices anonymes seront mis en sourdine ou à nouveau autorisé⋅e à parler.
Vous pouvez choisir d’activer ou de désactiver cette fonctionnalité pour les nouveaux salons de discussion sur la page de configuration de la chaîne.
Rôles et affiliations Il y a différents rôles qui peuvent être assignés aux utilisateur⋅rices dans les salons de discussion : propriétaire, modérateur⋅rice, membre, …
Avertissement Cette section est encore incomplète.
Vous pouvez promouvoir des utilisateur⋅rices en tant que modérateur⋅rices, si vous avez besoin d’aide.
Anonymiser les actions de modération Information Cette fonctionnalité arrive avec le plugin livechat version 11.0.0. Il est possible d’anonymiser les actions de modération, afin d’éviter de divulguer qui bannit/expulse/… les participant⋅es.
Pour activer ou désactiver cette fonctionnalité, utilisez le menu déroulant du chat, puis ouvrez le menu “configurer”. Dans le formulaire, vous trouverez une case à cocher “Anonymiser les actions de modération”.
Vous pouvez choisir d’activer ou de désactiver cette fonctionnalité pour les nouveaux salons de discussion sur la page de configuration de la chaîne.
Recherche dans l’historique des messages des participant⋅es Information Cette fonctionnalité arrive avec le plugin livechat version 11.0.0. En tant qu’administrateur⋅rice ou propriétaire d’un sallon, vous pouvez rechercher tous les messages envoyés par un⋅e participant⋅e donné⋅e.
Pour ce faire, plusieurs possibilités s’offrent à vous :
utiliser l’action “Rechercher tous les messages” dans le menu déroulant à côté des participant⋅es dans la barre latérale utilisation de l’action “Rechercher tous les messages” dans le menu déroulant à côté des messages de tchat Astuce Pour avoir plus d’espace et une meilleure lisibilité, ouvrez le tchat en mode pleine page.
Dans les résultats de la recherche, plusieurs informations sont affichées à droite du pseudo de la personne participante :
si le pseudonyme actuel est différent du pseudonyme utilisé lorsque le⋅a participant⋅e a envoyé le message, le pseudonyme original sera affiché vous verrez le JID (Jabber ID) de la personne participante vous verrez également l’occupant[https://xmpp.org/extensions/xep-0421.html) de la personne participante The search result will also include all messages related to participants who had the same nickname. You can differenciate them by comparing JID and occupant-id.
Supprimer le contenu des salons Vous pouvez supprimer d’anciennes salles : rejoignez la salle, et utilisez le menu en haut pour détruire la salle.
Modération de l’instance En tant que modérateur⋅rice ou administrateur⋅rice de l’instance Peertube, vous allez probablement vouloir vérifier que les utilisateur⋅rices n’ont pas de comportement problématique.
Vous pouvez lister toutes les salles de discussion existantes : dans l’écran des paramètres du plugin, il y a un bouton “Lister les salles”.
De là, vous pouvez également vous promouvoir en tant que modérateur⋅rice de salon en utilisant le bouton “Devenir modérateur⋅rice” sur la droite.`,description:"Fonctions de modération avancées du plugin peertube-plugin-livechat",tags:[],title:"Modération",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/moderation/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 10.2.0. Configuration Vous pouvez ajouter des conditions d’utilisation à votre chaîne. Ces conditions seront affichées à tous les utilisateur⋅rices qui rejoignent le tchat.
Pour configurer les conditions d’utilisation, veuillez vous rendre sur la page de configuration de la chaîne :
L’URL du message sera cliquable. Vous pouvez aussi mettre en forme : Message Styling.
Spectateur⋅rices Lorsqu’iels rejoignent le tchat, les spectateur⋅rices verrons les conditions :
Information L’administrateur⋅rice de l’instance Peertube peut également définir des conditions générales. Si c’est le cas, ces conditions seront affichées au-dessus de celles de votre chaîne.
Information Les utilisateur⋅rices anonymes ne verront les conditions d’utilisation qu’une fois qu’iels auront choisi leur pseudonyme (en d’autres termes : une fois qu’iels seront en mesure de parler).
Vous pouvez modifier le contenu des conditions à tout moment, il sera instantanément mis à jour pour tous les téléspectateur⋅rices.
Les utilisateur⋅rices peuvent masquer les conditions d’utilisation. Dans ce cas, les conditions ne s’afficheront plus, sauf si vous en modifiez le contenu.
Information Si votre instance Peertube permet de rejoindre le tchat avec des clients XMPP, les utilisateur⋅rices utilisant ces clients verront les conditions comme des messages de tchat provenant d’un compte “Peertube”. Lorsque vous mettez à jour les conditions, iels recevront un nouveau message avec le contenu des conditions d’utilisation mis à jour.`,description:"Configurer les conditions d'utilisation des tchats de la chaîne",tags:[],title:"Conditions d'utilisation",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/terms/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 8.3.0. Introduction En tant que streameur⋅euse, vous pouvez choisir de limiter la fréquence des messages de vos spectateur⋅rices dans le tchat.
Cela peut s’avérer très utile pour :
éviter l’inondation de messages éviter que le tchat ne devienne illisible si de nombreux⋅ses personnes y parlent Vous pouvez définir le nombre de secondes que les utilisateur⋅rices devront attendre après avoir envoyé un message avant d’en envoyer un autre.
Cette limitation ne s’applique pas aux modérateur⋅rices.
Option du mode lent Sur la page de configuration de la chaîne, vous pouvez définir une valeur pour l’option mode lent :
Cette valeur va s’appliquer comme valeur par défaut pour tous les salons de discussion de votre chaîne.
La valeur 0 désactive la fonctionnalité.
Positionner la valeur à un nombre entier positif permet de fixer la période pendant laquelle les utilisateur⋅rices ne pourront pas envoyer de messages supplémentaires.
Pour modifier la valeur d’un salon déjà existant, il suffit d’ouvrir le menu “configuration” du salon (en haut de la fenêtre de tchat), et de modifier la valeur du mode lent dans le formulaire de configuration.
Pour les spectateur⋅rices Si le mode lent est activé, les utilisateur⋅rices en seront informé⋅es par un message.
Lorsqu’iels envoient un message, le champ de saisie est désactivé pendant X secondes (X étant la durée du mode lent).
Cette limitation ne s’applique pas aux modérateur⋅rices.`,description:"Mode lent du plugin peertube-plugin-livechat",tags:[],title:"Mode lent",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/slow_mode/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 10.3.0. Introduction En tant que streameur⋅euse, vous pouvez choisir d’appliquer un délai aux messages dans le tchat, afin de laisser un peu de temps aux modérateur⋅rices pour supprimer des messages avant même qu’ils ne soient lus par les autres participant⋅es.
Lorsque cette fonction est activée, les modérateur⋅rices voient tous les messages sans délai. Les participant⋅es au tchat ne verront pas que leurs propres messages sont retardés.
Veuillez noter que les messages envoyés par les modérateur⋅rices seront également retardés, afin d’éviter qu’ils ne répondent à des messages qui ne sont même pas encore visibles par les autres participant⋅es.
Option de délai de modération Sur la page de configuration de la chaîne, vous pouvez définir une valeur pour l’option “Délai de modération” :
Cette valeur va s’appliquer comme valeur par défaut pour tous les salons de discussion de votre chaîne.
La valeur 0 désactive la fonctionnalité.
Fixer cette valeur à un nombre entier positif permet de régler le délai, en secondes, à appliquer aux messages. Évitez de fixer une valeur trop élevée. Idéalement, elle ne devrait pas dépasser quelques secondes (4 ou 5 secondes par exemple).
Pour modifier la valeur d’un salon déjà existant, il suffit d’ouvrir le menu “configuration” du salon (en haut de la fenêtre de tchat), et de modifier la valeur du délai de modération dans le formulaire de configuration.
Avertissement Actuellement, cette fonctionnalité présente un bogue connu : les utilisateur⋅rices qui rejoignent le tchat recevront tous les messages, même ceux qui sont encore en attente pour les autres participant⋅es. Cependant, les messages envoyés après qu’iels aient rejoint le chat seront retardés correctement.
Astuce Vous pouvez combiner un délai de modération court (1 seconde par exemple) avec le bot dé modération pour supprimer les messages contenant des gros mots avant même qu’un⋅e utilisateur⋅rice non-modérateur⋅rice ne les voie.
Dans le tchat En tant que modérateur⋅rice, vous verrez le temps restant (en secondes) avant que le message ne soit diffusé, juste à côté de l’horodatage du message.`,description:"Plugin peertube-plugin-livechat délai de modération",tags:[],title:"Délai de modération",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/moderation_delay/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 10.1.0. Emojis de la chaîne Les streameur⋅euses peuvent ajouter des émojis personnalisés à leurs chaînes.
Sur la page de configuration de la chaîne, ouvrez l’onglet “Émojis de la chaîne” :
Vous pouvez configurer des émojis personnalisés pour votre chaîne. Ces émojis seront disponibles dans le sélecteur d’émojis. Les utilisateurs peuvent également les utiliser avec leur nom court (par exemple en écrivant “:nom_court:”).
Vous pouvez utiliser l’émojis dans le tchat en utilisant “:nom_court:”. Le nom court peut commencer et/ou finir par des deux-points (:), et seulement contenir des caractères alphanumériques des underscores et des tirets. Il est fortement recommandé de les commencer par des deux-points, pour que les utilisateur⋅rices puissent utiliser l’autocomplétion (en tapant “:” puis en pressant TABULATION).
Importation / Exportation Sur la page de configuration de la chaîne, il y a un bouton “Importer” et un bouton “Exporter”. Le bouton “Exporter” génère un fichier que vous pouvez ensuite importer dans la configuration d’une autre chaîne.
Vous pouvez également générer un fichier à importer à partir de n’importe quelle autre source (par exemple, vous pouvez importer vos émojis personnalisés Twitch). Le fichier doit être un fichier JSON valide, au format suivant :
[ { "sn": ":short_name:", "url": "https://example.com/image.png" } ] L’attribut sn est le code du nom court. L’attribut url peut être n’importe quelle url d’image à laquelle votre navigateur peut accéder, ou une URL de données représentant le fichier que vous souhaitez importer.`,description:"Emojis personnalisés du plugin peertube-plugin-livechat",tags:[],title:"Emojis personnalisés",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/emojis/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 12.0.0. Mode Émojis Uniquement Vous pouvez activer un mode “Émoji Uniquement” dans vos salons de discussion. Lorsque ce mode est activé, les participant⋅es ne peuvent envoyer que des émojis (standards ou émojis personnalisés de votre chaîne). Les modérateur⋅rices ne sont pas concerné⋅es par cette limitation.
This mode can be usefull for example:
To avoid spam or offensive message when you are not here to moderate. When there are too many speaking participants, and you can’t no more moderate correctly. To enable or disable this feature, use the chat dropdown menu, open the “configure” menu. In the form, you will find a “Mode Émojis Uniquement” checkbox.
If you want to enable it for all your chatrooms at once, open the channel emojis configuration page, and use the “Activer le mode Émoji Uniquement sur tous les salons de discussion de la chaîne” button.`,description:"Plugin peertube-plugin-livechat emojis only mode",tags:[],title:"Emojis only mode",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/emojis_only/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 10.2.0. Créer un sondage Vous pouvez créer un nouveau sondage en utilisant l’action “Créer un nouveau sondage” dans le menu du tchat :
Avertissement Cette fonctionnalité de sondage ne doit pas être considérée comme un système de vote fiable. Il est facile de tricher. Aucun mécanisme n’empêche les utilisateur⋅rices anonymes de voter plusieurs fois en rechargeant simplement le tchat. Les votes ne sont jamais totalement anonymes, quelqu’un ayant accès au serveur peut voir qui a voté pour quel choix.
Formulaire de sondage Remplir les champs du formulaire :
“Question” : la question à poser aux spectateur⋅rices “Durée du sondage (en minutes)” : durée pendant laquelle les spectateur⋅rices peuvent voter “Résultats anonymes” : si cette case est cochée, les votes ne seront pas visibles publiquement dans le tchat “Choix N” : choix qui seront présentés aux spectateur⋅rices Vous devez au moins remplir les deux premier choix.
Une fois que vous aurez soumis le formulaire, le sondage commencera instantanément.
Si un sondage précédent était inachevé, il se terminera et son résultat sera affiché.
Droits d’accès Les administrateur⋅rices de chaque salon peuvent créer un nouveau sondage.
Lorsque vous promouvez quelqu’un en tant qu’administrateur⋅rice ou propriétaire du salon, iel obtient un accès instantané à l’action “Créer un nouveau sondage”.
Lorsque vous retirez les droits d’administrateur⋅rice ou de propriétaire à quelqu’un, cette personne ne peut plus créer de nouveaux sondages. Mais un éventuel sondage existant continuera jusqu’à ce qu’il se termine.
Tous les utilisateur⋅rices qui ne sont pas en sourdine peuvent voter. Cela signifie que vous pouvez empêcher les utilisateur⋅rices anonymes de voter en utilisant la fonctionnalité “Silencier les utilisateur⋅rices anonymes”.
Flux de travail des sondages Lorsque les sondages commencent, un premier message est envoyé dans le tchat, à partir du compte de l’utilisateur⋅rice qui a créé le sondage.
Une bannière apparaîtra également pour indiquer le sondage en cours, et sera régulièrement mise à jour avec les votes en cours.
Les spectateur⋅rices peuvent ensuite voter en cliquant sur leur choix, ou en envoyant un message du type “!1” dans le tchat.
Le décompte des votes sera mis à jour régulièrement dans la bannière.
Les spectateur⋅rices peuvent modifier leur vote à tout moment, en faisant un nouveau choix. Le choix précédent sera remplacé par le nouveau.
Astuce Les spectateur⋅rices anonymes ne peuvent voter que lorsqu’iels ont choisi leur pseudonyme.
Si “Résultats anonymes” est coché, les votes ne seront pas montrés aux autres utilisateur⋅rices. Si cette option n’est pas cochée, les votes seront visibles publiquement sous forme de messages du type “!1” dans le tchat.
Information Pour les spectateur⋅rices utilisant des clients XMPP ou des versions obsolètes du plugin livechat, la bannière ne sera pas visible. Mais iels verront le message dans le tchat et pourront voter en envoyant des messages avec leurs choix.
À la fin du sondage, un nouveau message sera envoyé dans le tchat, avec les résultats.
Information Le seul moyen d’obtenir les résultats d’anciens sondages est de rechercher le message de fin de sondage dans le tchat. Pour l’instant, les résultats des sondages ne sont pas sauvegardés par d’autres moyens. N’oubliez donc pas de noter les résultats des sondages si vous souhaitez les conserver.`,description:"You can create polls to ask viewers their opinion",tags:[],title:"Sondages",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/polls/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 10.0.0. Introduction Le plugin livechat comprend une Application de Tâches : une sorte de “liste de choses à faire” où vous pouvez créer des listes de tâches et y ajouter des tâches. Les administrateur⋅rices de chaque salon de discussion ont accès à ces tâches, ce qui vous permet de les modifier de manière collaborative.
Vous pouvez par exemple utiliser l’Application de Tâches pour :
préparez une liste des thèmes que vous souhaitez aborder lors de votre direct, afin d’être sûr de ne rien oublier mettre en évidence les questions de vos spectateur⋅rices, afin que vous puissiez y revenir plus tard sans oublier d’y répondre … Utilisation de l’Application Tâches Ouverture de l’Application Tâche Pour ouvrir l’Application Tâches, il y a un bouton «Tâches» dans le menu haut du tchat :
En cliquant sur ce bouton, l’affichage de l’Application de Tâches bascule :
Astuce Pour avoir plus d’espace et une meilleure lisibilité, ouvrez le tchat en mode pleine page.
Droits d’accès Les administrateur⋅rices de chaque salon de discussion ont accès à l’application de tâches (accès en lecture et en écriture).
Lorsque vous promouvez quelqu’un en tant qu’administrateur⋅rice ou propriétaire d’un salon, iel obtient un accès instantané à l’Application Tâches. Lorsque vous retirez les droits d’admin ou de propriétaire à quelqu’un, iel perd instantanément l’accès à l’Application Tâches.
Listes de tâches Par défaut, il y a une liste de tâches portant le même nom que votre direct.
Vous pouvez utiliser le formulaire en bas de page pour créer une nouvelle liste de tâches. Vous pouvez également modifier les listes de tâches existantes à l’aide du bouton “modifier” ou supprimer n’importe quelle liste de tâches. La suppression d’une liste de tâches entraîne la suppression de toutes les tâches qu’elle contient.
Les listes de tâches sont triées par ordre alphabétique.
Astuce Toutes les modifications sont instantanément visibles dans tous les onglets de votre navigateur, et pour tous les administrateur⋅rices du salon.
Tâches Créer des tâches Vous pouvez créer une tâche en utilisant le bouton situé à droite des listes de tâches. Un formulaire s’ouvre alors avec deux champs : un nom de tâche obligatoire et une description facultative.
Modifier les tâches Les tâches peuvent être modifiées en utilisant le bouton d’édition à droite.
Les tâches peuvent être marquées comme terminées (ou non terminées) en cliquant directement sur la case à cocher dans la liste.
Trier les tâches / changer de liste des tâches Vous pouvez trier les tâches ou les déplacer d’une liste à l’autre par simple “glisser-déposer”.
Créer une tâche à partir d’un message du tchat Vous pouvez créer une tâche à partir d’un message du tchat, en utilisant le bouton “Créer une nouvelle tâche” dans le menu déroulant à droite du message. Cela ouvrira une boîte de dialogue dans laquelle vous pourrez choisir la liste de tâches dans laquelle vous souhaitez ajouter la tâche. Le nom de la tâche sera le pseudonyme de l’utilisateur⋅rice, et la description de la tâche le contenu du message.
Grâce à cette fonctionnalité, vous pouvez par exemple demander à vos modérateur⋅rices de relever toutes les questions du tchat, afin que vous puissiez les voir d’un seul coup d’œil pendant votre direct, et vérifier que vous y avez répondu.`,description:"Vous pouvez gérer les tâches et les listes de tâches avec votre équipe de modération.",tags:[],title:"Tâches / listes de choses à faire",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/tasks/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 11.0.0. Introduction The livechat plugin includes a Moderator Notes Application: you can write some notes, that could be associated to chat participants. Every room’s admins have access to these notes, so they can edit them collaboratively.
You can for example use this Application to:
share some notes between moderators take notes about participants that were kicked or caused troubles … Using the Moderator Notes Application Opening the Moderator Notes Application To open the Moderator Notes Application, there is a “Notes de modération” button in the top chat menu:
Clicking this button will toggle the Application display:
Astuce Pour avoir plus d’espace et une meilleure lisibilité, ouvrez le tchat en mode pleine page.
Droits d’accès Every room’s admins have access to this Application (read and write access).
When you promote someone as room admin or owner, they gets instant access to this Application. When you remove admin or owner rights to someone, they instantly lose access to this Application.
Scope Notes are only available in the room in which you have created them.
Chatrooms can be releated to video or channel. If you want to keep notes from one video to another, please consider using rooms associated to channels.
Avertissement Currently the video vs channel rooms is an instance-wide settings. Only Peertube admins can change it, and it applies to all chatrooms. In the future, this choice will be added in your channel’s options.
Remarques Create/Edit Notes You can use the plus button on the top to create a new note. You can also edit existing notes using the edit button, or delate any note.
Astuce Toutes les modifications sont instantanément visibles dans tous les onglets de votre navigateur, et pour tous les administrateur⋅rices du salon.
You can create a note associated to a participant in several ways:
using the “Créer une nouvelle note” action in the dropdown menu besides participants in the sidebar using the “Créer une nouvelle note” action in the dropdown menu besides chat messages When a note is associated to a participant, you will see their nickname and avatar on the top of the note.
Notes filtering You can filter notes to find all notes related to a given participant in several ways:
click on the “Recherche de notes” button that is available on notes to find all notes related to the same participant click on the “Recherche de notes” button in the dropdown menu besides participants in the sidebar click on the “Recherche de notes” button in the dropdown menu besides chat messages You can remove the filter by clicking on the close button.
When you filters notes on a participant, there are several informations that are shown at the right of the participant nickname:
if the current nickname is different than the nickname when you created the note, the original nickname will be shown vous verrez le JID (Jabber ID) de la personne participante vous verrez également l’occupant[https://xmpp.org/extensions/xep-0421.html) de la personne participante The search result will also include all notes related to participants who had the same nickname. So you can also take note for anonymous users (who don’t have any consistent JID or occupant-id). You can differenciate them by comparing JID and occupant-id.
Sorting notes You can sort notes simply using drag & drop.`,description:"Plugin peertube-plugin-livechat moderation notes",tags:[],title:"Moderation notes",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/moderation_notes/index.html"},{breadcrumb:"Peertube livechat > Documentation > Documentation utilisateur⋅rice > Pour les streameur⋅euses",content:` Information Cette fonctionnalité arrive avec le plugin livechat version 8.0.0, et peut être désactivée par les admins de votre instance.
Vous pouvez activer un bot de tchat dans vos salons. La configuration du bot se fait chaîne par chaîne, et s’applique aux salons de toutes les vidéos de celles-ci.
Pour accéder à cette page, veuillez vous référer à la documentation sur la configuration des chaînes.
Une fois ici, vous pouvez activer le bot, et configurer quelques options :
Special charactersThe bot can automatically moderate messages containing too many special characters.
No duplicate messageThe bot can automatically moderate duplicate messages.
Mots interditsLe bot peut automatiquement modérer les messages contenant des mots interdits.
Messages pré-enregistrésLe bot peut envoyer des messages périodiquement.
CommandesLe bot peut répondre à différentes commandes.
Le bot recharge automatiquement ses options quand vous sauvegardez la page.`,description:"Configuration du bot de tchat",tags:[],title:"Bot de tchat",uri:"/peertube-plugin-livechat/fr/documentation/user/streamers/bot/index.html"},{breadcrumb:"Peertube livechat",content:"",description:"",tags:[],title:"Catégories",uri:"/peertube-plugin-livechat/fr/categories/index.html"},{breadcrumb:"",content:` Astuce Vous pouvez utiliser le sélecteur de langue dans le menu de gauche pour afficher cette documentation dans différentes langues. Certaines traductions sont manquantes ou incomplètes. Dans ce cas, vous verrez la version anglaise du texte.
Bienvenue sur la documentation du Plugin Peertube Livechat.
Peertube est une plateforme de streaming décentralisée, qui peut permettre de diffuser aussi bien des directs que de la vidéo à la demande (VOD : Video On Demand). Ce plugin permet d’ajouter la possibilité de tchatter à votre installation Peertube, permettant ainsi des interactions avec les streameur⋅euses.
Pour avoir un aperçu des possibilités de ce plugin, aller jeter un œil à l’introduction. Pour des informations plus précises, vous trouverez plus bas le sommaire de cette documentation.
Astuce Vous pouvez utiliser la barre de recherche dans le menu gauche pour rapidement trouver des documentations spécifiques.
Information Avant de mettre à jour le plugin vers une nouvelle version majeure, merci de lire les notes de version, et la liste des éventuelles modifications non rétro-compatibles : CHANGELOG.
IntroductionIntroduction
DocumentationDocumentation du plugin
Documentation utilisateur⋅riceDocumentation utilisateur⋅rice du plugin peertube-plugin-livechat
Pour les spectateur⋅ricesComment tchater pour les spectateur⋅rices
OBSDocumentation pour diffuser le contenu du tchat à l'aide d'OBS.
Clients XMPPSe connecter au tchat avec un client XMPP
Pour les streameur⋅eusesComment mettre en place le tchat pour vos diffusions en direct
Quelques basiquesQuelques informations de base sur comment configurer et utiliser le tchat pour vos directs
Configuration de la chaîneConfiguration des salons de discussion des chaînes Peertube
AnnouncementsRoom owners and administrators can send special announcements in the chat.
ModérationFonctions de modération avancées du plugin peertube-plugin-livechat
Conditions d'utilisationConfigurer les conditions d'utilisation des tchats de la chaîne
Mode lentMode lent du plugin peertube-plugin-livechat
Délai de modérationPlugin peertube-plugin-livechat délai de modération
Emojis personnalisésEmojis personnalisés du plugin peertube-plugin-livechat
Emojis only modePlugin peertube-plugin-livechat emojis only mode
SondagesYou can create polls to ask viewers their opinion
Tâches / listes de choses à faireVous pouvez gérer les tâches et les listes de tâches avec votre équipe de modération.
Moderation notesPlugin peertube-plugin-livechat moderation notes
Bot de tchatConfiguration du bot de tchat
Documentation d'installationInstallation du plugin peertube-plugin-livechat
En cas de problèmeQuelques erreurs classiques, et solutions de contournement.
Problème connu : compatibilité CPUPour l'instant le plugin ne supporte de base que les architectures CPU x86_64 et arm64. Veuillez trouver ici des instructions pour le faire fonctionner sur d'autres architectures CPU.
Mise à jour depuis une version antérieure à 6.0.0Notes importantes pour la mise à jour depuis une ancienne version du plugin.
Documentation administrateur⋅riceAdministration du Plugin Peertube Livechat
ParamètresParamètres du Plugin Peertube Livechat
Authentification externeParamètres du Plugin Peertube Livechat - Authentification Externe
Prosody mod_firewallAdvanced firewall rules for the Prosody server
Usage avancéQuelques fonctionnalités avancées
Clients XMPPAutoriser la connexion en utilisant des clients XMPP
Utiliser MatterbridgeUtiliser Matterbridge pour faire un pont vers d'autres tchats
ContribuerContribuer
Code de conduiteConvention de Code de conduite Contributeur⋅rices
TraductionTraduire le plugin
Donnez vos retoursDonnez vos retours
DévelopperDévelopper
DocumentationDocumenter le plugin, ou traduire la documentation.
Évolutions / BugsÉvolutions / suivi des bugs
Technical documentationTechnical documentation
Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
SondagesPolls technical documentation
Terms&ConditionsTerms&Conditions implementation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview
Me contacterContacter l'auteur
CréditsCrédits pour le plugin`,description:"Peertube plugin livechat documentation",tags:[],title:"Peertube livechat",uri:"/peertube-plugin-livechat/fr/index.html"},{breadcrumb:"Peertube livechat",content:"",description:"",tags:[],title:"Mots-clés",uri:"/peertube-plugin-livechat/fr/tags/index.html"}]