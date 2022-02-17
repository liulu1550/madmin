<template>
<div class="app-container">
  <div class="btn-container">
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog" plain>新增</el-button>
    <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single" @click="handleEdit" plain>修改</el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple" plain @click="handleDelete">批量删除</el-button>
  </div>
  <div class="soft-table-container">
    <el-table
        :data="tableData.results"
        :header-row-style="rowClass"
        style="width: 100%"
        size="small"
        v-loading="loading"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55"
          header-align="center"
          align="center">
      </el-table-column>
      <el-table-column
          prop="id"
          label="软件编号"
          header-align="center"
          align="center"
      >
      </el-table-column>
      <el-table-column
          header-align="center"
          align="center"
          label="软件名称"
          width="150">
        <template slot-scope="scope">
          <div class="text line1">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
          prop="category_name"
          label="软件分类"
          header-align="center"
          align="center">
      </el-table-column>
      <el-table-column
          header-align="center"
          align="center"
          label="图标"
          width="150">
        <template slot-scope="scope">
          <el-image
              style="width: 35px; height: 35px"
              :src="scope.row.icon_url"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
          label="软件状态"
          header-align="center"
          align="center">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.status"
              disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
          prop="download_num"
          label="下载数量"
          header-align="center"
          align="center">
      </el-table-column>
      <el-table-column
          prop="comment_num"
          label="评论数量"
          header-align="center"
          align="center">
      </el-table-column>
      <el-table-column
          prop="create_datetime"
          label="创建时间"
          header-align="center"
          align="center"
          width="150px">
      </el-table-column>
      <el-table-column
          label="操作"
          header-align="center"
          align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="small" type="text" @click="handleEdit(scope.row)">修改</el-button>
          <el-button icon="el-icon-s-operation" size="small" type="text" @click="handleEdit(scope.row)">版本管理</el-button>
          <el-button icon="el-icon-delete" size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="pagination-container">
    <el-pagination
        background
        layout="sizes,total,prev, pager, next"
        :current-page="queryParams.pageNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 30, 40]"
        :total="tableData.count">
    </el-pagination>
  </div>
  <div class="soft-dialog-container">
    <soft-dialog :soft-id="editSoftId" :is-edit="isEdit" :dialog-title="addDialogTitle" :visible.sync="softDialogVisible" @soft-dialog-close="softDialogClose" />
  </div>
</div>
</template>

<script>
import softDialog from "@/components/softDialog";
import {DeleteSoft, GetSoftList} from "../../../api";

export default {
  name:'SoftList',
  components:{
    'soft-dialog':softDialog
  },
  data(){
    return{
      // 表格数据
      tableData:{},
      // 表格加载状态
      loading:true,
      // 请求参数
      queryParams:{
        pageNum:1,
        pageSize: 10,
        name: undefined,
      },
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
      softDialogVisible:false,
      // 修改软件时传到子组件的id
      editSoftId:null,
    }
  },
  mounted() {
  this.getList()
    },
  methods:{

    /** 获取表格数据 **/
    getList(){
      this.loading = true
      GetSoftList(this.queryParams).then(res=>{
        this.loading = false
        this.tableData = res.data
      })
    },
    /**多选**/
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /**点击分页数据**/
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    /**修改分页条目数**/
    handleSizeChange(val) {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = val
      this.getList()
    },
    /** 显示添加dialog **/
    showAddDialog(){
      this.softDialogVisible = true
      this.isEdit = false
      this.addDialogTitle = '添加软件'
      this.editSoftId = null
    },
    /** 显示修改dialog **/
    handleEdit(row){
      const ids = row.id || this.ids[0];
      this.softDialogVisible = true
      this.isEdit = true
      this.addDialogTitle = '修改软件'
      this.editSoftId = ids
    },
    /**softDialog关闭时的时间**/
    softDialogClose(data){
      console.log(data)
      this.softDialogVisible = false
      this.isEdit = false
      this.addDialogTitle = '添加软件'
      this.editSoftId = null
      if(!data||data===undefined){
        this.getList()
      }
    },
    /**删除 批量删除**/
    handleDelete(row){
      const ids = row.id || this.ids;
      this.$confirm(`是否确认删除文件编号为'${ids}'的数据项吗？`,"警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        if(ids instanceof Array){
          for(var i = 0; i < ids.length; i++){
            DeleteSoft(ids[i]).then(res=>{
              this.$message.success('删除成功')
              this.getList()
            }).catch(err=>{
              console.log(err)
              this.$message.error('删除失败！该数据或与其他相关数据绑定')
              this.getList();
            })
          }
        }else{
          DeleteSoft(ids).then(res=>{
            this.$message.success('删除成功')
            this.getList()
          }).catch(err=>{
            console.log(err)
            this.$message.error('删除失败！该数据或与其他相关数据绑定')
            this.getList();
          })
        }
      })
    },
    /**表格头背景颜色**/
    rowClass() {
      return 'background:#eef1f6;'
    },
  }
}
</script>
