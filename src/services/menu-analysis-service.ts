import type { Allergy, Dish } from "@/types/allergy";

export class MenuAnalysisService {
  static async analyzeMenu(menuText: string, allergies: Allergy[]): Promise<Dish[]> {
    // Extract dish names from menu text
    const dishNames = this.extractDishNames(menuText);
    
    const dishes: Dish[] = [];
    
    for (const dishName of dishNames) {
      try {
        // Get ingredients for this dish from web search
        const ingredients = await this.getIngredients(dishName);
        
        // Check for allergy matches
        const allergyMatches = this.findAllergyMatches(ingredients, allergies);
        
        dishes.push({
          name: dishName,
          isRecommended: allergyMatches.length === 0,
          allergyMatches,
          ingredients
        });
        
        // Small delay to avoid overwhelming the search API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error analyzing dish ${dishName}:`, error);
        // Add dish with unknown safety status
        dishes.push({
          name: dishName,
          isRecommended: false,
          allergyMatches: ["Unable to verify ingredients"],
          ingredients: []
        });
      }
    }
    
    return dishes;
  }

  private static extractDishNames(menuText: string): string[] {
    // Split menu into lines and extract potential dish names
    const lines = menuText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const dishNames: string[] = [];
    
    for (const line of lines) {
      // Skip obvious non-dish lines (prices, categories, etc.)
      if (this.isLikelyDishName(line)) {
        // Clean up the dish name (remove prices, etc.)
        const cleanName = this.cleanDishName(line);
        if (cleanName) {
          dishNames.push(cleanName);
        }
      }
    }
    
    return dishNames;
  }

  private static isLikelyDishName(line: string): boolean {
    // Skip lines that are clearly not dish names
    const skipPatterns = [
      /^(appetizers|entrees|desserts|beverages|drinks|starters|mains|sides)/i,
      /^(menu|restaurant|cuisine|welcome)/i,
      /^\$[\d.]+$/, // Just a price
      /^[\d.]+$/, // Just numbers
      /^[a-z\s]*$/i // Only lowercase (likely descriptions)
    ];
    
    if (skipPatterns.some(pattern => pattern.test(line))) {
      return false;
    }
    
    // Must have some alphabetic characters and be reasonable length
    return /[a-zA-Z]/.test(line) && line.length >= 3 && line.length <= 100;
  }

  private static cleanDishName(line: string): string {
    // Remove common price patterns and clean up
    let cleaned = line
      .replace(/\$[\d.]+/g, '') // Remove prices
      .replace(/\(\d+\)/g, '') // Remove numbers in parentheses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Remove leading numbers/dots (menu numbering)
    cleaned = cleaned.replace(/^[\d.-]+\s*/, '');
    
    return cleaned;
  }

  private static async getIngredients(dishName: string): Promise<string[]> {
    // For now, use common ingredients based on dish name
    // In production, this would use a recipe API or web search
    return this.getCommonIngredients(dishName);
  }

  private static extractIngredientsFromSearchResults(results: any[]): string[] {
    const allIngredients = new Set<string>();
    
    for (const result of results) {
      const text = (result.text || '').toLowerCase();
      
      // Look for ingredient lists in the text
      const ingredientPatterns = [
        /ingredients?[:\s]*([^.!?]*)/gi,
        /you['\s]*ll need[:\s]*([^.!?]*)/gi,
        /recipe[:\s]*([^.!?]*)/gi
      ];
      
      for (const pattern of ingredientPatterns) {
        const matches = text.match(pattern);
        if (matches) {
          for (const match of matches) {
            const ingredients = this.parseIngredientsFromText(match);
            ingredients.forEach(ing => allIngredients.add(ing));
          }
        }
      }
    }
    
    return Array.from(allIngredients).slice(0, 20); // Limit to 20 ingredients
  }

  private static parseIngredientsFromText(text: string): string[] {
    const commonIngredients = [
      'flour', 'butter', 'milk', 'eggs', 'cheese', 'cream', 'oil', 'onion', 'garlic',
      'salt', 'pepper', 'sugar', 'tomato', 'chicken', 'beef', 'pork', 'fish',
      'nuts', 'peanuts', 'almonds', 'walnuts', 'sesame', 'soy sauce', 'wheat',
      'bread', 'pasta', 'rice', 'beans', 'lentils', 'shellfish', 'shrimp',
      'crab', 'lobster', 'mustard', 'celery', 'herbs', 'spices'
    ];
    
    const found: string[] = [];
    const lowerText = text.toLowerCase();
    
    for (const ingredient of commonIngredients) {
      if (lowerText.includes(ingredient)) {
        found.push(ingredient);
      }
    }
    
    return found;
  }

  private static getCommonIngredients(dishName: string): string[] {
    const lowerDish = dishName.toLowerCase();
    
    // Common ingredients based on dish type
    const ingredientMap: Record<string, string[]> = {
      'pasta': ['wheat', 'flour', 'eggs', 'cheese'],
      'pizza': ['wheat', 'flour', 'cheese', 'tomato'],
      'salad': ['oil', 'vinegar', 'nuts'],
      'soup': ['cream', 'milk', 'celery', 'onion'],
      'chicken': ['chicken', 'herbs', 'spices'],
      'beef': ['beef', 'herbs', 'spices'],
      'fish': ['fish', 'oil', 'herbs'],
      'seafood': ['shellfish', 'fish'],
      'bread': ['wheat', 'flour', 'eggs', 'milk'],
      'cake': ['wheat', 'flour', 'eggs', 'milk', 'butter'],
      'ice cream': ['milk', 'cream', 'eggs'],
      'asian': ['soy sauce', 'sesame', 'peanuts'],
      'sandwich': ['wheat', 'bread', 'cheese']
    };
    
    const ingredients: string[] = [];
    
    for (const [key, ingList] of Object.entries(ingredientMap)) {
      if (lowerDish.includes(key)) {
        ingredients.push(...ingList);
      }
    }
    
    return ingredients.length > 0 ? ingredients : ['unknown ingredients'];
  }

  private static findAllergyMatches(ingredients: string[], allergies: Allergy[]): string[] {
    const matches: string[] = [];
    
    for (const allergy of allergies) {
      const allergyName = allergy.name.toLowerCase();
      
      for (const ingredient of ingredients) {
        const ingredientName = ingredient.toLowerCase();
        
        // Direct match or contains
        if (ingredientName.includes(allergyName) || allergyName.includes(ingredientName)) {
          matches.push(allergy.name);
          break;
        }
        
        // Special cases for common allergens
        if (this.isAllergenMatch(allergyName, ingredientName)) {
          matches.push(allergy.name);
          break;
        }
      }
    }
    
    return [...new Set(matches)]; // Remove duplicates
  }

  private static isAllergenMatch(allergen: string, ingredient: string): boolean {
    const allergenMappings: Record<string, string[]> = {
      'dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
      'nuts': ['almonds', 'walnuts', 'pecans', 'cashews', 'hazelnuts'],
      'shellfish': ['shrimp', 'crab', 'lobster', 'crayfish'],
      'gluten': ['wheat', 'flour', 'bread', 'pasta'],
      'soy': ['soy sauce', 'tofu', 'soybean']
    };
    
    const mappings = allergenMappings[allergen];
    if (mappings) {
      return mappings.some(mapping => ingredient.includes(mapping));
    }
    
    return false;
  }
}