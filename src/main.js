import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

Vue.config.productionTip = false;

Vue.use(VueRouter);

new Vue({
  router: "salut",
  render: h => h(App),
}).$mount('#app');
