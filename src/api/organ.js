import request from '@/utils/request'

export function organList(query) {
    return request({
        url: '/admin/organ/get-list',
        method: 'get',
        params: query
    })
}

export function organDetail(id) {
    return request({
        url: '/admin/organ/get-organ-detail',
        method: 'get',
        params: { organ_id: id }
    })
}

export function createOrgan(data) {
    return request({
        url: '/admin/organ/add-organ',
        method: 'put',
        data
    })
}

export function updateOrgan(data) {
    return request({
        url: '/admin/organ/update-organ',
        method: 'post',
        data
    })
}

export function deleteOrgan(data) {
    return request({
        url: '/admin/organ/del-organ',
        method: 'post',
        data
    })
}

export function switchOrganStatus(data) {
    return request({
        url: '/admin/organ/switch-status',
        method: 'post',
        data
    })
}

export function approveOrgan(data) {
    return request({
        url: '/admin/organ/approve',
        method: 'post',
        data
    })
}
