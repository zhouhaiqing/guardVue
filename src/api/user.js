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

export function logout(data) {
    return request({
        url: '/admin/user/logout',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/admin/user/update-user',
        method: 'post',
        data
    })
}

export function createUser(data) {
    return request({
        url: '/admin/user/add-user',
        method: 'put',
        data
    })
}

export function switchUserStatus(data) {
    return request({
        url: '/admin/user/switch-status',
        method: 'post',
        data
    })
}

export function deleteUser(data) {
    return request({
        url: '/admin/user/del-user',
        method: 'post',
        data
    })
}

export function userDetail(user_id) {
    return request({
        url: '/admin/user/get-user-detail',
        method: 'get',
        params: { user_id: user_id }
    })
}

export function userList(query) {
    return request({
        url: '/admin/user/get-list',
        method: 'get',
        params: query
    })
}
