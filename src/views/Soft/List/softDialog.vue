<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :close-on-click-modal="false" :show-close="false" :title="dialogTitle" :visible.sync="visible">
    <el-form ref="addSoftForm" :model="addSoftForm" :rules="addSoftRules" size="small" label-width="80px">
      <el-form-item label="软件名称" prop="name">
        <el-input v-model="addSoftForm.name" placeholder="请输入软件名称" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="软件分类" prop="category">
        <el-cascader v-model="addSoftForm.category" :options="categoryOptions" :props="categoryProps"
                     :style="{width: '100%'}" placeholder="请选择软件分类" @change="handleChangeCascader" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="软件状态" prop="status" required>
        <el-switch v-model="addSoftForm.status" active-text="开启" inactive-text="关闭"></el-switch>
      </el-form-item>
      <el-form-item label="软件图标" prop="icon" required>
        <upload-icon ref="uploadIcon" v-if="forceRefresh" :img-list="iconIdList"  :limit="1" @upload-image-data-list="uploadIconData" @remove-data-list="removeIconData"/>
      </el-form-item>
      <el-form-item label="缩略图" prop="images">
        <upload-images ref="uploadImages" v-if="forceRefresh" :img-list="imagesIdList" :limit="3" @upload-image-data-list="uploadImagesData" @remove-data-list="removeImagesData" />
      </el-form-item>
      <el-form-item label="软件简介" prop="remark">
        <el-input v-model="addSoftForm.remark" type="textarea" placeholder="请输入软件简介" :maxlength="128"
                  :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="下载数量" prop="download_num">
        <el-input-number v-model="addSoftForm.download_num" placeholder="下载数量" :step='1' :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="评论数量" prop="comment_num">
        <el-input-number v-model="addSoftForm.comment_num" placeholder="评论数量" :step='1' :min="0"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close('cancel')" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import {ListSoftCategory, UpdateSoft} from "@/api";
import uploadPicture from "@/components/uploadPicture";
import {AddSoft, GetSoftDetail} from "@/api";

export default {
  name: "softDialog",
  components:{
    'upload-icon':uploadPicture,
    'upload-images':uploadPicture,
  },
  props:{
    'visible':{
      type:Boolean,
      default:false
    },
    'dialogTitle':{
      type:String,
      default:''
    },
    'softId':{
      type:Number,
      default:null
    },
    'isEdit':{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      addSoftForm: {
        name: undefined,
        category: null,
        status: true,
        icon:'',
        images:[],
        remark: undefined,
        download_num: 0,
        comment_num: 0,
      },
      addSoftRules: {
        name: [{
          required: true,
          message: '请输入软件名称',
          trigger: 'blur'
        }],
        category: [{
          required: true,
          message: '请至少选择一个软件分类',
          trigger: 'change'
        }],
        icon: [{
          required: true,
          message: '请上传图标',
          trigger: 'change'
        }],
        images: [],
        remark: [],
        download_num: [],
        comment_num: [],
      },
      categoryOptions: [],
      categoryProps: {
        "label": "name",
        "value": "id",
        "children": "sub_cat"
      },
      forceRefresh:false,
      iconIdList:[],
      imagesIdList:[],
    }
  },
  created() {
    this.getCategoryOptions()
  },
  watch:{
    visible:function (val){
      if(val){
        this.$nextTick(()=>{
          this.forceRefresh = true
        })
      }else {
        this.$nextTick(()=>{
          this.forceRefresh = false
        })
      }
    },
    isEdit:function (val){

    },
    softId:function (val){
      if (val){
        this.getSoftDetail()
      }else{

      }
    }

  },
  methods: {
    // 获取软件详情
    getSoftDetail(){
      GetSoftDetail(this.softId).then(res=>{
        this.addSoftForm = res.data
        this.iconIdList.push(res.data.icon)
        for(var i=0;i<res.data.images.length;i++){
          this.imagesIdList.push(res.data.images[i])
        }
      })
    },
    close(data) {
      this.$refs['addSoftForm'].resetFields()
      this.$refs.uploadIcon.clearUploadList()
      this.$refs.uploadImages.clearUploadList()
      this.iconIdList = []
      this.imagesIdList = []
      this.$emit('soft-dialog-close', data)
    },
    handelConfirm() {
      this.$refs['addSoftForm'].validate(valid => {
        if (valid){
          if(!this.isEdit){
            AddSoft(this.addSoftForm).then(res=>{
              this.$message.success('软件添加成功')
            }).then(()=>{
              this.close()
            })
          }else{
            UpdateSoft(this.addSoftForm).then(res=>{
              this.$message.success('软件修改成功')
            }).then(()=>{
              this.close()
            })
          }
        }
      })
    },
    getCategoryOptions() {
      const queryParams = {
        pageNum:'all',
        category_type:1
      }
      ListSoftCategory(queryParams).then(res=>{
        this.categoryOptions = res.data
      })
    },
    handleChangeCascader(val){
      this.addSoftForm.category = val[1]
    },
    uploadIconData(data){
      this.addSoftForm.icon = data.id
    },
    removeIconData(data){
      this.addSoftForm.icon = ''
    },
    uploadImagesData(data){
      this.addSoftForm.images.push(data.id)
    },
    removeImagesData(data){
      for(var i=0; i<this.addSoftForm.images.length;i++){
        if(data.id===this.addSoftForm.images[i]){
          this.addSoftForm.images.splice(i,1)
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
