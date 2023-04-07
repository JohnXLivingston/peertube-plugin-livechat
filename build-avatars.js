#!/bin/env node
/* eslint-env es6 */

const sharp = require('sharp')
const path = require('path')

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
