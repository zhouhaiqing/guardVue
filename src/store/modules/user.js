import { login, logout, getUserInfo, updateInfo, switchLanguage } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        role_id: 0,
        email: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_USERNAME: (state, username) => {
        state.username = username
    },
    SET_AVATAR: (state, avatar) => {
        // state.avatar = avatar
        state.avatar = avatar ? avatar : 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    },
    SET_ROLEID: (state, role_id) => {
        state.role_id = role_id
    },
    SET_EMAIL: (state, email) => {
        state.email = email
    },
    SET_ORGANID: (state, organ_id) => {
        state.organ_id = organ_id
    },
    SET_ROLENAME: (state, role_name) => {
        state.role_name = role_name
    },
    SET_ORGANTYPE: (state, organ_type) => {
        state.organ_type = organ_type
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password })
                .then(response => {
                    const { code, msg, data } = response
                    console.log(111)
                    if (code !== 0) {
                        this.$message.error(msg)
                    }
                    commit('SET_TOKEN', data.token)
                    setToken(data.token)
                    sessionStorage.setItem('user_id', data.user_id)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
        })
    },

    // get user info
    getUserInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            const user_id = sessionStorage.getItem('user_id')
            getUserInfo(user_id).then(response => {
                const { data } = response
                if (!data) {
                    return reject($t('message.loginForm.loginError'))
                }
                data.roles = ["admin"]
                const { name, avatar, role_id, email, organ_id, organ_type, username, language, role_name } = data
                commit('SET_NAME', name)
                commit('SET_AVATAR', process.env.VUE_APP_BASE_URL + avatar)
                commit('SET_ROLEID', role_id)
                commit('SET_EMAIL', email)
                commit('SET_ORGANID', organ_id)
                commit('SET_USERNAME', username)
                commit('SET_ROLENAME', role_name)
                commit('SET_ORGANTYPE', organ_type)
                // sessionStorage.setItem('user_info', JSON.stringify(data))
                sessionStorage.setItem('language', language === 1 ? 'zh' : 'en')
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    switchLanguage({ commit }, info) {
        const { user_id, language } = info
        return new Promise((resolve, reject) => {
            switchLanguage({ user_id: user_id, language: language }).then(response => {
                const { code } = response
                if (code !== 0) {
                    return reject('Language switch failed')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    updateInfo({ commit }, info) {
        const { email, name, admin_id, role_id } = info
        return new Promise((resolve, reject) => {
            updateInfo({ email: email, display_name: name, admin_id: admin_id, role_id: role_id }).then(response => {
                const { code } = response
                if (code !== 0) {
                    return reject('Update failed')
                }
                commit('SET_NAME', name)
                commit('SET_EMAIL', email)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout({ user_id: sessionStorage.getItem('user_id') }).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                sessionStorage.clear()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
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

