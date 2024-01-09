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
 * Get the previous anonymous nickname (stored in sessionStorage).
 * @returns previous nickname or null
 */
function getPreviousAnonymousNick (): string | null {
  try {
    return sessionStorage.getItem('livechat-previous-anonymous-nickname')
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Stores the chosen nickname in sessionStorage.
 */
function setPreviousAnonymousNick (nick: string): void {
  try {
    console.log('Storing anonymous nickname', nick)
    sessionStorage.setItem('livechat-previous-anonymous-nickname', nick)
  } catch (err) {
    console.error(err)
  }
}

export {
  randomNick,
  getPreviousAnonymousNick,
  setPreviousAnonymousNick
}
