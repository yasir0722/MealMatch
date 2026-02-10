<template>
  <div class="ingredients-page">
    <div class="page-header">
      <h1>🥗 My Ingredients</h1>
      <p>Manage your available ingredients to get personalized recipe suggestions</p>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h2>Add Ingredients</h2>
        <p class="mb-3">Add items you have in your fridge or pantry</p>
        
        <div class="input-group">
          <label>Ingredient Name</label>
          <input
            v-model="newIngredient"
            type="text"
            placeholder="e.g., chicken breast, tomatoes, rice..."
            @keyup.enter="addIngredient"
          />
        </div>
        
        <button class="btn btn-primary" @click="addIngredient">
          ➕ Add Ingredient
        </button>

        <div class="quick-add mt-3">
          <h3>Quick Add Common Items:</h3>
          <div class="quick-add-grid">
            <button
              v-for="item in commonIngredients"
              :key="item"
              class="btn btn-outline btn-sm"
              @click="quickAdd(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Your Current Ingredients ({{ recipeStore.myIngredients.length }})</h2>
          <button
            v-if="recipeStore.myIngredients.length > 0"
            class="btn btn-danger btn-sm"
            @click="clearAll"
          >
            Clear All
          </button>
        </div>

        <div v-if="recipeStore.myIngredients.length === 0" class="empty-state">
          <p>😊 No ingredients added yet. Start adding items to get recipe suggestions!</p>
        </div>

        <div v-else class="ingredients-grid">
          <div
            v-for="ingredient in recipeStore.myIngredients"
            :key="ingredient"
            class="ingredient-item"
          >
            <span class="ingredient-name">{{ ingredient }}</span>
            <button
              class="delete-btn"
              @click="recipeStore.removeIngredient(ingredient)"
              title="Remove ingredient"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="recipeStore.myIngredients.length > 0" class="suggestions-section card mt-3">
      <h2>📊 Recipe Match Statistics</h2>
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">{{ recipeStore.matchedRecipes.length }}</div>
          <div class="stat-label">Recipes You Can Make</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">
            {{ perfectMatches }}
          </div>
          <div class="stat-label">100% Matches</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">
            {{ goodMatches }}
          </div>
          <div class="stat-label">75%+ Matches</div>
        </div>
      </div>

      <div class="text-center mt-3">
        <router-link to="/" class="btn btn-primary">
          🍳 View Matching Recipes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'

const recipeStore = useRecipeStore()
const newIngredient = ref('')

const commonIngredients = [
  'chicken', 'beef', 'pork', 'fish', 'eggs',
  'rice', 'pasta', 'potato', 'tomato', 'onion',
  'garlic', 'carrot', 'bell pepper', 'broccoli',
  'cheese', 'milk', 'butter', 'oil', 'salt', 'pepper'
]

const perfectMatches = computed(() => {
  return recipeStore.matchedRecipes.filter(r => r.matchPercentage === 100).length
})

const goodMatches = computed(() => {
  return recipeStore.matchedRecipes.filter(r => r.matchPercentage >= 75).length
})

const addIngredient = () => {
  if (newIngredient.value.trim()) {
    recipeStore.addIngredient(newIngredient.value)
    newIngredient.value = ''
  }
}

const quickAdd = (ingredient) => {
  recipeStore.addIngredient(ingredient)
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all ingredients?')) {
    recipeStore.clearIngredients()
  }
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quick-add {
  padding-top: 20px;
  border-top: 2px solid var(--border-color);
}

.quick-add h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.quick-add-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.ingredients-grid {
  display: grid;
  gap: 12px;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.ingredient-item:hover {
  border-color: var(--primary-color);
  transform: translateX(4px);
}

.ingredient-name {
  font-weight: 500;
  text-transform: capitalize;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  transition: transform 0.2s ease;
}

.delete-btn:hover {
  transform: scale(1.2);
}

.suggestions-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.stat-box {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.stat-value {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .quick-add-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>
