function parseConfigUUIDs (s: string): string[] {
  if (!s) {
    return []
  }
  let a = s.split('\n')
  a = a.map(line => {
    return line.replace(/#.*$/, '')
      .replace(/^\s+/, '')
      .replace(/\s+$/, '')
  })
  return a.filter(line => line !== '')
}

export {
  parseConfigUUIDs
}
