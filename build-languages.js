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
  monoLingualReferences = null

  constructor () {
    this.destinationDir = path.resolve(__dirname, 'dist', 'languages')
  }

  async generateFiles () {
    await this.loadLangs()
    await this.initTranslationStrings()
    await this.readYamlTranslations()

    await this.ensureDestinationDir()
    await this.writeJSONTranslations()
    await this.writeMonoLingualReferences()
  }

  loadLangs () {
    const packagejson = require('./package.json')
    const translations = packagejson.translations || {}
    this.langs = Object.values(translations).map(filename => {
      return filename.match(/^.*\/([a-zA-Z-]+)\.json$/)[1]
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

  async readYamlTranslations () {
    console.log('Reading Yaml translation strings...')

    // First we must get the english reference file,
    // that will give us the keys to use in final JSON.

    const reference = await this.getYmlFileContent(path.resolve(__dirname, 'languages', 'en.yml'))
    this.monoLingualReferences = reference

    const translationsStrings = this.translationsStrings
    for (const l of this.langs) {
      if (l === 'en') {
        console.log('Skipping english, because it is the reference language.')
        continue
      }
      const filePath = path.resolve(__dirname, 'languages', l + '.yml')
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
    if (!this.monoLingualReferences) {
      throw new Error('Missing monolingual reference content!')
    }
    const filePath = path.resolve(this.destinationDir, 'en.reference.json')
    await fs.promises.writeFile(filePath, JSON.stringify(this.monoLingualReferences))
  }
}

const bl = new BuildLanguages()
bl.generateFiles().then(() => {}, (err) => {
  console.error(err)
  throw err
})
