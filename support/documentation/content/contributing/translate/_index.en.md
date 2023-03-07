+++
title="Translate"
description="Translate the plugin"
weight=20
chapter=false
+++

You can help us to translate this PeerTube plugin by creating or modifying translation files in the `languages` folder.

{{% notice info %}}
For now, translation is done in the git repository. Later in 2023, online translation tools will be set (probably [Weblate](https://weblate.org)). This will make the translation process easier.
{{% /notice %}}

{{% notice tip %}}
Please work on the `main` branch, and do your commits and pull request on this branch.
{{% /notice %}}

{{% notice note %}}
Until march 2023, contribution were made on the `develop` branch. This procedure is now deprecated.
{{% /notice %}}

## Standard application strings

If the language you are interesting in does not exist yet, create a file `code.json` in the `languages` folder, where `code` is the language code.
The language code must be the same as the Peertube's langage code (see [Peertube documentation](https://github.com/Chocobozzz/PeerTube/blob/develop/support/doc/translation.md)).
Then add the language file in the `package.json` file, under the key `translations`.

Translation strings are set in the language file as follow:

- files are in [JSON format](https://www.json.org)
- the JSON key is the english string (see existing keys in the [french translation file](languages/fr.json)).
- the JSON value is the translating string
- NB: there is no english translation file (this is how translation works for peertube's plugins)

## Settings translations

In the plugin settings page, there are more complex strings.
They can be HTML code, with newlines, HTML tags, ...
This is not suitable for the JSON format.

That's why the process is a little bit different for settings strings.

Settings strings are defined in [YAML files](https://en.wikipedia.org/wiki/YAML).
They don't use the english text as key, but a codified key, like `list_rooms_label`.

On the contrary of the standards application strings, there is also a configuration file for the english language.

These files are in the folder `languages/settings`. If the file for the language that you are interested in does not exist, just create a new file
named `code.yml`, where `code` is the language code (see above).

Then, you can copy YAML keys from the reference file `languages/settings/en.yml`, and translate strings.

If you don't want to translate a string, you can ignore it, or use `null` or `~` as value.

{{% notice warning %}}
There might be some «very technical» strings. If you are not 100% sure of
the meaning, or of your translation, you better not translate it,
so it will display in english.
{{% /notice %}}
