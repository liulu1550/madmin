<template>
  <div class="app-container">
    <div class="btn-container">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd" plain>新增</el-button>
      <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single" @click="handleEdit" plain>修改
      </el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple" plain @click="handleDelete">批量删除
      </el-button>
    </div>
    <div class="table-container">
      <el-table
          :data="tableData.results"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
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
            label="文章编号"
            sortable
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            label="文章名称"
            header-align="center"
            align="center">
          <template slot-scope="scope">
            <div class="line1">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column
            prop="category_name"
            label="文章分类"
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            prop="category_name"
            label="文章标签"
            header-align="center"
            align="center"
            width="200px">
          <template slot-scope="scope">
            <template v-if="scope.row.tags.length > 0">
              <template v-for="(item, index) in scope.row.tags">
                <el-tag style="margin: 0 2px" type="success" size="mini">{{ item.name }}</el-tag>
              </template>
            </template>
            <template v-else>
              <el-tag type="danger" size="mini">暂无标签</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
            label="文章图标"
            header-align="center"
            align="center">
          <template slot-scope="scope">
            <el-image
                style="width: 35px; height: 35px"
                :src="scope.row.icon_url"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
            prop="is_private"
            label="是否加密"
            header-align="center"
            align="center">
          <template slot-scope="scope">
            <div class="line1" v-if="!scope.row.is_private">
              <el-tag size="small">未加密</el-tag>
            </div>
            <div class="line1" v-else>
              <el-tag type="danger" size="small">加密</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="read_num"
            label="阅读数目"
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            prop="comment_num"
            label="评论数目"
            header-align="center"
            align="center">
        </el-table-column>
        <el-table-column
            label="文章状态"
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
            align="center"
            width="120px">
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
    <div class="article-dialog-container">
      <el-dialog v-bind="$attrs" v-on="$listeners" :show-close="false" :close-on-click-modal="false"
                 :visible.sync="dialogVisible" title="Dialog Titile" width="1600px">
        <el-form ref="elForm" :model="formData" :rules="rules" size="small" label-width="80px">
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="文章标题" prop="name">
                <el-input v-model="formData.name" placeholder="请输入文章标题" :maxlength="100" show-word-limit
                          clearable :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="文章分类" prop="category">
                <el-select v-model="formData.category" placeholder="请选择文章分类" :style="{width: '100%'}">
                  <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="开启评论" prop="is_comment">
                <el-select v-model="formData.is_comment" placeholder="请选择开启评论"
                           :style="{width: '100%'}">
                  <el-option v-for="(item, index) in is_commentOptions" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="文章状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择文章状态" :style="{width: '100%'}">
                  <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="文章简介" prop="remark">
                <el-input v-model="formData.remark" type="textarea" placeholder="请输入文章简介" :maxlength="256"
                          show-word-limit :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="文章标签" prop="tags">
                <el-select v-model="formData.tags" multiple default-first-option @change="handleSelectChange($event)" placeholder="请选择文章标签" :style="{width: '100%'}">
                  <el-option v-for="(item, index) in tagsOptions" :key="index" :label="item.name"
                             :value="item.id" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-popover
                  placement="top"
                  width="160"
                  v-model="visible">
                <div style="text-align: right; margin: 0 0 10px 0;width: 100px">
                  <el-input placeholder="请输入内容" size="small"></el-input>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
                </div>
              <el-button icon="el-icon-circle-plus-outline" slot="reference" size="small"></el-button>
              </el-popover>
            </el-col>

            <el-col :span="4">
              <el-form-item label="是否加密" prop="is_private">
                <el-select v-model="formData.is_private" placeholder="请选择是否加密"
                           :style="{width: '100%'}">
                  <el-option v-for="(item, index) in is_privateOptions" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="加密密码" prop="article_password">
                <el-input v-model="formData.article_password" placeholder="请输入加密密码" :maxlength="12"
                          show-word-limit :disabled='true' :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否置顶" prop="is_top">
                <el-select v-model="formData.is_top" placeholder="请选择是否置顶" :style="{width: '100%'}">
                  <el-option v-for="(item, index) in is_topOptions" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>


            <el-col :span="6">
              <el-form-item label="文章图标" prop="icon">
                <upload-icon ref="uploadIcon" v-if="forceRefresh" :limit="1"/>
              </el-form-item>
            </el-col>
          </el-row>
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
import {ListArticle} from "@/api";
import {AddArticleTags, DeleteArticle, ListArticleTags} from "../../../api";
import uploadPicture from "../../../components/uploadPicture";

export default {
  name: "ArticleList",
  components: {
    'upload-icon': uploadPicture,
  },
  data() {
    return {
      visible:false,
      // 表格loading
      loading: true,
      // 表格数据
      tableData: {},
      // 数据请求参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        category: undefined,
        is_top: undefined,
        is_private: undefined,
        is_comment: undefined,
      },
      // 批量删除状态
      multiple: true,
      ids: [],
      // 修改状态
      single: true,
      // 输入新标签
      newTags:{},

      // dialog显示状态
      dialogVisible: false,
      // 强制刷新上传组件
      forceRefresh: false,

      // dialog相关数据
      formData: {
        name: undefined,
        remark: undefined,
        category: undefined,
        is_comment: 1,
        is_private: 0,
        article_password: undefined,
        is_top: 0,
        status: 1,
        tags: undefined,
      },
      rules: {
        name: [{
          required: true,
          message: '请输入文章标题',
          trigger: 'blur'
        }],
        remark: [],
        category: [{
          required: true,
          message: '请选择文章分类',
          trigger: 'change'
        }],
        is_comment: [],
        is_private: [],
        article_password: [],
        is_top: [],
        status: [{
          required: true,
          message: '请选择文章状态',
          trigger: 'change'
        }],
        tags: [],
      },
      categoryOptions: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      is_commentOptions: [{
        "label": "是",
        "value": 1
      }, {
        "label": "否",
        "value": 0
      }],
      is_privateOptions: [{
        "label": "是",
        "value": 1
      }, {
        "label": "否",
        "value": 0
      }],
      is_topOptions: [{
        "label": "是",
        "value": 1
      }, {
        "label": "否",
        "value": 0
      }],
      statusOptions: [{
        "label": "正常",
        "value": 1
      }, {
        "label": "禁用",
        "value": 0
      }],
      tagsOptions: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**获取表格数据**/
    getList() {
      this.loading = true
      ListArticle(this.queryParams).then(res => {
        console.log(res)
        this.loading = false
        this.tableData = res.data
      })
    },
    /**新增操作**/
    handleAdd() {
      ListArticleTags({"pageNum":'all'}).then(res=>{
        this.tagsOptions = res.data
      })
      this.dialogVisible = true
    },
    /**修改操作**/
    handleEdit(row) {
    },
    /**删除操作**/
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(`是否确认删除文章编号为'${ids}'的数据项吗？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (ids instanceof Array) {
          for (var i = 0; i < ids.length; i++) {
            DeleteArticle(ids[i]).then(res => {
              this.$message.success('删除成功')
              this.getList()
            }).catch(err => {
              console.log(err)
              this.$message.error('删除失败！该数据或与其他相关数据绑定')
              this.getList();
            })
          }
        } else {
          DeleteArticle(ids).then(res => {
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


    /**标签选择**/
    handleSelectChange(e){
      // 获取到当前输入的值

      console.log(this.tagsOptions)
    },
    /**dialog关闭**/
    close() {
      this.$refs['elForm'].resetFields()
      this.tagsOptions = []
      this.dialogVisible = false
    },
    /**提交**/
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.close()
      })
    },
  }
}
</script>

<style scoped>

</style>
