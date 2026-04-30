<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <div class="sidebar__brand-name">System-Unit-01</div>
      <div class="sidebar__brand-status">Status: Operational</div>
    </div>

    <nav class="sidebar__nav">
      <div
        :class="['nav-item', active === 'devices' ? 'active' : '']"
        @click="$router.push('/devices')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
        </svg>
        Devices
      </div>

      <div
        :class="['nav-item', active === 'create' ? 'active' : '']"
        @click="$router.push('/devices/create')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">
          <circle cx="12" cy="12" r="9"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Add Device
      </div>
    </nav>

    <div class="sidebar__logout">
      <div class="nav-item" @click="toggleTema">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        {{ tema === 'dark' ? 'Modo Claro' : 'Modo Escuro' }}
      </div>

      <div class="nav-item" @click="logout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        Logout
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useAuth } from "../composables/useAuth.js";
import { useTheme } from "../composables/useTheme.js";

defineProps({
  active: { type: String, default: "" },
});

const { logout } = useAuth();
const { tema, toggleTema } = useTheme();
</script>