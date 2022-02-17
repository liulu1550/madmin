<template>
  <div class="app-container">
    <div class="logo">
      <el-image style="width: 32px; height: 32px"
                src="https://demo.django-vue-admin.com/static/img/logo.cfa9160e.png"></el-image>
      <div class="logo-text" :style="{'display':siteNameShow}">More管理系统</div>
    </div>
    <div class="nav-container">
      <el-menu :unique-opened="true" background-color="#304156FF" text-color="#BFCBD9FF" :default-active="defaultActive" :collapse="isCollapse" @select="handleSelect">
        <template v-for="(item, index) in routers">
          <template v-if="!item.meta.hidden">
            <template v-if="item.children.length >1">
              <el-submenu :index="item.path">
                <template slot="title">
                  <i :class="item.meta.icon"></i>
                  <span slot="title">{{ item.meta.title }}</span>
                </template>
                <template v-for="(c_item, c_index) in item.children">
                  <template v-if="!c_item.meta.hidden">
                  <el-menu-item :index="c_item.path">
                    <i :class="c_item.meta.icon"></i>
                    <span slot="title">{{ c_item.meta.title }}</span>
                  </el-menu-item>
                  </template>
                </template>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :index="item.path">
                <i :class="item.children[0].meta.icon"></i>
                <span slot="title">{{ item.children[0].meta.title }}</span>
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
      defaultActive: this.$route.path,
      siteNameShow: 'block',
    }
  },
  mounted() {
    // console.log(this.$route)
  },
  watch: {
    // 监听store中
    '$store.state.layoutConfig.navIsCollapse': function (newval) {
      this.isCollapse = newval
      if(newval){
        this.siteNameShow = 'none'
      }else {
        this.siteNameShow = 'block'
      }
    },
    // 切换激活状态
    $route: {
      handler: function (val, obj) {
        this.defaultActive = val.path
      }
    },
  },
  methods: {
    // 点击导航菜单栏，跳转到对应的页面
    handleSelect(key, keyPath) {
      if (this.$route.path !== key) {
        this.$router.push(key)
      }
    },

  }
}
</script>

<style scoped lang="scss">
.app-container {
  .logo {
    //padding: 0 20px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    color: #ffff;
    font-weight: 600;
    font-size: 14px;
    //line-height: 50px;
    margin-left: 20px;
    margin-top: 10px;
    .logo-text {
      margin-left: 10px;
    }
  }

  .nav-container {
    .sub-title {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .sub-icon {
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

  .nav-container /deep/ .is-active {
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
