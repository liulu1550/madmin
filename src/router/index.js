import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from "@/views/Layout";
import Login from "@/views/Login";
import {getToken} from "@/utils/storage";
import {Message} from "element-ui";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name:'Login',
    component: Login,
    meta:{
      hidden:true,
      title:"登录"
    }
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/',
    meta: {
      title: '控制台',
    },
    children: [
      {
        path: "/",
        name: "Home",
        meta: {
          keepAlive: true,
          name: "控制台",
          icon: 'el-icon-s-grid'
        },
        component: () => import("@/views/Home")
      }
    ]
  },
  {
    path: '/system',
    name: 'Layout',
    component: Layout,
    meta: {
      title: '系统管理',
      icon:'el-icon-s-tools'
    },
    children: [
      {
        path: "/system/dict",
        name: "Dict",
        meta: {
          keepAlive: true,
          name: "字典管理",
          icon: 'el-icon-tickets'
        },
        component: () => import("@/views/system/Dict")
      },
      {
        path: "/system/images",
        name: "Images",
        meta: {
          keepAlive: true,
          name: "图片管理",
          icon: 'el-icon-picture-outline'
        },
        component: () => import("@/views/system/Images")
      },
      {
        path: "/system/files",
        name: "Files",
        meta: {
          keepAlive: true,
          name: "文件管理",
          icon: 'el-icon-folder'
        },
        component: () => import("@/views/system/Files")
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next)=>{
  if (to.path==='/login'){
    next()
  }else {
    if(!getToken()){
      Message.error('对不起，请先登录')
      router.push('/login')
      // next()
    }else {
      next()
    }
  }
})

export default router
