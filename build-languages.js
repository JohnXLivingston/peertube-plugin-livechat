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
const YAML = require('yaml')

class BuildLanguages {
  destinationDir = null
  langs = []
  translationsStrings = {}
  monoLingualReferences = {}

  constructor () {
    this.destinationDir = path.resolve(__dirname, 'dist', 'languages')
  }

  async generateFiles () {
    await this.loadLangs()
    await this.initTranslationStrings()
    await this.readJSONTranslations()
    await this.readSettingsTranslations()

    await this.ensureDestinationDir()
    await this.writeJSONTranslations()
    await this.writeMonoLingualReferences()
  }

  loadLangs () {
    const packagejson = require('./package.json')
    const translations = packagejson.translations || {}
    this.langs = Object.values(translations).map(filename => {
      return filename.match(/^.*\/(\w+)\.json$/)[1]
    })
    console.log('Existing languages: ', this.langs)
  }
  
  initTranslationStrings () {
    console.log('Initializing translations strings...')
    const translationsStrings = {}
    for (const l of this.langs) {
      translationsStrings[l] = {}
    }
    this.translationsStrings = translationsStrings
  }
  
  async readJSONTranslations () {
    console.log('Reading standard JSON translation strings...')
    const translationsStrings = this.translationsStrings
    for (const l of this.langs) {
      const filePath = path.resolve(__dirname, 'languages', l + '.json')
      if (!fs.existsSync(filePath)) {
        console.warn(`File ${filePath} missing, ignoring.`)
        continue
      }
      const t = require(filePath)
      for (const k in t) {
        const v = t[k]
        if (k in translationsStrings[l]) {
          throw new Error(`Duplicate translation for key ${k} in lang ${l}.`)
        }
        if ((typeof v) !== 'string') {
          // ignoring untranslated strings.
          continue
        }
        translationsStrings[l][k] = v
      }
    }
  }

  async readSettingsTranslations () {
    console.log('Reading Settings Yaml translation strings...')

    // First we must get the english reference file,
    // that will give us the keys to use in final JSON.

    const reference = await this.getYmlFileContent(path.resolve(__dirname, 'languages', 'settings', 'en.yml'))
    this.monoLingualReferences['settings'] = reference

    const translationsStrings = this.translationsStrings
    for (const l of this.langs) {
      const filePath = path.resolve(__dirname, 'languages', 'settings', l + '.yml')
      const o = await this.getYmlFileContent(filePath)

      for (const k in o) {
        if (!(k in reference)) {
          throw new Error(`File ${filePath} contains unknown keys. Key=${k}.`)
        }
        if ((typeof o[k]) !== 'string') {
          // ignoring untranslated strings.
          continue
        }
        const newKey = reference[k]
        this.translationsStrings[l][newKey] = o[k]
      }
    }
  }

  async getYmlFileContent (filePath) {
    if (!fs.existsSync(filePath)) {
      console.warn(`File ${filePath} missing, ignoring.`)
      return {}
    }

    const content = await fs.promises.readFile(filePath, 'utf8')
    const o = YAML.parse(content) || {}
    for (const k in o) {
      let v = o[k]
      if (v === null) {
        // this value is ok!
        continue
      }
      if ((typeof v) !== 'string') {
        throw new Error(`File ${filePath} contains strings that are not strings! Key=${k}`)
      }

      // We are normalizing the string, to avoid problems.
      // As it is supposed to be html, we will strip newlines and multiple adjacent spaces.
      v = v.replace(/\n/g, ' ')
      v = v.replace(/\s\s+/g, ' ')
      v = v.trim()
      o[k] = v
    }
    return o
  }

  async ensureDestinationDir () {
    if (!fs.existsSync(this.destinationDir)) {
      await fs.promises.mkdir(this.destinationDir)
    }
  }

  async writeJSONTranslations () {
    console.log('Writing JSON files...')
    for (const l of this.langs) {
      const filePath = path.resolve(this.destinationDir, l + '.json')
      await fs.promises.writeFile(filePath, JSON.stringify(this.translationsStrings[l]))
    }
  }

  async writeMonoLingualReferences () {
    console.log('Writing JSON reference files...')
    for (const name in this.monoLingualReferences) {
      const filePath = path.resolve(this.destinationDir, name + '.reference.json')
      await fs.promises.writeFile(filePath, JSON.stringify(this.monoLingualReferences[name]))
    }
  }
}

const bl = new BuildLanguages()
bl.generateFiles().then(() => {}, (err) => {
  console.error(err)
  throw err
})
