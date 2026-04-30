import { useRouter } from "vue-router";

export function useAuth() {
  const router = useRouter();

  function getToken() {
    return localStorage.getItem("meu-projeto-token");
  }

  function logout() {
    localStorage.removeItem("meu-projeto-token");
    localStorage.removeItem("iot-devices");
    router.push("/");
  }

  return { getToken, logout };
}