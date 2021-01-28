import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/admin/login/login',
        method: 'post',
        data
    })
}

export function getUserInfo(user_id) {
    return request({
        url: '/admin/user/get-user-info',
        method: 'get',
        params: { user_id }
    })
}

export function switchLanguage(data) {
    return request({
        url: '/admin/user/switch-language',
        method: 'post',
        data
    })
}

export function updateInfo(data) {
    return request({
        url: '/admin/user/update',
        method: 'post',
        data
    })
}

export function logout(data) {
    return request({
        url: '/admin/user/logout',
        method: 'post',
        data
    })
}
