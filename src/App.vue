<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.btn-container {
  margin-bottom: 20px;
}
</style>
<style>
.app-container /deep/ .el-table__header{
  background-color: #eef1f6;
}
</style>
