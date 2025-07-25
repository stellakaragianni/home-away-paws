import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Dish } from "@/types/allergy";

interface DishAnalysisProps {
  dishes: Dish[];
  isAnalyzing: boolean;
}

export const DishAnalysis = ({ dishes, isAnalyzing }: DishAnalysisProps) => {
  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <span className="text-lg">Analyzing menu items...</span>
      </div>
    );
  }

  const safeDishes = dishes.filter(dish => dish.isRecommended);
  const unsafeDishes = dishes.filter(dish => !dish.isRecommended);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <span className="font-semibold">{safeDishes.length} dishes</span> appear safe for you
          </AlertDescription>
        </Alert>
        
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <span className="font-semibold">{unsafeDishes.length} dishes</span> may contain allergens
          </AlertDescription>
        </Alert>
      </div>

      {/* Unsafe dishes */}
      {unsafeDishes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Dishes to Avoid
          </h3>
          <div className="grid gap-4">
            {unsafeDishes.map((dish, index) => (
              <Card key={index} className="p-4 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{dish.name}</h4>
                  {dish.description && (
                    <p className="text-muted-foreground text-sm">{dish.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-600">
                      Potential allergens detected:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dish.allergyMatches.map((allergen, i) => (
                        <Badge key={i} variant="destructive">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {dish.ingredients.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Common ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {dish.ingredients.slice(0, 8).map((ingredient, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                        {dish.ingredients.length > 8 && (
                          <Badge variant="outline" className="text-xs">
                            +{dish.ingredients.length - 8} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Safe dishes */}
      {safeDishes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recommended Dishes
          </h3>
          <div className="grid gap-4">
            {safeDishes.map((dish, index) => (
              <Card key={index} className="p-4 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{dish.name}</h4>
                  {dish.description && (
                    <p className="text-muted-foreground text-sm">{dish.description}</p>
                  )}
                  
                  {dish.ingredients.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Common ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {dish.ingredients.slice(0, 8).map((ingredient, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                        {dish.ingredients.length > 8 && (
                          <Badge variant="outline" className="text-xs">
                            +{dish.ingredients.length - 8} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This analysis is based on common ingredients found in online recipes. Always inform restaurant staff about your allergies and ask about specific ingredients before ordering.
        </AlertDescription>
      </Alert>
    </div>
  );
};