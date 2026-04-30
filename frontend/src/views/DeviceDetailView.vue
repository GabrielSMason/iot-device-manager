<template>
  <div class="layout">
    <AppSidebar active="devices" />
    <main class="main">
      <AppTopbar title="Device Detail" :back="true" />
      <div class="content">

        <div class="detail-card" style="max-width:720px;">

          <!-- Cabeçalho -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
            <div>
              <div class="card__nickname">{{ device?.nickname || route.params.deviceId }}</div>
              <div class="card__unit" style="margin-top:4px;">{{ unitInfo.label }}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div :class="['status-dot', lastValue == null ? 'offline' : '']"></div>
              <div :class="['status-label', lastValue != null ? 'online' : '']">
                {{ lastValue != null ? 'Online' : 'No Data' }}
              </div>
            </div>
          </div>

          <!-- Valor atual -->
          <div style="margin-bottom:24px;">
            <div style="font-size:9px;letter-spacing:2px;color:var(--color-muted);text-transform:uppercase;margin-bottom:6px;">
              Último valor recebido
            </div>
            <div v-if="lastValue !== null" class="card__value" style="font-size:36px;">
              {{ lastValue }} <span>{{ unitInfo.symbol }}</span>
            </div>
            <div v-else class="card__nodata">SEM DADOS</div>
          </div>

          <!-- Gráfico SVG -->
          <div style="margin-bottom:8px;font-size:9px;letter-spacing:2px;color:var(--color-muted);text-transform:uppercase;">
            Histórico da sessão (últimos {{ history.length }} registros)
          </div>
          <div style="background:var(--color-bg);border:1px solid var(--color-border);border-radius:4px;padding:12px;">
            <svg v-if="history.length >= 2" :viewBox="`0 0 ${SVG_W} ${SVG_H}`" width="100%" style="display:block;">
              <!-- Grade horizontal -->
              <line
                v-for="(tick, i) in yTicks"
                :key="'g'+i"
                :x1="PAD_L" :y1="yPos(tick)"
                :x2="SVG_W - PAD_R" :y2="yPos(tick)"
                stroke="var(--color-border)" stroke-width="1"
              />
              <!-- Labels eixo Y -->
              <text
                v-for="(tick, i) in yTicks"
                :key="'yt'+i"
                :x="PAD_L - 6" :y="yPos(tick) + 4"
                font-size="9" fill="var(--color-muted)"
                text-anchor="end" font-family="Courier New, monospace"
              >{{ tick }}</text>
              <!-- Linha do gráfico -->
              <polyline
                :points="linePoints"
                fill="none"
                stroke="var(--color-red)"
                stroke-width="1.5"
                stroke-linejoin="round"
                stroke-linecap="round"
              />
              <!-- Pontos -->
              <circle
                v-for="(pt, i) in points"
                :key="'pt'+i"
                :cx="pt.x" :cy="pt.y" r="3"
                fill="var(--color-red)"
              />
            </svg>
            <div v-else style="font-size:10px;letter-spacing:1px;color:var(--color-muted);text-align:center;padding:20px 0;">
              Aguardando dados suficientes para o gráfico...
            </div>
          </div>

          <!-- Info device -->
          <div class="detail-card__rows" style="margin-top:20px;">
            <div class="detail-row">
              <div class="detail-row__label">Device ID</div>
              <div class="detail-row__value">{{ device?.deviceId }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-row__label">Unidade</div>
              <div class="detail-row__value">{{ unitInfo.symbol }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-row__label">Tipo</div>
              <div class="detail-row__value">{{ unitInfo.label }}</div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";


import AppSidebar from "../components/AppSidebar.vue";
import AppTopbar from "../components/AppTopbar.vue";
import { useAuth } from "../composables/useAuth.js";
import { getUnit } from "../utils/deviceUnits.js";
import api from "../api/api.js";

const POLL_INTERVAL = 5000;
const HISTORY_KEY = (id) => `iot-history-${id}`;
const MAX_HISTORY = 50;

const SVG_W = 600;
const SVG_H = 160;
const PAD_L = 42;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 12;

const route = useRoute();
const { getToken } = useAuth();

const device = ref(null);
const lastValue = ref(null);
const history = ref([]);   
let timer = null;

onMounted(() => {
  const lista = JSON.parse(localStorage.getItem("iot-devices") || "[]");
  device.value = lista.find((d) => d.deviceId === route.params.deviceId) || null;

  const saved = localStorage.getItem(HISTORY_KEY(route.params.deviceId));
  if (saved) history.value = JSON.parse(saved);

  if (device.value?.value !== undefined && device.value?.value !== null) {
    lastValue.value = device.value.value;
  }

  poll();
  timer = setInterval(poll, POLL_INTERVAL);
});

onUnmounted(() => clearInterval(timer));

const unitInfo = computed(() => getUnit(device.value?.unit ?? 0));

async function poll() {
  try {
    const response = await api.get("/devices", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const lista = response.data.devices;
    localStorage.setItem("iot-devices", JSON.stringify(lista));

    const found = lista.find((d) => d.deviceId === route.params.deviceId);
    if (!found) return;

    device.value = found;

    if (found.value !== null && found.value !== undefined) {
      lastValue.value = found.value;
      appendHistory(found.value);
    }
  } catch {
  }
}

function appendHistory(value) {
  history.value.push(value);
  if (history.value.length > MAX_HISTORY) {
    history.value = history.value.slice(-MAX_HISTORY);
  }
  localStorage.setItem(HISTORY_KEY(route.params.deviceId), JSON.stringify(history.value));
}

const minVal  = computed(() => Math.min(...history.value));
const maxVal  = computed(() => Math.max(...history.value));
const range   = computed(() => {
  const r = maxVal.value - minVal.value;
  return r === 0 ? 1 : r;
});

const yTicks = computed(() => {
  const lo = minVal.value;
  const hi = maxVal.value;
  const mid = Math.round((lo + hi) / 2);
  return [
    Math.round(hi),
    mid,
    Math.round(lo),
  ];
});

function yPos(val) {
  return PAD_T + (1 - (val - minVal.value) / range.value) * (SVG_H - PAD_T - PAD_B);
}

function xPos(i) {
  const n = history.value.length;
  return PAD_L + (i / (n - 1)) * (SVG_W - PAD_L - PAD_R);
}

const points = computed(() =>
  history.value.map((v, i) => ({ x: xPos(i), y: yPos(v) }))
);

const linePoints = computed(() =>
  points.value.map((p) => `${p.x},${p.y}`).join(" ")
);
</script>