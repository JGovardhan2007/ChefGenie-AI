import React, { useState, useRef } from 'react';
import { ChefHat, Wand2, Loader2, UtensilsCrossed, PlusCircle } from 'lucide-react';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { generateRecipe, generateDishImage } from './services/geminiService';
import { Recipe } from './types';

// Pre-defined common categories from the logic
const QUICK_ADD_CATEGORIES = {
  "Proteins": ["egg", "chicken", "fish", "beans", "tofu", "lentils", "paneer"],
  "Grains": ["rice", "oats", "pasta", "bread", "quinoa", "corn", "millet"],
  "Vegetables": ["tomato", "onion", "spinach", "carrot", "broccoli", "peas", "capsicum", "cabbage"],
  "Fruits": ["banana", "apple", "mango", "berries", "orange"],
  "Dairy": ["milk", "yogurt", "cheese", "butter"],
  "Essentials": ["olive oil", "garlic", "ginger", "lemon", "honey", "turmeric"]
};

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [servings, setServings] = useState<number>(2);
  const [activeCategory, setActiveCategory] = useState<string>("Proteins");
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient!");
      return;
    }
    
    setError(null);
    setLoading(true);
    setRecipe(null);
    setRecipeImage(null);

    try {
      // 1. Generate Text Recipe
      const generatedRecipe = await generateRecipe({
        ingredients,
        servings,
        allergies
      });
      
      setRecipe(generatedRecipe);

      // Scroll to results slightly before image loads
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // 2. Generate Image (Parallel or subsequent)
      const image = await generateDishImage(generatedRecipe.dishName);
      setRecipeImage(image);

    } catch (err: any) {
      console.error(err);
      // Attempt to parse error message if it's a JSON string (common with Gemini SDK errors)
      let errorMessage = err.message || "Something went wrong while cooking up your recipe. Please try again.";
      
      try {
        // Find the start of JSON object if present (handles "Error: {...}")
        const jsonStart = errorMessage.indexOf('{');
        if (jsonStart !== -1) {
            const potentialJson = errorMessage.substring(jsonStart);
            const parsedError = JSON.parse(potentialJson);
            if (parsedError.error && parsedError.error.message) {
                errorMessage = parsedError.error.message;
            } else if (parsedError.message) {
                errorMessage = parsedError.message;
            }
        }
      } catch (e) {
        // If parsing fails, stick to the original message, just trimmed
        errorMessage = errorMessage.replace(/^Error:\s*/, '');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const quickAddIngredient = (item: string) => {
    if (!ingredients.includes(item)) {
      setIngredients([...ingredients, item]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-orange-600">
            <ChefHat size={28} />
            <h1 className="text-xl font-bold tracking-tight">ChefGenie AI</h1>
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            Ultimate Recipe Generator
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Left Column: Inputs */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                <UtensilsCrossed size={20} className="mr-2 text-orange-500" />
                Your Kitchen
              </h2>
              
              <IngredientInput
                label="Available Ingredients"
                placeholder="e.g., chicken, rice..."
                ingredients={ingredients}
                setIngredients={setIngredients}
              />

              {/* Quick Add Section with Tabs */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Quick Add
                </label>
                
                {/* Category Tabs */}
                <div className="flex flex-wrap pb-1 mb-2 gap-2">
                  {Object.keys(QUICK_ADD_CATEGORIES).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                        activeCategory === category
                          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Items Grid for Active Category */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {QUICK_ADD_CATEGORIES[activeCategory as keyof typeof QUICK_ADD_CATEGORIES].map((item) => (
                      <button
                        key={item}
                        onClick={() => quickAddIngredient(item)}
                        disabled={ingredients.includes(item)}
                        className={`h-8 px-3 rounded-md border text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap
                          ${ingredients.includes(item) 
                            ? 'bg-orange-100 border-orange-200 text-orange-700 opacity-60 cursor-default' 
                            : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-white hover:shadow-sm text-gray-700'
                          }`}
                      >
                         {!ingredients.includes(item) && <PlusCircle size={14} className="text-orange-400" />}
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="my-6 border-t border-gray-100"></div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Servings</label>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{servings} people</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <IngredientInput
                label="Dietary Restrictions"
                placeholder="e.g., peanuts, gluten..."
                ingredients={allergies}
                setIngredients={setAllergies}
              />

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4 flex items-start animate-fadeIn">
                  <span className="mr-2 mt-0.5 shrink-0">⚠️</span> 
                  <span className="break-words">{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5 flex justify-center items-center
                  ${loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-200'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Cooking...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2" size={20} />
                    Generate Recipe
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="md:col-span-7 min-h-[300px] md:min-h-[500px]" ref={resultsRef}>
            {!recipe && !loading && (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 md:p-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <ChefHat size={40} className="text-orange-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Ready to cook?</h3>
                <p className="max-w-md text-gray-500 text-sm md:text-base">
                  Select your ingredients from the tabs on the left or type them in. ChefGenie will create a perfect meal using what you have.
                </p>
              </div>
            )}

            {loading && !recipe && (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <ChefHat size={24} className="text-orange-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 animate-pulse">Creating your menu...</h3>
                <p className="text-gray-500 mt-2 max-w-xs mx-auto">Analyzing ingredients, checking flavor pairings, and calculating health scores.</p>
              </div>
            )}

            {recipe && (
              <RecipeCard recipe={recipe} imageUrl={recipeImage} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;