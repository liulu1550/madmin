<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="elForm" :model="dictParams" :rules="rules" size="mini" label-width="70px">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-form-item label="字典名称" prop="search">
              <el-input v-model="dictParams.search" placeholder="请输入字典名称" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="字典类型" prop="dictType">
              <el-input v-model="dictParams.dictType" placeholder="请输入字典类型" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="字典状态" prop="status">
              <el-select v-model="dictParams.status" placeholder="请选择字典状态" clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label"
                           :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="创建时间" prop="create_datetime">
              <el-date-picker type="daterange" v-model="dictParams.create_datetime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                              :style="{width: '100%'}" start-placeholder="开始日期" end-placeholder="结束日期"
                              range-separator="-" clearable></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search"> 搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetForm"> 重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="btn-group">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="handelAdd" plain>新增</el-button>
      <el-button type="success" size="mini" icon="el-icon-edit" :disabled="editBtnDisable" @click="editRow" plain>修改</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="delBtnDisable" @click="handleDelete" plain>删除</el-button>
    </div>
    <div class="table-container">
      <el-table
          :data="tableData.results"
          :header-row-style="rowClass"
          style="width: 100%"
          size="small"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55"
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            label="字典编号"
            header-align="center"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="dictName"
            header-align="center"
            align="center"
            label="字典名称"
            width="180">
        </el-table-column>
        <el-table-column
            label="字典类型"
            header-align="center"
            align="center">
          <template slot-scope="scope">
            <router-link :to="'/system/dict/detail/'+scope.row.id" class="table_link">{{ scope.row.dictType }}</router-link>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            header-align="center"
            align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.status===1">正常</template>
            <template v-else>停用</template>
          </template>
        </el-table-column>
        <el-table-column
            prop="remark"
            label="备注"
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
            <el-button icon="el-icon-edit" size="small" @click="editRow(scope.row)" type="text">修改</el-button>
            <el-button icon="el-icon-delete" size="small" @click="handleDelete(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
            background
            layout="sizes,total,prev, pager, next"
            :current-page="dictParams.pageNum"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-sizes="[10, 20, 30, 40]"
            :total="tableData.count">
        </el-pagination>
      </div>
    </div>
    <div class="add-dialog-container">
      <el-dialog v-bind="$attrs" v-on="$listeners" :visible="showDialog" @open="onOpen" width="500px" @close="onClose" :close-on-click-modal="false" :title="dialogTitle">
        <el-row :gutter="15">
          <el-form ref="AddForm" :model="addFormData" :rules="dialogRules" size="small" label-width="80px">
            <el-col :span="23">
              <el-form-item label="字典名称" prop="dictName">
                <el-input v-model="addFormData.dictName" placeholder="请输入字典名称" :maxlength="64" show-word-limit
                          clearable :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="字典类型" prop="dictType">
                <el-input v-model="addFormData.dictType" placeholder="请输入字典类型" :maxlength="64" show-word-limit
                          clearable :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="字典状态" prop="status">
                <el-radio-group v-model="addFormData.status" size="medium">
                  <el-radio v-for="(item, index) in dialogStatusOptions" :key="index" :label="item.value"
                            :disabled="item.disabled">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="addFormData.remark" type="textarea" placeholder="请输入备注" :maxlength="256"
                          show-word-limit :autosize="{minRows: 3, maxRows: 3}" :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer">
          <el-button @click="close" size="small">取消</el-button>
          <el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import {AddDictType, DelDictType, DetailDictType, EditDictType, GetDictType} from "@/api";

export default {
  name: "Dict",
  data() {
    return {
      // 选中数组
      ids: [],
      tableData: {},
      tableLoading: true,
      dictParams: {
        pageNum: 1,
        pageSize: 10,
        search: undefined,
        dictType: undefined,
        status: undefined,
        create_datetime: null,
      },
      rules: {
        search: [],
        dictType: [],
        status: [],
        create_datetime: [],
      },
      statusOptions: [{
        "label": "正常",
        "value": 1
      }, {
        "label": "停用",
        "value": 0
      }],
      editBtnDisable:true,
      delBtnDisable:true,
      showDialog:false,
      dialogTitle:'添加字典类型',
      isEdit:false,
      addFormData: {
        dictName: undefined,
        dictType: undefined,
        status: 1,
        remark: undefined,
      },
      dialogRules: {
        dictName: [{
          required: true,
          message: '请输入字典名称',
          trigger: 'blur'
        }],
        dictType: [{
          required: true,
          message: '请输入字典类型',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '字典状态不能为空',
          trigger: 'change'
        }],
        remark: [],
      },
      dialogStatusOptions: [{
        "label": "正常",
        "value": 1
      }, {
        "label": "停用",
        "value": 0
      }],
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      GetDictType(this.dictParams).then(res => {
        this.tableLoading = false
        this.tableData = res.data
      }).catch(err => {
        this.tableLoading = false
      })
    },
    // 表格多选
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.editBtnDisable = selection.length !==1
      this.delBtnDisable = !selection.length
    },
    // 点击分类按钮
    handleCurrentChange(val) {
      this.dictParams.pageNum = val
      this.getTableData()
    },
    // 更改显示数量
    handleSizeChange(val) {
      this.dictParams.pageSize = val
      this.getTableData()
    },
    // 搜索
    search() {
      if (this.dictParams.create_datetime === undefined || this.dictParams.create_datetime === null) {
        this.dictParams['create_datetime_gte'] = ''
        this.dictParams['create_datetime_lte'] = ''
      } else {
        this.dictParams['create_datetime_gte'] = this.dictParams.create_datetime[0]
        this.dictParams['create_datetime_lte'] = this.dictParams.create_datetime[1]
      }
      this.dictParams.pageNum = 1
      this.getTableData()
    },
    // 重置搜索
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    rowClass(){
      return 'background:#eef1f6;'
    },
    handleDelete(row){
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除字典编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=> {
        if(ids instanceof Array){
          for (var i=0;i<ids.length;i++){
            this.tableLoading = true
            DelDictType(ids[i]).then(res=>{
              this.tableLoading = false
              this.$message.success('删除成功')
              this.getTableData();
            })
          }
        }else {
          this.tableLoading = true
          DelDictType(ids).then(res=>{
            this.tableLoading = false
            this.$message.success('删除成功')
            this.getTableData();
          })
        }
      }).catch(()=>{
      });
    },

    editRow(row){
      DetailDictType(row.id||this.ids[0]).then(res=>{
        this.addFormData = res.data
      }).then(()=>{
        this.dialogTitle = '修改字典类型'
        this.isEdit = true
        this.showDialog = true
      })
    },

    handelAdd(){
      this.isEdit = false
      this.dialogTitle = '添加字典类型'
      this.showDialog = true
    },

    onOpen() {},
    resetAddForm(){
      this.addFormData = {
        dictName: undefined,
        dictType: undefined,
        status: 1,
        remark: undefined,
      }
    },
    onClose() {
      this.resetAddForm()
    },
    close() {
      this.showDialog = false
    },
    handelConfirm() {
      this.$refs['AddForm'].validate(valid => {
        if (valid) {
          if(this.isEdit){
            EditDictType(this.addFormData).then(res=>{
              this.close()
              this.$message.success('修改成功')
            }).then(()=>{
              this.getTableData()
            })
          }else {
            AddDictType(this.addFormData).then(res=>{
              this.close()
              this.$message.success('添加成功')
            }).then(()=>{
              this.getTableData()
            })
          }
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.app-container {
  .table_link {
    color: #409EFF;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .btn-group{
    margin-bottom: 20px;
  }
}

</style>
