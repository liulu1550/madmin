<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" :title="dialogTitle" :visible.sync="visible">
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
        <upload-icon ref="uploadIcon" :limit="1" @upload-image-data-list="uploadIconData" @remove-data-list="removeIconData"/>
      </el-form-item>
      <el-form-item label="缩略图" prop="images">
        <upload-images ref="uploadImages" :limit="3" @upload-image-data-list="uploadImagesData" @remove-data-list="removeImagesData" />
      </el-form-item>
      <el-form-item label="软件简介" prop="remark">
        <el-input v-model="addSoftForm.remark" type="textarea" placeholder="请输入软件简介" :maxlength="128"
                  :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="下载数量" prop="download_num">
        <el-input-number v-model="addSoftForm.download_num" placeholder="下载数量" :step='1'></el-input-number>
      </el-form-item>
      <el-form-item label="评论数量" prop="comment_num">
        <el-input-number v-model="addSoftForm.comment_num" placeholder="评论数量" :step='1'></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import {ListSoftCategory} from "@/api";
import uploadPicture from "@/components/uploadPicture";

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
        download_num: undefined,
        comment_num: undefined,
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
    }
  },
  created() {
    this.getCategoryOptions()
  },
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['addSoftForm'].resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['addSoftForm'].validate(valid => {
        if (valid){
          console.log(this.addSoftForm)
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
