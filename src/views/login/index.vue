<template>
  <div>
    <div class="background">
      <img :src="imgSrc.bc" width="100%" height="100%" alt="">
    </div>

    <!-- <language-tmp /> -->
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left"
        style="background-color: #fff; margin: 20px auto 0 auto">
        <div style="text-align:center; width:100px; height:120px;margin:auto">
          <img :src="imgSrc.logo" width="100px" height="120px" alt="">
        </div>
        <div class="message">SantaConnect</div>
        <div id="darkbannerwrap">
          <img :src="imgSrc.aiwrap" style="width: 18px; height: 10px; margin: 0 0 20px -58px; position: relative;">
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model.trim="loginForm.username" :placeholder="placeholders.username" name="username" type="text" tabindex="1"
            auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model.trim="loginForm.password" :type="passwordType" :placeholder="placeholders.password"
            name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-button :loading="loading" type="primary"
          style="display: inline-block; vertical-align: middle; padding: 12px 24px; margin: 0px; font-size: 18px; line-height: 24px; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; color: #ffffff; background-color: #27A9E3; border-radius: 1px; border: none; -webkit-appearance: none; outline: none; width: 100%; "
          @click.native.prevent="handleLogin">
          {{ $t('message.loginForm.loginBtn') }}</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import LanguageTmp from '@/components/Language'

export default {
    name: 'Login',
    components: { LanguageTmp },
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            placeholders: {
                username: this.$t('message.loginForm.username'),
                password: this.$t('message.loginForm.password')
            },
            loginRules: {
                username: [{ required: true, trigger: 'blur', message: this.$t('message.loginForm.usernameRequired') }],
                password: [
                    { required: true, trigger: 'blur', message: this.$t('message.common.passwordRequired') },
                    { max: 20, min: 6, trigger: 'blur', message: this.$t('message.common.passwordLength') }
                ]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            imgSrc: {
                bc: require('../../assets/img/9.png'),
                logo: require('../../assets/img/vikily.png'),
                aiwrap: require('../../assets/img/aiwrap.png')
            }
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store
                        .dispatch('user/login', this.loginForm)
                        .then(() => {
                            this.$router.push({ path: this.redirect || '/' })
                            this.loading = false
                        })
                        .catch(err => {
                            this.loading = false
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #37554a;
$light_gray: #fff;
$cursor: rgb(156, 154, 154);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #dcdee0;
    vertical-align: middle;
    border-radius: 3px;
    height: 50px;
    padding: 0px 16px;
    font-size: 14px;
    color: #555555;
    outline: none;
    width: 100%;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #24af7a;
$dark_gray: #889aa4;
$light_gray: #f39797;

.language {
  padding: 6px 5px 6px 15px;
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.background {
  width: 100%;
  height: 100%; /**宽高100%是为了图片铺满屏幕 */
  position: absolute;
  display: block;
}

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    margin: 20px auto 0 auto;
    min-height: 420px;
    max-width: 420px;
    padding: 40px;
    background-color: #ffffff;
    margin-left: auto;
    margin-right: auto;
    border-radius: 4px; /* overflow-x: hidden; */
    box-sizing: border-box;

    .message {
      margin: 10px 0 0 -58px;
      padding: 18px 10px 18px 60px;
      background: #27a9e3;
      position: relative;
      color: #fff;
      font-size: 22px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
