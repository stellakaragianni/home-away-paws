export interface Allergy {
  id: string;
  name: string;
}

export interface Dish {
  name: string;
  description?: string;
  isRecommended: boolean;
  allergyMatches: string[];
  ingredients: string[];
}