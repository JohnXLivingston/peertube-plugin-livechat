---
title: "Documentation"
description: "Document the plugin, or translate the documentation."
weight: 50
chapter: false
---

## General information

Always inform the community before working (by creating a new issue, or commenting an existing one).
This is to avoid that two persons are working on the same thing, and prevent conflicts.

Documentation work has to be merged in the `main` branch.

The documentation source code is in the `support/documentation/content` folder.

The documentation is generated using [Hugo](https://gohugo.io/).
You have to install it on your computer if you want to preview your work.

The used theme is [hugo-theme-learn](https://learn.netlify.app/).
You should read its documentation before starting editing the documentation.

When a new plugin version is released, or when documentation is updated, plugin maintainers will merge the `main` branch to the `documentation` branch.
This will trigger github and gitlab pipelines, and update published documentation.

## Translations

The principal language is english (`en` code).

The `support/documentation/content/en` folder contains only english documentation files.

Documentation is translated using Weblate (see the [translation documentation](/peertube-plugin-livechat/contributing/translate/)).
To do so, we use the [po4a tool](https://po4a.org/), as we will se later in this page.

## Add a new language

In the `support/documentation/config.toml` file, please copy and modify the `[Languages.fr]` section.

If the translations are not complete, it does not matter, english will be used for missing strings.

## Preview

To preview your modifications, just run:

```bash
hugo serve -s support/documentation/
```

Then open your browser on the address [http://localhost:1313/peertube-plugin-livechat/](http://localhost:1313/peertube-plugin-livechat/).
This page will automatically refresh on each modification.

## Update localization files and generate documentation translations

For now, you only have the english version.
To update documentation strings, and generate translations, you have to run the `doc-translate.sh` script.

To do so, make sure you have `po4a` (version >= 0.69) installed on your computer.

{{% notice warning %}}
Some linux distro (like Debian Bullseye for example) have too old version of `po4a`.
Please make sure to install a compatible version.
If you are using Debian Bullseye for example, you can download the Bookworm po4a.deb file from [https://packages.debian.org](https://packages.debian.org/bookworm/all/po4a/download), and install it manually.
{{% /notice %}}

To handle translations, just do:

```bash
npm run doc:translate
```

You can then preview the result using `hugo serve -s support/documentation/`, and using the language selector.

## Write documentation

Just edit the english files in `support/documentation/content/en`.

Then, before commiting, always run `npm run doc:translate`, so that changes in english files can be propagated to the `support/documentation/po/livechat.en.pot` file.

You can use the `livechat_label` short code to use application strings.
See here: [Documentation translation](/peertube-plugin-livechat/contributing/translate/#documentation-translation).

It is possible to prevent a file from beeing translating, using `livechatnotranslation: true` in the Yaml Font Matter section.
See here: [Documentation translation](/peertube-plugin-livechat/contributing/translate/#documentation-translation).

Please use the `livechatnotranslation` option for technical documentation.
We don't want technical documentation to be translated, to avoid issues because of a wrong translation.

To facilitate translators work, avoid making too long paragraphs.

For now, it is not possible to use Markdown tables: the translation tools will break them.

### What if I can't use hugo and/or po4a?

Just edit english markdown files, and specify that you can't build translations when you make your Pull Request.

## Publication

Publishing the documentation is automatic, as soon as the changes are merged into the `documentation` branch.
