#!/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const YAML = require('yaml')

/**
 * This script will patch ConverseJS .po files, to add custom strings.
 */

const livechatDir = path.resolve(__dirname, '..', 'languages')
const converseDir = path.resolve(__dirname, '..', 'build', 'conversejs', 'src', 'i18n')

// Labels to import:
const labels = loadLabels([
  'slow_mode_info'
])

function loadLabels (keys) {
  const labels = {}
  const sourceContent = fs.readFileSync(path.resolve(livechatDir, 'en.yml')).toString()
  const yaml = YAML.parse(sourceContent)
  for (const key of keys) {
    labels[key] = yaml[key]
  }
  return labels
}

function patch (lang) {
  const destLang = lang.replace('-', '_') // zh-Hans => zh_Hans
  const destFile = lang === ''
    ? path.resolve(converseDir, destLang, 'converse.pot')
    : path.resolve(converseDir, destLang, 'LC_MESSAGES', 'converse.po')

  console.log(`Patching ${lang}/${destLang}...`)
  if (!fs.existsSync(destFile)) {
    console.log(`File ${destFile} does not exist, skipping.`)
    return
  }

  let yaml
  if (lang === '') { // pot file, dont put translation
    yaml = {}
  } else {
    const sourceContent = fs.readFileSync(path.resolve(livechatDir, lang + '.yml')).toString()
    yaml = YAML.parse(sourceContent) ?? {}
  }

  const destContent = fs.readFileSync(destFile).toString().split(/\n/)

  // FIXME: for a yet-to-understand reason, the first patched string in marked as fuzzy when ConverseJS compiles
  // po files. So we insert an unecessary translation first...
  patchLabel(destContent, 'Livechat', 'Livechat')

  for (const key in labels) {
    const label = labels[key]
    patchLabel(destContent, label, yaml[key] ?? '')
  }
  fs.writeFileSync(destFile, destContent.join('\n'))
}

function patchLabel (fileLines, label, translation) {
  // FIXME: here we are not escaping any string value, considering there is only text in concerned labels for now.
  //  But we should...
  const msgid = `msgid "${label}"`
  const msgstr = `msgstr "${translation}"`
  console.log(`  Patching ${msgid} => ${msgstr} ...`)
  for (let i = 0; i < fileLines.length; i++) {
    const line = fileLines[i]
    if (line !== msgid) { continue }
    console.log(`  Found ${msgid}`)
    // FIXME: we consider there is only one msgstr... Should consider there could be multiple.
    fileLines[i + 1] = msgstr
    return
  }

  console.log(`  Did not found ${msgid}, adding at the end`)
  fileLines.push(
    '# livechat-specific label',
    msgid,
    msgstr,
    ''
  )
}

if (!fs.existsSync(livechatDir)) {
  throw new Error('Missing livechat language dir')
}
if (!fs.existsSync(converseDir)) {
  throw new Error('Missing ConverseJS language dir, are you really building it?')
}

patch('')
const files = fs.readdirSync(livechatDir).filter(f => /\.yml$/.test(f))
for (const file of files) {
  const l = file.replace('.yml', '')
  patch(l)
}
