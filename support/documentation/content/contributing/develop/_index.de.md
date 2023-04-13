+++
title="Entwickeln"
description="Entwickeln"
weight=40
chapter=false
+++

Sprechen Sie immer über die Funktionen, die Sie entwickeln wollen, indem Sie das Issue, das Ihr Problem behandelt, erstellen/finden und kommentieren bevor Sie mit der Arbeit daran beginnen und informieren Sie die Gemeinschaft darüber, dass Sie mit der Programmierung beginnen, indem Sie das Thema für sich beanspruchen.

Bitte benutzen Sie den `main` Zweig.

{{% notice note %}}
Until march 2023, contribution were made on the `develop` branch. This procedure is now deprecated.
{{% /notice %}}

Voraussetzung für die Erstellung dieses Plugins:

- Sie müssen `npm` installiert haben
- Sie müssen python venv installiert haben (z.B. das Paket `python3-venv` auf Debian)

Um das Repository zu klonen:

```bash
# Clone the repository
git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git
# Checkout the main branch
git checkout main
# Initialize the submodules. This command must be run again if any submodules' version changes.
git submodule update --init --recursive

# Install NPM dependencies and build the module for the first time:
npm install

# Build the plugin after a modification:
npm run build

# If you have a fork from the repository, add it as remote (example):
git remote add me git@github.com:MY_GITHUB_ACCOUNT/peertube-plugin-livechat.git

# Create a local branch for you developments, and checkout it (example):
git checkout my_development # Note: if an issue is associated, use fix_1234 as your branch name (where 1234 is the issue's number)
# To propose your modifications, push your branch to your repository (example):
git push --set-upstream me my_development
# Then go to your github repository with your web browser to propose the Pull Request (see additional instructions below)
```

Sobald Sie bereit sind, Ihren Code zu zeigen und um Feedback zu bitten, reichen Sie einen *Entwurf* für einen Pull Request ein.
Sobald Sie bereit für eine Codeüberprüfung vor der Zusammenführung sind, reichen Sie einen Pull Request ein. In jedem Fall sollten Sie Ihren PR mit dem Problem, die er behebt, verlinken, indem Sie die GitHub-Syntax verwenden: "fixes #issue_number".

Der Front-End-Code befindet sich im Ordner `client`, der Back-End-Code im Ordner `server`. Es gibt einige gemeinsam genutzte Codes im `shared` Ordner.

Für allgemeine Anweisungen (Entwicklung von Plugins, Erstellung, Installation, ...), lesen Sie bitte die [Peertube Dokumentation] (https://docs.joinpeertube.org/contribute-plugins?id=write-a-plugintheme).

Sie können das Plugin mit zusätzlichen Debug-Funktionen bauen, indem Sie es einfach benutzen:

```bash
NODE_ENV=dev npm run build
```

## ESBuild vs Typescript

Dieses Plugin verwendet ESBuild für die Generierung von Frontend-Code, wie das offizielle `peertube-plugin-quickstart` Plugin.
ESBuild kann mit Typescript umgehen, prüft aber keine Typen
(siehe [ESBuild-Dokumentation](https://esbuild.github.io/content-types/#typescript)).
Deshalb kompilieren wir Typescript zuerst mit der Option `-noEmit`, nur um die Typen zu überprüfen (`check:client:ts` in der package.json Datei).
Dann, wenn alles in Ordnung ist, führen wir ESBuild aus, um das kompilierte Javascript zu erzeugen.

## Debug Mode

There is a debug mode for this plugin, that shorten some delay.
For example, some log files will rotate every two minutes, instead of once per day.
This permit to test more easily certain actions, for which it could normally take hours or days to wait.

To enable this mode, you juste have to create the
`/var/www/peertube/storage/plugins/data/peertube-plugin-livechat/debug_mode` file
(replacing `/var/www/peertube/storage/` by the correct path on your installation).

The simple existence of this file is sufficient to trigger the debug mode.
To make sure it's taken into account, you can restart your Peertube instance.
