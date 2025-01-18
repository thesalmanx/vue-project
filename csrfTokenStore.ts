import { defineStore } from "pinia";

export const useCsrfTokenStore = defineStore("csrfToken", {
  state: () => ({
    token: "" as string, // Store the CSRF token here
  }),
  actions: {
    setToken(token: string) {
      this.token = token; // Update the token
    },
  },
});
