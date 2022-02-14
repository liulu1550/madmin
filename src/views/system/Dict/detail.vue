<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="FilterForm" :model="queryParams" size="mini" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="5">
            <el-form-item label="字典名称" prop="dictType">
              <el-select v-model="queryParams.dictType" placeholder="请选择字典名称" :style="{width: '100%'}">
                <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.dictType"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="字典标签" prop="dictLabel">
              <el-input v-model="queryParams.dictLabel" placeholder="请输入字典标签" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable :style="{width: '100%'}">
                <el-option v-for="dict in statusOptions"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="20px">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"> 搜索</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="0">
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"> 重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="btn-group">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleShowDialog" plain>新增</el-button>
      <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single" @click="handleUpdate" plain>修改
      </el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple" @click="handleDelete" plain>删除
      </el-button>
    </div>
    <div class="table-container">
      <el-table
          :header-row-style="rowClass"
          :data="dataList"
          style="width: 100%"
          size="small"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="55"
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            label="字典编码"
            header-align="center"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="dictLabel"
            header-align="center"
            align="center"
            label="字典标签"
        >
        </el-table-column>
        <el-table-column
            label="字典键值"
            header-align="center"
            prop="dictValue"
            align="center">
        </el-table-column>
        <el-table-column
            label="字典排序"
            header-align="center"
            prop="sort"
            align="center">
        </el-table-column>
        <el-table-column
            label="是否默认"
            header-align="center"
            align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.is_default">
              <el-switch
                  v-model="scope.row.is_default"
                  disabled>
              </el-switch>
            </template>
            <template v-else>
              <el-switch
                  v-model="scope.row.is_default"
                  disabled>
              </el-switch>
            </template>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            header-align="center"
            align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.status==1">正常</template>
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
            <el-button icon="el-icon-edit" size="small" type="text" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button icon="el-icon-delete" size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="add-dialog-container">
      <el-dialog v-bind="$attrs" :visible="showDialog" v-on="$listeners" width="500px" @open="onOpen" @close="onClose" :close-on-click-modal="false" :title="dialogTitle">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="form.dictType" placeholder="请输入字典类型" :disabled='true' clearable
                      :style="{width: '100%'}"></el-input>
          </el-form-item>
          <el-form-item label="数据标签" prop="dictLabel">
            <el-input v-model="form.dictLabel" placeholder="请输入数据标签" :maxlength="64" clearable
                      :style="{width: '100%'}"></el-input>
          </el-form-item>
          <el-form-item label="数据键值" prop="dictValue">
            <el-input v-model="form.dictValue" placeholder="请输入数据键值" :maxlength="64" clearable
                      :style="{width: '100%'}"></el-input>
          </el-form-item>
          <el-form-item label="显示排序" prop="sort">
            <el-input-number v-model="form.sort" placeholder="显示排序" :step='1' step-strictly :max='99' :min="0">
            </el-input-number>
          </el-form-item>
          <el-form-item label="是否默认" prop="is_default" required>
            <el-switch v-model="form.is_default" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status" size="medium">
              <el-radio v-for="(item, index) in dialogStatusOptions" :key="index" :label="item.value"
                        :disabled="item.disabled">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :maxlength="256" show-word-limit
                      :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
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
import {
  AddDictDetailList,
  DelDictDetailList,
  DelDictType,
  DetailDictType,
  GetDictDetailList,
  GetDictType, UpdateDictDetailData,
  UpdateDictDetailList
} from "@/api";

export default {
  name: "DictDetail",
  data() {
    return {
      ids:[],
      single: true,
      multiple: true,
      // 默认字典类型
      defaultDictType: "",
      defaultDictTypeId:'',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 列表数据
      dataList: [],
      tableLoading: true,
      statusOptions: [{
        "label": "正常",
        "value": 1
      }, {
        "label": "停用",
        "value": 0
      }],
      typeOptions: [],
      isEdit:false,
      dialogTitle:'添加字典数据',
      showDialog:false,
      form: {
        dictType: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        sort: 0,
        is_default: false,
        status: 1,
        remark: undefined,
      },
      rules: {
        dictType: [],
        dictLabel: [],
        dictValue: [{
          required: true,
          message: '请输入数据键值',
          trigger: 'blur'
        }],
        sort: [{
          required: true,
          message: '显示排序',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '状态不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: false,
          message: '请输入备注',
          trigger: 'blur'
        }],
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
  created() {
    const dictId = this.$route.params && this.$route.params.dictId;
    this.getDictTypeList()
    this.getType(dictId);
  },

  methods: {
    // 表格头背景颜色
    rowClass() {
      return 'background:#eef1f6;'
    },
    /** 查询字典类型列表 */
    getDictTypeList() {
      GetDictType({pageNum: 'all'}).then(res => {
        this.typeOptions = res.data;
      })
    },
    /** 查询字典类型详细 */
    getType(dictId) {
      DetailDictType(dictId).then(res => {
        this.queryParams.dictType = res.data.dictType;
        this.defaultDictType = res.data.dictType;
        this.defaultDictTypeId = res.data.id
        this.getList();
      })
    },
    /** 查询字典数据列表 */
    getList() {
      this.tableLoading = true;
      GetDictDetailList(this.queryParams).then((response) => {
        this.dataList = response.data.results;
        this.total = response.data.count;
        this.tableLoading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleQuery() {
      let dictId = "";
      this.typeOptions.map((val) => {
        if (val.dictType === this.queryParams.dictType) {
          dictId = val.id;
        }
      });
      this.$route.params.dictId = dictId;
      this.queryParams.pageNum = 1;
      this.getList()
    },
    resetQueryValue() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      }
    },
    resetQuery() {
      this.resetQueryValue()
      this.queryParams.dictType = this.defaultDictType
      this.getList()
    },
    handleUpdate(row) {
      UpdateDictDetailData(row.id||this.ids[0]).then(res=>{
        this.form = res.data
      }).then(()=>{
        this.isEdit = true
        this.dialogTitle = '修改字典类型'
        this.showDialog = true
      })
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(`是否确认删除字典编号为'${ids}'的数据项吗？`,"警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        if(ids instanceof Array){
          for (var i=0;i<ids.length;i++){
            this.tableLoading = true
            DelDictDetailList(ids[i]).then(res=>{
              this.tableLoading = false
              this.$message.success('删除成功')
              this.getList();
            })
          }
        }else {
          this.tableLoading = true
          DelDictDetailList(ids).then(res=>{
            this.tableLoading = false
            this.$message.success('删除成功')
            this.getList()
          })
        }
      })
    },
    handleShowDialog(){
      this.isEdit = false
      this.dialogTitle = '添加字典类型'
      this.form.dictType = this.queryParams.dictType
      this.showDialog = true
    },
    onOpen() {},
    resetAddForm(){
      this.form={
        dictType: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        sort: 0,
        is_default: false,
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
      this.$refs['form'].validate(valid => {
        if (valid){
          const dictId = this.$route.params && this.$route.params.dictId;
          this.form.dict_data = dictId;
          if (this.isEdit){
            UpdateDictDetailList(this.form).then(res=>{
              this.getList()
            }).then(()=>{
              this.close()
            })
          }else {
            AddDictDetailList(this.form).then(res=>{
              this.getList()
            }).then(()=>{
              this.close()
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
  .btn-group {
    width: 100%;
    display: block;
    margin-bottom: 20px;
  }
}
</style>
