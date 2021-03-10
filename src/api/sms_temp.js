import request from '@/utils/request'


export function updateSmsTemp(data) {
    return request({
        url: '/admin/sms-templates/update-sms-temp',
        method: 'post',
        data
    })
}

export function createSmsTemp(data) {
    return request({
        url: '/admin/sms-templates/add-sms-temp',
        method: 'put',
        data
    })
}

export function switchSmsTempStatus(data) {
    return request({
        url: '/admin/sms-templates/switch-status',
        method: 'post',
        data
    })
}

export function deleteSmsTemp(data) {
    return request({
        url: '/admin/sms-templates/del-sms-temp',
        method: 'post',
        data
    })
}

export function smsTempDetail(user_id) {
    return request({
        url: '/admin/sms-templates/get-sms-temp-detail',
        method: 'get',
        params: { user_id: user_id }
    })
}

export function smsTempList(query) {
    return request({
        url: '/admin/sms-templates/get-list',
        method: 'get',
        params: query
    })
}
