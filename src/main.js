// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from "vue-infinite-scroll"
import { currency } from "./util/currency"
import Vuex from "Vuex"

Vue.config.productionTip = false;
Vue.filter("currency", currency)
Vue.prototype.axios = axios;
Vue.use(infiniteScroll);
Vue.use(Vuex);
Vue.use(VueLazyLoad, {
  loading: "/static/loading-svg/loading-bubbles.svg",
  preLoad: 1.3,
  attempt: 3,
  // error:"/static/loading-svg/loading-balls.svg",

})
const store = new Vuex.Store({
  state: {
    nickName: "",
    cartCount: 0
  },
  mutations: {
    updateUserTnfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount;

    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
