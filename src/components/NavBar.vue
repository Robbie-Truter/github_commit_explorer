<template>
  <nav class="navbar">
    <RouterLink to="/" activeClass="active" class="link">Home page</RouterLink>
    <RouterLink to="/repos" custom v-slot="{ isExactActive }">
      <a href="#" @click.prevent :class="{ active: $route.path.startsWith('/repos') || isExactActive }" class="link">Repo page</a>
    </RouterLink>
  </nav>
</template>

<style>
.navbar {
  display: flex;
  align-items: center;
  gap: 25px;
  height: 78px;
  width: 100%;
  padding: 20px;
  background-color: white;
  box-shadow: 1px -1px 14px 2px rgba(0, 0, 0, 0.51);
  -webkit-box-shadow: 1px -1px 14px 2px rgba(0, 0, 0, 0.51);
  -moz-box-shadow: 1px -1px 14px 2px rgba(0, 0, 0, 0.51);
}

.link {
  border-radius: 3px;
  color: black;
  text-decoration: none;
  padding: 8px;
  font-size: large;
  font-weight: 600;
  transition: 0.1s ease-in-out;
}

.link.active {
  color: #007bff;
}

.link:hover {
  background-color: rgba(128, 128, 128, 0.283);
  opacity: 0.9;
}
</style>
