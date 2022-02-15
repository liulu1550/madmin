<template>
<div class="app-container">
  <div class="filter-container">
      <el-form ref="filterForm" :model="filterForm" size="mini" label-width="80px">
        <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="filterForm.name" placeholder="请输入分类名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="create_datetime">
            <el-date-picker type="daterange" v-model="filterForm.create_datetime" format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}"
                            :default-time="['00:00:00', '23:59:59']" start-placeholder="开始时间"
                            end-placeholder="结束时间" range-separator="-" clearable></el-date-picker>
          </el-form-item>
        </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch"> 搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetForm"> 重置</el-button>
          </el-col>
        </el-row>
      </el-form>
  </div>
  <div class="btn-container">
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog" plain>新增</el-button>
    <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single" @click="handleEdit" plain>修改</el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple" plain @click="handleDelete">批量删除</el-button>
  </div>
  <div class="category-table-container">
    <el-table
        :data="tableData.results"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        size="small"
        v-loading="loading"
        :header-row-style="rowClass"
        :tree-props="{children: 'sub_cat', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55"
          header-align="center"
          align="center">
      </el-table-column>
      <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="分类名称">
      </el-table-column>
      <el-table-column
          prop="id"
          label="分类编号"
          sortable
          header-align="center"
          align="center">
      </el-table-column>
      <el-table-column
          label="分类级别"
          header-align="center"
          align="center">
        <template slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.category_type===1">一级分类</el-tag>
          <el-tag type="info" size="mini" v-if="scope.row.category_type===2">二级分类</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="create_datetime"
          label="创建时间"
          sortable
          header-align="center"
          align="center">
      </el-table-column>
      <el-table-column
          label="操作"
          header-align="center"
          align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="small" type="text" @click="handleEdit(scope.row)">修改</el-button>
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
  <div class="add-dialog-container">
    <el-dialog v-bind="$attrs" v-on="$listeners" :visible.sync="dialogVisible" :title="addDialogTitle" :close-on-click-modal="false"
               :close-on-press-escape="false"
               width="500px"
               :show-close="false">
      <el-form ref="addForm" :model="addForm" :rules="addRules" size="small" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入分类名称" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="类目级别" prop="category_type">
          <el-select v-model="addForm.category_type" placeholder="请选择类目级别" :style="{width: '100%'}" :disabled="categoryTypeDisable">
            <el-option v-for="(item, index) in category_typeOptions" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级目录" prop="parent_category">
          <el-select v-model="addForm.parent_category" placeholder="请选择父级目录" :disabled="parentCategoryDisable" :style="{width: '100%'}">
            <el-option v-for="(item, index) in parent_categoryOptions" :key="index" :label="item.name"
                       :value="item.id" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import {AddSoftCategory, DeleteImages, DeleteSoftCategory, ListSoftCategory, UpdateSoftCategory} from "@/api";

export default {
  name: "SoftCategory",
  data(){
    return{
      // 表格loading
      loading:true,
      // 表格数据
      tableData:[],
      // 数据请求参数
      queryParams:{
        category_type:1,
        pageNum:1,
        pageSize: 10,
        name: undefined,
      },
      // 批量删除状态
      multiple: true,
      ids:[],
      // 修改状态
      single: true,
      // 过滤项
      filterForm: {
        name: undefined,
        create_datetime: null,
      },
      // dialog标题
      addDialogTitle:'添加分类',
      // dialog显示状态
      dialogVisible:false,
      // 父级分类下拉框状态
      parentCategoryDisable:true,
      // 分类级别状态
      categoryTypeDisable:false,
      // 是否修改数据
      isEdit:false,
      // 新建 更新dialog数据
      addForm: {
        name: undefined,
        category_type: 1,
        parent_category: undefined,
      },
      addRules: {
        name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }],
        category_type: [{
          required: true,
          message: '请选择类目级别',
          trigger: 'change'
        }],
        parent_category: [],
      },
      category_typeOptions: [{
        "label": "一级类目",
        "value": 1
      }, {
        "label": "二级类目",
        "value": 2
      }],
      parent_categoryOptions: [],
    }
  },
  mounted() {
    this.getList()
  },
  watch:{
    /** 监听弹出框分类级别选择 **/
    'addForm.category_type':function (val){
      if (val===2){
        this.parentCategoryDisable = false
        this.getParentCategoryList()
        this.addRules.parent_category=[{
          required: true,
          message: '请选择父级分类',
          trigger: 'change'
        }]
      }else {
        this.parentCategoryDisable = true
        this.addForm.parent_category = undefined
        this.addRules.parent_category = []
      }
    }
  },
  methods:{
    /** 获取表格数据 **/
    getList(){
      this.loading = true
      ListSoftCategory(this.queryParams).then(res=>{
        this.loading = false
        this.tableData = res.data
      })
    },
    /** 获取所有父级分类 **/
    getParentCategoryList(){
      const queryParams = {
        pageNum:'all',
        category_type:1
      }
      ListSoftCategory(queryParams).then(res=>{
        console.log(res)
        this.parent_categoryOptions = res.data
      })
    },
    /**表格头背景颜色**/
    rowClass() {
      return 'background:#eef1f6;'
    },
    /**点击分页数据**/
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    /**修改分页条目数**/
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    /**多选**/
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /**过滤项提交**/
    handleSearch(){
      if (this.filterForm.create_datetime === undefined || this.filterForm.create_datetime === null) {
        this.queryParams['create_datetime_gte'] = ''
        this.queryParams['create_datetime_lte'] = ''
      } else {
        this.queryParams['create_datetime_gte'] = this.filterForm.create_datetime[0]
        this.queryParams['create_datetime_lte'] = this.filterForm.create_datetime[1]
      }
      this.queryParams.name = this.filterForm.name
      this.queryParams.type = this.filterForm.type
      this.queryParams.pageNum = 1
      this.getList()
    },
    /**过滤项重置**/
    resetForm() {
      this.$refs['filterForm'].resetFields()
      this.queryParams['create_datetime_gte'] = ''
      this.queryParams['create_datetime_lte'] = ''
      this.getList()
    },
    /**删除 批量删除**/
    handleDelete(row){
      const ids = row.id || this.ids;
      this.$confirm(`是否确认删除分类编号为'${ids}'的数据项吗？`,"警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        if(ids instanceof Array){
          for (var i = 0; i < ids.length; i++) {
            DeleteSoftCategory(ids[i]).then(res => {
              this.$message.success('删除成功')
              this.getList();
            }).catch(err=>{
              this.$message.error(err.data.msg)
            })
          }
        }else{
          DeleteSoftCategory(ids).then(res=>{
            console.log(res)
            this.$message.success('删除成功')
            this.getList()
          }).catch(err=>{
            this.$message.error(err.data.msg)
          })
        }
      })
    },
    /** 显示修改dialog **/
    handleEdit(row){
      this.dialogVisible = true
      this.resetAddForm()
      this.isEdit = true
      this.addDialogTitle = '修改分类'
      this.addForm['id'] = row.id
      this.addForm.name = row.name
      this.addForm.category_type = row.category_type
      this.addForm.parent_category = row.parent_category
      console.log(row)
      if(row.sub_cat){
        this.categoryTypeDisable = true
      }else {
        this.categoryTypeDisable = false
      }
    },
    /** 显示添加dialog **/
    showAddDialog(){
      this.dialogVisible = true
      this.resetAddForm()
      this.isEdit = false
      this.addDialogTitle = '添加分类'
    },
    /** dialog表单重置 **/
    resetAddForm(){
      this.addForm = {
        name: undefined,
        category_type: 1,
        parent_category: undefined,
      }
    },
    close() {
      this.resetAddForm()
      this.$refs['addForm'].resetFields()
      this.dialogVisible = false
    },
    handelConfirm() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (this.isEdit){
            if(this.addForm.category_type===1){
              this.addForm.parent_category=''
              UpdateSoftCategory(this.addForm).then(res=>{
                this.$message.success('修改分类成功')
              }).then(()=>{
                this.close()
                this.getList()
              })
            }
          }else {
            AddSoftCategory(this.addForm).then(res=>{
              this.$message.success('添加分类成功')
            }).then(()=>{
              this.close()
              this.getList()
            })
          }
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
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
