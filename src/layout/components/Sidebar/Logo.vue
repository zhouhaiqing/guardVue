<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <div class="sidebar-title">{{ $t('message.common.sidebarTitle') }}：{{ username }}</div>
        <!-- <h1 v-else class="sidebar-title">{{ title }} </h1> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <!-- <h1 class="sidebar-title">{{ title }} </h1> -->
        <div class="sidebar-title">{{ $t('message.common.sidebarTitle') }}：{{ username }}
          <div style="margin-top: -30px;">{{ role_name }}</div>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
    name: 'SidebarLogo',
    props: {
        collapse: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            title: 'SantaConnect',
            logo: require('../../../assets/img/logo.png'),
            username: this.$store.state.user.username,
            role_name: this.$store.state.user.role_name
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 173px;
  line-height: 130px;
  background: #143246;
  text-align: center;
  overflow: hidden;
  background-image: url('../../../assets/img/header-profile.png');

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 90px;
      height: 90px;
      vertical-align: middle;
      margin-left: -70px;
      margin-top: -18px;
    }

    & .sidebar-title {
      display: block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      margin-left: -70px;
      margin-top: -38px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
