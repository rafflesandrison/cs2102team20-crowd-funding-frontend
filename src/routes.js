import Register from "./components/Register.vue";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Projects from "./components/Projects.vue"
import Create from "./components/Create.vue";

const routes = [
  { path: "/", redirect: '/login' },
  { path: "/register", component: Register },
  { path: "/home", component: Home },
  { path: "/login", component: Login },
  { path: "/projects", component: Projects },
  { path: "/create", component: Create }
];

export default routes;
