<template>
  <el-form>
    <el-form-item :label="this.$t('page.common.displayName')" required>
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <!-- <el-form-item label="Password">
      <el-input v-model.trim="user.password" type="password" />
    </el-form-item> -->
    <el-form-item :label="this.$t('page.common.email')" required>
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submit">{{ $t('page.common.updateBtn') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
    inject: ['reload'],
    props: {
        user: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    email: ''
                    // password: ''
                }
            }
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        submit() {
            this.loading = true
            this.$store
                .dispatch('user/updateInfo', this.user)
                .then(response => {
                    this.loading = false
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                })
                .catch(e => {})
            this.reload()
        }
    }
}
</script>
