# MealMatch 🍳

A smart meal-suggestion app that helps you decide what to cook based on the ingredients you already have at home. Built with Vue.js 3, the app scrapes recipes from Cookpad.com and intelligently matches them with your available ingredients.

## Features

- ✨ **Smart Ingredient Matching**: Add ingredients from your fridge/pantry and get instant recipe suggestions
- 🔍 **Recipe Scraping**: Scrape recipes directly from Cookpad.com
- 📊 **Match Percentage**: See how well each recipe matches your available ingredients
- 🎯 **Intelligent Filtering**: Filter recipes by match percentage
- 📝 **Step-by-Step Instructions**: View detailed cooking instructions for each recipe
- 💾 **Local Storage**: Your ingredients are saved locally for convenience
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations

## Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Official routing library
- **Pinia** - State management
- **Axios** - HTTP client
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Cheerio** - Web scraping
- **node-fetch** - HTTP client for Node.js

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yasir0722/MealMatch.git
   cd MealMatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

You need to run both the frontend and backend servers:

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```
The API server will run on `http://localhost:3001`

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
The Vue.js app will run on `http://localhost:3000`

### Option 2: Manual Commands

**Backend:**
```bash
node server/index.js
```

**Frontend:**
```bash
npm run dev
```

## Usage

1. **Add Your Ingredients**
   - Go to "My Ingredients" page
   - Add items you have in your fridge or pantry
   - Use the quick-add buttons for common ingredients

2. **Get Recipe Suggestions**
   - Navigate to the Home page
   - See recipes that match your ingredients
   - Recipes are sorted by match percentage

3. **Scrape New Recipes**
   - Go to "Recipes" page
   - Enter a search term (e.g., "chicken curry", "ayam masak merah")
   - Click "Scrape Recipes" to fetch from Cookpad

4. **View Recipe Details**
   - Click on any recipe card
   - See full ingredients list with match indicators
   - Follow step-by-step cooking instructions

## Project Structure

```
MealMatch/
├── src/
│   ├── components/          # Reusable Vue components
│   ├── views/              # Page components
│   │   ├── Home.vue        # Main dashboard
│   │   ├── Ingredients.vue # Ingredient management
│   │   ├── Recipes.vue     # Recipe browsing & scraping
│   │   └── RecipeDetail.vue# Individual recipe view
│   ├── stores/             # Pinia stores
│   │   └── recipeStore.js  # Recipe state management
│   ├── router/             # Vue Router config
│   ├── App.vue             # Root component
│   ├── main.js             # App entry point
│   └── style.css           # Global styles
├── server/
│   ├── index.js            # Express API server
│   ├── scraper.js          # Cookpad scraping logic
│   └── recipes.json        # Recipe database
├── index.html
├── package.json
└── vite.config.js
```

## API Endpoints

- `GET /api/recipes` - Get all scraped recipes
- `POST /api/scrape` - Scrape recipes from Cookpad
  - Body: `{ "searchTerm": "recipe name" }`
- `DELETE /api/recipes/:id` - Delete a recipe by ID

## Features in Detail

### Ingredient Matching Algorithm
The app uses intelligent string matching to compare your ingredients with recipe requirements:
- Partial matches (e.g., "chicken" matches "chicken breast")
- Case-insensitive comparison
- Match percentage calculation
- Missing ingredient detection

### Recipe Scraping
- Scrapes recipe data from Cookpad.com
- Extracts title, image, ingredients, and instructions
- Handles various Cookpad page structures
- Falls back to sample data if scraping fails

### State Management
- Pinia store for centralized state
- Persistent ingredient storage (localStorage)
- Reactive computed properties for matches
- Efficient recipe filtering and sorting

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Troubleshooting

**Issue: Scraping not working**
- Cookpad may have changed their HTML structure
- Check network connectivity
- The app falls back to sample data when scraping fails

**Issue: Recipes not showing**
- Make sure the backend server is running on port 3001
- Check browser console for errors
- Try refreshing the page

**Issue: Ingredients not saving**
- Check if localStorage is enabled in your browser
- Clear browser cache and try again

## Future Enhancements

- [ ] User authentication
- [ ] Save favorite recipes
- [ ] Shopping list generation
- [ ] Nutritional information
- [ ] Meal planning calendar
- [ ] Share recipes with friends
- [ ] Multiple language support
- [ ] Mobile app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Recipe data from [Cookpad.com](https://cookpad.com)
- Built with [Vue.js](https://vuejs.org/)
- Icons from emoji standards

## Contact

For questions or suggestions, please open an issue on GitHub.

---

**Cook Smart, Waste Less! 🍳**
