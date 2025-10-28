import { defineStore } from "pinia";
import { get } from "../util/apiHelper";
import type { Repo } from "../types/Repo";
import type { Commit } from "../types/Commit";
import type { CommitDetails } from "../types/CommitDetails";

interface GithubState {
  username: string | null; // The GitHub username currently being viewed
  repos: Repo[]; // List of repositories for the current user
  commits: Commit[]; // List of commits for the selected repository
  selectedRepoName: string | null; // Name of the currently selected repository
  selectedCommitDetails: CommitDetails | null; // Details of the currently selected commit
  favourites: Commit[]; // List of favourite commits
  reposLoading: boolean; // Loading state for repositories
  error: string | null; // Stores any error messages
}

export const useGithubStore = defineStore("github", {
  state: (): GithubState => ({
    username: null,
    repos: [],
    commits: [],
    selectedRepoName: null,
    selectedCommitDetails: null,
    favourites: [],
    reposLoading: false,
    error: null,
  }),
  actions: {
    // Fetches repositories for a given GitHub username
    async fetchRepos(username: string) {
      this.reposLoading = true;
      this.error = null;
      this.username = username;
      try {
        const url = `/users/${username}/repos`;
        this.repos = await get<Repo[]>(url);
      } catch (err: any) {
        this.error = `Failed to fetch repositories: ${err.message}`;
        this.repos = [];
      } finally {
        this.reposLoading = false;
      }
    },
    // Fetches commits for a specific repository
    async fetchCommits(username: string, repoName: string) {
      this.error = null;
      this.commits = [];
      this.selectedRepoName = null;
      try {
        const url = `/repos/${username}/${repoName}/commits`;
        const fetchedCommits = await get<Commit[]>(url);
        this.commits = fetchedCommits.map((commit) => ({
          ...commit,
          repositoryName: repoName,
        }));
        this.selectedRepoName = repoName;
      } catch (err: any) {
        this.error = `Failed to fetch commits for ${repoName}: ${err.message}`;
        this.commits = [];
      }
    },
    // Fetches detailed information for a specific commit
    async fetchCommitDetails(username: string, repo: string, sha: string) {
      this.error = null;
      this.selectedCommitDetails = null;
      try {
        const url = `/repos/${username}/${repo}/commits/${sha}`;
        this.selectedCommitDetails = await get<CommitDetails>(url);
      } catch (err: any) {
        this.error = `Failed to fetch commit details for ${sha}: ${err.message}`;
      }
    },
    // Adds a commit to the favourites list
    addFavourite(commit: Commit) {
      if (!this.favourites.find((c) => c.sha === commit.sha)) {
        this.favourites.push(commit);
      }
    },
    // Removes a commit from the favourites list
    removeFavourite(commit: Commit) {
      this.favourites = this.favourites.filter((c) => c.sha !== commit.sha);
    },
  },
});
