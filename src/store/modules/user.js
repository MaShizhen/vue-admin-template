import { login, logout, getInfo } from '@/api/user'
import { getSessionid, setSessionid, removeSessionid } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  sessionid: getSessionid(),
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_SESSIONID: (state, sessionid) => {
    state.sessionid = sessionid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    debugger

    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ usercode: username.trim(), userpw: password }).then((data) => {
        commit('SET_SESSIONID', data.sessionID)
        setSessionid(data.sessionID)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.sessionid).then((data) => {
        const { roles, name, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.sessionid).then(() => {
        commit('SET_SESSIONID', '')
        commit('SET_ROLES', [])
        removeSessionid()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove sessionid
  resetSessionid({ commit }) {
    return new Promise(resolve => {
      commit('SET_SESSIONID', '')
      commit('SET_ROLES', [])
      removeSessionid()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

