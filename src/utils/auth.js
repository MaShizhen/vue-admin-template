import Cookies from 'js-cookie'

const SessionidKey = 'sessionid'

export function getSessionid() {
  return sessionStorage.getItem(SessionidKey)
}

export function setSessionid(sessionid) {
  sessionStorage.setItem(SessionidKey, sessionid)
  Cookies.set(SessionidKey, sessionid)
}

export function removeSessionid() {
  sessionStorage.removeItem(SessionidKey)
  Cookies.remove(SessionidKey)
}
