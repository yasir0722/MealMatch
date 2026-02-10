import { defineStore } from 'pinia'
import axios from 'axios'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [],
    myIngredients: [],
    loading: false,
    error: null
  }),

  getters: {
    // Get recipes that can be made with available ingredients
    matchedRecipes(state) {
      if (state.myIngredients.length === 0) {
        return state.recipes
      }

      return state.recipes
        .map(recipe => {
          const matchedIngredients = recipe.ingredients.filter(ingredient =>
            state.myIngredients.some(myIng =>
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
        .filter(recipe => recipe.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
    },

    // Get recipe by ID
    getRecipeById: (state) => (id) => {
      return state.recipes.find(recipe => recipe.id === id)
    }
  },

  actions: {
    // Load recipes from server
    async loadRecipes() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('/api/recipes')
        this.recipes = response.data
      } catch (error) {
        this.error = 'Failed to load recipes. Please try again.'
        console.error('Error loading recipes:', error)
      } finally {
        this.loading = false
      }
    },

    // Scrape new recipes
    async scrapeRecipes(searchTerm) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post('/api/scrape', { searchTerm })
        this.recipes = [...this.recipes, ...response.data]
        return response.data
      } catch (error) {
        this.error = 'Failed to scrape recipes. Please try again.'
        console.error('Error scraping recipes:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Add ingredient to my list
    addIngredient(ingredient) {
      const cleaned = ingredient.trim().toLowerCase()
      if (cleaned && !this.myIngredients.includes(cleaned)) {
        this.myIngredients.push(cleaned)
        this.saveIngredients()
      }
    },

    // Remove ingredient from my list
    removeIngredient(ingredient) {
      this.myIngredients = this.myIngredients.filter(ing => ing !== ingredient)
      this.saveIngredients()
    },

    // Clear all ingredients
    clearIngredients() {
      this.myIngredients = []
      this.saveIngredients()
    },

    // Save ingredients to localStorage
    saveIngredients() {
      localStorage.setItem('myIngredients', JSON.stringify(this.myIngredients))
    },

    // Load ingredients from localStorage
    loadIngredients() {
      const saved = localStorage.getItem('myIngredients')
      if (saved) {
        this.myIngredients = JSON.parse(saved)
      }
    }
  }
})
