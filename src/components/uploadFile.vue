<template>
<div class="app-container">
  <div class="upload-btn" v-if="uploadBtnVisible">
    <el-button type="primary" size="mini" icon="el-icon-upload" @click="selectFile">上传文件</el-button>
    <input type="file" ref="file" name='upFile' id="upFile" hidden @change='changeFile($event)'>
  </div>
  <div class="upload-file-name" v-if="file" :style="{'width':width+'px'}">
    <div class="file-container">
      <div class="file-name">
        <i class="el-icon-document"></i>
        <div class="line1" v-if="file">{{ file.name }}</div>
      </div>
      <el-popconfirm
          title="这是一段内容确定删除吗？"
          confirm-button-text='确定'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          @confirm="handleDelete"
      >
        <el-button type="text" slot="reference" icon="el-icon-delete"></el-button>
      </el-popconfirm>
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
export default {
  name: "uploadFile",
  props:{
    width:{
      type:Number,
      default:200
    }
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
      // 进度条
      filePercent:0,
      // 上传是否完成
      uploadComplete:false
    }
  },
  methods:{
    /** 隐藏远程input，点击elementuiBtn时通过refs触发 **/
    selectFile(){
      this.$refs.file.click()
    },
    /** 移除已上传的文件 **/
    handleDelete(){
      this.uploadBtnVisible = true
      this.clearUploadList()
    },
    /** 选择文件并获取上传token **/
    changeFile(e){
      this.uploadBtnVisible = false
      this.file = e.target.files[0];
      console.log(this.file)
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
      var observable = qiniu.upload(_this.file, '123/'+_this.file.name, token, putExtra, config);
      var observer = {
        next(res){
          _this.filePercent = parseInt(res.total.percent)
          if(_this.filePercent==100){
            console.log("success")
            _this.uploadComplete = true
          }
        },
        error(err){
          console.log(err)
        },
        complete(res){

        }
      }
      var subscription = observable.subscribe(observer);
    },
    clearUploadList(){
      this.file = null
      this.uploadData = {
        token:'',
      }
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
</style>
