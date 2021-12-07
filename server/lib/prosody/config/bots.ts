function parseConfigDemoBotUUIDs (s: string): string[] {
  if (!s) {
    return []
  }
  let a = s.split('\n')
  // find lines that are like:
  // 6432f147-83c7-4fa3-b3b5-e49c2590e825 #!demobot
  a = a.filter(line => /#!demobot\b/.test(line))
  a = a.map(line => {
    return line.replace(/#.*$/, '')
      .replace(/^\s+/, '')
      .replace(/\s+$/, '')
  })
  return a.filter(line => line !== '')
}

export {
  parseConfigDemoBotUUIDs
}
