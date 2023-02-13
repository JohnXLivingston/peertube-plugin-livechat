+++
title="Translate"
description="Translate the plugin"
weight=20
chapter=false
+++

You can help us to translate this PeerTube plugin by creating or modifying translation files in the `languages` folder.

Please work on the `develop` branch, and do your commits and pull request on this branch.

If the language you are interesting in does not exist yet, create a file `code.json` in the `languages` folder, where `code` is the language code.
The language code must be the same as the Peertube's langage code (see [Peertube documentation](https://github.com/Chocobozzz/PeerTube/blob/develop/support/doc/translation.md)).
Then add the language file in the `package.json` file, under the key `translations`.

Translation strings are set in the language file as follow:

- files are in [JSON format](https://www.json.org)
- the JSON key is the english string (see existing keys in the [french translation file](languages/fr.json)).
- the JSON value is the translating string
- NB: there is no english translation file (this is how translation works for peertube's plugins)
