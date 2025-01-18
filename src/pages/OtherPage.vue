<template>
    <div>
      <h1>User List</h1>
  
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
      <ul>
        <li v-for="user in users" :key="user.id">
          <strong>{{ user.username }}</strong> - {{ user.email }} - {{ user.dob || "N/A" }}
        </li>
      </ul>
  
      <div v-if="pages > 1" class="pagination">
        <button 
          :disabled="page === 1" 
          @click="fetchUsers(page - 1)">
          Previous
        </button>
  
        <span>Page {{ page }} of {{ pages }}</span>
  
        <button 
          :disabled="page === pages" 
          @click="fetchUsers(page + 1)">
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    data() {
      return {
        users: [] as Array<{ id: number; username: string; email: string; dob?: string }>,
        page: 1,
        pages: 1,
        errorMessage: "",
      };
    },
    methods: {
      async fetchUsers(page: number) {
        try {
          const response = await fetch(`/api/user_list/?page=${page}`);
          if (!response.ok) {
            throw new Error("Failed to fetch users.");
          }
          const data = await response.json();
          this.users = data.users;
          this.page = data.page;
          this.pages = data.pages;
          this.errorMessage = "";
        } catch (error: any) {
          console.error("Error fetching users:", error);
          this.errorMessage = error.message || "An error occurred while fetching users.";
        }
      },
    },
    mounted() {
      this.fetchUsers(this.page); // Fetch the first page of users on mount
    },
  });
  </script>
  
  <style scoped>
  .error-message {
    color: red;
    margin-bottom: 1rem;
  }
  
  .pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #4f86d7;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  button:hover:enabled {
    background-color: #3a66a8;
  }
  </style>
  