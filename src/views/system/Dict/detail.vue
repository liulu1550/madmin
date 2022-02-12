<template>
<div class="app-container">

</div>
</template>

<script>
import {DetailDictType, GetDictDetailList, GetDictType} from "@/api";

export default {
  name: "DictDetail",
  data(){
    return{
      // 默认字典类型
      defaultDictType: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
    }
  },
  created() {
    const dictId = this.$route.params && this.$route.params.dictId;
    this.getDictTypeList()
    this.getType(dictId);
  },
  methods:{
    /** 查询字典类型列表 */
    getDictTypeList(){
      GetDictType({pageNum:'all'}).then(res=>{
        console.log(res)
      })
    },
    /** 查询字典类型详细 */
    getType(dictId){
      DetailDictType(dictId).then(res=>{
        this.queryParams.dictType = res.data.dictType;
        this.defaultDictType = res.data.dictType;
        this.getList();
      })
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      GetDictDetailList(this.queryParams).then((response) => {
        console.log(response)
        this.dataList = response.data.results;
        this.total = response.data.count;
        this.loading = false;
      });
    },

  }
}
</script>

<style scoped lang="scss">

</style>
