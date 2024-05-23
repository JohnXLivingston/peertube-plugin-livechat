<!--
SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>

SPDX-License-Identifier: AGPL-3.0-only
-->

# import-wikimedia.mjs

The [import-wikimedia.mjs](./import-wikimedia.mjs) script can be used to generate some word lists.

It can parse some categories from the [wiktionary](https://www.wiktionary.org), and return the result as a flat text list.
This list can be pasted in the "forbidden words" field (do not forget to uncheck "consider as a regular expression").

## Pre-requisite

To use it, you have to install NodeJS (version >= 16) on your computer.

You also need the `commander` package. To get it, you have to choice:

* you can install the plugin dev dependencies (`npm install` if your are not on the production server)
* or `npm install -g commander`

## Usage

To run the script:

```bash
# commands to run from the livechat plugin directory.
# to get the script help:
node ./support/forbidden_words/import-wikimedia.mjs --help
# to get a category content, and save it to /tmp/result.txt:
node ./support/forbidden_words/import-wikimedia.mjs category --lang fr --service wiktionary --category 'Insultes_en_français' > /tmp/result.txt
```
