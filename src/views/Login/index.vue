<template>
<div class="app-container">
  <div class="login-container">
    <div class="site-title">MoreCoding管理系统</div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="small" label-width="100px">
      <el-form-item label-width="0" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" clearable prefix-icon='el-icon-user'
                  :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码" clearable prefix-icon='el-icon-lock'
                  show-password :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="login">
        <el-button type="primary" size="small" class="login-btn" @click="login" :loading="loginLoading"> 登录 </el-button>
      </el-form-item>
<!--      <el-form-item size="large">-->
<!--        <el-button type="primary" @click="submitForm">提交</el-button>-->
<!--        <el-button @click="resetForm">重置</el-button>-->
<!--      </el-form-item>-->
    </el-form>
  </div>
  <div class="copyright">Copyright © 2016-2022 <a href="https://www.wouldmissyou.com">多点部落</a> All Rights Reserved. | <a target="_blank"
      href="https://beian.miit.gov.cn/">晋ICP备18005113号-3</a></div>
</div>
</template>

<script>
import {Login} from "@/api";
import {setToken} from "@/utils/storage";

export default {
  name: "Login",
  data(){
    return{
      loginLoading:false,
      formData:{
        username:'',
        password:''
      },
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    login(){
      this.loginLoading = true
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          Login(this.formData).then(res=>{
            this.loginLoading = false
            if(res.code===401){
              this.$message.error('用户名或密码错误')
            }else {
              this.$message.success('欢迎回来~')
              setToken(res.token)
              this.$router.push({name:'Home'})
            }
          })
        } else {
          this.loginLoading = false
          return false;
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.app-container{
  width: 100%;
  height: 100vh;
  background-color: #1f2d3d;
  background-image: url("../../assets/login-background.a70ff998.jpg");
  background-repeat: no-repeat;
  background-size: cover;


  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .login-container{
    width: 400px;
    background-color: #fff;
    border-radius: 10px;
    //height: 400px;
    padding: 25px;
    .site-title{
      font-size: 18px;
      color: #707070;
      text-align: center;
      padding-bottom: 30px;
      font-weight: 700;
    }
  }
  .copyright{
    position: absolute;
    bottom: 10px;
    font-size: 12px;
    color: #fff;
    font-weight: lighter;
    a{
      color: #fff;
    }
  }
}

.login-btn{
  display: block;
  width: 100%;
}

</style>
