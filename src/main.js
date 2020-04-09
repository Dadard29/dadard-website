import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/profile/Profile";
import Catalog from "./components/catalog/Catalog";
import CatalogDetail from "./components/catalog/CatalogDetail";
import NotFound from "@/components/NotFound";
import YoutubeDownload from "@/components/guis/YoutubeDownload";
import About from "@/components/About";
import MusicResearcher from "@/components/guis/MusicResearcher";
import Thoughts from "@/components/guis/Thoughts";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {path: "/", component: Dashboard},
  {path: "/profile", component: Profile},
  {path: "/catalog", component: Catalog},
  {path: "/catalog/:apiName", component: CatalogDetail},
  {path: "/apis/youtube-download", component: YoutubeDownload},
  {path: "/apis/music-researcher", component: MusicResearcher},
  {path: "/about", component: About},
  {path: "/pensées", component: Thoughts},
  {path: "/404", component: NotFound},
  {path: "*", redirect: "/404"}
];

const router = new VueRouter({
  mode: "history",
  routes: routes
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
