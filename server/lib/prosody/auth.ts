/*
This module provides user credential for the builtin prosody module.

A user can get a password thanks to a call to prosodyRegisterUser (see api user/auth).

Then, we can test that the user exists with prosodyUserRegistered, and test password with prosodyCheckUserPassword.

Passwords are randomly generated.

These password are stored internally in a global variable, and are valid for 24h.
Each call to registerUser extends the validity by 24h.

*/

interface Password {
  password: string
  validity: number
}

const PASSWORDS: Map<string, Password> = new Map()

function _getAndClean (user: string): Password | undefined {
  const entry = PASSWORDS.get(user)
  if (entry) {
    if (entry.validity > Date.now()) {
      return entry
    }
    PASSWORDS.delete(user)
  }
  return undefined
}

async function prosodyRegisterUser (user: string): Promise<string> {
  const entry = _getAndClean(user)
  const validity = Date.now() + (24 * 60 * 60 * 1000) // 24h
  if (entry) {
    entry.validity = validity
    return entry.password
  }

  const password = Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12)
  PASSWORDS.set(user, {
    password: password,
    validity: validity
  })
  return password
}

async function prosodyUserRegistered (user: string): Promise<boolean> {
  const entry = _getAndClean(user)
  return !!entry
}

async function prosodyCheckUserPassword (user: string, password: string): Promise<boolean> {
  const entry = _getAndClean(user)
  if (entry && entry.password === password) {
    return true
  }
  return false
}

export {
  prosodyRegisterUser,
  prosodyUserRegistered,
  prosodyCheckUserPassword
}
