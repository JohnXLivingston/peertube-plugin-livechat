var relearn_search_index=[{breadcrumb:"Bate-papo ao vivo do Peertube",content:`O que é o plugin LiveChat? Este plugin Peertube foi criado para fornecer um sistema de bate-papo para vídeos do Peertube.
Por padrão, depois de instalar o plugin na sua instância do Peertube, uma sala de bate-papo será criada automaticamente para cada transmissão ao vivo.
Na captura de tela a seguir, você pode ver uma página de vídeo clássica do Peertube, com uma sala de bate-papo à direita (clique na imagem para vê-la em tela cheia):
A sala de bate-papo estará acessível a todos os espectadores, mesmo aqueles que não possuem uma conta na sua instância. Os usuários “anônimos” só precisam escolher um apelido antes de poderem começar a conversar no bate-papo.
Por padrão, o chat é exibido ao lado do vídeo. Mas você pode abri-lo em outra aba do navegador, usando o botão na parte superior:
Tip Você pode testar o plugin livechat com esta página de demonstração.
Instalação Como administrador do Peertube, você pode configurar este plugin na sua instância simplesmente usando o marketplace de plugins do Peertube incluído na interface de administração. Pesquise por “livechat” e clique em “instalar”: pronto!
Capacidades de chat ao vivo O plugin possui muitos recursos avançados. Como utiliza o padrão XMPP “por baixo dos panos”, os administradores do Peertube podem permitir usos avançados (conexão usando clientes XMPP, chatbots, ponte para outros protocolos de bate-papo, etc.). Mais informações nas seções relevantes desta documentação.
Federação O Peertube faz parte do fediverse: você pode criar uma rede de instâncias do Peertube, compartilhando conteúdo entre elas.
Este plugin pode lidar com federação: ao assistir a uma transmissão ao vivo de uma instância remota, você entrará na sala de bate-papo com sua conta local. Você será conectado automaticamente com seu apelido e avatar atuais.
Claro que, para que a federação funcione, o plugin deve ser instalado em ambas as instâncias.
Moderação Às vezes, você precisa proteger sua comunidade de pessoas mal-intencionadas. Como administrador da instância, você pode optar por proibir a federação para o plugin de chat ao vivo. Se atores remotos se comportarem mal, streamers, moderadores e administradores podem banir ou silenciar usuários.
Bot de bate-papo Este plugin vem com um [bot de bate-papo] integrado (/peertube-plugin-livechat/documentation/user/streamers/bot/). Consulte a documentação para mais informações.
Você também pode conectar qualquer outro bot de bate-papo XMPP usando Componentes Externos XMPP. Para isso, basta configurar o acesso aos Componentes Externos nas configurações do plugin.
Persistência de bate-papo Ao entrar em uma sala, você verá mensagens anteriores, inclusive aquelas enviadas antes de você entrar na sala.
Esse comportamento pode ser alterado em cada sala, e a duração de retenção padrão pode ser escolhida pelos administradores da instância.
Integre o chat na sua transmissão ao vivo Ao usar o software OBS para sua transmissão ao vivo, você pode incorporar o bate-papo na transmissão de vídeo. Isso é útil, por exemplo, para replays.
Na captura de tela a seguir, você pode ver uma repetição ao vivo, onde o conteúdo do bate-papo está incorporado na parte inferior do vídeo:
Na captura de tela a seguir, você pode ver uma configuração do OBS, onde o bate-papo é incluído como uma fonte na cena atual (a cor de fundo pode ser alterada e pode ser transparente):
Outros usos Por padrão, cada streamer poderá ativar/desativar o chat para suas transmissões ao vivo.
Mas no nível da instância, os administradores podem optar por ativar o chat para todos os vídeos (ao vivo e/ou VOD).
Você pode até ativar o chat para vídeos VOD específicos. É assim que a página demo funciona: não é uma transmissão ao vivo, mas ativei o chat especificamente para este vídeo.`,description:"Introdução",tags:[],title:"Introdução",uri:"/peertube-plugin-livechat/pt-br/intro/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers > Bot de bate-papo",content:`Proibir caracteres especiais Info Esta funcionalidade está disponível com o plugin livechat versão 12.0.0. Configuração Ao habilitar esta opção, o bot de moderação irá excluir automaticamente mensagens que contenham mais do que X caracteres especiais. Caracteres especiais são aqueles que não se enquadram em nenhuma dessas categorias: letras, números, símbolos de pontuação, símbolos de moeda, emojis.
Tolerância Número de caracteres especiais que podem ser aceitos em uma mensagem, sem excluí-la.
Motivo Motivo para exibir além das mensagens excluídas
Também modere mensagens de moderadores Por padrão, as mensagens dos moderadores não serão afetadas por este recurso. Ao marcar esta opção, as mensagens dos moderadores também serão excluídas.`,description:"O bot pode moderar automaticamente mensagens que contenham muitos caracteres especiais.",tags:[],title:"Caracteres especiais",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/bot/special_chars/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Contribuindo",content:` Tip Este Código de Conduta é uma adaptação do Contributor Covenant, versão 2.1, disponível em https://www.contributor-covenant.org/version/2/1/code_of_conduct.html. As traduções estão disponíveis em https://www.contributor-covenant.org/translations. Casos de comportamento abusivo, assediador ou de outra forma inaceitável podem ser denunciados aos líderes da comunidade responsáveis pela aplicação da lei por e-mail para git.[at].john-livingston.fr.
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
For answers to common questions about this code of conduct, see the FAQ at https://www.contributor-covenant.org/faq. Translations are available at https://www.contributor-covenant.org/translations.`,description:"Código de Conduta do Pacto do Colaborador",tags:[],title:"Código de Conduta",uri:"/peertube-plugin-livechat/pt-br/contributing/codeofconduct/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do administrador",content:`Esta seção descreve a página de configurações do plugin.
Termos e condições do chat do canal Você pode configurar uma mensagem de “termos e condições” que será exibida aos usuários que entrarem em suas salas de bate-papo.
For more information on this feature, check the documentation for channel’s terms & conditions.
Info Alterar esta configuração reiniciará o servidor de bate-papo e todos os usuários serão desconectados por um curto período.
Listar salas existentes Ao clicar no botão “Listar salas”, todas as salas de bate-papo existentes serão listadas. Você poderá encontrá-las e moderá-las.
Federação As configurações a seguir dizem respeito à federação com outras instâncias do Peertube e outros softwares diversos.
Não exibir chats remotos Ao selecionar esta configuração, sua instância nunca irá exibir chats de vídeos remotos.
Não publicar informações do chat Ao selecionar esta configuração, sua instância não irá publicar informação de chat no fediverso. Instâncias remotas do Peertube não estarão cientes de que elas são salas de chat associadas aos seus vídeos.
Atenção: se você já possui chats em andamento, é possível que esta informação já tenha sido publicada. Você deverá aguardar até a próxima atualização do vídeo antes que a informação seja despublicada. Também, se você desabilitar esta configuração, você deverá aguardar os vídeos serem atualizados antes que a informação seja publicada novamente. Esta atualização acontece sobre as outras quando um evento ao vivo retorna ou se encerra.
Atenção: esta configuração apenas afeta a publicação de informação via protocolo ActivityPub. Não irá impedir uma aplicação remota de detectar a presenção de chats de outra maneira, e de tentar conectar-se a ele.
Autenticação Desativar tokens de chat ao vivo Caso você tenha algum problema com os tokens de autenticação de longo prazo, você pode desabilitar o recurso aqui.
Autenticação externa Veja a página de documentação detalhada:
Autenticação externa
Configuração avançada do canal As configurações a seguir dizem respeito às opções avançadas do canal: os usuários poderão adicionar alguma personalização em seus canais, ativar o bot de moderação, …
Desabilite a configuração avançada do canal e o chatbot Caso encontre algum problema com esse recurso, você pode desativá-lo.
Enable regular expressions for channel’s forbidden words When enabling this feature, streamers will be able to use Regular Expressions when configuring the chat bot. You should not enable this feature if you don’t trust your users (those who can create chat rooms, in other words: those who can create live streams). A malicious user could create a specially crafted regular expression, and cause a bot denial of service.
Comportamento de bate-papo Tipo de sala Você pode escolher aqui ter salas separadas para cada vídeo ou agrupá-las por canal.
Abrir chat automaticamente Ao assistir a um vídeo, a caixa de bate-papo será aberta automaticamente.
Exibir o botão «abrir em nova janela» Haverá um botão para abrir o chat da web em uma nova janela.
Exibir o botão «compartilhar link do chat» Este recurso permite o modal “compartilhar link de bate-papo”. Com este modal, você pode gerar URLs para entrar no bate-papo. O bate-papo pode ser personalizado (modo somente leitura, usar o tema atual, …).
Você pode, por exemplo, gerar uma URL somente leitura e usá-la no OBS para integrar o chat na sua transmissão ao vivo!
Esta configuração permite que você escolha quem pode acessar este modal.
Usuários podem ativar o chat para suas transmissões ao vivo Se marcada, todos os vídeos ao vivo terão uma caixa de seleção em suas propriedades para habilitar o bate-papo na web.
O proprietário do vídeo poderá ativar chats na web.
Ativar chat para todas as transmissões Se marcado, o bate-papo será habilitado para todas as vidas.
Ativar chat para todos os não-vivos Se marcado, o bate-papo será habilitado para todos os vídeos que não sejam ao vivo.
Ativar chat para estes vídeos UUIDs de vídeos para os quais queremos um bate-papo na web. Podem ser vídeos não ao vivo. Um por linha. Você pode adicionar comentários: tudo após o caractere # será removido e as linhas vazias serão ignoradas.
Não adicione vídeos privados, os UUIDs serão enviados para o frontend.
Ocultar chat para usuários anônimos Se marcado, usuários anônimos do Peertube não verão o chat. Este recurso ainda é experimental. Se você o habilitou, é altamente recomendável também marcar “Não publicar informações do chat”. Caso contrário, algumas ferramentas de terceiros podem tentar abrir o chat e apresentar comportamentos imprevisíveis.
Observação: por enquanto, este recurso simplesmente oculta o chat. Em uma versão futura, o chat será substituído por uma mensagem dizendo “faça login em […]”. Consulte Notas da versão v5.7.0 para obter mais informações.
Banir o IP de um usuário anônimo quando ele for banido de uma sala de bate-papo Ao habilitar esta opção, cada vez que um usuário anônimo for banido de uma sala de bate-papo, seu IP também será banido do servidor de bate-papo. Aviso: se sua instância estiver aberta para registro, qualquer usuário poderá criar uma sala com armadilha, convidar usuários para participar e banir automaticamente todos os IPs de usuários anônimos. A lista de IPs banidos não é armazenada, ela será apagada na reinicialização do servidor ou quando você alterar as configurações de algum plugin. Os IPs banidos são registrados nos arquivos de log do servidor Prosody, para que os administradores do servidor possam eventualmente usar algumas ferramentas externas (como o fail2ban) para banir IPs de forma mais ampla.
Observação importante: Se você habilitar esse recurso e estiver usando um proxy reverso personalizado na frente do Peertube, certifique-se de que sua configuração esteja configurada corretamente para encaminhar IPs de usuários reais para o Peertube. Caso contrário, ele poderá bloquear todos os usuários anônimos de uma só vez.
Tematização Conjunto de avatares Você pode escolher entre vários conjuntos diferentes de avatares padrões que serão usados pelos usuários do bate-papo.
Sepia (mascote do Peertube): Gerador de avatar Peertube de David Revoy, licença CC-By
Gatos: Gerador de avatar de gato de David Revoy, CC-By licença
Pássaros: Gerador de avatar de pássaros de David Revoy, licença CC-By
Fenecs (mascote do Mobilizon): Gerador de avatar fenec/mobilizon de David Revoy, licença CC-By
Abstrato: Gerador de avatar abstrato de David Revoy, licença CC-By
Avatares Sepia legados (aqueles incluídos em versões anteriores do plugin): Baseado no trabalho de David Revoy, licença AGPL-v3
Se você não conseguir ver a alteração imediatamente, pode ser por causa do cache do seu navegador. Basta limpar o armazenamento de sessão do navegador ou reiniciá-lo.
Tema do ConverseJS Você pode escolher qual tema usar para o ConverseJS:
Tema Peertube: este é um tema especial, feito especialmente para integração com o Peertube. Tema padrão do ConverseJS: este é o tema padrão do ConverseJS. Tema cyberpunk do ConverseJS: este é um tema fornecido pelo ConverseJS. Detecção automática de cor Tentar detectar automaticamente as cores do tema atual do usuário.
Quando esta configuração está ativada, o plugin tenta detectar automaticamente as cores para aplicar ao tema do chat.
Se isso não estiver funcionando corretamente em algum dos seus temas do Peertube, você pode desativar esta opção. Você pode relatar o bug no rastreador de problemas oficial de problemas . Não se esqueça de especificar qual tema não está funcionando.
Atributo de estilo iframe do Webchat Estilos adicionais a serem adicionados no atributo de estilo iframe. Exemplo: altura:400px;
Configurações avançadas do servidor de bate-papo Usar Prosody do sistema O plugin vem com uma AppImage que é usada para executar o servidor Prosody XMPP. Se esta AppImage não estiver funcionando, você pode recorrer ao Prosody que vem empacotado para o seu servidor. Basta instalar o pacote prosody.
Esta configuração só deve ser usada se o plugin estiver quebrado e aguardando um patch.
Desabilitar Websocket Com Peertube >= 5.0.0, este plugin tenta usar a conexão Websocket para bate-papo. Se o navegador ou a conexão do usuário for incompatível, o navegador retornará automaticamente ao protocolo BOSH. Mas em casos raros, isso pode falhar. Por exemplo, se você tiver um proxy reverso na frente do Peertube que não permita conexão Websocket para plugins. Neste caso, você pode verificar esta configuração para desabilitar conexões Websocket.
Porta do Prosody A porta que será usada pelo servidor Prosody.
Altere-a se esta porta já estiver em uso no seu servidor.
Você pode fechar esta porta no seu firewall, ela não será acessada do mundo externo.
Nota: isso pode mudar em um futuro próximo, pois está planejado adicionar um recurso para ativar conexões externas.
URL do Peertube para chamada de API Deixe esta configuração em branco se você não sabe o que está fazendo.
Em alguns casos raros, o Prosody não consegue chamar a API do Peertube a partir de seu URI público. Você pode usar este campo para personalizar o URI do Peertube para o módulo Prosodys (por exemplo, com «http://localhost:9000» ou «http://127.0.0.1:9000»).
If this setting is left empty, and you are using Peertube >= 5.1 or later, the plugin will use values from your Peertube configuration file to guess on which interface and port request have to be done.
Em último caso, ele usará o URI público do Peertube. Portanto, qualquer chamada de API passará pelo seu servidor Nginx. Isso pode falhar em alguns casos: por exemplo, se você estiver em um contêiner Docker, onde o nome do host público não resolve para o IP correto. Nesse caso, tente alterar as configurações de “URL do Peertube para chamada de API” definindo http://127.0.0.1:9000 (assumindo que 9000 é a porta na qual o Peertube escuta, pergunte aos administradores da sua instância se você não souber).
Logar conteúdo das salas por padrão Se marcado, o conteúdo da sala será salvo por padrão. Qualquer usuário que entrar em uma sala verá o que foi escrito antes de entrar.
Observe que sempre é possível ativar/desativar o arquivamento de conteúdo para uma sala específica, editando as propriedades.
Expiração dos logs de sala Você pode escolher aqui por quanto tempo o conteúdo da sala de bate-papo será mantido pelo servidor. O valor pode ser:
60: o conteúdo será salvo por 60 segundos. Você pode substituir 60 por qualquer valor inteiro. 1d: o conteúdo será salvo por 1 dia. Você pode substituir 1 por qualquer valor inteiro. 1s: o conteúdo será salvo por 1 semana. Você pode substituir 1 por qualquer valor inteiro. 1m: o conteúdo será salvo por 1 mês. Você pode substituir 1 por qualquer valor inteiro. 1a: o conteúdo será salvo por 1 ano. Você pode substituir 1 por qualquer valor inteiro. nunca: o conteúdo jamais expirará, sendo mantido para sempre. Habilitar conexão à sala usando contas XMPP externas Ao habilitar esta opção, será possível conectar-se a salas usando contas XMPP externas e clientes XMPP.
Aviso, habilitar esta opção pode demandar configuração extra de servidor e DNS. Consulte a documentação: Habilitar conexões de contas XMPP externas. Porta do servidor Prosody para o servidor A porta que será usada para conexões XMPP s2s (servidor para servidor).
Você deve usar a porta padrão 5269. Caso contrário, você deve configurar um registro de DNS específico .
Interfaces de rede de servidor para servidor As interfaces de rede para escutar conexões entre servidores.
Lista de IPs para escutar, separados por vírgulas (os espaços serão removidos).
Você pode usar «*» para escutar em todas as interfaces IPv4 e «::» para todas as IPv6.
Examplos:
*, :: * 127.0.0.1, ::1 172.18.0.42 Pasta dos certificados Se este campo estiver vazio, o plugin irá gerar e usar certificados autoassinados.
Caso queira utilizar outros certificados, basta especificar aqui a pasta onde o Prosody pode encontrá-los. Observação: o usuário “peertube” deve ter acesso de leitura a esta pasta.
Habilitar conexões de cliente para servidor Habilite os clientes XMPP para se conectarem ao servidor Prosody integrado.
Esta opção sozinha permite apenas conexões em localhost.
Esta configuração permite que clientes XMPP se conectem ao servidor Prosody integrado. Por enquanto, esta opção permite conexões apenas de clientes de host local.
Por exemplo, esta opção pode permitir que uma instância do Matterbridge (que poderia usar login anônimo) na mesma máquina faça uma ponte entre seu bate-papo e outros serviços, como uma sala Matrix.
Porta do cliente para o servidor Prosody A porta que será usada pelo módulo c2s do servidor Prosody integrado.
Os clientes XMPP devem usar essa porta para se conectar.
Altere-o se esta porta já estiver em uso em seu servidor.
Você pode manter esta porta fechada em seu firewall por enquanto, ela não será acessada do mundo exterior.
Nota: isso pode mudar em um futuro próximo, pois está planejado adicionar um recurso para ativar conexões externas.
Interfaces de rede cliente-servidor As interfaces de rede para escutar conexões de cliente para servidor.
Esta configuração é fornecida para usuários avançados. Não altere essa configuração se você não entender completamente o que ela significa.
Lista de IP para ouvir, separados por vírgula (os espaços serão removidos).
Você pode usar «*» para escutar em todas as interfaces IPv4 e «::» para todas as interfaces Ipv6.
Exemplos:
*, :: * 127.0.0.1, ::1 127.0.0.1, ::1, 172.18.0.42 Habilitar componentes externos personalizados do Prosody Esta configuração permite que componentes externos XMPP se conectem ao servidor. Por padrão, esta opção permite conexões apenas de componentes do host local. Você precisa alterar o valor “Interfaces de rede de componentes externos da Prosody” para escutar em outras interfaces de rede.
Esse recurso pode ser usado para conectar pontes ou bots.
Mais informações sobre os componentes externos do Prosody aqui.
Habilitar componentes externos personalizados do Prosody Habilitar o uso de componentes XMPP externos.
Esta opção por si só permite conexões apenas do localhost. Você precisa configurar as interfaces de escuta e abrir a porta no seu firewall para torná-lo disponível em servidores remotos.
Este recurso pode, por exemplo, ser usado para conectar alguns bots às salas de bate-papo.
Porta de componentes externos do Prosody A porta que será usada pelos componentes XMPP para se conectar ao servidor Prosody.
Altere-a se esta porta já estiver em uso no seu servidor.
Você pode manter esta porta fechada no seu firewall se não permitir acesso em interfaces diferentes do host local.
Interfaces de rede de componentes externos da Prosody As interfaces de rede para escutar conexões de componentes externos.
Lista de IPs para escutar, separados por vírgulas (os espaços serão removidos).
Você pode usar «*» para escutar em todas as interfaces IPv4 e «::» para todas as IPv6.
Examplos:
*, :: * 127.0.0.1, ::1 172.18.0.42 Componentes externos Os componentes externos a declarar:
Um por linha. Use o formato «nome_do_componente:segredo_do_componente» (os espaços serão cortados). Você pode adicionar comentários: tudo após o caractere # será removido e as linhas vazias serão ignoradas. O nome só pode conter caracteres alfanuméricos latinos e pontos. Se o nome contiver apenas caracteres alfanuméricos, ele será sufixado com o domínio XMPP. Por exemplo, «ponte» se tornará «ponte.seu_dominio.tld». Você também pode especificar um nome de domínio completo, mas certifique-se de configurar seu DNS corretamente. Use apenas caracteres alfanuméricos na frase secreta (use pelo menos 15 caracteres). Habilitar Prosody mod_firewall Você pode habilitar mod_firewall no seu servidor Prosody.
Para mais informações, consulte a documentação.`,description:"Configurações do plugin Peertube Livechat",tags:[],title:"Configurações",uri:"/peertube-plugin-livechat/pt-br/documentation/admin/settings/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube",content:` Documentação do usuárioDocumentação do usuário do plugin peertube-plugin-livechat
Para espectadoresComo conversar com espectadores de transmissão
OBSDocumentação para transmitir o conteúdo do bate-papo usando o OBS.
Clientes XMPPConecte-se ao chat usando um cliente XMPP
Para streamersComo configurar o chat para sua transmissão ao vivo
Alguns princípios básicosAlgumas noções básicas sobre como configurar e usar o chat para sua transmissão ao vivo
Configuração de canalConfiguração de salas de chat do canal Peertube
AnúnciosProprietários e administradores de salas podem enviar anúncios especiais no chat.
ModeraçãoRecursos avançados de moderação do plugin peertube-plugin-livechat
Terms & conditionsConfigure channel's chat terms & conditions
Modo lentoPlugin peertube-plugin-livechat modo lento
Atraso de moderaçãoAtraso de moderação do plugin peertube-plugin-livechat
Emojis personalizadosPlugin peertube-plugin-livechat emojis personalizados
Modo somente emojisPlugin peertube-plugin-livechat modo apenas emojis
PesquisasVocê pode criar enquetes para perguntar a opinião dos espectadores
Tarefas / Listas de tarefasVocê pode gerenciar tarefas e listas de tarefas com sua equipe de moderação.
Notas de moderaçãoNotas de moderação do plugin peertube-plugin-livechat
Bot de bate-papoConfiguração do bot de bate-papo
Guia de instalaçãoGuia de instalação do plugin peertube-plugin-livechat
Solução de problemasAlguns erros clássicos e soluções alternativas.
Problemas conhecidos: compatibilidade da CPUPor enquanto, o plugin funciona apenas para arquiteturas de CPU x86_64 e arm64. Aqui estão algumas instruções para outras arquiteturas de CPU.
Atualização de versão anterior à 6.0.0Notas importantes ao atualizar para uma versão mais antiga.
Documentação do administradorAdministração do plugin Peertube Livechat
ConfiguraçõesConfigurações do plugin Peertube Livechat
Autenticação externaConfigurações do plugin Peertube Livechat - Autenticação externa
Prosódia mod_firewallRegras avançadas de firewall para o servidor Prosody
Uso avançadoAlguns recursos avançados
Clientes XMPPPermitir conexões usando clientes XMPP
Usando MatterbridgeUsando o Matterbridge para fazer a ponte com outros chats`,description:"Documentação do plugin",tags:[],title:"Documentação",uri:"/peertube-plugin-livechat/pt-br/documentation/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação",content:` Para espectadoresComo conversar com espectadores de transmissão
OBSDocumentação para transmitir o conteúdo do bate-papo usando o OBS.
Clientes XMPPConecte-se ao chat usando um cliente XMPP
Para streamersComo configurar o chat para sua transmissão ao vivo
Alguns princípios básicosAlgumas noções básicas sobre como configurar e usar o chat para sua transmissão ao vivo
Configuração de canalConfiguração de salas de chat do canal Peertube
AnúnciosProprietários e administradores de salas podem enviar anúncios especiais no chat.
ModeraçãoRecursos avançados de moderação do plugin peertube-plugin-livechat
Terms & conditionsConfigure channel's chat terms & conditions
Modo lentoPlugin peertube-plugin-livechat modo lento
Atraso de moderaçãoAtraso de moderação do plugin peertube-plugin-livechat
Emojis personalizadosPlugin peertube-plugin-livechat emojis personalizados
Modo somente emojisPlugin peertube-plugin-livechat modo apenas emojis
PesquisasVocê pode criar enquetes para perguntar a opinião dos espectadores
Tarefas / Listas de tarefasVocê pode gerenciar tarefas e listas de tarefas com sua equipe de moderação.
Notas de moderaçãoNotas de moderação do plugin peertube-plugin-livechat
Bot de bate-papoConfiguração do bot de bate-papo
Caracteres especiaisO bot pode moderar automaticamente mensagens que contenham muitos caracteres especiais.
Nenhuma mensagem duplicadaO bot pode moderar automaticamente mensagens duplicadas.
Palavras proibidasO bot pode moderar automaticamente mensagens contendo palavras proibidas.
TemporizadoresO bot pode enviar periodicamente algumas mensagens.
ComandosO bot pode responder a vários comandos.`,description:"Documentação do usuário do plugin peertube-plugin-livechat",tags:[],title:"Documentação do usuário",uri:"/peertube-plugin-livechat/pt-br/documentation/user/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário",content:`Entrando em salas de bate-papo Ao assistir a um vídeo do Peertube com o chat ativado, você verá o chat ao lado do vídeo:
Existem dois casos de uso ligeiramente diferentes, dependendo se você possui ou não uma conta na instância do Peertube. Veja abaixo para mais informações.
Se você não tem uma conta no Peertube Warning Esse recurso pode ser desabilitado pelos administradores da instância.
Se você não estiver logado na instância do Peertube onde está assistindo ao vídeo, você entrará automaticamente no chat. Você receberá um apelido aleatório (algo como “Anônimo 12345”).
Antes de poder falar na sala de bate-papo, você precisa digitar um apelido no campo na parte inferior da janela.
Faça login usando um provedor de autenticação externo Warning Esse recurso pode ser desabilitado pelos administradores da instância.
A instância do Peertube pode configurar provedores de autenticação externos (contas Mastodon, contas Google, etc.). Nesse caso, você verá um botão “Autenticar-se usando uma conta externa”, que abrirá uma janela de diálogo. Nessa janela, haverá alguns botões para conectar-se usando uma conta remota.
Após fazer login na conta remota e conceder acesso, seu apelido e avatar (se disponível) serão recuperados automaticamente. Nenhum outro dado será armazenado. Esses dados serão excluídos automaticamente algumas horas após você sair do chat.
Se você tem uma conta no Peertube Se você estiver conectado à sua conta do Peertube, você entrará automaticamente na sala, usando seu apelido e avatar do Peertube.
Tip Se você estiver assistindo a uma transmissão ao vivo em uma instância na qual não possui conta, mas possui uma conta em outra instância: se o plugin de chat ao vivo estiver instalado em ambas as instâncias, é possível entrar no chat usando sua conta. Para isso, basta abrir o vídeo na sua instância (você pode, por exemplo, copiar/colar a URL do vídeo no campo de busca da sua instância).
Se você tiver uma conta Peertube em outra instância Peertube Info Esta funcionalidade está disponível com o plugin livechat versão 9.0.0. Se você possui uma conta no Peertube, mas não na instância atual, há um botão “Autenticar-se usando uma conta externa”. Este botão abrirá uma caixa de diálogo onde você pode inserir a URL da sua instância do Peertube. Após a inserção, o recurso verificará se o plugin de chat ao vivo está disponível na instância remota e se o vídeo está disponível. Se for o caso, você será redirecionado para o vídeo na instância remota.
Bate-papo Para enviar mensagens, basta digitá-las no campo “mensagem” na parte inferior da tela. Você pode enviá-las pressionando a tecla Enter no seu teclado ou clicando no botão “enviar”.
Se quiser adicionar quebras de linha em suas mensagens, você pode usar a combinação de teclas “shift+enter”.
Você pode adicionar emojis às suas mensagens. Você pode, por exemplo, usar o menu de emojis ou digitar diretamente atalhos de emojis como :smiley:.
Você pode mencionar outros participantes. Para isso, digite as primeiras letras do apelido e pressione a tecla Tab. Você também pode digitar @: isso abrirá o menu diretamente. Você também pode clicar em um apelido na lista de participantes para inseri-lo no campo de mensagem.
Lista de participantes Para ver a lista de participantes, basta abrir o menu à direita:
Você pode ver que alguns participantes têm direitos especiais (moderador, proprietário, …).
Menu suspenso de bate-papo Há um menu suspenso na parte superior do chat, com alguns recursos avançados. Isso é especialmente útil para recursos de moderação. Os recursos disponíveis dependem do seu nível de acesso.
Abrindo em tela cheia Na parte superior do chat, há um botão para abrir o chat em tela cheia. Isso abrirá uma nova aba do navegador com o seguinte conteúdo:
Pode ser mais fácil bater papo usando uma aba inteira do navegador.
Mudando o apelido Você pode alterar seu apelido digitando /nick seu_novo_apelido no campo de mensagem.
Você também pode alterar seu apelido usando o menu de bate-papo.`,description:"Como conversar com espectadores de transmissão",tags:[],title:"Para espectadores",uri:"/peertube-plugin-livechat/pt-br/documentation/user/viewers/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Guia de instalação",content:`Acabei de instalar/atualizar o plugin, mas nada acontece Se você acabou de instalar/atualizar o plugin, mas nada acontece (sem bate-papo, sem configurações, os botões na página de configurações não funcionam, …), tente recarregar a página.
Ferramenta de diagnóstico Se o chat não funcionar, há uma ferramenta de diagnóstico nas páginas de configurações do plugin.
Abra as configurações do plugin e clique no botão “iniciar diagnóstico”.
Se houver algum erro na página de diagnóstico, você pode procurar uma solução nesta página ou consultar a Página de documentação de rastreamento de bugs se não encontrar nenhuma resposta.
O chat não carrega Chamadas de API internas In some case (like for some Docker Peertube installation), the diagnostic tools displays an error for the test called “API Prosody -> Peertube is KO”.
Nesse caso, tente alterar as configurações de “URL do Peertube para chamada de API”, definindo http://127.0.0.1:9000 (assumindo que 9000 é a porta na qual o Peertube escuta, pergunte aos administradores da sua instância se você não souber).
Verifique a ajuda para esta configuração para obter mais informações.
Websocket Se tudo estiver correto nas ferramentas de diagnóstico, mas as janelas de bate-papo permanecerem vazias: pode ser um problema de Websocket. Desde a versão 5.0.0 do Peertube, há algumas configurações adicionais a serem feitas no lado do servidor. Verifique com os administradores da instância se eles não se esqueceram de aplicar as alterações listadas nas Notas de lançamento do Peertube v5.0.0.
Você pode confirmar que é um problema de Websocket abrindo o console do navegador e verificando os logs de erros que falam sobre falha na conexão do Websocket.
Se não conseguir corrigir isso imediatamente, você pode desativar o Websocket desmarcando “Desabilitar Websocket” na página de configurações do plugin. Nesse caso, você também deve marcar “Não publicar informações do chat”, pois a federação de chat não funcionará sem o Websocket.`,description:"Alguns erros clássicos e soluções alternativas.",tags:[],title:"Solução de problemas",uri:"/peertube-plugin-livechat/pt-br/documentation/installation/troubleshooting/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Technical documentation",content:`This page describes the different source code folders and their content.
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
vendor The vendor folder is not part of the source code. It is used during the build process to download some external source code.`,description:"Source code organization",tags:[],title:"Source code",uri:"/peertube-plugin-livechat/pt-br/technical/sourcecode/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers > Bot de bate-papo",content:`Sem mensagens duplicadas Info Esta funcionalidade está disponível com o plugin livechat versão 12.0.0. Configuração Ao habilitar esta opção, o bot de moderação irá moderar automaticamente mensagens duplicadas. Isso significa que, se um usuário enviar a mesma mensagem duas vezes no período de X segundos, a segunda mensagem será excluída.
Intervalo de tempo O intervalo, em segundos, em que o usuário não pode enviar novamente a mesma mensagem.
Motivo Motivo para exibir além das mensagens excluídas
Também modere mensagens de moderadores Por padrão, as mensagens dos moderadores não serão afetadas por este recurso. Ao marcar esta opção, as mensagens dos moderadores também serão excluídas.`,description:"O bot pode moderar automaticamente mensagens duplicadas.",tags:[],title:"Nenhuma mensagem duplicada",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/bot/no_duplicate/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do administrador",content:`Usuários que não estão conectados à sua instância do Peertube estão entrando no bate-papo usando “contas anônimas” (eles podem escolher livremente um apelido e receberão um avatar aleatório).
Você pode habilitar alguns métodos de autenticação externa para permitir que os usuários criem contas de bate-papo. Nesse caso, o apelido e o avatar serão inicializados automaticamente com as informações da conta remota.
Esses “usuários de contas externas” serão mais fáceis de moderar do que contas anônimas.
Isso também permite que o usuário participe do chat sem criar uma conta no Peertube (caso sua instância tenha fechado o registro, por exemplo, ou sem esperar pela aprovação da conta).
Esta página descreverá os métodos de autenticação disponíveis.
Para a documentação do usuário, consulte documentação do usuário
Conexão OpenID Warning This feature is still experimental. This feature is available with the plugin version >= 9.0.0.
Você pode configurar um provedor externo compatível com OpenID Connect.
Fazendo isso, você pode, por exemplo, usar seu site para Single Sign-On.
Softwares CMS populares (Wordpess, …) oferecem plugins que implementam o OpenID Connect.
Para habilitar este recurso, primeiro você precisa criar um cliente no seu provedor (consulte a documentação relacionada para habilitar o OpenID Connect). Em seguida, acesse as configurações do plugin e habilite “Usar um provedor OpenID Connect”.
Observação: se você quiser restringir URLs de redirecionamento permitidas no lado do provedor (melhor prática de segurança), o plugin mostrará a URL permitida. Basta copiá-la na configuração do seu aplicativo OpenID Connect.
Agora você terá que preencher algumas configurações.
Etiqueta para o botão de conexão Esta etiqueta será exibida aos usuários, como o etiqueta do botão a ser autenticado com esse provedor OIDC.
Este é o rótulo do botão na captura de tela a seguir:
Por enquanto, não é possível localizar este rótulo.
URL de descoberta Seu provedor OpenID Connect deve implementar a URL de descoberta. Basta definir aqui a URL de descoberta, que deve ser algo como https://example.com/.well-known/openid-configuration.
Observação: se o seu provedor usar o caminho padrão /.well-known/openid-configuration, você pode omiti-lo. Por exemplo, https://accounts.google.com funcionará.
ID do cliente ID do cliente do seu aplicativo.
Segredo do cliente Seu aplicativo Cliente secreto.
Google, Facebook, … Além disso, você também pode configurar um ou vários provedores “padrão” do Open ID Connect (Google, Facebook, …).
Para esses provedores, a URL de descoberta e o rótulo do botão são predefinidos. Basta criar uma aplicação OAuth2 no lado do provedor e configurar o ID do Cliente e o Segredo do Cliente.
Se você pensar em um provedor padrão que não está disponível, você pode solicitar a implementação abrindo um novo problema.
Solução de problemas Se o botão não aparecer para os usuários finais, pode haver um problema de configuração. Você pode tentar a ferramenta de diagnóstico para obter mais informações.
Observação: se você estiver conectado à sua conta do Peertube, o botão nunca será exibido. Portanto, use uma janela privada do navegador para testar.
Se o botão for exibido, mas não funcionar, verifique seus logs do Peertube. Pode ser que o serviço remoto não use escopos ou nomes de atributos padrão.
Mais por vir Outros métodos de autenticação serão implementados no futuro.`,description:"Configurações do plugin Peertube Livechat - Autenticação externa",tags:[],title:"Autenticação externa",uri:"/peertube-plugin-livechat/pt-br/documentation/admin/external_auth/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação",content:` Info Antes de atualizar para uma versão principal, leia as notas de versão e a lista de alterações significativas: CHANGELOG.
Tip Para instalar ou atualizar o plugin, basta usar a interface de administração web do Peertube.
Aqui estão algumas outras instruções mais específicas:
Solução de problemasAlguns erros clássicos e soluções alternativas.
Problemas conhecidos: compatibilidade da CPUPor enquanto, o plugin funciona apenas para arquiteturas de CPU x86_64 e arm64. Aqui estão algumas instruções para outras arquiteturas de CPU.
Atualização de versão anterior à 6.0.0Notas importantes ao atualizar para uma versão mais antiga.`,description:"Guia de instalação do plugin peertube-plugin-livechat",tags:[],title:"Guia de instalação",uri:"/peertube-plugin-livechat/pt-br/documentation/installation/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers > Bot de bate-papo",content:`Você pode configurar algumas palavras que serão moderadas automaticamente pelo bot (mensagens contendo tais palavras serão excluídas instantaneamente). Você também pode adicionar um motivo opcional que será exibido no lugar das mensagens excluídas. Vários exemplos são fornecidos na página de documentação.
You can fill several “Expressões ou palavras proibidas” lines. When a user sends a message that match the configured criteria, the message will automatically be deleted.
Expressões ou palavras proibidas Here you can configure several words, group of words, or “regular expressions”.
Each time a user sends a message, these words will be tested. If the message contains one of them, the message will be deleted.
Você pode, por exemplo, preencher este campo com uma lista de palavrões.
Para obter alguns exemplos, verifique estas sugestões de palavras proibidas.
Se você tiver alguma lista de palavras úteis, sinta-se à vontade para contribuir com esta página de sugestões. Elas estão na pasta support/forbidden_words do código-fonte do chat ao vivo. Consulte o guia de contribuição para obter mais informações.
Tip Essas palavras não diferenciam maiúsculas de minúsculas.
Tip Você pode combinar um curto atraso de moderação (1 segundo, por exemplo) com o bot de moderação para excluir mensagens contendo palavrões antes que qualquer usuário não moderador as veja.
Warning Este recurso ainda é experimental. Pode haver alguns problemas com alfabetos não latinos. Você pode abrir um problema para relatar seus problemas.
Considerar como expressões regulares Warning Esse recurso pode ser desabilitado pelos administradores da instância.
Ao marcar esta opção, cada linha do campo “Expressões ou palavras proibidas” será considerada como uma expressão regular.
Também modere mensagens de moderadores Por padrão, as mensagens dos moderadores não serão afetadas por este recurso. Ao marcar esta opção, as mensagens dos moderadores também serão excluídas.
Motivo Motivo para exibir além das mensagens excluídas
Comentários Você pode adicionar aqui alguns comentários sobre esta regra, para lembrar como e por que você a criou. Esses comentários são puramente indicativos e não têm influência no comportamento do bot.`,description:"O bot pode moderar automaticamente mensagens contendo palavras proibidas.",tags:[],title:"Palavras proibidas",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/bot/forbidden_words/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Guia de instalação",content:`O Prosody AppImage incluído no plugin funciona apenas em CPUs x86_64 e arm64. Não é compatível com outras arquiteturas de CPU.
Para usar o plugin, você terá que instalar manualmente o Prosody no seu servidor (veja abaixo).
Note: the plugin requires Prosody >= 0.12.0. If you are using an older version, Chat Federation could be broken, and it could have some unexpected behaviour.
Uma vez feito isso, você deve marcar Usar Prosódia do Sistema nas configurações do plugin.
Na instalação do Peertube não Docker Para instalação padrão, você só precisa instalar o pacote oficial prosody para sua distribuição Linux.
Por exemplo, no Debian/Ubuntu:
sudo apt install prosodyVocê pode então desabilitar o serviço que inicia automaticamente ao instalar o Prosody (o plugin iniciará um processo Prosody, não há necessidade de executar o serviço). Por exemplo, no Debian/Ubuntu (e outras distribuições Linux baseadas em Systemd):
sudo systemctl disable prosody && sudo systemctl stop prosodyAviso: não desabilite o Prosody se ele for usado para outro serviço no seu servidor, como por exemplo o Jitsi.
Docker Você precisará gerar uma imagem do Peertube que inclua o Prosody no mesmo contêiner do Peertube. Sei que essa não é a maneira padrão de fazer isso com o Docker, mas lembre-se de que é uma solução temporária.
Para gerar e usar essa imagem, consulte a documentação do Docker. O arquivo Docker para gerar a imagem deve ser:
FROM chocobozzz/peertube:production-bullseye RUN apt -y update && apt install -y prosody && apt -y cleanYunohost Você precisa desabilitar o metronome (o servidor XMPP fornecido pela Yunohost) e instalar o prosody.
Isso já é feito pelo aplicativo Yunohost Peertube, pois era necessário para o plugin antes da versão v6.0.0.
Mas pode ser removido em breve (para evitar as desvantagens deste método). Preciso discutir com a equipe da Yunohost para decidir como podemos minimizar as desvantagens e maximizar a compatibilidade.`,description:"Por enquanto, o plugin funciona apenas para arquiteturas de CPU x86_64 e arm64. Aqui estão algumas instruções para outras arquiteturas de CPU.",tags:[],title:"Problemas conhecidos: compatibilidade da CPU",uri:"/peertube-plugin-livechat/pt-br/documentation/installation/cpu_compatibility/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Technical documentation",content:` Warning This page describes experimental features. These features are available with the plugin version >= 7.2.0.
Introdução Peertube is part of the Fediverse. So Peertube video can be watched from other Peertube instances, and from various other softwares:
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
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and a space attribute space should be an XMPP JID for a MUC if found, open this XMPP JID with your client after converting it to a join URI, or connect to the XMPP room at that address `,description:"Displaying the livechat with 3rd party software.",tags:[],title:"Third party",uri:"/peertube-plugin-livechat/pt-br/technical/thirdparty/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Contribuindo",content:`Você pode contribuir para a tradução deste plugin. As traduções são feitas usando o software Weblate, utilizando a instância Framasoft Weblate.
Warning Nunca modifique diretamente os arquivos na pasta languages, isso pode causar conflitos.
Como fazer Crie uma conta: https://weblate.framasoft.org/accounts/register/ Valide seu e-mail e siga o link enviado Crie sua senha e configure sua conta Acesse a página do projeto do plugin: https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/ Selecione o local que você deseja traduzir Apenas traduza as frases que faltam ou corrija aquelas que parecem incorretas para você. Warning Pode haver algumas sequências de caracteres “muito técnicas”. Se você não tiver 100% de certeza do significado ou da sua tradução, é melhor não traduzi-la, para que ela seja exibida em inglês.
Traduções do ConverseJS Este plugin utiliza o ConverseJS para o front-end de bate-papo. O ConverseJS possui suas próprias traduções, em sua própria instância do Weblate. Você também pode traduzir diretamente no repositório de código. Para mais informações, consulte a documentação de traduções do ConverseJS.
Adicionando uma nova localidade Se você acha que há alguma localidade faltando, verifique primeiro se ela é gerenciada no Peertube. Se for o caso, você pode abrir um problema para solicitá-la.
Adicionar novas strings / usar traduções no código Se você estiver trabalhando em novos recursos e precisar de novas strings, poderá criá-las diretamente no Weblate. A versão em inglês é obrigatória. Comece por ela.
Cada string está vinculada a uma chave (por exemplo, use_chat). Escolha uma chave explícita, em inglês, com letras minúsculas.
Se você precisar testar novas strings sem esperar por uma mesclagem do Weblate, você pode modificar os arquivos languages/*.yml, mas evite confirmar essas alterações (para minimizar os riscos de conflito).
Use traduções no código front-end Antes de usar uma string no front-end, você precisa declarar uma nova constante em client/@types/global.d.ts. O nome da constante deve:
comece com o prefixo “LOC_” use a tecla string, em maiúsculas você só precisa declarar seu tipo, não seu valor Por exemplo, para usar “use_chat”, você deve declarar:
declarar const LOC_USE_CHAT: stringO script build-client.js lerá client/@types/global.d.ts, procurará por tais constantes e carregará seus valores dos arquivos de idiomas.
Agora, você pode simplesmente chamar peertubeHelpers.translate(LOC_USE_CHAT) no seu código.
Use traduções no código de back-end Em teoria, as únicas partes do código de backend onde você precisa de localização são a declaração de configurações e os dados padronizados (ActivityPub, RSS, …). Aqui, precisamos obter strings em inglês da chave de tradução.
Observação: você nunca deve precisar de outra tradução de idioma do código do backend. A localização deve ser feita no frontend.
Existe um módulo lib/loc.ts que fornece uma função loc(). Basta passar a chave para obter a string em inglês: loc('diagnostic')'.
Tradução de documentação A tradução da documentação é feita usando o componente Weblate correspondente.
Existe um “Hugo shortcodes” específico que você pode usar para exibir uma string de aplicativo. Se você quiser exibir o nome do botão “open_chat_new_window”, pode usar isso no arquivo markdown da documentação:
{{% rótulo_do_chat_ao_vivo abrir_nova_janela_do_chat %}}Você também pode impedir que uma página inteira seja traduzida adicionando livechatnotranslation: true na seção Yaml Font Matter:
--- título: "Terceiros" descrição: "Exibindo o chat ao vivo com software de terceiros." peso: 20 capítulo: falso livechatnotranslation: verdadeiro ---Nunca traduza uma string no arquivo livechat.en.pot, pois ela será ignorada. Em vez disso, edite diretamente os arquivos markdown.
Se uma string contiver um link, você poderá alterá-lo para o link correto no idioma traduzido. Por exemplo, para um link para esta documentação, você pode adicionar o código do idioma na URL.
Algumas strings são blocos de código. Não traduza o código. Mas você pode traduzir comentários ou parâmetros, se relevante.
Se não tiver certeza, simplesmente não traduza e pergunte o que fazer.
A ferramenta que utilizo para gerenciar traduções da documentação pode apresentar comportamentos estranhos. Quando adiciono frases que se parecem com outras frases existentes, às vezes ela copia traduções existentes. Portanto, quando houver traduções marcadas como “para verificar”, certifique-se de que ela não copie uma string que não tenha nada a ver com a em inglês antes de validar.
Se você tiver certeza sobre o contexto de uma string, pode verificar a localização da string no painel direito do Weblate e abrir a página de documentação correspondente. Por exemplo, para uma string localizada no arquivo support/documentation/content/en/documentation/user/streamers.md, a URL correspondente é https://livingston.frama.io/peertube-plugin-livechat/documentation/user/streamers/.
Recomendações genéricas Por favor, seja inclusivo em suas formulações e respeite o código de conduta.`,description:"Traduzir o plugin",tags:[],title:"Traduzir",uri:"/peertube-plugin-livechat/pt-br/contributing/translate/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do administrador > Uso avançado",content:`Este módulo de bate-papo é baseado no protocolo XMPP, também conhecido como Jabber. Portanto, é possível conectar-se aos bate-papos usando software cliente XMPP. Isso pode ser útil, por exemplo, para facilitar as operações de moderação.
Para obter a documentação do usuário associada a esses recursos, consulte a página de documentação do usuário.
Info A ativação desses recursos requer alterações de configuração no servidor e nos registros DNS. Não é possível configurar isso apenas pela interface do Peertube e requer algumas habilidades básicas de administração do sistema.
Entre na sua conta Peertube Warning Este recurso ainda não está disponível e estará disponível em uma versão futura do plugin.
Conexão usando uma conta XMPP externa Para habilitar esse recurso, você precisará configurar seu servidor e registros DNS para que os clientes XMPP possam encontrar e acessar o servidor Prosody que este plugin usa internamente.
Configurações do plugin Comece acessando as configurações do plugin de chat ao vivo da sua instância e ative a opção “Habilitar conexão com a sala usando contas XMPP externas”. Ao marcar esta opção, as novas configurações serão exibidas abaixo.
Primeiro, o campo “Porta de servidor Prosody para servidor”. O padrão é 5269, que é a porta padrão para este serviço. No entanto, você pode alterar para outra porta, se ela já estiver em uso no seu servidor.
Em seguida, o campo “Interfaces de rede entre servidores” permite especificar em quais interfaces de rede o servidor deve escutar. O valor padrão “*, ::” indica que todos os endereços IP devem ser escutados. Você pode alterar esses valores se desejar escutar apenas determinados endereços IP. A sintaxe é explicada ao lado da configuração.
Para a configuração “Pasta de certificados”, você pode deixá-la vazia. Nesse caso, o plugin gerará automaticamente certificados autoassinados. Alguns servidores XMPP podem se recusar a conectar, dependendo de sua configuração. Nesse caso, você pode indicar aqui um caminho no servidor, no qual deverá colocar os certificados a serem usados pelo módulo. Cabe a você gerá-los e renová-los. Veja abaixo para mais informações.
Firewall Você deve abrir a porta configurada (5269 por padrão) no seu firewall.
Se você estiver usando o Docker para seu Peertube, precisará modificar o arquivo docker-compose.yml para abrir a porta 5269 do contêiner peertube, para que o mundo externo possa se conectar a ele.
DNS Você precisa adicionar registros DNS permitindo que servidores remotos encontrem os componentes “room.your_instance.tld” e “external.your_instance.tld”.
A maneira mais fácil de fazer isso é adicionar registros SRV para o “room” e o “external” subdomínio:
nome do registro: _xmpp-server._tcp.room.your_instance.tld. (substitua «your_instance.tld» pelo URI da sua instância)
TTL: 3600
classe: IN
SRV: 0
prioridade: 0
peso: 5
porta: 5269 (adaptar se você alterou a porta padrão)
alvo: your_instance.tld. (substitua pelo uri da sua instância)
nome do registro: _xmpp-server._tcp.external.your_instance.tld. (substitua «your_instance.tld» pelo uri da sua instância)
TTL: 3600
classe: IN
SRV: 0
prioridade: 0
peso: 5
porta: 5269 (adaptar se você alterou a porta padrão)
alvo: your_instance.tld. (substitua pelo uri da sua instância)
Tenha cuidado para manter o ponto depois de “your_instance.tld”.
Usando o comando dig para verificar seus registros, você deverá obter um resultado semelhante a este:
$ dig +short _xmpp-server._tcp.room.videos.john-livingston.fr. SRV 0 5 5269 vídeos.john-livingston.fr. $ dig +short _xmpp-server._tcp.external.videos.john-livingston.fr. SRV 0 5 5269 vídeos.john-livingston.fr.Se você não estiver usando a porta padrão 5269, também precisará adicionar um registro SRV para _xmpp-server._tcp.your_instance.tld. (o mesmo que acima, mas sem o prefixo room.). É claro que você também pode adicionar este registro se usar a porta padrão. Também funcionará.
Usando certificados confiáveis Os certificados autoassinados que este plugin usa por padrão podem ser rejeitados por alguns servidores XMPP, por motivos de segurança.
É possível usar certificados validados por uma autoridade certificadora. No entanto, isso requer conhecimentos avançados de administração de sistemas. De fato, devido à multiplicidade de casos de uso possíveis, é impossível documentar todas as situações aqui. Esta documentação, portanto, explicará apenas o objetivo a ser alcançado e fornecerá um exemplo adequado apenas para uma situação “básica” (instalação manual do Peertube, usando letsencrypt). Se você estiver em outra situação (instalação do Docker, certificados assinados por outra autoridade, etc.), terá que adaptar essa abordagem por conta própria.
Princípio básico Cabe a você gerar certificados válidos para os domínios sua_instância.tld e room.sua_instância.tld. Você pode usar qualquer método suportado pelo Prosody.
Você deve então colocar esses certificados em uma pasta que seja acessível ao usuário peertube e especificar essa pasta na configuração do plugin “Pasta de certificados”.
Tip Se você quiser usar o utilitário ProsodyCtl para importar certificados, este utilitário estará disponível (após o Peertube ser iniciado) usando o seguinte comando (adaptando o caminho para sua pasta de dados do Peertube e substituindo “xxx” pelos argumentos que você deseja passar para o prosodyctl): sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua xxx
O plugin verificará uma vez por dia se algum arquivo foi modificado nesta pasta e recarregará o Prosody, se necessário.
Método para o caso simples Assumimos aqui que sua instalação do Peertube é “clássica” (sem uso do Docker) e que os certificados são gerados pelo letsencrypt, usando a ferramenta certbot.
Primeiramente, precisamos criar um certificado para o subdomínio room.your_instance.tld: este é o URI do componente MUC (salas de bate-papo XMPP). Mesmo que as conexões sejam feitas em your_instance.tld, precisaremos de um certificado válido para este subdomínio.
Comece configurando uma entrada DNS para room.your_instance.tld, que aponta para o seu servidor. Você pode usar uma entrada CNAME (ou uma entrada A e uma entrada AAAA).
Em seguida, usaremos o nginx (já instalado no seu Peertube) para gerar o certificado certbot. Criaremos um novo site. No arquivo /etc/nginx/site-available/room.peertube, adicione:
servidor { ouvir 80; ouvir [::]:80; nome_do_servidor sala.sua_instância.tld; localização /.well-known/acme-challenge/ { tipo_padrão "texto/simples"; raiz /var/www/certbot; } localização / { retornar 301 https://sua_instância.tld; } }Em seguida, habilite o site:
ln -s /etc/nginx/sites-available/room.peertube /etc/nginx/sites-enabled/ systemc reload nginxEm seguida, preparamos a pasta para a qual importaremos os certificados. Presumimos que você já tenha o plugin ativo. Criaremos a seguinte pasta (se ainda não existir), com o usuário peertube, para garantir que não haja problemas de permissão:
sudo -u peertube mkdir /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/certsAgora você precisa configurar esta pasta nas configurações do plugin, no parâmetro “Pastas de certificados”. É importante fazer isso agora, caso contrário, o script de importação de certificados colocará os certificados na pasta errada.
Configuraremos o certbot para importar os certificados gerados para a pasta Prosody. Podemos usar o utilitário ProsodyCtl incluído no plugin.
Observação: para estar disponível, o plugin deve ter sido iniciado pelo menos uma vez.
Criaremos um arquivo /etc/letsencrypt/renewal-hooks/deploy/prosody.sh contendo:
#!/bin/sh /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl &#13; --root &#13; --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua &#13; cert import &#13; room.sua_instância.tld sua_instância.tld /etc/letsencrypt/liveEntão pedimos para gerar o certificado:
certbot -d room.videos.john-livingston.frSe o certbot oferecer vários métodos para gerar o certificado, escolha “nginx”.
Normalmente, agora você deve encontrar os certificados na pasta configurada.
Observação: na primeira vez que fizer isso, você precisará reiniciar o Prosody. A maneira mais fácil de fazer isso é reiniciar o Peertube.
Método para o caso Docker Este método funciona com o guia Docker oficialmente suportado do PeerTube.
Primeiro, certifique-se de criar uma entrada DNS para room.your_instance.tld, que aponta para o seu servidor. Você pode usar uma entrada CNAME (ou uma entrada A e uma entrada AAAA). Isso é necessário para que o Let’s Encrypt valide o domínio para geração do certificado.
Entre no diretório onde seu arquivo docker-compose.yml está.
Abra um shell no contêiner certbot:
docker exec -it certbot /bin/shExecute o certbot:
certbotSerão apresentadas uma série de prompts. Digite 2 para o tipo de autenticação:
How would you like to authenticate with the ACME CA? Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2Digite o nome de domínio room.your_instance.tld:
Please enter the domain name(s) you would like on your certificate (comma and/or space separated) (Enter 'c' to cancel): room.your_instance.tldEntre no diretório onde o servidor web PeerTube atende solicitações para o Let’s Encrypt, /var/www/certbot:
Input the webroot for <room.your_instance.tld>: (Enter 'c' to cancel): /var/www/certbotVocê deverá ver uma saída como esta:
Successfully received certificate. Certificate is saved at: /etc/letsencrypt/live/room.your_instance.tld/fullchain.pem Key is saved at: /etc/letsencrypt/live/room.your_instance.tld/privkey.pemExecute o comando abaixo dentro do contêiner certbot para conceder acesso de leitura aos novos certificados e chaves privadas do grupo peertube. Observação: Isso também tornará os arquivos legíveis para o grupo com ID 999 no sistema host. Verifique os grupos em seu sistema para avaliar se isso representa um risco antes de executar este comando.
chown -R root:999 /etc/letsencrypt/live; \\ chmod 750 /etc/letsencrypt/live; \\ chown -R root:999 /etc/letsencrypt/archive; \\ chmod 750 /etc/letsencrypt/archive; \\ find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} \\;Saia do contêiner certbot:
exitModifique seu arquivo docker-compose.yml, alterando a linha entrypoint no serviço certbot para o seguinte. É o mesmo que o anterior, mas será executado automaticamente após cada renovação de certificado.
entrypoint: /bin/sh -c "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot; chown -R root:999 /etc/letsencrypt/live; chmod 750 /etc/letsencrypt/live; chown -R root:999 /etc/letsencrypt/archive; chmod 750 /etc/letsencrypt/archive; find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} +; sleep 12h & wait $\${!}; done;"Continuando a modificar docker-compose.yml, adicione o volume do certificado certbot ao contêiner peertube. Deve ficar algo assim:
volumes: - ./docker-volume/certbot/conf:/etc/letsencryptReinicie seus serviços:
docker-compose down; docker-comopse up -dNas configurações do plugin de chat ao vivo nas configurações de administração do PeerTube, defina o diretório do certificado como o seguinte:
/etc/letsencrypt/liveSalve as configurações do plugin e verifique se o Prosody pode ver os certificados:
docker-compose exec -u peertube \\ peertube \\ /data/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun \\ prosodyctl \\ --config /data/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ check certsSolução de problemas Se não conseguir fazer funcionar, você pode usar a ferramenta de diagnóstico (há um botão no topo da página de configurações do plugin) e dar uma olhada na seção «Verificação de prosódia».`,description:"Permitir conexões usando clientes XMPP",tags:[],title:"Clientes XMPP",uri:"/peertube-plugin-livechat/pt-br/documentation/admin/advanced/xmpp_clients/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Contribuindo",content:"Você não precisa saber programar para começar a contribuir com este plugin! Outras contribuições também são muito valiosas, entre elas: você pode testar o software e relatar bugs, dar feedback, recursos de seu interesse, interface de usuário, design, etc.",description:"Dê seu feedback",tags:[],title:"Dê seu feedback",uri:"/peertube-plugin-livechat/pt-br/contributing/feedback/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação",content:` ConfiguraçõesConfigurações do plugin Peertube Livechat
Autenticação externaConfigurações do plugin Peertube Livechat - Autenticação externa
Prosódia mod_firewallRegras avançadas de firewall para o servidor Prosody
Uso avançadoAlguns recursos avançados
Clientes XMPPPermitir conexões usando clientes XMPP
Usando MatterbridgeUsando o Matterbridge para fazer a ponte com outros chats`,description:"Administração do plugin Peertube Livechat",tags:[],title:"Documentação do administrador",uri:"/peertube-plugin-livechat/pt-br/documentation/admin/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do administrador",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 11.0.0. Você pode habilitar mod_firewall no seu servidor Prosody.
Ao fazer isso, os administradores do Peertube poderão definir regras avançadas de firewall.
Warning Essas regras podem ser usadas para executar código arbitrário no servidor. Se você for um provedor de hospedagem e não quiser permitir que os administradores do Peertube criem tais regras, você pode desativar a edição online criando um arquivo disable_mod_firewall_editing no diretório do plugin (plugins/data/peertube-plugin-livechat/disable_mod_firewall_editing). Isso é uma opção de desativação, pois os administradores do Peertube já podem executar código arbitrário simplesmente instalando qualquer plugin. Você ainda pode usar o mod_firewall editando arquivos diretamente no servidor.
Editar regras Primeiro, você deve habilitar o recurso nas configurações do plugin.
Logo abaixo das configurações, você encontrará o botão “Configurar mod_firewall”. Este botão abrirá uma página de configuração.
Aqui você pode adicionar vários arquivos de configuração.
Você pode ativar/desativar cada arquivo.
Os arquivos serão carregados em ordem alfabética. Você pode usar um número como prefixo para escolher a ordem facilmente.
Info Você também pode editar essas regras de firewall diretamente no servidor, no diretório plugins/data/peertube-plugin-livechat/prosody/mod_firewall_config/. Os nomes dos arquivos devem conter apenas caracteres alfanuméricos, sublinhados e hífens. A extensão deve ser .pfw ou .pfw.disabled se desejar desabilitar um arquivo. Certifique-se de que o usuário do sistema peertube tenha acesso de gravação a esses arquivos, caso contrário, a interface de edição web falhará. Após editar esses arquivos, você deve recarregar o prosody. Isso pode ser feito salvando as configurações do plugin, salvando a configuração do mod_firewall na interface web ou reiniciando o Peertube.
Ao salvar a configuração, o servidor a recarregará automaticamente e suas regras serão aplicadas imediatamente. Você pode verificar se não há erros de análise no log de erros do Prosody. Para isso, leia o arquivo plugins/data/peertube-plugin-livechat/prosody/prosody.err ou use a ferramenta de diagnóstico que mostrará os últimos erros do Prosody.
Exemplos Não hesite em compartilhar suas regras. Para isso, você pode, por exemplo, editar esta página.`,description:"Regras avançadas de firewall para o servidor Prosody",tags:[],title:"Prosódia mod_firewall",uri:"/peertube-plugin-livechat/pt-br/documentation/admin/mod_firewall/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers > Bot de bate-papo",content:`Você pode configurar vários temporizadores que irão enviar mensagens em um intervalo de tempo regular. Estas mensagens serão enviadas pelo bot a cada X minutos. Você pode por exemplo, fazer com que o bot envie alguma informação de patrocínio a cada 5 minutos.
Tip Se não houver nenhum usuário na sala de bate-papo, o bot não enviará nenhuma mensagem.
Temporizador Você pode configurar vários temporizadores que irão enviar mensagens em um intervalo de tempo regular. Estas mensagens serão enviadas pelo bot a cada X minutos. Você pode por exemplo, fazer com que o bot envie alguma informação de patrocínio a cada 5 minutos.
Uma mensagem por linha. Se houver várias mensagens, ele escolherá uma aleatoriamente a cada X minutos.
Enviar a cada X minutos O bot irá enviar a mensagem a cada X minutos.`,description:"O bot pode enviar periodicamente algumas mensagens.",tags:[],title:"Temporizadores",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/bot/quotes/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers > Bot de bate-papo",content:`Você pode configurar o bot para responder a comandos. Um comando é uma mensagem que começa com “!”, como por exemplo “!help” que chama o comando “help”.
Você pode configurar vários comandos.
Comando O comando, sem iniciar com “!”. Por exemplo “ajuda”, “financie”, …
Mensagem A mensagem a ser enviada.`,description:"O bot pode responder a vários comandos.",tags:[],title:"Comandos",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/bot/commands/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Contribuindo",content:`Fale sempre sobre os recursos que você quer desenvolver, criando/encontrando e comentando o problema que o aborda antes de começar a trabalhar nele, e informe à comunidade que você começou a codificar reivindicando o problema.
O Pull Request deve ser feito no branch main.
Note Até março de 2023, as contribuições eram feitas no branch develop. Este procedimento está obsoleto.
Pré-requisito para construir este plugin É altamente recomendável estar familiarizado com os seguintes conceitos:
Git NodeJS NPM Texto datilografado Para construir o plugin, você deve ter os seguintes pacotes:
git npm (>=8.x) nodejs (>=14.x) construção-essencial coreutils wget reutilização Observe que este plugin precisa de uma AppImage para o servidor Prosody XMPP. Esta AppImage é fornecida pelo projeto paralelo Prosody AppImage. O script build-prosody.sh baixa os binários anexados a este repositório remoto e verifica se seus hashsums sha256 estão corretos.
Desenvolver Clone o repositório, construa o plugin e crie seu branch de recurso:
# Clone o repositório. Não se esqueça de usar --recursive para clonar submódulos. git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git --recursive cd peertube-plugin-livechat # Instale as dependências do NPM e compile o módulo pela primeira vez: npm install # Compile o plugin após uma modificação: npm run build # Se você tiver um fork do repositório, adicione-o como remoto (exemplo): git remote add me git@github.com:MY_GITHUB_ACCOUNT/peertube-plugin-livechat.git # Crie uma ramificação local para seus desenvolvimentos e faça check-out dela (exemplo): git checkout my_development # Observação: se um problema estiver associado, use fix_1234 como nome do seu branch (onde 1234 é o número do issue) # Para propor suas modificações, envie seu branch para seu repositório (exemplo): git push --set-upstream me my_development # Em seguida, vá para seu repositório github com seu navegador da web para propor o Pull Request (veja instruções adicionais abaixo)Quando estiver pronto para mostrar seu código e solicitar feedback, envie um rascunho de Pull Request. Quando estiver pronto para uma revisão de código antes da mesclagem, envie um Pull Request. De qualquer forma, vincule seu PR aos problemas que ele resolve usando a sintaxe do GitHub: “fixes #issue_number”.
O código do front-end está na pasta client, o código do back-end em server. Há alguns códigos compartilhados na pasta shared.
Para instruções gerais (desenvolvimento de plugins, construção, instalação, …), consulte a documentação do Peertube.
Você pode construir o plugin com recursos extras de depuração simplesmente usando:
NODE_ENV=dev npm run buildEste plugin é compatível com REUSE: ele usa cabeçalhos SPDX para identificar informações de licenciamento de seu código-fonte. Mais informações no site REUSE. Você pode usar a ferramenta de linha de comando reuse para ajudar a atualizar os cabeçalhos. O comando npm run lint usará o comando reuse para verificar a conformidade. Não se esqueça de adicionar suas informações de direitos autorais nos cabeçalhos SPDX ao modificar algum código.
ESBuild vs Typescript Este plugin usa o ESBuild para geração de código frontend, como o plugin oficial peertube-plugin-quickstart. O ESBuild pode lidar com Typescript, mas não verifica os tipos (consulte a documentação do ESBuild). É por isso que primeiro compilamos o Typescript com a opção -noEmit, apenas para verificar os tipos (check:client:ts no arquivo package.json). Em seguida, se tudo estiver correto, executamos o ESBuild para gerar o JavaScript compilado.
Modo de depuração Este plugin possui um modo de depuração que reduz um pouco o atraso. Por exemplo, alguns arquivos de log serão atualizados a cada dois minutos, em vez de uma vez por dia. Isso permite testar com mais facilidade determinadas ações, que normalmente levariam horas ou dias para serem concluídas.
Para habilitar este modo, você só precisa criar o arquivo /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/debug_mode (substituindo /var/www/peertube/storage/ pelo caminho correto na sua instalação).
A simples existência deste arquivo é suficiente para acionar o modo de depuração. Para garantir que ele seja levado em consideração, você pode reiniciar sua instância do Peertube.
Este arquivo pode conter JSON para habilitar opções mais avançadas. Para obter uma lista dos parâmetros existentes, consulte server/lib/debug.ts. Reinicie o Peertube após cada modificação de conteúdo.
Warning Não habilite este modo em um servidor de produção, nem em um servidor público. Isso pode causar problemas de segurança.
Reiniciar Prosódia Quando o modo de depuração estiver ativado, você pode reiniciar o Prosody usando esta chamada de API: http://your_instance.tld/plugins/livechat/router/api/restart_prosody. Esta chamada não requer autenticação. Pode ser feita a partir de uma linha de comando, por exemplo, usando curl http://your_instance.tld/plugins/livechat/router/api/restart_prosody.
Depurador de prosódia É possível conectar o Prosody AppImage a um depurador remoto usando MobDebug.
Para isso, você precisa configurar o MobDebug em uma pasta acessível ao usuário peertube. Em seguida, adicione isto ao arquivo debub_mode:
{ "debug_prosody": { "debugger_path": "/o_caminho_para_o_mobdebug/src", "host": "localhost", "porta": "8172" } }host e port são opcionais. debugger_path deve apontar para a pasta onde está o arquivo .lua MobDebug.
Reinicie o Peertube.
Inicie seu servidor depurador.
Para que o Prosody se conecte ao depurador, chame a API http://your_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true. Essa chamada não requer autenticação. Ela pode ser feita a partir de uma linha de comando, por exemplo, com curl http://your_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true. Você pode até configurar seu servidor de depuração para iniciar essa solicitação automaticamente.
O Prosody será reiniciado, conectando-se ao depurador.
Ambiente de desenvolvimento rápido usando Docker Há um tutorial, em francês, no fórum Peertube que explica como construir rapidamente um ambiente de desenvolvimento usando o Docker.
Um repositório foi criado a partir dele, confira pt-plugin-dev.
Observação: por um motivo desconhecido, o Prosody não consegue resolver o endereço DNS dos contêineres ao usar a biblioteca lua-unbound. Há um truque sujo no plugin: basta criar um arquivo /data/plugins/data/peertube-plugin-livechat/no_lua_unbound no seu docker-volumes e reiniciar os contêineres.
Reconstrua e instale o plugin rapidamente Ao fazer modificações, você não precisa sempre reconstruir o projeto inteiro e reinstalar o plugin no seu ambiente de desenvolvimento. Você pode compilar apenas a parte modificada (por exemplo, se você modificou apenas os arquivos do cliente: npm run build:client). Verifique os arquivos package.json para ver os scripts de compilação disponíveis.
Quando o plugin já estiver instalado na sua instância de desenvolvimento e você não tiver alterado nenhuma dependência, você pode instalar seu trabalho rapidamente seguindo estas etapas:
reconstruir partes necessárias do plugin (cliente, estilos, …), sobrescrever o conteúdo data/plugins/node_modules/peertube-plugin-livechat/dist/ da sua instância dev pelo conteúdo da pasta dist do plugin, alterar recursivamente o proprietário dos arquivos plugins/node_modules/peertube-plugin-livechat/dist/ para seu usuário peertube, reinicie sua instância. Testes de desempenho O repositório livechat-perf-test contém algumas ferramentas para realizar testes de desempenho. Ele pode ser usado para avaliar melhorias no código ou encontrar gargalos.`,description:"Desenvolver",tags:[],title:"Desenvolver",uri:"/peertube-plugin-livechat/pt-br/contributing/develop/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário",content:`OBS é um software de streaming popular, gratuito e de código aberto, com recursos avançados para suas transmissões ao vivo. Nesta página, você encontrará algumas dicas para gerenciar seus chats ao vivo usando o OBS.
Sobreposição OBS Você pode facilmente incluir o bate-papo no seu fluxo de vídeo.
Você pode usar o recurso “Compartilhar link do chat” para gerar uma URL para o seu chat. Este botão deve estar próximo ao chat se você for o proprietário do vídeo (a menos que tenha sido desativado pelos administradores do seu servidor).
Marque a caixa de seleção “Somente leitura” no modal.
Em seguida, use este link como uma “fonte do navegador da web” no OBS.
Você pode usar a opção “Fundo transparente (para integração com sistemas de transmissão, como por exemplo OBS)” para ter um fundo transparente no OBS. Se quiser personalizar a transparência do fundo, adicione este CSS nas configurações do código-fonte do navegador do OBS:
:root { --livechat-transparent: rgba(255 255 255 / 90%) !important; } No trecho CSS anterior, você pode, é claro, alterar a cor ou a transparência, adaptando os valores da cor.
Observação: você pode personalizar totalmente as cores do chat. Isso ainda não está documentado, mas você pode tentar o seguinte: no modal, marque a opção “usar cores do tema atual” e tente alterar manualmente os valores de cor na URL. Você deve usar valores de cor CSS válidos, e eles devem estar codificados corretamente na URL.
Doca OBS Info Esta funcionalidade está disponível com o plugin livechat versão 10.1.0. Warning Esse recurso pode ser desabilitado pelos administradores da instância.
Você pode usar os “Docks de navegador personalizados” do OBS para integrar o chat ao seu OBS durante a transmissão. O plugin de chat ao vivo oferece uma maneira de criar um token de longo prazo que pode identificá-lo automaticamente para entrar no chat, para que você não precise digitar sua senha no OBS.
Para isso, basta usar o recurso “Compartilhar link do chat” e abrir a aba “Doca”. A partir daí, você pode criar um novo token usando o botão “+”.
Em seguida, copie a URL e use o menu “Docks / Docks de navegador personalizados” do seu OBS para adicionar um dock com essa URL.
Depois de fazer isso, você terá um novo dock conectado ao bate-papo com sua conta.
Tip Tokens são válidos para entrar em qualquer sala de bate-papo. Você não precisa gerar tokens separados para cada uma das suas salas. Você também pode personalizar o apelido que será usado alterando o parâmetro n na URL.
Não compartilhe esses links com ninguém, pois isso permitirá que eles se conectem como se fossem você.
Se um token for comprometido ou não for mais necessário, você pode revogá-lo.
Info Esses tokens podem ser usados para outros fins, como conectar-se à sua conta com bots ou clientes XMPP. Este recurso ainda não está documentado e não possui suporte oficial. Portanto, use com cuidado.
Misturando vários chats em sua transmissão ao vivo Você pode usar a extensão de navegador social_stream para misturar várias fontes de bate-papo (do Peertube, Twitch, YouTube, Facebook, …) e incluir seus conteúdos na sua transmissão ao vivo. A compatibilidade com este plugin foi adicionada em versões recentes.`,description:"Documentação para transmitir o conteúdo do bate-papo usando o OBS.",tags:[],title:"OBS",uri:"/peertube-plugin-livechat/pt-br/documentation/user/obs/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do administrador",content:` Clientes XMPPPermitir conexões usando clientes XMPP
Usando MatterbridgeUsando o Matterbridge para fazer a ponte com outros chats`,description:"Alguns recursos avançados",tags:[],title:"Uso avançado",uri:"/peertube-plugin-livechat/pt-br/documentation/admin/advanced/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Guia de instalação",content:`NOTA IMPORTANTE Desde a versão v6.0.0, este plugin não necessita de instalação do Prosody.
Se você estava usando este plugin antes desta versão e se instalou o Prosody manualmente, você pode desinstalá-lo com segurança.
Se você estava usando a imagem do Docker personalizada do Peertube que está incorporando o Prosody, você pode voltar para a imagem oficial do Peertube.`,description:"Notas importantes ao atualizar para uma versão mais antiga.",tags:[],title:"Atualização de versão anterior à 6.0.0",uri:"/peertube-plugin-livechat/pt-br/documentation/installation/upgrade_before_6.0.0/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Contribuindo",content:`informações gerais Sempre informe a comunidade antes de trabalhar (criando um novo problema ou comentando um existente). Isso evita que duas pessoas trabalhem na mesma coisa e previne conflitos.
O trabalho de documentação deve ser mesclado no branch main.
O código-fonte da documentação está na pasta support/documentation/content.
A documentação é gerada usando Hugo. Você precisa instalá-lo no seu computador se quiser visualizar seu trabalho.
A versão mínima necessária para o Hugo é 0.121.0. Ele foi testado com a versão 0.132.2.
O tema usado é hugo-theme-relearn. Você deve ler a documentação antes de começar a editá-la.
Quando uma nova versão do plugin é lançada ou quando a documentação é atualizada, os mantenedores do plugin mesclam a ramificação “main” com a ramificação “documentation”. Isso acionará os pipelines do GitHub e do GitLab e atualizará a documentação publicada.
Traduções O idioma principal é o inglês (código en).
A pasta support/documentation/content/en contém apenas arquivos de documentação em inglês.
A documentação é traduzida usando o Weblate (veja a documentação de tradução). Para isso, usamos a ferramenta po4a, como veremos mais adiante nesta página.
Adicionar um novo idioma No arquivo support/documentation/config.toml, copie e modifique a seção [Languages.fr].
Se as traduções não estiverem completas, não importa, o inglês será usado para as strings faltantes.
Pré-visualização Para visualizar suas modificações, basta executar:
hugo serve -s support/documentation/ Em seguida, abra seu navegador no endereço http://localhost:1313/peertube-plugin-livechat/. Esta página será atualizada automaticamente a cada modificação.
Atualizar arquivos de localização e gerar traduções de documentação Por enquanto, você só tem a versão em inglês. Para atualizar as strings de documentação e gerar traduções, você precisa executar o script doc-translate.sh.
To do so, make sure you have po4a (version >= 0.69) installed on your computer.
Warning Algumas distribuições Linux (como o Debian Bullseye, por exemplo) possuem versões muito antigas do po4a. Certifique-se de instalar uma versão compatível. Se você estiver usando o Debian Bullseye, por exemplo, pode baixar o arquivo Bookworm po4a.deb em https://packages.debian.org e instalá-lo manualmente.
Para lidar com traduções, basta fazer:
npm run doc:translate Você pode então visualizar o resultado usando hugo serve -s support/documentation/ e usar o seletor de idioma.
Escrever documentação Basta editar os arquivos em inglês em support/documentation/content/en.
Então, antes de confirmar, sempre execute npm run doc:translate, para que as alterações nos arquivos em inglês possam ser propagadas para o arquivo support/documentation/po/livechat.en.pot.
Você pode usar o código curto livechat_label para usar strings de aplicativo. Veja aqui: Tradução da documentação.
É possível impedir que um arquivo seja traduzido usando livechatnotranslation: true na seção Yaml Font Matter. Veja aqui: Tradução da documentação.
Use a opção livechatnotranslation para documentação técnica. Não queremos que a documentação técnica seja traduzida para evitar problemas devido a uma tradução incorreta.
Para facilitar o trabalho dos tradutores, evite fazer parágrafos muito longos.
Por enquanto, não é possível usar tabelas Markdown: as ferramentas de tradução irão quebrá-las.
Warning Pode haver links para esta documentação em outros lugares da web. Tente não alterar os URLs das páginas de documentação. Ou, pelo menos, insira links para o novo local no URL anterior.
Quando um novo recurso é lançado, você pode usar o código curto livechat_version_notice para exibir uma infobox com a versão em que o recurso está disponível. Este código curto recebe o número da versão como parâmetro. Veja um exemplo:
Info Esta funcionalidade está disponível com o plugin livechat versão 12.0.0. E se eu não puder usar hugo e/ou po4a? Basta editar os arquivos markdown em inglês e especificar que você não pode criar traduções ao fazer seu Pull Request.
Publicação A publicação da documentação é automática, assim que as alterações são mescladas na ramificação documentation.`,description:"Documente o plugin ou traduza a documentação.",tags:[],title:"Documentação",uri:"/peertube-plugin-livechat/pt-br/contributing/document/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Technical documentation",content:`The livechat plugin stores some data on the server, in the /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/ folder. This page describes these data.
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
emojis/channel/1/definition.json: the JSON file containing the emojis definitions emojis/channel/1/files/42.png: N image files (png, jpg, …), using numbers as filenames. tokens The tokens folder contains long term token to connect to the chat. See the LivechatProsodyAuth class for more information.`,description:"Data files and folders used on the server",tags:[],title:"Plugin storage",uri:"/peertube-plugin-livechat/pt-br/technical/data/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do administrador > Uso avançado",content:`O seguinte é baseado em um tutorial para usar o Matterbridge com o plugin: Matterbridge + Peertube
Requisitos Plugin PeerTube livechat versão 3.2.0 ou posterior. Matterbridge versão 1.22.4 ou posterior. O mais fácil é se a instância do PeerTube e o Matterbridge forem executados no mesmo servidor.
Somente conexões internas (básicas) Você precisará habilitar Habilitar conexões de cliente para servidor nas configurações do plugin de chat ao vivo.
Isso permitirá que clientes XMPP do host local se conectem ao servidor Prosody XMPP.
Talvez você precise adicionar alguma linha ao seu /etc/hosts:
127.0.0.1 anon.example.org room.example.org Substitua example.org pelo nome de domínio da sua instância. Depois disso, você pode continuar com a configuração do Matterbridge abaixo.
Permitir conexões externas (avançado) Por padrão, o servidor interno Prosody XMPP escuta apenas no host local (127.0.0.1).
On livechat versions >= 10.1.0 a new option call Client to server network interfaces was added to allow changing this.
Permite adicionar uma lista de IPs para escutar, separados por vírgulas (os espaços serão removidos).
Você também pode usar * para escutar em todas as interfaces IPv4 e :: para todas as IPv6. Isso permite acesso externo à interface cliente-servidor.
Em seguida, você precisa abrir a porta C2S (por padrão, 52822, mas verifique as configurações do plugin para obter o valor atual) no seu firewall para que ela possa ser acessada pela internet. Se você não quiser usar conexões C2S para nada além do seu serviço Matterbridge, restrinja o acesso a essa porta ao IP do seu servidor Matterbridge.
Você também precisa adicionar registros DNS (A e AAAA) para anon.example.org e room.example.org (substitua example.org pelo seu nome de domínio real).
Caso você esteja usando uma porta diferente de 5222 (porta padrão XMPP), você também precisa definir o registro SRV do cliente xmpp para a porta correta.
Configurando o Matterbridge Na versão 1.22.4, o Matterbridge adicionou suporte para conexões anônimas XMPP necessárias para conectar à prosódia integrada.
Então no arquivo de configuração TOML coloque:
[xmpp.mypeertube] Anonymous=true Server="anon.example.org:52822" Muc="room.example.org" Nick="Matterbridge" RemoteNickFormat="[{PROTOCOL}] <{NICK}> " NoTLS=true Substitua example.org pelo nome de domínio da sua instância real. Substitua 52822 pela porta real, caso você a tenha alterado. mypeertube pode ser substituído por outro nome. Usar peertube como Nick fornecerá o ícone do PeerTube para mensagens de sobreposição, o que também pode ser feito com modificações na configuração da sobreposição. A configuração NoTLS=true permite conectar a um servidor com certificados autoassinados. Agora você pode adicionar esta conta a gateways e conectar canais de bate-papo ao vivo específicos.
Info Esta documentação utiliza uma conta anônima para conectar a ponte ao chat. Mas, desde o LiveChat v10.1.0, existe uma nova maneira de gerar um token de autenticação de longo prazo, que permite a conexão usando sua conta. Isso é usado para docas OBS. O uso desse recurso para outros fins não está documentado e ainda não é oficialmente suportado. Se você quiser usá-lo mesmo assim, pode solicitar um token chamando o endpoint /plugins/livechat/router/api/auth/tokens. Para obter os cabeçalhos e o corpo da solicitação necessários, basta verificar o que acontece quando você gera um novo token para docas OBS.`,description:"Usando o Matterbridge para fazer a ponte com outros chats",tags:[],title:"Usando Matterbridge",uri:"/peertube-plugin-livechat/pt-br/documentation/admin/advanced/matterbridge/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário",content:`Este plugin de bate-papo utiliza o protocolo XMPP (também conhecido como Jabber). Portanto, é possível conectar-se aos bate-papos usando software cliente XMPP. Isso pode ser útil, por exemplo, para facilitar as operações de moderação.
Info Os recursos descritos nesta página devem ser habilitados e configurados pelos administradores da sua instância do Peertube. Portanto, você pode não ter acesso a eles.
Entre na sua conta Peertube Warning Este recurso ainda não está disponível e estará disponível em uma versão futura do plugin.
Conexão usando uma conta XMPP externa Se esse recurso estiver habilitado na sua instância, você poderá se conectar aos chats do Peertube usando qualquer conta XMPP.
Para obter o endereço da sala na qual deseja entrar, você pode usar o botão “compartilhar chat” localizado acima do chat:
Info Por padrão, o botão de compartilhamento fica visível apenas para o proprietário do vídeo e os administradores/moderadores da instância. No entanto, os administradores podem optar por exibir este botão para todos.
Em seguida, escolha “Conectar usando XMPP”:
Depois, basta clicar em “abrir” ou copiar/colar o endereço da sala de bate-papo no seu cliente XMPP (usando o recurso “entrar em uma sala”).`,description:"Conecte-se ao chat usando um cliente XMPP",tags:[],title:"Clientes XMPP",uri:"/peertube-plugin-livechat/pt-br/documentation/user/xmpp_clients/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube",content:`Interessado em contribuir? Ótimo!
Código de CondutaCódigo de Conduta do Pacto do Colaborador
TraduzirTraduzir o plugin
Dê seu feedbackDê seu feedback
DesenvolverDesenvolver
DocumentaçãoDocumente o plugin ou traduza a documentação.`,description:"Contribuindo",tags:[],title:"Contribuindo",uri:"/peertube-plugin-livechat/pt-br/contributing/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Technical documentation",content:`The livechat plugin includes a “slow mode” feature, to rate limit the number of messages that a user can send to a given MUC room. At time of writing, there were no XEP to describe such feature. Please find below a XEP draft, that will be submitted for review.
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
Appendix F: Requirements Conformance The following requirements keywords as used in this document are to be interpreted as described in RFC 2119: “MUST”, “SHALL”, “REQUIRED”; “MUST NOT”, “SHALL NOT”; “SHOULD”, “RECOMMENDED”; “SHOULD NOT”, “NOT RECOMMENDED”; “MAY”, “OPTIONAL”.`,description:"MUC Slow mode XEP",tags:[],title:"MUC Slow mode",uri:"/peertube-plugin-livechat/pt-br/technical/slow_mode/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Technical documentation",content:`The poll system relies on two thinks:
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
As the backend does no localization, it also translate on the fly the english sentences coming from the backend (in the form definition, in poll start/end message, and in bounce/error messages).`,description:"Polls technical documentation",tags:[],title:"Pesquisas",uri:"/peertube-plugin-livechat/pt-br/technical/polls/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Technical documentation",content:`You can set terms & conditions on the instance level (called “global terms”), or at the streamers’ channels level (called “muc terms”, as it is related to muc rooms).
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
if terms are modified if the user switch to another channel if the user switch to a video from a different peertube instance `,description:"Terms&Conditions implementation",tags:[],title:"Terms&Conditions",uri:"/peertube-plugin-livechat/pt-br/technical/terms/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube",content:`Se você tiver novas solicitações de recursos, bugs ou dificuldades para configurar o plugin, pode usar o Rastreador de problemas do GitHub. Se possível, tente usar inglês ou francês.
Para ter uma ideia do roteiro dos próximos recursos, consulte:
este projeto github. os marcos no github. Se você é um webdesigner ou especialista em ConverseJS/Prosody/XMPP e quer ajudar a melhorar este plugin, seja bem-vindo.`,description:"Rastreamento de bugs / Solicitações de novos recursos",tags:[],title:"Bug tracking & new features",uri:"/peertube-plugin-livechat/pt-br/issues/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Technical documentation",content:`The livechat plugin includes a Task Application. The present document describes how this is implemented.
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
Listas de tarefas Item tag: tasklist XML Namespace: urn:peertube-plugin-livechat:tasklist item childs: name: the text content is the task list name Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="45cf7543-67bf-4d03-bb5d-a55038a0512a:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <tasklist xmlns="urn:peertube-plugin-livechat:tasklist"> <name>Task List Name</name> </tasklist> </item> </publish> </pubsub> </iq>Tarefas Item tag: task XML Namespace: urn:peertube-plugin-livechat:task item attributes: done: if present and equal to “true”, means that the task is done list: the list id order: the order of the task in the task list item childs: name: the text content is the task name description: the text content is the task description Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="9fd9a162-1b6c-4b38-a2a1-2485b34f0d8d:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <task list="8302c024-c16e-4fbd-aca7-c94cdb2025de" order="0" done="true" xmlns="urn:peertube-plugin-livechat:task" > <name>The task name</name> <description>here is the description</description> </task> </item> </publish> </pubsub> </iq>Note: in the above example, we added done="true" just for the example. Don’t add the attribute if you want not the task to be marked as done (or if you want to undone the task).`,description:"Task Application technical overview",tags:[],title:"Tasks overview",uri:"/peertube-plugin-livechat/pt-br/technical/tasks/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Technical documentation",content:`The livechat plugin includes a Moderation Notes Application. The present document describes how this is implemented.
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
<iq from="user@example.com" id="64da7e38-4dd5-4f55-b46f-297232232971:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client"> <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-notes"> <item id="8ab78df9-a7b9-4315-943d-c340935482af"> <note order="11" xmlns="urn:peertube-plugin-livechat:note" > <description>Some text.</description> <note-about jid="khkecy3nkddwxdllgzdub-dv@anon.p1.localhost" nick="Mickey" > <occupant-id id="ga4mR2IKEvRKuzN1gJYVafCTbY1gNvgNvNReqdVKexI=" xmlns="urn:xmpp:occupant-id:0" /> </note-about> </note> </item> </publish> </pubsub> </iq>`,description:"Moderator Notes Application technical overview",tags:[],title:"Moderator notes overview",uri:"/peertube-plugin-livechat/pt-br/technical/moderation_notes/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube",content:` Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
PesquisasPolls technical documentation
Terms&ConditionsTerms&Conditions implementation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview`,description:"Technical documentation",tags:[],title:"Technical documentation",uri:"/peertube-plugin-livechat/pt-br/technical/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube",content:`Se você tiver alguma dúvida ou quiser conversar sobre este plugin, você pode entrar nesta sala XMPP com qualquer cliente Jabber: plugin-livechat-support@room.im.yiny.org.
Se você quiser apoiar o projeto financeiramente, pode entrar em contato comigo por e-mail em git.[at].john-livingston.fr ou conferir meu perfil do Liberapay.`,description:"Entre em contato com o autor",tags:[],title:"Entre em contato comigo",uri:"/peertube-plugin-livechat/pt-br/contact/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube",content:`Os arquivos package.json, COPYRIGHT e LICENSE contêm as informações de licença deste software e suas dependências.
O plugin é mantido por John Livingston.
Agradecimentos a David Revoy por seu trabalho no mascote do Peertube, Sepia. O design do personagem está sob licença CC-By, e os arquivos SVG usados para criar alguns logotipos e avatares neste plugin são GPLv3.0. Os arquivos PNG estão sob licença CC-By e vêm do Gerador de Avatares Sepia online.
Obrigado a Framasoft por tornar Peertube possível, pelo suporte financeiro e por hospedar as traduções do projeto em sua instância Weblate.
Obrigado a ritimo pelo apoio financeiro.
Obrigado a Code Lutin e Rétribution Copie Publique pelo apoio financeiro.
Obrigado a NlNet e ao fundo NGI0 Entrust pelo apoio financeiro.
Obrigado a Octopuce pelo apoio financeiro.
E obrigado a todos os colaboradores individuais que fizeram uma doação através da minha página liberapay.`,description:"Créditos do plugin",tags:[],title:"Créditos",uri:"/peertube-plugin-livechat/pt-br/credits/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:`Habilitando o chat para suas transmissões ao vivo Warning Os administradores de instância podem optar por desabilitar ou habilitar o chat em casos específicos. As informações nesta seção são verdadeiras apenas no caso padrão.
Ao criar ou modificar um Peertube ao vivo, há uma aba “configurações do plugin”:
Na aba “Configurações do plugin”, há uma caixa de seleção “Usar chat”. Basta marcá-la ou desmarcá-la para ativar ou desativar o bate-papo associado ao seu vídeo.
Tip Pode haver outras configurações nesta aba, dependendo dos plugins instalados na sua instância do Peertube.
Bate-papo por canal No nível da instância, os administradores do Peertube podem escolher se as salas de bate-papo serão exclusivas para cada vídeo ou se haverá uma sala de bate-papo exclusiva para cada canal. Entre em contato com os administradores da sua instância para obter mais informações sobre como configurar o plugin de bate-papo ao vivo.
Compartilhe o bate-papo No topo do chat, há um botão “Compartilhar link do chat”.
Este botão abre um pop-up, onde você pode obter uma URL para entrar no chat. Essa URL pode ser compartilhada.
A aba “Embutido” fornece alguns links para incorporar o bate-papo em sites ou na sua transmissão ao vivo.
Você pode personalizar algumas opções:
Somente leitura: você só poderá ler o chat, não escrever. Isso é útil para incluir o conteúdo do chat na sua transmissão ao vivo (consulte a documentação do OBS). Utilizar cores do tema atual: se marcado, as cores do seu tema atual serão adicionadas à URL, para que qualquer usuário que abrir o link tenha o mesmo conjunto de cores. Gerar um iframe para embutir o chat em uma página: em vez de uma URL, você obterá um snippet HTML que pode adicionar ao seu site para incorporar o chat. Para mais informações sobre a aba “Doca”, verifique a documentação do OBS.
Na aba “Web”, o URL fornecido abre o chat na interface do Peertube. Você pode compartilhar este link com outros usuários para convidá-los a participar do chat.
O pop-up “Compartilhar link do chat” também pode conter uma aba “Conectar usando XMPP”. Isso só estará disponível se os administradores da sua instância tiverem habilitado e configurado corretamente esta opção. Usando esta opção, você pode fornecer um link para entrar no chat usando qualquer software cliente XMPP. O uso desses softwares pode, por exemplo, facilitar ações de moderação.
Moderação Consulte a documentação de moderação.
Inclua o bate-papo no seu fluxo de vídeo Consulte a documentação do OBS.
Persistência de bate-papo Por padrão, o chat é persistente. Isso significa que o conteúdo da sala será mantido por um tempo. Os usuários que entrarem verão as mensagens publicadas antes de entrarem.
Você pode alterar o comportamento de persistência. Abra o menu suspenso do bate-papo e clique em “Configurar”.
Há várias opções que podem ser alteradas.
Você pode, por exemplo, definir o número padrão e máximo de mensagens para retornar a 0, para que novos usuários não vejam nenhuma mensagem enviada anteriormente.
Você também pode desmarcar “Habilitar arquivamento”: se desmarcado, as mensagens serão removidas se o servidor for reiniciado.
Ao desmarcar “Persistente”, a sala será limpa se não houver mais participantes.
Excluir o conteúdo do bate-papo Se quiser excluir o conteúdo do chat, abra o menu suspenso do chat e clique em “Destruir”. Um pop-up será aberto, solicitando confirmação.
O bate-papo será recriado automaticamente sempre que alguém tentar entrar, desde que o vídeo exista e tenha o recurso “Usar chat” ativado.`,description:"Algumas noções básicas sobre como configurar e usar o chat para sua transmissão ao vivo",tags:[],title:"Alguns princípios básicos",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/basics/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Este recurso vem com o plugin LiveChat versão 8.0.0 e pode ser desabilitado pelos administradores da sua instância.
No menu esquerdo do Peertube, há uma entrada “Salas de chat”:
Este link “Salas de chat” leva você a uma lista dos seus canais. Ao clicar em um canal, você poderá configurar algumas opções para ele:
Aqui você pode configurar:
Termos e condições do chat do canal Mutar usuários anônimos valor padrão O modo lento O bot de bate-papo Emojis personalizados Mais recursos em breve… `,description:"Configuração de salas de chat do canal Peertube",tags:[],title:"Configuração de canal",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/channel/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário",content:` Alguns princípios básicosAlgumas noções básicas sobre como configurar e usar o chat para sua transmissão ao vivo
Configuração de canalConfiguração de salas de chat do canal Peertube
AnúnciosProprietários e administradores de salas podem enviar anúncios especiais no chat.
ModeraçãoRecursos avançados de moderação do plugin peertube-plugin-livechat
Terms & conditionsConfigure channel's chat terms & conditions
Modo lentoPlugin peertube-plugin-livechat modo lento
Atraso de moderaçãoAtraso de moderação do plugin peertube-plugin-livechat
Emojis personalizadosPlugin peertube-plugin-livechat emojis personalizados
Modo somente emojisPlugin peertube-plugin-livechat modo apenas emojis
PesquisasVocê pode criar enquetes para perguntar a opinião dos espectadores
Tarefas / Listas de tarefasVocê pode gerenciar tarefas e listas de tarefas com sua equipe de moderação.
Notas de moderaçãoNotas de moderação do plugin peertube-plugin-livechat
Bot de bate-papoConfiguração do bot de bate-papo
Caracteres especiaisO bot pode moderar automaticamente mensagens que contenham muitos caracteres especiais.
Nenhuma mensagem duplicadaO bot pode moderar automaticamente mensagens duplicadas.
Palavras proibidasO bot pode moderar automaticamente mensagens contendo palavras proibidas.
TemporizadoresO bot pode enviar periodicamente algumas mensagens.
ComandosO bot pode responder a vários comandos.`,description:"Como configurar o chat para sua transmissão ao vivo",tags:[],title:"Para streamers",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 12.0.0. Proprietários e administradores de salas podem enviar anúncios especiais no chat.
Essas mensagens serão mais visíveis do que as mensagens padrão.
Para enviar anúncios, proprietários e administradores terão um seletor “Tipo de mensagem” na parte superior do campo de mensagem:
Existem vários tipos de mensagens:
Padrão: para enviar uma mensagem padrão. Destaque: essas mensagens serão simplesmente destacadas em uma caixa azul. Anúncio: essas mensagens estarão em uma caixa verde e um título em negrito “Anúncio” será adicionado. Aviso: essas mensagens estarão em uma caixa de recorte e um título em negrito “Anúncio” será adicionado. Info Usuários que não são proprietários ou administradores da sala de bate-papo não podem enviar tais mensagens.
Warning Observação: os clientes XMPP padrão exibirão anúncios como mensagens padrão.`,description:"Proprietários e administradores de salas podem enviar anúncios especiais no chat.",tags:[],title:"Anúncios",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/announcements/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Warning Esta seção ainda está incompleta.
Warning This page describes the behaviour of livechat versions >= 10.0.0. There were some changes in the way we manage access rights for Peertube administrators and moderators.
O bot de bate-papo Você pode usar um bot de bate-papo para ajudar na moderação. Consulte a documentação do bot de bate-papo para mais informações.
Acessando ferramentas de moderação Você pode acessar as configurações da sala e as ferramentas de moderação usando o menu suspenso do bate-papo na parte superior do bate-papo.
Tip O proprietário do vídeo será o proprietário da sala de bate-papo. Isso significa que ele pode configurar a sala, excluí-la, promover outros usuários como administradores, etc.
Tip A partir do Livechat v10.0.0, os administradores e moderadores da instância do Peertube não têm direitos especiais nas salas por padrão. No entanto, eles têm um botão especial disponível na parte superior do chat: “Tornar-se moderador”. Clicar neste botão dará a eles acesso de proprietário à sala.
Você pode usar comandos de moderação do ConverseJS para moderar a sala. Ao abrir a sala de bate-papo em tela cheia, também haverá um menu com comandos dedicados no canto superior direito.
Mutar usuários anônimos Info Esta funcionalidade está disponível com o plugin livechat versão 10.2.0. Você pode impedir que usuários anônimos enviem mensagens. Nesse caso, apenas usuários registrados poderão conversar no chat.
Para ativar ou desativar este recurso, use o menu suspenso do bate-papo, abra o menu “configurar”. No formulário, você encontrará uma caixa de seleção “Mutar usuários anônimos”.
Usuários anônimos não terão o campo de mensagem e verão o seguinte prompt: “Apenas usuários registrados podem enviar mensagens”
Quando este recurso estiver ativado, usuários anônimos receberão a função de “visitante”. Você pode alterar a função deles para “participante” se quiser permitir que alguns deles falem.
Se você alterar a configuração da sala, todos os usuários anônimos serão silenciados ou ativados.
Você pode escolher habilitar ou desabilitar esse recurso para novas salas de bate-papo na página de configuração do canal.
Funções e afiliações Existem várias funções que podem ser atribuídas aos usuários em salas de bate-papo: proprietário, moderadores, membro, …
Warning Esta seção ainda está incompleta.
Você pode promover usuários como moderadores, se precisar de ajuda.
Anonimizar ações de moderação Info Esta funcionalidade está disponível com o plugin livechat versão 11.0.0. É possível tornar anônimas as ações de moderação, para evitar revelar quem está banindo/expulsando/… ocupantes.
Para ativar ou desativar este recurso, use o menu suspenso do bate-papo, abra o menu “configurar”. No formulário, você encontrará uma caixa de seleção “Anonimizar ações de moderação”.
Você pode escolher habilitar ou desabilitar esse recurso para novas salas de bate-papo na página de configuração do canal.
Pesquisa de histórico de mensagens do participante Info Esta funcionalidade está disponível com o plugin livechat versão 11.0.0. Como administrador ou proprietário de uma sala, você pode pesquisar todas as mensagens enviadas por um determinado participante.
Para fazer isso, você tem várias maneiras:
usando a ação “Buscar todas as mensagens” no menu suspenso, além dos participantes na barra lateral usando a ação “Buscar todas as mensagens” no menu suspenso, além das mensagens de bate-papo Tip Para ter mais espaço e melhor legibilidade, abra o chat em modo de página inteira.
Nos resultados da pesquisa, há diversas informações que são mostradas à direita do apelido do participante:
se o apelido atual for diferente do apelido quando o participante enviou a mensagem, o apelido original será mostrado você verá o JID (Jabber ID) do participante você também verá o occupant-id do participante O resultado da pesquisa também incluirá todas as mensagens relacionadas aos participantes que tinham o mesmo apelido. Você pode diferenciá-los comparando JID e occupant-id.
Excluir conteúdo da sala Você pode excluir salas antigas: entre na sala e use o menu no topo para destruí-la.
Moderação de instância Como moderador ou administrador da instância do Peertube, você provavelmente precisará verificar se seus usuários não estão se comportando mal.
Você pode listar todas as salas de bate-papo existentes: na tela de configurações do plugin, há um botão «Listar salas».
A partir daí, você também pode se promover como moderador da sala usando o botão “Tornar-se moderador” à direita.`,description:"Recursos avançados de moderação do plugin peertube-plugin-livechat",tags:[],title:"Moderação",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/moderation/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 10.2.0. Configuração You can add terms & conditions to your channel. These terms will be shown to all users joining the chat.
To configure the terms & conditions, go to the channel configuration page:
A URL na mensagem será clicável. Você também pode personalizar: Estilo da Mensagem.
Espectadores Ao entrar no chat, os espectadores verão os termos:
Info Peertube instance’s admin can also set global terms & conditions. If so, these terms will be shown above your channel’s terms.
Info Anonymous users will only see the terms & conditions once they have chosen their nickname (in other words: once they are able to talk).
Você pode alterar o conteúdo dos termos a qualquer momento, ele será atualizado instantaneamente para todos os espectadores.
Users can hide the terms & conditions. When doing so, terms won’t be shown again, unless you change the content.
Info Se a sua instância do Peertube permitir a participação em chats com clientes XMPP, os usuários que utilizam esses clientes verão os termos como mensagens de chat, provenientes de uma conta “Peertube”. Ao atualizar os termos, eles receberão uma nova mensagem com o conteúdo da atualização.`,description:"Configure channel's chat terms & conditions",tags:[],title:"Terms & conditions",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/terms/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 8.3.0. Introdução Como streamer, você pode escolher limitar a classificação das mensagens dos seus espectadores no chat.
Isso pode ser muito útil para:
evitar inundação de mensagens evite bate-papo ilegível se houver muitos espectadores falando Você pode definir um número de segundos que os usuários terão que esperar após enviar uma mensagem antes de enviar outra.
Esta limitação não se aplica aos moderadores.
Opção de modo lento Na página de configuração do canal, você pode definir a opção de modo lento:
Este valor será aplicado como valor padrão para todas as salas de bate-papo do seu canal.
Definir o valor como 0 desabilitará o recurso.
Definir o valor como um número inteiro positivo definirá o período durante o qual os usuários não poderão postar mensagens adicionais.
Para modificar o valor de uma sala já existente, basta abrir o menu “configuração” da sala (na parte superior da janela de bate-papo) e alterar o valor do modo lento no formulário de configuração.
Para espectadores Se o modo lento estiver ativado, os usuários serão informados por uma mensagem.
Quando eles enviam uma mensagem, o campo de entrada será desabilitado por X segundos (onde X é a duração do modo lento).
Esta limitação não se aplica aos moderadores.`,description:"Plugin peertube-plugin-livechat modo lento",tags:[],title:"Modo lento",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/slow_mode/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 10.3.0. Introdução Como streamer, você pode optar por atrasar as mensagens no chat, para dar tempo aos moderadores de excluírem as mensagens antes que elas possam ser lidas pelos outros participantes.
Quando este recurso estiver ativado, os moderadores verão todas as mensagens sem atraso. Os participantes do chat não verão que suas próprias mensagens estão atrasadas.
Observe que as mensagens enviadas pelos moderadores também serão atrasadas, para evitar que eles respondam a mensagens que nem são visíveis para os outros participantes.
Opção de atraso de moderação Na página de configuração do canal, você pode definir a opção “Atraso de moderação”:
Este valor será aplicado como valor padrão para todas as salas de bate-papo do seu canal.
Definir o valor como 0 desabilitará o recurso.
Definir o valor como um número inteiro positivo definirá o atraso, em segundos, a ser aplicado às mensagens. Evite definir um valor muito alto. O ideal é que não exceda alguns segundos (4 ou 5 segundos, por exemplo).
Para modificar o valor de uma sala já existente, basta abrir o menu “configuração” da sala (na parte superior da janela de bate-papo) e alterar o valor do atraso de moderação no formulário de configuração.
Warning Atualmente, este recurso apresenta um bug conhecido: usuários que entram no chat receberão todas as mensagens, mesmo as que ainda estão pendentes para outros participantes. No entanto, as mensagens enviadas após a entrada serão atrasadas corretamente.
Tip Você pode combinar um curto atraso de moderação (1 segundo, por exemplo) com o bot de moderação para excluir mensagens contendo palavrões antes que qualquer usuário não moderador as veja.
No chat Como moderador, você verá o tempo restante (em segundos) antes da mensagem ser transmitida, ao lado da data e hora da mensagem.`,description:"Atraso de moderação do plugin peertube-plugin-livechat",tags:[],title:"Atraso de moderação",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/moderation_delay/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 10.1.0. Emojis do canal Os streamers podem adicionar emojis personalizados aos seus canais.
Na página de configuração do canal, abra a aba “Emojis do canal”:
Você pode configurar emojis personalizados para seu canal. Esses emojis estarão disponíveis no seletor de emojis. Os usuários também podem usá-los com seus nomes curtos (por exemplo, escrevendo “:shortname:”).
Você pode usar emojis no chat usando “:shortname:”. O nome curto pode começar e/ou terminar com dois pontos (:) e conter apenas caracteres alfanuméricos, sublinhados e hifens. É altamente recomendável iniciá-los com dois pontos, para que os usuários possam usar o preenchimento automático (digitando “:” e pressionando TAB).
Importação / Exportação Na página de configuração do canal, há um botão “Importar” e um botão “Exportar”. O botão “Exportar” gera um arquivo que você pode importar para outro canal.
Você também pode gerar um arquivo para importar de qualquer outra fonte (por exemplo, você pode importar seus emojis personalizados do Twitch). O arquivo deve ser um arquivo JSON válido, usando o seguinte formato:
[ { "sn": ":short_name:", "url": "https://example.com/image.png" } ] O atributo sn é o código do nome abreviado. O atributo url pode ser qualquer URL de imagem que seu navegador possa acessar ou uma URL de dados representando o arquivo que você deseja importar.`,description:"Plugin peertube-plugin-livechat emojis personalizados",tags:[],title:"Emojis personalizados",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/emojis/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 12.0.0. Modo apenas emoji Você pode habilitar o “Modo apenas amoji” em suas slas de chat. Quando este modo está habilitado, os participantes podem apenas enviar amojis (padrões, ou cusomizados do canal). Moderadores não são afetados por esta limitação.
Este modo pode ser útil por exemplo:
Para evitar spam ou mensagens ofensivas quando você não estiver aqui para moderar. Quando há muitos participantes falando e você não consegue mais moderar corretamente. Para ativar ou desativar este recurso, use o menu suspenso do bate-papo, abra o menu “configurar”. No formulário, você encontrará uma caixa de seleção “Modo apenas emoji”.
Se você quiser habilitá-lo para todas as suas salas de bate-papo de uma só vez, abra a página de configuração de emojis do canal e use o botão “Habilitar o modo apenas emoji em todas as salas de chat dos canais”.`,description:"Plugin peertube-plugin-livechat modo apenas emojis",tags:[],title:"Modo somente emojis",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/emojis_only/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 10.2.0. Criar uma enquete Você pode criar uma nova enquete usando a ação “Criar uma nova enquete” no menu superior do chat:
Warning Este recurso de enquete não deve ser considerado um sistema de votação confiável. É fácil trapacear. Não há mecanismo que impeça usuários anônimos de votar várias vezes apenas recarregando o chat. Os votos nunca são totalmente anônimos; alguém com acesso ao servidor pode ver quem votou em qual opção.
Formulário de enquete Preencha os campos do formulário:
“Questão”: a pergunta a ser feita aos espectadores “Duração da enquete (em minutos)”: a duração pela qual os espectadores podem votar “Resultados anônimos”: se marcado, os votos não serão visíveis publicamente no chat “Choice N”: escolhas que serão apresentadas aos espectadores Você deve preencher pelo menos os dois primeiros campos de escolha.
Depois de enviar o formulário, a enquete começará imediatamente.
Se houver uma enquete anterior não concluída, ela será encerrada e seu resultado será exibido.
Direitos de acesso Os administradores de cada sala podem criar uma nova enquete.
Quando você promove alguém como administrador ou proprietário da sala, essa pessoa ganha acesso instantâneo à ação “Criar uma nova enquete”.
Ao remover os direitos de administrador ou proprietário de alguém, essa pessoa não poderá criar uma nova enquete. Mas qualquer enquete existente continuará até o seu término.
Qualquer usuário que não esteja silenciado pode votar. Isso significa que você pode impedir que usuários anônimos votem usando o recurso “Mutar usuários anônimos”.
Fluxo de trabalho de enquete Quando a enquete começar, uma primeira mensagem será enviada no chat, a partir da conta do usuário que criou a enquete.
Um banner também aparecerá para mostrar a enquete e será atualizado regularmente com os votos atuais.
Os espectadores podem então votar clicando em sua escolha ou enviando uma mensagem como “!1” no chat.
A contagem de votos será atualizada regularmente no banner.
Os espectadores podem alterar seu voto a qualquer momento, bastando fazer uma nova escolha. A escolha anterior será substituída pela nova.
Tip Espectadores anônimos só podem votar depois de escolherem seu apelido.
Se a opção “Resultados anônimos” estiver marcada, os votos não serão exibidos para outros usuários. Se desmarcada, os votos ficarão visíveis publicamente, pois você verá uma mensagem como “!1” no chat.
Info Para espectadores que usam clientes XMPP ou versões desatualizadas do plugin de chat ao vivo, o banner não ficará visível. Mas eles verão a mensagem no chat e poderão votar enviando mensagens com suas escolhas.
Quando a enquete terminar, uma nova mensagem será enviada no chat, com os resultados.
Info A única maneira de obter resultados de enquetes antigas é procurar a mensagem de encerramento da enquete no chat. Por enquanto, os resultados das enquetes não são salvos por nenhum outro meio. Portanto, não se esqueça de anotar os resultados das enquetes se quiser mantê-los.`,description:"Você pode criar enquetes para perguntar a opinião dos espectadores",tags:[],title:"Pesquisas",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/polls/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 10.0.0. Introdução O plugin de chat ao vivo inclui um Aplicativo de Tarefas: um tipo de recurso de “lista de tarefas” onde você pode criar listas de tarefas e adicionar tarefas a elas. Os administradores de cada sala têm acesso a essas tarefas, para que você possa editá-las de forma colaborativa.
Você pode, por exemplo, usar o aplicativo de tarefas para:
prepare uma lista de temas que você quer discutir durante sua transmissão ao vivo, para ter certeza de que não vai esquecer nada destaque as perguntas dos seus espectadores, para que você possa retornar a elas mais tarde sem se esquecer de respondê-las … Usando o aplicativo de tarefas Abrindo o aplicativo de tarefas Para abrir o aplicativo de tarefas, há um botão “Tarefas” no menu de bate-papo superior:
Clicar neste botão alternará a exibição do aplicativo de tarefas:
Tip Para ter mais espaço e melhor legibilidade, abra o chat em modo de página inteira.
Direitos de acesso Os administradores de cada sala têm acesso ao aplicativo de tarefas (acesso de leitura e gravação).
Ao promover alguém como administrador ou proprietário de uma sala, essa pessoa obtém acesso instantâneo ao Aplicativo de Tarefas. Ao remover os direitos de administrador ou proprietário de alguém, essa pessoa perde instantaneamente o acesso ao Aplicativo de Tarefas.
Listas de tarefas Por padrão, há uma lista de tarefas que tem o mesmo nome da sua transmissão ao vivo.
Você pode usar o formulário na parte inferior para criar uma nova lista de tarefas. Você também pode editar listas de tarefas existentes usando o botão de edição ou excluir qualquer lista de tarefas. Excluir uma lista de tarefas também excluirá todas as suas tarefas.
As listas de tarefas são classificadas em ordem alfabética.
Tip Todas as modificações ficam instantaneamente visíveis em todas as abas do seu navegador e para todos os administradores da sala.
Tarefas Criar tarefas Você pode criar uma tarefa usando o botão à direita da lista de tarefas. Isso abrirá um formulário com dois campos: um nome de tarefa obrigatório e uma descrição opcional.
Editar tarefas As tarefas podem ser editadas usando o botão de edição à direita.
As tarefas podem ser marcadas como concluídas (ou incompletas) clicando diretamente na caixa de seleção na lista.
Classificando tarefas / alterando lista de tarefas You can sort tasks, or move tasks from one list to another, simply using drag & drop.
Criar uma tarefa a partir de uma mensagem de bate-papo Você pode criar uma tarefa a partir de uma mensagem em um chat, usando o botão “Criar nova tarefa” no menu suspenso à direita da mensagem. Isso abrirá uma caixa de diálogo onde você pode escolher em qual lista de tarefas deseja adicionar a tarefa. O nome da tarefa será o apelido do usuário e a descrição da tarefa, o conteúdo da mensagem.
Usando esse recurso, por exemplo, você pode pedir aos seus moderadores para destacar todas as perguntas do chat, para que você possa vê-las rapidamente durante sua transmissão ao vivo e marcá-las como respondidas.`,description:"Você pode gerenciar tarefas e listas de tarefas com sua equipe de moderação.",tags:[],title:"Tarefas / Listas de tarefas",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/tasks/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Esta funcionalidade está disponível com o plugin livechat versão 11.0.0. Introdução O plugin de chat ao vivo inclui um aplicativo de notas do moderador: você pode escrever algumas notas, que podem ser associadas aos participantes do chat. Os administradores de cada sala têm acesso a essas notas, para que possam editá-las de forma colaborativa.
Você pode, por exemplo, usar este aplicativo para:
compartilhar algumas notas entre os moderadores tomar notas sobre os participantes que foram expulsos ou causaram problemas … Usando o aplicativo Notas do moderador Abrindo o aplicativo Notas do Moderador Para abrir o aplicativo Notas do Moderador, há um botão “Notas de moderação” no menu superior do chat:
Clicar neste botão alternará a exibição do aplicativo:
Tip Para ter mais espaço e melhor legibilidade, abra o chat em modo de página inteira.
Direitos de acesso Todos os administradores de sala têm acesso a este aplicativo (acesso de leitura e gravação).
Ao promover alguém como administrador ou proprietário de uma sala, essa pessoa obtém acesso instantâneo a este Aplicativo. Ao remover os direitos de administrador ou proprietário de alguém, essa pessoa perde instantaneamente o acesso a este Aplicativo.
Escopo As notas só ficam disponíveis na sala em que você as criou.
As salas de bate-papo podem ser vinculadas a um vídeo ou canal. Se você quiser manter anotações de um vídeo para outro, considere usar salas vinculadas a canais.
Warning Atualmente, a configuração para salas de vídeo e canais é válida para toda a instância. Somente administradores do Peertube podem alterá-la, e ela se aplica a todas as salas de bate-papo. Futuramente, essa opção será adicionada às opções do seu canal.
Notas Criar/Editar Notas Você pode usar o botão de adição na parte superior para criar uma nova nota. Você também pode editar notas existentes usando o botão de edição ou excluir qualquer nota.
Tip Todas as modificações ficam instantaneamente visíveis em todas as abas do seu navegador e para todos os administradores da sala.
Você pode criar uma nota associada a um participante de várias maneiras:
usando a ação “Criar uma nova nota” no menu suspenso, além dos participantes na barra lateral usando a ação “Criar uma nova nota” no menu suspenso, além das mensagens de bate-papo Quando uma nota é associada a um participante, você verá o apelido e o avatar dele na parte superior da nota.
Filtragem de notas Você pode filtrar notas para encontrar todas as notas relacionadas a um determinado participante de várias maneiras:
clique no botão “Buscar notas” disponível nas notas para encontrar todas as notas relacionadas ao mesmo participante clique no botão “Buscar notas” no menu suspenso ao lado dos participantes na barra lateral clique no botão “Buscar notas” no menu suspenso ao lado das mensagens de bate-papo Você pode remover o filtro clicando no botão Fechar.
Ao filtrar notas sobre um participante, várias informações são exibidas à direita do apelido do participante:
se o apelido atual for diferente do apelido quando você criou a nota, o apelido original será mostrado você verá o JID (Jabber ID) do participante você também verá o occupant-id do participante O resultado da pesquisa também incluirá todas as notas relacionadas aos participantes que tinham o mesmo apelido. Assim, você também pode anotar usuários anônimos (que não possuem um JID ou ID de ocupante consistente). Você pode diferenciá-los comparando o JID e o ID de ocupante.
Classificando notas You can sort notes simply using drag & drop.`,description:"Notas de moderação do plugin peertube-plugin-livechat",tags:[],title:"Notas de moderação",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/moderation_notes/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube > Documentação > Documentação do usuário > Para streamers",content:` Info Este recurso vem com o plugin LiveChat versão 8.0.0 e pode ser desabilitado pelos administradores da sua instância.
Você pode habilitar um bot de bate-papo em suas salas de bate-papo. A configuração do bot é feita canal por canal e será aplicada a todas as salas de bate-papo com vídeos relacionados.
Para acessar esta página, verifique a documentação de configuração do canal.
Uma vez lá, você pode habilitar o bot e configurar diversas opções:
Caracteres especiaisO bot pode moderar automaticamente mensagens que contenham muitos caracteres especiais.
Nenhuma mensagem duplicadaO bot pode moderar automaticamente mensagens duplicadas.
Palavras proibidasO bot pode moderar automaticamente mensagens contendo palavras proibidas.
TemporizadoresO bot pode enviar periodicamente algumas mensagens.
ComandosO bot pode responder a vários comandos.
O bot será recarregado instantaneamente quando você salvar a página.`,description:"Configuração do bot de bate-papo",tags:[],title:"Bot de bate-papo",uri:"/peertube-plugin-livechat/pt-br/documentation/user/streamers/bot/index.html"},{breadcrumb:"",content:` Tip Você pode usar o seletor de idiomas no menu à esquerda para visualizar esta documentação em diferentes idiomas. Algumas traduções estão ausentes ou incompletas. Neste caso, você verá a versão em inglês do texto.
Bem-vindo à documentação do Peertube Livechat Plugin.
Peertube é uma plataforma de streaming descentralizada que oferece recursos de transmissão ao vivo e VOD (Vídeo sob Demanda). Este plugin adiciona recursos de bate-papo à sua instalação do Peertube, permitindo que os espectadores interajam com os streamers.
Para ter uma ideia dos recursos deste plugin, confira a introdução. Para informações mais precisas, veja abaixo o resumo desta documentação.
Tip Você pode usar a caixa de pesquisa no menu à esquerda para encontrar rapidamente partes específicas da documentação.
Info Antes de atualizar para uma versão principal, leia as notas de versão e a lista de alterações significativas: CHANGELOG.
IntroduçãoIntrodução
DocumentaçãoDocumentação do plugin
Documentação do usuárioDocumentação do usuário do plugin peertube-plugin-livechat
Para espectadoresComo conversar com espectadores de transmissão
OBSDocumentação para transmitir o conteúdo do bate-papo usando o OBS.
Clientes XMPPConecte-se ao chat usando um cliente XMPP
Para streamersComo configurar o chat para sua transmissão ao vivo
Alguns princípios básicosAlgumas noções básicas sobre como configurar e usar o chat para sua transmissão ao vivo
Configuração de canalConfiguração de salas de chat do canal Peertube
AnúnciosProprietários e administradores de salas podem enviar anúncios especiais no chat.
ModeraçãoRecursos avançados de moderação do plugin peertube-plugin-livechat
Terms & conditionsConfigure channel's chat terms & conditions
Modo lentoPlugin peertube-plugin-livechat modo lento
Atraso de moderaçãoAtraso de moderação do plugin peertube-plugin-livechat
Emojis personalizadosPlugin peertube-plugin-livechat emojis personalizados
Modo somente emojisPlugin peertube-plugin-livechat modo apenas emojis
PesquisasVocê pode criar enquetes para perguntar a opinião dos espectadores
Tarefas / Listas de tarefasVocê pode gerenciar tarefas e listas de tarefas com sua equipe de moderação.
Notas de moderaçãoNotas de moderação do plugin peertube-plugin-livechat
Bot de bate-papoConfiguração do bot de bate-papo
Guia de instalaçãoGuia de instalação do plugin peertube-plugin-livechat
Solução de problemasAlguns erros clássicos e soluções alternativas.
Problemas conhecidos: compatibilidade da CPUPor enquanto, o plugin funciona apenas para arquiteturas de CPU x86_64 e arm64. Aqui estão algumas instruções para outras arquiteturas de CPU.
Atualização de versão anterior à 6.0.0Notas importantes ao atualizar para uma versão mais antiga.
Documentação do administradorAdministração do plugin Peertube Livechat
ConfiguraçõesConfigurações do plugin Peertube Livechat
Autenticação externaConfigurações do plugin Peertube Livechat - Autenticação externa
Prosódia mod_firewallRegras avançadas de firewall para o servidor Prosody
Uso avançadoAlguns recursos avançados
Clientes XMPPPermitir conexões usando clientes XMPP
Usando MatterbridgeUsando o Matterbridge para fazer a ponte com outros chats
ContribuindoContribuindo
Código de CondutaCódigo de Conduta do Pacto do Colaborador
TraduzirTraduzir o plugin
Dê seu feedbackDê seu feedback
DesenvolverDesenvolver
DocumentaçãoDocumente o plugin ou traduza a documentação.
Bug tracking & new featuresRastreamento de bugs / Solicitações de novos recursos
Technical documentationTechnical documentation
Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
PesquisasPolls technical documentation
Terms&ConditionsTerms&Conditions implementation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview
Entre em contato comigoEntre em contato com o autor
CréditosCréditos do plugin`,description:"Documentação do plugin Peertube livechat",tags:[],title:"Bate-papo ao vivo do Peertube",uri:"/peertube-plugin-livechat/pt-br/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube",content:"",description:"",tags:[],title:"Categories",uri:"/peertube-plugin-livechat/pt-br/categories/index.html"},{breadcrumb:"Bate-papo ao vivo do Peertube",content:"",description:"",tags:[],title:"Tags",uri:"/peertube-plugin-livechat/pt-br/tags/index.html"}]