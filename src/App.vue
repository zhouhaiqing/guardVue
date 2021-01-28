<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { removeToken } from '@/utils/auth'
export default {
    name: 'App',
    data() {
        return {
            isRouterAlive: true,
            baseUrl: process.env.VUE_APP_BASE_URL
        }
    },
    provide() {
        return {
            reload: this.reload
        }
    },
    mounted() {
        // 区分关闭和刷新，关闭退出登录 start
        window.onload = function() {
            if (!sessionStorage.getItem('isLogin')) {
                removeToken()
                sessionStorage.clear()
                // 不能省，强制跳到登陆页
                location.reload()
            } else {
                window.sessionStorage.removeItem('isLogin')
            }
        }
        window.onunload = function() {
            sessionStorage.setItem('isLogin', true)
        }
        window.onbeforeunload = function() {
            sessionStorage.setItem('isLogin', true)
        }
    },
    methods: {
        reload() {
            this.isRouterAlive = false
            this.$nextTick(function() {
                this.isRouterAlive = true
            })
        }
    }
}
</script>
