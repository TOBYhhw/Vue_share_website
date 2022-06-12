import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import VueRouter from 'vue-router';
import router from './router/index';
import store from "./store"


Vue.use(ViewUI);
Vue.use(VueRouter);
// The routing configuration



Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
  router: router
}).$mount('#app')
