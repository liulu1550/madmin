import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
Vue.use(Vuex)


export default new Vuex.Store({
  state:{
    layoutConfig:{
      navIsCollapse:false
    }
  },
  modules:{
    app,
  }
})
