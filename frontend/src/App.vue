<template>
  <router-view />
</template>

<script setup>
import { useTheme } from "./composables/useTheme.js";
const { iniciar } = useTheme();
iniciar();
</script>
<style>
:root {
  --color-bg:        #111214;
  --color-surface:   #1a1c1f;
  --color-sidebar:   #16181c;
  --color-border:    #2a2d32;
  --color-red:       #c0392b;
  --color-red-hover: #a93226;
  --color-text:      #e8eaed;
  --color-muted:     #555a63;
  --color-subtle:    #9aa0aa;
  --color-online:    #27ae60;
  --color-warn:      #e8a000;
  --font-mono: 'Courier New', Courier, monospace;
}

html.light {
  --color-bg:        #f4f4f5;
  --color-surface:   #ffffff;
  --color-sidebar:   #e8e8ea;
  --color-border:    #d1d1d6;
  --color-red:       #c0392b;
  --color-red-hover: #a93226;
  --color-text:      #111214;
  --color-muted:     #6b6b76;
  --color-subtle:    #3a3a3f;
  --color-online:    #1a7a40;
  --color-warn:      #b36200;
  --font-mono: 'Courier New', Courier, monospace;
}
</style>