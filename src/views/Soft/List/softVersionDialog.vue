<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :close-on-click-modal="false" :show-close="false" :visible.sync="softVersionDialogVisible" title="版本详情" >
    <el-form ref="addVersionForm" :model="addVersionForm" :rules="addVersionRules" size="small"
             label-width="80px">
      <el-form-item label="版本号" prop="version_num">
        <el-input v-model="addVersionForm.version_num" placeholder="请输入版本号" clearable
                  :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="软件平台" prop="platform">
        <el-select v-model="addVersionForm.platform" placeholder="请选择软件平台" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in platformOptions" :key="index" :label="item.dictLabel"
                     :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平台版本" prop="platform_version">
        <el-select v-model="addVersionForm.platform_version" placeholder="请选择平台版本" clearable
                   :style="{width: '100%'}">
          <el-option v-for="(item, index) in platform_versionOptions" :key="index" :label="item.dictLabel"
                     :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语言" prop="language">
        <el-select v-model="addVersionForm.language" placeholder="请选择语言" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in languageOptions" :key="index" :label="item.dictLabel"
                     :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件" prop="oss_url">
        <upload-file ref="uploadFiles" :width="500" v-if="forceRefresh" @upload-file-data="uploadFileData"/>
      </el-form-item>
      <el-form-item label="是否付费" prop="need_pay">
        <el-radio-group v-model="addVersionForm.need_pay" size="medium">
          <el-radio v-for="(item, index) in need_payOptions" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handelClose" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import uploadFile from "@/components/uploadFile";
import {AddSoftVersion, DetailSoftVersion, GetDictDetailList} from "@/api";

export default {
  name: "softVersionDialog",
  components:{
    'upload-file':uploadFile
  },
  props: {
    softVersionDialogVisible: {
      type: Boolean,
      default: false
    },
    softId:{
      type: Number,
      default: null
    },
    'versionDetailId':{
      type: Number,
      default: null
    }
  },
  watch:{
    softVersionDialogVisible:function(val){
      if(val){
        this.$nextTick(()=>{
          this.forceRefresh = true
        })
      }else {
        this.forceRefresh = false
      }
    },
    softId:function (val){
      console.log(val)
      if(val){
        this.getPlatform()
      }
    },
    versionDetailId:function (val){
      if(val){
        this.detailId = val
        this.getDetailSoftVersion(this.detailId)
      }else {}
    },
    'addVersionForm.platform':function (val){
      if (val===15){
        // windows
        const data = 22
        this.addVersionForm.platform_version=undefined
        this.getPlatformVersion(data)
      }else if (val===16){
        // mac
        const data = 23
        this.addVersionForm.platform_version=undefined
        this.getPlatformVersion(data)
      }
      else if (val===17){
        // linux
        const data = 24
        this.addVersionForm.platform_version=undefined
        this.getPlatformVersion(data)
      }else {
        const data = 24
        this.addVersionForm.platform_version=undefined
        this.getPlatformVersion(data)
      }
    }
  },
  data() {
    return {
      addVersionForm: {
        version_num: undefined,
        platform: undefined,
        platform_version: undefined,
        language: undefined,
        need_pay: 0,
        oss_url:undefined
      },
      addVersionRules: {
        version_num: [{
          required: true,
          message: '请输入版本号',
          trigger: 'blur'
        }],
        platform: [{
          required: true,
          message: '请选择软件平台',
          trigger: 'change'
        }],
        platform_version: [{
          required: true,
          message: '请选择平台版本',
          trigger: 'change'
        }],
        language: [{
          required: true,
          message: '请选择语言',
          trigger: 'change'
        }],
        oss_url: [{
          required: true,
          message: '请上传文件',
          trigger: 'change'
        }],
        need_pay: [],
      },
      platformOptions: [],
      platform_versionOptions: [],
      languageOptions: [],
      need_payOptions: [{
        "label": "否",
        "value": 0
      }, {
        "label": "是",
        "value": 1
      }],
      // 强制刷新上传组件
      forceRefresh: false,
      detailId:null,
    }
  },
  methods: {
    getPlatform(){
      //
      GetDictDetailList({'dict_data':21, 'pageNum':'all'}).then(res=>{
        this.platformOptions = res.data
      })
      GetDictDetailList({'dict_data':20, 'pageNum':'all'}).then(res=>{
        this.languageOptions = res.data
      })
    },
    getPlatformVersion(data){
      GetDictDetailList({'dict_data':data, 'pageNum':'all'}).then(res=>{
        this.platform_versionOptions = res.data
      })
    },
    uploadFileData(data) {
      this.fileData = data
      this.addVersionForm['oss_url'] = this.fileData.id
    },
    /**获取版本详情**/
    getDetailSoftVersion(val){
      DetailSoftVersion(val).then(res=>{
        this.addVersionForm = res.data
      })
    },
    /**关闭dialog**/
    handelClose(){
      this.fileData = {}
      this.detailId = null
      this.forceRefresh = false
      this.$refs.uploadFiles.clearUploadList()
      this.$refs['addVersionForm'].resetFields()
      this.$emit('close-soft-version-detail-dialog')
    },
    handelConfirm() {
      this.$refs['addVersionForm'].validate(valid => {
        if (valid) {
          this.addVersionForm['software'] = this.softId
          AddSoftVersion(this.addVersionForm).then(res=>{
            this.handelClose()
          })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
