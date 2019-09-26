import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

const routes = [
  { path: "/", redirect: '/login' },
  { path: "/register", component: Register },
  { path: "/home", component: Home },
  { path: "/login", component: Login }
];

export default routes;
