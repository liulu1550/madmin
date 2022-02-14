<template>
<div class="app-container">
  <div class="left-nav-container" :style="{'width':leftNavBarWidth}">
    <left-nav-bar />
  </div>
  <div class="top-header-container" :style="{'padding-left':leftNavBarWidth}">
    <top-header-bar />
  </div>
  <div class="right-container" :style="{'padding-left':leftNavBarWidth}">
   <div class="main">
     <template  v-if="$route.meta.keepAlive">
       <keep-alive>
         <router-view />
       </keep-alive>
     </template>
     <template v-else>
       <router-view />
     </template>
   </div>
  </div>
</div>
</template>

<script>
import leftNavBar from "@/components/leftNavBar";
import topHeaderBar from "@/components/topHeaderBar";
export default {
  name: "Layout",
  components:{
    'left-nav-bar':leftNavBar,
    'top-header-bar':topHeaderBar,
  },
  data(){
    return{
      leftNavBarWidth:'200px'
    }
  },
  watch:{
    // 监听菜单栏变化
    '$store.state.layoutConfig.navIsCollapse':function (val){
      if(val){
        this.leftNavBarWidth ="64px"
      }else {
        this.leftNavBarWidth ="200px"
      }
    }
  },
}
</script>

<style scoped lang="scss">
.left-nav-container{
  height: 100%;
  //width: 200px;
  position: fixed;
  top: 0;
  left: 0;
  background: rgb(48, 65, 86);
  transition: width .3s;
  z-index: 999;
}
.top-header-container{
  width: 100%;
  display: block;
  height: 50px;
  background: #fff;
  position: fixed;
  top: 0;
  box-sizing: border-box;
  box-shadow:0 1px 4px rgba(0, 21, 41, .08);
  z-index: 998;
  transition: padding-left .3s;
}
.right-container{
  box-sizing: border-box !important;
  transition: padding-left .3s;

  padding: 50px 0 0 0;
  //background: burlywood;
  .main{
    width: 100%;
    height: 100%;
    //background-color: #409EFF;
    padding: 20px;
  }
}

</style>
