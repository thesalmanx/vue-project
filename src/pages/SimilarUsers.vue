<template>
  <div>
    <h1>Similar Users</h1>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Filter Section -->
    <div class="filter-container">
      <label class="filter-label">Filter by Age Range:</label>
      <div class="filter-inputs">
        <input
          type="number"
          class="age-input"
          v-model.number="minAge"
          placeholder="Min Age"
          min="18"
          max="55"
        />
        <input
          type="number"
          class="age-input"
          v-model.number="maxAge"
          placeholder="Max Age"
          min="18"
          max="55"
        />
        <button @click="applyAgeFilter" class="filter-button">Apply</button>
      </div>
      <div class="age-range-display">
        Selected Age Range: {{ minAge }} - {{ maxAge }}
      </div>
    </div>

    <!-- User Grid -->
    <div v-if="users.length > 0" class="user-grid">
      <div v-for="user in users" :key="user.id" class="user-card">
        <img
          :src="user.profile_picture || defaultProfilePicture"
          alt="User Profile"
          class="user-image"
        />
        <div class="hover-overlay">
            <button @click="sendFriendRequest(user.id)" :disabled="user.hasPendingRequest || user.isFriend">
            {{ user.isFriend ? "Already friends!" : (user.hasPendingRequest ? "Request Pending" : "Send Friend Request") }}
            </button>
        </div>
        <div class="user-info">
          <h3>{{ user.username }}</h3>
          <p>{{ user.common_hobbies }} shared hobbies</p>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No similar users found.</p>
    </div>

    <!-- Pagination -->
    <div v-if="numPages > 1" class="pagination">
      <button :disabled="!hasPrevious" @click="fetchSimilarUsers(currentPage - 1)">
        Previous
      </button>

      <span>Page {{ currentPage }} of {{ numPages }}</span>

      <button :disabled="!hasNext" @click="fetchSimilarUsers(currentPage + 1)">
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { apiRequest } from "../utils/api";

interface User {
  id: number;
  username: string;
  common_hobbies: number;
  profile_picture: string | null;
  hasPendingRequest: boolean;
  isFriend: boolean;
}

export default defineComponent({
  data() {
    return {
      users: [] as User[],
      currentPage: 1,
      numPages: 1,
      hasNext: false,
      hasPrevious: false,
      errorMessage: "",
      minAge: 18,
      maxAge: 55,
      isFriend: false,
      defaultProfilePicture: "/default_profile_picture.png", // Path to a default profile picture
    };
  },
  methods: {
    async fetchSimilarUsers(page: number) {
      try {
        const ageQuery = `&minAge=${this.minAge}&maxAge=${this.maxAge}`;
        const data = await apiRequest(`/api/similar_users/?page=${page}${ageQuery}`, "GET");

        this.users = data.users.map((user: any) => ({
          ...user,
          hasPendingRequest: user.has_pending_request || false,
          isFriend: user.is_friend || false, // Ensure these fields are correctly mapped
        }));
        this.currentPage = data.current_page;
        this.numPages = data.num_pages;
        this.hasNext = data.has_next;
        this.hasPrevious = data.has_previous;
        this.errorMessage = "";
      } catch (error: any) {
        console.error("Error fetching similar users:", error);
        this.errorMessage = error.message || "An error occurred.";
      }
  },
  async sendFriendRequest(userId: number) {
    try {
        const data = await apiRequest("/api/send_friend_request/", "POST", {
          to_user_id: userId,
        });

        if (data.success) {
          // Update the user in the local state to mark the request as pending
          this.users = this.users.map((user) =>
            user.id === userId ? { ...user, hasPendingRequest: true } : user
          );
          alert("Friend request sent successfully.");
        } else {
          alert(`Failed to send friend request: ${data.message}`);
        }
      } catch (error) {
        console.error("Error sending friend request:", error);
        alert("An error occurred while sending the friend request.");
      }
    },

    applyAgeFilter() {
      if (this.minAge > this.maxAge) {
        alert("Min age cannot be greater than max age.");
        return;
      }
      this.fetchSimilarUsers(1);
    },
  },
  mounted() {
    this.fetchSimilarUsers(this.currentPage);
  },
});
</script>

<style scoped>
.error-message {
  color: red;
  margin-bottom: 1rem;
}

.slider-container {
  margin-bottom: 2rem;
  text-align: center;
}

.slider {
  position: relative;
  margin: 20px auto;
  width: 80%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slider-input {
  position: absolute;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
  background: #ddd;
  outline: none;
  z-index: 1;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f86d7;
  cursor: pointer;
}

.slider-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f86d7;
  cursor: pointer;
}

.age-label {
  font-size: 0.9rem;
  font-weight: bold;
  color: #666;
}

.age-range-display {
  margin-top: 10px;
  font-weight: bold;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.user-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  padding: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #eaeaea;
}

.user-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}

button {
  padding: 0.4rem 0.8rem;
  background-color: #4f86d7;
  color: white;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #3a66a8;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.filter-container {
  margin-bottom: 2rem;
  text-align: center;
}

.filter-inputs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.age-input {
  width: 80px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-button {
  padding: 0.5rem 1rem;
  background-color: #4f86d7;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-button:hover {
  background-color: #3a66a8;
}

</style>
