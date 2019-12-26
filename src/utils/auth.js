import Cookies from 'js-cookie'

const SessionidKey = 'sessionid'

export function getSessionid() {
  return Cookies.get(SessionidKey)
}

export function setSessionid(sessionid) {
  return Cookies.set(SessionidKey, sessionid)
}

export function removeSessionid() {
  return Cookies.remove(SessionidKey)
}
