import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { Allergy } from "@/types/allergy";

interface AllergyInputProps {
  allergies: Allergy[];
  setAllergies: (allergies: Allergy[]) => void;
}

const commonAllergies = [
  "Nuts", "Peanuts", "Dairy", "Eggs", "Soy", "Wheat", "Gluten", 
  "Shellfish", "Fish", "Sesame", "Mustard", "Celery"
];

export const AllergyInput = ({ allergies, setAllergies }: AllergyInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const addAllergy = (allergyName: string) => {
    const trimmed = allergyName.trim();
    if (!trimmed) return;
    
    if (allergies.some(a => a.name.toLowerCase() === trimmed.toLowerCase())) {
      toast({
        title: "Already added",
        description: "This allergy is already in your list",
        variant: "destructive"
      });
      return;
    }

    const newAllergy: Allergy = {
      id: Date.now().toString(),
      name: trimmed
    };

    setAllergies([...allergies, newAllergy]);
    setInputValue("");
    
    toast({
      title: "Allergy added",
      description: `Added ${trimmed} to your allergy list`
    });
  };

  const removeAllergy = (id: string) => {
    setAllergies(allergies.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAllergy(inputValue);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Enter an allergy (e.g., peanuts, dairy)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {/* Common allergies */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Quick add common allergies:</p>
        <div className="flex flex-wrap gap-2">
          {commonAllergies.map((allergy) => (
            <Button
              key={allergy}
              variant="outline"
              size="sm"
              onClick={() => addAllergy(allergy)}
              disabled={allergies.some(a => a.name.toLowerCase() === allergy.toLowerCase())}
            >
              {allergy}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected allergies */}
      {allergies.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Your allergies:</p>
          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy) => (
              <Badge key={allergy.id} variant="secondary" className="px-3 py-1">
                {allergy.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0 hover:bg-transparent"
                  onClick={() => removeAllergy(allergy.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};