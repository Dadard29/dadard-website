import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/profile/Profile";
import Catalog from "./components/catalog/Catalog";
import CatalogDetail from "./components/catalog/CatalogDetail";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {path: "/", component: Dashboard},
  {path: "/profile", component: Profile},
  {path: "/catalog", component: Catalog},
  {path: "/catalog/:apiName", component: CatalogDetail}
];

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
