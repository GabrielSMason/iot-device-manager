<template>
  <div class="layout">
    <AppSidebar active="create" />

    <main class="main">
      <AppTopbar title="Add Device" :back="true" />

      <div class="content" style="display: flex; justify-content: center; align-items: flex-start; padding-top: 48px;">
        <div class="detail-card" v-if="!senhaGerada" style="width: 920px;">

          <div class="field">
            <div class="field__label">Apelido</div>
            <div class="field__wrap">
              <input
                class="field__input no-icon"
                type="text"
                placeholder="Ex: Sensor Sala"
                v-model="novoNickname"
              />
            </div>
          </div>

          <div class="field">
            <div class="field__label">Tipo de Sensor</div>
            <div class="field__wrap">
              <select class="field__input no-icon" v-model="novaUnidade">
                <option disabled value="">Selecione o tipo</option>
                <option v-for="(info, code) in UNIT_MAP" :key="code" :value="code">
                  {{ info.label }} ({{ info.symbol }})
                </option>
              </select>
            </div>
          </div>

          <p v-if="erro" class="panel__error">{{ erro }}</p>

          <button class="btn-primary btn-sm" @click="cadastrar">
            Cadastrar Device
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <div class="terminal" v-if="senhaGerada">
          <div class="terminal__bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa0aa" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            <span class="terminal__bar-title">Secure_Terminal</span>
          </div>
          <div class="terminal__body">
            <div class="terminal__line terminal__line--ok">> Status: OK</div>
            <hr class="terminal__divider">
            <div class="cred-block">
              <div class="cred-label">Device_ID</div>
              <div class="cred-value">{{ deviceIdGerado }}</div>
            </div>
            <div class="cred-block">
              <div class="cred-label">Device_PWD (Auth Token)</div>
              <div class="cred-value">{{ senhaGerada }}</div>
            </div>
            <hr class="terminal__divider">
            <div class="terminal__warning">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="1.5" style="flex-shrink:0; margin-top:1px;">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div class="terminal__warning-text">
                <strong>Atencao Protocolo de Seguranca:</strong><br>
                Armazene estas credenciais imediatamente. Elas <strong>NAO</strong> serao exibidas novamente apos o fechamento desta interface.
              </div>
            </div>
            <button class="btn-primary btn-sm" style="margin-top: 8px;" @click="$router.push('/devices')">
              Ir para Devices
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import AppSidebar from "../components/AppSidebar.vue";
import AppTopbar from "../components/AppTopbar.vue";
import { useAuth } from "../composables/useAuth.js";
import { UNIT_MAP } from "../utils/deviceUnits.js";
import api from "../api/api.js";

const router = useRouter();
const { getToken } = useAuth();

const novoNickname = ref("");
const novaUnidade = ref("");
const erro = ref("");
const senhaGerada = ref("");
const deviceIdGerado = ref("");

async function cadastrar() {
  erro.value = "";

  if (!novoNickname.value || !novaUnidade.value) {
    erro.value = "Apelido e tipo de sensor são obrigatórios.";
    return;
  }

  try {
    const response = await api.post(
      "/devices",
      { nickname: novoNickname.value, unit: Number(novaUnidade.value) },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    senhaGerada.value = response.data.suaSenhaSecreta;
    deviceIdGerado.value = response.data.deviceId;
    localStorage.removeItem("iot-devices");
  } catch (error) {
    erro.value = error.response?.data?.message || "Erro ao cadastrar.";
  }
}
</script>

<style scoped>
.terminal {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  width: 520px;
  overflow: hidden;
}
.terminal__bar {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.terminal__bar-title {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--color-subtle);
  text-transform: uppercase;
}
.terminal__body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.terminal__line { font-size: 11px; letter-spacing: 1px; color: var(--color-muted); }
.terminal__line--ok { color: var(--color-red); font-weight: 700; }
.terminal__divider { border: none; border-top: 1px solid var(--color-border); margin: 2px 0; }
.cred-block { display: flex; flex-direction: column; gap: 6px; }
.cred-label { font-size: 9px; letter-spacing: 2px; color: var(--color-muted); text-transform: uppercase; }
.cred-value {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 12px;
  letter-spacing: 1.5px;
  color: #378ADD;
  word-break: break-all;
}
.terminal__warning {
  background: rgba(192, 57, 43, 0.08);
  border: 1px solid rgba(192, 57, 43, 0.3);
  border-radius: 4px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.terminal__warning-text {
  font-size: 10px;
  letter-spacing: 0.5px;
  color: var(--color-red);
  line-height: 1.6;
}
</style>