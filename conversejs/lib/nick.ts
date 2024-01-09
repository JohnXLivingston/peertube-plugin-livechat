/**
 * Generates a random nickname.
 * @param base Nickname prefix
 * @returns A nickname like "Given Base 12345"
 */
function randomNick (base: string): string {
  // using a 6 digit random number to generate a nickname with low colision risk
  const n = 100000 + Math.floor(Math.random() * 900000)
  return base + ' ' + n.toString()
}

/**
 * Get the previous anonymous nickname (stored in localStorage).
 * If it was set more than 12 hours ago, it will be ignored (considering the nickname should not remain forever).
 * @returns previous nickname or null
 */
function getPreviousAnonymousNick (): string | null {
  try {
    const lastAccess = parseInt(localStorage.getItem('livechat-previous-anonymous-nickname-last-access') ?? '0')
    const now = Date.now()
    if (lastAccess && !isNaN(lastAccess)) {
      const expires = lastAccess + 1000 * 60 * 60 * 12 // nickname expires after 12 hours
      if (now > expires) {
        console.log('Anonymous nickname has expired.')
        localStorage.removeItem('livechat-previous-anonymous-nickname')
        localStorage.removeItem('livechat-previous-anonymous-nickname-last-access')
        return null
      }
    }
    const nick = localStorage.getItem('livechat-previous-anonymous-nickname')
    if (nick !== null) {
      localStorage.setItem('livechat-previous-anonymous-nickname-last-access', now.toString())
    }
    return nick
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Stores the chosen nickname in localStorage.
 */
function setPreviousAnonymousNick (nick: string): void {
  try {
    console.log('Storing anonymous nickname', nick)
    localStorage.setItem('livechat-previous-anonymous-nickname', nick)
    localStorage.setItem('livechat-previous-anonymous-nickname-last-access', Date.now().toString())
  } catch (err) {
    console.error(err)
  }
}

export {
  randomNick,
  getPreviousAnonymousNick,
  setPreviousAnonymousNick
}
