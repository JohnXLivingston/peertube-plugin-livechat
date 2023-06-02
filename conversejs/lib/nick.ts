function randomNick (base: string): string {
  // using a 6 digit random number to generate a nickname with low colision risk
  const n = 100000 + Math.floor(Math.random() * 900000)
  return base + ' ' + n.toString()
}

export {
  randomNick
}
