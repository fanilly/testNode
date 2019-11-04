import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, LB_LOGIN_USERINFO, LB_UUID } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    uuid: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_UUID: (state, uuid) => {
      state.uuid = uuid
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          console.log(response)
          if(response.code == 1){
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit,state }) {
      return new Promise((resolve) => {
        commit('SET_INFO', Vue.ls.get(LB_LOGIN_USERINFO))
        commit('SET_UUID', Vue.ls.get(LB_UUID))
        const tempPermission = ['dashboard', 'form', 'table', 'profile', 'result', 'exception', 'user', 'support'];
        commit('SET_ROLES', tempPermission)
        resolve(tempPermission);
      })
    },

    // 获取用户信息
    // GetInfo ({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(response => {
    //       const result = response.result

    //       if (result.role && result.role.permissions.length > 0) {
    //         const role = result.role
    //         role.permissions = result.role.permissions
    //         role.permissions.map(per => {
    //           if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
    //             const action = per.actionEntitySet.map(action => { return action.action })
    //             per.actionList = action
    //           }
    //         })
    //         role.permissionList = role.permissions.map(permission => { return permission.permissionId })
    //         commit('SET_ROLES', result.role)
    //         commit('SET_INFO', result)
    //       } else {
    //         reject(new Error('getInfo: roles must be a non-null array !'))
    //       }

    //       commit('SET_NAME', { name: result.name, welcome: welcome() })
    //       commit('SET_AVATAR', result.avatar)

    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // commit('SET_USERID', [])
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove(USERID)
        // Vue.ls.remove(LOGIN_USER_INFO)
        resolve()
      })
    }

  }
}

export default user