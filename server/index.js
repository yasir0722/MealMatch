import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Path to store recipes
const RECIPES_FILE = path.join(__dirname, 'recipes.json')

// Initialize recipes file if it doesn't exist
if (!fs.existsSync(RECIPES_FILE)) {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify([]))
}

// Helper function to read recipes
const readRecipes = () => {
  try {
    const data = fs.readFileSync(RECIPES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading recipes:', error)
    return []
  }
}

// Helper function to write recipes
const writeRecipes = (recipes) => {
  try {
    fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2))
  } catch (error) {
    console.error('Error writing recipes:', error)
  }
}

// GET all recipes
app.get('/api/recipes', (req, res) => {
  const recipes = readRecipes()
  res.json(recipes)
})

// POST scrape new recipes
app.post('/api/scrape', async (req, res) => {
  try {
    const { searchTerm } = req.body

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' })
    }

    // Dynamic import of scraper
    const { scrapeRecipes } = await import('./scraper.js')
    const newRecipes = await scrapeRecipes(searchTerm)

    // Load existing recipes
    const existingRecipes = readRecipes()

    // Add new recipes (avoid duplicates by URL)
    const existingUrls = new Set(existingRecipes.map(r => r.url))
    const uniqueNewRecipes = newRecipes.filter(r => !existingUrls.has(r.url))

    const updatedRecipes = [...existingRecipes, ...uniqueNewRecipes]
    writeRecipes(updatedRecipes)

    res.json(uniqueNewRecipes)
  } catch (error) {
    console.error('Scraping error:', error)
    res.status(500).json({ error: 'Failed to scrape recipes' })
  }
})

// DELETE recipe by ID
app.delete('/api/recipes/:id', (req, res) => {
  const recipes = readRecipes()
  const filteredRecipes = recipes.filter(r => r.id !== req.params.id)
  writeRecipes(filteredRecipes)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`🚀 MealMatch API server running on http://localhost:${PORT}`)
})
