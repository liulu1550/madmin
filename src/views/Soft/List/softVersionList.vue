<template>
  <div class="app-container">
    <el-dialog v-bind="$attrs" v-on="$listeners" :close-on-click-modal="false" :show-close="false"
               :visible.sync="softVersionVisible" title="软件版本" width="1200px">
      <div class="btn-container">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAddVersion" plain>新增</el-button>
        <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single" plain>修改</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple" @click="handelDelete" plain>批量删除</el-button>
      </div>
      <div class="version-table-container">
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
              label="版本编号"
              header-align="center"
              align="center">
          </el-table-column>
          <el-table-column
              header-align="center"
              align="center"
              label="版本号"
              width="150">
            <template slot-scope="scope">
              <div class="text line1">{{scope.row.version_num}}</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="platform_name"
              label="软件平台"
              header-align="center"
              align="center">
          </el-table-column>
          <el-table-column
              prop="platform_version_name"
              label="软件平台版本"
              header-align="center"
              align="center">
          </el-table-column>
          <el-table-column
              prop="language_name"
              label="语言"
              header-align="center"
              align="center">
          </el-table-column>
          <el-table-column
              prop="soft_name"
              label="所属软件"
              header-align="center"
              align="center">
          </el-table-column>
          <el-table-column
              header-align="center"
              align="center"
              label="软件地址"
              width="150">
            <template slot-scope="scope">
              <div class="text line1">{{scope.row.file_url}}</div>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              header-align="center"
              align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="small" type="text" @click="handleEdit(scope.row)">修改</el-button>
              <el-button icon="el-icon-delete" size="small" @click="handelDelete(scope.row)" type="text">删除</el-button>
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
      <div slot="footer">
        <el-button type="primary" size="small" @click="handelClose">确定</el-button>
      </div>
    </el-dialog>
    <soft-version-detail-dialog :soft-id="softId" :is-edit="isEdit" :detail-id="detailId" :soft-version-dialog-visible="softVersionDetailVisible" @close-soft-version-detail-dialog="handleCloseAddVersionDialog"/>
  </div>
</template>

<script>
import {DeleteFile, DeleteSoftVersion, SoftVersionList} from "@/api";
import softVersionDialog from "@/views/Soft/List/softVersionDialog";

export default {
  name: "softVersionList",
  components:{
    'soft-version-detail-dialog':softVersionDialog,
  },
  props: {
    softVersionVisible: {
      type: Boolean,
      default: false
    },
    softId:{
      type: Number,
      default: null
    },
  },
  data(){
    return{
      queryParams:{
        pageNum:1,
        pageSize: 5,
        software:null
      },
      tableData:{},
      loading:true,
      // 批量删除状态
      multiple: true,
      ids:[],
      // 修改状态
      single: true,
      softVersionDetailVisible:false,
      isEdit:false,
      detailId:null,
    }
  },
  watch:{
    softId:function (val){
      if (val){
        this.queryParams.software = val
        this.getList()
      }
    }
  },
  methods:{
    /**获取表格数据**/
    getList(){
      this.loading = true
      SoftVersionList(this.queryParams).then(res=>{
        this.loading = false
        this.tableData = res.data
      })
    },
    /**新增版本**/
    handleAddVersion(){
      this.softVersionDetailVisible = true
    },
    /**关闭详情dialog**/
    handleCloseAddVersionDialog(){
      this.softVersionDetailVisible = false
      this.isEdit = false
      this.detailId = null
      this.getList()
    },
    /**关闭dialog**/
    handelClose(){
      this.tableData = {}
      this.$emit('close-soft-version-dialog')
    },
    /**修改**/
    handleEdit(row){
      const ids = row.id || this.ids[0];
      if (row){
        this.isEdit = true
        this.detailId = ids
      }else {
        this.isEdit = false
      }
      this.softVersionDetailVisible = true
    },
    /**删除**/
    handelDelete(row){
      const ids = row.id || this.ids;
      this.$confirm(`是否确认删除版本编号为'${ids}'的数据项吗？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        if(ids instanceof Array){
          for (var i = 0; i < ids.length; i++) {
            DeleteSoftVersion(ids[i]).then(res => {
              this.$message.success('删除成功')
              this.getList();
            }).catch(err=>{
              this.$message.error(err.data.msg)
              this.getList()
            })
          }
        }else {
          DeleteSoftVersion(ids).then(res => {
            this.$message.success('删除成功')
            this.getList()
          }).catch(err=>{
            this.$message.error(err.data.msg)
            this.getList()
          })
        }
      }).catch(()=>{})
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
    /**表格头背景颜色**/
    rowClass() {
      return 'background:#eef1f6;'
    },
  }
}
</script>

<style scoped>

</style>
