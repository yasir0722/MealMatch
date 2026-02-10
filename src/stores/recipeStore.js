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
    // Load recipes from server (or localStorage for static deployment)
    async loadRecipes() {
      this.loading = true
      this.error = null

      try {
        // Try to get from backend API
        const response = await axios.get('/api/recipes')
        this.recipes = response.data
      } catch (error) {
        // Fallback: Load from localStorage or use sample recipes
        console.log('Backend unavailable, using local/sample recipes')
        const localRecipes = localStorage.getItem('recipes')
        if (localRecipes) {
          this.recipes = JSON.parse(localRecipes)
        } else {
          // Load sample recipes for demo
          this.recipes = this.getSampleRecipes()
        }
      } finally {
        this.loading = false
      }
    },

    // Scrape new recipes (with fallback for static deployment)
    async scrapeRecipes(searchTerm) {
      this.loading = true
      this.error = null

      try {
        // Try backend API
        const response = await axios.post('/api/scrape', { searchTerm })
        this.recipes = [...this.recipes, ...response.data]
        this.saveRecipesToLocal()
        return response.data
      } catch (error) {
        // Fallback: Generate sample recipes for demo
        console.log('Backend unavailable, generating sample recipes for:', searchTerm)
        const sampleRecipes = this.generateSampleRecipes(searchTerm)
        this.recipes = [...this.recipes, ...sampleRecipes]
        this.saveRecipesToLocal()
        return sampleRecipes
      } finally {
        this.loading = false
      }
    },

    // Save recipes to localStorage
    saveRecipesToLocal() {
      localStorage.setItem('recipes', JSON.stringify(this.recipes))
    },

    // Generate sample recipes based on search term
    generateSampleRecipes(searchTerm) {
      const recipes = []
      const foodImages = [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
      ]

      const ingredientSets = {
        'ayam': ['chicken', 'garlic', 'onion', 'ginger', 'oil', 'salt', 'pepper', 'soy sauce'],
        'bawang': ['onion', 'flour', 'egg', 'salt', 'oil', 'sugar', 'baking powder', 'water'],
        'nasi': ['rice', 'water', 'salt', 'oil', 'garlic', 'egg', 'vegetables'],
        'ikan': ['fish', 'lemon', 'garlic', 'salt', 'pepper', 'butter', 'herbs'],
        'merah': ['chili', 'tomato', 'garlic', 'onion', 'oil', 'salt', 'pepper'],
        'default': ['main ingredient', 'garlic', 'onion', 'oil', 'salt', 'pepper', 'water']
      }

      const ingredients = ingredientSets[searchTerm.toLowerCase()] || ingredientSets['default']

      for (let i = 1; i <= 3; i++) {
        recipes.push({
          id: `${searchTerm}-${Date.now()}-${i}`,
          title: `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Recipe ${i}`,
          image: foodImages[i - 1],
          url: `https://cookpad.com/search/${encodeURIComponent(searchTerm)}`,
          ingredients: [...ingredients],
          instructions: [
            'Prepare all ingredients and wash thoroughly',
            'Heat oil in a pan over medium heat',
            'Add aromatics (garlic, onion) and sauté until fragrant',
            'Add main ingredients and cook until done',
            'Season with salt and pepper to taste',
            'Serve hot with rice or your choice of side'
          ],
          cookTime: `${15 + i * 10} min`,
          servings: `${2 + i}`,
          scrapedAt: new Date().toISOString()
        })
      }

      return recipes
    },

    // Get sample recipes for initial load
    getSampleRecipes() {
      return [
        {
          id: 'sample-1',
          title: 'Ayam Goreng Berempah',
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
          url: 'https://cookpad.com',
          ingredients: ['chicken', 'garlic', 'ginger', 'turmeric', 'oil', 'salt', 'pepper'],
          instructions: [
            'Marinate chicken with spices',
            'Heat oil in pan',
            'Fry chicken until golden brown',
            'Drain excess oil',
            'Serve hot with rice'
          ],
          cookTime: '30 min',
          servings: '4',
          scrapedAt: new Date().toISOString()
        },
        {
          id: 'sample-2',
          title: 'Nasi Goreng Kampung',
          image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
          url: 'https://cookpad.com',
          ingredients: ['rice', 'egg', 'garlic', 'onion', 'anchovies', 'vegetables', 'oil', 'soy sauce'],
          instructions: [
            'Use day-old rice for best results',
            'Heat oil and scramble eggs',
            'Add garlic, onion, and anchovies',
            'Add rice and vegetables',
            'Season with soy sauce and serve'
          ],
          cookTime: '20 min',
          servings: '3',
          scrapedAt: new Date().toISOString()
        },
        {
          id: 'sample-3',
          title: 'Ikan Bakar Sambal',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
          url: 'https://cookpad.com',
          ingredients: ['fish', 'chili', 'garlic', 'lime', 'salt', 'oil'],
          instructions: [
            'Clean and season fish',
            'Make sambal sauce',
            'Grill fish until cooked',
            'Apply sambal while grilling',
            'Serve with lime wedges'
          ],
          cookTime: '25 min',
          servings: '2',
          scrapedAt: new Date().toISOString()
        }
      ]
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
