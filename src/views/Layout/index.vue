<template>
<div class="app-container">
  <div class="left-nav-container">
    <left-nav-bar />
  </div>
  <div class="right-container">
    <div class="top-header-container">
      <top-header-bar />
    </div>
    <div class="main-container">
      <keep-alive>
        <router-view />
      </keep-alive>
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
  }
}
</script>

<style scoped lang="scss">
.left-nav-container{
  width: 200px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgb(48, 65, 86);
}
.right-container{
  padding-left: 200px;
  .top-header-container{
    width: 100%;
    height: 50px;
    background: aquamarine;
    position: fixed;
    top: 0;
  }
  .main-container{
    padding: 70px 20px 20px 20px;
    height: 1000px;
    background: burlywood;
  }
}

</style>
