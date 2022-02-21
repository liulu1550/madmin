<template>
  <div class="app-container">
    <el-form :model="articleForm" :rules="rules" ref="articleForm" label-width="100px" class="demo-ruleForm"
             size="small">
      <el-row :span="24">
        <el-col :span="12">
          <el-col :span="24">
            <el-form-item label="文章标题" prop="name">
              <el-input v-model="articleForm.name" placeholder="请输入文章标题" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文章简介" prop="remark">
              <el-input type="textarea" :autosize="{minRows: 4, maxRows: 4}" show-word-limit
                        v-model="articleForm.remark" autosize clearable placeholder="请输入文章简介"
                        :maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文章分类" prop="category">
              <el-select v-model="articleForm.category" placeholder="请选择文章分类">
                <el-option
                    v-for="item in categoryOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="文章标签" prop="tags">
              <el-select v-model="articleForm.tags" multiple default-first-option placeholder="请选择文章标签"
                         :style="{width: '100%'}">
                <el-option v-for="(item, index) in tagsOption" :key="index" :label="item.name"
                           :value="item.id" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-popover
                placement="top"
                width="200"
                v-model="addTagsVisible">
              <el-input v-model="newTagsValue" size="small" placeholder="请输入标签名称"></el-input>
              <div style="text-align: right; margin: 10px 0 0 0">
                <el-button size="mini" type="text" @click="handleCloseAddTags">取消</el-button>
                <el-button type="text" size="mini" @click="handleSubmitAddTags">确定</el-button>
              </div>
              <el-button slot="reference" size="small" style="margin-top: 1px;" icon="el-icon-plus"></el-button>
            </el-popover>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文章图标" prop="icon">
              <upload-icon ref="uploadIcon" v-if="forceRefresh" :limit="1" @upload-image-data-list="uploadIconList"
                           @remove-data-list="removeIconList"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="缩略图" prop="images">
              <upload-icon ref="uploadImages" v-if="forceRefresh" :limit="1" @upload-image-data-list="uploadImagesList"
                           @remove-data-list="removeImagesList"/>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文章内容">
            <mavon-editor v-model="articleContent.body" ref="md" @imgAdd="contentImgAdd" @change="contentChange"
                          style="min-height: 600px;max-height: 600px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-col :span="24">
            <el-form-item label="文章状态" prop="status">
              <el-radio-group v-model="articleForm.status" size="small">
                <el-radio v-for="(item, index) in statusOptions" :key="index" :label="item.value"
                          :disabled="item.disabled">{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="加密状态" prop="is_private">
              <el-radio-group v-model="articleForm.is_private" size="small">
                <el-radio v-for="(item, index) in is_privateOptions" :key="index" :label="item.value"
                          :disabled="item.disabled">{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="加密密码" prop="article_password">
              <el-input v-model="articleForm.article_password" placeholder="请输入加密密码" :maxlength="12"
                        :disabled='article_password_disabled' type="password" clearable
                        prefix-icon='el-icon-key'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开启评论" prop="is_comment">
              <el-radio-group v-model="articleForm.is_comment" size="small">
                <el-radio v-for="(item, index) in is_commentOptions" :key="index" :label="item.value"
                          :disabled="item.disabled">{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-group">
      <el-button size="small" @click="handleClosePage">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import {
  AddArticle,
  AddArticleContent,
  AddArticleTags,
  AddImages,
  GetImagesToken,
  ImagesInfo,
  ListArticleCategory,
  ListArticleTags
} from "@/api";
import uploadPicture from "@/components/uploadPicture";
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from "axios";

export default {
  name: "ArticleDetail",
  components: {
    'upload-icon': uploadPicture,
    'upload-image': uploadPicture,
    mavonEditor,
  },
  data() {
    return {
      // 创建新标签的popover
      addTagsVisible: false,
      // 新创建的标签
      newTagsValue: '',
      // 强制刷新
      forceRefresh: false,
      // 文章内容
      articleContent: {
        body:''
      },
      html: '',
      config: {},
      // 文章加密密码状态
      article_password_disabled: true,
      articleForm: {
        name: undefined,
        remark: undefined,
        category: undefined,
        tags: [],
        icon: undefined,
        images: undefined,
        status: 1,
        is_private: 0,
        article_password: '',
        is_comment: 1,
      },
      rules: {
        name: [
          {required: true, message: '请输入文章标题', trigger: 'blur'},
        ],
        remark: [],
        tags: [],
        images: [],
        category: [
          {required: true, message: '请选择文章分类', trigger: 'change'},
        ],
        icon: [
          {required: true, message: '请上传文章图标', trigger: 'blur'},
        ],
        status: [
          {required: true, message: '请选择文章状态', trigger: 'blur'},
        ],
        is_private: [
          {required: true, message: '请选择是否加密', trigger: 'blur'},
        ], is_comment: [
          {required: true, message: '请选择是否开启评论', trigger: 'blur'},
        ],
      },
      categoryOption: [],
      tagsOption: [],
      statusOptions: [
        {'label': '开启', value: 1},
        {'label': '关闭', value: 0},
      ],
      is_privateOptions: [
        {'label': '加密', value: 1},
        {'label': '不加密', value: 0},
      ], is_commentOptions: [
        {'label': '开启', value: 1},
        {'label': '关闭', value: 0},
      ],
    }
  },
  created() {
    console.log(this.$route)
    this.getArticleCategoryList()
    this.getArticleTagsList()
    this.$nextTick(() => {
      this.forceRefresh = true
    })
  },
  watch: {
    'articleForm.is_private': function (val) {
      if (val === 1) {
        this.article_password_disabled = false
      } else {
        this.articleForm.article_password = ''
        this.article_password_disabled = true
      }
    }
  },
  methods: {
    /**获取文章标签**/
    getArticleTagsList() {
      ListArticleTags({"pageNum": 'all'}).then(res => {
        this.tagsOption = res.data
      })
    },
    /**获取文章分类**/
    getArticleCategoryList() {
      ListArticleCategory({"pageNum": 'all', "status": true}).then(res => {
        this.categoryOption = res.data
      })
    },
    /**关闭添加标签**/
    handleCloseAddTags() {
      this.addTagsVisible = false
      this.newTagsValue = ''
    },
    /**提交添加标签**/
    handleSubmitAddTags() {
      AddArticleTags({name: this.newTagsValue}).then(res => {
        this.articleForm.tags.push(res.data.id)
        this.tagsOption.push(res.data)
      }).then(() => {
        this.handleCloseAddTags()
      })
    },
    /**获取上传的图标**/
    uploadIconList(data) {
      this.articleForm.icon = data.id
    },
    /** 移除上传的图标**/
    removeIconList(data) {
      this.articleForm.icon = ''
    },
    /**获取上传的图片**/
    uploadImagesList(data) {
      this.articleForm.images = data.id
    },
    /** 移除上传的图片**/
    removeImagesList(data) {
      this.articleForm.images = ''
    },
    /** 页面数据初始化**/
    initFormData() {
      this.articleForm = {
        name: undefined,
        remark: undefined,
        category: undefined,
        tags: [],
        icon: undefined,
        images: undefined,
        status: 1,
        is_private: 0,
        article_password: '',
        is_comment: 1,
      }
      this.articleContent = {
        body:''
      }
    },
    /** 关闭页面**/
    closePage() {
      this.forceRefresh = false
      this.$refs.uploadIcon.clearUploadList()
      this.$refs.uploadImages.clearUploadList()
      this.$refs.articleForm.resetFields()
      this.initFormData()
    },
    /** 点击取消按钮**/
    handleClosePage(){
      this.$confirm("当前页面未保存,确定要取消吗?", '提示',{
        cancelButtonText:'取消',
        confirmButtonText:'确定',
        type:'warning'
      }).then(()=>{
        this.closePage()
        this.$router.back()
      }).catch(()=>{})
    },

    /**点击确定按钮**/
    handleSubmit(){
      this.$refs.articleForm.validate(valid=>{
        if(valid){
          // 表单校验通过
          // 创建文章内容
          AddArticleContent(this.articleContent).then(res=>{
            this.articleForm['id'] = res.data.id
          }).then(()=>{
            AddArticle(this.articleForm).then(res=>{
              this.$message.success('文章创建成功')
            }).then(()=>{})
            this.closePage()
            this.$router.back()
          })
        }
      })
    },
    /**markdown 操作**/
    contentChange(value, render) {
      // render 为 markdown 解析后的结果[html]
      // 所有操作都会被解析重新渲染

    },
    /**markdown 上传图片**/
    contentImgAdd(pos, $file) {
      // 新建上传表单
      let formData = new FormData()
      // 将文件写入表单
      formData.append('file', $file)
      // 上传请求头
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      // 七牛云返回的结果
      let qiniuRes = {}
      // 图片的信息
      let imageData = {}
      // 获取上传token
      GetImagesToken().then(res => {
        formData.append('token', res.data.token)
        formData.append('key', $file.name + Date.parse(new Date()))
      }).then(() => {
        // axios携带token，key，文件   进行上传
        axios.post('https://up-z2.qiniup.com', formData, config).then(res => {
          qiniuRes = res.data
        }).then(() => {
          // 携带七牛返回的结果向服务器请求图片的信息并保存
          ImagesInfo(qiniuRes).then(res => {
            imageData['name'] = $file.name
            imageData['md5'] = res.data.info.md5
            imageData['size'] = res.data.info.fsize
            imageData['type'] = res.data.info.mimeType
            imageData['key'] = qiniuRes.key
            imageData['oss_url'] = 'https://ossimg.wouldmissyou.com/' + qiniuRes.key
          }).then(() => {
            // 获取到图片信息之后向服务器保存图片
            AddImages(imageData).then(res => {
              // 得到服务器返回的结果，替换到md中
              this.$refs.md.$img2Url(pos, res.data.oss_url)
            })
          })
        })
      })
    },
  }

}
</script>

<style scoped lang="scss">
.btn-group{
  margin-top: 30px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
