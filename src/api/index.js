import service from "@/api/request";
export function Login(data) {
    return service.request({
        method:'post',
        url:'/login/',
        data:data
    })
}
