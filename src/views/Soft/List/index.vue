<template>
<div class="app-container">
  <div class="btn-container">
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog" plain>新增</el-button>
    <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single" @click="handleEdit" plain>修改</el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple" plain @click="handleDelete">批量删除</el-button>
  </div>

  <div class="soft-dialog-container">
    <soft-dialog :dialog-title="addDialogTitle" :visible.sync="softDialogVisible" />
  </div>
</div>
</template>

<script>
import softDialog from "@/components/softDialog";

export default {
  name:'SoftList',
  components:{
    'soft-dialog':softDialog
  },
  data(){
    return{
      // 批量删除状态
      multiple: true,
      ids:[],
      // 修改状态
      single: true,
      // 是否修改软件
      isEdit:false,
      // 软件dialog标题
      addDialogTitle:'添加软件',
      // 软件dialog显示状态
      softDialogVisible:false
    }
  },
  methods:{
    /** 显示添加dialog **/
    showAddDialog(){
      this.softDialogVisible = true
      this.isEdit = false
      this.addDialogTitle = '添加软件'
    },
    /** 显示修改dialog **/
    handleEdit(row){},
    /**删除 批量删除**/
    handleDelete(row){},
  }
}
</script>
