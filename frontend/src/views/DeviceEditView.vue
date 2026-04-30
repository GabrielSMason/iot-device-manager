<template>
  <div class="layout">
    <AppSidebar active="devices" />
    <main class="main">
      <AppTopbar title="Editar Device" :back="true" />

      <div class="content">
        <div class="detail-card">
          <div class="card__nickname" style="margin-bottom: 20px;">
            {{ device?.nickname || route.params.deviceId }}
          </div>

          <div class="field">
            <div class="field__label">Novo Apelido</div>
            <div class="field__wrap">
              <input
                class="field__input no-icon"
                type="text"
                placeholder="Novo apelido"
                v-model="novoNickname"
              />
            </div>
          </div>

          <p v-if="erro" class="panel__error">{{ erro }}</p>
          <p v-if="sucesso" class="panel__sucesso">{{ sucesso }}</p>

          <div style="display: flex; gap: 12px;">
            <button class="btn-primary btn-sm" @click="salvar">
              Salvar
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <button class="btn-danger" @click="deletar">
              Deletar Device
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth.js";
import AppTopbar from "../components/AppTopbar.vue";
import AppSidebar from "../components/AppSidebar.vue";
import api from "../api/api.js";

const router = useRouter();
const route = useRoute();
const { getToken } = useAuth();

const device = ref(null);
const novoNickname = ref("");
const erro = ref("");
const sucesso = ref("");

onMounted(() => {
  const lista = JSON.parse(localStorage.getItem("iot-devices") || "[]");
  device.value = lista.find((d) => d.deviceId === route.params.deviceId) || null;
  if (device.value) novoNickname.value = device.value.nickname || "";
});

async function salvar() {
  erro.value = "";
  sucesso.value = "";

  if (!novoNickname.value) {
    erro.value = "Apelido não pode ser vazio.";
    return;
  }

  try {
    await api.patch(
      `/devices/${route.params.deviceId}`,
      { nickname: novoNickname.value },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    sucesso.value = "Apelido atualizado com sucesso.";
    localStorage.removeItem("iot-devices");
    setTimeout(() => router.push("/devices"), 1000);
  } catch (error) {
    erro.value = error.response?.data?.message || "Erro ao atualizar.";
  }
}

async function deletar() {
  erro.value = "";
  try {
    await api.delete(`/devices/${route.params.deviceId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    localStorage.removeItem("iot-devices");
    router.push("/devices");
  } catch (error) {
    erro.value = error.response?.data?.message || "Erro ao deletar device.";
  }
}
</script>