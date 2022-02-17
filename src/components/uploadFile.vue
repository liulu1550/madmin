<template>
<div class="app-container">
  <div class="upload-btn" v-if="uploadBtnVisible">
    <el-button type="primary" size="mini" icon="el-icon-upload" @click="selectFile">上传文件</el-button>
    <input type="file" ref="file" name='upFile' id="upFile" hidden @change='changeFile($event)'>
  </div>
  <div class="upload-file-name" v-if="file" :style="{'width':width+'px'}" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
    <div class="file-container">
      <div class="file-name">
        <i class="el-icon-document"></i>
        <div class="line1" v-if="file">{{ file.name }}</div>
      </div>
      <div class="close-icon" v-if="deleteIcon">
          <el-button type="text" @click="handleDelete"><i class="el-icon-delete" style="color:#F56C6C"></i></el-button>
      </div>
      <div class="close-icon" v-if="checkIcon">
        <el-button type="text"><i class="el-icon-circle-check" v-if="uploadComplete" style="color:#67C23A"></i></el-button>
      </div>
    </div>
    <div class="file-progress">
      <el-progress  :stroke-width="2" :percentage="filePercent"></el-progress>
    </div>
  </div>

</div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import {FileToken} from "@/api";
import {AddFile, DeleteFile, FileInfo} from "../api";
export default {
  name: "uploadFile",
  props:{
    width:{
      type:Number,
      default:200
    },
  },
  data(){
    return{
      // 上传文件按钮状态
      uploadBtnVisible:true,
      // 当前选择的文件
      file:null,
      // 上传的额外参数
      uploadData:{
        token:''
      },
      // 文件数据
      fileData:{},
      // 进度条
      filePercent:0,
      // 上传是否完成
      uploadComplete:false,
      // 上传成功图标
      checkIcon:true,
      // 删除图标
      deleteIcon:false,
      // 上传文件的ID
      fileId:undefined,
      // 服务器保存成功的文件
      fileInfo:{},
    }
  },
  methods:{
    /** 隐藏远程input，点击elementuiBtn时通过refs触发 **/
    selectFile(){
      this.$refs.file.click()
    },
    /** 移除已上传的文件 **/
    handleDelete(){
      this.$confirm('该文件已上传成功，确定要删除吗？', '提示', {
        cancelButtonText:'取消',
        confirmButtonText:'确定',
        type:'warning'
      }).then(()=>{
        DeleteFile(this.fileId).then(res=>{
          this.uploadBtnVisible = true
          this.clearUploadList()
          this.$emit('upload-file-data', {})
        }).catch(err=>{
          this.$message.error('删除失败')
        })
      })
    },
    /** 选择文件并获取上传token **/
    changeFile(e){
      this.uploadBtnVisible = false
      this.file = e.target.files[0];
      // console.log(this.file)
      FileToken().then(res=>{
       this.uploadData.token = res.data.token
      }).then(()=>{
        this.chunkedUpload()
      })
    },
    /** 上传 **/
    chunkedUpload(){
      let _this = this
      let token = _this.uploadData.token
      var config = {
        useCdnDomain: true
      }
      var putExtra = {
        fname: "",
        params: {},
        mimeType: null
      }
      var observable = qiniu.upload(_this.file, new Date().toLocaleDateString(`cn`,{hour12:false})+'/'+_this.file.name, token, putExtra, config);
      var observer = {
        next(res){
          _this.filePercent = parseInt(res.total.percent)
        },
        error(err){
          console.log(err)
        },
        complete(res){
          _this.uploadComplete = true
          _this.postFileInfo(res)
        }
      }
      var subscription = observable.subscribe(observer);
    },
    /** 获取文件信息并保存到服务器 **/
    postFileInfo(data){
      FileInfo(data).then(res=>{
        this.fileData.name = this.file.name
        this.fileData.md5 =res.data.info.md5
        this.fileData.size = res.data.info.fsize
        this.fileData.type = res.data.info.mimeType
        this.fileData.key = data.key
        this.fileData.oss_url = 'https://ossfile.wouldmissyou.com/'+data.key
      }).then(()=>{
        AddFile(this.fileData).then(res=>{
          this.fileId = res.data.id
          this.fileInfo = res.data
          this.$emit('upload-file-data', res.data)
        })
      })
    },
    /** 鼠标移至文件处 **/
    mouseEnter(){
      if(this.uploadComplete){
        this.checkIcon = false
        this.deleteIcon = true
      }
    },
    /** 鼠标离开文件处 **/
    mouseLeave(){
      this.checkIcon = true
      this.deleteIcon = false
    },
    /** 上传数据初始化 **/
    clearUploadList(){
      this.file = null
      this.checkIcon = true
      this.deleteIcon = false
      this.uploadComplete = false
      this.filePercent = 0
      this.fileData = {}
      this.uploadData = {
        token:'',
      }
      this.fileInfo = {}
    }
  }
}
</script>

<style scoped lang="scss">
.upload-file-name{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.file-container{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #303133;
  font-size: 12px;
  width: 100%;
  .file-name{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 80%;
    i{
      flex-shrink: 0;
    }
    .line1{
      margin-left: 6px;
      line-height: 20px;
    }
  }
  .close-icon{
    color: #67C23A;
  }

}
.file-progress{
width: 100%;
}
.upload-file-name /deep/ .el-button{
  padding: 0;
}
</style>
