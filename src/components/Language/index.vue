<template>
  <div style="float: right; margin: 16px 10px 0 0;">
    <!-- {{ $t('message.loginForm.usernameRequired') }} -->
    <el-dropdown @command="handleCommand">
      <div class="el-dropdown-link language">
        {{ language }}<i class="el-icon-arrow-down el-icon--right" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(lang, index) in languageList" :key="index" v-model="language" :command="index">{{ lang }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import defaultSettings from '../../../src/settings'
const languageList = defaultSettings.languageList
export default {
    name: 'Language',
    inject: ['reload'],
    data() {
        return {
            languageList,
            language: languageList[this.$i18n.locale]
        }
    },
    methods: {
        handleCommand(command) {
            this.$i18n.locale = command
            this.language = languageList[command]
            localStorage.setItem('APP_LANGUAGE', command)
            const title = this.$te('route.' + document.title) ? this.$t('route.' + document.title) : document.title

            document.title = title
            this.reload()
        }
    }
}
</script>
