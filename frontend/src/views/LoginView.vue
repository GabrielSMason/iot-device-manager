<template>
  <form @submit.prevent="handleLogin">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" v-model="email" />

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" v-model="password" />

    <button type="submit">Login</button>

    <router-link to="/registrar">Ainda não tem conta? Cadastrar</router-link>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api.js";

const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });
    console.log("Responsta do servidor: ", response.data);
    alert(response.data.message);
    localStorage.setItem("meu-projeto-token", response.data.token);
    router.push("/devices");
  } catch (error) {
    console.error("Erro no login", error);
    alert(error.response?.data?.message || "Erro ao tentar fazer o login");
  }
};
</script>

<style scoped>
/* O CSS vai aqui */
</style>
