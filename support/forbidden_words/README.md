<!--
SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>

SPDX-License-Identifier: AGPL-3.0-only
-->

# Chat bot: forbidden words or expressions

This page lists some common options you can use to configure the bot forbidden words feature.

Note: this page is still "Work In Progress". Fill free to contribute, by suggesting new entries on the
[livechat plugin github page](https://github.com/JohnXLivingston/peertube-plugin-livechat).

## Importing rules from wiktionary

There is a [wiktionary import script](./import-wikimedia.md) that can list all page title in a witionnary categorie.
This script was used to generate some of the forbidden-words lists that are present in this repository.
In such case, the command is provided near to the word list.

## URLs

If you want to prevent users to send URLs in the chat, you can use following values for the bot configuration.

| Expression | Regular expression | Suggested Reason |
|--|--|--|
| https?: | YES | Please do not share URLs |

## Swear words

Please find here some swear words list, in several languages:

### 🇬🇧 English

* [English swear words](./lists/en.english_swear_words.md)

### 🇫🇷 French / Français

* [Insultes en français](./lists/fr.insultes_en_francais.md)
* [Termes vulgaires en français](./lists/fr.termes_vulgaires_en_francais.md)
