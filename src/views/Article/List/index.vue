<template>
<div class="app-container">
  ArticleList
</div>
</template>

<script>
import {ListArticle} from "@/api";

export default {
  name: "ArticleList",
  data(){
    return{
      // 表格loading
      loading: true,
      // 表格数据
      tableData: [],
      // 数据请求参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
      },
      // 批量删除状态
      multiple: true,
      ids: [],
      // 修改状态
      single: true,
    }
  },
  mounted() {
    this.getList()
  },
  methods:{
    getList(){
      ListArticle().then(res=>{
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
