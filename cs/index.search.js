var relearn_search_index=[{breadcrumb:"Peertube livechat",content:`What is the livechat plugin? This Peertube plugin is meant to provide a chat system for Peertube videos.
By default, once you have installed the plugin on your Peertube instance, a chat room will automatically be created for each live stream.
On the following screenshot, you can see a classic Peertube video page, with a chat room on the right (click on the picture to view it full screen):
The chat room will be accessible for all viewers, even those who don’t have an account on your instance. Those “anonymous” users just have to choose a nickname before they can begin talking in the chat.
By default, the chat is displayed next to the video. But you can open it in another browser tab, using the button on top of it :
Tip You can test the livechat plugin with this demo page.
Installation As a Peertube administrator, you can setup this plugin on your instance simply by using the Peertube plugin marketplace included in the administration interface. Search for “livechat”, then click “install”: that’s it!
Livechat capabilities The plugin has many advanced features. As it is using the XMPP standard “under the hood”, it is possible for Peertube administrators to allow advanced usages (connection using XMPP clients, chatbots, bridge to other chat protocols, …). More information in the relevant sections of this documentation.
Federation Peertube is part of the fediverse: you can create a network of Peertube instances, sharing content between them.
This plugin can handle federation: when viewing a livestream from a remote instance, you will join the chat room with your local account. You will be automatically connected with your current nickname and avatar.
Of course, for the federation to work, the plugin must be installed on both instances.
Moderation Some times, you have to protect your community from bad people. As an instance administrator, you can choose to disallow federation for the livechat plugin. If remote actors behave badly, streamers, moderators and administrators can ban or mute users.
Chat bot This plugin comes with a built-in chat bot. Check its documentation for more information.
You can also plug in any other XMPP chat bot, using XMPP External Components. To do so, you just have to configure External Components access in the plugin settings.
Chat persistence When joining a room, you will see previous messages. Even those sent before you joined the room.
This behaviour can be changed room by room, and default retention duration can be chosen by instance’s administrators.
Integrate the chat in your live stream When using software as OBS for you live stream, you can embed the chat in the video stream. This is for example useful for replays.
In the following screenshot, you can see a live replay, where the chat content is embeded on bottom of the video:
In the following screenshot, you can see an OBS setup, where the chat is included as a source in the current scene (background color can be changed, and can be transparent):
Other usages By default, each streamer will be able to activate/deactivate the chat for their live streams.
But on the instance level, administrators can choose to activate the chat for all videos (live and/or VOD).
You can even activate the chat for specific VOD videos. This is how the demo page works: it is not a live stream, but I have activated the chat specifically for this video.`,description:"Introduction",tags:[],title:"Introduction",uri:"/peertube-plugin-livechat/cs/intro/index.html"},{breadcrumb:"Peertube livechat",content:` User documentationPlugin peertube-plugin-livechat user documentation
For viewersHow to chat for stream viewers
OBSDocumentation to stream the chat content using OBS.
XMPP ClientsConnect to chat using a XMPP client
For streamersHow to setup the chat for your live stream
Some basicsSome basics about how to setup and use the chat for your live stream
Channel configurationPeertube channel chatrooms configuration
AnnouncementsRoom owners and administrators can send special announcements in the chat.
ModerationPlugin peertube-plugin-livechat advanced moderation features
Terms & conditionsConfigure channel's chat terms & conditions
Slow modePlugin peertube-plugin-livechat slow mode
Moderation delayPlugin peertube-plugin-livechat moderation delay
Custom emojisPlugin peertube-plugin-livechat custom emojis
Emojis only modePlugin peertube-plugin-livechat emojis only mode
PollsYou can create polls to ask viewers their opinion
Tasks / To-do listsYou can handle tasks and task lists with your moderation team.
Moderation notesPlugin peertube-plugin-livechat moderation notes
Chat botChat bot setup
Installation guidePlugin peertube-plugin-livechat installation guide
TroubleshootingSome classic mistakes and workarounds.
Known issues: CPU CompatibilityFor now, the plugin only works out of the box for x86_64 and arm64 CPU architecture. Here are some instructions for other CPU architectures.
Upgrade from version older than 6.0.0Important notes when upgrading for an older version.
Admin documentationPlugin Peertube Livechat administration
SettingsPlugin Peertube Livechat settings
External AuthenticationPlugin Peertube Livechat settings - External Authentication
Prosody mod_firewallAdvanced firewall rules for the Prosody server
Advanced usageSome advanced features
XMPP clientsAllow connections using XMPP clients
Using MatterbridgeUsing Matterbridge to bridge with other chats`,description:"Plugin documentation",tags:[],title:"Dokumentace",uri:"/peertube-plugin-livechat/cs/documentation/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation",content:`Joining chat rooms When you are watching a Peertube video that has the chat activated, you will see the chat next to the video:
There are two slightly different use cases, depending on wether or not you have an account on the Peertube instance. See bellow for more informations.
If you haven’t a Peertube account Varování This feature can be disabled by the instance’s adminitrators.
If you are not logged in on the Peertube instance where you are watching the video, you will automatically join the chat. You will be assigned a random nickname (something like “Anonymous 12345”).
Before being able to speak in the chat room, you have to enter a nickname in the field on the bottom of the window.
Log in using an external authentication provider Varování This feature can be disabled by the instance’s adminitrators.
The Peertube instance can configure external authentication providers (Mastodon accounts, Google accounts, …). In such case, you will see a “Přihlášení pomocí externího účtu” button, that will open a dialog modal. In this dialog modal, there will be some buttons to connect using a remote account.
Once you signed in the remote account, and have granted access, your nickname and avatar (if available) will be automatically fetched. No other data will be stored. These data will be automatically deleted several hours after your quit the chat.
If you have a Peertube account If you are connected with your Peertube account, you will automatically join the room, using your Peertube nickname and avatar.
Tip If you are watching a live on an instance on which you have no account, but you have an account on another instance: if the livechat plugin is installed on both instances, it is possible to join the chat using your account. To do so, just open the video on your instance (you can for example copy/paste the video url in the search field of your instance).
If you have a Peertube account on another Peertube instance Info Tato funkce je součástí pluginu livechat verze 9.0.0. If you have a Peertube account, but not on the current instance, there is a “Přihlášení pomocí externího účtu” button. This button will open a dialog where you can enter your Peertube instance URL. Once you entered it, it will check if the livechat plugin is available on the remote instance, and if the video is available. If it is the case, you will be redirected to the video on the remote instance.
Chatting To send messages, just type them in the “message” field on the bottom of the screen. You can send them by pressing the enter key on your keyboard, or by clicking on the “send” button.
If you want to add line breaks in your messages, you can use the “shift+enter” key combination.
You can add emojis to your messages. You can for example use the emojis menu, or directly type emojis shortcuts like :smiley:.
You can mention other participants. To do so, you can type the first nickname letters, then press the tab key. You can also type @: this will directly open the menu. You can also click on a nickname in the participants list to insert it in the message field.
Participants list To see the list of participants, just open the right menu:
You can see that some participants have special rights (moderator, owner, …).
Chat dropdown menu There is a dropdown menu on the top of the chat, with some advanced features. This is especially useful for moderation features. Available features depends on your access level.
Opening full screen On top of the chat, there is a button to open the chat in fullscreen. This will open a new browser tab with the following content:
It can be easier to chat using a full browser tab.
Changing nickname You can change your nickname by typing /nick your_new_nickname in the message field.
You can also change your nickname using the chat menu.`,description:"How to chat for stream viewers",tags:[],title:"For viewers",uri:"/peertube-plugin-livechat/cs/documentation/user/viewers/index.html"},{breadcrumb:"Peertube livechat > Přispívání",content:` Tip Tento kodex chování je převzat z dokumentu Contributor Covenant, verze 2.1, který je k dispozici na adrese https://www.contributor-covenant.org/version/2/1/code_of_conduct.html. Překlady jsou k dispozici na adrese https://www.contributor-covenant.org/translations. Případy urážlivého, obtěžujícího nebo jinak nepřijatelného chování lze hlásit vedoucím komunity odpovědným za jejich prosazování na e-mailovou adresu git.[at].john-livingston.fr.
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
For answers to common questions about this code of conduct, see the FAQ at https://www.contributor-covenant.org/faq. Translations are available at https://www.contributor-covenant.org/translations.`,description:"Kodex chování smluvních partnerů",tags:[],title:"Kodex chování",uri:"/peertube-plugin-livechat/cs/contributing/codeofconduct/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Admin documentation",content:`This section describes the plugin settings page.
Podmínky chatu kanálu Můžete nakonfigurovat zprávu “podmínky”, která se zobrazí uživatelům, kteří se připojí k vašim chatovacím místnostem.
For more information on this feature, check the documentation for channel’s terms & conditions.
Info Changing this setting will restart the chat server, and all users will be disconnected for a short time.
Seznam stávajících místností When pressing the «List rooms» button, all existing chatrooms will be listed. You can then find them and moderated them.
Federation Following settings concern the federation with other Peertube instances, and other fediverse softwares.
Nezobrazovat vzdálené chaty Pokud toto nastavení zaškrtnete, vaše instance nebude nikdy zobrazovat chaty ze vzdálených videí.
Nezveřejňujte informace z chatu Zaškrtnutím tohoto nastavení vaše instance nebude publikovat informace o chatu na fediverse. Vzdálené instance Peertube nebudou vědět, že se jedná o chatovací místnosti spojené s vašimi videi.
Upozornění: pokud jste již chatovali, je možné, že informace již byly zveřejněny. Než bude zveřejnění informací zrušeno, budete muset počkat na další aktualizaci videa. Pokud toto nastavení zakážete, budete muset počkat, až budou videa aktualizována, než budou informace znovu zveřejněno. K této aktualizaci dojde mimo jiné, když se živý přenos obnoví nebo zastaví.
Upozornění: toto nastavení ovlivňuje pouze zveřejňování informací prostřednictvím protokolu ActivityPub. Nezabrání vzdálené aplikaci, aby jinak zjistila přítomnost chatů a pokusila se k ní připojit.
Authentication Zakázat tokeny livechatu In case you have any trouble with the long term authentication tokens, you can disable the feature here.
External Authentication See the detailed documentation page:
External Authentication
Channel advanced configuration Following settings concern the advanced channel options: users will be able to add some customization on their channels, activate the moderation bot, …
Zakázat pokročilou konfiguraci kanálu a chatbota If you encounter any issue with this feature, you can disable it.
Chat behaviour Typ místnosti Zde si můžete vybrat, zda chcete mít pro každé video samostatnou místnost, nebo zda je chcete seskupit podle kanálů.
Automatické otevření chatu Při sledování videa se automaticky otevře okno chatu.
Zobrazit tlačítko “otevřít v novém okně” K dispozici bude tlačítko pro otevření webového chatu v novém okně.
Zobrazení tlačítka “sdílet odkaz na chat” This feature enables a «share chat link» modal. With this modal, you can generate URLs to join the chat. The chat can be customized (readonly mode, use the current theme, …).
You can for example generate a readonly URL and use it in OBS to integrate the chat in your live stream!
This setting allows you to choose who can access this modal.
Uživatelé si mohou aktivovat chat pro své živé přenosy Pokud je zaškrtnuto, budou mít všechna živá videa ve svých vlastnostech zaškrtávací políčko pro povolení webového chatu.
The video owner will be able to activate web chats.
Aktivace chatu pro všechny živé přenosy Pokud je zaškrtnuto, bude chat povolen pro všechny živé přenosy.
Aktivace chatu pro všechny neživé přenosy Aktivace chatu pro všechny neživé přenosy
Aktivovat chat pro tato videa Aktivovat chat pro tato videa
Skrytí chatu pro anonymní uživatele Pokud je zaškrtnuto, anonymní uživatelé Peertube chat neuvidí. Tato funkce je stále experimentální. Pokud jste ji povolili, důrazně doporučujeme zaškrtnout také možnost “Nezveřejňovat informace o chatu”. V opačném případě by se některé nástroje třetích stran mohly pokusit chat otevřít a chovat se nepředvídatelně.
Note: for now this feature simply hide the chat. In a future release, the chat will be replaced by a message saying «please log in to […]». See v5.7.0 Release Notes for more information.
Zakázat IP adresu anonymního uživatele, když je uživatel vykázán z chatovací místnosti Povolením této možnosti bude při každém zákazu anonymního uživatele v chatovací místnosti jeho IP adresa rovněž zakázána na chatovacím serveru. Upozornění: Pokud je vaše instance otevřená pro registraci, může kterýkoli uživatel vytvořit místnost v pasti, pozvat uživatele, aby se k ní připojili, a automaticky zakázat všechny IP adresy anonymních uživatelů. Seznam zakázaných IP se neukládá, vymaže se při restartu serveru nebo při změně nastavení některého zásuvného modulu. Zakázané IP jsou zaznamenány v logovacích souborech serveru Prosody, takže správci serveru mohou případně použít některé externí nástroje (jako fail2ban) pro širší zakázání IP.
Important note: If you enable this feature, and are using a custom reverse proxy on front of Peertube, please make sure that your setup is correctly configured to forward real user’s IPs to Peertube. Otherwise it could block all anonymous users at once.
Theming Sada Avatarů You can choose from several different sets the default avatars that will be used for chat users.
Sépie (maskot Peertube): David Revoy’s Peertube avatar generator, CC-By license
Kočky: David Revoy’s cat avatar generator, CC-By license
Ptáci: David Revoy’s bird avatar generator, CC-By license
Fenek (maskot Mobilizon): David Revoy’s fenec/mobilizon avatar generator, CC-By license
Abstrakt: David Revoy’s Abstract avatar generator, CC-By license
Starší avatary Sepia (ty, které byly součástí předchozích verzí zásuvného modulu): Based on David Revoy' work, AGPL-v3 license
If you can’t see the change immediatly, it could be because of your browser cache. Just clear your browser session storage, or restart it.
Motiv ConverseJS You can choose which theme to use for ConverseJS:
Peertube theme: this is a special theme, made especially for peertube’s integration. Default ConverseJS theme: this is the default ConverseJS theme. ConverseJS cyberpunk theme: this is a theme provided by ConverseJS. Automatická detekce barev Pokus o automatickou detekci barev podle aktuálního motivu uživatele.
Pokud je toto nastavení povoleno, zásuvný modul se pokusí automaticky detekovat barvy, které se použijí v tématu chatu.
Pokud to pro některé téma Peertube nefunguje správně, můžete tuto možnost zakázat. Chybu můžete nahlásit na oficiálním sledovači problémů . Nezapomeňte uvést, který motiv nefunguje.
Atribut stylu iframe webového chatu Další styly, které mají být přidány do atributu stylu iframe. Příklad: height:400px;
Chat server advanced settings Použití systému Prosody The plugin comes with an AppImage that is used to run the Prosody XMPP server. If this AppImage is not working, you can fallback to the Prosody that is packaged for your server. Just install the prosody package.
This setting should only be used if the plugin is broken, and waiting for a patch.
Zakázat Websocket S Peertube >= 5.0.0, tento plugin se snaží používat Websocket připojení pro chatování. Pokud je prohlížeč nebo připojení uživatele nekompatibilní, prohlížeč automaticky přejde zpět na protokol BOSH. Ve výjimečných případech však může dojít k selhání. Například pokud máte před Peertube reverzní proxy server, který nepovoluje Websocket připojení pro zásuvné moduly. V takovém případě můžete zaškrtnutím tohoto nastavení zakázat připojení Websocket.
Prosody port Port, který bude používat server Prosody.
Změňte jej, pokud je tento port na vašem serveru již používán.
Tento port můžete na svém firewallu zavřít, nebude k němu přístup z vnějšího světa.
Poznámka: toto se může v blízké budoucnosti změnit, protože se plánuje přidání funkce pro aktivaci připojení zvenčí.
URL Peertube pro volání API Pokud nevíte, co děláte, nechte prosím toto nastavení prázdné.
V některých vzácných případech nemůže Prosody volat rozhraní API Peertube z jeho veřejného URI. Toto pole můžete použít k přizpůsobení URI Peertube pro moduly Prosody (například pomocí „http://localhost:9000“ nebo „http://127.0.0.1:9000“).
If this setting is left empty, and you are using Peertube >= 5.1 or later, the plugin will use values from your Peertube configuration file to guess on which interface and port request have to be done.
In last resort, it will use your Peertube public URI. So, any API Call will go throught your Nginx server. This could fail in some case: for example if you are in a Docker container, where the public hostname does not resolve to the correct IP. In such case, try changing the “URL Peertube pro volání API” settings, by setting http://127.0.0.1:9000 (assuming 9000 is the port on which Peertube listen, ask your instance administrators if you don’t know).
Obsah přihlašovacích místností ve výchozím nastavení Pokud je zaškrtnuto, obsah místnosti se ve výchozím nastavení uloží. Každý uživatel, který se připojí k místnosti, uvidí, co bylo napsáno před jeho připojením.
Vezměte prosím na vědomí, že je vždy možné obsah zapnout/vypnout. archivaci pro konkrétní místnost úpravou jejích vlastností.
Vypršení platnosti protokolů místností Zde můžete zvolit, jak dlouho bude obsah chatovací místnosti na serveru uchováván. Hodnota může být:
60: obsah bude uložen po dobu 60 sekund. Hodnotu 60 můžete nahradit libovolnou celočíselnou hodnotou. 1d: obsah bude uložen po dobu 1 dne. Hodnotu 1 můžete nahradit libovolnou celočíselnou hodnotou. 1w: obsah bude uložen na 1 týden. Hodnotu 1 můžete nahradit libovolnou celočíselnou hodnotou. 1m: obsah bude uložen na 1 měsíc. 1 můžete nahradit libovolnou celočíselnou hodnotou. 1y: obsah bude uložen po dobu 1 roku. 1 můžete nahradit libovolnou celočíselnou hodnotou. nikdy: obsah nikdy nevyprší a bude uchováván navždy. Povolení připojení k místnosti pomocí externích účtů XMPP Povolením této možnosti se bude možné připojit k místnostem pomocí externích účtů XMPP a klientů XMPP.
Upozornění, povolení této možnosti může vyžadovat další konfiguraci serveru a DNS. Podívejte se prosím do dokumentace: . Povolení externího připojení k účtu XMPP. Server Prosody na port serveru Port, který bude použit pro připojení XMPP s2s (server to server).
Měli byste použít standardní port 5269. V opačném případě byste měli nastavit konkrétní záznam DNS .
Síťová rozhraní mezi servery Síťová rozhraní, na kterých se má naslouchat pro připojení serveru k serveru.
Seznam IP adres pro naslouchání, oddělených čárkami (mezery budou odstraněny).
Můžete použít „*“ pro naslouchání na všech rozhraních IPv4 a „::“ pro všechna rozhraní IPv6.
Příklady:
Příklady: *, :: * 127.0.0.1, ::1 172.18.0.42 Složka certifikátů Pokud je toto pole prázdné, zásuvný modul bude generovat a používat certifikáty podepsané vlastním podpisem.
Pokud chcete použít jiné certifikáty, stačí zde zadat složku, kde je Prosody najde. Poznámka: uživatel „peertube“ musí mít k této složce přístup pro čtení.
Povolení připojení klienta k serveru Povolení připojení klientů XMPP k vestavěnému serveru Prosody.
Pouze tato volba umožňuje připojení pouze klientům localhost.
This setting enable XMPP clients to connect to the built-in Prosody server. For now, this option only allows connections from localhost clients.
As example, this option can allow an instance of Matterbridge (once it could use anonymous login) on the same machine to bridge your chat with another services like a Matrix room.
Port klienta Prosody na server Port, který bude používat modul c2s integrovaného serveru Prosody.
Klienti XMPP budou pro připojení používat tento port.
Změňte jej, pokud je tento port na vašem serveru již používán.
Tento port můžete prozatím nechat na svém firewallu zavřený, nebude k němu přístup z vnějšího světa.
Poznámka: to se může v blízké budoucnosti změnit, protože se plánuje přidání funkce pro aktivaci připojení zvenčí.
Síťová rozhraní mezi klientem a serverem Síťová rozhraní, na kterých bude naslouchat připojení klienta k serveru.
Toto nastavení je určeno pro pokročilé uživatele. Toto nastavení neměňte, pokud plně nerozumíte tomu, co znamená.
Seznam IP adres k poslechu, oddělené čárkou (mezery budou odstraněny).
Můžete použít «*» pro poslech na všech rozhraních IPv4 a «::» pro všechna IPv6.
Příklady:
*, :: * 127.0.0.1, ::1 127.0.0.1, ::1, 172.18.0.42 Povolit vlastní externí součásti Prosody This setting enable XMPP external components to connect to the server. By default, this option only allows connections from localhost components. You have to change the “Síťová rozhraní externích komponent Prosody” value to listen on other network interfaces.
This feature could be used to connect bridges or bots.
More informations on Prosody external components here.
Povolit vlastní externí součásti Prosody Povolte použití externích komponent XMPP.
Tato možnost sama o sobě umožňuje připojení pouze z localhost. Musíte nastavit naslouchací rozhraní a otevřít port na vašem firewallu, abyste jej zpřístupnili ze vzdálených serverů.
Tuto funkci lze například použít k připojení některých robotů k chatovacím místnostem.
Port pro externí komponenty Prosody Port, který budou komponenty XMPP používat pro připojení k serveru Prosody.
Změňte jej, pokud se tento port již na vašem serveru používá.
Pokud nepovolíte přístup jiným rozhraním než localhost, můžete tento port ponechat na vašem firewallu uzavřený.
Síťová rozhraní externích komponent Prosody Síťová rozhraní pro naslouchání připojení externích komponent.
Seznam IP adres k poslechu, oddělené čárkou (mezery budou odstraněny).
Můžete použít «*» pro poslech na všech rozhraních IPv4 a «::» pro všechna IPv6.
Příklady:
*, :: * 127.0.0.1, ::1 172.18.0.42 Externí komponenty Externí komponenty, které je třeba deklarovat:
Jedna na řádek. Použijte formát «název_komponenty:tajné_komponenty» (mezery budou oříznuty). Můžete přidávat komentáře: vše za znakem # bude odstraněno a prázdné řádky budou ignorovány. Název může obsahovat pouze latinské alfanumerické znaky a tečky. Pokud název obsahuje pouze alfanumerické znaky, bude doplněn o doménu XMPP. Například „most“ se změní na „most.vaše_doména.tld“. Můžete také zadat úplný název domény, ale musíte se ujistit, že jste správně nakonfigurovali DNS. V tajné přístupové frázi používejte pouze alfanumerické znaky (použijte alespoň 15 znaků). Povolit mod_firewall Prosody You can enable mod_firewall on your Prosody server.
For more information, please check the documentation.`,description:"Plugin Peertube Livechat settings",tags:[],title:"Settings",uri:"/peertube-plugin-livechat/cs/documentation/admin/settings/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`This page describes the different source code folders and their content.
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
vendor The vendor folder is not part of the source code. It is used during the build process to download some external source code.`,description:"Source code organization",tags:[],title:"Source code",uri:"/peertube-plugin-livechat/cs/technical/sourcecode/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers > Chat bot",content:`Zákaz speciálních znaků Info Tato funkce je součástí pluginu livechat verze 12.0.0. Configuration Pokud tuto možnost povolíte, moderátor bude automaticky mazat zprávy obsahující více než X speciálních znaků. Speciální znaky jsou ty, které nepatří do jedné z těchto kategorií: písmena, číslice, interpunkční znaménka, symboly měn, emotikony.
Tolerance Počet speciálních znaků, které lze ve zprávě přijmout, aniž by došlo k jejímu vymazání.
Důvod Důvod zobrazení kromě smazaných zpráv
Také moderovat zprávy od moderátorů Ve výchozím nastavení se tato funkce na zprávy moderátora nevztahuje. Zaškrtnutím této možnosti budou zprávy od moderátorů rovněž odstraněny.`,description:"The bot can automatically moderate messages containing too many special characters.",tags:[],title:"Special characters",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/bot/special_chars/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Installation guide",content:`I just installed/upgraded the plugin, but nothing happens If you have just installed/upgraded the plugin, but nothing happens (no chat, no settings, buttons in the settings page does not work, …), just try to reload the page.
Diagnostic tool If the chat does not work, there is a diagnostic tool in the plugin’s settings pages.
Open the plugin settings, and click on the “launch diagnostic” button.
If there is any error in the diagnostic page, you can search in this page for a solution, or refer to the Bug tracking documentation page if you can’t find any response.
Chat does not load Internal API calls In some case (like for some Docker Peertube installation), the diagnostic tools displays an error for the test called “API Prosody -> Peertube is KO”.
In such case, try changing the “URL Peertube pro volání API” settings, by setting http://127.0.0.1:9000 (assuming 9000 is the port on which Peertube listen, ask your instance administrators if you don’t know).
Check the help for this setting for more information.
Websocket If everything is fine in the diagnostic tools, but chat windows remains empty: it can be a Websocket issue. Since Peertube version 5.0.0, there are some additional configuration to do on the server side. Check with the instance administrators that they did not forgot to apply changes listed in the Peertube v5.0.0 release notes.
You can confirm that it is a Websocket issue by opening your browser console, and checking for error logs talking about failed Websocket connection.
If you can’t fix this immediatly, you can disable Websocket by unchecking “Zakázat Websocket” in the plugin setting page. In such case, you should also check “Nezveřejňujte informace z chatu”, as chat federation won’t work without Websocket.`,description:"Some classic mistakes and workarounds.",tags:[],title:"Troubleshooting",uri:"/peertube-plugin-livechat/cs/documentation/installation/troubleshooting/index.html"},{breadcrumb:"Peertube livechat > Dokumentace",content:` For viewersHow to chat for stream viewers
OBSDocumentation to stream the chat content using OBS.
XMPP ClientsConnect to chat using a XMPP client
For streamersHow to setup the chat for your live stream
Some basicsSome basics about how to setup and use the chat for your live stream
Channel configurationPeertube channel chatrooms configuration
AnnouncementsRoom owners and administrators can send special announcements in the chat.
ModerationPlugin peertube-plugin-livechat advanced moderation features
Terms & conditionsConfigure channel's chat terms & conditions
Slow modePlugin peertube-plugin-livechat slow mode
Moderation delayPlugin peertube-plugin-livechat moderation delay
Custom emojisPlugin peertube-plugin-livechat custom emojis
Emojis only modePlugin peertube-plugin-livechat emojis only mode
PollsYou can create polls to ask viewers their opinion
Tasks / To-do listsYou can handle tasks and task lists with your moderation team.
Moderation notesPlugin peertube-plugin-livechat moderation notes
Chat botChat bot setup
Special charactersThe bot can automatically moderate messages containing too many special characters.
No duplicate messageThe bot can automatically moderate duplicate messages.
Forbidden wordsThe bot can automatically moderate messages containing forbidden words.
TimersThe bot can send periodically some messages.
CommandsThe bot can respond to several commands.`,description:"Plugin peertube-plugin-livechat user documentation",tags:[],title:"User documentation",uri:"/peertube-plugin-livechat/cs/documentation/user/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers > Chat bot",content:`Žádné duplicitní zprávy Info Tato funkce je součástí pluginu livechat verze 12.0.0. Configuration Povolením této možnosti bude moderovací robot automaticky upravovat duplicitní zprávy. To znamená, že pokud uživatel odešle stejnou zprávu dvakrát během X sekund, druhá zpráva bude odstraněna.
Časový interval Interval v sekundách, během kterého uživatel nemůže znovu odeslat stejnou zprávu.
Důvod Důvod zobrazení kromě smazaných zpráv
Také moderovat zprávy od moderátorů Ve výchozím nastavení se tato funkce na zprávy moderátora nevztahuje. Zaškrtnutím této možnosti budou zprávy od moderátorů rovněž odstraněny.`,description:"The bot can automatically moderate duplicate messages.",tags:[],title:"No duplicate message",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/bot/no_duplicate/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Admin documentation",content:`Users that are not connected to your Peertube instance are joining the chat using “anonymous accounts” (they can freely choose a nickname, and will be assigned a random avatar).
You can enable some external authentication methods to allow user to create chat accounts. In such case their nickname and avatar will be automatically initialized with the remote account information.
Such “external account users” will be easier to moderate than anonymous accounts.
This also allows user to join the chat without creating Peertube account (in case your instance has closed registration for example, or without waiting for account approval).
This page will describe available authentication methods.
For the user documentation, see user documentation
OpenID Connect Varování This feature is still experimental. This feature is available with the plugin version >= 9.0.0.
You can configure one external OpenID Connect compatible provider.
Doing so, you can for example use your website for Single Sign-On.
Popular CMS softwares (Wordpess, …) offers plugins implementing OpenID Connect.
To enable this feature, first you have to create a client on your provider side (check the related documentation for enabling OpenID Connect). Then go to the plugin settings, and enable “Použití poskytovatele služby OpenID Connect”.
Note: if you want to restrict allowed redirection urls on the provider side (best security practice), the plugin will show you the url to allow. Just copy it in your OpenID Connect application configuration.
You will now have to fill some settings.
Popisek pro tlačítko připojení Tento popisek se zobrazí uživatelům jako popisek tlačítka pro ověření u tohoto poskytovatele OIDC.
This is the button label in the following screenshot:
For now, it is not possible to localize this label.
Discovery URL Your OpenID Connect provider must implement the discovery URL. Just set here the discovery url, that should be something like https://example.com/.well-known/openid-configuration.
Note: if your provider use the standard /.well-known/openid-configuration path, you can omit it. For example https://accounts.google.com will work.
Client ID Your application Client ID.
Client secret You application Client secret.
Google, Facebook, … In addition to that, you can also configure one or several “standard” Open ID Connect provider (Google, Facebook, …).
For these providers, discovery url and button label are preset. You just have to create an OAuth2 application on the provider side, and configure Client ID and Client Secret.
If you think of a standard provider that is not available, you can ask for implementation by opening a new issue.
Troubleshooting If the button does not appear for end users, there might be a configuration issue. You can try the diagnostic tool to get more information.
Note: if you are connected to your Peertube account, the button will never show. So use a private browser window to test.
If the button is displayed but is not working, check your Peertube logs. It could be because the remote service does not use standard scopes or attribute names.
More to come Other authentication methods will be implemented in the future.`,description:"Plugin Peertube Livechat settings - External Authentication",tags:[],title:"External Authentication",uri:"/peertube-plugin-livechat/cs/documentation/admin/external_auth/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers > Chat bot",content:`Můžete nastavit některá slova, která bude bot automaticky moderovat (zprávy obsahující tato slova budou okamžitě odstraněny). Můžete také přidat volitelný důvod, který se zobrazí na místě smazaných zpráv. Na stránce s dokumentací je uvedeno několik příkladů.
You can fill several “Zakázaná slova nebo výrazy” fields. When a user sends a message that match the configured criteria, the message will automatically be deleted.
Zakázaná slova nebo výrazy In this field, you can set several words, group of words, or “regular expressions”.
Jedno slovo nebo výraz na řádek. Pokud na jeden řádek vložíte více slov, budou se porovnávat pouze zprávy obsahující celou sekvenci.
Each time a user sends a message, these words will be tested. If the message containes one of them, the message will be deleted.
You can for example fill this field with a swear words list.
To get some examples, please check these forbidden words suggestions.
If you have some usefull words lists, you are welcome to contribute to this suggestion page. There are in the support/forbidden_words folder of the livechat source code. See the contribution guide for more information.
Tip These words are case insensitive.
Tip You can combine a short moderation delay (1 second for example) with the moderation bot to delete messages containing swear words before any non-moderator user will see them.
Varování This features is still experimental. There might be some issues with non-latin alphabets. You can open an issue to report your problems.
Považujte za regulární výrazy By checking this option, each line of the “Zakázaná slova nebo výrazy” field will be considered as a regular expression.
Také moderovat zprávy od moderátorů Ve výchozím nastavení se tato funkce na zprávy moderátora nevztahuje. Zaškrtnutím této možnosti budou zprávy od moderátorů rovněž odstraněny.
Důvod Důvod zobrazení kromě smazaných zpráv
Komentáře Můžete sem přidat komentář k tomuto pravidlu, abyste si pamatovali, jak a proč jste ho vytvořili. Tyto komentáře jsou čistě orientační a nemají žádný vliv na chování bota.`,description:"The bot can automatically moderate messages containing forbidden words.",tags:[],title:"Forbidden words",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/bot/forbidden_words/index.html"},{breadcrumb:"Peertube livechat > Dokumentace",content:` Info Before updating to a major release, please read the release notes and breaking changes list : CHANGELOG.
Tip To install or update the plugin, just use the Peertube web admin interface.
Here are some other more specific instructions:
TroubleshootingSome classic mistakes and workarounds.
Known issues: CPU CompatibilityFor now, the plugin only works out of the box for x86_64 and arm64 CPU architecture. Here are some instructions for other CPU architectures.
Upgrade from version older than 6.0.0Important notes when upgrading for an older version.`,description:"Plugin peertube-plugin-livechat installation guide",tags:[],title:"Installation guide",uri:"/peertube-plugin-livechat/cs/documentation/installation/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Installation guide",content:`The Prosody AppImage included in the plugin will only work on x86_64 and arm64 CPU. It is not compatible with other CPU architectures.
To use the plugin, you will have to manually install Prosody on your server (see below).
Note: the plugin requires Prosody >= 0.12.0. If you are using an older version, Chat Federation could be broken, and it could have some unexpected behaviour.
Once it is done, you have to check Use system Prosody in the plugin settings.
On non-docker Peertube installation For standard installation, you just have to install the official prosody package for your linux distribution.
For example, on Debian/Ubuntu:
sudo apt install prosodyYou can then disable the service that starts automatically when you install Prosody (the plugin will launch a Prosody process, there is no need for the service to run). For example, on Debian/Ubuntu (and other Systemd based linux distributions):
sudo systemctl disable prosody && sudo systemctl stop prosodyWarning: do not disable Prosody if it is used for another service on your server, like for example Jitsi.
Docker You will have to generate a Peertube image that includes Prosody in the same container that Peertube. I know this is not the standard way to do this with Docker, but keep in mind it is a temporary workaround.
To generate and use such an image, please refer to the Docker documentation. The Docker file to generate the image should be:
FROM chocobozzz/peertube:production-bullseye RUN apt -y update && apt install -y prosody && apt -y cleanYunohost You have to disable metronome (the XMPP server provided by Yunohost), and install prosody.
This is already done by the Yunohost Peertube application, as it was required for the plugin before the v6.0.0.
But it may be removed in a near feature (to avoid drawbacks of this method). I have to discuss with Yunohost team, to decide how we can do to minimize drawbacks, and maximize compatibility.`,description:"For now, the plugin only works out of the box for x86_64 and arm64 CPU architecture. Here are some instructions for other CPU architectures.",tags:[],title:"Known issues: CPU Compatibility",uri:"/peertube-plugin-livechat/cs/documentation/installation/cpu_compatibility/index.html"},{breadcrumb:"Peertube livechat > Přispívání",content:`Můžete přispět k překladu tohoto pluginu. Překlady jsou zpracovávány pomocí softwaru Weblate s použitím Framasoft Weblate instance.
Varování Nikdy neupravujte přímo soubory ve složce languages, mohlo by to vést ke konfliktům.
Jak na to Vytvořte si účet: https://weblate.framasoft.org/accounts/register/ Ověřte svůj e-mail a postupujte podle zaslaného odkazu Vytvořte si heslo a nastavte svůj účet Přejděte na stránku projektu zásuvného modulu: https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/ Vyberte jazyk, do kterého chcete překládat Stačí přeložit chybějící věty nebo opravit ty, které se vám zdají nesprávné. Varování Mohou tam být nějaké “velmi technické” řetězce. Pokud si nejste stoprocentně jisti jejich významem nebo překladem, raději je nepřekládejte, aby se zobrazily v angličtině.
Překlady ConverseJS Tento zásuvný modul se spoléhá na ConverseJS pro front-end chatu. ConverseJS má vlastní překlady na vlastní instanci weblate. Překládat můžete také přímo v úložišti kódu. Další informace naleznete v dokumentaci ConverseJS translations.
Přidání nového jazyka Pokud si myslíte, že chybí nějaký jazyk, zkontrolujte prosím nejprve, zda je v Peertube zpracován. Pokud ano, můžete otevřít problém a požádat o něj.
Přidání nových řetězců / použití překladů v kódu Pokud pracujete na nových funkcích a potřebujete nové řetězce, můžete je vytvořit přímo ve Weblate. Anglická verze je povinná. Začněte s ní.
Každý řetězec je spojen s klíčem (například use_chat). Zvolte explicitní klíč v angličtině, malá písmena.
Pokud potřebujete otestovat nové řetězce, aniž byste čekali na sloučení Weblate, můžete upravit soubory languages/*.yml, ale tyto změny neodevzdávejte (abyste minimalizovali riziko konfliktu).
Použití překladů ve front-end kódu Před použitím řetězce ve front-endu je třeba deklarovat novou konstantu v client/@types/global.d.ts. Název konstanty musí:
začít předponou “LOC_” použít řetězcový klíč, psaný velkými písmeny stačí deklarovat jeho typ, nikoliv hodnotu Chcete-li například použít příkaz “use_chat”, musíte deklarovat:
declare const LOC_USE_CHAT: stringSkript build-client.js přečte soubor client/@types/global.d.ts, vyhledá takové konstanty a načte jejich hodnoty ze souborů jazyků.
Nyní můžete ve svém kódu jednoduše zavolat peertubeHelpers.translate(LOC_USE_CHAT).
Použití překladů v kódu back-endu Teoreticky jediné části backendového kódu, kde je potřeba lokalizace, jsou deklarace nastavení a standardizovaná data (ActivityPub, RSS, …). Zde potřebujeme získat anglické řetězce z překladového klíče.
Poznámka: Nikdy byste neměli potřebovat další jazykový překlad z backendového kódu. Lokalizace musí být provedena na front-endu.
Existuje modul lib/loc.ts, který poskytuje funkci loc(). Stačí jí předat klíč, abyste získali český řetězec: loc('diagnostic')'.
Překlad dokumentace Překlad dokumentace se provádí pomocí příslušné komponenty Weblate.
K zobrazení aplikačního řetězce můžete použít specifické “zkratky Hugo”. Řekněme, že chcete zobrazit název tlačítka “open_chat_new_window”, můžete jej použít v dokumentačním souboru markdown:
{{% livechat_label open_chat_new_window %}}Můžete také zabránit překladu celé stránky přidáním livechatnotranslation: true do sekce Yaml Font Matter:
--- title: "Third party" description: "Displaying the livechat with 3rd party software." weight: 20 chapter: false livechatnotranslation: true ---Nikdy nepřekládejte řetězec v souboru livechat.en.pot, byl by ignorován. Místo toho upravujte přímo soubory markdown.
Pokud řetězec obsahuje odkaz, můžete jej změnit na správný odkaz v přeloženém jazyce. Například pro odkaz na tuto dokumentaci můžete do url přidat kód jazyka.
Některé řetězce jsou bloky kódu. Nepřekládejte kód. Můžete však přeložit komentáře nebo parametry, pokud je to relevantní.
Pokud si nejste jisti, nepřekládejte a zeptejte se, co máte dělat.
Nástroj, který používám ke zpracování překladů dokumentace, se může chovat podivně. Když přidám věty, které vypadají jako jiné existující věty, někdy zkopíruje existující překlady. Takže když máte překlady označené jako “ke kontrole”, ujistěte se prosím, že před validací nezkopíruje řetězec, který nemá s tím anglickým nic společného.
Pokud jste si nyní jisti kontextem řetězce, můžete zkontrolovat umístění řetězce v pravém podokně weblate a otevřít příslušnou stránku dokumentace. Například pro řetězec umístěný v souboru support/documentation/content/en/documentation/user/streamers.md je odpovídající url adresa https://livingston.frama.io/peertube-plugin-livechat/documentation/user/streamers/.
Obecná doporučení Prosím, buďte ve svých formulacích vstřícní a respektujte kodex chování.`,description:"Přeložte zásuvný modul",tags:[],title:"Překládání",uri:"/peertube-plugin-livechat/cs/contributing/translate/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:` Varování This page describes experimental features. These features are available with the plugin version >= 7.2.0.
Introduction Peertube is part of the Fediverse. So Peertube video can be watched from other Peertube instances, and from various other softwares:
from a Mastodon (or other fediverse application) instance, from a mobile app (Fedilab, Tusky, …), from desktop fediverse app, … This livechat plugin is using well known standards, so it is possible to join chat rooms even when not viewing the video on Peertube.
There are basically 2 ways to join the chat room associated to a video:
opening a web page (with an url like https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535), using a XMPP client (and joining a room like xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join) Varování Joining the chat using a XMPP client is not always possible. It requires some DNS and server configuration. It will only be possible if instance’s admins have correctly setup the external XMPP clients connection feature.
Varování Don’t try to gues these url and connection methods yourself. Please report to next chapters.
Chat discovery Using ActivityPub The livechat plugin adds some data in Video ActivityPub objects, so that the chat can be discovered.
Info This requires Peertube >= 5.1
This follows the FEP-1970 recommendations.
Varování At the time of the writing, this FEP is in draft status, and the livechat plugin is a Proof-of-concept. Until the FEP is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
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
Varování At the time of the writing, this proposal is in draft status, and the livechat plugin is a Proof-of-concept. Until the proposal is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
Basically, the chat will be declared as tag under on the <podcast:liveItem> element.
By default, here is an example of what you will get:
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z"> <title>The video title</title> <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid> <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link> <podcast:socialInteract uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" protocol="activitypub" accountUrl="https://yourinstance.tld/a/youraccount" /> <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" /> <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true"> <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" /> </podcast:alternateEnclosure> <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" /> <podcast:chat server="yourinstance.tld" protocol="xmpp" embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" /> </podcast:liveItem>In case the instance has activated the external XMPP clients connection feature:
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z"> <title>The video title</title> <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid> <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link> <podcast:socialInteract uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" protocol="activitypub" accountUrl="https://yourinstance.tld/a/youraccount" /> <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" /> <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true"> <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" /> </podcast:alternateEnclosure> <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" /> <podcast:chat server="yourinstance.tld" protocol="xmpp" space="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld" embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" /> </podcast:liveItem>Algorithm If you want to display the chat in a web page or in an iframe, here is what you should do:
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub if there is no <podcast:chat> element under the <podcast:liveItem>, stop. loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and an embedUrl attribute if found, open this embedUrl If you want to open the chat room using the XMPP protocol:
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and a space attribute space should be an XMPP JID for a MUC if found, open this XMPP JID with your client after converting it to a join URI, or connect to the XMPP room at that address `,description:"Displaying the livechat with 3rd party software.",tags:[],title:"Third party",uri:"/peertube-plugin-livechat/cs/technical/thirdparty/index.html"},{breadcrumb:"Peertube livechat > Dokumentace",content:` SettingsPlugin Peertube Livechat settings
External AuthenticationPlugin Peertube Livechat settings - External Authentication
Prosody mod_firewallAdvanced firewall rules for the Prosody server
Advanced usageSome advanced features
XMPP clientsAllow connections using XMPP clients
Using MatterbridgeUsing Matterbridge to bridge with other chats`,description:"Plugin Peertube Livechat administration",tags:[],title:"Admin documentation",uri:"/peertube-plugin-livechat/cs/documentation/admin/index.html"},{breadcrumb:"Peertube livechat > Přispívání",content:"Nemusíte umět kódovat, abyste mohli začít přispívat do tohoto pluginu! Velmi cenné jsou i další příspěvky, mezi které patří: můžete testovat software a hlásit chyby, můžete poskytnout zpětnou vazbu, funkce, které vás zajímají, uživatelské rozhraní, design, …",description:"Poskytněte zpětnou vazbu",tags:[],title:"Poskytněte zpětnou vazbu",uri:"/peertube-plugin-livechat/cs/contributing/feedback/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Admin documentation",content:` Info Tato funkce je součástí pluginu livechat verze 11.0.0. You can enable mod_firewall on your Prosody server.
Doing so, Peertube admins will be able to define advanced firewall rules.
Varování These rules could be used to run arbitrary code on the server. If you are a hosting provider, and you don’t want to allow Peertube admins to write such rules, you can disable the online editing by creating a disable_mod_firewall_editing file in the plugin directory (plugins/data/peertube-plugin-livechat/disable_mod_firewall_editing). This is opt-out, as Peertube admins can already run arbitrary code just by installing any plugin. You can still use mod_firewall by editing files directly on the server.
Edit rules First, you must enable the feature in the plugin settings.
Just bellow the settings, you will find a “Configure mod_firewall” button. This button will open a configuration page.
Here you can add several configuration files.
You can enable/disable each files.
Files will be loaded in the alphabetical order. You can use a number as prefix to easily choose the order.
Info You can also edit these firewall rules directly on the server, in the plugins/data/peertube-plugin-livechat/prosody/mod_firewall_config/ directory. File names must only contains alphanumerical characters, underscores and hyphens. The extension must be .pfw, or .pfw.disabled if you want to disable a file. Please be sure that the peertube system user has write access to these files, else the web editing interface will fail. Once you have edited these files, you must reload prosody. This can be done by saving the plugin settings, or saving the mod_firewall configuration in the web interface, or by restarting Peertube.
When you save the configuration, the server will automatically reload it, and your rules will apply immediatly. You can check that there is no parsing error in the Prosody error log. To do so, you can read the plugins/data/peertube-plugin-livechat/prosody/prosody.err file, or use the diagnostic tool that will show last Prosody errors.
Examples Don’t hesitate to share your rules. To do so, you can for example edit this page.`,description:"Advanced firewall rules for the Prosody server",tags:[],title:"Prosody mod_firewall",uri:"/peertube-plugin-livechat/cs/documentation/admin/mod_firewall/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers > Chat bot",content:`Můžete nakonfigurovat několik časovačů, které budou odesílat zprávy v pravidelných intervalech. Tyto zprávy bude bot odesílat každých X minut. Můžete například nastavit, aby bot odesílal každých 5 minut nějaké informace o sponzorování.
Tip If there is no user in the chatroom, the bot won’t send any message.
Časovač Můžete nakonfigurovat několik časovačů, které budou odesílat zprávy v pravidelných intervalech. Tyto zprávy bude bot odesílat každých X minut. Můžete například nastavit, aby bot odesílal každých 5 minut nějaké informace o sponzorování.
Jedna zpráva na řádek. Pokud je zpráv více, vybere se jedna náhodně každých X minut.
Odeslat každých X minut Bot bude zprávu odesílat každých X minut.`,description:"The bot can send periodically some messages.",tags:[],title:"Timers",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/bot/quotes/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Admin documentation > Advanced usage",content:`This chat module is based on the XMPP protocol, also known as Jabber. It is therefore possible to connect to the chats using XMPP client software. This can for example be useful to facilitate moderation operations.
For the user documentation associated with these features, please refer to the user documentation page.
Info Enabling these features requires configuration changes on the server, and on the DNS records. It is not possible to configure this only from the Peertube interface, and it requires some basic system some basic system admin skills.
Login to your Peertube account Varování This feature is not yet available, and will come in a future version of the plugin.
Connection using an external XMPP account To enable this feature, you will need to set up your server and DNS records, so that XMPP clients can find and access the Prosody server that this plugin uses internally.
Plugin settings Start by going to the livechat plugin settings of your instance, then enable the setting “Enable connection to room using external XMPP accounts”. By checking this setting, new settings appear below.
First of all, the “Prosody server to server port” field. This one defaults to 5269, which is the standard port for this service. You can however change to another port, if this is already in use on your server.
Next, the field “Server to server network interfaces” field allows you to specify which network interfaces the server should listen on. The default value “*, ::” indicates to listen on all IP addresses. You can change these values, if you wish to listen on only certain IP addresses. The syntax is explained next to the setting.
For the “Certificate folder” setting, you can leave it empty. In this case, the plugin will automatically generate self-signed certificates. Some XMPP servers may refuse to connect, depending on their configuration. In this case, you can indicate here a path on the server, in which you must place certificates to be used by the module. It is up to you to generate and renew them. See bellow for more information.
Firewall You must open the configured port (5269 by default) on your firewall.
If you are using Docker for your Peertube, you need to modify the docker-compose.yml file to open port 5269 of the peertube container, so that the outer world can connect to it.
DNS You need to add DNS records allowing remote servers to find “room.your_instance.tld” and “external.your_instance.tld” components.
The easiest way to do this is to add SRV records for the “room” and “external” subdomain:
record name: _xmpp-server._tcp.room.your_instance.tld. (replace «your_instance.tld» by your instance uri)
TTL: 3600
class: IN
SRV: 0
priority: 0
weight: 5
port: 5269 (adapt if your changed the default port)
target: your_instance.tld. (replace by your instance uri)
record name: _xmpp-server._tcp.external.your_instance.tld. (replace «your_instance.tld» by your instance uri)
TTL: 3600
class: IN
SRV: 0
priority: 0
weight: 5
port: 5269 (adapt if your changed the default port)
target: your_instance.tld. (replace by your instance uri)
Be careful to keep the dot after “your_instance.tld”.
Using the dig command to check your records, you should get a result similar to this:
$ dig +short _xmpp-server._tcp.room.videos.john-livingston.fr. SRV 0 5 5269 videos.john-livingston.fr. $ dig +short _xmpp-server._tcp.external.videos.john-livingston.fr. SRV 0 5 5269 videos.john-livingston.fr.If you are not using the standard 5269 port, you must also add a SRV record for _xmpp-server._tcp.your_instance.tld. (same as above, just without the room. prefix). Of course, you can also add this record if you use the standard port. It will also work.
Using trusted certificates The self-signed certificates that this plugin uses by default can be rejected by some XMPP servers, for security reasons.
It is possible to use certificates validated by a certification authority. However, this requires advanced system administration knowledge. Indeed, due to the multitude of possible use cases, it is impossible to document all situations here. This documentation will therefore only explain the goal to be reached, and give an example which will only be suitable for a “basic” situation (manual installation of Peertube, using letsencrypt). If you are in another situation (Docker installation, certificates signed by another authority, etc…), you will have to adapt this approach by yourself.
Basic principle It is up to you to generate valid certificates for domains your_instance.tld and room.your_instance.tld. You can use any method supported by Prosody.
You must then place these certificates in a folder that will be accessible to the peertube user, and specify this folder in the plugin setting “Certificate folder”.
Tip If you want to use the ProsodyCtl utility to import certificates, this utility is available (once Peertube is started) using the following command (adapting the path to your Peertube data folder, and replacing “xxx” with the arguments you wish to pass to prosodyctl): sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua xxx
The plugin will check once a day to see if any files have been modified in this folder, and reload Prosody if necessary.
Method for the simple case We assume here that your Peertube installation is “classic” (no use of Docker), and that the certificates are generated by letsencrypt, using the certbot tool.
First of all, we’ll have to create a certificate for the subdomain room.your_instance.tld : this is the uri of the MUC (XMPP chat rooms) component. Even if the connections are made on your_instance.tld, we will need a valid certificate for this subdomain.
So start by setting up a DNS entry for room.your_instance.tld, which points to your server. You can use a CNAME entry (or an A entry and a AAAA entry).
Next, we’ll use nginx (already installed for your Peertube) to generate the certbot certificate. We will create a new site. In the file /etc/nginx/site-available/room.peertube, add:
server { listen 80; listen [::]:80; server_name room.your_instance.tld; location /.well-known/acme-challenge/ { default_type "text/plain"; root /var/www/certbot; } location / { return 301 https://your_instance.tld; } }Then enable the site:
ln -s /etc/nginx/sites-available/room.peertube /etc/nginx/sites-enabled/ systemc reload nginxThen we prepare the folder in which we will later import the certificates. We assume here that you already have the plugin active. We will create the following folder (if it doesn’t already exist), with the user peertube to make sure there are no permissions issues:
sudo -u peertube mkdir /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/certsNow you have to configure this folder in the plugin settings, for the parameter “Certificate folders”. It’s important to do this now, otherwise the certificate import script will put the certificates in the wrong folder.
We will configure certbot to import the generated certificates into the Prosody folder. We can use the ProsodyCtl utility packaged in the plugin.
Note: for it to be available, the plugin must have been started at least once.
We will create a file /etc/letsencrypt/renewal-hooks/deploy/prosody.sh containing:
#!/bin/sh /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl \\ --root \\ --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ cert import \\ room.your_instance.tld your_instance.tld /etc/letsencrypt/liveThen we ask to generate the certificate:
certbot -d room.videos.john-livingston.frIf certbot offers you several methods to generate the certificate, choose “nginx”.
Normally you should now find the certificates in the configured folder.
Note: the first time you do this, you will have to reload Prosody. The easiest way to do this is to restart Peertube.
Method for the Docker case This method works with the officially supported Docker guide from PeerTube.
First, ensure you create a DNS entry for room.your_instance.tld, which points to your server. You can use a CNAME entry (or an A entry and a AAAA entry). This is necessary for Let’s Encrypt to validate the domain for certificate generation.
Enter the directory where your docker-compose.yml file exists.
Open a shell in the certbot container:
docker exec -it certbot /bin/shRun certbot:
certbotYou will be presented with a series of prompts. Enter 2 for the authentication type:
How would you like to authenticate with the ACME CA? Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2Enter the domain name room.your_instance.tld:
Please enter the domain name(s) you would like on your certificate (comma and/or space separated) (Enter 'c' to cancel): room.your_instance.tldEnter the directory where the PeerTube webserver serves requests for Let’s Encrypt, /var/www/certbot:
Input the webroot for <room.your_instance.tld>: (Enter 'c' to cancel): /var/www/certbotYou should see output like the following:
Successfully received certificate. Certificate is saved at: /etc/letsencrypt/live/room.your_instance.tld/fullchain.pem Key is saved at: /etc/letsencrypt/live/room.your_instance.tld/privkey.pemRun the below command inside the certbot container to give read access to the new certs and private keys to the peertube group. Note: This will also make the files readable to the group with id 999 on the host system. Check the groups on your system to assess this as a risk before running this command.
chown -R root:999 /etc/letsencrypt/live; \\ chmod 750 /etc/letsencrypt/live; \\ chown -R root:999 /etc/letsencrypt/archive; \\ chmod 750 /etc/letsencrypt/archive; \\ find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} \\;Exit the certbot container:
exitModify your docker-compose.yml file, changing the entrypoint line under the certbot service to the following. This is the same as the above, but to be automatically executed after every certificate renewal.
entrypoint: /bin/sh -c "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot; chown -R root:999 /etc/letsencrypt/live; chmod 750 /etc/letsencrypt/live; chown -R root:999 /etc/letsencrypt/archive; chmod 750 /etc/letsencrypt/archive; find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} +; sleep 12h & wait $\${!}; done;"Continuing to modify docker-compose.yml, add the certbot certificate volume into the peertube container. It should look something like this:
volumes: - ./docker-volume/certbot/conf:/etc/letsencryptRestart your services:
docker-compose down; docker-comopse up -dIn the livechat plugin settings from your PeerTube administration settings, set the certificate directory to the following:
/etc/letsencrypt/liveSave the plugin settings and verify Prosody can see the certificates:
docker-compose exec -u peertube \\ peertube \\ /data/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun \\ prosodyctl \\ --config /data/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ check certsTroubleshooting If you can’t make it work, you can use the diagnostic tool (there is a button on top of the plugin settings page), and take a close look on the «Prosody check» section.`,description:"Allow connections using XMPP clients",tags:[],title:"XMPP clients",uri:"/peertube-plugin-livechat/cs/documentation/admin/advanced/xmpp_clients/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Admin documentation",content:` XMPP clientsAllow connections using XMPP clients
Using MatterbridgeUsing Matterbridge to bridge with other chats`,description:"Some advanced features",tags:[],title:"Advanced usage",uri:"/peertube-plugin-livechat/cs/documentation/admin/advanced/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers > Chat bot",content:`Bota můžete nakonfigurovat tak, aby reagoval na příkazy. Příkaz je zpráva začínající znakem “!”, například “!help”, která vyvolá příkaz “help”.
You can setup several commands.
Příkaz Příkaz bez počátečního “!”. Například “help”, “sponzor”, …
Zpráva Zpráva k odeslání.`,description:"The bot can respond to several commands.",tags:[],title:"Commands",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/bot/commands/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation",content:`OBS is a popular Free And Open Source streaming software, with advanced capacities for your live streams. In the current page, you will find some advices to handle your live chats using OBS.
OBS Overlay You can easily include the chat in your video stream.
You can use the “Sdílet odkaz na chat” feature to generate an URL to your chat. This button should be near the chat if you are the video owner (unless it was desactivated by your server admins).
Check the “Pouze pro čtení” checkbox in the modal.
Then use this link as a “web browser source” in OBS.
You can use the “Průhledné pozadí (pro integraci streamu, například s OBS)” option to have a transparent background in OBS. If you want to customize the background transparency, you can add this CSS in your OBS browser source’s settings:
:root { --livechat-transparent: rgba(255 255 255 / 90%) !important; } In the previous CSS snippet, you can of course change the color or the transparency, by adapting the color values.
Note: you can entirely customize chat colors. This is undocumented yet, but you can try this: in the modal, check «use curent theme colors», then you can try to manually change color values in the URL. You must use valid CSS color values, and they must be properly URL encoded.
OBS Dock Info Tato funkce je součástí pluginu livechat verze 10.1.0. Varování This feature can be disabled by the instance’s adminitrators.
You can use OBS “Custom browser docks” to integrate the chat in your OBS while you are streaming. The livechat plugin offers a way to create long term token that can identify you automatically to join the chat, so you don’t have to enter your password in OBS.
To do so, just use the “Sdílet odkaz na chat” feature, and open the “Dock” tab. From there, you can create a new token using the “+” button.
Then, copy the url, and use the “Docks / Custom browser docks” menu from your OBS to add a dock with this URL.
Once you have done, you will have a new dock connected to the chat with your account.
Tip Tokens are valid to join any chat room. You don’t have to generate separate tokens for each of your rooms. You can also customize the nickame that will be used by changing the n parameter in the url.
Don’t share these links to anyone, as it would allow them to connect as yourself.
If a token is compromised, or no more needed, you can revoke them.
Info These tokens can be used for other purposes, as connecting to your account with XMPP bots or clients. This feature is not documented yet, and not officially supported. So use with care.
Mixing multiple chats in your live stream You can use the social_stream browser extension to mix multiple chat source (from Peertube, Twitch, Youtube, Facebook, …) and include their contents in your live stream. The compatibility with this plugin was added in recent versions.`,description:"Documentation to stream the chat content using OBS.",tags:[],title:"OBS",uri:"/peertube-plugin-livechat/cs/documentation/user/obs/index.html"},{breadcrumb:"Peertube livechat > Přispívání",content:`Vždy mluvte o funkcích, které chcete vyvinout, tím, že vytvoříte/najdete a okomentujete problém, který řeší váš problém, než na něm začnete pracovat, a informujte komunitu o tom, že začínáte kódovat tím, že problém prohlásíte za problém.
Žádost o stažení musí být provedena na větvi main.
Poznámka Do března 2023 byly příspěvky prováděny na větvi develop. Tento postup je nyní zastaralý.
Předpoklad pro vytvoření tohoto zásuvného modulu Doporučujeme seznámit se s následujícími pojmy:
Git NodeJS NPM Typescript Pro sestavení pluginu musíte mít následující balíčky:
git npm (>=8.x) nodejs (>=14.x) build-essential coreutils wget reuse Upozorňujeme, že tento zásuvný modul potřebuje pro server Prosody XMPP obrázek aplikace. Tento AppImage poskytuje vedlejší projekt Prosody AppImage. Skript build-prosody.sh stáhne binární soubory připojené k tomuto vzdálenému úložišti a zkontroluje, zda je jejich hashsum sha256 správný.
Vývoj Klonujte úložiště, vytvořte zásuvný modul a vytvořte větev kódu:
# Klonování úložiště. Nezapomeňte na --recursive pro klonování podmodulů. git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git --recursive cd peertube-plugin-livechat # Nainstalujte závislosti NPM a poprvé sestavte modul: Npm install # Sestavte zásuvný modul po úpravě: npm run build # Pokud máte fork z repozitáře, přidejte jej jako vzdálený (příklad): git remote add me git@github.com:MY_GITHUB_ACCOUNT/peertube-plugin-livechat.git # Vytvořte místní větev pro svůj vývoj a zkontrolujteji (příklad): git checkout my_development # Poznámka: pokud je přidružena nějaká záležitost, použijte jako název větve fix_1234 (kde 1234 je číslo issue). # Chcete-li navrhnout své úpravy, odešlete svou větev do úložiště (příklad): git push --set-upstream me my_development # Poté přejděte do svého úložiště github pomocí webového prohlížeče a navrhněte žádost o stažení (viz další pokyny níže).Jakmile jste připraveni ukázat svůj kód a požádat o zpětnou vazbu, odešlete návrh žádosti o stažení. Jakmile jste připraveni na kontrolu kódu před sloučením, odešlete žádost o stažení. V každém případě prosíme o propojení vašeho PR s problémy, které řeší, pomocí syntaxe GitHubu: “fixes #issue_number”.
Kód front-endu je ve složce client, kód back-endu ve složce server. Ve složce shared je několik sdílených kódů.
Obecné pokyny (vývoj zásuvných modulů, sestavení, instalace, …) naleznete v dokumentaci Peertube.
Zásuvný modul můžete sestavit s dalšími funkcemi ladění jednoduše pomocí:
NODE_ENV=dev npm run buildTento zásuvný modul je v souladu s REUSE: používá hlavičky SPDX k identifikaci licenčních informací svého zdrojového kódu. Více informací naleznete na webových stránkách REUSE. K aktualizaci hlaviček můžete použít nástroj příkazového řádku reuse. Příkaz npm run lint použije ke kontrole shody příkaz reuse. Nezapomeňte do hlaviček SPDX přidat informace o autorských právech, když upravujete nějaký kód.
ESBuild vs Typescript Tento zásuvný modul používá ESBuild pro generování frontend kódu, stejně jako oficiální zásuvný modul peertube-plugin-quickstart. ESBuild si poradí s Typescriptem, ale nekontroluje typy (viz dokumentace ESBuild). Proto nejprve zkompilujeme Typescript s volbou -noEmit, jen abychom zkontrolovali typy (check:client:ts v souboru package.json). Pokud je vše v pořádku, spustíme ESBuild a vygenerujeme zkompilovaný javascript.
Režim ladění Pro tento zásuvný modul existuje režim ladění, který zkracuje určité zpoždění. Například některé soubory protokolu se budou otáčet každé dvě minuty místo jednou denně. To umožňuje snadněji testovat některé akce, na které by se normálně čekalo hodiny nebo dny.
Pro zapnutí tohoto režimu stačí vytvořit soubor /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/debug_mode (nahradit /var/www/peertube/storage/ správnou cestou ve vaší instalaci).
Ke spuštění režimu ladění stačí pouhá existence tohoto souboru. Chcete-li se ujistit, že je brán v úvahu, můžete restartovat instanci Peertube.
Tento soubor může obsahovat některé JSON, které umožňují pokročilejší možnosti. Seznam existujících parametrů naleznete v souboru server/lib/debug.ts. Po každé úpravě obsahu restartujte Peertube.
Varování Tento režim nepovolujte na produkčním serveru, ani na veřejném serveru. Mohlo by to způsobit bezpečnostní problémy.
Restart Prosody Když je povolen režim ladění, můžete pomocí tohoto volání API restartovat aplikaci Prosody: http://your_instance.tld/plugins/livechat/router/api/restart_prosody. Toto volání nepotřebuje žádné ověření. Lze jej provést z příkazového řádku, například pomocí příkazu curl http://your_instance.tld/plugins/livechat/router/api/restart_prosody.
Prosody debugger Prosody AppImage je možné připojit ke vzdálenému debuggeru pomocí MobDebug.
Chcete-li tak učinit, musíte nastavit MobDebug ve složce, ke které má přístup uživatel peertube. Pak to přidejte do souboru debub_mode:
{ "debug_prosody": { "debugger_path": "/the_path_to_mobdebug/src", "host": "localhost", "port": "8172" } }host a port jsou volitelné. debugger_path musí ukazovat na složku, kde je soubor .lua MobDebug.
Restartujte Peertube.
Spusťte svůj ladicí server.
Aby se Prosody připojil k debuggeru, zavolejte API http://your_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true. Tento hovor nevyžaduje žádné ověření. Lze to provést z příkazového řádku, například pomocí curl http://your_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true. Můžete dokonce nakonfigurovat svůj ladicí server tak, aby tento požadavek spouštěl automaticky.
Prosody se poté restartuje a připojí se k debuggeru.
Rychlé vývojářské prostředí pomocí Dockeru Na [fóru Peertube] je výukový program ve francouzštině (https://framacolibri.org/t/tutoriel-creer-un-environnement-de-developpement-de-plugin-peertube-rapidement-en-utilisant-docker -et-qui-permet-de-tester-la-federation/17631), který vysvětluje, jak rychle vytvořit prostředí pro vývojáře pomocí Docker.
Bylo z toho vytvořeno repo, podívejte se na pt-plugin-dev.
Poznámka: Z neznámého důvodu nemůže Prosody rozlišit adresy DNS kontejnerů při použití knihovny lua-unbound. V pluginu je špinavý hack: stačí vytvořit soubor /data/plugins/data/peertube-plugin-livechat/no_lua_unbound ve vašem docker-volume a restartovat kontejnery.
Rychle znovu sestavte a nainstalujte plugin Když provádíte úpravy, nemusíte vždy znovu sestavovat celý projekt a znovu instalovat plugin do vašeho vývojového prostředí. Můžete sestavit pouze upravenou součást (pokud jste například upravili pouze soubory klienta: npm spustit build:client). V souborech package.json vyhledejte dostupné skripty sestavení.
Pokud je zásuvný modul již nainstalován v instanci dev a nezměnili jste žádnou závislost, můžete rychle nainstalovat svou práci podle následujících kroků:
znovu sestavit potřebné části zásuvného modulu (klient, styly, …), přepište obsah složky data/plugins/node_modules/peertube-plugin-livechat/dist/ ve své instanci dev obsahem složky dist pluginu, změňte rekurzivně vlastníka souborů plugins/node_modules/peertube-plugin-livechat/dist/ na svého uživatele peertube, restartujte instanci. Výkonnostní testy Úložiště livechat-perf-test obsahuje několik nástrojů pro provádění testů výkonu. Lze je použít k vyhodnocení vylepšení kódu nebo k nalezení úzkých míst.`,description:"Vývoj",tags:[],title:"Vývoj",uri:"/peertube-plugin-livechat/cs/contributing/develop/index.html"},{breadcrumb:"Peertube livechat > Přispívání",content:`Základní informace Před zahájením práce vždy informujte komunitu (vytvořením nového problému nebo komentářem k již existujícímu problému). Tím se vyhnete tomu, aby dvě osoby pracovaly na stejné věci, a předejdete konfliktům.
Práce na dokumentaci musí být začleněna do větve main.
Zdrojový kód dokumentace se nachází ve složce support/documentation/content.
Dokumentace je generována pomocí Hugo. Pokud si chcete svou práci prohlédnout, musíte si ji nainstalovat do počítače.
Minimální požadovaná verze pro Hugo je 0.121.0. Testováno bylo s verzí 0.132.2.
Použitý motiv je hugo-theme-relearn. Než začnete upravovat dokumentaci, měli byste si přečíst jeho dokumentaci.
Při vydání nové verze zásuvného modulu nebo při aktualizaci dokumentace správci zásuvných modulů sloučí větev main do větve documentation. Tím se spustí pipelines github a gitlab a aktualizuje se zveřejněná dokumentace.
Překlady Základním jazykem je angličtina (kód en).
Složka support/documentation/content/en obsahuje pouze anglické dokumentační soubory.
Dokumentace je přeložena pomocí Weblate (viz translation documentation). K tomu používáme nástroj po4a, jak uvidíme dále na této stránce.
Přidání nového jazyka V souboru support/documentation/config.toml zkopírujte a upravte část [Languages.fr].
Pokud překlady nejsou kompletní, nevadí, pro chybějící řetězce se použije angličtina.
Náhled Chcete-li zobrazit náhled úprav, spusťte:
hugo serve -s support/documentation/ Poté otevřete prohlížeč na adrese http://localhost:1313/peertube-plugin-livechat/. Tato stránka se automaticky obnoví při každé změně.
Aktualizace lokalizačních souborů a generování překladů dokumentace Prozatím máte k dispozici pouze anglickou verzi. Chcete-li aktualizovat dokumentační řetězce a generovat překlady, musíte spustit skript doc-translate.sh.
Za tímto účelem se ujistěte, že máte v počítači nainstalován program po4a (verze >= 0.69).
Varování Některé linuxové distribuce (například Debian Bullseye) mají příliš starou verzi po4a. Ujistěte se, že jste nainstalovali kompatibilní verzi. Pokud používáte například Debian Bullseye, můžete si stáhnout soubor Bookworm po4a.deb z https://packages.debian.org a nainstalovat jej ručně.
Pro zpracování překladů stačí provést:
npm run doc:translate Výsledek si pak můžete prohlédnout pomocí příkazu hugo serve -s support/documentation/ a pomocí voliče jazyka.
Psaní dokumentace Stačí upravit anglické soubory v support/documentation/content/en.
Před odevzdáním pak vždy spusťte npm run doc:translate, aby se změny v českých souborech mohly promítnout do souboru support/documentation/po/livechat.en.pot.
Pro použití aplikačních řetězců můžete použít zkrácený kód livechat_label. Viz zde: Překlad dokumentace.
Je možné zabránit překladu souboru pomocí livechatnotranslation: true v sekci Yaml Font Matter. Viz zde: Překlad dokumentace.
Pro technickou dokumentaci použijte možnost livechatnotranslation. Nechceme, aby byla technická dokumentace překládána, abychom se vyhnuli problémům kvůli špatnému překladu.
Abyste překladatelům usnadnili práci, vyhněte se příliš dlouhým odstavcům.
Prozatím není možné používat tabulky Markdown: překladatelské nástroje je rozbijí.
Varování Odkazy na tuto dokumentaci mohou být k dispozici i jinde na webu. Snažte se neměnit URL adresy stránek dokumentace. Nebo alespoň umístěte odkazy na nové umístění na předchozí url.
Když je vydána nová funkce, můžete použít krátký kód livechat_version_notice pro zobrazení infoboxu s verzí, ve které je funkce dostupná. Tento krátký kód bere jako parametr číslo verze. Zde je příklad:
Info Tato funkce je součástí pluginu livechat verze 12.0.0. Co když nemohu používat hugo a/nebo po4a? Stačí upravit anglické soubory markdown a při zadávání žádosti o stažení zadat, že nelze vytvářet překlady.
Zveřejnění Zveřejnění dokumentace je automatické, jakmile jsou změny začleněny do větve documentation.`,description:"Zdokumentujte zásuvný modul nebo přeložte dokumentaci.",tags:[],title:"Dokumentace",uri:"/peertube-plugin-livechat/cs/contributing/document/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin stores some data on the server, in the /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/ folder. This page describes these data.
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
emojis/channel/1/definition.json: the JSON file containing the emojis definitions emojis/channel/1/files/42.png: N image files (png, jpg, …), using numbers as filenames. tokens The tokens folder contains long term token to connect to the chat. See the LivechatProsodyAuth class for more information.`,description:"Data files and folders used on the server",tags:[],title:"Plugin storage",uri:"/peertube-plugin-livechat/cs/technical/data/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Installation guide",content:`IMPORTANT NOTE Since version v6.0.0, this plugin does not need any Prosody installation.
If you were using this plugin before this version, and if you had installed Prosody manually, you can safely uninstall Prosody.
If you were using the custom Peertube docker image that is embedding Prosody, you can switch back to the official Peertube image.`,description:"Important notes when upgrading for an older version.",tags:[],title:"Upgrade from version older than 6.0.0",uri:"/peertube-plugin-livechat/cs/documentation/installation/upgrade_before_6.0.0/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > Admin documentation > Advanced usage",content:`The following is based on a tutorial to use Matterbridge with the plugin: Matterbridge + Peertube
Requirements PeerTube plugin livechat version 3.2.0 or later. Matterbridge version 1.22.4 or later. The easiest is if the PeerTube instance and Matterbridge run on the same server.
Internal connections only (basic) You will need to enable Povolení připojení klienta k serveru in the livechat plugin settings.
This will allow localhost XMPP clients to connect to the Prosody XMPP server.
You may need to add some line to your /etc/hosts:
127.0.0.1 anon.example.org room.example.org Replace example.org by your actual instance domain name. Afterwards you can continue with the Matterbridge configuration below.
Allow external connections (advanced) By default, the internal Prosody XMPP server only listens on localhost (127.0.0.1).
On livechat versions >= 10.1.0 a new option call Client to server network interfaces was added to allow changing this.
It allows to add a list of IPs to listen on, coma separated (spaces will be stripped).
You can also use * to listen on all IPv4 interfaces, and :: for all IPv6. Doing so allows external access to the client to server interface.
Then you need to open the C2S port (by default 52822, but check the plugin settings to get the current value) in your firewall so that it can be reached from the internet. If you don’t want to use C2S connections for anything else than your Matterbridge service, you should restrict access to this port to your Matterbridge server IP.
You also need to add DNS records (A and AAAA) for anon.example.org and room.example.org (replace example.org by your actual domain name).
In case you are using a port other than 5222 (XMPP standard port) you also need to set the xmpp-client SRV record to the correct port.
Configurating Matterbridge In the version 1.22.4, Matterbridge added support for XMPP anonymous connections needed to connect to the built-in prosody.
So in the TOML config file put:
[xmpp.mypeertube] Anonymous=true Server="anon.example.org:52822" Muc="room.example.org" Nick="Matterbridge" RemoteNickFormat="[{PROTOCOL}] <{NICK}> " NoTLS=true Replace example.org by your actual instance domain name. Replace 52822 by the actual port if you changed it. mypeertube can be replaced by another name. Using peertube as the Nick will provide put PeerTube icon for overlay messages, can be also done with overlay config modification. The setting NoTLS=true allows connecting to a server with self-signed certificates. Now you can add this account to gateways and bridge specific live-chat channels.
Info This documentation use an anonymous account to connect the bridge to the chat. But since the livechat v10.1.0, there is a new way to generate long term authentication token, that allows to connect using your account. This is used for OBS docks. Using this feature for other purposes is not documented and not officially supported yet. If you want to use it anyway, you can request a token by calling then /plugins/livechat/router/api/auth/tokens endpoint. To get needed headers and request body, just check what happens when you generate a new token for OBS docks.`,description:"Using Matterbridge to bridge with other chats",tags:[],title:"Using Matterbridge",uri:"/peertube-plugin-livechat/cs/documentation/admin/advanced/matterbridge/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a “slow mode” feature, to rate limit the number of messages that a user can send to a given MUC room. At time of writing, there were no XEP to describe such feature. Please find below a XEP draft, that will be submitted for review.
Varování Work In Progress, this page is not done yet. For an updated version of this document, you can check the draft XEP XMP file.
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
Appendix F: Requirements Conformance The following requirements keywords as used in this document are to be interpreted as described in RFC 2119: “MUST”, “SHALL”, “REQUIRED”; “MUST NOT”, “SHALL NOT”; “SHOULD”, “RECOMMENDED”; “SHOULD NOT”, “NOT RECOMMENDED”; “MAY”, “OPTIONAL”.`,description:"MUC Slow mode XEP",tags:[],title:"MUC Slow mode",uri:"/peertube-plugin-livechat/cs/technical/slow_mode/index.html"},{breadcrumb:"Peertube livechat",content:`Máte zájem přispět? Skvělé!
Kodex chováníKodex chování smluvních partnerů
PřekládáníPřeložte zásuvný modul
Poskytněte zpětnou vazbuPoskytněte zpětnou vazbu
VývojVývoj
DokumentaceZdokumentujte zásuvný modul nebo přeložte dokumentaci.`,description:"Přispívání",tags:[],title:"Přispívání",uri:"/peertube-plugin-livechat/cs/contributing/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation",content:`This chat plugin relies on the XMPP protocol (also known as Jabber). It is therefore possible to connect to the chats using XMPP client software. This can be useful for example to facilitate moderation operations.
Info The features described on this page must be enabled and configured by your Peertube instance’s administrators. You may therefore not have access to them.
Login to your Peertube account Varování This feature is not yet available, and will come in a future version of the plugin.
Connection using an external XMPP account If this feature is enabled on your instance, you can connect to Peertube chats using any XMPP account.
To get the address of the room you want to join, you can use the “share chat” button that is located above the chat:
Info By default, the share button is only visible to the owner of the video, and the admins/moderators of the instance. However, admins can decide to display this button for everyone.
Then, choose “Připojení pomocí XMPP”:
Then you just have to click on “open” or copy/paste the address of the chat room into your XMPP client (using the “join a room” feature).`,description:"Connect to chat using a XMPP client",tags:[],title:"XMPP Clients",uri:"/peertube-plugin-livechat/cs/documentation/user/xmpp_clients/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The poll system relies on two thinks:
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
As the backend does no localization, it also translate on the fly the english sentences coming from the backend (in the form definition, in poll start/end message, and in bounce/error messages).`,description:"Polls technical documentation",tags:[],title:"Polls",uri:"/peertube-plugin-livechat/cs/technical/polls/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`You can set terms & conditions on the instance level (called “global terms”), or at the streamers’ channels level (called “muc terms”, as it is related to muc rooms).
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
if terms are modified if the user switch to another channel if the user switch to a video from a different peertube instance `,description:"Terms&Conditions implementation",tags:[],title:"Terms&Conditions",uri:"/peertube-plugin-livechat/cs/technical/terms/index.html"},{breadcrumb:"Peertube livechat",content:`If you have new feature requests, bugs, or difficulties to setup the plugin, you can use the Github issue tracker. If possible, try using english or french.
To have a glimpse to the roadmap for upcoming features, please refer to:
this github project. the milestones on github. If you are a webdesigner or a ConverseJS/Prosody/XMPP expert, and want to help improve this plugin, you are welcome.`,description:"Bug tracking / New features requests",tags:[],title:"Bug tracking & new features",uri:"/peertube-plugin-livechat/cs/issues/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a Task Application. The present document describes how this is implemented.
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
Task lists Item tag: tasklist XML Namespace: urn:peertube-plugin-livechat:tasklist item childs: name: the text content is the task list name Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="45cf7543-67bf-4d03-bb5d-a55038a0512a:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <tasklist xmlns="urn:peertube-plugin-livechat:tasklist"> <name>Task List Name</name> </tasklist> </item> </publish> </pubsub> </iq>Tasks Item tag: task XML Namespace: urn:peertube-plugin-livechat:task item attributes: done: if present and equal to “true”, means that the task is done list: the list id order: the order of the task in the task list item childs: name: the text content is the task name description: the text content is the task description Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="9fd9a162-1b6c-4b38-a2a1-2485b34f0d8d:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <task list="8302c024-c16e-4fbd-aca7-c94cdb2025de" order="0" done="true" xmlns="urn:peertube-plugin-livechat:task" > <name>The task name</name> <description>here is the description</description> </task> </item> </publish> </pubsub> </iq>Note: in the above example, we added done="true" just for the example. Don’t add the attribute if you want not the task to be marked as done (or if you want to undone the task).`,description:"Task Application technical overview",tags:[],title:"Tasks overview",uri:"/peertube-plugin-livechat/cs/technical/tasks/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a Moderation Notes Application. The present document describes how this is implemented.
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
<iq from="user@example.com" id="64da7e38-4dd5-4f55-b46f-297232232971:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client"> <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-notes"> <item id="8ab78df9-a7b9-4315-943d-c340935482af"> <note order="11" xmlns="urn:peertube-plugin-livechat:note" > <description>Some text.</description> <note-about jid="khkecy3nkddwxdllgzdub-dv@anon.p1.localhost" nick="Mickey" > <occupant-id id="ga4mR2IKEvRKuzN1gJYVafCTbY1gNvgNvNReqdVKexI=" xmlns="urn:xmpp:occupant-id:0" /> </note-about> </note> </item> </publish> </pubsub> </iq>`,description:"Moderator Notes Application technical overview",tags:[],title:"Moderator notes overview",uri:"/peertube-plugin-livechat/cs/technical/moderation_notes/index.html"},{breadcrumb:"Peertube livechat",content:` Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
PollsPolls technical documentation
Terms&ConditionsTerms&Conditions implementation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview`,description:"Technical documentation",tags:[],title:"Technical documentation",uri:"/peertube-plugin-livechat/cs/technical/index.html"},{breadcrumb:"Peertube livechat",content:`Máte-li jakékoli dotazy nebo chcete-li si o tomto zásuvném modulu promluvit, můžete se připojit k této místnosti XMPP pomocí libovolného klienta Jabber: plugin-livechat-support@room.im.yiny.org.
Pokud chcete projekt finančně podpořit, můžete mě kontaktovat na e-mailové adrese git.[at].john-livingston.fr nebo se podívejte na můj Liberapay profil.`,description:"Kontakt na autora",tags:[],title:"Kontaktujte mě",uri:"/peertube-plugin-livechat/cs/contact/index.html"},{breadcrumb:"Peertube livechat",content:`package.json, COPYRIGHT and LICENSE files contain the license information for this software and its dependencies.
The plugin is maintained by John Livingston.
Thanks to David Revoy for his work on Peertube’s mascot, Sepia. The character design is under CC-By licence, and the SVG files used to create some logo and avatars in this plugin are GPLv3.0. PNG files are under CC-By licences, and comes from the online Sepia Avatar Generator.
Thanks to Framasoft for making Peertube possible, for the financial support, and for hosting the project translations on their Weblate instance.
Thanks to ritimo for the financial support.
Thanks to Code Lutin and Rétribution Copie Publique for the financial support.
Thanks to NlNet and the NGI0 Entrust fund for the financial support.
Thanks to Octopuce for the financial support.
And thanks to all individual contributors who have made a donation via my liberapay page.`,description:"Kredity zásuvných modulů",tags:[],title:"Credits",uri:"/peertube-plugin-livechat/cs/credits/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:`Enabling the chat for you live streams Varování Instance administrators can choose to disable or enable chat in specific cases. Information in this section are only true in the default case.
When you create or modify a Peertube live, there is a “plugin settings” tab:
In the “plugin settings” tab, there is a “Použití chatu” checkbox. Just check or uncheck it to enable or disable the chat associated to your video.
Tip There can be other settings in this tab, depending on plugins installed on your Peertube instance.
Per channel chat On the instance level, Peertube’s administrators can choose if chat rooms are unique per video, or if there will be an unique chat room per channel. Please contact your instance’s administrators for more information on how they configure the livechat plugin.
Share the chat On top of the chat, there is a “Sdílet odkaz na chat” button.
This button opens a popup, where you can obtain an url to join the chat. This url can be shared.
The “Vložit” tab provide some links to embed the chat in websites, or in your live stream.
You can customize some options:
Pouze pro čtení: you will only be able to read the chat, not write. This is useful to include the chat content in your live stream (see the OBS documentation). Použít aktuální barvy motivu: if checked, your current theme colors will be added to the url, so that any user that opens the link will have the same color set. Vytvoření iframe pro vložení chatu do webové stránky: instead of an url, you will obtain an HTML snippet that you can add to your website to embed the chat. For more information on the “Dock” tab, check the OBS documentation.
In the “Web” tab, the provided url opens the chat in the Peertube interface. You can share this link to other users to invite them to join the chat.
The “Sdílet odkaz na chat” popup can also contain a “Připojení pomocí XMPP” tab. This will only be available if your instance’s administators have enabled an correctly configured this option. Using this option, you can provide a link to join the chat using any XMPP client software. Using such softwares can for example facilitate moderation actions.
Moderation Please refer to the moderation documentation.
Include the chat in your video stream Please refer to the OBS documentation.
Chat persistence By default, the chat is persistent. This means that the room content will be kept for a while. User joining will see messages posted before their arrival.
You can change the persistence behaviour. Open the chat dropdown menu, and click on “Configure”.
There are several options that can be changed.
You can for example set the default and maximum number of messages to return to 0, so that new incomers won’t see any previously sent message.
You can also uncheck “enable archiving”: if unchecked, messages will be pruned if the server restarts.
By unchecking “Persistent”, the room will be cleared if there is no more participant.
Delete the chat content If you want to delete the chat content, open the chat dropdown menu, then click on “Destroy”. A popup will open, asking a confirmation.
The chat will be automatically recreated each time someone tries to join it as long as the video exists, and has the “Použití chatu” feature activated.`,description:"Some basics about how to setup and use the chat for your live stream",tags:[],title:"Some basics",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/basics/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation",content:` Some basicsSome basics about how to setup and use the chat for your live stream
Channel configurationPeertube channel chatrooms configuration
AnnouncementsRoom owners and administrators can send special announcements in the chat.
ModerationPlugin peertube-plugin-livechat advanced moderation features
Terms & conditionsConfigure channel's chat terms & conditions
Slow modePlugin peertube-plugin-livechat slow mode
Moderation delayPlugin peertube-plugin-livechat moderation delay
Custom emojisPlugin peertube-plugin-livechat custom emojis
Emojis only modePlugin peertube-plugin-livechat emojis only mode
PollsYou can create polls to ask viewers their opinion
Tasks / To-do listsYou can handle tasks and task lists with your moderation team.
Moderation notesPlugin peertube-plugin-livechat moderation notes
Chat botChat bot setup
Special charactersThe bot can automatically moderate messages containing too many special characters.
No duplicate messageThe bot can automatically moderate duplicate messages.
Forbidden wordsThe bot can automatically moderate messages containing forbidden words.
TimersThe bot can send periodically some messages.
CommandsThe bot can respond to several commands.`,description:"How to setup the chat for your live stream",tags:[],title:"For streamers",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info This feature comes with the livechat plugin version 8.0.0, and can be disabled by your instance’s admins.
In the Peertube left menu, there is a “Chatovací místnosti” entry:
This “Chatovací místnosti” link takes you to a list of your channels. By clicking on a channel, you will then be able to setup some options for your channels:
Here you can configure:
Podmínky chatu kanálu Ztlumit anonymní uživatele default value The slow mode The chat bot Custom emojis More features to come… `,description:"Peertube channel chatrooms configuration",tags:[],title:"Channel configuration",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/channel/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 12.0.0. Room owners and administrators can send special announcements in the chat.
These messages will be more visible than standard messages.
To send announcements, owners and administrators will have a “Typ zprávy” selector on the top of the message field:
There are several message types:
Standardní: to send a standard message. Zvýrazněná: these messages will simply be highlighted in a blue box. Oznámení: these messages will be in a green box, and a bold “Oznámení” title will be added. Upozornění: these messages will be in a rend box, and a bold “Oznámení” title will be added. Info User that are not owner or administrator of the chatroom can’t send such messages.
Varování Note: Standards XMPP clients will display announcements as standard messages.`,description:"Room owners and administrators can send special announcements in the chat.",tags:[],title:"Announcements",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/announcements/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Varování This section is still incomplete.
Varování This page describes the behaviour of livechat versions >= 10.0.0. There were some changes in the way we manage access rights for Peertube administrators and moderators.
The chat bot You can use a chat bot, that will help you for moderation. Check the chat bot documentation for more information.
Accessing moderation tools You can access room settings and moderation tools using the chat dropdown menu at the top of the chat.
Tip The video owner will be owner of the chat room. This means they can configure the room, delete it, promote other users as admins, …
Tip Starting with livechat v10.0.0, Peertube instance’s admins and moderators have no special rights on rooms by default. However, they have a special button available on top of the chat: “Staňte se moderátorem”. Clicking this button will give them owner access on the room.
You can use ConverseJS moderation commands to moderate the room. When you open the chat room in full screen, there will also be a menu with dedicated commands on the top right.
Ztlumit anonymní uživatele Info Tato funkce je součástí pluginu livechat verze 10.2.0. You can prevent anonymous users to send messages. In such case, only registered users will be able to talk in the chat.
To enable or disable this feature, use the chat dropdown menu, open the “configure” menu. In the form, you will find a “Ztlumit anonymní uživatele” checkbox.
Anonymous users won’t have the message field, and will see following prompt: “Zprávy mohou posílat pouze registrovaní uživatelé.”
When this feature is enabled, anonymous users will be assigned the “visitor” role. You can change their role to “participant” if you want to allow some of them to talk.
If you change the room configuration, all anonymous users will be muted or unmuted.
You can choose to enable or disable this feature for new chatrooms on the channel configuration page.
Roles and affiliations There are several roles that can be assignated to users in chat rooms: owner, moderators, member, …
Varování This section is still incomplete.
You can promote users as moderators, if you need some help.
Anonymizovat moderátorské akce Info Tato funkce je součástí pluginu livechat verze 11.0.0. It is possible to anonymize moderation actions, to avoid disclosing who is banning/kicking/… occupants.
To enable or disable this feature, use the chat dropdown menu, open the “configure” menu. In the form, you will find a “Anonymizovat moderátorské akce” checkbox.
You can choose to enable or disable this feature for new chatrooms on the channel configuration page.
Participant message history search Info Tato funkce je součástí pluginu livechat verze 11.0.0. As a room admin or owner, you can search all messages sent by a given participant.
To do so, you have several ways:
using the “Vyhledat všechny zprávy” action in the dropdown menu besides participants in the sidebar using the “Vyhledat všechny zprávy” action in the dropdown menu besides chat messages Tip To have more space and better readability, open the chat in full-page mode.
In the search results, there are several informations that are shown at the right of the participant nickname:
if the current nickname is different than the nickname when the participant has sent the message, the original nickname will be shown you will see the JID (Jabber ID) of the participant you will also see the occupant-id of the participant The search result will also include all messages related to participants who had the same nickname. You can differenciate them by comparing JID and occupant-id.
Delete room content You can delete old rooms: join the room, and use the menu on the top to destroy the room.
Instance moderation As Peertube instance moderator or administrator, you will probably need to check that your users are not behaving badly.
You can list all existing chatrooms: in the plugin settings screen, there is a button «List rooms».
From there, you can also promote yourself as room moderator by using the “Staňte se moderátorem” button on the right.`,description:"Plugin peertube-plugin-livechat advanced moderation features",tags:[],title:"Moderation",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/moderation/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 10.2.0. Configuration You can add terms & conditions to your channel. These terms will be shown to all users joining the chat.
To configure the terms & conditions, go to the channel configuration page:
URL in the message will be clickable. You can also do some styling: Message Styling.
Viewers When joining the chat, viewers will see the terms:
Info Peertube instance’s admin can also set global terms & conditions. If so, these terms will be shown above your channel’s terms.
Info Anonymous users will only see the terms & conditions once they have chosen their nickname (in other words: once they are able to talk).
You can change the terms content at any time, it will be instantly updated for all viewers.
Users can hide the terms & conditions. When doing so, terms won’t be shown again, unless you change the content.
Info If your Peertube instance allows joining chat with XMPP clients, users using such clients will see the terms as chat messages, coming from a “Peertube” account. When you update terms, they will receive a new message with the update terms content.`,description:"Configure channel's chat terms & conditions",tags:[],title:"Terms & conditions",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/terms/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 8.3.0. Introduction As a streamer, you can choose to rate limit your viewers messages in the chat.
This can be really usefull to:
avoid message flooding avoid unreadable chat if there are many viewers talking You can set a number of seconds that users will have to wait after sending a message, before sending another.
This limitation does not apply to moderators.
Slow mode option On the channel configuration page, you can set the slow mode option:
This value will apply as a default value for all your channel’s chatrooms.
Setting the value to 0 will disable the feature.
Setting the value to a positive integer will set the period during which users will not be able to post additional messages.
To modify the value for an already existing room, just open the room “configuration” menu (on top of the chat window), and change the slow mode value in the configuration form.
For viewers If the slow mode is enabled, users will be informed by a message.
When they send a message, the input field will be disabled for X seconds (where X is the slow mode duration).
This limitation does not apply to moderators.`,description:"Plugin peertube-plugin-livechat slow mode",tags:[],title:"Slow mode",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/slow_mode/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 10.3.0. Introduction As a streamer, you can choose to delay messages in the chat, to let some time to moderators to delete messages before they can even be read by other participants.
When this feature is enabled, moderators will see all messages without any delay. Chat participants won’t see that their own messages are delayed.
Please note that messages sent by moderators will also be delayed, to avoid them to respond to messages that are not even visible by other participants.
Moderation delay option On the channel configuration page, you can set the “Zpoždění moderování” option:
This value will apply as a default value for all your channel’s chatrooms.
Setting the value to 0 will disable the feature.
Setting the value to a positive integer will set the delay, in seconds, to apply to messages. Please avoid setting the value too high. Ideally it should not exceed a few seconds (4 or 5 seconds for example).
To modify the value for an already existing room, just open the room “configuration” menu (on top of the chat window), and change the moderation delay value in the configuration form.
Varování Currently, this feature has one known bug: users that join the chat will get all messages, even messages that are still pending for other participants. However, messages sent after they joined will be delayed correctly.
Tip You can combine a short moderation delay (1 second for example) with the moderation bot to delete messages containing swear words before any non-moderator user will see them.
In the chat As a moderator, you will see the remaining time (in seconds) before the message is broadcasted, just besides the message datetime.`,description:"Plugin peertube-plugin-livechat moderation delay",tags:[],title:"Moderation delay",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/moderation_delay/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 10.1.0. Channel emojis Streamers can add custom emojis to their channels.
On the channel configuration page, open the “Emotikony kanálu” tab:
Pro svůj kanál můžete nakonfigurovat vlastní emotikony. Tyto emotikony budou k dispozici ve výběru emotikonů. Uživatelé je mohou používat také pomocí jejich krátkého názvu (například napsáním “:shortname:”).
V chatu můžete používat emotikony pomocí “:shortname:”. Krátký název může začínat a/nebo končit dvojtečkou (:) a může obsahovat pouze alfanumerické znaky, podtržítka a pomlčky. Důrazně doporučujeme začínat je dvojtečkou, aby uživatelé mohli používat automatické doplňování (zadáním “:” a následným stisknutím klávesy TAB).
Import / Export On the channel configuration page, there are an “Import” and an “Export” button. The “Export” button generates a file than you can then import on another channel.
You can also generate a file to import from any other source (for example you can import your Twitch custom emojis). The file must be a valid JSON file, using the following format:
[ { "sn": ":short_name:", "url": "https://example.com/image.png" } ] The sn attribute is the short name code. The url attribute can be any image url than your browser can access, or a Data URL representing the file you want to import.`,description:"Plugin peertube-plugin-livechat custom emojis",tags:[],title:"Custom emojis",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/emojis/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 12.0.0. Režim pouze pro emoji V chatovacích místnostech můžete povolit režim “Pouze emoji”. Když je tento režim povolen, mohou účastníci posílat pouze emoji (standardní nebo vlastní emoji kanálu). Moderátorů se toto omezení netýká.
This mode can be usefull for example:
To avoid spam or offensive message when you are not here to moderate. When there are too many speaking participants, and you can’t no more moderate correctly. To enable or disable this feature, use the chat dropdown menu, open the “configure” menu. In the form, you will find a “Režim pouze pro emoji” checkbox.
If you want to enable it for all your chatrooms at once, open the channel emojis configuration page, and use the “Povolení režimu pouze emoji ve všech chatovacích místnostech kanálu” button.`,description:"Plugin peertube-plugin-livechat emojis only mode",tags:[],title:"Emojis only mode",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/emojis_only/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 10.2.0. Create a poll You can create a new poll by using the “Vytvoření nové ankety” action in the chat top menu:
Varování This poll feature should not be considered as a reliable voting system. It is easy to cheat. There is no mechanism to prevent anonymous users to vote multiple times by just reloading the chat. Votes are never fully anonymous, someone having access to the server could see who voted for what choice.
Poll form Fill the form fields:
“Otázka”: the question to ask to you viewers “Doba trvání ankety (v minutách)”: the duration for which viewers can vote “Anonymní výsledky”: if checked, votes won’t be publicly visible in the chat “Choice N”: choices that will be presented to viewers You must at least fill the two first choices fields.
Once you submit the form, the poll will instantly start.
If there was a previous unfinished poll, it will end and its result will be shown.
Access rights Every room’s admins can create a new poll.
When you promote someone as room admin or owner, they gets instant access to the “Vytvoření nové ankety” action.
When you remove admin or owner rights to someone, they can’t create new poll. But any existing poll will continue until it ends.
Every user that is not muted can vote. This means that you can prevent anonymous users to vote by using the “Ztlumit anonymní uživatele” feature.
Poll workflow When the polls starts, a first message will be sent in the chat, from the account of the user creating the poll.
A banner will also appear to show the poll, and will be updated regularly with the current votes.
Viewers can then vote by clicking on their choice, or by sending message like “!1” in the chat.
Votes counts will be updated regularly in the banner.
Viewers can change their vote at any time, just by making a new choice. Their precedent choice will be replaced by the new one.
Tip Anonymous viewers can only vote once they have choosen their nickname.
If “Anonymní výsledky” is checked, votes won’t be shown to other users. If unchecked, votes will be publicly visible as you will see message like “!1” in the chat.
Info For viewers using XMPP clients or outdated livechat plugin versions, the banner will not be visible. But they will see the message in the chat and will be able to vote by sending messages with their choices.
When the poll ends, a new message will be sent in the chat, with the results.
Info The only way to get old polls results is to search for the poll end message in the chat. For now, polls results are not saved by any other means. So don’t forget to note polls results if you want to keep them.`,description:"You can create polls to ask viewers their opinion",tags:[],title:"Polls",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/polls/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 10.0.0. Introduction The livechat plugin includes a Task Application: a kind of “to-do list” feature where you can create task lists and add tasks to them. Every room’s admins have access to these tasks, so you can edit them collaboratively.
You can for example use the Task Application to:
prepare a list of themes you want to discuss during your livestream, so you can be sure you won’t forget anything highlight questions from your viewers, so you can come back to them later without forgetting to answer them … Using the Task Application Opening the Task Application To open the Task Application, there is a “Úkoly” button in the top chat menu:
Clicking this button will toggle the Task Application display:
Tip To have more space and better readability, open the chat in full-page mode.
Access rights Every room’s admins have access to the Task Application (read and write access).
When you promote someone as room admin or owner, they gets instant access to the Task Application. When you remove admin or owner rights to someone, they instantly lose access to the Task Application.
Task lists By default, there is one task list that has the same name as your livestream.
You can use the form at the bottom to create a new task list. You can also edit existing task lists using the edit button, or delete any task list. Deleting a task list will also delete all its tasks.
Task lists are sorted alphabetically.
Tip All modification are instantly visible in all your browser tabs, and for all room’s admins.
Tasks Create tasks You can create a task using the button on the right of task lists. This opens a form with two fields: a mandatory task name, and an optional description.
Edit tasks Tasks can be edited by using the edit button on the right.
Tasks can be marked complete (or uncomplete) by clicking directly on the checkbox in the list.
Sorting tasks / change task list You can sort tasks, or move tasks from one list to another, simply using drag & drop.
Create a task from a chat message You can create a task from a message in a chat, using the “Vytvořit nový úkol” button in the dropdown menu at the right of the message. This will open a dialog box where you can choose which task list you want to add the task into. The task name will be the user nickname, and the task description the message content.
Using this feature, for example, you can ask your moderators to highlight all chat questions, so you can see them at a glance during your livestream, and check them as answered.`,description:"You can handle tasks and task lists with your moderation team.",tags:[],title:"Tasks / To-do lists",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/tasks/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info Tato funkce je součástí pluginu livechat verze 11.0.0. Introduction The livechat plugin includes a Moderator Notes Application: you can write some notes, that could be associated to chat participants. Every room’s admins have access to these notes, so they can edit them collaboratively.
You can for example use this Application to:
share some notes between moderators take notes about participants that were kicked or caused troubles … Using the Moderator Notes Application Opening the Moderator Notes Application To open the Moderator Notes Application, there is a “Moderátorské poznámky” button in the top chat menu:
Clicking this button will toggle the Application display:
Tip To have more space and better readability, open the chat in full-page mode.
Access rights Every room’s admins have access to this Application (read and write access).
When you promote someone as room admin or owner, they gets instant access to this Application. When you remove admin or owner rights to someone, they instantly lose access to this Application.
Scope Notes are only available in the room in which you have created them.
Chatrooms can be releated to video or channel. If you want to keep notes from one video to another, please consider using rooms associated to channels.
Varování Currently the video vs channel rooms is an instance-wide settings. Only Peertube admins can change it, and it applies to all chatrooms. In the future, this choice will be added in your channel’s options.
Notes Create/Edit Notes You can use the plus button on the top to create a new note. You can also edit existing notes using the edit button, or delate any note.
Tip All modification are instantly visible in all your browser tabs, and for all room’s admins.
You can create a note associated to a participant in several ways:
using the “Vytvořit novou poznámku” action in the dropdown menu besides participants in the sidebar using the “Vytvořit novou poznámku” action in the dropdown menu besides chat messages When a note is associated to a participant, you will see their nickname and avatar on the top of the note.
Notes filtering You can filter notes to find all notes related to a given participant in several ways:
click on the “Hledání poznámek” button that is available on notes to find all notes related to the same participant click on the “Hledání poznámek” button in the dropdown menu besides participants in the sidebar click on the “Hledání poznámek” button in the dropdown menu besides chat messages You can remove the filter by clicking on the close button.
When you filters notes on a participant, there are several informations that are shown at the right of the participant nickname:
if the current nickname is different than the nickname when you created the note, the original nickname will be shown you will see the JID (Jabber ID) of the participant you will also see the occupant-id of the participant The search result will also include all notes related to participants who had the same nickname. So you can also take note for anonymous users (who don’t have any consistent JID or occupant-id). You can differenciate them by comparing JID and occupant-id.
Sorting notes You can sort notes simply using drag & drop.`,description:"Plugin peertube-plugin-livechat moderation notes",tags:[],title:"Moderation notes",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/moderation_notes/index.html"},{breadcrumb:"Peertube livechat > Dokumentace > User documentation > For streamers",content:` Info This feature comes with the livechat plugin version 8.0.0, and can be disabled by your instance’s admins.
You can enable a chat bot on your chatrooms. The bot configuration is made channel per channel, and will apply to all related videos’ chatrooms.
To access this page, check the channel configuration documentation.
Once there, you can enable the bot, and setup several options:
Special charactersThe bot can automatically moderate messages containing too many special characters.
No duplicate messageThe bot can automatically moderate duplicate messages.
Forbidden wordsThe bot can automatically moderate messages containing forbidden words.
TimersThe bot can send periodically some messages.
CommandsThe bot can respond to several commands.
The bot will reload instantly when you save the page.`,description:"Chat bot setup",tags:[],title:"Chat bot",uri:"/peertube-plugin-livechat/cs/documentation/user/streamers/bot/index.html"},{breadcrumb:"Peertube livechat",content:"",description:"",tags:[],title:"Kategorie",uri:"/peertube-plugin-livechat/cs/categories/index.html"},{breadcrumb:"",content:` Tip You can use the language selector in the left menu to view this documentation in different languages. Some translations are missing or incomplete. In this case, you’ll see the English version of the text.
Welcome the Peertube Livechat Plugin documentation.
Peertube is a decentralized streaming platform, that can provide both live streaming and VOD (Video On Demand) features. The present plugin adds chatting capatibilities to your Peertube installation, allowing viewers to interract with streamers.
To have a glimpse on this plugin capabilities, checkout the introduction. For more precise informations, please find bellow the summary of this documentation.
Tip You can use the searchbox in the left menu to quickly find specific documentation parts.
Info Before updating to a major release, please read the release notes and breaking changes list : CHANGELOG.
IntroductionIntroduction
DokumentacePlugin documentation
User documentationPlugin peertube-plugin-livechat user documentation
For viewersHow to chat for stream viewers
OBSDocumentation to stream the chat content using OBS.
XMPP ClientsConnect to chat using a XMPP client
For streamersHow to setup the chat for your live stream
Some basicsSome basics about how to setup and use the chat for your live stream
Channel configurationPeertube channel chatrooms configuration
AnnouncementsRoom owners and administrators can send special announcements in the chat.
ModerationPlugin peertube-plugin-livechat advanced moderation features
Terms & conditionsConfigure channel's chat terms & conditions
Slow modePlugin peertube-plugin-livechat slow mode
Moderation delayPlugin peertube-plugin-livechat moderation delay
Custom emojisPlugin peertube-plugin-livechat custom emojis
Emojis only modePlugin peertube-plugin-livechat emojis only mode
PollsYou can create polls to ask viewers their opinion
Tasks / To-do listsYou can handle tasks and task lists with your moderation team.
Moderation notesPlugin peertube-plugin-livechat moderation notes
Chat botChat bot setup
Installation guidePlugin peertube-plugin-livechat installation guide
TroubleshootingSome classic mistakes and workarounds.
Known issues: CPU CompatibilityFor now, the plugin only works out of the box for x86_64 and arm64 CPU architecture. Here are some instructions for other CPU architectures.
Upgrade from version older than 6.0.0Important notes when upgrading for an older version.
Admin documentationPlugin Peertube Livechat administration
SettingsPlugin Peertube Livechat settings
External AuthenticationPlugin Peertube Livechat settings - External Authentication
Prosody mod_firewallAdvanced firewall rules for the Prosody server
Advanced usageSome advanced features
XMPP clientsAllow connections using XMPP clients
Using MatterbridgeUsing Matterbridge to bridge with other chats
PřispíváníPřispívání
Kodex chováníKodex chování smluvních partnerů
PřekládáníPřeložte zásuvný modul
Poskytněte zpětnou vazbuPoskytněte zpětnou vazbu
VývojVývoj
DokumentaceZdokumentujte zásuvný modul nebo přeložte dokumentaci.
Bug tracking & new featuresBug tracking / New features requests
Technical documentationTechnical documentation
Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
PollsPolls technical documentation
Terms&ConditionsTerms&Conditions implementation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview
Kontaktujte měKontakt na autora
CreditsKredity zásuvných modulů`,description:"Peertube plugin livechat documentation",tags:[],title:"Peertube livechat",uri:"/peertube-plugin-livechat/cs/index.html"},{breadcrumb:"Peertube livechat",content:"",description:"",tags:[],title:"Klíčová Slova",uri:"/peertube-plugin-livechat/cs/tags/index.html"}]