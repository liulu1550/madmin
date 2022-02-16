import service from "@/api/request";
// 登录
export function Login(data) {
    return service.request({
        method:'post',
        url:'/login/',
        data:data
    })
}

// 登陆后获取管理员用户信息
export function AdminProfile(data) {
    return service.request({
        method:'get',
        url:'/user/admin/profile/xxxx/',
    })
}


// 获取字典列表
export function GetDictType(params) {
    return service.request({
        method:'get',
        url:'/dict/type/',
        params:params

    })
}
// 删除字典
export function DelDictType(dictId) {
    return service.request({
        method:'delete',
        url:`/dict/type/${dictId}/`,
    })
}
// 新增字典
export function AddDictType(data) {
    return service.request({
        method:'post',
        url:`/dict/type/`,
        data
    })
}
// 更新字典
export function EditDictType(data) {
    return service.request({
        method:'put',
        url:`/dict/type/${data.id}/`,
        data
    })
}
// 字典详情
export function DetailDictType(id) {
    return service.request({
        method:'get',
        url:`/dict/type/${id}/`,
    })
}

// 获取字典详情列表
export function GetDictDetailList(params){
    return service.request({
        method:'get',
        url:`/dict/data/`,
        params
    })
}
// 删除字典数据
export function DelDictDetailList(dictId){
    return service.request({
        method:'delete',
        url:`/dict/data/${dictId}/`,
    })
}
// 添加字典数据

export function AddDictDetailList(data){
    return service.request({
        method:'post',
        url:`/dict/data/`,
        data
    })
}
// 修改字典数据
export function UpdateDictDetailList(data){
    return service.request({
        method:'put',
        url:`/dict/data/${data.id}/`,
        data
    })
}
// 获取字典数据
export function UpdateDictDetailData(dictId){
    return service.request({
        method:'get',
        url:`/dict/data/${dictId}/`,
    })
}
// 获取图片上传token
export function GetImagesToken(){
    return service.request({
        method:'get',
        url:`/img/token/`,
    })
}
// 图片上传成功后的返回值返回给服务器
export function ImagesInfo(data){
    return service.request({
        method:'post',
        url:`/img/info/`,
        data
    })
}
// 获取图片列表
export function GetImagesList(params){
    return service.request({
        method:'get',
        url:`/images/`,
        params
    })
}
// 新增图片
export function AddImages(data){
    return service.request({
        method:'post',
        url:`/images/`,
        data
    })
}
// 删除图片
export function DeleteImages(imageId){
    return service.request({
        method:'delete',
        url:`/images/${imageId}`,
    })
}
// 图片详情
export function DetailImages(imageId){
    return service.request({
        method:'get',
        url:`/images/${imageId}`,
    })
}


// 软件分类列表
export function ListSoftCategory(params){
    return service.request({
        method:'get',
        url:`/soft/category`,
        params
    })
}
// 删除软件分类
export function DeleteSoftCategory(cId){
    return service.request({
        method:'delete',
        url:`/soft/category/${cId}/`,
    })
}
// 新增软件分类
export function AddSoftCategory(data){
    return service.request({
        method:'post',
        url:`/soft/category/`,
        data
    })
}
// 修改软件分类
export function UpdateSoftCategory(data){
    return service.request({
        method:'put',
        url:`/soft/category/${data.id}/`,
        data
    })
}

// 文件列表
export function ListFiles(params){
    return service.request({
        method:'get',
        url:`/files/`,
        params
    })
}
// 获取文件上传token
export function FileToken(params){
    return service.request({
        method:'get',
        url:`/file/token/`,
        params
    })
}

// 文件上传成功后的返回值返回给服务器
export function FileInfo(data){
    return service.request({
        method:'post',
        url:`/file/info/`,
        data
    })
}

// 新增文件
export function AddFile(data){
    return service.request({
        method:'post',
        url:`/files/`,
        data
    })
}

// 删除文件
export function DeleteFile(fileId){
    return service.request({
        method:'delete',
        url:`/files/${fileId}/`,
    })
}

// 下载文件
export function DownloadFile(data){
    return service.request({
        method:'post',
        url:`/file/download/`,
        data
    })
}