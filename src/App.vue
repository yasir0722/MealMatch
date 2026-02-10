<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🍳</span>
          <h1>MealMatch</h1>
        </div>
        <nav class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/ingredients" class="nav-link">My Ingredients</router-link>
          <router-link to="/recipes" class="nav-link">Recipes</router-link>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 MealMatch - Cook Smart, Waste Less</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRecipeStore } from './stores/recipeStore'

const recipeStore = useRecipeStore()

onMounted(() => {
  recipeStore.loadRecipes()
})
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  margin: -20px -20px 30px -20px;
  box-shadow: var(--shadow-lg);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  min-height: calc(100vh - 200px);
}

.app-footer {
  text-align: center;
  padding: 20px;
  margin-top: 40px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
