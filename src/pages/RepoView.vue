<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useGithubStore } from "../stores/githubStore";
import type { Commit } from "../types/Commit";
import FavouritesView from "./FavouritesView.vue";

const props = defineProps<{
  username: string;
}>();

const githubStore = useGithubStore();

const currentPage = ref(1);
const itemsPerPage = 10;

// Computed property to calculate total pages for pagination
const totalPages = computed(() => Math.ceil(githubStore.repos.length / itemsPerPage));

// Computed property to get repositories for the current page
const paginatedRepos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return githubStore.repos.slice(start, end);
});

// Function to navigate to the previous page
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Function to navigate to the next page
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Function to view a specific repository's commits
const viewRepo = async (selectedRepo: string) => {
  if (selectedRepo !== githubStore.selectedRepoName) {
    await githubStore.fetchCommits(props.username, selectedRepo);
  }
};

// Function to view details of a specific commit
const viewCommitDetails = async (repoName: string | null, commitSha: string) => {
  if (repoName) {
    await githubStore.fetchCommitDetails(props.username, repoName, commitSha);
  }
};

// Function to check if a commit is a favourite
const isFavourite = (commit: Commit) => {
  return githubStore.favourites.some((c) => c.sha === commit.sha);
};

// Function to toggle a commit's favourite status
const toggleFavourite = (commit: Commit) => {
  if (isFavourite(commit)) {
    githubStore.removeFavourite(commit);
  } else {
    githubStore.addFavourite(commit);
  }
};

onMounted(async () => {
  await githubStore.fetchRepos(props.username);
});
</script>

<template>
  <main class="repo-view-container">
    <header>
      <h1>Repositories for {{ username }}</h1>
      <h2>Click on a repository to view its commits</h2>
    </header>

    <div v-if="githubStore.reposLoading" class="loading">Loading repositories...</div>

    <div v-if="githubStore.error" class="error">{{ githubStore.error }}</div>

    <section v-if="!githubStore.reposLoading && !githubStore.error">
      <div v-if="githubStore.repos && githubStore.repos.length > 0" class="repo-list">
        <article
          v-for="repo in paginatedRepos"
          :key="repo.id"
          @click="viewRepo(repo.name)"
          class="repo-item"
        >
          <h2>{{ repo.name }}</h2>
          <p>{{ repo.description }}</p>
          <div v-if="githubStore.selectedRepoName === repo.name" class="commit-section">
            <div v-if="githubStore.commits.length > 0" class="commit-list">
              <h3>Commits for {{ repo.name }}</h3>
              <div v-for="commit in githubStore.commits" :key="commit.sha" class="commit-item">
                <p><strong>Message:</strong> {{ commit.commit.message }}</p>
                <p><strong>Author:</strong> {{ commit.commit.author.name }}</p>
                <p>
                  <strong>Date:</strong> {{ new Date(commit.commit.author.date).toLocaleString() }}
                </p>
                <button @click="viewCommitDetails(githubStore.selectedRepoName, commit.sha)">
                  View details
                </button>
                <button @click="toggleFavourite(commit)">
                  {{ isFavourite(commit) ? "Unfavourite" : "Favourite" }}
                </button>

                <div
                  v-if="
                    githubStore.selectedCommitDetails &&
                    githubStore.selectedCommitDetails.sha === commit.sha
                  "
                  class="commit-details"
                >
                  <h4>Files Changed:</h4>
                  <ul>
                    <li v-for="file in githubStore.selectedCommitDetails.files" :key="file.sha">
                      {{ file.filename }} ({{ file.status }}) - {{ file.additions }} additions,
                      {{ file.deletions }} deletions
                      <pre v-if="file.patch">{{ file.patch }}</pre>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else class="no-commits">
              <p>No commits found for this repository.</p>
            </div>
          </div>
        </article>

        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>

      <div v-else class="no-repos">
        <p>No public repositories found for this user.</p>
      </div>
    </section>

    <FavouritesView />
  </main>
</template>

<style scoped>
.repo-view-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.loading,
.error,
.no-repos {
  text-align: center;
  font-size: 1.2em;
  padding: 20px;
}

.error {
  color: red;
}

.repo-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.repo-list :hover {
  transition: 0.1s ease-in-out;
}

.repo-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.repo-item h2 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.repo-item p {
  margin: 0;
}

.commit-list {
  margin-top: 20px;
  padding-top: 15px;
}

.commit-list h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2em;
}

.commit-item {
  max-height: 800px;
  overflow-y: auto;
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 0.9em;
}

.commit-item:last-child {
  margin-bottom: 0;
}

.commit-section {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.no-commits {
  text-align: center;
  font-size: 1.1em;
  padding: 10px;
  color: #666;
}

.commit-details {
  margin-top: 15px;
  border-top: 1px dashed #ccc;
  padding-top: 15px;
}

.commit-details h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.commit-details ul {
  list-style: none;
  padding: 0;
}

.commit-details li {
  background-color: #f1f3f5;
  padding: 8px;
  border-radius: 3px;
  margin-bottom: 5px;
  font-family: monospace;
  white-space: pre-wrap;
}

.commit-details pre {
  background-color: #e9ecef;
  padding: 5px;
  border-radius: 3px;
  overflow-x: auto;
  font-size: 0.8em;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  cursor: pointer;
  border: 1px solid #ccc;
  background: #f9f9f9;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
