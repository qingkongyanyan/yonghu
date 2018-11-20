// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import "babel-polyfill";
import qs from 'qs'
// import userhttp from '@/util/userHttp' 
import http from '@/util/http' 
// import validation from '@/util/validation' 
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery'
import base from '@/util/base'

Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.use(http)
Vue.use(base)
// Vue.use(userhttp)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// 定义全局 过滤器
// 日期过滤器
Vue.filter('dateFilter',function(value){
	if(!value) return ''
	return new Date(value).toLocaleString().replace(/\//g,'-').match(/\d{4}\-\d{2}\-\d{1,2}/)[0]
})

// 金额输入框只能输入数字校验
Vue.directive("onlyNumber",{
  bind: function(element, binding){
          var el = element.getElementsByTagName("input")[0];
          el.addEventListener("keyup", function(event) {
            var val = event.target.value.toString().split("");
            if ((event.keyCode >= 48 && event.keyCode <= 57)
              || (event.keyCode >= 96 && event.keyCode <= 105)
              || event.keyCode == 8
              || event.keyCode == 16
              || event.keyCode == 17
              || event.keyCode == 18
              || event.altKey
              || event.ctrlKey
              || event.shiftKey) {
            } else {
              val.splice(val.indexOf(event.key), 1);
              event.target.value = val.join("");
            }
          });
        }
})