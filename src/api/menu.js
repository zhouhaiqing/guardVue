import request from '@/utils/request'

export function menuList(query) {
    return request({
        url: '/admin/menu/get-list',
        method: 'get',
        params: query
    })
}

export function menuDetail(id) {
    return request({
        url: '/admin/menu/get-menu-detail',
        method: 'get',
        params: { menu_id: id }
    })
}

export function createMenu(data) {
    return request({
        url: '/admin/menu/add-menu',
        method: 'put',
        data
    })
}

export function updateMenu(data) {
    return request({
        url: '/admin/menu/update-menu',
        method: 'post',
        data
    })
}

export function deleteMenu(data) {
    return request({
        url: '/admin/menu/del-menu',
        method: 'post',
        data
    })
}

export function switchMenuStatus(data) {
    return request({
        url: '/admin/menu/switch-status',
        method: 'post',
        data
    })
}
