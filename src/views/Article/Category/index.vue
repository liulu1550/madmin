<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="filterForm" :rules="filterRules" size="mini" label-width="80px">
        <el-row :gutter="15">
          <el-col :span="5">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="filterForm.name" placeholder="请输入分类名称" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="分类状态" prop="status">
              <el-select v-model="filterForm.status" placeholder="请选择分类状态" clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label"
                           :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
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
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd" plain>新增</el-button>
      <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single" @click="handleEdit" plain>修改
      </el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple" plain @click="handleDelete">批量删除
      </el-button>
    </div>
    <div class="category-table-container">
      <el-table
          :data="tableData.results"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          size="small"
          v-loading="loading"
          :header-row-style="rowClass"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55"
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            label="分类编号"
            sortable
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            prop="name"
            label="分类名称"
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            prop="article_num"
            label="文章总数"
            sortable
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            label="分类状态"
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
    <div class="category-dialog-container">
      <el-dialog v-bind="$attrs" v-on="$listeners" :title="categoryDialogTitle" :visible.sync="categoryDialogVisible"
                 :close-on-click-modal="false"
                 width="500px"
                 :close-on-press-escape="false" :show-close="false">
        <el-form ref="categoryForm" :model="categoryForm" :rules="categoryRules" size="small" label-width="80px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="categoryForm.name" placeholder="请输入分类名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
          <el-form-item label="分类状态" prop="status" required>
            <el-switch v-model="categoryForm.status"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleClose" size="small">取消</el-button>
          <el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import {
  AddArticleCategory,
  DeleteArticleCategory,
  DeleteSoft,
  DetailArticleCategory,
  ListArticleCategory,
  UpdateArticleCategory
} from "@/api";

export default {
  name: "ArticleCategoryList",
  data() {
    return {
// 表格loading
      loading: true,
      // 表格数据
      tableData: [],
      // 数据请求参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined
      },
      // 批量删除状态
      multiple: true,
      ids: [],
      // 修改状态
      single: true,
      // dialog名称
      categoryDialogTitle: '添加分类',
      // dialog状态
      categoryDialogVisible: false,
      // dialog数据
      categoryForm: {
        name: undefined,
        status: true,
      },
      categoryRules: {
        name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }],
      },
      // 是否修改数据
      isEdit:false,
      filterForm: {
        name: undefined,
        status: "",
        create_datetime: null,
      },
      filterRules: {
        name: [],
        status: [],
        create_datetime: [],
      },
      statusOptions: [{
        "label": "正常",
        "value": true
      }, {
        "label": "禁用",
        "value": false
      }],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**获取表格数据**/
    getList() {
      this.loading = true
      ListArticleCategory(this.queryParams).then(res => {
        this.loading = false
        this.tableData = res.data
      })
    },
    /**显示添加修改dialog**/
    handleAdd(row) {
      this.categoryDialogVisible = true
    },
    handleClose() {
      this.categoryForm = {
        name: undefined,
        status: true,
      }
      this.isEdit = false
      this.$refs.categoryForm.resetFields()
      this.categoryDialogVisible = false
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
    /**修改**/
    handleEdit(row) {
      const ids = row.id || this.ids[0];
      this.categoryDialogTitle = '修改分类'
      this.isEdit = true
      DetailArticleCategory(ids).then(res=>{
        this.categoryForm = res.data
      }).then(()=>{
        this.categoryDialogVisible = true
      })
    },
    /**删除 批量删除**/
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(`是否确认删除分类编号为'${ids}'的数据项吗？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (ids instanceof Array) {
          for (var i = 0; i < ids.length; i++) {
            DeleteArticleCategory(ids[i]).then(res => {
              this.$message.success('删除成功')
              this.getList()
            }).catch(err => {
              console.log(err)
              this.$message.error('删除失败！该数据或与其他相关数据绑定')
              this.getList();
            })
          }
        } else {
          DeleteArticleCategory(ids).then(res => {
            this.$message.success('删除成功')
            this.getList()
          }).catch(err => {
            console.log(err)
            this.$message.error('删除失败！该数据或与其他相关数据绑定')
            this.getList();
          })
        }
      }).catch(() => {
      })
    },
    // 提交
    handelConfirm() {
      this.$refs['categoryForm'].validate(valid => {
        if (valid) {
          if(this.isEdit){
            UpdateArticleCategory(this.categoryForm).then(res=>{
              this.$message.success('修改分类成功')
              this.getList()
            }).then(()=>{
              this.handleClose()
            })
          }else {
            AddArticleCategory(this.categoryForm).then(res=>{
              this.$message.success('添加分类成功')
              this.getList()
            }).then(()=>{
              this.handleClose()
            })
          }

        }
      })
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
      this.queryParams.status = this.filterForm.status
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
  }
}
</script>

<style scoped>

</style>
