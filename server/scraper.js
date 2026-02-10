import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { randomUUID } from 'crypto'

/**
 * Scrape recipes from Cookpad
 * @param {string} searchTerm - The search query
 * @returns {Promise<Array>} Array of recipe objects
 */
export async function scrapeRecipes(searchTerm) {
  try {
    console.log(`🔍 Scraping Cookpad for: ${searchTerm}`)

    // Cookpad search URL
    const searchUrl = `https://cookpad.com/search/${encodeURIComponent(searchTerm)}`
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const recipes = []
    const recipeLinks = []

    // Collect recipe URLs from search results
    $('a[href*="/recipes/"]').each((index, element) => {
      if (index >= 10) return false // Limit to 10 recipes
      
      const href = $(element).attr('href')
      if (href && href.includes('/recipes/') && !href.includes('/search')) {
        const fullUrl = href.startsWith('http') ? href : `https://cookpad.com${href}`
        if (!recipeLinks.includes(fullUrl)) {
          recipeLinks.push(fullUrl)
        }
      }
    })

    console.log(`📋 Found ${recipeLinks.length} recipe links`)

    // Scrape each recipe page for detailed information
    for (const recipeUrl of recipeLinks.slice(0, 5)) { // Limit to 5 detailed scrapes
      try {
        const recipe = await scrapeRecipeDetail(recipeUrl)
        if (recipe && recipe.ingredients.length > 0) {
          recipes.push(recipe)
        }
      } catch (error) {
        console.error(`Error scraping ${recipeUrl}:`, error.message)
      }
    }

    console.log(`✅ Successfully scraped ${recipes.length} recipes with ingredients`)
    
    // Return sample data if scraping failed
    if (recipes.length === 0) {
      console.log('No recipes found, generating sample data...')
      return generateSampleRecipes(searchTerm)
    }

    return recipes
  } catch (error) {
    console.error('❌ Scraping error:', error.message)
    // Return sample data on error
    return generateSampleRecipes(searchTerm)
  }
}

/**
 * Scrape detailed recipe information from a recipe page
 * @param {string} recipeUrl - The URL of the recipe page
 * @returns {Promise<Object>} Recipe object with ingredients
 */
async function scrapeRecipeDetail(recipeUrl) {
  console.log(`📖 Scraping recipe details from: ${recipeUrl}`)

  const response = await fetch(recipeUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  // Extract recipe title
  const title = $('h1.recipe-title, h1[class*="title"], .page-title h1, h1').first().text().trim() || 'Untitled Recipe'

  // Extract recipe image - try multiple methods
  let imageUrl = null
  
  // Method 1: Try meta og:image tag
  const ogImage = $('meta[property="og:image"]').attr('content')
  if (ogImage) {
    imageUrl = ogImage
  }
  
  // Method 2: Try main recipe image classes
  if (!imageUrl) {
    imageUrl = $('.recipe-image img, .main-photo img, #main-photo img').first().attr('src')
  }
  
  // Method 3: Try any large image
  if (!imageUrl) {
    $('img').each((i, img) => {
      const src = $(img).attr('src')
      if (src && (src.includes('recipe') || src.includes('image') || src.includes('photo'))) {
        imageUrl = src
        return false // break
      }
    })
  }
  
  // Method 4: Get first substantial image
  if (!imageUrl) {
    imageUrl = $('img').first().attr('src')
  }

  // Extract ingredients (Ramuan)
  const ingredients = []
  
  // Look for ingredient list - Cookpad uses various selectors
  $('.ingredient, .ingredient-list li, [class*="ingredient"] li, .ingredients-list li, [class*="Ingredient"]').each((i, elem) => {
    const text = $(elem).text().trim()
    if (text && text.length > 0 && !text.toLowerCase().includes('ramuan')) {
      // Extract just the ingredient name, remove quantities
      const cleaned = cleanIngredientText(text)
      if (cleaned) {
        ingredients.push(cleaned)
      }
    }
  })

  // Extract instructions
  const instructions = []
  $('.step, .instruction, [class*="step"], [class*="Step"], ol li, .steps li').each((i, elem) => {
    const text = $(elem).text().trim()
    if (text && text.length > 10) { // At least 10 chars for a meaningful instruction
      instructions.push(text)
    }
  })

  // Extract servings
  const servingsText = $('[class*="serving"], [class*="portion"], [class*="Serving"]').first().text()
  const servingsMatch = servingsText.match(/\d+/)
  const servings = servingsMatch ? servingsMatch[0] : '4'

  // Extract cook time
  const cookTimeText = $('[class*="time"], [class*="duration"], [class*="Time"]').first().text()
  const cookTime = cookTimeText.trim() || '30 min'

  // If no ingredients found, try to generate from title
  const finalIngredients = ingredients.length > 0 ? ingredients : generateSampleIngredients(title)

  return {
    id: randomUUID(),
    title: title,
    image: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://cookpad.com${imageUrl}`) : null,
    url: recipeUrl,
    ingredients: finalIngredients,
    instructions: instructions.length > 0 ? instructions : generateSampleInstructions(title),
    cookTime: cookTime,
    servings: servings,
    scrapedAt: new Date().toISOString()
  }
}

/**
 * Clean ingredient text to extract just the ingredient name
 */
function cleanIngredientText(text) {
  // Remove common quantity indicators and measurements
  let cleaned = text
    .replace(/^\d+[\s\/\-]*(cawan|sb|sudu|biji|kg|g|ml|l|cup|tbsp|tsp|oz|lb|piece|pieces)?/gi, '')
    .replace(/\([^)]*\)/g, '') // Remove parentheses content
    .replace(/\d+/g, '') // Remove remaining numbers
    .trim()

  // Only return if there's meaningful text left
  if (cleaned.length > 2) {
    return cleaned
  }
  return null
}

/**
 * Generate sample ingredients based on recipe title
 */
function generateSampleIngredients(title) {
  const commonIngredients = {
    'ayam': ['chicken', 'garlic', 'onion', 'ginger', 'oil', 'salt', 'pepper'],
    'nasi': ['rice', 'water', 'salt', 'oil'],
    'ikan': ['fish', 'lemon', 'garlic', 'salt', 'pepper'],
    'daging': ['beef', 'onion', 'garlic', 'soy sauce', 'pepper'],
    'sayur': ['vegetables', 'garlic', 'oil', 'salt'],
    'sup': ['broth', 'vegetables', 'garlic', 'salt', 'pepper'],
    'goreng': ['oil', 'garlic', 'salt', 'pepper'],
    'masak': ['oil', 'onion', 'garlic', 'spices'],
    'pasta': ['pasta', 'tomato sauce', 'garlic', 'olive oil', 'basil'],
    'salad': ['lettuce', 'tomato', 'cucumber', 'olive oil', 'lemon'],
    'curry': ['curry powder', 'coconut milk', 'onion', 'garlic', 'ginger'],
    'bawang': ['onion', 'flour', 'egg', 'salt', 'oil'],
    'tepung': ['flour', 'water', 'salt', 'baking powder'],
    'cekodok': ['flour', 'banana', 'sugar', 'salt', 'oil']
  }

  const titleLower = title.toLowerCase()
  let ingredients = []

  for (const [keyword, ings] of Object.entries(commonIngredients)) {
    if (titleLower.includes(keyword)) {
      ingredients = [...ingredients, ...ings]
    }
  }

  if (ingredients.length === 0) {
    ingredients = ['main ingredient', 'garlic', 'onion', 'oil', 'salt', 'pepper', 'water']
  }

  return [...new Set(ingredients)] // Remove duplicates
}

/**
 * Generate sample instructions based on recipe title
 */
function generateSampleInstructions(title) {
  return [
    'Prepare all ingredients and wash thoroughly',
    'Heat oil in a pan or wok over medium heat',
    'Add aromatics (garlic, onion, ginger) and sauté until fragrant',
    'Add main ingredients and cook until done',
    'Season with salt, pepper, and other spices to taste',
    'Serve hot with rice or bread'
  ]
}

/**
 * Generate sample recipes when scraping fails
 */
function generateSampleRecipes(searchTerm) {
  // Use Unsplash food images as defaults
  const foodImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', // Cooking
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', // Food prep
    'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop', // Food
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop', // Asian food
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'  // Pizza/food
  ]

  const sampleRecipes = [
    {
      id: randomUUID(),
      title: `${searchTerm} Recipe 1`,
      image: foodImages[0],
      url: `https://cookpad.com/search/${encodeURIComponent(searchTerm)}`,
      ingredients: generateSampleIngredients(searchTerm),
      instructions: generateSampleInstructions(searchTerm),
      cookTime: '30 min',
      servings: '4',
      scrapedAt: new Date().toISOString()
    },
    {
      id: randomUUID(),
      title: `${searchTerm} Recipe 2`,
      image: foodImages[1],
      url: `https://cookpad.com/search/${encodeURIComponent(searchTerm)}`,
      ingredients: generateSampleIngredients(searchTerm),
      instructions: generateSampleInstructions(searchTerm),
      cookTime: '45 min',
      servings: '6',
      scrapedAt: new Date().toISOString()
    },
    {
      id: randomUUID(),
      title: `${searchTerm} Recipe 3`,
      image: foodImages[2],
      url: `https://cookpad.com/search/${encodeURIComponent(searchTerm)}`,
      ingredients: generateSampleIngredients(searchTerm),
      instructions: generateSampleInstructions(searchTerm),
      cookTime: '20 min',
      servings: '2',
      scrapedAt: new Date().toISOString()
    }
  ]

  return sampleRecipes
}

// Allow running scraper standalone
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const searchTerm = process.argv[2] || 'ayam masak merah'
  scrapeRecipes(searchTerm).then(recipes => {
    console.log(JSON.stringify(recipes, null, 2))
  })
}
