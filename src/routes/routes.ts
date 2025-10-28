import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../pages/HomeView.vue";
import RepoView from "../pages/RepoView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/repos/:username", component: RepoView, props: true },
  { path: "/:catchAll(.*)", redirect: "/" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
