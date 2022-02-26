const tokenKey = 'token'
const typeKey = 'token-type'

export function getToken() {
  return localStorage.getItem(tokenKey)
}

export function setToken(token) {
  return localStorage.setItem(tokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(tokenKey)
}

export function getTokenType() {
  return localStorage.getItem(typeKey)
}

export function setTokenType(value) {
  return localStorage.setItem(typeKey, value)
}

export function removeTokenType() {
  return localStorage.removeItem(typeKey)
}
