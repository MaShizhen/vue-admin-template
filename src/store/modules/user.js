import { login, logout, getInfo, auth_info } from '@/api/user'
import { getSessionid, setSessionid, removeSessionid } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  sessionid: getSessionid(),
  usercode: '',
  name: '',
  avatar: '',
  roles: [],
  role_no: '',
  menus: []
}

const mutations = {
  SET_SESSIONID: (state, sessionid) => {
    state.sessionid = sessionid
  },
  SET_USERCODE: (state, usercode) => {
    state.usercode = usercode
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE_NO: (state, role_no) => {
    state.role_no = role_no
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ usercode: username.trim(), userpw: password }).then((data) => {
        commit('SET_SESSIONID', data.sessionID)
        commit('SET_USERCODE', data.usercode)
        commit('SET_NAME', data.user_name)
        commit('SET_AVATAR', data.avatar_path)
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
  },

  // 获取用户权限信息
  auth_info({ commit, state }) {
    return new Promise((resolve) => {
      auth_info(state.role_no).then((data) => {
        commit('SET_ROLE_NO', data.role_no)
        commit('SET_ROLES', data.roles)
        commit('SET_MENUS', data.menus)
        resolve(data.menus)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

