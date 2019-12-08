import Register from "./components/Register.vue";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Wallet from "./components/Wallet.vue";
import Projects from "./components/Projects.vue";
import Create from "./components/Create.vue";
import Project from "./components/Project.vue";
import Profile from "./components/Profile.vue";
import EditProject from "./components/EditProject.vue";
import Users from "./components/Users.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/register", component: Register },
  { path: "/home", component: Home },
  { path: "/login", component: Login },
  { path: "/profile/wallet", component: Wallet },
  { path: "/projects", component: Projects },
  { path: "/create", component: Create },
  { path: "/project/:projectName", component: Project },
  { path: `/profile/:email`, component: Profile },
  { path: `/editProject/:projectName`, component: EditProject },
  { path: `/users`, component: Users },
];

export default routes;
