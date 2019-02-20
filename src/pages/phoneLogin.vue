<template>
  <div class="main">
    <mHeader :message="'手机号登陆'"></mHeader>
    <div class="form">
      <div class="item">
        <input placeholder="请输入手机号" v-model="phone" />
      </div>
      <div class="item">
        <input placeholder="请输入密码" v-model="password" type="password" />
      </div>
      <div class="submit" @click.stop="login">登陆</div>
      <div class="tip">
        <router-link to="/recommend" class="text" replace>游客试用</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/base/api'
import mHeader from '@/components/header'
import { Indicator } from 'mint-ui'
export default {
  data () {
    return {
      phone: '',
      password: '',
      iframe: ''
    }
  },
  components: {
    mHeader
  },
  methods: {
    login () {
      Indicator.open('加载中')
      if (this.phone && this.password) {
        login(this.phone, this.password).then(res => {
          Indicator.close()
          if (res.data.code + '' === '200') {
            this.$router.go(-1)
            setTimeout(() => {
              this.$store.state.loginState = true
            }, 2000)
          } else {
            if (res.data.msg) {
              this.toast(res.data.msg)
            } else {
              this.toast('登陆失败，请检查你的账号和密码')
            }
          }
        }).catch(e => {
          const response = e.response.data
          this.toast(response.msg || `错误码：${response.code}`)
          Indicator.close()
        })
      } else {
        Indicator.close()
        this.toast('请输入手机号和密码')
      }
    }
  },
  mounted () {}
}
</script>

<style scoped lang="scss">
@import "@/common/scss/index.scss";
.main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .form {
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
    margin-top: 94px;
    .item {
      margin-top: 15px;
      width: 100%;
      height: 30px;
      line-height: 30px;
      position: relative;
      border-bottom: 1px solid #e4e4e4;
      input {
        &::-webkit-input-placeholder {
          color: $color-text-ggg;
        }
        position: absolute;
        bottom: 3px;
        font-size: 18px;
        line-height: 30px;
        border: 0px;
        outline: none;
        cursor: pointer;
        left: 10px;
      }
    }
  }
  .submit {
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    width: 90%;
    font-size: 0.34rem;
    background: $color-theme;
    border-radius: 0.5rem;
    color: #fff;
    margin: 0 auto;
    margin-top: 30px;
  }
  .tip {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    font-size: 14px;
    text-align: center;
    .text {
      color: #d44439;
      text-decoration: none;
    }
  }
}
</style>
