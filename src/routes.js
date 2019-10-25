import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Projects from "./components/Projects.vue"

const routes = [
  { path: "/", redirect: '/login' },
  { path: "/register", component: Register },
  { path: "/home", component: Home },
  { path: "/login", component: Login },
  { path: "/projects", component: Projects }
];

export default routes;
