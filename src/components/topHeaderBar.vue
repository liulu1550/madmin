<template>
<div class="app-container">
  <div class="collapse-wrapper">
    <i class="el-icon-s-fold" @click="changeNavBarStatus"></i>
  </div>
</div>
</template>

<script>
export default {
  name: "topHeaderBar",
  data(){
    return{

    }
  },
  methods:{
    changeNavBarStatus(){
      this.$store.state.layoutConfig.navIsCollapse = !this.$store.state.layoutConfig.navIsCollapse
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
  .collapse-wrapper{
    margin-left: 20px;
    font-size: 20px;
  }
}
</style>
