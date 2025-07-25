import { useState } from "react";
import { AllergyInput } from "@/components/allergy/allergy-input";
import { MenuScanner } from "@/components/menu/menu-scanner";
import { DishAnalysis } from "@/components/analysis/dish-analysis";
import { Card } from "@/components/ui/card";
import type { Allergy, Dish } from "@/types/allergy";

const Index = () => {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [analyzedDishes, setAnalyzedDishes] = useState<Dish[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            AllergyGuard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Safe dining made simple. Input your allergies, scan any menu, and get instant recommendations on what to avoid.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* Step 1: Allergy Input */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 1: Your Allergies</h2>
            <AllergyInput allergies={allergies} setAllergies={setAllergies} />
          </Card>

          {/* Step 2: Menu Scanner */}
          {allergies.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Step 2: Scan Menu</h2>
              <MenuScanner 
                allergies={allergies}
                onAnalysisComplete={setAnalyzedDishes}
                setIsAnalyzing={setIsAnalyzing}
              />
            </Card>
          )}

          {/* Step 3: Results */}
          {analyzedDishes.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Step 3: Recommendations</h2>
              <DishAnalysis dishes={analyzedDishes} isAnalyzing={isAnalyzing} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
