import axios from 'axios'
import {getToken, removeToken, removeUser} from "@/utils/storage";
import store from '@/store'
import router from "@/router";
// 创建axios 赋给变量service
const BASEURL = process.env.VUE_APP_BASE_API
const service = axios.create({
    baseURL: BASEURL,
    timeout: 15000,
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getToken()
    // console.log(token)

    if (token) {
        config.headers.Authorization = 'Bearer '+token
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let data = response.data
    // console.log(data)
    if (response.status === 200) {
        if(data.code ===401) {
            removeToken()
            removeUser()
            return Promise.reject(response);
        }else if(data.code===2000){
            return data
        }else {
            return Promise.reject(response);
        }
    }else {
        return Promise.reject(response);
    }


}, function (error) {
    // 对响应错误做点什么
    // console.log(error)
    return Promise.reject(error);
});


export default service;
