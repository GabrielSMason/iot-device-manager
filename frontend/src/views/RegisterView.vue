<template>
  <form @submit.prevent="handleRegister">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" v-model="email" />

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" v-model="password" />

    <label for="fullname">fullName:</label>
    <input type="text" id="fullname" name="fullname" v-model="fullName" />

    <router-link to="/">Já tem conta? Fazer Login</router-link>
    <button type="submit">Cadastrar</button>
  </form>
</template>
<script setup>
import { ref } from "vue";
import api from "../api/api.js";

const email = ref("");
const password = ref("");
const fullName = ref("");

const handleRegister = async () => {
  try {
    const response = await api.post("/registrar", {
      email: email.value,
      password: password.value,
      fullName: fullName.value,
    });
    console.log("Responsta do servidor: ", response.data);
    alert(response.data.message);
  } catch (error) {
    console.error("Erro no login", error);
    alert(error.response?.data?.message || "Erro ao tentar fazer o login");
  }
};
</script>
<style>
/* O CSS vai aqui */
</style>
