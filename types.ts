export interface Ingredient {
  name: string;
  quantity: string;
  type: 'protein' | 'grain' | 'vegetable' | 'fruit' | 'dairy' | 'spice' | 'other';
}

export interface Substitution {
  original: string;
  substitute: string;
  reason: string;
}

export interface Recipe {
  dishName: string;
  description: string;
  cuisineType: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  caloriesPerServing: number;
  ingredients: Ingredient[];
  steps: string[];
  healthAnalysis: {
    score: number; // 1-10
    summary: string;
    pros: string[];
    cons: string[];
  };
  substitutions: Substitution[];
}

export interface GenerateRecipeParams {
  ingredients: string[];
  servings: number;
  allergies?: string[];
}