import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useCsrfTokenStore } from "../csrfTokenStore";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const app = createApp(App);

// Initialize Pinia and use it in the app
const pinia = createPinia();
app.use(pinia);

// Fetch the CSRF token and store it in Pinia
const csrfTokenStore = useCsrfTokenStore();

const getCsrfToken = () => {
  const name = "csrftoken";
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }
  return null; // Return null if not found
};

// Fetch and set the CSRF token
const csrfToken = getCsrfToken();
if (csrfToken) {
  csrfTokenStore.setToken(csrfToken);
}

app.use(router);
app.mount("#app");
