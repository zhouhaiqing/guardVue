import request from '@/utils/request'

export function drawerPriceList(query) {
    return request({
        url: '/admin/drawer-price/get-list',
        method: 'get',
        params: query
    })
}

export function drawerPriceDetail(id) {
    return request({
        url: '/admin/drawer-price/get-price-temp-detail',
        method: 'get',
        params: { price_temp_id: id }
    })
}

export function createPriceTemp(data) {
    return request({
        url: '/admin/drawer-price/add-price-temp',
        method: 'put',
        data
    })
}

export function updatePriceTemp(data) {
    return request({
        url: '/admin/drawer-price/update-price-temp',
        method: 'post',
        data
    })
}

export function deletePriceTemp(data) {
    return request({
        url: '/admin/drawer-price/del-price-temp',
        method: 'post',
        data
    })
}
