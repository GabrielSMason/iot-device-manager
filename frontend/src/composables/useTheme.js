import { ref } from "vue";

const tema = ref(localStorage.getItem("iot-tema") || "dark");

export function useTheme() {
  function aplicarTema(valor) {
    tema.value = valor;
    localStorage.setItem("iot-tema", valor);
    if (valor === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }

  function toggleTema() {
    aplicarTema(tema.value === "dark" ? "light" : "dark");
  }

  function iniciar() {
    aplicarTema(tema.value);
  }

  return { tema, toggleTema, iniciar };
}