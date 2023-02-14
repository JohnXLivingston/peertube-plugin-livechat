/**
 * This script is used to build the translations files.
 * 
 * Indeed, some strings used in plugin settings are not easy to write
 * in JSON format (contains html, double quotes, line breaks, ...).
 * So we use YAML files to translates these strings,
 * including the english version.
 * 
 * This scripts takes the standard JSON files, the YAML translation files,
 * and mixes everything up in dist/languages/xx.json.
 */
const fs = require('fs')
const path = require('path')

function getAllLangs () {
  const packagejson = require('./package.json')
  const translations = packagejson.translations || {}
  return Object.values(translations).map(filename => {
    return filename.match(/^.*\/(\w+)\.json$/)[1]
  })
}

function initTranslationStrings (langs) {
  console.log('Initializing translations strings...')
  const translationsStrings = {}
  for (l of langs) {
    translationsStrings[l] = {}
  }
  return translationsStrings
}

async function readJSONTranslations(langs, translationsStrings) {
  console.log('Reading standard JSON translation strings...')
  for (l of langs) {
    const filePath = path.resolve(__dirname, 'languages', l + '.json')
    if (!fs.existsSync(filePath)) {
      console.warn(`File ${filePath} missing, ignoring.`)
      continue
    }
    const t = require(filePath)
    for (k in t) {
      const v = t[k]
      if (k in translationsStrings[l]) {
        throw new Error(`Duplicate translation for key ${k} in lang ${l}.`)
      }
      translationsStrings[l][k] = v
    }
  }
}

async function writeJSONTranslations (langs, translationsStrings) {
  console.log('Writing JSON files...')
  const dir = path.resolve(__dirname, 'dist', 'languages')
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir)
  }
  for (l of langs) {
    const filePath = path.resolve(dir, l + '.json')
    await fs.promises.writeFile(filePath, JSON.stringify(translationsStrings[l]))
  }
}

async function generateFiles () {
  const langs = getAllLangs()
  console.log('Existings languages: ', langs)
  
  const translationsStrings = initTranslationStrings(langs)
  await readJSONTranslations(langs, translationsStrings)

  await writeJSONTranslations(langs, translationsStrings)
}

generateFiles().then(() => {}, (err) => {
  console.error(err)
  throw err
})
