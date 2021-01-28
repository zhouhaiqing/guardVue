<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-tabs type="border-card">
            <el-tab-pane :label="this.$t('page.home.account')">
              <account :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'

export default {
    name: 'Home',
    components: { UserCard, Account },
    data() {
        return {
            user: {}
        }
    },
    computed: {
        ...mapGetters(['name', 'avatar', 'role_id', 'email', 'username', 'organ_id'])
    },
    created() {
        this.getUser()
    },
    methods: {
        getUser() {
            this.user = {
                username: this.username,
                name: this.name,
                email: this.email,
                avatar: this.avatar,
                user_id: sessionStorage.getItem('user_id'),
                password: '',
                role_id: this.role_id,
                organ_id: this.organ_id
            }
        }
    }
}
</script>
