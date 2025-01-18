<template>
    <main class="container pt-4">
      <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Hobby App</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'Similar Users' }">
                  Similar Users
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'Other Page' }">
                  Other Page
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'Profile Page' }">
                  Profile Page
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'Hobby List' }">
                  Hobby List
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <RouterView class="flex-shrink-0" />
    </main>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import { RouterView } from "vue-router";
  
  export default defineComponent({
    components: { RouterView },
  });
  </script>
  
  <style scoped>
  /* Optional custom styles for the navbar */
  .navbar-brand {
    font-weight: bold;
    font-size: 1.25rem;
  }
  
  .nav-link {
    font-size: 1rem;
    color: #4f86d7;
    transition: color 0.3s ease;
  }
  
  .nav-link:hover {
    color: #3a66a8;
  }
  </style>
  