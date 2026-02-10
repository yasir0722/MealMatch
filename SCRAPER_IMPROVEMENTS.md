# MealMatch Scraper Improvements

## What's Changed

### 1. **Deep Recipe Scraping**
   - Previously: Only scraped search results page (limited info)
   - Now: Visits each recipe's individual page for complete details
   
### 2. **Actual Ingredient Extraction (Ramuan)**
   - Extracts the real ingredient list from each recipe
   - Parses ingredients like:
     ```
     3 cawan Tepung gandum → "Tepung gandum"
     2 sb tepung beras → "tepung beras"
     1 biji Bawang besar → "Bawang besar"
     ```

### 3. **Smart Cleaning**
   - Removes quantities (numbers, measurements: cawan, sb, sudu, biji, kg, g, etc.)
   - Keeps the actual ingredient name
   - Removes parentheses content

### 4. **Better Matching**
   - Your ingredients: ["tepung", "bawang", "telur"]
   - Recipe ingredients: ["Tepung gandum", "Bawang besar", "telur", "garam"]
   - Match: 3/4 = 75% match!

## Example Scraping Flow

```
Search Term: "bawang"
↓
Find recipe links on search page
↓
Visit each recipe page (up to 5 recipes)
↓
Extract:
  - Title: "Cekodok Manis Bawang Holland"
  - Ingredients: ["Tepung gandum", "tepung beras", "Bawang besar", "telur", "Garam", "gula perang", "baking powder", "soda bikarbonat", "Minyak masak"]
  - Instructions: Step by step cooking methods
  - Image, cook time, servings
↓
Save to database
```

## Testing

To test the scraper directly:
```bash
node server/scraper.js "bawang"
```

Or use the app:
1. Go to Recipes page
2. Enter "bawang" in search
3. Click "Scrape Recipes"
4. Wait for results
5. View recipes with actual ingredients!

## Matching Example

If you have in your fridge:
- tepung
- bawang
- telur
- gula

And a recipe requires:
- Tepung gandum
- Bawang besar
- telur
- garam
- minyak

**Match Result: 60% (3 out of 5 ingredients you have)**
**Missing: garam, minyak**

The app will show you this match percentage and what you're missing!
