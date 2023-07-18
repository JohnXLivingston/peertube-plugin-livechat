---
title: "Develop"
description: "Develop"
weight: 40
chapter: false
---

Always talk about features you want to develop by creating/finding and commenting the issue tackling your problem
before you start working on it, and inform the community that you begin coding by claiming the issue.

Pull Request must be done on the `main` branch.

{{% notice note %}}
Until march 2023, contribution were made on the `develop` branch. This procedure is now deprecated.
{{% /notice %}}

## Prerequisite for building this plugin

It is highly recommended to be familiar with following concepts:

* Git
* NodeJS
* NPM
* Typescript

To build the plugin, you must have following packages:

* `git`
* `npm` (>=8.x)
* `nodejs` (>=14.x)
* `build-essential`

The plugin needs to build an AppImage for the Prosody XMPP server.
It appears that the way this AppImage is build requires `apt` and `dpkg` commands.
So it will only work "out of the box" on Debian-like systems.
If you are using another Linux distribution, you can try to install `apt` and `dpkg` manually.
See for example this [Github issue](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/200).
We will provide another solution as soon as possible.

Building this AppImage also requires following packages:

* `python3-venv`
* `squashfs-tools`

{{% notice info %}}
These dependencies were tested on a Debian Bullseye.
If there is some dependencies issues on your UNIX/Linux system, please open an issue on Github.
{{% /notice %}}

## Develop

Clone the repository, buid the plugin, and create your feature branch:

```bash
# Clone the repository. Dont forget the --recursive to clone submodules.
git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git --recursive

cd peertube-plugin-livechat

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

Once you are ready to show your code to ask for feedback, submit a *draft* Pull Request.
Once you are ready for a code review before merge, submit a Pull Request.
In any case, please link your PR to the issues it solves by using the GitHub syntax: "fixes #issue_number".

The front-end code is in the `client` folder, the back-end code in `server`. There are some shared code in `shared` folder.

For general instructions (developping plugins, building, installation, ...), please refer to the [Peertube documentation](https://docs.joinpeertube.org/contribute-plugins?id=write-a-plugintheme).

You can build the plugin with extra debug features simply by using:

```bash
NODE_ENV=dev npm run build
```

## ESBuild vs Typescript

This plugin uses ESBuild for frontend code generation, as the official `peertube-plugin-quickstart` plugin.
ESBuild can handle Typescript, but does not check types (see [ESBuild documentation](https://esbuild.github.io/content-types/#typescript)).
That's why we first compile Typescript with the `-noEmit` option, just to check types (`check:client:ts` in package.json file).
Then, if everything is okay, we run ESBuild to generate the compiled javascript.

## Debug Mode

There is a debug mode for this plugin, that shorten some delay.
For example, some log files will rotate every two minutes, instead of once per day.
This permit to test more easily certain actions, for which it could normally take hours or days to wait.

To enable this mode, you juste have to create the `/var/www/peertube/storage/plugins/data/peertube-plugin-livechat/debug_mode` file (replacing `/var/www/peertube/storage/` by the correct path on your installation).

The simple existence of this file is sufficient to trigger the debug mode.
To make sure it's taken into account, you can restart your Peertube instance.

This file can contain some JSON to enable more advanced options.
To have a list of existing parameters, check `server/lib/debug.ts`.
Restart Peertube after each content modification.

{{% notice warning %}}
Don't enable this mode on a production server, neither on a public server.
This could cause security issues.
{{% /notice %}}

### Restart Prosody

When debug mode is enabled, you can restart Prosody using this API call: `http://your_instance.tld/plugins/livechat/router/api/restart_prosody`.
This call don't need any authentificaiton.
It can be done from a command line, for example using `curl http://your_instance.tld/plugins/livechat/router/api/restart_prosody`.

### Prosody debugger

It is possible to connect the Prosody AppImage to a remote debugger using [MobDebug](https://luarocks.org/modules/paulclinger/mobdebug).

To do so, you have to setup MobDebug in a folder that can be accessed by the `peertube` user.
Then, add this in the `debub_mode` file:

```json
{
  "debug_prosody": {
    "debugger_path": "/the_path_to_mobdebug/src",
    "host": "localhost",
    "port": "8172"
  }
}
```

`host` and `port` are optional. `debugger_path` must point to the folder where the `MobDebug` `.lua` file is.

Restart Peertube.

Start your debugger server.

For Prosody to connect to the debugger, call the API `http://your_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true`.
This call does not need any authentication.
It can be done from a command line, for example with `curl http://your_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true`.
You can even configure your debug server to launch this request automatically.

Prosody will then restart, connecting to the debugger.

## Quick dev environment using Docker

There is a tutorial, in french, on the [Peertube forum](https://framacolibri.org/t/tutoriel-creer-un-environnement-de-developpement-de-plugin-peertube-rapidement-en-utilisant-docker-et-qui-permet-de-tester-la-federation/17631) that explains how to quickly build a dev env using Docker.

A repo was made out of it, check out [pt-plugin-dev](https://codeberg.org/mose/pt-plugin-dev).

Note: for an unknown reason, Prosody can't resolve containers DNS address when using the lua-unbound library.
There is a dirty hack in the plugin: just create a `/data/plugins/data/peertube-plugin-livechat/no_lua_unbound` file in your docker-volumes, then restart containers.
