import Vue from 'vue'
import fullscreen from 'vue-fullscreen'
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
import HomeConnected from "@/components/home/HomeConnected";
import Geopolitics from "@/components/guis/Geopolitics";
import { GridGlobal } from 'gridjs-vue'

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(fullscreen);
Vue.use(GridGlobal);

const routes = [
  {path: "/", component: HomeConnected},
  {path: "/profile", component: Profile},
  {path: "/catalog", component: Catalog},
  {path: "/catalog/:apiName", component: CatalogDetail},
  {path: "/apis/youtube-download", component: YoutubeDownload},
  {path: "/apis/music-researcher", component: MusicResearcher},
  {path: "/apis/geopolitics", component: Geopolitics},
  {path: "/about", component: About},
  {path: "/pensées", component: Thoughts},
  {path: "/dashboard", component: Dashboard},
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
