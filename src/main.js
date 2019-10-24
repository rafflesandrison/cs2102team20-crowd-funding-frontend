import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./routes";
import BootstrapVue from 'bootstrap-vue';

import Vuex from 'vuex';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.config.productionTip = false;

const router = new VueRouter({ routes });

const store = new Vuex.Store({
  state: { count: 0, },
  mutations: { }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
