function helpUrl (options: {
  lang?: string
  page?: string
}): string {
  let url = 'https://livingston.frama.io/peertube-plugin-livechat/'
  if (options.lang && /^[a-zA-Z_-]+$/.test(options.lang)) {
    url = url + options.lang + '/'
  }
  if (options.page && /^[\w/-]+$/.test(options.page)) {
    url = url + options.page + '/'
  }
  return url
}

export {
  helpUrl
}
