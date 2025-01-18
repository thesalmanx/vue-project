<template>
  <div class="profile-container">
    <!-- Profile Section -->
    <div class="profile-section">
      <h2>Edit Profile</h2>
      <form @submit.prevent="submitProfile">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="form-group">
          <label for="full-name">Full Name:</label>
          <input
            type="text"
            id="full-name"
            v-model="form.name"
            :placeholder="user.name || 'Enter your full name'"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            :placeholder="user.username || 'Enter your username'"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            :placeholder="user.email || 'Enter your email'"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            v-model="form.date_of_birth"
            class="form-control"
          />
        </div>

        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>

    <!-- Right Section -->
    <div class="right-section">
      <!-- Friend Requests Section -->
      <div class="friend-requests-section">
        <h2>Friend Requests</h2>
        <div v-if="requests.length > 0" class="friend-requests-container">
          <div v-for="request in requests" :key="request.id" class="friend-request-tile">
            <h3>
              {{ request.type === "sent" ? "To" : "From" }}:
              {{ request.type === "sent" ? request.to : request.from }}
            </h3>
            <p>Status: {{ request.status }}</p>
            <div v-if="request.type === 'received'" class="actions">
              <button @click="acceptRequest(request.id)" class="btn btn-success">
                Accept
              </button>
              <button @click="denyRequest(request.id)" class="btn btn-danger">
                Deny
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No friend requests available.</p>
        </div>
      </div>

      <!-- Friends Section -->
      <div class="friends-section">
        <h2>Friends</h2>
        <div v-if="friends.length > 0" class="friends-container">
          <div v-for="friend in friends" :key="friend.id" class="friend-tile">
            <h3 class="friend-name">{{ friend.username }}</h3>
            <button @click="removeFriend(friend.id)" class="btn btn-danger remove-friend-btn">
              Remove Friend
            </button>
          </div>
        </div>
        <div v-else>
          <p>You have no friends added yet.</p>
        </div>
      </div>

      </div> <!-- End of right-section -->

      <!-- Current Hobbies Section -->
    </div>
    <div class="hobbies-section">
      <h2>Your Hobbies</h2>
      <div v-if="hobbies.length > 0" class="hobbies-container">
      <div v-for="hobby in hobbies" :key="hobby.id" class="hobby-tile">
        <img :src="hobby.image || defaultHobbyImage" alt="Hobby Image" class="hobby-image" />
        <h3>{{ hobby.name }}</h3>
        <button @click="leaveHobby(hobby.id)" class="btn btn-danger">Leave Hobby</button>
      </div>
      </div>
      <div v-else>
      <p>You are not part of any hobbies yet.</p>
      </div>
    </div>
    
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { apiRequest } from "../utils/api";

export default defineComponent({
  data() {
    return {
      user: {
        name: "",
        username: "",
        email: "",
        date_of_birth: "",
      },
      form: {
        name: "",
        username: "",
        email: "",
        date_of_birth: "",
      },
      successMessage: "",
      errorMessage: "",
      requests: [] as Array<{
        id: number;
        from: string;
        to: string;
        status: string;
        type?: string;
      }>,
      friends: [] as Array<{ id: number; username: string }>,
      hobbies: [] as Array<{ id: number; name: string; image?: string }>,
      defaultHobbyImage: "path/to/default/image.jpg",
    };
  },
  methods: {
    async submitProfile() {
      try {
        const updatedFields = (Object.keys(this.form) as Array<keyof typeof this.form>).reduce(
          (acc: Partial<typeof this.form>, key: keyof typeof this.form) => {
            if (this.form[key] !== this.user[key]) {
              if (key === "date_of_birth" && this.form.date_of_birth) {
                acc[key] = Math.floor(new Date(this.form.date_of_birth).getTime() / 1000).toString();
              } else {
                acc[key] = this.form[key];
              }
            }
            return acc;
          },
          {}
        );

        if (Object.keys(updatedFields).length === 0) {
          this.errorMessage = "No changes detected.";
          this.successMessage = "";
          return;
        }

        const data = await apiRequest("/api/update_user/", "POST", updatedFields);
        this.user = { ...this.user, ...data.user };
        this.successMessage = "Profile updated successfully.";
        this.errorMessage = "";
        await this.fetchUserInfo();
      } catch (error) {
        console.error("Error updating profile:", error);
        this.errorMessage = "An error occurred while updating the profile.";
        this.successMessage = "";
      }
    },
    async fetchUserInfo() {
      try {
        const data = await apiRequest("/api/user_info/", "GET");
        this.user = {
          ...data.user,
          date_of_birth: data.user.dob
        };
        this.form = { ...data.user, date_of_birth: data.user.dob };
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    async fetchFriendRequests() {
      try {
        const data = await apiRequest("/api/friend_requests/", "GET");
        this.requests = data.friend_requests;
      } catch (error) {
        console.error("Error in fetchFriendRequests:", error);
      }
    },
    async removeFriend(friendId: number) {
      try {
        const data = await apiRequest("/api/remove_friend/", "POST", { friend_id: friendId });
        if (data.success) {
          // Remove the friend from the local state
          this.friends = this.friends.filter(friend => friend.id !== friendId);
          alert(`You are no longer friends with ${data.friend.username}`);
        } else {
          alert(`Failed to remove friend: ${data.message}`);
        }
      } catch (error) {
        console.error("Error removing friend:", error);
        alert("An error occurred while removing the friend.");
      }
    },
    async fetchFriends() {
      try {
        const data = await apiRequest("/api/friends/", "GET");
        this.friends = data.friends;
      } catch (error) {
        console.error("Error in fetchFriends:", error);
      }
    },
    async acceptRequest(requestId: number) {
      try {
        const data = await apiRequest("/api/accept_friend_request/", "POST", {
          request_id: requestId,
        });
        if (data.success) {
          alert("Friend request accepted.");
          this.fetchFriendRequests();
          this.fetchFriends();
        }
      } catch (error) {
        console.error("Error accepting friend request:", error);
      }
    },
    async denyRequest(requestId: number) {
      try {
        const data = await apiRequest("/api/deny_friend_request/", "POST", {
          request_id: requestId,
        });
        if (data.success) {
          alert("Friend request denied.");
          this.fetchFriendRequests();
        }
      } catch (error) {
        console.error("Error denying friend request:", error);
      }
    },
    async fetchHobbies() {
      try {
        const data = await apiRequest("/api/user_hobbies/", "GET");
        this.hobbies = data.hobbies;
      } catch (error) {
        console.error("Error fetching hobbies:", error);
      }
    },
    async leaveHobby(hobbyId: number) {
      try {
        const data = await apiRequest("/api/leave_hobby/", "POST", { hobby_id: hobbyId });
        if (data.success) {
          this.hobbies = this.hobbies.filter((hobby) => hobby.id !== hobbyId);
          alert(`You have left the hobby: ${data.hobby.name}`);
        }
      } catch (error) {
        console.error("Error leaving hobby:", error);
        alert("An error occurred while leaving the hobby.");
      }
    },
  },
  mounted() {
    this.fetchUserInfo();
    this.fetchFriendRequests();
    this.fetchFriends();
    this.fetchHobbies();
  },
});
</script>

<style scoped>
.profile-container {
  display: flex;
  gap: 2rem;
}

.hobbies-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.profile-section {
  flex: 1;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.friend-requests-section,
.friends-section {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.friend-requests-container,
.friends-container
.hobbies-container {
  max-height: 300px;
  overflow-y: auto;
}

.profile-container {
  gap: 2rem;
}

.friend-request-tile,
.friend-tile,
.hobby-tile {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #4f86d7;
  color: white;
  border: none;
  border-radius: 4px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #3a66a8;
}

.hobbies-section {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-top: 2rem;
}

.hobby-tile {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  max-width: 250px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-size-adjust: dynamic;
}

.hobby-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

button {
  margin-top: 0.5rem;
}

.friend-tile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
}

.friend-name {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}

.remove-friend-btn {
  background-color: #dc3545; /* Red color */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-friend-btn:hover {
  background-color: #b52a37; /* Darker red on hover */
}


</style>
