import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'Home',
            component: () => import('@/views/home/index'),
            meta: { title: 'Home', icon: 'el-icon-s-home', affix: true }
        }]
    },
    {
        path: '/system',
        component: Layout,
        alwaysShow: true,
        meta: { title: 'SystemSettings', icon: 'lock', roles: ['admin'] },
        children: [
            {
                path: 'menu',
                name: 'Menu',
                component: () => import('@/views/system/menu'),
                meta: { title: 'Menu', icon: 'el-icon-menu', noCache: true }
            },
            {
                path: 'role',
                name: 'Role',
                component: () => import('@/views/system/role'),
                meta: { title: 'Role', icon: 'el-icon-s-custom' }
            }
        ]
    },
    {
        path: '/company',
        component: Layout,
        alwaysShow: true,
        meta: { title: 'CompanyManagement', icon: 'lock', roles: ['admin'] },
        children: [
            {
                path: 'locker',
                name: 'locker',
                component: () => import('@/views/company/index'),
                meta: { title: 'LockerOperator', icon: 'el-icon-menu' }
            },
            {
                path: 'courier',
                name: 'courier',
                component: () => import('@/views/company/index'),
                meta: { title: 'Courier', icon: 'el-icon-s-custom' }
            },
            {
                path: 'condo',
                name: 'condo',
                component: () => import('@/views/company/index'),
                meta: { title: 'Condo', icon: 'el-icon-s-custom' }
            }
        ]
    },
    {
        path: '/price',
        component: Layout,
        alwaysShow: true,
        meta: { title: 'PriceManagement', icon: 'money', roles: ['admin'] },
        children: [
            {
                path: 'drawer-price',
                name: 'drawer-price',
                component: () => import('@/views/price/index'),
                meta: { title: 'PriceManagement', icon: 'money', noCache: true }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        alwaysShow: true,
        meta: { title: 'UserManagement', icon: 'user', roles: ['admin'] },
        children: [
            {
                path: 'admin-user',
                name: 'admin-user',
                component: () => import('@/views/user/index'),
                meta: { title: 'AdminUser', icon: 'user', noCache: true }
            },
            {
                path: 'courier-user',
                name: 'courier-user',
                component: () => import('@/views/user/index'),
                meta: { title: 'CourierUser', icon: 'user', noCache: true }
            },
            {
                path: 'condo-user',
                name: 'condo-user',
                component: () => import('@/views/user/index'),
                meta: { title: 'CondoUser', icon: 'user', noCache: true }
            }
        ]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
