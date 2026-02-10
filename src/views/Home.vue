<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">🍳 What Should I Cook Today?</h1>
        <p class="hero-subtitle">
          Turn your leftover ingredients into delicious meals. 
          No more food waste, no more last-minute grocery runs.
        </p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">{{ recipeStore.recipes.length }}</span>
            <span class="stat-label">Recipes Available</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ recipeStore.myIngredients.length }}</span>
            <span class="stat-label">Your Ingredients</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ recipeStore.matchedRecipes.length }}</span>
            <span class="stat-label">Matching Recipes</span>
          </div>
        </div>
      </div>
    </section>

    <section class="quick-match">
      <div class="card">
        <h2>🔍 Quick Ingredient Match</h2>
        <p class="mb-3">Add ingredients you have and see what you can cook right now!</p>
        
        <div class="ingredient-input">
          <input
            v-model="newIngredient"
            type="text"
            placeholder="Enter an ingredient (e.g., chicken, tomato, rice)..."
            @keyup.enter="addIngredient"
          />
          <button class="btn btn-primary" @click="addIngredient">
            Add
          </button>
        </div>

        <div v-if="recipeStore.myIngredients.length > 0" class="ingredients-list">
          <h3>Your Ingredients:</h3>
          <div class="ingredients-tags">
            <span
              v-for="ingredient in recipeStore.myIngredients"
              :key="ingredient"
              class="ingredient-tag"
            >
              {{ ingredient }}
              <button @click="recipeStore.removeIngredient(ingredient)" class="remove-btn">
                ×
              </button>
            </span>
          </div>
          <button class="btn btn-danger btn-sm mt-2" @click="recipeStore.clearIngredients">
            Clear All
          </button>
        </div>
      </div>
    </section>

    <section v-if="recipeStore.matchedRecipes.length > 0" class="matched-recipes">
      <h2>✨ You Can Make These Dishes!</h2>
      <div class="grid grid-3">
        <div
          v-for="recipe in recipeStore.matchedRecipes.slice(0, 6)"
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
            <div class="match-badge">
              {{ Math.round(recipe.matchPercentage) }}% Match
            </div>
          </div>
          <div class="recipe-content">
            <h3>{{ recipe.title }}</h3>
            <div class="recipe-meta">
              <span>⏱️ {{ recipe.cookTime || '30 min' }}</span>
              <span>👥 {{ recipe.servings || '4' }} servings</span>
            </div>
            <div class="ingredients-preview">
              <span class="matched">✓ {{ recipe.matchedIngredients.length }} ingredients you have</span>
              <span v-if="recipe.missingIngredients.length > 0" class="missing">
                Missing: {{ recipe.missingIngredients.slice(0, 2).join(', ') }}
                <span v-if="recipe.missingIngredients.length > 2">...</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-3">
        <router-link to="/recipes" class="btn btn-primary">
          View All Matching Recipes
        </router-link>
      </div>
    </section>

    <section v-else-if="recipeStore.myIngredients.length > 0" class="no-matches">
      <div class="card text-center">
        <h3>😔 No Exact Matches Found</h3>
        <p>Try adding more ingredients or browse all recipes to find inspiration!</p>
        <router-link to="/recipes" class="btn btn-primary mt-2">
          Browse All Recipes
        </router-link>
      </div>
    </section>

    <section class="features">
      <h2>How MealMatch Works</h2>
      <div class="grid grid-3">
        <div class="feature-card card">
          <div class="feature-icon">📝</div>
          <h3>1. Add Your Ingredients</h3>
          <p>Select items from your fridge or pantry. Tell us what you have available.</p>
        </div>
        <div class="feature-card card">
          <div class="feature-icon">🎯</div>
          <h3>2. Get Smart Matches</h3>
          <p>Our intelligent algorithm finds recipes that match your available ingredients.</p>
        </div>
        <div class="feature-card card">
          <div class="feature-icon">🍽️</div>
          <h3>3. Cook & Enjoy</h3>
          <p>Follow step-by-step instructions and create delicious meals with zero waste!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'

const recipeStore = useRecipeStore()
const newIngredient = ref('')

onMounted(() => {
  recipeStore.loadIngredients()
})

const addIngredient = () => {
  if (newIngredient.value.trim()) {
    recipeStore.addIngredient(newIngredient.value)
    newIngredient.value = ''
  }
}

const handleImageError = (event) => {
  // Fallback to a default food image if image fails to load
  event.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  border-radius: 16px;
  margin-bottom: 40px;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  margin-bottom: 16px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.95;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.quick-match {
  margin-bottom: 40px;
}

.ingredient-input {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.ingredient-input input {
  flex: 1;
}

.ingredients-list {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.ingredients-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.ingredient-tag {
  background: var(--primary-color);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.remove-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: white;
}

.matched-recipes {
  margin-bottom: 40px;
}

.matched-recipes h2 {
  margin-bottom: 24px;
  font-size: 32px;
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
  height: 200px;
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

.ingredients-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.matched {
  color: var(--success-color);
  font-weight: 500;
}

.missing {
  color: var(--text-secondary);
}

.features {
  margin-top: 60px;
}

.features h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
}

.feature-card {
  text-align: center;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 12px;
}

.no-matches {
  margin: 40px 0;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-stats {
    gap: 30px;
  }

  .ingredient-input {
    flex-direction: column;
  }
}
</style>
