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
  </div>
</template>

<script>
import {AddArticle, ListArticle, ListArticleCategory} from "@/api";
import {AddArticleTags, DeleteArticle, ListArticleTags} from "../../../api";
export default {
  name: "ArticleList",
  data() {
    return {
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
        this.loading = false
        this.tableData = res.data
      })
    },
    /**新增操作**/
    handleAdd() {
      this.$router.push({name:"ArticleDetail"})
    },
    /**修改操作**/
    handleEdit(row) {
      this.$router.push({name:"ArticleDetail", query:{id:row.id}})
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
  }
}
</script>

<style scoped>

</style>
