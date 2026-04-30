<template>
  <div class="layout">
    <AppSidebar active="devices" />
    <main class="main">
      <AppTopbar title="Dashboard — Meus Sensores" sub="Global Sensor Network" />
      <div class="content">
        <div class="content__header">
          <div class="content__label">{{ devices.length }} device(s) cadastrado(s)</div>
        </div>

        <p v-if="erro" class="panel__error">{{ erro }}</p>

        <div v-if="devices.length === 0" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-top:80px;gap:16px;">
          <div style="font-size:10px;letter-spacing:2px;color:var(--color-text);text-transform:uppercase;">
            Nenhum device cadastrado
          </div>
          <button class="btn-primary btn-sm" @click="$router.push('/devices/create')">
            Adicionar primeiro device
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        <div class="cards" v-else>
          <div
            class="card"
            v-for="device in devices"
            :key="device._id"
            @click="irParaDetalhe(device)"
          >
            <div class="card__header">
              <div class="card__id">ID: {{ device.deviceId.slice(0, 9) }}</div>
              <button class="card__edit" @click.stop="$router.push('/devices/' + device.deviceId + '/edit')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="13" height="13">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <div class="card__body">
              <div class="card__nickname">{{ device.nickname || 'Sem apelido' }}</div>
              <div class="card__unit">{{ getUnit(device.unit).label }}</div>
              <div v-if="device.value !== null && device.value !== undefined" class="card__value">
                {{ device.value }} <span>{{ getUnit(device.unit).symbol }}</span>
              </div>
              <div v-else class="card__nodata">NO DATA</div>
            </div>
            <div class="card__footer">
              <div :class="['status-dot', device.value == null ? 'offline' : '']"></div>
              <div :class="['status-label', device.value != null ? 'online' : '']">
                {{ device.value != null ? 'Online' : 'No Data' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import AppTopbar from "../components/AppTopbar.vue";
import AppSidebar from "../components/AppSidebar.vue";
import { useAuth } from "../composables/useAuth.js";
import { getUnit } from "../utils/deviceUnits.js";
import api from "../api/api.js";

const router = useRouter();
const { getToken } = useAuth();
const devices = ref([]);
const erro = ref("");

async function listar() {
  try {
    const response = await api.get("/devices", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    devices.value = response.data.devices;
    localStorage.setItem("iot-devices", JSON.stringify(response.data.devices));
  } catch {
    erro.value = "Erro ao carregar devices.";
  }
}

function irParaDetalhe(device) {
  localStorage.setItem("iot-devices", JSON.stringify(devices.value));
  router.push("/devices/" + device.deviceId);
}

onMounted(() => listar());
</script>