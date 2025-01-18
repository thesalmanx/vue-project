<template>
  <div>
    <h1>Hobby List</h1>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div v-if="hobbies.length > 0" class="hobby-grid">
      <div v-for="hobby in hobbies" :key="hobby.id" class="hobby-tile">
        <img :src="hobby.image" alt="Hobby Image" class="hobby-image" />
        <div class="hover-overlay">
          <p>{{ hobby.popularity }} members</p>
          <button
            @click="joinHobby(hobby.id)"
            :disabled="hobby.isMember"
          >
            {{ hobby.isMember ? "Already a Member" : "Join Hobby" }}
          </button>
        </div>
        <h3>{{ hobby.name }}</h3>
      </div>
    </div>


    <div v-else>
      <p>No hobbies found.</p>
    </div>

    <div v-if="numPages > 1" class="pagination">
      <button :disabled="!hasPrevious" @click="fetchHobbies(currentPage - 1)">
        Previous
      </button>

      <span>Page {{ currentPage }} of {{ numPages }}</span>

      <button :disabled="!hasNext" @click="fetchHobbies(currentPage + 1)">
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { apiRequest } from "../utils/api";

interface Hobby {
  id: number;
  name: string;
  image: string;
  description: string;
  popularity: number; // Number of members
  isMember: boolean;  // Whether the user is a member
}

export default defineComponent({
  data() {
    return {
      hobbies: [] as Hobby[],
      currentPage: 1,
      numPages: 1,
      hasNext: false,
      hasPrevious: false,
      errorMessage: "",
    };
  },
  methods: {
    async fetchHobbies(page: number) {
      try {
        const data = await apiRequest(`/api/hobby_list/?page=${page}`, "GET");
        this.hobbies = data.hobbies.map((hobby: any) => ({
          ...hobby,
          isMember: hobby.is_member || false,
        }));
        this.currentPage = data.current_page;
        this.numPages = data.num_pages;
        this.hasNext = data.has_next;
        this.hasPrevious = data.has_previous;
        this.errorMessage = "";
      } catch (error: any) {
        console.error("Error fetching hobbies:", error);
        this.errorMessage = error.message || "An error occurred.";
      }
    },
    async joinHobby(hobbyId: number) {
      try {
        const data = await apiRequest("/api/join_hobby/", "POST", {
          hobby_id: hobbyId,
        });

        if (data.success) {
          alert(`Successfully joined ${data.hobby.name}`);

          // Update the `isMember` field for the joined hobby
          this.hobbies = this.hobbies.map((hobby) =>
            hobby.id === hobbyId ? { ...hobby, isMember: true } : hobby
          );
        } else {
          alert(`Failed to join hobby: ${data.message}`);
        }
      } catch (error) {
        console.error("Error joining hobby:", error);
        alert("An error occurred while joining the hobby.");
      }
    }
  },
  mounted() {
    this.fetchHobbies(this.currentPage);
  },
});
</script>

<style scoped>
.hobby-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.hobby-tile {
  position: relative; /* Position relative for hover-overlay */
  text-align: center;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  overflow: hidden; /* Ensures the overlay doesn’t spill out */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hobby-tile:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.hobby-image {
  width: 100%;
  height: 150px;
  object-fit: contain; /* Ensures image fits without cropping */
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

/* Hover overlay */
.hover-overlay {
  position: absolute; /* Overlay positioned over the image */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0; /* Initially hidden */
  transition: opacity 0.3s ease; /* Smooth fade-in effect */
}

.hobby-tile:hover .hover-overlay {
  opacity: 1; /* Show overlay on hover */
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
