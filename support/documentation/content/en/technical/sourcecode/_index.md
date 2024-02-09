---
title: "Source code"
description: "Source code organization"
weight: 10
chapter: false
livechatnotranslation: true
---

This page describes the different source code folders and their content.

## build files

Files in the root dir that begins with `build-` are files used to build the plugin.
See the `package.json` file for more information.

## assets

### assets/images

The `assets/images` folder contains all icons files used by the plugin.

There is also the `assets/images/avatars` folders, which contains avatars used for anonymous chat users.
These files are used to generate multiple avatars (see the `build-avatars.js` script for more information).

* `assets/images/avatars/legacy` contains legacy avatar set (livechat versions until 8.1.0 included)
* `assets/images/avatars/sepia` contains new sepia avatar set, based on the work of David Revoy (see copyright informations)
* `assets/images/avatars/cat` contains new cats avatar set, based on the work of David Revoy (see copyright informations)

### assets/styles

The `assets/styles` folder contains the livechat plugin SCSS source files.

## build

The `build` folder is not part of the source code, but is used to put some files during the build process.

For example, `build-conversejs.js` use the folder `build/conversejs` to build a customized ConverseJS version.

## client

The `client` folder contains the front-end source code.

Files like `client/common-client-plugin.ts`, `client/videowatch-client-plugin.ts`, ... are the base files that
are loaded by Peertube for different "scopes" (`common`, `videowatch`, ...).
Please refer to the [Peertube plugin documentation](https://docs.joinpeertube.org/contribute/plugins)
 for more information.

## conversejs

The `conversejs` folder contains code relative to the use of ConverseJS.

### conversejs/custom

The `conversejs/custom` folder contains some files that are used to customize ConverseJS.
See the `build-conversejs.sh` script for more information.

## dist

The dist folder is where goes all files created during the build process.
It is not part of the source code.

## documentation

The folder `documentation` is deprecated.
We only keep files in this folder to avoid dead links
(links to these files were shared on many websites or social media posts).

The source code for the new documentation is in `support/documentation/content/en`,
and is used to generate the documentation web site.

## languages

The folder `languages` contains the languages files.
These files are [translated using Weblate](/peertube-plugin-livechat/contributing/translate/)).

## prosody-modules

The `prosody-modules` folder contains some modules used by Prosody.

Some of them are "officials" plugins, others are specific to this plugin.

## server

The `server` folder contains the backend source code.

## shared

The `shared` folder contains comme code that will be used both on frontend and backend.

## support/documentation

The `support/documentation` contains the documentation source code.

## vendor

The `vendor` folder is not part of the source code.
It is used during the build process to download some external source code.
