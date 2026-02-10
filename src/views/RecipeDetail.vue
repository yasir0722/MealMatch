<template>
  <div class="recipe-detail">
    <button class="btn btn-outline back-btn" @click="$router.back()">
      ← Back
    </button>

    <div v-if="!recipe" class="empty-state card">
      <h2>Recipe not found</h2>
      <router-link to="/recipes" class="btn btn-primary mt-2">
        Browse Recipes
      </router-link>
    </div>

    <div v-else class="recipe-container">
      <div class="recipe-header">
        <img
          :src="recipe.image || 'https://via.placeholder.com/800x400?text=No+Image'"
          :alt="recipe.title"
          class="recipe-hero-image"
        />
        <div class="recipe-title-section">
          <h1>{{ recipe.title }}</h1>
          <div class="recipe-meta">
            <span>⏱️ {{ recipe.cookTime || '30 minutes' }}</span>
            <span>👥 {{ recipe.servings || '4 servings' }}</span>
            <span v-if="matchPercentage > 0" class="match-badge">
              {{ Math.round(matchPercentage) }}% Match
            </span>
          </div>
        </div>
      </div>

      <div class="recipe-body grid grid-2">
        <div class="ingredients-section card">
          <h2>📝 Ingredients</h2>
          <ul class="ingredients-list">
            <li
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              :class="{ 'has-ingredient': hasIngredient(ingredient) }"
            >
              <span class="check-icon">{{ hasIngredient(ingredient) ? '✓' : '○' }}</span>
              {{ ingredient }}
            </li>
          </ul>

          <div v-if="recipeStore.myIngredients.length > 0" class="ingredient-summary">
            <div class="summary-item success">
              <strong>✓ You have:</strong>
              <span>{{ matchedIngredients.length }} ingredients</span>
            </div>
            <div v-if="missingIngredients.length > 0" class="summary-item missing">
              <strong>○ Missing:</strong>
              <span>{{ missingIngredients.length }} ingredients</span>
            </div>
          </div>
        </div>

        <div class="instructions-section card">
          <h2>👨‍🍳 Instructions</h2>
          <ol class="instructions-list">
            <li v-for="(step, index) in recipe.instructions" :key="index">
              <strong>Step {{ index + 1 }}:</strong>
              {{ step }}
            </li>
          </ol>

          <div v-if="recipe.instructions.length === 0" class="empty-instructions">
            <p>Detailed instructions will be available after scraping from the source.</p>
          </div>
        </div>
      </div>

      <div v-if="recipe.url" class="recipe-footer card">
        <h3>📖 Original Recipe</h3>
        <p>View the complete recipe with photos and additional tips:</p>
        <a :href="recipe.url" target="_blank" class="btn btn-primary">
          Visit Cookpad Recipe →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'

const route = useRoute()
const recipeStore = useRecipeStore()

const recipe = computed(() => {
  return recipeStore.getRecipeById(route.params.id)
})

const matchedIngredients = computed(() => {
  if (!recipe.value) return []
  return recipe.value.ingredients.filter(ingredient =>
    recipeStore.myIngredients.some(myIng =>
      ingredient.toLowerCase().includes(myIng.toLowerCase()) ||
      myIng.toLowerCase().includes(ingredient.toLowerCase())
    )
  )
})

const missingIngredients = computed(() => {
  if (!recipe.value) return []
  return recipe.value.ingredients.filter(
    ing => !matchedIngredients.value.includes(ing)
  )
})

const matchPercentage = computed(() => {
  if (!recipe.value || recipe.value.ingredients.length === 0) return 0
  return (matchedIngredients.value.length / recipe.value.ingredients.length) * 100
})

const hasIngredient = (ingredient) => {
  return recipeStore.myIngredients.some(myIng =>
    ingredient.toLowerCase().includes(myIng.toLowerCase()) ||
    myIng.toLowerCase().includes(ingredient.toLowerCase())
  )
}
</script>

<style scoped>
.back-btn {
  margin-bottom: 24px;
}

.recipe-header {
  margin-bottom: 32px;
}

.recipe-hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  margin-bottom: 24px;
}

.recipe-title-section h1 {
  font-size: 42px;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.recipe-meta {
  display: flex;
  gap: 24px;
  font-size: 18px;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.recipe-meta .match-badge {
  background: var(--success-color);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
}

.recipe-body {
  margin-bottom: 32px;
}

.ingredients-section h2,
.instructions-section h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredients-list li {
  padding: 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.ingredients-list li.has-ingredient {
  background: #e8f5e9;
  border-left: 4px solid var(--success-color);
}

.check-icon {
  font-weight: bold;
  font-size: 18px;
  color: var(--text-secondary);
}

.has-ingredient .check-icon {
  color: var(--success-color);
}

.ingredient-summary {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid var(--border-color);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
}

.summary-item.success {
  background: #e8f5e9;
  color: var(--success-color);
}

.summary-item.missing {
  background: #fff3e0;
  color: var(--secondary-color);
}

.instructions-list {
  padding-left: 20px;
}

.instructions-list li {
  margin-bottom: 20px;
  line-height: 1.8;
  color: var(--text-primary);
}

.instructions-list strong {
  display: block;
  margin-bottom: 4px;
  color: var(--primary-color);
}

.empty-instructions {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.recipe-footer {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.recipe-footer h3 {
  margin-bottom: 12px;
}

.recipe-footer p {
  margin-bottom: 20px;
  opacity: 0.9;
}

.recipe-footer .btn {
  background: white;
  color: var(--primary-color);
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
}

@media (max-width: 768px) {
  .recipe-hero-image {
    height: 250px;
  }

  .recipe-title-section h1 {
    font-size: 28px;
  }

  .recipe-meta {
    font-size: 16px;
    gap: 16px;
  }
}
</style>
