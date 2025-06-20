var relearn_search_index=[{breadcrumb:"Livechat de PeerTube",content:`Què és el connector Livechat? Aquest connector per a PeerTube proveeix un sistema de xat per als vídeos.
Per defecte, un cop instal·lat el connector a la instància de PeerTube es crearà automàticament una sala de xat per a cada emissió en directe.
A la captura de pantalla següent podeu veure una pàgina de vídeo clàssica de PeerTube, amb una sala de xat a la dreta (feu clic a la imatge per veure-la a pantalla completa):
Els i les espectadors/es podran accedir a la sala, encara que no tinguin un compte a la vostra instància. Aquests «anònims/es» només hauran de triar un àlies abans de poder parlar al xat.
De manera predeterminada el xat es mostra al costat del vídeo. Però podeu obrir-lo en una altra pestanya del navegador fent servir el botó de dalt:
Tip Podeu provar el connector de xat en directe mitjançant aquesta [pàgina de demostració] (https://www.yiny.org/w/399a8d13-d4cf-4ef2-b843-98530a8ccbae).
Instal·lació Com a administrador/a de PeerTube podeu instal·lar aquest connector a la vostra instància simplement utilitzant la botiga de complements inclosa a la interfície d’administració. Cerqueu «livechat» i feu clic a «Instal·lar»: i ja ho teniu!
Possibilitats de Livechat El connector té moltes funcions avançades. Utilitza l’estàndard XMPP «sota el capó», que permet a l’administració habilitar funcions avançades (connectar mitjançant clients XMPP, bots de xat, passarel·la amb altres protocols…). Més informació als apartats corresponents d’aquesta documentació.
Federació PeerTube forma part del fedivers: podeu crear una xarxa d’instàncies de PeerTube, compartint contingut entre elles.
Aquest connector és capaç de gestionar la federació: quan mireu un directe des d’una instància remota, us unireu al xat amb el vostre compte local. Iniciareu la sessió automàticament amb el vostre àlies i avatar.
Per descomptat, perquè la federació funcioni el connector s’ha d’instal·lar en ambdues instàncies.
Moderació De vegades heu de protegir la vostra comunitat de la gent dolenta. Com a administrador/a de la instància podeu optar per no permetre la federació del connector Livechat. Si algú d’una altra instància es comporta malament, els/les streamers, la moderació i l’administració tenen la facultat de bandejar o silenciar.
Bot de xat Aquest connector ve amb un bot de xat integrat. Consulteu la documentació per a més informació.
També podeu connectar qualsevol altre bot de xat XMPP mitjançant Components externs XMPP. Per fer-ho només heu de configurar l’accés als components externs a la configuració del connector.
Persistència del xat Quan us uniu a una sala veureu missatges antics, fins i tot els enviats abans que hi entréssiu.
Aquest comportament pot canviar segons la sala, i l’administració de la instància pot triar la durada de la conservació.
Integrar el xat a les vostres emissions en directe Quan utilitzeu programari com OBS per a la vostra emissió en directe podeu inserir el xat al vídeo. Això és útil per a les repeticions, per exemple.
A la captura de pantalla següent podeu veure una emissió en directe on el contingut del xat s’inclou a la part inferior del vídeo:
A la següent captura de pantalla podeu veure una configuració OBS, on el xat s’inclou com a font a l’escena actual (el color de fons es pot canviar i pot ser transparent):
Altres usos Per defecte cada streamer pot activar/desactivar el xat per a les seves emissions en directe.
Però a nivell d’instància l’administració pot optar per habilitar el xat per a tots els vídeos (directes i/o vídeo sota demanda).
També podeu habilitar el xat per a vídeos específics sota demanda. Així és com funciona la pàgina demo: no està en directe, però s’ha activat el xat específicament per a aquest vídeo.`,description:"Introducció",tags:[],title:"Introducció",uri:"/peertube-plugin-livechat/ca/intro/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'administració",content:`Aquesta secció descriu la pàgina de configuració del connector.
Condicions d’ús del xat del canal Podeu configurar un missatge de «condicions del servei» que es mostrarà a les persones que s’uneixin a les vostres sales de xat.
Per obtenir més informació sobre aquesta funció, consulteu la documentació condicions d’ús del canal.
Info Si canvieu aquesta configuració, es reiniciarà el servidor de xat i tots els usuaris es desconnectaran durant un breu període de temps.
Llistar sales existents Quan premeu el botó «Llista de sales» s’enumeren totes les sales de xat existents, a continuació les podeu trobar i moderar.
Federació La configuració següent es refereix a la federació amb altres instàncies de PeerTube i altres programes del fedivers.
No mostrar xats remots Marcant aquest paràmetre, la vostra instància no mostrarà mai els xats dels vídeos remots.
No publiqueu informació de xat En acceptar aquesta configuració, la vostra instància no publicarà la informació del xat al fediverse. Les instàncies remotes de Peertube no estaran al corrent de l’existència de sales de xat associades als vostres vídeos.
Tingueu en compte: si ja teniu xats en progrés, és possible que la informació ja hagi estat publicada. Haureu d’esperar a la propera actualització del vídeo abans que la informació sigui ocultada. A més, si desactiveu aquesta opció, haureu d’esperar a la propera actualització del vídeo abans que la informació sigui publicada una altra vegada. Aquesta actualització succeeix, entre d’altres, quan un esdeveniment en viu reprèn o s’atura.
Tingueu en compte: aquesta configuració només afecta la publicació d’informació mitjançant el protocol ActivityPub. No impedirà que una aplicació remota detecti la presència de xats i que intenti connectar-s’hi.
Autenticació Desactivar les fitxes de Livechat Si teniu problemes amb les fitxes d’autenticació a llarg termini, podeu desactivar aquesta funció aquí.
Autenticació externa Vegeu la pàgina de documentació detallada:
Autenticació externa
Configuració avançada del canal La configuració següent es refereix a les opcions avançades del canal: els usuaris podran personalitzar els seus canals, activar el bot de moderació, etc.
Desactivar la configuració avançada del canal i el bot de moderació Si teniu un problema amb aquesta funció, podeu desactivar-la.
Habilitar les expressions regulars per a les paraules prohibides del canal Quan s’activa aquesta funció les streamers podran utilitzar expressions regulars en configurar el bot de xat. No hauríeu d’activar aquesta funció si no confieu en els vostres usuari(e)s (qui poden crear sales de xat, és a dir: qui poden crear directes). Una persona maliciosa podria crear una expressió regular especialment dissenyada i provocar una denegació de servei del bot.
Comportament del xat Tipus de sala Podeu triar tenir diferents sales per a cada vídeo o agrupar-les per canal.
Obrir el xat automàticament Quan es miri un vídeo el xat s’obrirà automàticament.
Mostrar el botó «obriu en una finestra nova» Hi haurà un botó per obrir el xat en una finestra nova.
Mostrar el botó «Comparteix l’enllaç de la sala“ Aquesta funció us permet habilitar una finestra modal «comparteix l’enllaç de xat». Amb aquest modal podeu generar URL per unir-vos al xat. El xat es pot personalitzar (mode de només lectura, ús del tema actual, etc.).
Per exemple, podeu generar un URL de només lectura i utilitzar-lo a OBS per integrar el xat a la vostra emissió en directe!
Aquesta configuració us permet triar qui pot accedir a aquesta finestra modal.
Les persones poden activar el xat per als seus directes Si es marca tots els vídeos en directe tindran una casella a les propietats per activar el xat.
El propietari del vídeo podrà activar el xat en línia.
Activar el xat per a tots els directes Si està marcat hi haurà un xat a tots els directes.
Activar xat per als vídeos que no són en directe Si està marcat hi haurà un xat per a tots els vídeos que no siguin en directe.
Activar el xat per a aquests vídeos UUID de vídeos per als quals volem un xat web (UUID abreujat o UUIDv4). Poden ser vídeos que no siguin en directe. Un per línia. Podeu afegir comentaris: tot el que hi hagi després del caràcter # s’eliminarà i les línies buides s’ignoraran.
No afegiu vídeos privats, els UUID s’enviaran al frontend.
Amagar xat per a persones anònimes Si està marcat, les persones que no hagin iniciat sessió no veuran els xats. Aquesta característica encara és experimental. Si l’heu activada, és molt recomanable que també marqueu «No publicar informació de xat». En cas contrari, determinades eines de tercers no podrien intentar obrir el xat i tindrien resultats impredictibles.
Nota: de moment, aquesta funcionalitat simplement amaga el xat. En una versió futura, el xat serà substituït per un missatge que especifiqui «si us plau connectar-vos […]». Consulteu les notes de la versió 5.7.0 per obtenir més informació.
Prohibir la IP de persones anònimes quan se’ls bandeja d’alguna sala En activar aquesta opció cada vegada que una persona anònima és bandejada d’una habitació, la seva IP també quedarà prohibida del servidor de xat. Avís: si la vostra instància està oberta per a registres, algú podria crear una sala trampa, convidar-hi persones i prohibir automàticament les IP de les anònimes. La llista d’IP prohibides no es desa i s’eliminarà quan es reiniciï el servidor o si canvieu determinades configuracions del complement. Les IP prohibides es registren als registres del servidor de Prosody, de manera que els administradors del servidor poden utilitzar opcionalment eines externes (com ara fail2ban) per prohibir les IP de manera més àmplia.
Nota important: Si activeu aquesta funció i utilitzeu un servidor intermediari invers personalitzat davant de PeerTube, assegureu-vos que l’heu configurat correctament per reenviar IP d’usuari real a PeerTube. En cas contrari podria bloquejar tots els usuaris anònims alhora.
Tematització Conjunt d’avatars Podeu triar entre diversos jocs diferents els avatars predeterminats que s’utilitzaran per als usuaris de xat.
Sepia (mascota de Peertube): Generador d’avatars PeerTube de David Revoy, Llicència [CC-By](https://creativecommons .org/licenses/by/4.0/)
Gats: Generador d’avatars de xat per David Revoy, Llicència [CC-By](https: //creativecommons .org/licenses/by/4.0/)
Ocells: Generador d’avatars d’ocells de David Revoy, Llicència CC-By
Fennecs (mascota de Mobilizon): Generador d’avatar fenec/mobilizon de David Revoy, Llicència CC-By
Abstracte: Generador d’avatars abstractes de David Revoy, llicència [CC-By]( https: //creativecommons.org/licenses/by/4.0/)
Avatars antics de Sepia (els inclosos en versions anteriors del complement): basat en el treball de David Revoy, llicència [AGPL-v3](https://www.gnu.org/licenses/agpl -3.0.fr.html)
Si no veieu el canvi immediatament, es pot deure a la memòria cau del vostre navegador. Esborreu l’emmagatzematge de la sessió del navegador o reinicieu-lo.
Tema ConverseJS Podeu triar el tema que voleu utilitzar per a ConverseJS:
Tema PeerTube: aquest és un tema especial, dissenyat específicament per a la integració a PeerTube. Tema de ConverseJS predeterminat: aquest és el tema per defecte de ConverseJS. Tema cyberpunk de ConverseJS: aquest és un tema proporcionat per ConverseJS. Detecció de color automàtica Intenta detectar automàticament els colors del tema actual.
Quan aquesta opció està activada el complement prova de detectar automàticament els colors per aplicar-los al tema del xat.
Si això no funciona correctament per a alguns dels vostres temes de Peertube, podeu desactivar aquesta opció. Podeu informar d’errors al gestor de tiquets . No oblideu especificar per a quin tema no funciona.
Atribut d’estil iframe de xat Estils addicionals per aplicar a l’iframe de xat.
Exemple: height:400px;
Configuració avançada del xat Utilitzeu el servidor Prosody instal·lat al sistema El connector ve amb una AppImage que s’utilitza per executar el servidor XMPP Prosody. Si aquesta AppImage no funciona, podeu recórrer a la versió de Prosody empaquetada per al vostre servidor. Simplement instal·leu el paquet prosody.
Aquesta configuració només s’ha d’utilitzar si el connector està trencat i s’espera una solució.
Desactivar Websocket Amb Peertube >= 5.0.0, aquest complement intentarà utilitzar Websocket per a connexions de xat. Si el navegador o la connexió utilitzada no és compatible, el navegador canviarà automàticament al protocol BOSH. Però, en casos rars, pot fallar. Per exemple, si teniu un servidor intermediari invers davant del vostre Peertube que no permet connexions Websocket. En aquest cas podeu marcar aquesta opció per desactivar les connexions Websocket.
Port de Prosody El port que utilitzarà el servidor Prosody.
Canvieu-lo si aquest port ja s’utilitza al vostre servidor.
Podeu tancar aquest port al vostre tallafoc, el món exterior no hi accedirà.
Nota: això pot canviar en un futur proper, ja que hi ha plans per afegir paràmetres per permetre connexions externes.
URL de Peertube per a peticions d’API No toqueu aquest paràmetre si no sabeu què feu.
En casos excepcionals, el servidor de Prosody no pot alcançar l’API de Peertube mitjançant l’URL públic. Podeu utilitzar aquesta configuració per personalitzar l’URL que utilitzaran els mòduls de Prosody API de Peertube (per exemple, posant «http://localhost:9000» ó «http://127.0.0.1:9000»).
Si aquest paràmetre es deixa buit i utilitzeu PeerTube >= 5.1, el connector utilitzarà els valors del vostre fitxer de configuració de PeerTube per determinar en quina interfície i port s’han de fer les sol·licituds.
Com a últim recurs, utilitzarà l’URI públic de la vostra instància. Així, les crides a l’API passaran per Nginx. Això pot fallar en alguns casos: per exemple, si esteu en un contenidor Docker per al qual el nom d’amfitrió públic no es resol a la IP correcta. En aquest cas, proveu de canviar el paràmetre «URL de Peertube per a peticions d’API», posant http://127.0.0.1:9000 (si és el port 9000 que fa servir el vostre PeerTube, pregunteu als administradors de la vostra instància si no ho sabeu).
Desa registres de les sales per defecte Si està marcat el contingut de les sales es desarà per defecte. Quan un usuari s’uneix a una sala, podrà veure què s’ha dit abans.
Tingueu en compte que sempre és possible activar/desactivar aquesta funcionalitat per a una sala específica, canviant-ne la configuració.
Caducitat dels registres de la sala Podeu triar quant de temps es conserva el contingut de les sales al servidor. El valor pot ser:
60: el contingut es desarà durant 60 segons. Podeu substituir 60 per qualsevol valor enter. 1d: el contingut es desarà durant 1 dia. Podeu substituir 1 per qualsevol valor enter. 1s: el contingut es desarà durant 1 setmana. Podeu substituir 1 per qualsevol valor enter. 1m: el contingut es desarà durant 1 mes. Podeu substituir 1 per qualsevol valor enter. 1a: el contingut es desarà durant 1 any. Podeu substituir 1 per qualsevol valor enter. mai: el contingut no se suprimirà mai. Permetre la connexió a les sales mitjançant comptes XMPP externs En activar aquesta opció serà possible connectar-se a sales mitjançant comptes XMPP externs amb clients XMPP.
Avís, l’habilitació d’aquesta opció pot requerir una configuració a nivell de servidor i registres DNS. Per obtenir més informació, consulteu la documentació: Permet connexions amb comptes XMPP externs. Port Prosody de servidor a servidor El port que s’utilitza per a les connexions XMPP s2s (servidor a servidor).
Es recomana utilitzar el port estàndard 5269. En cas contrari, haureu de configurar un registre DNS específic .
Interfícies de xarxa per a connexions servidor a servidor Les interfícies de xarxa per escoltar les connexions s2s (servidor servidor).
Una llista d’IP separades per comes (s’eliminaran espais). Podeu utilitzar «*» per escoltar a tots els IPv4 i «::» a tots els IPv6.
Exemples de configuració possibles:
*,:: * 127.0.0.1,::1 172.18.0.42 Directori de certificats Si aquest camp està buit, el complement generarà i utilitzarà certificats autofirmats.
Si voleu utilitzar altres certificats, només heu d’especificar aquí la carpeta on Prosody els pot trobar. Nota: l’usuari «peertube» ha de tenir accés de lectura a aquesta carpeta.
Activar les connexions client-servidor Permetre que els clients XMPP es connectin al servidor de Prosody.
Aquesta opció sola només permet connexions de client a l’host local.
Aquesta configuració permet als clients XMPP connectar-se al servidor Prosody incrustat. Actualment aquesta opció només permet connexions de client a localhost.
Per exemple, aquesta opció pot permetre que una instància de Matterbridge (un cop pugui utilitzar una connexió anònima) a la mateixa màquina vinculi el vostre xat a altres serveis, com ara una sala de Matrix.
Port de client a servidor Prosody Port que s’utilitzarà per a les connexions XMPP c2s (client a servidor).
Els clients XMPP hauran d’utilitzar aquest port per connectar-se.
Canvieu aquest port si ja està en ús al servidor.
De moment podeu mantenir aquest port tancat al vostre tallafoc, serà inaccessible des de l’exterior (Prosody només escolta l’host local).
Nota: això pot canviar aviat, ja que hi ha plans per afegir una funció per habilitar connexions externes.
Interfícies de xarxa client-servidor Les interfícies de xarxa per escoltar les connexions c2s (client a servidor).
Aquesta configuració es proporciona als usuaris avançats. No canvieu aquesta configuració si no enteneu completament el que significa.<br< Ès una llista d’IP separades per comes (s’eliminaran espais).
Podem utilitzar «*» per escoltar a tots els IPv4 i «::» a tots els IPv6.
Exemples:
*,:: * 127.0.0.1,::1 127.0.0.1,::1, 172.18.0.42 Activar els components externs personalitzats de Prosody Aquesta configuració permet que els components XMPP externs es connectin al servidor. Per defecte, aquesta opció només permet connexions de components a localhost. Heu de canviar el valor del paràmetre “Interfícies de xarxa per a components externs de Prosody” per escoltar a altres interfícies de xarxa.
Aquesta funció es pot utilitzar per connectar ponts o robots.
Més informació sobre els components externs de Prosody aquí.
Activar els components externs personalitzats de Prosody Habilita l’ús de components XMPP externs.
Aquesta opció sola només permet connexions des de l’host local.
Heu de configurar les interfícies per escoltar i obrir els ports del vostre tallafoc perquè això estigui disponible per als servidors remots.
Aquesta característica es pot utilitzar, per exemple, per connectar robots a sales.
Port per a components externs de Prosody El port que cal utilitzar per als components XMPP.
Canvieu aquest port si ja està en ús al vostre servidor.
Podeu mantenir aquest port tancat al vostre tallafoc si no permeteu l’accés a interfícies diferents de l’host local.
Interfícies de xarxa per a components externs de Prosody Interfícies de xarxa per escoltar components externs.
És una llista d’IP separades per comes (s’eliminaran espais). Podeu utilitzar «*» per escoltar a tots els IPv4 i «::» a tots els IPv6.
Exemples:
*,:: * 127.0.0.1,::1 172.18.0.42 Components externs Components externs a declarar:
Un per línia. Utilitzeu el format «nom_component:contrasenya_component» (s'eliminaran espais). Podeu afegir comentaris: s'eliminarà tot el que hi ha després d'un caràcter # i s'ignoraran les línies buides. El nom només pot contenir caràcters alfanumèrics llatins i punts. Si el nom només conté caràcters alfanumèrics, se li sufixarà el domini XMPP. Per exemple, «bridge“ es convertirà en «bridge.el_vostre_domini.cat». També podeu especificar un nom de domini complet, però haureu d'assegurar-vos que la vostra configuració de DNS sigui correcta. Utilitzeu només caràcters alfanumèrics a la contrasenya secreta (utilitzeu almenys 15 caràcters). Activar mod_firewall per a Prosody Podeu habilitar mod_firewall al vostre servidor de Prosody.
Per obtenir més informació, consulteu la documentació.`,description:"Configuració del connector Livechat de PeerTube",tags:[],title:"Ajustaments",uri:"/peertube-plugin-livechat/ca/documentation/admin/settings/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers > Bot de xat",content:`Prohibir caràcters especials Info Aquesta funció arriba amb la versió del complement Livechat 12.0.0. Configuració En activar aquesta opció el bot de moderació suprimirà automàticament els missatges que continguin més de X caràcters especials. Els caràcters especials són aquells que no entren en cap d’aquestes categories: lletres, números, símbols de puntuació, símbols de moneda, emojis.
Tolerància Nombre màxim de caràcters especials que s’accepten en un missatge sense suprimir-lo.
Motiu Motiu per mostrar al costat dels missatges suprimits
Moderar també els missatges de les persones que moderen Per defecte els missatges de moderadores no es veuran afectats per aquesta funció. En marcar aquesta opció llurs missatges també s’eliminaran.`,description:"El bot pot moderar automàticament els missatges que contenen massa caràcters especials.",tags:[],title:"Caràcters especials",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/bot/special_chars/index.html"},{breadcrumb:"Livechat de PeerTube > Contribuir",content:` Tip Aquest codi de conducta està adaptat de Contributor Covenant, versió 2.1, disponible a https://www.contributor-covenant.org/version/2/1/code_of_conduct .html. Les traduccions estan disponibles a https://www.contributor-covenant.org/translations. Els casos de comportament abusiu, assetjador o altres comportaments inacceptables es poden informar als líders de la comunitat responsables de fer complir el codi de conducta a git.[at].john-livingston.fr.
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
For answers to common questions about this code of conduct, see the FAQ at https://www.contributor-covenant.org/faq. Translations are available at https://www.contributor-covenant.org/translations.`,description:"Convenció de codi de conducta per col·laboradors/es",tags:[],title:"Codi de conducta",uri:"/peertube-plugin-livechat/ca/contributing/codeofconduct/index.html"},{breadcrumb:"Livechat de PeerTube",content:` Documentació d'usuariDocumentació d'usuari per al connector Livechat de PeerTube
Per a espectadors/esCom xatejar per a espectadors/es de l'emissió
OBSDocumentació per publicar contingut de xat mitjançant OBS.
Clients XMPPConnectar al xat amb un client XMPP
Per a streamersCom configurar el xat per a les vostres emissions en directe
Alguns conceptes bàsicsInformació bàsica sobre com configurar i utilitzar el xat per a les vostres emissions en directe
Configuració del canalConfiguració de sales de xat del canal PeerTube
AnuncisAdministradors/es i propietaris/es de les sales poden enviar anuncis especials al xat.
ModeracióFuncions de moderació avançades del connector Livechat
Condicions d'úsConfigurar les condicions d'ús dels xats del canal
Mode lentMode lent del connector Livechat
Retard de moderacióRetard de moderació del connector Livechat
Emojis personalitzatsEmojis personalitzats del connector Livechat
Mode només emojisConnector Livechat en mode només emojis
EnquestesPodeu crear enquestes per demanar als/les espectadors/es la seva opinió
Tasques / llistes de coses a ferPodeu gestionar tasques i llistes de tasques pendents amb el vostre equip de moderació.
Notes de moderacióNotes de moderació del connector Livechat
Bot de xatConfiguració del bot de xat
Guia d'instal·lacióInstal·lació el connector Livechat de PeerTube
Resolució de problemesAlguns errors comuns i solucions alternatives.
Problemes coneguts: compatibilitat de CPUDe moment, el connector només admet les arquitectures de CPU x86_64 i arm64. Si us plau, trobareu instruccions per fer-lo funcionar en altres arquitectures de CPU aquí.
Actualització des d'una versió anterior a la 6.0.0Notes importants per a l'actualització des d'una versió anterior del connector.
Documentació d'administracióAdministració del connector de PeerTube Livechat
AjustamentsConfiguració del connector Livechat de PeerTube
Autenticació externaConfiguració del connector de Peertube Livechat - Autenticació externa
mod_firewall ProsodyRegles avançades del tallafoc per al servidor Prosody
Ús avançatAlgunes funcions avançades
Clients XMPPPermetre la connexió mitjançant clients XMPP
Utilitzar MatterbridgeEmprar Matterbridge per fer de passarel·la amb altres xats`,description:"Documentació del connector",tags:[],title:"Documentació",uri:"/peertube-plugin-livechat/ca/documentation/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació",content:` Per a espectadors/esCom xatejar per a espectadors/es de l'emissió
OBSDocumentació per publicar contingut de xat mitjançant OBS.
Clients XMPPConnectar al xat amb un client XMPP
Per a streamersCom configurar el xat per a les vostres emissions en directe
Alguns conceptes bàsicsInformació bàsica sobre com configurar i utilitzar el xat per a les vostres emissions en directe
Configuració del canalConfiguració de sales de xat del canal PeerTube
AnuncisAdministradors/es i propietaris/es de les sales poden enviar anuncis especials al xat.
ModeracióFuncions de moderació avançades del connector Livechat
Condicions d'úsConfigurar les condicions d'ús dels xats del canal
Mode lentMode lent del connector Livechat
Retard de moderacióRetard de moderació del connector Livechat
Emojis personalitzatsEmojis personalitzats del connector Livechat
Mode només emojisConnector Livechat en mode només emojis
EnquestesPodeu crear enquestes per demanar als/les espectadors/es la seva opinió
Tasques / llistes de coses a ferPodeu gestionar tasques i llistes de tasques pendents amb el vostre equip de moderació.
Notes de moderacióNotes de moderació del connector Livechat
Bot de xatConfiguració del bot de xat
Caràcters especialsEl bot pot moderar automàticament els missatges que contenen massa caràcters especials.
Cap missatge duplicatEl bot pot moderar automàticament els missatges duplicats.
Mots prohibitsEl bot pot moderar automàticament els missatges que contenen mots prohibits.
TemporitzadorsEl bot pot enviar alguns missatges periòdicament.
OrdresEl bot pot respondre a diferents ordres.`,description:"Documentació d'usuari per al connector Livechat de PeerTube",tags:[],title:"Documentació d'usuari",uri:"/peertube-plugin-livechat/ca/documentation/user/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari",content:`Unir-se a sales de xat Quan mireu un vídeo de PeerTube que té el xat activat, el veureu al costat:
Hi ha dos casos d’ús lleugerament diferents, depenent de si teniu un compte a la instància de PeerTube o no. Vegeu a continuació per obtenir més informació.
Si no teniu un compte de PeerTube Warning Aquesta funció la pot desactivar l’administració de la instància.
Si no esteu identificat a la instància de PeerTube on esteu veient el vídeo, us unireu automàticament al xat. Se us assignarà un àlies aleatori (com ara «Anònim 12345»).
Abans de poder parlar a la sala haureu de triar un àlies al camp de la part inferior de la finestra.
Iniciar la sessió amb un proveïdor d’autenticació extern Warning Aquesta funció la pot desactivar l’administració de la instància.
La instància de PeerTube pot configurar proveïdors d’autenticació externs (comptes de Mastodon, comptes de Google, etc.). En aquest cas, veureu un botó «Inicieu sessió amb un compte extern», que obrirà un diàleg modal en què hi haurà botons per iniciar sessió amb un compte remot.
Un cop inicieu sessió al compte remot es recuperaran automàticament el vostre àlies i l’avatar (si escau). No s’emmagatzemarà cap altra dada. Aquestes dades s’eliminaran automàticament unes quantes hores després de sortir del xat.
Si teniu un compte de PeerTube Si heu iniciat sessió amb el vostre compte de PeerTube unireu automàticament a la sala, utilitzant el vostre àlies i avatar de PeerTube.
Tip Si esteu veient una emissió en directe en una instància en què no teniu cap compte, però teniu un compte de PeerTube en una altra instància: sempre que el connector Livechat estigui instal·lat en ambdues instàncies podeu unir-vos al xat amb el vostre compte . Per fer-ho obriu el vídeo a la vostra instància (per exemple, podeu copiar/enganxar l’URL del vídeo al camp de cerca de la vostra instància).
Si teniu un compte de PeerTube en una altra instància Info Aquesta funció arriba amb la versió del complement Livechat 9.0.0. Si teniu un compte de PeerTube, però no a la instància actual, hi ha un botó «Inicieu sessió amb un compte extern». Aquest botó obrirà una finestra de diàleg on podeu introduir l’URL de la vostra instància. Un cop fet es comprovarà si el connector Livechat està disponible a la instància remota i si el vídeo hi està disponible. En aquest cas se us redirigirà al vídeo de la instància remota.
Xatejant Per enviar missatges simplement escriviu-los al camp «missatge» a la part inferior de la pantalla. Podeu enviar-los prement la tecla Intro del vostre teclat o fent clic al botó «enviar».
Si voleu afegir salts de línia als vostres missatges podeu utilitzar la combinació de tecles «majúscules + intro».
Podeu afegir emojis als missatges. Per exemple, podeu utilitzar el menú d’emojis o escriure directament dreceres com :smiley:.
Podeu esmentar altres participants. Per fer-ho, podeu escriure les primeres lletres del sobrenom i, a continuació, prémer la tecla de tabulació. També podeu escriure el caràcter @: això obrirà un menú directament. També podeu fer clic a un sobrenom a la llista de participants per inserir-lo al camp d’entrada del missatge.
Llista de participants Per veure la llista de participants només cal que obriu el menú de la dreta:
Podeu veure que alguns/es participants tenen drets especials (moderació, propietat, etc.).
Menú desplegable de xat Hi ha un menú desplegable a sobre del xat que inclou algunes funcions avançades. Això és especialment útil per a funcions de moderació. Les funcions disponibles depenen del vostre nivell d’accés.
Obrint a pantalla completa A sobre del xat hi ha un botó que us permet obrir-lo a pantalla completa. Això obrirà una nova pestanya del navegador amb el contingut següent:
Pot ser més fàcil xatejar amb una pestanya completa del navegador.
Canviant l’àlies Podeu canviar el vostre àlies escrivint /nick nou_àlies al camp del missatge.
També podeu canviar el vostre àlies mitjançant el menú desplegable del xat.`,description:"Com xatejar per a espectadors/es de l'emissió",tags:[],title:"Per a espectadors/es",uri:"/peertube-plugin-livechat/ca/documentation/user/viewers/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Guia d'instal·lació",content:`Acabo d’instal·lar/actualitzar el connector, però no passa res Si acabeu d’instal·lar/actualitzar el connector i no passa res (no hi ha xat, cap configuració, els botons no funcionen a la configuració, etc.), només heu de provar de tornar a carregar la pàgina.
Eina de diagnòstic Si el xat no funciona hi ha una eina de diagnòstic a la pàgina de configuració del connector.
Obriu la configuració del connector i feu clic al botó «Executar diagnòstics».
Si hi ha un error a la pàgina de diagnòstic podeu buscar una solució en aquesta pàgina, o si no trobeu una resposta, consultar [la pàgina de documentació «desenvolupaments / errors»](/peertube-plugin -livechat/ca/issues/).
El xat no es carrega Crides internes a l’API En alguns casos (com les instal·lacions de PeerTube a Docker), l’eina de diagnòstic mostra un error anomenat «API Prosody -> PeerTube està KO».
En aqueix cas, proveu de canviar el paràmetre «URL de Peertube per a peticions d’API», posant http://127.0.0.1:9000 (assumint és el port 9000 el que fa servir el vostre PeerTube, pregunteu als administradors de la instància si no ho sabeu).
Consulteu la pàgina d’ajuda per a aquesta configuració.
Websocket Si tot està bé segons l’eina de diagnòstic, però la finestra de xat roman buida: això pot ser un problema de Websocket. Des de la versió 5.0.0 de PeerTube, hi ha una configuració addicional per fer al costat del servidor. Consulteu amb els administradors de la vostra instància si no s’han oblidat d’aplicar els canvis enumerats a les Notes de la versió de Peertube 5.0.0 .
Podeu confirmar si es tracta d’un problema de Websocket obrint la consola del vostre navegador i comprovant si hi ha cap registre d’errors que mencioni una connexió de Websocket fallida.
Si no podeu solucionar-ho immediatament, podeu desactivar Websocket desmarcant «Desactivar Websocket» a la pàgina de configuració del connector. En aquest cas, també hauríeu de desmarcar «No publiqueu informació de xat», perquè la federació de xat no funcionarà sense Websocket.`,description:"Alguns errors comuns i solucions alternatives.",tags:[],title:"Resolució de problemes",uri:"/peertube-plugin-livechat/ca/documentation/installation/troubleshooting/index.html"},{breadcrumb:"Livechat de PeerTube > Technical documentation",content:`This page describes the different source code folders and their content.
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
vendor The vendor folder is not part of the source code. It is used during the build process to download some external source code.`,description:"Source code organization",tags:[],title:"Source code",uri:"/peertube-plugin-livechat/ca/technical/sourcecode/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers > Bot de xat",content:`No hi ha missatges duplicats Info Aquesta funció arriba amb la versió del complement Livechat 12.0.0. Configuració En activar aquesta opció el bot de moderació moderarà automàticament les publicacions duplicades. Això vol dir que si un usuari envia el mateix missatge dues vegades en X segons, el segon missatge s’eliminarà.
Interval de temps Interval, en segons, durant el qual un usuari no pot tornar a enviar el mateix missatge.
Motiu Motiu per mostrar al costat dels missatges suprimits
Moderar també els missatges de les persones que moderen Per defecte els missatges de moderadores no es veuran afectats per aquesta funció. En marcar aquesta opció llurs missatges també s’eliminaran.`,description:"El bot pot moderar automàticament els missatges duplicats.",tags:[],title:"Cap missatge duplicat",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/bot/no_duplicate/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'administració",content:`Els comptes que no estiguin connectats a la vostra instància de PeerTube s’uneixen al xat mitjançant «comptes anònims» (poden triar lliurement un sobrenom i se’ls assignarà un avatar aleatori).
Podeu habilitar mètodes d’autenticació externs per permetre la creació comptes per xatejar. En aquest cas, l’àlies i l’avatar s’inicialitzaran automàticament amb la informació del compte remot.
Aquests «comptes externs» seran més fàcils de moderar que els comptes anònims.
Això també permet al compte unir-se al xat sense crear un compte de PeerTube (per exemple, en cas que la vostra instància hagi tancat el registre, o sense esperar l’aprovació del compte).
Aquesta pàgina descriu els mètodes d’autenticació disponibles.
Per obtenir la documentació d’usuari consulteu la pàgina documentació d’usuari
OpenID Connect Warning Aquesta característica encara és experimental. Aquesta funció arriba amb la versió de Livechat >= 9.0.0.
Podeu configurar un proveïdor extern compatible amb OpenID Connect.
Per exemple, podeu utilitzar el vostre lloc web per a l’inici de sessió únic.
El programari CMS més popular (Wordpess, etc.) ofereix mòduls que implementen OpenID Connect.
Per habilitar aquesta funció, primer heu de crear un client al costat del vostre proveïdor (consulteu la documentació per habilitar OpenID Connect). A continuació, aneu a Configuració del connector i activeu «Utilitzeu un proveïdor OpenID Connect».
Nota: si voleu restringir els URL de redirecció autoritzats al costat del proveïdor (bones pràctiques de seguretat), el connector us indicarà l’URL per autoritzar. Simplement copieu-lo a la configuració de la vostra aplicació OpenID Connect.
Ara heu d’omplir alguns paràmetres.
Etiqueta per al botó d’inici de sessió Aquesta etiqueta serà visible, com també l’etiqueta del botó de connexió OpenID Connect.
Aquesta és l’etiqueta del botó a la captura de pantalla següent:
De moment no és possible localitzar aquesta etiqueta.
URL de descoberta (Discovery URL) El vostre proveïdor d’OpenID Connect ha d’implementar l’URL de descoberta. Establiu aquí l’URL de descobriment, que hauria de ser com https://exemple.cat/.well-known/openid-configuration.
Nota: si el vostre proveïdor utilitza el camí estàndard /.well-known/openid-configuration, podeu ometre-lo. Per exemple, https://accounts.google.com funcionarà.
ID de client (Client ID) L’identificador de client de la vostra aplicació (ID de client).
Secret de client (Client Secret) La clau secreta de la vostra aplicació (client secret).
Google, Facebook, … A més d’això, també podeu configurar un o més proveïdors «estàndard» d’Open ID Connect (Google, Facebook, etc.).
Per a aquests proveïdors, l’URL de descoberta i l’etiqueta del botó estan predefinits. Només cal que creeu una aplicació OAuth2 al costat del proveïdor i configureu l’identificador i el secret del client.
Si teniu en compte un proveïdor estàndard que no està disponible, podeu sol·licitar la implementació obrint un nou tiquet.
Resolució de problemes Si el botó no apareix és visible pot haver-hi un problema de configuració. Podeu provar l’eina de diagnòstic per obtenir més informació.
Nota: si heu iniciat sessió al vostre compte de PeerTube, el botó no apareixerà mai. Utilitzeu una finestra d’incògnit per provar.
Si el botó apareix però no funciona, comproveu els registres de Peertube. Això podria ser perquè el servei remot no utilitza àmbits ni noms d’atributs estàndard.
Més per vindre… Altres mètodes d’autenticació s’implementaran en el futur.`,description:"Configuració del connector de Peertube Livechat - Autenticació externa",tags:[],title:"Autenticació externa",uri:"/peertube-plugin-livechat/ca/documentation/admin/external_auth/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació",content:` Info Abans d’actualitzar el connector a una nova versió principal, llegiu les notes de la versió i la llista de possibles canvis no compatibles amb versions anteriors: CHANGELOG.
Tip Per instal·lar o actualitzar aquest connector, només feu servir la vostra interfície web d’administració de PeerTube.
A continuació es mostren més instruccions:
Resolució de problemesAlguns errors comuns i solucions alternatives.
Problemes coneguts: compatibilitat de CPUDe moment, el connector només admet les arquitectures de CPU x86_64 i arm64. Si us plau, trobareu instruccions per fer-lo funcionar en altres arquitectures de CPU aquí.
Actualització des d'una versió anterior a la 6.0.0Notes importants per a l'actualització des d'una versió anterior del connector.`,description:"Instal·lació el connector Livechat de PeerTube",tags:[],title:"Guia d'instal·lació",uri:"/peertube-plugin-livechat/ca/documentation/installation/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers > Bot de xat",content:`Podeu configurar algunes paraules que seran moderades automàticament pel bot (les publicacions que continguin aquestes paraules s’eliminaran a l’instant). També podeu afegir un motiu opcional, que es mostrarà en lloc dels missatges suprimits. Alguns exemples de configuració es proporcionen a la pàgina de documentació.
Podeu omplir diverses línies «Paraules o expressions prohibides». Quan s’envia un missatge que coincideix amb un dels criteris configurats s’eliminarà automàticament.
Paraules o expressions prohibides Aquí podeu configurar diversos mots, grups de paraules o «expressions regulars».
Cada vegada que algú envia un missatge aquestes paraules seran comprovades. Si el missatge conté algun d’aquests el missatge s’eliminarà.
Per exemple, podeu omplir aquest camp amb una llista d’insults.
Per obtenir alguns exemples, consulteu suggeriments de paraules prohibides.
Si teniu llistes de mots útils podeu contribuir a aquesta pàgina de suggeriments. Es troben a la carpeta support/forbidden_words del codi font. Consulteu la guia de contribució per obtenir més informació.
Tip Aquests mots no distingeixen entre majúscules i minúscules.
Tip Podeu combinar un retard de moderació breu (1 segon per exemple) amb el bot de moderació per eliminar les publicacions que contenen insults abans que fins i tot un usuari que no sigui moderador les vegi.
Warning Aquesta característica encara és experimental. Pot ser que hi hagi problemes amb els alfabets no llatins. Si és així podeu obrir un tiquet per informar del vostre problema.
Tracta com una expressió regular Warning Aquesta funció la pot desactivar l’administració de la instància.
En marcar aquesta opció cada línia del camp «Paraules o expressions prohibides» es considerarà com una expressió regular.
Moderar també els missatges de les persones que moderen Per defecte els missatges de moderadores no es veuran afectats per aquesta funció. En marcar aquesta opció llurs missatges també s’eliminaran.
Motiu Motiu per mostrar al costat dels missatges suprimits
Comentaris Podeu afegir alguns comentaris sobre aquesta regla aquí, per recordar-vos com i per què la vau crear. Aquests comentaris són purament orientatius i no tenen cap influència en el comportament del bot.`,description:"El bot pot moderar automàticament els missatges que contenen mots prohibits.",tags:[],title:"Mots prohibits",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/bot/forbidden_words/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Guia d'instal·lació",content:`L’AppImage Prosody inclòs al connector només funciona amb CPU x86_64 i arm64. No és compatible amb altres arquitectures de CPU.
Per utilitzar el connector haureu d’instal·lar manualment Prosody al vostre servidor (vegeu més avall).
Nota: la versió de Prosody hade ser superior o igual a 0.12.0. Si utilitzeu una versió anterior, pot haver-hi errors a la federació de xat i altres comportaments inesperats.
Un cop fet això haureu de comprovar el paràmetre Utilitzar Prosody del sistema del connector.
Instal·lació diferent de Docker Per a instal·lacions estàndard només heu d’instal·lar el paquet prosody disponible oficialment per a la vostra distribució de Linux.
Per exemple, a Debian/Ubuntu:
sudo apt install prosodyA continuació podeu desactivar el servei que s’inicïi automàticament quan instal·leu el paquet (el connector iniciarà el seu propi procés de Prosody i no necessita que el servei s’executi al servidor). Per exemple, a Debian/Ubuntu (i altres distribucions basades en Systemd):
sudo systemctl disable prosody && sudo systemctl stop prosodyAvís: no desactiveu Prosody si l’utilitza un altre servei del vostre servidor, per exemple, per Jitsi.
Docker Haureu de generar una imatge de PeerTube que inclogui Prosody al mateix contenidor que Peertube. Sé que aquesta no és la manera estàndard de fer les coses amb Docker, però tingueu en compte que aquesta és una solució temporal.
Per generar aquesta imatge, consulteu la documentació de Docker. El fitxer Docker per generar la imatge hauria de ser:
FROM chocobozzz/peertube:production-bullseye RUN apt -y update && apt install -y prosody && apt -y cleanYunohost Heu de desactivar metronome (el servidor XMPP utilitzat per Yunohost) i instal·lar prosody.
Això ja ho fa l’aplicació Yunohost PeerTube, ja que era un requisit previ per a les versions de connectors anteriors a la v6.0.0.
Però es pot eliminar de l’aplicació Yunohost PeerTube en un futur proper (per evitar els inconvenients d’aquest mètode). Necessito parlar amb l’equip de Yunohost per decidir la manera correcta de fer-ho per minimitzar les molèsties i maximitzar la compatibilitat.`,description:"De moment, el connector només admet les arquitectures de CPU x86_64 i arm64. Si us plau, trobareu instruccions per fer-lo funcionar en altres arquitectures de CPU aquí.",tags:[],title:"Problemes coneguts: compatibilitat de CPU",uri:"/peertube-plugin-livechat/ca/documentation/installation/cpu_compatibility/index.html"},{breadcrumb:"Livechat de PeerTube > Technical documentation",content:` Warning This page describes experimental features. These features are available with the plugin version >= 7.2.0.
Introducció Peertube is part of the Fediverse. So Peertube video can be watched from other Peertube instances, and from various other softwares:
from a Mastodon (or other fediverse application) instance, from a mobile app (Fedilab, Tusky, …), from desktop fediverse app, … This livechat plugin is using well known standards, so it is possible to join chat rooms even when not viewing the video on Peertube.
There are basically 2 ways to join the chat room associated to a video:
opening a web page (with an url like https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535), using a XMPP client (and joining a room like xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join) Warning Joining the chat using a XMPP client is not always possible. It requires some DNS and server configuration. It will only be possible if instance’s admins have correctly setup the external XMPP clients connection feature.
Warning Don’t try to gues these url and connection methods yourself. Please report to next chapters.
Chat discovery Using ActivityPub The livechat plugin adds some data in Video ActivityPub objects, so that the chat can be discovered.
Info This requires Peertube >= 5.1
This follows the FEP-1970 recommendations.
Warning At the time of the writing, this FEP is in draft status, and the livechat plugin is a Proof-of-concept. Until the FEP is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
Basically, the chat will be declared as attachments on the Video object, using the discussion relation.
By default, here is an example of what you will get:
{ "@context": [ "https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1", { "RsaSignature2017": "https://w3id.org/security#RsaSignature2017" }, { // ... } ], "to": [ "https://www.w3.org/ns/activitystreams#Public" ], "cc": [ "https://yourinstance.tld/accounts/root/followers" ], "type": "Video", "id": "https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535", "name": "The video title", // ... "url": [ /* ... */ ], "attachment": [ { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" } ] }In case the instance has activated the external XMPP clients connection feature:
{ "@context": [ "https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1", { "RsaSignature2017": "https://w3id.org/security#RsaSignature2017" }, { // ... } ], "to": [ "https://www.w3.org/ns/activitystreams#Public" ], "cc": [ "https://yourinstance.tld/accounts/root/followers" ], "type": "Video", "id": "https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535", "name": "The video title", // ... "url": [ /* ... */ ], "attachment": [ { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" }, { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join" } ] }Algorithm If you want to display the chat in a web page or in an iframe, here is what you should do:
get the Video ActivityPub object, if there is no attachment key, stop. loop through the attachment values (if attachment is not an array, just iterate on this single value) search for an entry with rel === discussion, and with href using the https scheme (that begins with https://) if found, open this href If you want to open the chat room using the XMPP protocol:
get the Video ActivityPub object, if there is no attachment key, stop. loop through the attachment values (if attachment is not an array, just iterate on this single value) search for an entry with rel === discussion, and with href using the xmpp scheme (that begins with xmpp://) if found, open this xmpp uri with your client, or connect to the XMPP room at that address Additional notes In the ActivityPub object, there is also a peertubeLiveChat entry. Don’t use the content of this entry. This is specific to the livechat plugin, and can be changed or removed in a near future. It is currently required for some endpoint discovery.
Using Podcast RSS feed The livechat plugin adds some data in Podcast RSS feeds under the <podcast:liveItem>, so that the chat can be discovered for live streams.
Info This requires Peertube >= 5.2
Info The <podcast:chat> element is currently only supported for live streams.
This follows the <podcast:chat> proposal.
Warning At the time of the writing, this proposal is in draft status, and the livechat plugin is a Proof-of-concept. Until the proposal is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
Basically, the chat will be declared as tag under on the <podcast:liveItem> element.
By default, here is an example of what you will get:
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z"> <title>The video title</title> <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid> <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link> <podcast:socialInteract uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" protocol="activitypub" accountUrl="https://yourinstance.tld/a/youraccount" /> <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" /> <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true"> <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" /> </podcast:alternateEnclosure> <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" /> <podcast:chat server="yourinstance.tld" protocol="xmpp" embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" /> </podcast:liveItem>In case the instance has activated the external XMPP clients connection feature:
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z"> <title>The video title</title> <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid> <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link> <podcast:socialInteract uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" protocol="activitypub" accountUrl="https://yourinstance.tld/a/youraccount" /> <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" /> <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true"> <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" /> </podcast:alternateEnclosure> <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" /> <podcast:chat server="yourinstance.tld" protocol="xmpp" space="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld" embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" /> </podcast:liveItem>Algorithm If you want to display the chat in a web page or in an iframe, here is what you should do:
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub if there is no <podcast:chat> element under the <podcast:liveItem>, stop. loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and an embedUrl attribute if found, open this embedUrl If you want to open the chat room using the XMPP protocol:
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and a space attribute space should be an XMPP JID for a MUC if found, open this XMPP JID with your client after converting it to a join URI, or connect to the XMPP room at that address `,description:"Displaying the livechat with 3rd party software.",tags:[],title:"Third party",uri:"/peertube-plugin-livechat/ca/technical/thirdparty/index.html"},{breadcrumb:"Livechat de PeerTube > Contribuir",content:`Podeu contribuir a la traducció d’aquest connector de Peertube. Les traduccions les gestiona el programari Weblate, mitjançant la instància de Framasoft Weblate.
Warning No modifiqueu mai directament els fitxers de la carpeta languages del connector, correu el risc de crear conflictes.
Com fer Creeu un compte: https://weblate.framasoft.org/accounts/register/ Valideu la vostra adreça electrònica fent clic a l’enllaç rebut Trieu la vostra contrasenya i configureu el vostre compte Aneu al projecte del connector: https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/ Trieu l’idioma que voleu traduir Només cal afegir les traduccions que falten o corregir les que semblin incorrectes. Warning Pot haver-hi cadenes «bastant tècniques». Si no teniu certesa del significat, o de la traducció, és millor no traduir-lo; de manera que es mostrarà la versió en anglès.
Traduccions de ConverseJS Aquest connector es basa en ConverseJS per a la visualització del xat. ConverseJS té les seves traduccions a la pròpia instància de Weblate. També podeu traduir directament al repositori de codi. Per obtenir més informació, consulteu la documentació de traducció de ConverseJS.
Afegir un idioma nou Si l’idioma que us interessa no és present, primer assegureu-vos que sigui compatible amb PeerTube. Si és així, podeu obrir un tiquet per sol·licitar que s’afegeixi.
Afegir noves cadenes / utilitzar traduccions al codi Si esteu treballant en una funció nova i necessiteu noves cadenes, creeu-los directament a Weblate. La versió en anglès és obligatòria, comenceu per aquesta.
Cada cadena està enllaçada a una clau (p. ex., use_chat). Trieu una clau en anglès, prou explícita i en minúscula.
Si necessiteu provar les vostres localitzacions sense esperar la fusió de Weblate, podeu modificar els fitxers languages/*.yml, però eviteu fer-ne «commit» (per minimitzar el risc de conflictes).
Utilitzar traduccions al codi del «front-end» Abans d’utilitzar una cadena al «front-end» heu de declarar una constant nova a client/@types/global.d.ts. La constant ha de:
començar amb el prefix «LOC_» utilitzar la clau de la cadena, en majúscules només heu de declarar-ne el tipus, no el valor Per exemple, per utilitzar «use_chat», heu de declarar:
declare const LOC_USE_CHAT: stringL’script build-client.js llegirà el fitxer client/@types/global.d.ts, cercarà aquestes constants i carregarà els seus valors des del fitxer d’idioma.
Ara podeu utilitzar peertubeHelpers.translate(LOC_USE_CHAT) al vostre codi.
Utilitzar traduccions al «back-end» En teoria les úniques parts del codi que necessiten traduccions són les declaracions de paràmetres i la generació de dades estandarditzades (ActivityPub, RSS, …). Aquí hem de recuperar les cadenes en anglès de les claus de traducció.
Nota: mai no hauríeu de necessitar idiomes diferents de l’anglès per al codi del «back-end». Les traduccions s’han de fer a la part del «front-end».
Hi ha un mòdul lib/loc.ts que proporciona una funció loc(). Només cal passar la clau per recuperar la cadena en anglès: loc('diagnostic').
Traducció de documentació La traducció de la documentació es fa mitjançant el component Weblate corresponent.
Hi ha un «codi curt Hugo» específic que us permet mostrar una cadena de l’aplicació. Per exemple, si voleu mostrar l’etiqueta del botó «open_chat_new_window» podeu utilitzar el codi següent al fitxer de documentació:
{{% livechat_label open_chat_new_window %}}També podeu evitar que es tradueixi una pàgina sencera afegint livechatnotranslation:true a la secció Yaml Font Matter del fitxer:
--- title: "Third party" description: "Displaying the livechat with 3rd party software." weight: 20 chapter: false livechatnotranslation: true ---No traduïu mai una cadena al fitxer livechat.en.pot, això s’ignorarà. En lloc d’això editeu el fitxer «markdown» directament.
Si una cadena conté un enllaç podeu canviar-lo a l’enllaç correcte en l’idioma de destinació. Per exemple, si és un enllaç a la documentació podeu afegir el codi d’idioma a l’URL.
Algunes cadenes són blocs de codi. No els traduïu. Tanmateix, podeu traduir els comentaris, o els paràmetres si és rellevant.
En cas de dubte no traduïu i pregunteu què fer.
Les eines utilitzades per gestionar les traduccions de documentació poden tenir un comportament estrany. Quan s’afegeix una frase semblant una altra existent, de vegades copiarà les traduccions. Per tant, quan tingueu traduccions marcades com a «per comprovar», si us plau assegureu-vos que no hagi copiat cap traducció que no tingui res a veure amb la versió en anglès abans de validar.
Si no esteu segurs del context d’una cadena de text podeu comprovar la ubicació de la cadena d’origen al tauler dret de Weblate i obrir la pàgina de documentació corresponent. Per exemple, per a un canal situat al fitxer support/documentation/content/en/documentation/user/streamers.md, l’URL corresponent és https://livingston.frama.io/peertube-plugin-livechat/documentation/user/streamers/.
Recomanacions genèriques Si us plau sigueu inclusius/ves en les vostres paraules i respecteu el codi de conducta.`,description:"Traduir el plugin",tags:[],title:"Traduir",uri:"/peertube-plugin-livechat/ca/contributing/translate/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'administració > Ús avançat",content:`Aquest mòdul de xat es basa en el protocol XMPP, també conegut com Jabber. Per tant, és possible connectar-se als xats mitjançant programari client XMPP. Això pot ser útil, per exemple, per facilitar les operacions de moderació.
Per obtenir la documentació d’usuari associada a aquestes funcions, consulteu la pàgina de documentació de l’usuari.
Info L’habilitació d’aquestes funcions requereix canvis de configuració al servidor i als registres DNS. No és possible activar-los només des de la interfície PeerTube, i això requereix unes habilitats bàsiques d’administració del sistema.
Iniciar sessió amb el vostre compte de PeerTube Warning Aquesta funcionalitat encara no està disponible i arribarà en una versió futura del connector.
Iniciar sessió amb un compte XMPP extern Per habilitar aquesta funció haureu de configurar el vostre servidor i els registres DNS, de manera que els clients XMPP puguin trobar i accedir al servidor Prosody que aquest connector utilitza internament.
Configuració del connector Comenceu anant a la configuració del connector de Livechat de la vostra instància i, a continuació, activeu la configuració «Permetre connexions a les sales mitjançant comptes XMPP externs». En marcar-ho, apareixen nous camps a continuació.
Primer, el camp «Port per a connexions de servidor Prosody a servidor». El valor predeterminat és 5269, que és el port estàndard per a aquest servei. Tanmateix, podeu canviar a un altre port, si aquest ja s’utilitza al vostre servidor.
A continuació, el camp «Interfícies de xarxa per a connexions de servidor a servidor» us permet indicar a quines interfícies de xarxa ha d’escoltar el servidor. El valor predeterminat «*, ::» indica que s’escolta a totes les adreces IP. Podeu canviar aquests valors, si voleu escoltar només en determinades IP. La sintaxi s’explica al costat del camp.
Quant al camp «Carpeta de certificats», podeu deixar-lo buit. En aquest cas, el connector generarà automàticament certificats autofirmats. Alguns servidors XMPP poden negar-se a connectar-se, depenent de llur configuració. En aquest cas, podeu indicar aquí una ruta al servidor, en la qual heu de col·locar els certificats per ser utilitzats pel mòdul. Depèn de vosaltres generar-los i renovar-los. Més informació a continuació.
Tallafoc Heu d’obrir el port configurat (5269 per defecte) al vostre tallafoc.
Si utilitzeu Docker per al vostre PeerTube heu de modificar el fitxer docker-compose.yml per obrir el port 5269 del contenidor peertube al món exterior.
DNS Heu d’afegir registres DNS per permetre que els servidors remots trobin els components «room.exemple.cat» i «external.exemple.cat».
La manera més senzilla de fer-ho és afegir registres SRV per als subdominis «room» i «external»:
nom del registre: _xmpp-server._tcp.room.exemple.cat. (substituïu «exemple.cat» per la URI de la vostra instància)
TTL: 3600
class: IN
SRV: 0
priority: 0
weight: 5
port: 5269 (adapteu-lo si heu canviat el port)
target: exemple.cat. (substituïu-lo per la URI de la vostra instància)
record name: _xmpp-server._tcp.external.exemple.cat. (substituïu «exemple.ca» per la URI de la vostra instància)
TTL: 3600
class: IN
SRV: 0
priority: 0
weight: 5
port: 5269 (adapteu-lo si heu canviat el port)
target: exemple.cat. (substituïu-lo per la URI de la vostra instància)
Aneu amb compte de mantindre el punt després d’«exemple.cat».
Si utilitzeu l’ordre dig per comprovar els vostres registres, hauríeu d’obtenir un resultat semblant a aquest:
$ dig +short _xmpp-server._tcp.room.videos.john-livingston.fr. SRV 0 5 5269 videos.john-livingston.fr. $ dig +short _xmpp-server._tcp.external.videos.john-livingston.fr. SRV 0 5 5269 videos.john-livingston.fr.Si no utilitzeu el port estàndard 5269, també heu d’afegir un registre SRV per a _xmpp-server._tcp.exemple.cat. (igual que a dalt, sense el prefix room.). Per descomptat, també podeu afegir aquest registre si feu servir el port estàndard. També funcionarà.
Ús de certificats de confiança Els certificats autodignats que el connector utilitza de manera predeterminada poden no ser adequats per a tots els servidors XMPP. De fet, poden rebutjar-los per motius de seguretat.
És possible utilitzar certificats validats per una autoritat de certificació. Tanmateix, això requereix coneixements avançats d’administració de sistemes. De fet, donada la multitud de casos possibles, aquí és impossible documentar totes les situacions. Per tant, aquesta documentació simplement explicarà l’objectiu a assolir i donarà un exemple que només serà adequat per a una situació «bàsica» (instal·lació manual de PeerTube, amb l’ús de letsencrypt). Si us trobeu en una altra situació (instal·lació de Docker, certificats signats per una altra autoritat, etc.), haureu d’adaptar l’enfocament.
Principi bàsic Depèn de vosaltres generar certificats vàlids per als dominis exemple.cat i room.exemple.cat\`. Podeu utilitzar qualsevol mètode compatible amb Prosody.
A continuació, heu de col·locar aquests certificats en una carpeta la qual serà accessible per l’usuari peertube, i després indicar aquesta carpeta al paràmetre del connector «Carpetes de certificats».
Tip Si voleu utilitzar la utilitat ProsodyCtl per importar certificats, aquesta utilitat està disponible (un cop iniciat PeerTube) mitjançant l’ordre següent (adaptant el camí a la carpeta de dades de PeerTube i substituint «xxx» amb els arguments que voleu passar a prosodyctl ): sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody /prosody.cfg.lua xxx
El connector comprovarà un cop al dia si s’ha modificat algun fitxer en aquesta carpeta i tornarà a carregar Prosody si cal.
Mètode per al cas simple Suposem aquí que la vostra instal·lació de Peertube és «clàssica» (no fa servir Docker) i que els certificats es generen mitjançant letsencrypt, utilitzant l’eina certbot.
En primer lloc haurem de crear un certificat per al subdomini room.exemple.cat: aquest és l’URI del component MUC (sales de xat XMPP). Fins i tot si les connexions es fan a exemple.cat, necessitarem un certificat vàlid per a aquest subdomini.
Així que comenceu configurant una entrada DNS per a room.exemple.cat, que apunta al vostre servidor. Podeu fer una entrada CNAME (o una entrada A i una entrada AAAA).
A continuació, utilitzarem nginx (ja instal·lat per al vostre PeerTube) per generar el certificat de certbot. Anem a crear un nou lloc. Al fitxer /etc/nginx/site-available/room.peertube, afegiu:
server { listen 80; listen [::]:80; server_name room.exemple.cat; location /.well-known/acme-challenge/ { default_type "text/plain"; root /var/www/certbot; } location / { return 301 https://exemple.cat;; } }Aleshores activeu el lloc:
ln -s /etc/nginx/sites-available/room.peertube /etc/nginx/sites-enabled/ systemc reload nginxA continuació preparem el fitxer al qual més tard importarem els certificats. Suposem aquí que ja teniu el connector actiu. Crearem la següent carpeta (si encara no existeix), amb l’usuari peertube per assegurar-nos que no hi ha cap problema de permisos:
sudo -u peertube mkdir /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/certsAra heu de configurar aquesta carpeta a la configuració del connector, per a «Carpetes de certificats». És important fer-ho abans de continuar, en cas contrari, l’script d’importació de certificats els col·locarà al lloc equivocat.
Configurarem certbot perquè importi els certificats generats a la carpeta Prosody. Podrem utilitzar la utilitat ProsodyCtl empaquetada al connector.
Nota: perquè estigui disponible, el connector s’ha d’haver iniciat almenys una vegada.
Crearem un fitxer /etc/letsencrypt/renewal-hooks/deploy/prosody.sh que conté:
#!/usr/bin/env sh /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl \\ --root \\ --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ cert import \\ room.exemple.cat exemple.cat /etc/letsencrypt/liveAleshores demanem generar el certificat:
certbot -d room.videos.john-livingston.frSi certbot us ofereix diversos mètodes per generar el certificat, trieu «nginx».
Normalment ara hauríeu de trobar els certificats a la carpeta configurada.
Nota: la primera vegada que ho feu, haureu de tornar a carregar Prosody. La manera més senzilla de fer-ho és reiniciar PeerTube.
Mètode quan s’utilitza Docker Aquest mètode funciona amb la guia de Docker oficial de PeerTube.
Primer, assegureu-vos de crear una entrada DNS per a room.exemple.cat, que apunta al vostre servidor. Podeu utilitzar una entrada CNAME (o una entrada A i una entrada AAAA). Això és necessari perquè «Let’s Encrypt» validi el domini per a la generació de certificats.
Introduïu el directori on es troba el vostre fitxer docker-compose.yml.
Obriu un shell al contenidor de certbot:
docker exec -it certbot /bin/shExecuteu certbot:
certbotSe us presentarà una sèrie d’indicacions. Introduïu «2» per al tipus d’autenticació:
How would you like to authenticate with the ACME CA? Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2Introduïu el nom de domini room.domini.cat:
Please enter the domain name(s) you would like on your certificate (comma and/or space separated) (Enter 'c' to cancel): room.your_instance.tldIntroduïu el directori on el servidor web PeerTube serveix les sol·licituds de «Let’s Encrypt», /var/www/certbot:
Input the webroot for <room.your_instance.tld>: (Enter 'c' to cancel): /var/www/certbotHauríeu d’obtenir un resultat semblant al següent:
Successfully received certificate. Certificate is saved at: /etc/letsencrypt/live/room.your_instance.tld/fullchain.pem Key is saved at: /etc/letsencrypt/live/room.your_instance.tld/privkey.pemExecuteu l’ordre següent dins del contenidor de certbot per donar accés de lectura als nous certificats i claus privades al grup peertube. Nota: Aquesta ordre també farà que els fitxers siguin llegibles per al grup amb ID 999 al sistema amfitrió. Comproveu els grups del vostre sistema per avaluar el risc abans d’executar aquesta ordre.
chown -R root:999 /etc/letsencrypt/live; \\ chmod 750 /etc/letsencrypt/live; \\ chown -R root:999 /etc/letsencrypt/archive; \\ chmod 750 /etc/letsencrypt/archive; \\ find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} \\;Sortiu del contenidor de certbot:
exitEditeu el vostre fitxer docker-compose.yml, canviant la línia entrypoint sota el servei certbot a la següent. És el mateix que l’anterior, però s’ha d’executar automàticament després de cada renovació del certificat.
entrypoint: /bin/sh -c "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot; chown -R root:999 /etc/letsencrypt/live; chmod 750 /etc/letsencrypt/live; chown -R root:999 /etc/letsencrypt/archive; chmod 750 /etc/letsencrypt/archive; find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} +; sleep 12h & wait $\${!}; done;"Continuant editant docker-compose.yml, afegiu el volum certbot al contenidor peertube. Hauria de ser així:
volumes: - ./docker-volume/certbot/conf:/etc/letsencryptReinicieu els vostres serveis:
docker-compose down; docker-comopse up -dA la configuració de Livechat dins l’administració de PeerTube establiu el directori de certificats de la següent manera:
/etc/letsencrypt/liveDeseu la configuració del connector i comproveu que Prosody pugui veure els certificats:
docker-compose exec -u peertube \\ peertube \\ /data/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun \\ prosodyctl \\ --config /data/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ check certsResolució de problemes Si això no funciona, podeu utilitzar les eines de diagnòstic (un botó es troba a la part superior de la pàgina de configuració del connector) i, en particular, mireu què diu la secció «Comprovació de Prosody».`,description:"Permetre la connexió mitjançant clients XMPP",tags:[],title:"Clients XMPP",uri:"/peertube-plugin-livechat/ca/documentation/admin/advanced/xmpp_clients/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació",content:` AjustamentsConfiguració del connector Livechat de PeerTube
Autenticació externaConfiguració del connector de Peertube Livechat - Autenticació externa
mod_firewall ProsodyRegles avançades del tallafoc per al servidor Prosody
Ús avançatAlgunes funcions avançades
Clients XMPPPermetre la connexió mitjançant clients XMPP
Utilitzar MatterbridgeEmprar Matterbridge per fer de passarel·la amb altres xats`,description:"Administració del connector de PeerTube Livechat",tags:[],title:"Documentació d'administració",uri:"/peertube-plugin-livechat/ca/documentation/admin/index.html"},{breadcrumb:"Livechat de PeerTube > Contribuir",content:"No cal que codifiqueu per començar a contribuir a aquest connector! També són valuoses altres formes de contribució, com ara: podeu provar el connector i informar de qualsevol error que trobeu, compartir els vostres comentaris, proposar funcions que us interessen, informar dels vostres comentaris sobre la interfície, el disseny, etc.",description:"Doneu la vostra opinió",tags:[],title:"Doneu la vostra opinió",uri:"/peertube-plugin-livechat/ca/contributing/feedback/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'administració",content:` Info Aquesta funció arriba amb la versió del complement Livechat 11.0.0. Podeu habilitar mod_firewall al vostre servidor de Prosody.
Això permetrà a l’administració de PeerTube definir regles avançades del tallafoc.
Warning Aquestes regles es podrien utilitzar per executar codi arbitrari al servidor. Si sou un proveïdor d’allotjament i no voleu permetre que els administradors de PeerTube escriguin aquestes regles, podeu desactivar l’edició en línia creant un fitxer disable_mod_firewall_editing al directori de connectors (plugins/data/peertube-plugin-livechat/disable_mod_firewall_editing). Això és deshabilitar, ja que els administradors de PeerTube ja poden executar codi arbitrari només instal·lant qualsevol connector. Encara podeu utilitzar mod_firewall editant fitxers directament al servidor.
Editar les regles Primer, heu d’habilitar la funció a Configuració del connector.
Just a sota de la configuració trobareu el botó «Configura mod_firewall». Aquest botó obrirà una pàgina de configuració.
Aquí podeu afegir diversos fitxers de configuració.
Podeu activar/desactivar cada fitxer.
Els fitxers es carreguen per ordre alfabètic. Podeu utilitzar prefixos numèrics per configurar fàcilment l’ordre.
Info També podeu editar aquestes regles del tallafoc directament al servidor, al directori plugins/data/peertube-plugin-livechat/prosody/mod_firewall_config/. Els noms dels fitxers només han de contenir caràcters alfanumèrics, guions baixos i guions. L’extensió ha de ser .pfw, o .pfw.disabled si voleu desactivar un fitxer. Assegureu-vos que el compte del sistema peertube tingui accés d’escriptura a aquests fitxers, en cas contrari, la interfície d’edició web fallarà. Un cop hàgiu editat aquests fitxers, heu de tornar a carregar Prosody. Això es pot fer desant la configuració del connector, desant la configuració del mod_firewall a la interfície web o reiniciant Peertube.
Quan deseu la configuració, el servidor la tornarà a carregar automàticament i les vostres regles s’aplicaran immediatament. Podeu comprovar que no hi hagi cap error d’anàlisi al registre d’errors de Prosody. Per fer-ho, podeu llegir el fitxer plugins/data/peertube-plugin-livechat/prosody/prosody.err o utilitzar l’eina de diagnòstic que mostra els últims errors de Prosody.
Exemples No dubteu a compartir les vostres normes. Per fer-ho, podeu, per exemple, editar aquesta pàgina.`,description:"Regles avançades del tallafoc per al servidor Prosody",tags:[],title:"mod_firewall Prosody",uri:"/peertube-plugin-livechat/ca/documentation/admin/mod_firewall/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers > Bot de xat",content:`Podeu configurar uns quants temporitzadors que enviaran missatges a intervals regulars. Aquests missatges seran enviats pel bot cada X minuts. Per exemple, podeu fer que el bot enviï informació de patrocini cada 5 minuts.
Tip Si no hi ha ningú a la sala el bot no enviarà cap missatge.
Temporitzador Podeu configurar uns quants temporitzadors que enviaran missatges a intervals regulars. Aquests missatges seran enviats pel bot cada X minuts. Per exemple, podeu fer que el bot enviï informació de patrocini cada 5 minuts.
Un missatge per línia. Si hi ha diversos missatges, el bot en triarà un de manera aleatòria cada X minuts.
Enviar cada X minuts El bot enviarà el missatge cada X minuts`,description:"El bot pot enviar alguns missatges periòdicament.",tags:[],title:"Temporitzadors",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/bot/quotes/index.html"},{breadcrumb:"Livechat de PeerTube > Contribuir",content:`Anuncieu sempre les funcions en què voleu treballar creant un tiquet o comentant-ne un d’existent, abans de començar a treballar-hi, i anunciar clarament a la comunitat que esteu començant a treballar-hi. Això és per evitar que diverses persones treballin en el mateix i entrin en conflicte.
Les «Pull Request» s’han de fer a la branca main.
Note Fins al març de 2023, s’havia de contribuir a la branca develop. Aquest procediment ja està obsolet.
Requisits previs per compilar aquest connector És molt recomanable estar familiaritzat/da amb els conceptes següents:
Git NodeJS NPM Typescript Per construir el connector cal que tingueu instal·lats els paquets següents:
git npm (>=8.x) nodejs (>=14.x) build-essential coreutils wget reuse Tingueu en compte que aquest connector necessita una AppImage del servidor XMPP Prosody. Aquesta AppImage la proporciona el projecte Prosody AppImage. L’script build-prosody.sh baixa els binaris connectats a aquest repositori remot i verifica que les sumes de verificació sha256 siguin correctes.
Desenvolupar Cloneu el repositori, construïu el connector i creeu la vostra branca de funcionalitat:
# Clonar el repositori. No oblideu el --recursive, per clonar els submòduls. git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git --recursive cd peertube-plugin-livechat # Instal·lar les dependències NPM i compilar el connector per primera vegada: npm install # Compilar el connector després d'una modificació: npm run build # Si teniu una bifurcació del repositori, afegiu-la de manera remota (exemple): git remote add me git@github.com:EL_MEU_COMPTE_GITHUB/peertube-plugin-livechat.git # Creeu una sucursal local per als vostres desenvolupaments i col·loqueu-vos-hi (exemple): git checkout meu_desenvolupament # Nota: si hi ha associat un tiquet, utilitzeu el nom fix_1234 (on 1234 és el número de tiquet) # Per proposar les vostres modificacions envieu la vostra branca al vostre repositori (exemple): git push --set-upstream me meu_desenvolupament # A continuació, aneu al vostre repositori github amb el vostre navegador web per proposar la «Pull Request» (vegeu les instruccions addicionals a continuació)Quan estigueu preparat/da per mostrar el vostre codi i demanar comentaris, envieu una «Pull Request» esborrany. Quan estigueu preparat/da per a una revisió del codi abans de la fusió, envieu una «Pull Request». En tots els casos, enllaceu la vostra PR amb el tiquet en qüestió mitjançant la sintaxi de GitHub: «fixes #issue_NombreTiquet».
El codi del «front-end» es troba a la carpeta client. El codi del «back-end» a server. Hi ha codi compartit entre els dos a shared.
Per a instruccions genèriques sobre el desenvolupament de connectors (construcció, instal·lació, etc.), consulteu la documentació de Peertube.
Podeu construir el connector amb informació de depuració addicional mitjançant:
NODE_ENV=dev npm run buildAquest connector compleix amb l’estàndard REUSE: utilitza capçaleres SPDX per identificar la informació de llicència del seu codi font. Més informació al lloc web REUSE. Podeu utilitzar l’eina de línia d’ordres reuse per ajudar-vos a actualitzar les capçaleres. L’ordre npm run lint utilitzarà l’ordre reuse per comprovar el compliment. No oblideu afegir la vostra informació de copyright a les capçaleres SPDX quan canvieu el codi.
ESBuild vs Typescript Aquest connector utilitza ESBuild per compilar el codi del «front-end», com el connector oficial peertube-plugin-quickstart. ESBuild pot gestionar Typescript, però no verifica els tipus (vegeu documentació d’ESBuild). És per això que primer compilem Typescript amb l’opció -noEmit, només per comprovar els tipus (check:client:ts al fitxer package.json). Aleshores, si tot està bé, iniciem ESBuild per generar el javascript compilat.
Mode de depuració Hi ha un mode de depuració per al connector, que escurçarà el temps necessari per a determinades accions. Per exemple, rotarà els registres cada dos minuts, en lloc de cada dia. Això facilita la prova de determinades accions, per a les quals normalment hauríeu d’esperar hores o dies.
Per activar aquest mode només cal que creeu un fitxer /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/debug_mode (adaptant /var/www/peertube/storage/ a la vostra instal·lació si escau) .
La mera existència d’aquest fitxer és suficient per activar el mode de depuració. Per assegurar-vos que es té en compte, podeu reiniciar la vostra instància de Peertube.
Aquest fitxer també pot contenir JSON que pot activar altres opcions més avançades. Per obtenir-ne una llista, podeu consultar el codi a server/lib/debug.ts. Reinicieu Peertube després de cada modificació del seu contingut.
Warning No activeu mai aquest mode en un servidor de producció, ni tan sols en un servidor públic. Això podria suposar problemes de seguretat.
Reiniciar Prosody Per reiniciar Prosody quan el mode de depuració estigui activat, podeu cridar l’API http://la_vostra_instancia.cat/plugins/livechat/router/api/restart_prosody. Aquesta crida no necessita autenticació. Es pot fer des d’una línia d’ordres, per exemple amb curl http://la_vostra_instancia.cat/plugins/livechat/router/api/restart_prosody.
Depurador de Prosody És possible connectar l’AppImage Prosody a un depurador remot mitjançant MobDebug.
Per fer-ho, col·loqueu MobDebug en una carpeta accessible per l’usuari peertube. A continuació afegiu això al fitxer debug_mode del connector:
{ "debug_prosody": { "debugger_path": "/el_cami_a_mobdebug/src", "host": "localhost", "port": "8172" } }host i port són opcionals. debugger_path ha d’apuntar a la carpeta on es troba el fitxer .lua de MobDebug.
Reiniciar Peertube.
Inicieu el vostre servidor de depuració.
Perquè Prosody es connecti al depurador, crideu a l’API http://la_vostra_instancia.cat/plugins/livechat/router/api/restart_prosody?debugger=true. Aquesta crida no necessita autenticació. Es pot fer des d’una línia d’ordres, per exemple amb curl http://la_vostra_instancia.cat/plugins/livechat/router/api/restart_prosody?debugger=true. Fins i tot podeu configurar el vostre servidor de depuració per executar aquesta ordre automàticament.
Aleshores Prosody es reiniciarà, connectant-se al depurador.
Entorn de desenvolupament ràpid mitjançant Docker Hi ha un tutorial, en francès, disponible al [fòrum Peertube](https://framacolibri.org/t/tutoriel-creer-un-environnement-de-developpement-de-plugin-peertube-rapidement-en-utilisant-docker-et-qui -allows-to-test-the-federation/17631) que explica com configurar ràpidament un entorn de desenvolupament amb Docker.
S’ha creat un repositori basat en aquest tutorial: pt-plugin-dev.
Nota: per algun motiu desconegut Prosody no pot resoldre les adreces DNS dels contenidors quan s’utilitza la biblioteca lua-unbound. Per evitar-ho hi ha una «nyapa»: només cal que creeu un fitxer /data/plugins/data/peertube-plugin-livechat/no_lua_unbound als vostres volums docker i reinicieu-los.
Reconstruir i instal·lar el connector ràpidament Quan feu canvis no cal que reconstruïu tot el projecte i torneu a instal·lar el connector al vostre entorn de desenvolupament; podeu crear només la part modificada (per exemple, si només heu modificat els fitxers del client: npm run build:client). Trobareu la llista dels scripts de compilació disponibles al fitxer package.json.
Quan el connector ja està instal·lat a la vostra instància de desenvolupament i si no heu modificat cap dependència, podeu instal·lar ràpidament el vostre treball seguint els passos següents:
reconstruir les parts necessàries del connector (client, estils, …), sobreescriure el contingut de data/plugins/node_modules/peertube-plugin-livechat/dist/ de la vostra instància de desenvolupament amb el contingut de la carpeta dist del connector, canviar recursivament el propietari dels fitxers plugins/node_modules/peertube-plugin-livechat/dist/ al vostre usuari peertube, reiniciar la vostra instància. Proves de rendiment El repositori livechat-perf-test conté algunes eines per realitzar proves de rendiment. Es poden utilitzar per avaluar millores del codi font o trobar colls d’ampolla.`,description:"Desenvolupar",tags:[],title:"Desenvolupar",uri:"/peertube-plugin-livechat/ca/contributing/develop/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari",content:`OBS és un popular programari d’emissió en directe de codi obert i gratuït amb capacitats avançades. En aquesta pàgina trobareu alguns consells per gestionar els vostres xats en directe amb OBS.
Superposició OBS Podeu incloure fàcilment el xat al vostre flux de vídeo.
Podeu utilitzar la funció «Comparteix l’enllaç de la sala de xat» per generar un URL al vostre xat. El botó hauria d’estar a prop del xat si sou el propietari del vídeo (tret que els administradors del vostre servidor l’hagin desactivat).
Marqueu la casella de selecció «Només lectura» a la finestra modal.
A continuació, utilitzeu aquest enllaç com a «font del navegador web» a OBS.
Podeu utilitzar l’opció «Fons transparent (per a la integració en directes, amb OBS per exemple)» per obtenir un fons transparent a OBS. Si voleu personalitzar la transparència del fons, podeu afegir aquest CSS a la configuració de font del navegador a OBS:
:root { --livechat-transparent: rgba(255 255 255 / 90%) !important; } Al fragment CSS anterior, per descomptat, podeu canviar el color o la transparència, adaptant els valors del color.
Nota: podeu personalitzar els colors. Encara no està documentat, però podeu provar això: a la finestra modal, marqueu «utilitza els colors del tema actuals» i, a continuació, intenteu canviar manualment els valors de color a l’URL. Heu d’utilitzar valors de color CSS vàlids i han d’estar codificats correctament a l’URL.
Acoblament d’OBS Info Aquesta funció arriba amb la versió del complement Livechat 10.1.0. Warning Aquesta funció la pot desactivar l’administració de la instància.
Podeu utilitzar els «acoblaments de navegador personalitzats» d’OBS per integrar el xat al vostre OBS durant l’emissió en directe. El connector de Livechat ofereix la possibilitat de crear una fitxa a llarg termini que us pugui identificar automàticament per unir-vos al xat, de manera que no cal que introduïu la vostra contrasenya a OBS.
Per fer-ho només cal que utilitzeu la funció «Comparteix l’enllaç de la sala de xat» i obriu la pestanya «Bastidor». Des d’aquí podeu crear una fitxa nova amb el botó «+».
A continuació copieu l’URL i utilitzeu el menú «Acoblament / Acoblaments de navegador personalitzats» del vostre OBS per afegir un acoblament amb aquest URL.
![Captura de pantalla del diàleg OBS Acoblaments de navegador personalitzats, amb un nou acoblament anomenat «El meu xat».](/peertube-plugin-live chat/images/obs dock dialog.png?classes=shadow,border height=200px “OBS - Diàleg d’acoblaments”)
Un cop fet això tindreu un nou acoblament connectat al xat amb el vostre compte.
Tip Les fitxes són vàlides per unir-se a qualsevol sala de xat. No cal que genereu fitxes independents per a cadascuna de les vostres sales. També podeu personalitzar l’àlies que s’utilitzarà canviant el paràmetre n a l’URL.
No compartiu aquests enllaços amb ningú, ja que els permetrien iniciar sessió en el vostre nom.
Si una fitxa està compromesa o ja no és necessària, podeu revocar-la.
Info Aquestes fitxes es poden utilitzar per a altres finalitats, com ara connectar-se al vostre compte amb bots o clients XMPP. Aquesta funció encara no està documentada i no se suporta oficialment. Per tant, s’ha d’utilitzar amb precaució.
Barrejar diversos xats a la vostra emissió en directe Podeu utilitzar l’extensió del navegador social_stream per barrejar diverses fonts de xat (Peertube, Twitch, Youtube, Facebook, etc.) i incloure el seu contingut a la vostra emissió en directe. La compatibilitat amb aquest connector s’ha afegit en les darreres versions.`,description:"Documentació per publicar contingut de xat mitjançant OBS.",tags:[],title:"OBS",uri:"/peertube-plugin-livechat/ca/documentation/user/obs/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers > Bot de xat",content:`Podeu configurar el bot perquè respongui a les ordres. Una ordre és un missatge que comença amb un «!», com ara «!ajut» que cridarà l’ordre «ajut».
Podeu configurar diferents ordres.
Ordre L’ordre, sense el «!» al principi. Per exemple «ajut», «patrocinador»…
Missatge El missatge a enviar.`,description:"El bot pot respondre a diferents ordres.",tags:[],title:"Ordres",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/bot/commands/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'administració",content:` Clients XMPPPermetre la connexió mitjançant clients XMPP
Utilitzar MatterbridgeEmprar Matterbridge per fer de passarel·la amb altres xats`,description:"Algunes funcions avançades",tags:[],title:"Ús avançat",uri:"/peertube-plugin-livechat/ca/documentation/admin/advanced/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Guia d'instal·lació",content:`NOTA IMPORTANT Des de la versió v6.0.0, aquest connector no necessita cap instal·lació de Prosody.
Si utilitzàveu aquest connector abans i heu instal·lat Prosody manualment, podeu desinstal·lar-lo amb seguretat.
Si estàveu utilitzant la imatge de docker especial de Peertube (que incloïa Prosody) podeu canviar a la imatge oficial de Peertube.`,description:"Notes importants per a l'actualització des d'una versió anterior del connector.",tags:[],title:"Actualització des d'una versió anterior a la 6.0.0",uri:"/peertube-plugin-livechat/ca/documentation/installation/upgrade_before_6.0.0/index.html"},{breadcrumb:"Livechat de PeerTube > Contribuir",content:`Informació general Anuncia’t sempre abans de començar a treballar (creant un tiquet o comentant un tiquet existent). Això és per evitar que diverses persones treballin en el mateix i entrin en conflicte.
El treball de documentació ha de fusionar-se a la branca main.
El codi font de la documentació es troba a la carpeta support/documentation/content del repositori.
La documentació es genera mitjançant les eines Hugo, l’heu d’instal·lar a la vostra màquina per poder previsualitzar la documentació.
La versió mínima requerida d’Hugo és la 0.121.0. Hem provat amb la versió 0.132.2.
El tema utilitzat és hugo-theme-relearn. Es recomana llegir la seva documentació abans de començar.
Quan es publica una versió del connector o quan s’actualitza la documentació, els responsables del connector fusionaran la branca main amb la branca documentation. Això activarà les canonades github i gitlab i n’actualitzarà les versions publicades.
Traduccions L’idioma principal és l’anglès (codi en).
La carpeta support/documentation/content/en només conté fitxers de documentació en anglès.
La documentació es tradueix mitjançant Weblate (vegeu documentació de traducció). Per fer-ho, utilitzem l’eina po4a, com veurem més endavant en aquesta pàgina.
Afegir un nou idioma Al fitxer support/documentation/config.toml, inspira’t en la secció [Languages.fr] per declarar el nou idioma.
Si les traduccions no estan completes, està bé, s’utilitzarà la versió en anglès per a les cadenes que falten.
Previsualitzar Per previsualitzar les vostres modificacions només cal executar:
hugo serve -s support/documentation/ A continuació obriu el vostre navegador a http://localhost:1313/peertube-plugin-livechat/. Aquesta pàgina s’actualitzarà automàticament amb cada modificació.
Actualitzar els fitxers de localització i generar traduccions de la documentació De moment només teniu la versió en anglès. Per actualitzar les cadenes i generar les traduccions, heu d’executar l’script doc-translate.sh.
Per fer-ho, assegureu-vos que teniu instal·lat po4a (versió >= 0.69) al vostre ordinador.
Warning Algunes distribucions de Linux (com ara Debian Bullseye) tenen una versió anterior de po4a. Assegureu-vos d’instal·lar-me una debcompatible. Si utilitzeu Debian Bullseye podeu descarregar el fitxer Bookworm po4a.deb des de https://packages.debian.org, i instal·lar-lo manualment.
Per gestionar les traduccions només cal fer el següent:
npm run doc:translate A continuació podeu previsualitzar el resultat utilitzant hugo serve -s support/documentation/ i utilitzant el selector d’idioma.
Escriure documentació Editeu només fitxers en anglès a support/documentation/content/en.
Aleshores, abans de fer commit, executeu sempre npm run doc:translate, de manera que els canvis en els fitxers en anglès es puguin propagar al fitxer support/documentation/po/livechat.en.pot.
Podeu utilitzar el codi curt livechat_label per utilitzar cadenes de l’aplicació. Vegeu aquí: Traducció de la documentació.
És possible evitar que es tradueixi un fitxer utilitzant livechatnotranslation: true a la secció Yaml Font Matter. Vegeu aquí: Traducció de la documentació.
Si us plau, utilitzeu l’opció livechatnotranslation per a la documentació tècnica. No volem traduir documentació tècnica, per tal d’evitar problemes relacionats amb una traducció deficient.
Per facilitar la feina dels traductors eviteu fer paràgrafs massa llargs.
De moment no és possible utilitzar les taules Markdown: les eines de traducció no saben com gestionar-les.
Warning És possible que hi hagi enllaços a aquesta documentació en altres llocs del web. Intenteu no canviar els URL de les pàgines de documentació. O almenys posar enllaços a les pàgines noves als URL antics.
Quan hi hagi una funció nova disponible, podeu utilitzar livechat_version_notice per mostrar un quadre d’informació amb la versió en què aquesta funció està disponible. Aquest codi pren el número de versió com a paràmetre. Aquí teniu un exemple:
Info Aquesta funció arriba amb la versió del complement Livechat 12.0.0. Què he de fer si no puc utilitzar hugo i/o po4a? Simplement editeu els fitxers de reducció en anglès i en fer «Pull Request» especifiqueu que no podeu compilar les traduccions.
Publicació La publicació de la documentació és automàtica, tan bon punt les modificacions es fusionen a la branca documentació.`,description:"Documentar el connector o traduir la documentació.",tags:[],title:"Documentació",uri:"/peertube-plugin-livechat/ca/contributing/document/index.html"},{breadcrumb:"Livechat de PeerTube > Technical documentation",content:`The livechat plugin stores some data on the server, in the /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/ folder. This page describes these data.
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
emojis/channel/1/definition.json: the JSON file containing the emojis definitions emojis/channel/1/files/42.png: N image files (png, jpg, …), using numbers as filenames. tokens The tokens folder contains long term token to connect to the chat. See the LivechatProsodyAuth class for more information.`,description:"Data files and folders used on the server",tags:[],title:"Plugin storage",uri:"/peertube-plugin-livechat/ca/technical/data/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'administració > Ús avançat",content:`El següent es basa en un tutorial per utilitzar Matterbridge amb el connector: Matterbridge + Peertube
Requisits Connector de PeerTube Livechat versió 3.2.0 o posterior. Matterbridge versió 1.22.4 o posterior. El més fàcil és si la instància PeerTube i Matterbridge s’executen al mateix servidor.
Només connexions internes (versió simple) Haureu d’habilitar Activar les connexions client-servidor a la configuració del connector Livechat.
Això permetrà els clients XMPP locals connectar al servidor XMPP Prosody.
És possible que hàgiu d’afegir alguna línia al vostre /etc/hosts:
127.0.0.1 anon.exemple.cat room.exemple.cat Substituïu exemple.cat pel nom de domini de la vostra instància. A continuació, podeu continuar amb la configuració de Matterbridge següent.
Permetre connexions externes (avançat) De manera predeterminada el servidor XMPP Prosody intern només escolta a l’host local (127.0.0.1).
A les versions de Livechat >= 10.1.0, s’ha afegit una nova crida d’opció «interfícies de client a servidor» per permetre que això es pugui canviar.
Això afegeix una llista d’adreces IP per escoltar separades per comes (s’eliminaran espais).
També podeu utilitzar * per escoltar a totes les interfícies IPv4 i :: per a totes les interfícies IPv6. Això permet l’accés extern a la interfície client-servidor.
A continuació heu d’obrir el port C2S (per defecte 52822, però comproveu la configuració del connector per obtenir el valor actual) al vostre tallafoc perquè sigui accessible des d’Internet. Si no voleu utilitzar connexions C2S per a res que no sigui el vostre servei Matterbridge, hauríeu de restringir l’accés a aquest port a la IP del vostre servidor Matterbridge.
També heu d’afegir registres DNS (A i AAAA) per a «anon.exemple.cat» i «room.exemple.cat» (substituïu «exemple.cat» pel vostre nom de domini actual).
Si utilitzeu un port diferent de 5222 (port estàndard XMPP), també heu de configurar el registre SRV xmpp-client al port correcte.
Configurar Matterbridge A la versió 1.22.4, Matterbridge va afegir suport per a connexions anònimes XMPP, necessàries per connectar-se al servidor Prosody integrat.
Per tant, al fitxer de configuració TOML heu de posar:
[xmpp.elmeupeertube] Anonymous=true Server="anon.exemple.cat:52822" Muc="room.exemple.cat" Nick="Matterbridge" RemoteNickFormat="[{PROTOCOL}] <{NICK}> " NoTLS=true Substituïu exemple.cat pel nom de domini de la vostra instància. Substituïu 52822 pel port actual si l’heu canviat. elmeupeertube es pot substituir per un altre nom. L’ús de peertube com a àlies (Nick) proporcionarà la icona PeerTube per als missatges superposats, que també es pot fer canviant la configuració de la superposició. El paràmetre NoTLS=true us permet connectar-vos a un servidor amb certificats autofirmats. Ara podeu afegir aquest compte a passarel·les i que faci de pont entre canals de xat.
Info Aquesta documentació utilitza un compte anònim per connectar la passarel·la al xat. Però des de la versió 10.1.0 del Livechat, hi ha una nova manera de generar una fitxa d’autenticació a llarg termini, que us permet iniciar sessió amb el vostre compte. S’utilitza per a OBS docks. L’ús d’aquesta funció per a altres finalitats no està documentat i encara no s’admet oficialment. Si el voleu utilitzar de totes maneres, podeu sol·licitar una fitxa cridant a /plugins/livechat/router/api/auth/tokens. Per obtenir les capçaleres necessàries i el cos de la sol·licitud, només cal que mireu què passa quan genereu una nova fitxa per a OBS docks.`,description:"Emprar Matterbridge per fer de passarel·la amb altres xats",tags:[],title:"Utilitzar Matterbridge",uri:"/peertube-plugin-livechat/ca/documentation/admin/advanced/matterbridge/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari",content:`Aquest mòdul de xat es basa en el protocol XMPP, també conegut com Jabber. Per tant, és possible connectar-se als xats mitjançant programari client XMPP. Això pot ser útil, per exemple, per facilitar les operacions de moderació.
Info Les funcions descrites en aquesta pàgina han de ser habilitades i configurades per l’administració de la vostra instància de PeerTube. Per tant, és possible que no hi tingueu accés.
Iniciar sessió amb el vostre compte de PeerTube Warning Aquesta funcionalitat encara no està disponible i arribarà en una versió futura del connector.
Iniciar sessió amb un compte XMPP extern Si aquesta funció està activada a la vostra instància podeu connectar-vos als xats de PeerTube mitjançant qualsevol compte XMPP.
Per obtenir l’adreça de la sala per unir-vos podeu utilitzar el botó «compartir» que es troba a sobre del xat:
Info De manera predeterminada el botó de compartir només és visible per a la propietat del vídeo i l’administració/moderació de la instància. Tanmateix, l’administració pot decidir mostrar aquest botó a tothom.
A continuació trieu «Connectar fent servir XMPP»:
![Captura de pantalla del diàleg «Comparteix l’enllaç de la sala de xat», a la pestanya «Connectar fent servir XMPP».](/peertube-plugin-livechat/images/share_xmpp_dialog.png?classes=shadow, border&height=200px “Connectar fent servir XMPP”)
Aleshores només cal que feu clic a «obrir» o bé copiar/enganxar l’adreça de la sala al vostre client XMPP (emprant la funcionalitat «unir-vos a una sala»).`,description:"Connectar al xat amb un client XMPP",tags:[],title:"Clients XMPP",uri:"/peertube-plugin-livechat/ca/documentation/user/xmpp_clients/index.html"},{breadcrumb:"Livechat de PeerTube",content:`Us interessa contribuir? Genial!
Codi de conductaConvenció de codi de conducta per col·laboradors/es
TraduirTraduir el plugin
Doneu la vostra opinióDoneu la vostra opinió
DesenvoluparDesenvolupar
DocumentacióDocumentar el connector o traduir la documentació.`,description:"Contribuir",tags:[],title:"Contribuir",uri:"/peertube-plugin-livechat/ca/contributing/index.html"},{breadcrumb:"Livechat de PeerTube > Technical documentation",content:`The livechat plugin includes a “slow mode” feature, to rate limit the number of messages that a user can send to a given MUC room. At time of writing, there were no XEP to describe such feature. Please find below a XEP draft, that will be submitted for review.
Warning Work In Progress, this page is not done yet. For an updated version of this document, you can check the draft XEP XMP file.
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
Appendix F: Requirements Conformance The following requirements keywords as used in this document are to be interpreted as described in RFC 2119: “MUST”, “SHALL”, “REQUIRED”; “MUST NOT”, “SHALL NOT”; “SHOULD”, “RECOMMENDED”; “SHOULD NOT”, “NOT RECOMMENDED”; “MAY”, “OPTIONAL”.`,description:"MUC Slow mode XEP",tags:[],title:"MUC Slow mode",uri:"/peertube-plugin-livechat/ca/technical/slow_mode/index.html"},{breadcrumb:"Livechat de PeerTube > Technical documentation",content:`The poll system relies on two thinks:
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
As the backend does no localization, it also translate on the fly the english sentences coming from the backend (in the form definition, in poll start/end message, and in bounce/error messages).`,description:"Polls technical documentation",tags:[],title:"Enquestes",uri:"/peertube-plugin-livechat/ca/technical/polls/index.html"},{breadcrumb:"Livechat de PeerTube > Technical documentation",content:`You can set terms & conditions on the instance level (called “global terms”), or at the streamers’ channels level (called “muc terms”, as it is related to muc rooms).
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
if terms are modified if the user switch to another channel if the user switch to a video from a different peertube instance `,description:"Terms&Conditions implementation",tags:[],title:"Terms&Conditions",uri:"/peertube-plugin-livechat/ca/technical/terms/index.html"},{breadcrumb:"Livechat de PeerTube",content:`Si teniu sol·licituds de funcions, errors o dificultats per instal·lar i utilitzar el connector, podeu utilitzar el Seguidor de problemes de Github. Si és possible escriviu en anglès; però també s’acceptarà el francès.
Per obtenir una visió general del full de ruta per a les properes funcions, podeu consultar:
aquest projecte a github. fites a github. Si us dediqueu al disseny web o teniu experiència en ConverseJS/Prosody/XMPP i voleu participar en l’evolució d’aquest connector, us animem a fer-ho.`,description:"Seguiment d'errors / sol·licituds de noves funcions",tags:[],title:"Seguiment d'errors / Noves funcions",uri:"/peertube-plugin-livechat/ca/issues/index.html"},{breadcrumb:"Livechat de PeerTube > Technical documentation",content:`The livechat plugin includes a Task Application. The present document describes how this is implemented.
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
Llistes de tasques Item tag: tasklist XML Namespace: urn:peertube-plugin-livechat:tasklist item childs: name: the text content is the task list name Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="45cf7543-67bf-4d03-bb5d-a55038a0512a:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <tasklist xmlns="urn:peertube-plugin-livechat:tasklist"> <name>Task List Name</name> </tasklist> </item> </publish> </pubsub> </iq>Tasques Item tag: task XML Namespace: urn:peertube-plugin-livechat:task item attributes: done: if present and equal to “true”, means that the task is done list: the list id order: the order of the task in the task list item childs: name: the text content is the task name description: the text content is the task description Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="9fd9a162-1b6c-4b38-a2a1-2485b34f0d8d:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <task list="8302c024-c16e-4fbd-aca7-c94cdb2025de" order="0" done="true" xmlns="urn:peertube-plugin-livechat:task" > <name>The task name</name> <description>here is the description</description> </task> </item> </publish> </pubsub> </iq>Note: in the above example, we added done="true" just for the example. Don’t add the attribute if you want not the task to be marked as done (or if you want to undone the task).`,description:"Task Application technical overview",tags:[],title:"Tasks overview",uri:"/peertube-plugin-livechat/ca/technical/tasks/index.html"},{breadcrumb:"Livechat de PeerTube > Technical documentation",content:`The livechat plugin includes a Moderation Notes Application. The present document describes how this is implemented.
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
<iq from="user@example.com" id="64da7e38-4dd5-4f55-b46f-297232232971:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client"> <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-notes"> <item id="8ab78df9-a7b9-4315-943d-c340935482af"> <note order="11" xmlns="urn:peertube-plugin-livechat:note" > <description>Some text.</description> <note-about jid="khkecy3nkddwxdllgzdub-dv@anon.p1.localhost" nick="Mickey" > <occupant-id id="ga4mR2IKEvRKuzN1gJYVafCTbY1gNvgNvNReqdVKexI=" xmlns="urn:xmpp:occupant-id:0" /> </note-about> </note> </item> </publish> </pubsub> </iq>`,description:"Moderator Notes Application technical overview",tags:[],title:"Moderator notes overview",uri:"/peertube-plugin-livechat/ca/technical/moderation_notes/index.html"},{breadcrumb:"Livechat de PeerTube",content:` Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
EnquestesPolls technical documentation
Terms&ConditionsTerms&Conditions implementation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview`,description:"Technical documentation",tags:[],title:"Technical documentation",uri:"/peertube-plugin-livechat/ca/technical/index.html"},{breadcrumb:"Livechat de PeerTube",content:`Si teniu cap pregunta o voleu parlar sobre aquest connector, podeu unir-vos a aquesta sala XMPP amb qualsevol client de Jabber: plugin-livechat-support@room.im.yiny.org.
Si voleu donar suport econòmic al projecte, podeu contactar amb mi per correu electrònic a git.[at].john-livingston.fr, o consultar el meu perfil de Liberapay.`,description:"Contactar amb l'autor",tags:[],title:"Contacteu amb mi",uri:"/peertube-plugin-livechat/ca/contact/index.html"},{breadcrumb:"Livechat de PeerTube",content:`Els fitxers package.json, [COPYRIGHT](https://github.com/JohnXLivingston/peertube-plugin -livechat/blob/main/COPYRIGHT.md) i LICENSE contenen la informació de la llicència d’aquest programari i les seves dependències (en anglès).
El connector el manté John Livingston.
Gràcies a David Revoy pel seu treball a la mascota de Peertube, Sepia. El disseny del personatge està sota llicència CC-By i els fitxers SVG utilitzats per crear alguns logotips i avatars en aquest connector són GPLv3.0. Els fitxers PNG estan sota llicències CC-By i provenen del generador d’avatars Sepia en línia.
Gràcies a Framasoft per fer possible Peertube, pel suport financer i per allotjar les traduccions del projecte a [la seva instància Weblate] (https: //weblate.framasoft.org).
Gràcies a ritimo pel suport financer.
Gràcies a Code Lutin i Rétribution Copie Publique pel suport financer.
Gràcies a NlNet i NGI0 Entrust fund pel suport financer.
Gràcies a Octopuce pel suport financer.
I gràcies per totes les col·laboracions individuals fetes a través de la meva [pàgina de liberapay] (https://liberapay.com/JohnLivingston/).`,description:"Crèdits del connector",tags:[],title:"Crèdits",uri:"/peertube-plugin-livechat/ca/credits/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:`Activar el xat per a les vostres emissions en directe Warning L’administració de la instància pot optar per desactivar o activar el xat en determinats casos específics. La informació d’aquesta secció només és aplicable en el cas predeterminat.
Quan creeu o modifiqueu un Peertube en directe hi ha una pestanya «Configuració del connector»:
A la pestanya «Configuració del connector» hi ha una casella de selecció «Habilitar el xat». Simplement marqueu-lo o desmarqueu-lo per activar o desactivar el xat associat al vostre vídeo.
Tip Pot haver-hi altres paràmetres en aquesta pestanya, depenent dels connectors instal·lats a la vostra instància de Peertube.
Xat per canal A nivell d’instància l’administració pot triar si les sales de xat són úniques per vídeo o si seran úniques per canal. Poseu-vos en contacte amb l’administració de la vostra instància per obtenir més informació sobre com es configura el connector Livechat.
Compartir el xat A sobre del xat hi ha un botó «Comparteix l’enllaç de la sala de xat».
Aquest botó obre una finestra emergent, on trobareu un URL per unir-vos al xat. Aquest URL es pot compartir.
La pestanya «Encastar» ofereix enllaços per incrustar el xat als llocs web o al vostre flux de vídeo en directe.
Podeu personalitzar algunes opcions:
Només lectura: només podreu llegir el xat, no escriure-hi. Això és útil per incloure contingut de xat a les vostres emissions en directe (vegeu documentació OBS). Utilitzeu els colors del tema actual : si està marcat, els colors del tema actual s’afegiran a l’URL, de manera que les persones que obrin aquest enllaç tindran la mateixa combinació de colors. Generar un iframe per integrar el xat en un lloc web : en comptes d’un URL tindreu un fragment HTML que podeu afegir al vostre lloc web per incloure el xat. Per obtenir més informació sobre la pestanya «Bastidor», consulteu la documentació OBS.
A la pestanya «Web», l’URL proporcionat obre el xat a la interfície de PeerTube. Pots compartir aquest enllaç amb altres persones per convidar-les a unir-se al xat.
![Captura de pantalla del diàleg «Comparteix l’enllaç de la sala de xat», a la pestanya «Web». Hi ha un URL que podeu copiar.](/peertube-plugin-livechat/images/share_web .png?classes=shadow,border&height=200px “Emergent de compartir l’enllaç - pestanya web”)
La finestra emergent «{% livechat_label share_chat_link %}}» també pot contenir una pestanya «Connectar fent servir XMPP». Aquesta pestanya només està disponible si els administradors de la vostra instància han activat i configurat correctament aquesta opció. Amb aquesta opció podeu proporcionar un enllaç per unir-vos al canal mitjançant qualsevol client XMPP. Amb l’ús d’aquest programari, serà més fàcil gestionar les accions de moderació, per exemple.
![Captura de pantalla del diàleg «Comparteix l’enllaç de la sala de xat», a la pestanya «Connectar fent servir XMPP».](/peertube-plugin-livechat/images/share_xmpp_dialog.png?classes=shadow, border&height=200px “Connectar fent servir XMPP”)
Moderació Consulteu la documentació de moderació.
Incloeu diversos xats a la vostra emissió en directe Consulteu la documentació OBS.
Persistència del xat Per defecte el xat és persistent. Això vol dir que el contingut de les sales es conservarà durant un temps. Les persones que s’hi uneixin podran veure els missatges enviats abans que arribessin.
Podeu canviar el comportament de persistència. Obriu el menú desplegable i feu clic a «Configurar».
Hi ha diverses opcions que es poden canviar.
Per exemple, podeu establir el valor predeterminat i el valor màxim del nombre de missatges per tornar a 0. D’aquesta manera les persones que s’incorporin a la sala no podran veure els missatges enviats anteriorment.
També podeu desmarcar «habilitar l’arxiu»: si no està marcat, els missatges es netejaran si el servidor es reinicia.
Si desactiveu «Persistent» la sala se suprimirà quan no hi hagi més participants.
Destruir el contingut del xat Si voleu destruir el contingut del xat, obriu el menú desplegable i feu clic a «Destruir». S’obrirà una finestra emergent que demana confirmació.
El xat es recrearà automàticament cada vegada que algú intenti unir-s’hi, sempre que el vídeo existeixi i tingui activada la configuració «Habilitar el xat».`,description:"Informació bàsica sobre com configurar i utilitzar el xat per a les vostres emissions en directe",tags:[],title:"Alguns conceptes bàsics",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/basics/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció s’inclou a la versió 8.0.0 del connector Livechat i l’administració de la instància la pot desactivar.
Al menú esquerre de PeerTube hi ha una entrada «Sales de xat»:
Aquest enllaç «Sales de xat» us porta a una llista dels vostres canals. Si feu clic a un canal podreu fer-li algunes configuracions:
Aquí podeu configurar:
Condicions d’ús del xat del canal Valor predeterminat per a Silenciar persones anònimes Mode lent El bot de xat Emojis personalitzats Noves funcions properament… `,description:"Configuració de sales de xat del canal PeerTube",tags:[],title:"Configuració del canal",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/channel/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari",content:` Alguns conceptes bàsicsInformació bàsica sobre com configurar i utilitzar el xat per a les vostres emissions en directe
Configuració del canalConfiguració de sales de xat del canal PeerTube
AnuncisAdministradors/es i propietaris/es de les sales poden enviar anuncis especials al xat.
ModeracióFuncions de moderació avançades del connector Livechat
Condicions d'úsConfigurar les condicions d'ús dels xats del canal
Mode lentMode lent del connector Livechat
Retard de moderacióRetard de moderació del connector Livechat
Emojis personalitzatsEmojis personalitzats del connector Livechat
Mode només emojisConnector Livechat en mode només emojis
EnquestesPodeu crear enquestes per demanar als/les espectadors/es la seva opinió
Tasques / llistes de coses a ferPodeu gestionar tasques i llistes de tasques pendents amb el vostre equip de moderació.
Notes de moderacióNotes de moderació del connector Livechat
Bot de xatConfiguració del bot de xat
Caràcters especialsEl bot pot moderar automàticament els missatges que contenen massa caràcters especials.
Cap missatge duplicatEl bot pot moderar automàticament els missatges duplicats.
Mots prohibitsEl bot pot moderar automàticament els missatges que contenen mots prohibits.
TemporitzadorsEl bot pot enviar alguns missatges periòdicament.
OrdresEl bot pot respondre a diferents ordres.`,description:"Com configurar el xat per a les vostres emissions en directe",tags:[],title:"Per a streamers",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 12.0.0. Administradors/es i propietaris/es de les sales poden enviar anuncis especials al xat.
Aquests missatges seran més visibles que els missatges estàndard.
Per enviar anuncis, propietaris/es i administradors/es tenen un selector «Tipus de missatge» a la part superior del camp del missatge:
Hi ha diversos tipus de missatges:
Estàndard: per enviar un missatge estàndard. Destacat: aquests missatges simplement es ressaltaran en un quadre blau. Anunci: aquests missatges estaran en un quadre verd i s’afegirà un títol «Anunci» en negreta. Avís: aquests missatges estaran en un quadre de trencament, i s’afegirà un títol «Anunci» en negreta. Info El compte que no sigui propietari/a o administrador/a de la sala de xat no pot enviar aquests missatges.
Warning Nota: Els clients XMPP estàndards mostraran anuncis com a missatges estàndard.`,description:"Administradors/es i propietaris/es de les sales poden enviar anuncis especials al xat.",tags:[],title:"Anuncis",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/announcements/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Warning Aquesta secció encara està incompleta.
Warning Aquesta pàgina descriu el comportament de les versions de Livechat >= 10.0.0. Hi ha hagut alguns canvis en la manera com gestiona els drets d’accés l’administració i la moderació de PeerTube.
El bot de xat Podeu utilitzar un bot de xat, que us ajudarà amb la moderació. Consulteu la documentació del bot de xat per obtenir més informació.
Accedint a les eines de moderació Podeu accedir a la configuració de la sala i a les eines de moderació mitjançant el menú desplegable del xat a la part superior dreta.
Tip L’am@ del vídeo serà l’am@ de la sala de xat. Això vol dir que pot configurar la sala, eliminar-la, promocionar altres comptes a l’administració…
Tip Des de la versió 10.0.0 de Livechat, els/les membres de l’administració i moderació de la instància de PeerTube no tenen drets específics per defecte a les sales. Tanmateix, tenen un botó especial disponible a la part superior del xat: «Esdevenir moderador/a“. En fer clic en aquest botó tindran accés com a propietari/a a la sala.
Podeu utilitzar les ordres de moderació de ConverseJS per moderar la sala. Quan obriu la sala de xat a pantalla completa apareix un menú amb ordres dedicades a la part superior dreta.
Silenciar persones anònimes Info Aquesta funció arriba amb la versió del complement Livechat 10.2.0. Podeu evitar que anònims/es enviïn missatges. En aqueix cas només els comptes registrats podran parlar al xat.
Per activar o desactivar aquesta funció, utilitzeu el menú desplegable de xat i, a continuació, obriu el menú «configurar». Al formulari trobareu una casella de selecció «Silenciar persones anònimes».
Els/les anònims/es no tindran el camp de missatge i veuran el següent missatge: «Només les persones registrades poden enviar missatges.»
Quan aquesta funció està habilitada, els/les anònims/es se’ls assigna la funció de «visitant». Podeu canviar llur rol a «participant» si voleu permetre que alguns d’ells parlin.
Si canvieu la configuració de la sala, els/les anònims/es seran silenciats/des o tornaran a poder parlar.
Podeu triar activar o desactivar aquesta funció per a sales de xat noves a la pàgina de configuració del canal.
Rols i afiliacions Hi ha diferents rols que es poden assignar a les persones a les sales de xat: propietària, moderadora, membre…
Warning Aquesta secció encara està incompleta.
Si necessiteu ajuda podeu promocionar usuaris/es a moderadors/es.
Anonimitzar les accions de moderació Info Aquesta funció arriba amb la versió del complement Livechat 11.0.0. És possible anonimitzar les accions de moderació per tal d’evitar revelar qui està bandejant/expulsant… participants.
Per activar o desactivar aquesta funció, utilitzeu el menú desplegable de xat i, a continuació, obriu el menú «configurar». Al formulari trobareu una casella de selecció «Anonimitzar les accions de moderació».
Podeu triar activar o desactivar aquesta funció per a sales de xat noves a la pàgina de configuració del canal.
Cerca l’historial de missatges de participants Info Aquesta funció arriba amb la versió del complement Livechat 11.0.0. Com a administrador/a o propietari/a de la sala, podeu cercar tots els missatges enviats per un/a participant determinat/da.
Per fer-ho teniu a la vostra disposició diverses possibilitats:
utilitzeu l’acció «Cerca tots els missatges» al menú desplegable al costat dels/les participants a la barra lateral utilitzant l’acció «Cerca tots els missatges» al menú desplegable al costat dels missatges de xat Tip Per tindre més espai i una millor llegibilitat obriu el xat en mode de pàgina completa.
Als resultats de la cerca es mostren diverses informacions a la dreta del sobrenom de la persona participant:
si l’àlies actual és diferent de l’àlies utilitzat quan el/la participant va enviar el missatge, es mostrarà l’àlies original veureu el JID (Jabber ID) de la persona participant també veureu l’ocupant-id de la persona participant El resultat de la cerca també inclourà tots els missatges de participants que tenien el mateix àlies. Podeu diferenciar-los comparant el JID i l’ocupant-id.
Suprimir contingut de les sales Podeu suprimir sales antigues: uneix-vos a la sala i utilitzeu el menú de la part superior per destruir la sala.
Moderació de la instància Com a moderador/a o administrador/a de la instància de PeerTube probablement voldreu comprovar que els/les participants no presenten un comportament problemàtic.
Podeu llistar totes les sales de xat existents: a la pantalla de configuració del connector, hi ha un botó «Llistar sales».
Des d’aquí també podeu promocionar-vos com a moderador/a del canal mitjançant el botó «Esdevenir moderador/a» de la dreta.`,description:"Funcions de moderació avançades del connector Livechat",tags:[],title:"Moderació",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/moderation/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 10.2.0. Configuració Podeu afegir condicions del servei al vostre canal. Aquestes condicions es mostraran a totes les persones que s’uneixin al xat.
Per configurar les condicions d’ús aneu a la pàgina de configuració del canal:
Es podrà fer clic a l’URL de la publicació. També podeu formatar: Estil del missatge.
Espectadors/es Quan algú s’uneixi al xat veurà les condicions:
Info L’administració de la instància de PeerTube també pot establir condicions d’ús. Si ho fa aquestes condicions es mostraran a sobre de les del vostre canal.
Info Les persones anònimes només veuran les condicions d’ús un cop hagin escollit el seu àlies (és a dir, un cop puguin parlar).
Podeu canviar el contingut de les condicions en qualsevol moment, s’actualitzarà a l’instant per a totes les persones.
Es poden ocultar les condicions d’ús. En aquest cas ja no es mostraran, tret que modifiqueu el seu contingut.
Info Si la vostra instància de PeerTube us permet unir-vos al xat amb clients XMPP, les persones que utilitzin aquests clients veuran les condicions com a missatges de xat procedents d’un compte «PeerTube». Quan actualitzeu les condicions, rebran un missatge nou amb el contingut actualitzat de les condicions del servei.`,description:"Configurar les condicions d'ús dels xats del canal",tags:[],title:"Condicions d'ús",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/terms/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 8.3.0. Introducció Com a streamer podeu optar per limitar la freqüència dels missatges d’espectadors/es al xat.
Això pot ser molt útil per a:
evitar inundacions de missatges evitar que el xat es torni il·legible si hi ha molta gent parlant Podeu definir el nombre de segons que les persones esperaran després d’enviar un missatge per a enviar-ne un altre.
Aquesta limitació no s’aplica als/les moderadors/es.
Opció de mode lent A la pàgina de configuració del canal, podeu establir un valor per a l’opció de mode lent:
Aquest valor s’aplicarà com a predeterminat a totes les sales de xat del vostre canal.
El valor 0 desactiva la funció.
Establir el valor a un nombre enter positiu us permet fixar el període (en segons) durant el qual els usuaris no podran enviar missatges addicionals.
Per modificar el valor d’una sala ja existent només cal que obriu el menú de «configurar» de la sala (a la part superior de la finestra de xat) i modifiqueu el valor del mode lent al formulari de configuració.
Per a espectadors/es Si el mode lent està activat s’informarà mitjançant un missatge.
Quan envien un missatge el camp d’entrada es desactiva durant X segons (X és la durada del mode lent).
Aquesta limitació no s’aplica als/les moderadors/es.`,description:"Mode lent del connector Livechat",tags:[],title:"Mode lent",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/slow_mode/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 10.3.0. Introducció Com a streamer podeu optar per aplicar un retard als missatges del xat, per donar temps a la moderació perquè esborri missatges abans que els altres participants els llegeixin.
Quan aquesta funció està activada la moderació veu tots els missatges sense demora. La resta de participants del xat no veuran que els seus propis missatges es retarden.
Tingueu en compte que els missatges enviats per la moderació també es retardaran, per evitar que respongui a missatges que encara no són visibles per als altres participants.
Opció de retard de moderació A la pàgina de configuració del canal, podeu establir un valor per a l’opció «Retard de moderació»:
Aquest valor s’aplicarà com a predeterminat a totes les sales de xat del vostre canal.
El valor 0 desactiva la funció.
Establir aquest valor en un nombre enter positiu us permet definir el retard, en segons, per aplicar als missatges. Eviteu configurar el valor massa alt. Idealment, no hauria de superar uns quants segons (4 ó 5 segons per exemple).
Per modificar el valor d’una sala ja existent, només cal que obriu el menú de «configuració» de la sala (a la part superior de la finestra de xat) i modifiqueu el valor del període de moderació al formulari de configuració.
Warning Actualment aquesta funció té un error conegut: els usuaris que s’uneixin al xat rebran tots els missatges, fins i tot els que encara estiguin pendents per als altres participants. Tanmateix, els missatges enviats després d’haver-se unit al xat es retardaran correctament.
Tip Podeu combinar un retard de moderació breu (1 segon per exemple) amb el bot de moderació per eliminar les publicacions que contenen insults abans que fins i tot un usuari que no sigui moderador les vegi.
Al xat Com a moderador/a, veureu el temps restant (en segons) abans que s’emeti el missatge, just al costat de la marca de temps del missatge.`,description:"Retard de moderació del connector Livechat",tags:[],title:"Retard de moderació",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/moderation_delay/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 10.1.0. Emojis del canal Els/Les streamers poden afegir emojis personalitzats a llurs canals.
A la pàgina de configuració del canal, obriu la pestanya «Emojis del canal»:
Pots configurar emojis personalitzats per al teu canal. Aquests emojis estaran disponibles al selector d’emojis. Les persones usuàries també poden utilitzar-los amb el seu nom curt (per exemple, escrivint «:short_name:»).
Podeu utilitzar emoji al xat amb «:short_name:». El nom curt pot començar i/o acabar amb dos punts (:) i només contenir caràcters alfanumèrics, guions baixos i guions. És molt recomanable iniciar-los amb dos punts, de manera que els usuaris puguin utilitzar l’autocompleció (escrivint «:» i després prement TAB).
Importació / Exportació A la pàgina de configuració del canal hi ha un botó «Importar» i un botó «Exportar». El botó «Exportar» genera un fitxer que podeu importar després a un altre canal.
També podeu generar un fitxer per importar des de qualsevol altra font (per exemple, podeu importar els vostres emojis personalitzats de Twitch). L’arxiu ha de ser un fitxer JSON vàlid, amb el format següent:
[ { "sn": ":short_name:", "url": "https://exemple.cat/image.png" } ] L’atribut sn és el codi del nom curt. L’atribut url pot ser qualsevol URL d’imatge a què pugui accedir el vostre navegador o un URIs de dades, en Espanyol que representa el fitxer voleu importar.`,description:"Emojis personalitzats del connector Livechat",tags:[],title:"Emojis personalitzats",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/emojis/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 12.0.0. Mode «Només emojis» Podeu activar el mode «Només emojis» a les vostres sales de xat. Quan aquest mode està activat, les participants només poden enviar emojis (emojis estàndard o personalitzats des del vostre canal). Les persones moderadores no es veuen afectades per aquesta limitació.
Aquest mode pot ser útil per exemple:
Per evitar correu brossa o missatges ofensius quan no esteu aquí per moderar. Quan hi ha massa participants parlant i no podeu moderar correctament. Per habilitar o deshabilitar aquesta funció, utilitzeu el menú desplegable del xat, obriu el menú «configurar». Al formulari trobareu una casella de selecció «Mode «Només emojis»».
Si voleu activar-lo per a totes les vostres sales de xat alhora, obriu la pàgina de configuració d’emojis del canal i utilitzeu el botó «Activa el mode «Només emojis» a totes les sales de xat del canal».`,description:"Connector Livechat en mode només emojis",tags:[],title:"Mode només emojis",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/emojis_only/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 10.2.0. Crear una enquesta Podeu crear una enquesta nova utilitzant l’acció «Crear una enquesta nova» al menú de xat:
Warning Aquesta funció de votació no s’ha de considerar un sistema de votació fiable. És fàcil fer trampes. No hi ha cap mecanisme per evitar que persones anònimes votin diverses vegades simplement tornant a carregar el xat. Els vots mai són completament anònims, algú amb accés al servidor pot veure qui ha votat per quina opció.
Formulari d’enquesta Omplir els camps del formulari:
«Pregunta»: la pregunta per fer als/les espectadors/es «Durada de l’enquesta (en minuts)“: temps durant el qual es pot votar «Resultats anònims»: si aquesta casella està marcada, els vots no seran visibles públicament al xat «Elecció N»: opcions que es presentaran als/les espectadors/es Com a mínim heu de completar les dues primeres opcions.
Un cop envieu el formulari l’enquesta començarà a l’instant.
Si una enquesta anterior no s’ha acabat, finalitzarà i es mostrarà el seu resultat.
Drets d’accés L’administració de cada sala pot crear una nova enquesta.
Quan promocioneu algú a administrador/a o propietari/a d’una sala, té accés instantani a l’acció «Crear una enquesta nova».
Quan elimineu els drets d’administració o de propietat d’algú, aquesta persona ja no pot crear enquestes noves. Però una possible enquesta existent continuarà fins que acabi.
Totes les persones que no estiguin silenciades poden votar. Això vol dir que podeu evitar que votin anònims/es mitjançant la funció «Silenciar persones anònimes».
Flux de treball de l’enquesta Quan comencen les enquestes s’envia un primer missatge al xat, des del compte que ha creat l’enquesta.
També apareixerà un bàner per anunciar l’enquesta i s’actualitzarà periòdicament amb els vots de cada momen5.
Aleshores les persones poden votar fent clic a la seva elecció o enviant un missatge com «!1» al xat.
El recompte de vots s’actualitzarà regularment al bàner.
Les persones poden canviar el seu vot en qualsevol moment fent una nova elecció. L’opció anterior serà substituïda per la nova.
Tip Les persones anònimes només poden votar un cop hagin triat el seu àlies.
Si està marcat «Resultats anònims» els vots no es mostraran a altres participants. Si aquesta opció no està marcada els vots seran visibles públicament en forma de missatges com «!1» al xat.
Info Per a les persones que utilitzen clients XMPP o versions obsoletes del connector Livechat el bàner no serà visible. Però veuran el missatge al xat i podran votar enviant missatges amb les seves eleccions.
Al final de l’enquesta s’enviarà un nou missatge al xat amb els resultats.
Info L’única manera d’obtenir resultats d’enquestes antigues és cercar el missatge de final de l’enquesta al xat. En aquest moment els resultats de l’enquesta no es guarden per altres mitjans. Així que no us oblideu d’anotar els resultats de l’enquesta si els voleu conservar.`,description:"Podeu crear enquestes per demanar als/les espectadors/es la seva opinió",tags:[],title:"Enquestes",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/polls/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 10.0.0. Introducció El connector Livechat inclou una aplicació de tasques: una mena de «llista de tasques pendents» on podeu crear llistes de tasques pendents i afegir-hi tasques. L’administració de cada sala de xat té accés a aquestes tasques, la qual cosa els permet editar-les de manera col·laborativa.
Per exemple, podeu utilitzar l’aplicació de tasques per:
preparar una llista de temes que voleu tractar durant la l’emissió en directe, per assegurar-vos que no oblideu res ressaltar les preguntes d’espectadors/es, perquè pugueu tornar-hi més tard sense oblidar-vos de respondre-les … Ús de l’aplicació Tasques Obrint l’aplicació de tasques Per obrir l’aplicació Tasques hi ha un botó «Tasques» al menú de xat superior:
En fer clic en aquest botó la pantalla de l’aplicació de tasques canvia:
Tip Per tindre més espai i una millor llegibilitat obriu el xat en mode de pàgina completa.
Drets d’accés L’administració de cada sala de xat té accés a l’aplicació de tasques (lectura i escriptura).
Quan promocioneu algú a administrador/a o propietari/a d’una sala obté accés instantani a l’aplicació Tasques. Quan suprimiu els drets d’administració o de propietat d’algú, perd instantàniament l’accés a l’aplicació.
Llistes de tasques Per defecte hi ha una llista de tasques amb el mateix nom que el vostre directe.
Podeu utilitzar el formulari de la part inferior de la pàgina per crear una nova llista de tasques. També podeu editar les llistes de tasques existents mitjançant el botó «editar» o suprimir qualsevol llista de tasques. En suprimir una llista se suprimeixen totes les seves tasques.
Les llistes de tasques estan ordenades alfabèticament.
Tip Tots els canvis són visibles a l’instant a totes les pestanyes del vostre navegador i per a tota l’administració de la sala.
Tasques Crear tasques Podeu crear una tasca utilitzant el botó a la dreta de les llistes de tasques. Aleshores s’obre un formulari amb dos camps: un nom de tasca obligatori i una descripció opcional.
![Captura de pantalla de l’aplicació de tasques. Sota la primera llista de tasques s’ha creat una tasca nova.](/peertube-plugin-live chat/images/task_app_task_1.png?classes=shadow,border height=200px “Tasca creada”)
Editar les tasques Les tasques es poden modificar amb el botó d’edició de la dreta.
Les tasques es poden marcar com a finalitzades (o no completades) fent clic directament a la casella de selecció de la llista.
Ordenar tasques / canviar la llista de tasques Podeu ordenar les tasques o moure-les d’una llista a una altra amb un senzill «arrossegar i deixar anar».
Crear una tasca a partir d’un missatge de xat Podeu crear una tasca a partir d’un missatge de xat utilitzant el botó «Crea una tasca nova» al menú desplegable a la dreta del missatge. Això obrirà un quadre de diàleg on podeu triar a quina llista de tasques voleu afegir la tasca. El nom de la tasca serà l’àlies de l’usuari/a i la descripció de la tasca serà el contingut del missatge.
Gràcies a aquesta funció podeu, per exemple, demanar a la moderació que anoti totes les preguntes del xat, de manera que les pugueu veure d’un cop d’ull durant el directe i comprovar que les heu respost.`,description:"Podeu gestionar tasques i llistes de tasques pendents amb el vostre equip de moderació.",tags:[],title:"Tasques / llistes de coses a fer",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/tasks/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció arriba amb la versió del complement Livechat 11.0.0. Introducció El connector Livechat inclou una aplicació de notes de moderació: podeu escriure algunes notes, que es podrien associar als/les participants del xat. L’equip d’administració de cada sala té accés a aquestes notes, de manera que pot editar-les de manera col·laborativa.
Per exemple, podeu utilitzar aquesta aplicació per:
compartir algunes notes entre moderadors/es prendre notes sobre participants expulsats/des o que han causat problemes … Ús de l’aplicació Notes de moderació Obrint l’aplicació Notes de moderació Per obrir l’aplicació Notes de moderació, hi ha un botó «Notes de moderació» al menú de xat superior:
Si feu clic a aquest botó es canviarà la visualització de l’aplicació:
Tip Per tindre més espai i una millor llegibilitat obriu el xat en mode de pàgina completa.
Drets d’accés L’administració de cada sala té accés a aquesta aplicació (de lectura i escriptura).
Quan promocioneu algú a administrador/a o propietari/a de la sala, obté accés instantani a aquesta aplicació. Quan suprimiu els drets d’administrador/a o de propietari/a d’algú, perd instantàniament l’accés a aquesta aplicació.
Àmbit Les notes només estan disponibles a la sala on les heu creades.
Les sales de xat poden estar relacionades amb el vídeo o el canal. Si voleu guardar notes d’un vídeo a un altre considereu utilitzar sales associades als canals.
Warning Actualment la configuració de sales de vídeo o de canal és una configuració per a tota la instància. Només l’administració de PeerTube poden canviar-ho i s’aplica a totes les sales de xat. En el futur aquesta opció s’afegirà a les opcions de canal.
Notes Crear/editar notes Podeu utilitzar el botó més a la part superior per crear una nota nova. També podeu editar les notes existents mitjançant el botó d’edició o eliminar qualsevol nota.
Tip Tots els canvis són visibles a l’instant a totes les pestanyes del vostre navegador i per a tota l’administració de la sala.
Podeu crear una nota associada a un/a participant de diverses maneres:
utilitzant l’acció «Crear una nota nova» al menú desplegable al costat dels àlies a la barra lateral utilitzant l’acció «Crear una nota nova» al menú desplegable al costat dels missatges de xat Quan s’associa una nota a un participant veureu el seu àlies i l’avatar a la part superior de la nota.
Filtrat de notes Podeu filtrar les notes per trobar totes les notes relacionades amb un/a participant determinat/da de diverses maneres:
feu clic al botó «Cerca notes» disponible a les notes per trobar totes les notes relacionades amb el/la mateix/a participant feu clic al botó «Cerca notes» al menú desplegable al costat dels àlies a la barra lateral feu clic al botó «Cerca notes» al menú desplegable al costat dels missatges de xat Podeu eliminar el filtre fent clic al botó de tancament.
Quan filtreu les notes d’un/a participant hi ha diverses informacions que es mostren a la dreta del seu àlies:
si l’àlies actual és diferent de l’àlies quan es va crear la nota, es mostrarà l’àlies original veureu el JID (Jabber ID) de la persona participant també veureu l’ocupant-id de la persona participant El resultat de la cerca també inclourà totes les notes relacionades amb els/les participants que tenien el mateix àlies. Així, també podeu prendre nota d’anònims/es (que no tenen cap JID coherent o occupant-id). Podeu diferenciar-los comparant JID i occupant-id.
Classificació de notes Podeu ordenar les notes simplement arrossegant i deixant anar.`,description:"Notes de moderació del connector Livechat",tags:[],title:"Notes de moderació",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/moderation_notes/index.html"},{breadcrumb:"Livechat de PeerTube > Documentació > Documentació d'usuari > Per a streamers",content:` Info Aquesta funció s’inclou a la versió 8.0.0 del connector Livechat i l’administració de la instància la pot desactivar.
Podeu activar un bot de xat a les vostres sales. La configuració del bot es fa canal per canal i s’aplica a les sales de tots els vídeos d’aquests canals.
Per accedir a aquesta pàgina consulteu la documentació de configuració del canal.
Un cop aquí, podeu activar el bot i configurar algunes opcions:
Caràcters especialsEl bot pot moderar automàticament els missatges que contenen massa caràcters especials.
Cap missatge duplicatEl bot pot moderar automàticament els missatges duplicats.
Mots prohibitsEl bot pot moderar automàticament els missatges que contenen mots prohibits.
TemporitzadorsEl bot pot enviar alguns missatges periòdicament.
OrdresEl bot pot respondre a diferents ordres.
El bot tornarà a carregar automàticament les seves opcions quan deseu la pàgina.`,description:"Configuració del bot de xat",tags:[],title:"Bot de xat",uri:"/peertube-plugin-livechat/ca/documentation/user/streamers/bot/index.html"},{breadcrumb:"Livechat de PeerTube",content:"",description:"",tags:[],title:"Categories",uri:"/peertube-plugin-livechat/ca/categories/index.html"},{breadcrumb:"",content:` Tip Podeu utilitzar el selector d’idiomes del menú esquerre per veure aquesta documentació en diferents idiomes. Falten algunes traduccions o estan incompletes, en aqueix cas en veureu la versió en anglès.
Us donem la benvinguda a la documentació del Connector Livechat de PeerTube.
PeerTube és una plataforma d’emissió descentralitzada, que pot emetre en directe i vídeo sota demanda (VOD: Video On Demand). Aquest connector us permet afegir capacitat de xat a la vostra instal·lació de PeerTube, permetent interaccions amb els streamers.
Per obtenir una visió general de les possibilitats d’aquest connector feu una ullada a la introducció. Per obtenir informació més específica trobareu el resum d’aquesta documentació a continuació.
Tip Podeu utilitzar la barra de cerca del menú esquerre per trobar ràpidament documentació específica.
Info Abans d’actualitzar el connector a una nova versió principal, llegiu les notes de la versió i la llista de possibles canvis no compatibles amb versions anteriors: CHANGELOG.
IntroduccióIntroducció
DocumentacióDocumentació del connector
Documentació d'usuariDocumentació d'usuari per al connector Livechat de PeerTube
Per a espectadors/esCom xatejar per a espectadors/es de l'emissió
OBSDocumentació per publicar contingut de xat mitjançant OBS.
Clients XMPPConnectar al xat amb un client XMPP
Per a streamersCom configurar el xat per a les vostres emissions en directe
Alguns conceptes bàsicsInformació bàsica sobre com configurar i utilitzar el xat per a les vostres emissions en directe
Configuració del canalConfiguració de sales de xat del canal PeerTube
AnuncisAdministradors/es i propietaris/es de les sales poden enviar anuncis especials al xat.
ModeracióFuncions de moderació avançades del connector Livechat
Condicions d'úsConfigurar les condicions d'ús dels xats del canal
Mode lentMode lent del connector Livechat
Retard de moderacióRetard de moderació del connector Livechat
Emojis personalitzatsEmojis personalitzats del connector Livechat
Mode només emojisConnector Livechat en mode només emojis
EnquestesPodeu crear enquestes per demanar als/les espectadors/es la seva opinió
Tasques / llistes de coses a ferPodeu gestionar tasques i llistes de tasques pendents amb el vostre equip de moderació.
Notes de moderacióNotes de moderació del connector Livechat
Bot de xatConfiguració del bot de xat
Guia d'instal·lacióInstal·lació el connector Livechat de PeerTube
Resolució de problemesAlguns errors comuns i solucions alternatives.
Problemes coneguts: compatibilitat de CPUDe moment, el connector només admet les arquitectures de CPU x86_64 i arm64. Si us plau, trobareu instruccions per fer-lo funcionar en altres arquitectures de CPU aquí.
Actualització des d'una versió anterior a la 6.0.0Notes importants per a l'actualització des d'una versió anterior del connector.
Documentació d'administracióAdministració del connector de PeerTube Livechat
AjustamentsConfiguració del connector Livechat de PeerTube
Autenticació externaConfiguració del connector de Peertube Livechat - Autenticació externa
mod_firewall ProsodyRegles avançades del tallafoc per al servidor Prosody
Ús avançatAlgunes funcions avançades
Clients XMPPPermetre la connexió mitjançant clients XMPP
Utilitzar MatterbridgeEmprar Matterbridge per fer de passarel·la amb altres xats
ContribuirContribuir
Codi de conductaConvenció de codi de conducta per col·laboradors/es
TraduirTraduir el plugin
Doneu la vostra opinióDoneu la vostra opinió
DesenvoluparDesenvolupar
DocumentacióDocumentar el connector o traduir la documentació.
Seguiment d'errors / Noves funcionsSeguiment d'errors / sol·licituds de noves funcions
Technical documentationTechnical documentation
Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
EnquestesPolls technical documentation
Terms&ConditionsTerms&Conditions implementation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview
Contacteu amb miContactar amb l'autor
CrèditsCrèdits del connector`,description:"Documentació del connector Livechat de PeerTube",tags:[],title:"Livechat de PeerTube",uri:"/peertube-plugin-livechat/ca/index.html"},{breadcrumb:"Livechat de PeerTube",content:"",description:"",tags:[],title:"Tags",uri:"/peertube-plugin-livechat/ca/tags/index.html"}]