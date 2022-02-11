<template>
  <div class="app-container">
    <div class="logo">
      <el-image style="width: 32px; height: 32px"
                src="https://demo.django-vue-admin.com/static/img/logo.cfa9160e.png"></el-image>
      <div class="logo-text">More管理系统</div>
    </div>
    <div class="nav-container">
      <el-menu background-color="#304156FF" text-color="#BFCBD9FF" :default-active="defaultActive"
               @open="handleOpen" @close="handleClose" :collapse="isCollapse"  @select="handleSelect">

        <template v-for="(item, index) in routers">
          <template v-if="!item.meta.hidden">
            <template v-if="item.children.length >1">
              <el-submenu :index="item.path">
                <span class="sub-title" slot="title"><i :class="item.meta.icon"></i>{{ item.meta.title }}</span>
                <template v-for="(c_item, c_index) in item.children">
                  <el-menu-item :index="c_item.path"><i :class="c_item.meta.icon" class="sub-icon"></i>{{ c_item.meta.name }}</el-menu-item>
                </template>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :index="item.path">
                <i :class="item.children[0].meta.icon"></i>
                <span slot="title">{{ item.children[0].meta.name }}</span>
              </el-menu-item>
            </template>
          </template>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "leftNavBar",
  data() {
    return {
      isCollapse: this.$store.state.layoutConfig.navIsCollapse,
      routers: this.$router.options.routes,
      defaultActive:this.$route.path
    }
  },
  mounted() {
    console.log(this.$router.options.routes)
  },
  watch: {
    // 监听store中
    '$store.state.layoutConfig.navIsCollapse': function (newval) {
      this.isCollapse = newval
    },
    // 切换激活状态
    $route: {
      handler: function (val, obj) {
        this.defaultActive = val.path
      }
    },
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 点击导航菜单栏，跳转到对应的页面
    handleSelect(key, keyPath) {
      if (this.$route.path!==key){
        this.$router.push(key)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  .logo {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    color: #ffff;
    font-weight: 600;
    font-size: 14px;
    line-height: 50px;

    .logo-text {
      margin-left: 10px;
    }
  }
  .nav-container {
    .sub-title{
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .sub-icon{
      font-size: 14px;
      margin-right: 5px;
    }
  }

  .nav-container /deep/ .el-submenu__title {
    border-right: none;
    font-size: 13px;
    font-weight: lighter;
    &:hover {
      background-color: rgba(0, 0, 0, 0.06) !important;
    }
  }

  .nav-container /deep/ .el-menu {
    border-right: none;
  }

  .nav-container /deep/ .el-submenu {
    background-color: #1f2d3d !important;
  }

  .nav-container /deep/ .el-menu-item {
    color: rgb(191, 203, 217);
    font-weight: lighter;
    font-size: 13px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.06) !important;
    }
  }
  .nav-container /deep/ .is-active{
    color: #409EFF;
  }
}
</style>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}


.el-menu .el-menu--inline {
  background-color: #1f2d3d !important;
}

.el-menu .el-menu--inline .el-menu-item {
  background-color: #1f2d3d !important;
}

</style>
