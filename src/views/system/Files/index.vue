<template>
  <div class="app-container">
    <div class="btn-container">
      <el-button type="primary" size="mini" icon="el-icon-upload" plain @click="showUploadDialog">上传文件</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple" plain @click="handleDelete">批量删除
      </el-button>
    </div>
    <div class="file-table-container">
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
              label="文件编号"
              header-align="center"
              align="center"
          >
          </el-table-column>
          <el-table-column
              header-align="center"
              align="center"
              label="文件名称"
              width="150">
            <template slot-scope="scope">
              <div class="text line1">{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="type"
              label="文件类型"
              header-align="center"
              align="center">
          </el-table-column>
          <el-table-column
              prop="size"
              label="文件大小"
              header-align="center"
              align="center">
          </el-table-column>
          <el-table-column
              label="文件KEY"
              header-align="center"
              align="center">
            <template slot-scope="scope">
              <div class="text line1">{{ scope.row.key }}</div>
            </template>
          </el-table-column>
          <el-table-column
              label="OSS地址"
              header-align="center"
              align="center"
              width="150px">
            <template slot-scope="scope">
              <div class="text line1">{{ scope.row.oss_url }}</div>
            </template>
          </el-table-column>
          <el-table-column
              label="MD5"
              header-align="center"
              align="center"
              width="150px">
            <template slot-scope="scope">
              <div class="text line1">{{ scope.row.md5 }}</div>
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
              <el-button icon="el-icon-download" size="small" type="text" @click="download(scope.row)">下载</el-button>
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
    <div class="upload-dialog-container">
      <el-dialog
          title="上传文件"
          :visible.sync="uploadVisible"
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false">
        <div class="upload-picture-container">
          <upload-file ref="uploadFiles" :width="300" v-if="forceRefresh" />
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button type="primary" size="mini" @click="closeUploadDialog">确 定</el-button>
  </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {ListFiles} from "@/api";
import uploadFile from "@/components/uploadFile";

export default {
  name: "Files",
  components:{
    'upload-file':uploadFile
  },
  data() {
    return {
      // 表格数据
      tableData: {},
      // 表格加载状态
      loading: true,
      ids: '',
      // 批量删除状态
      multiple: true,
      // 请求参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        type: undefined
      },
      // 上传dialog显示状态
      uploadVisible:false,
      // 强制刷新上传组件
      forceRefresh:false,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**获取文件列表**/
    getList() {
      this.loading = true
      ListFiles(this.queryParams).then(res => {
        this.loading = false
        this.tableData = res.data
      })
    },
    /**表格头背景颜色**/
    rowClass() {
      return 'background:#eef1f6;'
    },
    /**多选**/
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length > 0;
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
    /**点击下载按钮**/
    download(row) {
    },
    /**点击删除按钮**/
    handleDelete(row) {
    },

    /**点击上传按钮**/
    showUploadDialog() {
      this.$nextTick(()=>{
        this.forceRefresh = true
        this.uploadVisible = true
      })
      console.log(new Date().getMonth())
    },
    /**关闭上传dialog之前**/
    closeUploadDialog(){
      this.uploadVisible = false
      this.forceRefresh = false
      this.$refs.uploadFiles.clearUploadList()
      this.getList()
    },
  }
}
</script>

<style scoped>

</style>
