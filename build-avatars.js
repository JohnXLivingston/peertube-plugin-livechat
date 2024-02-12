#!/bin/env node
/* eslint-env es6 */

const sharp = require('sharp')
const fs = require('node:fs')
const path = require('node:path')
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads')

const avatarPartsDef = {
  // Available parts:
  // Note: some part files are empty, so that David's generator don't always add every part.
  // But this make my algorithm generate a lot of avatars that have no part other that the body and the yes.
  // So i don't include all empty files
  'sepia': {
    body: 25,
    pattern: 14, // 12 to 20 are empty
    mouth: 10,
    eyes: 10,
    accessories: 17, // 14 to 20 are empty
    misc: 16, // 15 to 20 are empty
    hat: 20 // 13 to 20 are empty
  },
  'cat': {
    body: 15,
    fur: 10,
    eyes: 15,
    mouth: 10,
    accessorie: 20 // 17 to 20 are empty
  },
  'bird': {
    tail: 9, // here we must begin with the tail
    hoop: 10,
    body: 9,
    wing: 9,
    eyes: 9,
    bec: 9,
    accessorie: 16 // 15 to 20 are empty
  },
  'fenec': {
    body: 25,
    nose: 10,
    tail: 5,
    eyes: 10,
    mouth: 10,
    accessories: 16, // 14 to 20 are empty
    misc: 17, // 15 to 20 are empty
    hat: 15 // 13 to 20 are empty
  },
  'abstract': {
    body: 15,
    fur: 10,
    eyes: 15,
    mouth: 10
  }
}

function generateLegacyAvatars () {
  // Legacy avatars generation
  const inputDir = './assets/images/avatars/legacy'
  const outputDir = './dist/server/avatars/legacy'
  fs.mkdirSync(outputDir, { recursive: true })
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
    const outputDir = './dist/server/bot_avatars/legacy'
    fs.mkdirSync(outputDir, { recursive: true })
    const out = 1
    sharp(inputFile).flatten({background}).resize(120, 120).jpeg({quality: 95, mozjpeg: true}).toFile(path.join(outputDir, out.toString() + '.jpg'))
  }
}

// 2024 avatars generation
async function generateAvatars (part) {
  console.log('Starting generating ' + part)
  const parts = avatarPartsDef[part]
  if (!parts) {
    throw new Error('Missing part\'s conf: ' + part)
  }

  const inputDir = path.join('./assets/images/avatars/', part)
  const outputDir = path.join('./dist/server/avatars/', part)
  fs.mkdirSync(outputDir, { recursive: true })

  function computeFilename (part, count) {
    let a = (1 + (count % parts[part])).toString()
    if (a.length < 2) { a = '0' + a}

    return path.join(
      inputDir,
      part + '_' + a + '.png'
    )
  }
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

    const partsToCombine = Object.keys(parts)
    const firstPart = partsToCombine.shift()
    const firstFile = computeFilename(firstPart, i)

    // We just have to combinate different parts into one file, then output at the wanted size.
    const composites = []
    let j = 0
    for (const part of partsToCombine) {
      j++ // introduce an offset so we don't get all empty parts at the same time
      composites.push({
        input: computeFilename(part, i + (j * 7))
      })
    }

    const buff = await sharp(firstFile)
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

async function generateBotsAvatars () {
  {
    // Moderation bot avatar: choosing some parts, and turning it so he is facing left.
    const inputDir = path.join('./assets/images/avatars/', 'sepia')
    const botOutputDir = './dist/server/bot_avatars/sepia/'
    fs.mkdirSync(botOutputDir, { recursive: true })
    const buff = await sharp(path.join(inputDir, 'body_20.png'))
      .composite([
        { input: path.join(inputDir, 'pattern_01.png') },
        { input: path.join(inputDir, 'mouth_01.png') },
        { input: path.join(inputDir, 'eyes_01.png') },
        { input: path.join(inputDir, 'misc_05.png') },
        { input: path.join(inputDir, 'hat_07.png') }
      ])
      .toBuffer()

    await sharp(buff)
      .flop() // horizontal mirror
      .resize(60, 60)
      .png({
        compressionLevel: 9,
        palette: true
      })
      .toFile(path.join(botOutputDir, '1.png'))
  }

  {
    // Moderation bot avatar: choosing some parts, and turning it so he is facing left.
    const inputDir = path.join('./assets/images/avatars/', 'cat')
    const botOutputDir = './dist/server/bot_avatars/cat/'
    fs.mkdirSync(botOutputDir, { recursive: true })
    const buff = await sharp(path.join(inputDir, 'body_04.png'))
      .composite([
        { input: path.join(inputDir, 'mouth_02.png') },
        { input: path.join(inputDir, 'eyes_11.png') },
        { input: path.join(inputDir, 'fur_02.png') },
        { input: path.join(inputDir, 'accessorie_03.png') }
      ])
      .toBuffer()

    await sharp(buff)
      .flop() // horizontal mirror
      .resize(60, 60)
      .png({
        compressionLevel: 9,
        palette: true
      })
      .toFile(path.join(botOutputDir, '1.png'))
  }

  {
    // Moderation bot avatar: choosing some parts, and turning it so he is facing left.
    const inputDir = path.join('./assets/images/avatars/', 'bird')
    const botOutputDir = './dist/server/bot_avatars/bird/'
    fs.mkdirSync(botOutputDir, { recursive: true })
    const buff = await sharp(path.join(inputDir, 'tail_06.png'))
      .composite([
        { input: path.join(inputDir, 'hoop_04.png')},
        { input: path.join(inputDir, 'body_07.png')},
        { input: path.join(inputDir, 'wing_03.png')},
        { input: path.join(inputDir, 'eyes_05.png')},
        { input: path.join(inputDir, 'bec_07.png')},
        { input: path.join(inputDir, 'accessorie_03.png')}
      ])
      .toBuffer()

    await sharp(buff)
      .flop() // horizontal mirror
      .resize(60, 60)
      .png({
        compressionLevel: 9,
        palette: true
      })
      .toFile(path.join(botOutputDir, '1.png'))
  }

  {
    // Moderation bot avatar: choosing some parts, and turning it so he is facing left.
    const inputDir = './assets/images/avatars/fenec'
    const botOutputDir = './dist/server/bot_avatars/fenec/'
    fs.mkdirSync(botOutputDir, { recursive: true })
    const buff = await sharp(path.join(inputDir, 'body_15.png'))
      .composite([
        { input: path.join(inputDir, 'nose_07.png') },
        { input: path.join(inputDir, 'tail_04.png') },
        { input: path.join(inputDir, 'eyes_03.png') },
        { input: path.join(inputDir, 'mouth_07.png') },
        { input: path.join(inputDir, 'accessories_08.png') },
        { input: path.join(inputDir, 'misc_05.png') },
        { input: path.join(inputDir, 'hat_07.png') }
      ])
      .toBuffer()

    await sharp(buff)
      .flop() // horizontal mirror
      .resize(60, 60)
      .png({
        compressionLevel: 9,
        palette: true
      })
      .toFile(path.join(botOutputDir, '1.png'))
  }

  {
    // Moderation bot avatar: choosing some parts, and turning it so he is facing left.
    const inputDir = './assets/images/avatars/abstract'
    const botOutputDir = './dist/server/bot_avatars/abstract/'
    fs.mkdirSync(botOutputDir, { recursive: true })
    const buff = await sharp(path.join(inputDir, 'body_08.png'))
      .composite([
        { input: path.join(inputDir, 'body_15.png') }, // here we add a second body
        { input: path.join(inputDir, 'fur_08.png') },
        { input: path.join(inputDir, 'mouth_03.png') }
      ])
      .toBuffer()

    await sharp(buff)
      .flop() // horizontal mirror
      .resize(60, 60)
      .png({
        compressionLevel: 9,
        palette: true
      })
      .toFile(path.join(botOutputDir, '1.png'))
  }
}

if (isMainThread) {
  const what = [
    'legacy',
    ...Object.keys(avatarPartsDef),
    'bots'
  ]
  
  // Creating Worker threads to process each avatar type in parallel
  for (const part of what) {
    const p = new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: part
      })
      worker.on('message', resolve)
      worker.on('error', reject)
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject (new Error(`Worker stopped with exit code ${code}`))
        }
      })
    })

    p.then(
      (msg) => console.log(part + ' avatars: ' + msg),
      () => console.error
    )
  }
} else {
  const part = workerData
  if (part === 'legacy') {
    generateLegacyAvatars()
    parentPort.postMessage('done')
  } else if (part === 'bots') {
    generateBotsAvatars().then(
      () => {
        parentPort.postMessage('done')
      },
      (err) => {
        throw err
      }
    )
  } else {
    generateAvatars(part).then(
      () => {
        parentPort.postMessage('done')
      },
      (err) => {
        throw err
      }
    )
  }
}

