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
