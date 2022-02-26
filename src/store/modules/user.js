import { login, logout, getInfo } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getTokenType,
  setTokenType,
  removeTokenType,
} from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  tokenType: getTokenType(),
  id: 0,
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKEN_TYPE: (state, type) => {
    state.tokenType = type
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ID: (state, id) => {
    state.id = id
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
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, type } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password, type })
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          commit('SET_TOKEN_TYPE', data.type)
          setToken(data.token)
          setTokenType(data.type)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo(getTokenType())
        .then((response) => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { id, roles, name, avatar, remark } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_ID', id)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', remark)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(getTokenType())
        .then(() => {
          commit('SET_ID', 0)
          commit('SET_TOKEN', '')
          commit('SET_TOKEN_TYPE', '')
          commit('SET_ROLES', [])
          removeToken()
          removeTokenType()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true,
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}