import Register from "./components/Register.vue";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
<<<<<<< HEAD
import Register from "./components/Register.vue";
import Profile from "./components/Profile.vue";
import Wallet from "./components/Wallet.vue";
=======
import Projects from "./components/Projects.vue"
import Create from "./components/Create.vue";
import Project from "./components/Project.vue";
>>>>>>> master

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/register", component: Register },
  { path: "/home", component: Home },
  { path: "/login", component: Login },
<<<<<<< HEAD
  { path: "/profile", component: Profile },
  { path: "/profile/wallet", component: Wallet }
=======
  { path: "/projects", component: Projects },
  { path: "/create", component: Create },
  { path: `/project/:projectName`, component: Project },
>>>>>>> master
];

export default routes;
