interface ExternalComponent {
  name: string
  secret: string
}

function parseExternalComponents (s: string, prosodyDomain: string): ExternalComponent[] {
  if (!s) {
    return []
  }
  let lines = s.split('\n')
  lines = lines.map(line => {
    return line.replace(/#.*$/, '')
      .replace(/^\s+/, '')
      .replace(/\s+$/, '')
  })
  lines = lines.filter(line => line !== '')

  const r: ExternalComponent[] = []
  for (const line of lines) {
    const matches = line.match(/^([\w.]+)\s*:\s*(\w+)$/)
    if (matches) {
      let name = matches[1]
      if (!name.includes('.')) {
        name = name + '.' + prosodyDomain
      }
      r.push({
        name,
        secret: matches[2]
      })
    }
  }
  return r
}

export {
  ExternalComponent,
  parseExternalComponents
}
