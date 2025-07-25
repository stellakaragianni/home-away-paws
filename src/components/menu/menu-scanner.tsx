import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuAnalysisService } from "@/services/menu-analysis-service";
import type { Allergy, Dish } from "@/types/allergy";

interface MenuScannerProps {
  allergies: Allergy[];
  onAnalysisComplete: (dishes: Dish[]) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const MenuScanner = ({ allergies, onAnalysisComplete, setIsAnalyzing }: MenuScannerProps) => {
  const [menuText, setMenuText] = useState("");
  const [isAnalyzing, setLocalAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeMenu = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "No menu text",
        description: "Please enter or upload menu text first",
        variant: "destructive"
      });
      return;
    }

    setLocalAnalyzing(true);
    setIsAnalyzing(true);
    
    try {
      const dishes = await MenuAnalysisService.analyzeMenu(text, allergies);
      onAnalysisComplete(dishes);
      
      toast({
        title: "Analysis complete",
        description: `Analyzed ${dishes.length} dishes from the menu`
      });
    } catch (error) {
      console.error("Error analyzing menu:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the menu. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLocalAnalyzing(false);
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      toast({
        title: "Image upload",
        description: "Image OCR is not yet implemented. Please type the menu text manually for now.",
        variant: "destructive"
      });
      return;
    }

    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setMenuText(text);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Unsupported file",
        description: "Please upload a text file or image",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Type Menu
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <Textarea
            placeholder="Paste or type the menu text here..."
            value={menuText}
            onChange={(e) => setMenuText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-2">Upload menu file</p>
            <p className="text-sm text-muted-foreground mb-4">
              Support for text files. Image OCR coming soon.
            </p>
            <input
              type="file"
              accept=".txt,image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>
          
          {menuText && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Loaded menu text:</p>
              <Textarea
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Button
        onClick={() => analyzeMenu(menuText)}
        disabled={isAnalyzing || !menuText.trim()}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing Menu...
          </>
        ) : (
          "Analyze Menu for Allergies"
        )}
      </Button>
    </div>
  );
};