#!/bin/env node
/* eslint-env es6 */

const sharp = require('sharp')
const fs = require('node:fs')
const path = require('node:path')

{
  // Legacy avatars generation
  const inputDir = './assets/images/avatars/'
  const outputDir = './dist/server/avatars/'
  const backgrounds = [
    '#ffffff',
    '#000000',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#808000',
    '#ffff00',
    '#008000',
    '#008080',
    '#00ffff',
    '#000080',
    '#800080',
    '#ff00ff'
  ]
  const count = 10

  for (let i = 1; i <= count; i++) {
    const inputFile = path.join(inputDir, i + '.svg')

    for (let j = 0; j < backgrounds.length; j++) {
      const out = i + (count * j)
      const background = backgrounds[j]
      sharp(inputFile).flatten({background}).resize(120, 120).jpeg({quality: 95, mozjpeg: true}).toFile(path.join(outputDir, out.toString() + '.jpg'))
    }
  }

  // Moderation bot avatar: for now taking image 2, and applying a grey background.
  {
    const i = 2
    const inputFile = path.join(inputDir, i + '.svg')

    const background = '#858da0'
    const outputDir = './dist/server/bot_avatars/'
    const out = 1
    sharp(inputFile).flatten({background}).resize(120, 120).jpeg({quality: 95, mozjpeg: true}).toFile(path.join(outputDir, out.toString() + '.jpg'))
  }
}

{
  // 2024 avatars generation

  const inputDir = './assets/images/avatars-2024/'
  const outputDir = './dist/server/avatars-2024/'

  // Available parts:
  // Note: some part files are empty, so that David's generator don't always add every part.
  // But this make my algorithm generate a lot of avatars that have no part other that the body and the yes.
  // So i don't include all empty files
  const parts = {
    body: 25,
    pattern: 14, // 12 to 20 are empty
    mouth: 10,
    eyes: 10,
    accessories: 17, // 14 to 20 are empty
    misc: 16, // 15 to 20 are empty
    hat: 20 // 13 to 20 are empty
  }
  // We just have to combinate different parts into one file, then output at the wanted size.

  function computeFilename (part, count) {
    let a = (1 + (count % parts[part])).toString()
    if (a.length < 2) { a = '0' + a}

    return path.join(
      inputDir,
      part,
      part + '_' + a + '.png'
    )
  }

  async function generate () {
    // We can't generate all combinations! It would make 400 000 000 files!
    // So we arbitrary pick some combinations, using some modulus
    const nb = 200 // number of avatars to generate

    for (let i = 0; i < nb; i++) {
      const ouputFile = path.join(
        outputDir,
        i.toString() + '.png'
      )
      if (await fs.existsSync(ouputFile)) {
        console.log(`Skipping ${ouputFile}, file already exists`)
        continue
      }

      const bodyFile = computeFilename('body', i)

      const composites = []
      let j = 0
      for (const part of Object.keys(parts).filter(p => p !== 'body')) {
        j++ // introduce an offset so we don't get all empty parts at the same time
        composites.push({
          input: computeFilename(part, i + (j * 7))
        })
      }

      const buff = await sharp(bodyFile)
        .composite(composites)
        .toBuffer()

      await sharp(buff)
        .resize(60, 60)
        .png({
          compressionLevel: 9,
          palette: true
        })
        .toFile(ouputFile)
    }
  }

  generate().then(
    () => {
      console.log('Done.')
    },
    (err) => {
      console.error(err)
    }
  )
}
