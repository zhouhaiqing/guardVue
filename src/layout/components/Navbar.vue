<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <el-button type="primary" icon="el-icon-s-home" size="small" style="margin: 10px 10px auto auto;">{{ $t('message.common.homeTitle') }}</el-button>
    <el-button type="primary" icon="el-icon-refresh" size="small" @click="switchLanguage()" style="margin: 10px 10px auto auto;">
      {{ $t('message.common.langTitle') }}
    </el-button>
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- <language-tmp /> -->
    <div class="right-menu">
      <!-- <el-button icon="el-icon-switch-button" size="small" @click.native="logout" style="margin: 10px 10px auto auto;">
        {{ $t('message.common.logOut') }}
      </el-button>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import LanguageTmp from '@/components/Language'
export default {
    inject: ['reload'],
    components: {
        // Breadcrumb,
        Hamburger
        // LanguageTmp
    },
    computed: {
        ...mapGetters(['sidebar', 'avatar'])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        },
        switchLanguage() {
            const language = sessionStorage.getItem('language') === 'zh' ? 2 : 1
            const user_id = parseInt(sessionStorage.getItem('user_id'))
            this.$store.dispatch('user/switchLanguage', { user_id: user_id, language: language })
            const locale = sessionStorage.getItem('language') === 'zh' ? 'en' : 'zh'
            this.$i18n.locale = locale
            sessionStorage.setItem('language', locale)
            this.reload()
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
