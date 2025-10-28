<script setup lang="ts">
import { useGithubStore } from "../stores/githubStore";
import type { Commit } from "../types/Commit";

const githubStore = useGithubStore();

const isFavourite = (commit: Commit) => {
  return githubStore.favourites.some((c) => c.sha === commit.sha);
};

const toggleFavourite = (commit: Commit) => {
  if (isFavourite(commit)) {
    githubStore.removeFavourite(commit);
  } else {
    githubStore.addFavourite(commit);
  }
};

const viewCommitDetails = async (repoName: string | null, commitSha: string) => {
  if (repoName) {
    await githubStore.fetchCommitDetails(githubStore.username!, repoName, commitSha);
  }
};
</script>

<template>
  <main class="favourites-view-container">
    <header>
      <h1>Favourite Commits</h1>
    </header>

    <section>
      <div v-if="githubStore.favourites.length > 0" class="commit-list">
        <div v-for="commit in githubStore.favourites" :key="commit.sha" class="commit-item">
          <p><strong>Message:</strong> {{ commit.commit.message }}</p>
          <p><strong>Author:</strong> {{ commit.commit.author.name }}</p>
          <p><strong>Date:</strong> {{ new Date(commit.commit.author.date).toLocaleString() }}</p>
          <button @click="viewCommitDetails(commit.repositoryName ?? null, commit.sha)">
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
      <div v-else class="no-favourites">
        <p>No favourite commits yet.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.favourites-view-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.commit-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.commit-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.commit-item h2 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.commit-item p {
  margin: 0;
}

.no-favourites {
  text-align: center;
  font-size: 1.2em;
  padding: 20px;
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
</style>
