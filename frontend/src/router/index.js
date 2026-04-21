import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DevicesView from "../views/DevicesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/", // Quando a URL for a raiz (localhost:5173/)
      name: "login", // Nome da rota
      component: LoginView, // O componente a ser renderizado
    },
    {
      path: "/registrar",
      name: "registrar",
      component: RegisterView,
    },
    {
      path: "/devices",
      name: "devices",
      component: DevicesView,
    },
  ],
});

export default router;
