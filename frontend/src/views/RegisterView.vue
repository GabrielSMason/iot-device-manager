<template>
  <div class="page-center">
    <div class="panel">
      <div class="panel__shield">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6L12 2z"
            fill="#c0392b" opacity="0.25"/>
          <path d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6L12 2z"
            stroke="#c0392b" stroke-width="1.2" fill="none"/>
        </svg>
      </div>

      <div class="panel__title">IOT Sentinel</div>
      <div class="panel__subtitle">New Operator Registration</div>

      <div class="field">
        <div class="field__label">Operator Email</div>
        <div class="field__wrap">
          <span class="field__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </span>
          <input class="field__input" type="email" placeholder="ID@SYSTEM.NET" v-model="email" />
        </div>
      </div>

      <div class="field">
        <div class="field__label">Full Name</div>
        <div class="field__wrap">
          <span class="field__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="7" width="18" height="13" rx="1"/>
              <path d="M16 7V5a4 4 0 00-8 0v2"/>
            </svg>
          </span>
          <input class="field__input" type="text" placeholder="OPERATOR NAME" v-model="fullName" />
        </div>
      </div>

      <div class="field">
        <div class="field__label">Passkey Override</div>
        <div class="field__wrap">
          <span class="field__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="8" cy="15" r="3"/>
              <path d="M11 15h9M17 12v3"/>
            </svg>
          </span>
          <input
            class="field__input"
            :type="mostrarSenha ? 'text' : 'password'"
            placeholder="••••••••••••"
            v-model="password"
          />
          <button class="field__eye" @click="mostrarSenha = !mostrarSenha" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      <p v-if="erro" class="panel__error">{{ erro }}</p>

      <button class="btn-primary" @click="handleRegister">
        Create Access
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <div class="panel__footer">
        <span class="panel__version">v.1.0.0 // ONLINE</span>
        <button class="panel__recover" @click="$router.push('/')">
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api.js";

const router = useRouter();
const email = ref("");
const fullName = ref("");
const password = ref("");
const mostrarSenha = ref(false);
const erro = ref("");

async function handleRegister() {
  erro.value = "";
  try {
    await api.post("/registrar", {
      email: email.value,
      fullName: fullName.value,
      password: password.value,
    });
    router.push("/");
  } catch (error) {
    erro.value = error.response?.data?.message || "REGISTRATION FAILED";
  }
}
</script>