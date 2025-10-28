<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGithubStore } from "../stores/githubStore";

const router = useRouter();
const githubStore = useGithubStore();
const localUsername = ref("");
const error = ref("");

const fetchRepos = () => { // Fetches repositories for the entered GitHub username
  if (localUsername.value.trim()) {
    githubStore.username = localUsername.value.trim();
    router.push(`/repos/${githubStore.username}`);
  } else {
    error.value = "Please enter a GitHub username.";
  }
};
</script>

<template>
  <div class="home-container">
    <form @submit.prevent="fetchRepos" class="repo-form">
      <h1>Enter GitHub Username</h1>
      <input type="text" v-model="localUsername" placeholder="e.g., octocat" required />
      <button type="submit">Fetch Repositories</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.repo-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
}

button {
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
