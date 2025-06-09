// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Command } from 'commander'

const program = new Command()
program
  .usage('[command] [options]')
  .showHelpAfterError()

const runCommand = program.command('category')
runCommand.description('Loads data from wikimedia services (wiktionary, ...), and prints it on the standard output.')
runCommand.requiredOption('-c, --category <category>', 'The category to request.')
runCommand.option(
  '-s, --service <service>',
  'The service to query. Possible values: "wiktionary", "wikipedia". Default: "wiktionary".',
  'wiktionary'
)
runCommand.option(
  '-l, --lang <lang>',
  'The code lang for the requested service. For example "en", "fr", ... (as it appears in the wikimedia site url). Default: "en"',
  'en'
)
runCommand.action(async (options) => {
  const service = options.service ?? 'wiktionary'
  if (service !== 'wiktionary' && service !== 'wikipedia') {
    throw new Error('Invalid service ' + service)
  }
  const lang = options.lang
  if (!/^[a-z-]+$/.test(lang)) {
    throw new Error('Invalid lang ' + lang)
  }
  const category = options.category

  const url = new URL(`https://${lang}.${service}.org/w/api.php?action=query&format=json&formatversion=2&list=categorymembers&cmlimit=200`)
  url.searchParams.append('cmtitle', 'Category:' + category)

  while (true) {
    const r = await fetch(url.toString())
    if (!r.ok) {
      throw new Error('Failed requesting ' + url)
    }
    const json = await r.json()
    if (!json) {
      throw new Error('Invalid JSON content')
    }
    const list = json.query.categorymembers
    for (const entry of list) {
      // Note: at the end, there might be some links to other categories.
      // These links have title like "Category:xxx", or "Catégorie:xxx".
      // We don't want to test every translation of "Category"...
      // So we just ignore titles with ":"
      if (entry.title.includes(':')) { continue }
      console.log(entry.title)
    }

    if (json.continue) {
      for (const k in json.continue) {
        url.searchParams.set(k, json.continue[k])
      }
      continue
    }
    break
  }
})

program.parse(process.argv)
