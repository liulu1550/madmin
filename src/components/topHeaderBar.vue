<template>
<div class="app-container">
  <div class="collapse-wrapper">
    <i class="el-icon-s-fold" @click="changeNavBarStatus"></i>
    <div class="breadcrumd-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">控制台</el-breadcrumb-item>
        <template v-if="$route.path !== '/'">
          <template v-for="(item, index) in $route.matched">
            <el-breadcrumb-item>{{item.meta.title}}</el-breadcrumb-item>
          </template>
        </template>
      </el-breadcrumb>
    </div>
  </div>
  <div class="right-btn-group">
    <el-tooltip class="item" effect="dark" content="接口文档" placement="bottom">
      <i class="el-icon-s-opportunity"></i>
    </el-tooltip>
    <div class="avatar-dropdown">
      <el-dropdown trigger="click" @command="dropDownCommand">
      <span class="el-dropdown-link">
        <el-avatar shape="circle" size="medium" :src="userinfo.avatar"></el-avatar><i class="el-icon-caret-bottom"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">个人中心</el-dropdown-item>
          <el-dropdown-item command="setting">布局设置</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>

</div>
</template>

<script>
import {getUser, removeToken, removeUser} from "@/utils/storage";
import {mapGetters} from 'vuex'
export default {
  name: "topHeaderBar",
  data(){
    return{
      userinfo:JSON.parse(getUser())
    }
  },
  methods:{
    changeNavBarStatus(){
      this.$store.state.layoutConfig.navIsCollapse = !this.$store.state.layoutConfig.navIsCollapse
    },
    // 点击头像的事件
    dropDownCommand(command){
      if (command==='logout'){
        this.$confirm("确定要退出登录吗？",'提示',{
          cancelButtonText:'取消',
          confirmButtonText:'确定',
          type:'warning'
        }).then(()=>{
          removeToken()
          removeUser()
          this.$router.push({name:'Login'})
        }).catch(()=>{

        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.app-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-right: 20px;
  .collapse-wrapper{
    margin-left: 20px;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .breadcrumd-container{
      margin-left: 20px;
    }
  }
  .right-btn-group{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .el-icon-document{
      padding: 0 10px;
    }
    .avatar-dropdown{
      padding: 0 10px;
      .el-dropdown-link{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }
}
.el-icon-s-opportunity{
  color: #5a5e66;
  font-size: 18px;
}
</style>
