import request from '@/utils/request'

export function roleList(query) {
    return request({
        url: '/admin/role/get-list',
        method: 'get',
        params: query
    })
}

export function roleDetail(id) {
    return request({
        url: '/admin/role/get-role-detail',
        method: 'get',
        params: { role_id: id }
    })
}

export function createRole(data) {
    return request({
        url: '/admin/role/add-role',
        method: 'put',
        data
    })
}

export function updateRole(data) {
    return request({
        url: '/admin/role/update-role',
        method: 'post',
        data
    })
}

export function deleteRole(data) {
    return request({
        url: '/admin/role/del-role',
        method: 'post',
        data
    })
}

export function switchRoleStatus(data) {
    return request({
        url: '/admin/role/switch-status',
        method: 'post',
        data
    })
}
