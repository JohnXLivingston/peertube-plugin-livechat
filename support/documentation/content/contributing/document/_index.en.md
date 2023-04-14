+++
title="Documentation"
description="Document the plugin, or translate the documentation."
weight=50
chapter=false
+++

## General information

Always inform the community before working (by creating a new issue, or commenting an existing one). This is to avoid that two persons are
working on the same thing, and prevent conflicts.

Documentation work has to be merged in the `main` branch.

The documentation source code is in the `support/documentation/content` folder.

The documentation is generated using [Hugo](https://gohugo.io/).
You have to install it on your computer if you want to preview your work.

The used theme is [hugo-theme-learn](https://learn.netlify.app/).
You should read its documentation before starting editing the documentation.

When a new plugin version is released, or when documentation is updated,
plugin maintainers will merge the `main` branch to the `documentation` branche.
This will trigger github and gitlab pipelines, and update published documentation.

## Translations

The principal language is english (`en` code).

The different translations of the same file are side by side in the
tree, and are identified by a language code in the file name extension.
Example: `_index.fr.md` is the French translation of `_index.en.md`.

Please note that a missing translation file will not appear in the menus of the generated site.

**Always make sure to create files for all languages**, even if the translation is not yet available.

For this, there is a script `doc-generate-missing-translations.sh` in the root of the repository. When you add a new file, you just have to create the english version, then run this script. It will create all  missing translations, putting a sample message inviting the user to read the english version.

## Add a new language

In the `support/documentation/config.toml` file, please copy and modify the `[Languages.fr]` section.

Then, run the `doc-generate-missing-translations.sh` script.
It will create all the missing files.

Then you can translate them one by one.
If the translations are not complete, it does not matter, the generated files will display a message suggesting to change the language.

## Preview

To preview your modifications, just run:

```bash
hugo serve -s support/documentation/
```

Then open your browser on the address
[http://localhost:1313/peertube-plugin-livechat/](http://localhost:1313/peertube-plugin-livechat/).
This page will automatically refresh on each modification.

## Publication

Publishing the documentation is automatic, as soon as the changes are merged into the `main' branch.
