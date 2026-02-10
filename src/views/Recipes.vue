<template>
  <div class="recipes-page">
    <div class="page-header">
      <h1>📚 Recipe Collection</h1>
      <p>Browse all available recipes or scrape new ones from Cookpad</p>
    </div>

    <div class="controls card">
      <div class="search-section">
        <h3>🔍 Search & Scrape New Recipes</h3>
        <div class="search-input">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search recipes on Cookpad (e.g., ayam masak merah, nasi goreng)..."
            @keyup.enter="scrapeRecipes"
          />
          <button
            class="btn btn-primary"
            @click="scrapeRecipes"
            :disabled="recipeStore.loading || !searchTerm"
          >
            {{ recipeStore.loading ? 'Scraping...' : '🔎 Scrape Recipes' }}
          </button>
        </div>
        <p class="help-text">
          💡 Enter a dish name to scrape recipes from Cookpad.com. This may take a moment.
        </p>
      </div>

      <div class="filter-section">
        <h3>🎯 Filter Recipes</h3>
        <div class="filter-options">
          <label>
            <input
              type="radio"
              value="all"
              v-model="filterMode"
            />
            Show All Recipes ({{ allRecipes.length }})
          </label>
          <label>
            <input
              type="radio"
              value="matched"
              v-model="filterMode"
            />
            Only Matched Recipes ({{ recipeStore.matchedRecipes.length }})
          </label>
        </div>
      </div>
    </div>

    <div v-if="recipeStore.error" class="error-message">
      ⚠️ {{ recipeStore.error }}
    </div>

    <div v-if="recipeStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Loading recipes...</p>
    </div>

    <div v-else-if="displayedRecipes.length === 0" class="empty-state card">
      <h3>📭 No Recipes Found</h3>
      <p>Try scraping some recipes from Cookpad or adjust your filters!</p>
    </div>

    <div v-else class="recipes-grid">
      <div
        v-for="recipe in displayedRecipes"
        :key="recipe.id"
        class="recipe-card"
        @click="$router.push(`/recipe/${recipe.id}`)"
      >
        <div class="recipe-image">
          <img 
            :src="recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'" 
            :alt="recipe.title"
            @error="handleImageError"
          />
          <div v-if="recipe.matchPercentage > 0" class="match-badge">
            {{ Math.round(recipe.matchPercentage) }}% Match
          </div>
        </div>
        <div class="recipe-content">
          <h3>{{ recipe.title }}</h3>
          <div class="recipe-meta">
            <span>⏱️ {{ recipe.cookTime || '30 min' }}</span>
            <span>👥 {{ recipe.servings || '4' }} servings</span>
          </div>
          <div class="recipe-ingredients">
            <strong>Ingredients ({{ recipe.ingredients.length }}):</strong>
            <p>{{ recipe.ingredients.slice(0, 3).join(', ') }}{{ recipe.ingredients.length > 3 ? '...' : '' }}</p>
          </div>
          <div v-if="recipe.matchPercentage > 0" class="match-info">
            <span class="matched">✓ {{ recipe.matchedIngredients.length }} ingredients</span>
            <span v-if="recipe.missingIngredients.length > 0" class="missing">
              Missing: {{ recipe.missingIngredients.length }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import { showSuccess, showError } from '../utils/swal'

const recipeStore = useRecipeStore()
const searchTerm = ref('')
const filterMode = ref('all')

const allRecipes = computed(() => {
  return recipeStore.recipes.map(recipe => {
    const matchedIngredients = recipe.ingredients.filter(ingredient =>
      recipeStore.myIngredients.some(myIng =>
        ingredient.toLowerCase().includes(myIng.toLowerCase()) ||
        myIng.toLowerCase().includes(ingredient.toLowerCase())
      )
    )

    const matchPercentage = recipe.ingredients.length > 0
      ? (matchedIngredients.length / recipe.ingredients.length) * 100
      : 0

    return {
      ...recipe,
      matchedIngredients,
      matchPercentage,
      missingIngredients: recipe.ingredients.filter(
        ing => !matchedIngredients.includes(ing)
      )
    }
  })
})

const displayedRecipes = computed(() => {
  if (filterMode.value === 'matched') {
    return recipeStore.matchedRecipes
  }
  return allRecipes.value.sort((a, b) => b.matchPercentage - a.matchPercentage)
})

const scrapeRecipes = async () => {
  if (!searchTerm.value.trim()) return

  try {
    await recipeStore.scrapeRecipes(searchTerm.value)
    showSuccess(
      'Success!',
      `Successfully scraped recipes for "${searchTerm.value}"!`
    )
    searchTerm.value = ''
  } catch (error) {
    showError(
      'Oops...',
      'Failed to scrape recipes. Please try again.'
    )
  }
}

const handleImageError = (event) => {
  // Fallback to a default food image if image fails to load
  event.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 40px;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 18px;
  color: var(--text-secondary);
}

.controls {
  margin-bottom: 40px;
}

.search-section,
.filter-section {
  margin-bottom: 24px;
}

.search-section:last-child,
.filter-section:last-child {
  margin-bottom: 0;
}

.search-section h3,
.filter-section h3 {
  margin-bottom: 12px;
  font-size: 18px;
}

.search-input {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.search-input input {
  flex: 1;
}

.help-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.filter-options {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
}

.filter-options input[type="radio"] {
  width: auto;
  cursor: pointer;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 2px solid #fcc;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
}

.empty-state h3 {
  font-size: 24px;
  margin-bottom: 12px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.recipe-card {
  cursor: pointer;
  overflow: hidden;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.recipe-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.match-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--success-color);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.recipe-content {
  padding: 20px;
}

.recipe-content h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.recipe-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.recipe-ingredients {
  margin-bottom: 12px;
  font-size: 14px;
}

.recipe-ingredients strong {
  display: block;
  margin-bottom: 4px;
}

.recipe-ingredients p {
  color: var(--text-secondary);
  margin: 0;
}

.match-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.matched {
  color: var(--success-color);
  font-weight: 500;
}

.missing {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .search-input {
    flex-direction: column;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
