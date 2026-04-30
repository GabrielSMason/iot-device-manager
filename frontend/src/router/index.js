import { createRouter, createWebHistory } from "vue-router";

import DeviceCreateView from "../views/DeviceCreateView.vue";
import DeviceDetailView from "../views/DeviceDetailView.vue";
import DeviceEditView from "../views/DeviceEditView.vue";
import RegisterView from "../views/RegisterView.vue";
import DevicesView from "../views/DevicesView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",                       
      name: "login",         
      component: LoginView 
    },
    { 
      path: "/registrar",              
      name: "registrar",     
      component: RegisterView 
    },
    { 
      path: "/devices",                
      name: "devices",       
      component: DevicesView 
    },
    { 
      path: "/devices/create",         
      name: "device-create", 
      component: DeviceCreateView 
    },
    { 
      path: "/devices/:deviceId",      
      name: "device-detail", 
      component: DeviceDetailView 
    },
    {
      path: "/devices/:deviceId/edit", 
      name: "device-edit",   
      component: DeviceEditView 
    },
  ],
});

export default router;
