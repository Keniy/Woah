<template>
  <div>
    <vue-particles
      color="#bebebe"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#bebebe"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-container" label-position="left" label-width="0px" v-loading="loading">
      <h3 class="login_title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default{
  name: 'login',
  data () {
    return {
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      checked: true,
      loginForm: {
        username: 'admin',
        password: '123'
      },
      loading: false
    }
  },
  methods: {
    submitClick: function () {
      console.log(123)
      var _this = this
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          console.log('submit')
          this.loading = true
          this.postRequest('/api/login', {
            username: this.loginForm.username,
            password: this.loginForm.password
          }).then(resp => {
            this.loading = false
            if (resp && resp.status === 200) {
              let data = resp.data
              console.log('token', data.msg.token);
              const roles = []
              data.msg.roles.filter((r) => {
                if(!roles.includes(r.name)) {
                  roles.push(r.name)
                }
              })
              this.$store.commit('SET_AVATAR', data.msg.userface);
              this.$store.commit('SET_TOKEN', data.msg.token); 
              this.$store.commit('SET_ROLES', roles);
              setToken(data.msg.token);
              this.$router.push({ path: '/' })
            } else {
              this.loading = true;
            }
          })
        }
      })
    }
  }
}
</script>
<style>
  body {
    /*background-image: url('../../assets/image/p_02.jpg');*/
  }
  .login-container {
    position: absolute;
    top: 30%;
    left: 40%;
    border-radius: 15px;
    background-clip: padding-box;
    margin: 0 auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba(255 ,215, 215, .15);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    color: white;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
