#!/bin/node

const sharp = require('sharp')
const path = require('path')

const inputDir = './public/images/avatars/'
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
    sharp(inputFile).flatten({background}).resize(120, 120).jpeg().toFile(path.join(outputDir, out.toString() + '.jpg'))
  }
}

// for i in {1..10}; do
//   ./node_modules/sharp-cli/bin/cli.js -i ./public/images/avatars/$i.svg -o ./dist/server/avatars/$i.jpg -f jpg resize 120 120 -- flatten '#ffffff';
//   ./node_modules/sharp-cli/bin/cli.js -i ./public/images/avatars/$i.svg -o ./dist/server/avatars/$(( $i + 10 )).jpg -f jpg resize 120 120 -- flatten '#ff0000';
//   ./node_modules/sharp-cli/bin/cli.js -i ./public/images/avatars/$i.svg -o ./dist/server/avatars/$(( $i + 20 )).jpg -f jpg resize 120 120 -- flatten '#00ff00';
//   ./node_modules/sharp-cli/bin/cli.js -i ./public/images/avatars/$i.svg -o ./dist/server/avatars/$(( $i + 30 )).jpg -f jpg resize 120 120 -- flatten '#0000ff';
//   ./node_modules/sharp-cli/bin/cli.js -i ./public/images/avatars/$i.svg -o ./dist/server/avatars/$(( $i + 40 )).jpg -f jpg resize 120 120 -- flatten '#808000';
//   #bis=$(( $i + 30 ));
// done
