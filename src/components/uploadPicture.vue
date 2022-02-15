<template>
  <div class="app-container">
    <el-upload
        class="image-upload"
        ref="imgUpload"
        :action="uploadAction"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-change="handleChange"
        :before-upload="handleBeforeUpload"
        accept="image/*"
        :auto-upload="false"
        :data="uploadData"
        :class="{hide:hideUpload}"
        :limit="limit">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {AddImages, DeleteImages, GetImagesList, GetImagesToken, ImagesInfo} from "@/api";

export default {
  name: "uploadPicture",
  props: {
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      // 上传地址
      uploadAction: process.env.VUE_APP_UPLOAD_IMAGES_URL,
      dialogImageUrl: '',
      dialogVisible: false,
      // 上传时的数据
      uploadData: {
        token: '', // 上传token
        key: '',
      },
      imageData:{
        name:'',
        type:'',
        size:'',
        address:'',
        md5:'',
        oss_url:'',
      },
      // 隐藏上传按钮
      hideUpload:false,
    }
  },
  methods: {
    /** 点击文件列表中已上传的文件时的钩子 **/
    handlePictureCardPreview(file) {
    },
    /** 文件列表移除文件时的钩子 **/
    handleRemove(file, fileList) {
      GetImagesList({'key':file.response.key}).then(res=>{
        const imageId = res.data.results[0].id
        DeleteImages(imageId).then(res=>{
        })
      })
      // 显示上传按钮
      this.hideUpload = fileList.length >= this.limit
    },
    /** 文件上传成功时的钩子 **/
    handleSuccess(file, fileList) {
      ImagesInfo(file).then(res=>{
        this.imageData.name = fileList.raw.name
        this.imageData.md5 =res.data.info.md5
        this.imageData.size = res.data.info.fsize
        this.imageData.type = res.data.info.mimeType
        this.imageData.key = file.key
        this.imageData.oss_url = 'https://ossimg.wouldmissyou.com/'+file.key
      }).then(()=>{
        AddImages(this.imageData).then(res=>{

        })
      })
    },
    /** 文件状态改变时的钩子 **/
    handleChange(file, fileList) {
      const typeArr = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg'];
      const isJPG = typeArr.indexOf(file.raw.type) !== -1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      // 隐藏上传按钮
      this.hideUpload = fileList.length >= this.limit
      if (!isJPG) {
        this.$message.error('请选择图片类型的文件!')
      } else if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      } else {
        GetImagesToken().then(res => {
          this.uploadData.token = res.data.token
          this.uploadData.key = file.raw.name + Date.parse(new Date())
        }).then(() => {
          this.$refs.imgUpload.submit()
        })
      }
    },
    /** 文件上传前 **/
    handleBeforeUpload(file) {

    },
    /** 清空上传文件列表 **/
    clearUploadList(){
      this.$refs.imgUpload.clearFiles()
    }
  }
}
</script>

<style scoped lang="scss">
.image-upload /deep/ .el-upload--picture-card{
  height: 80px;
  width: 80px;
  line-height: 90px;
}
.image-upload /deep/ .el-upload-list__item{
  height: 80px;
  width: 80px;
}
</style>
<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>
