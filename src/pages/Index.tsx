import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { HeroSection } from "@/components/hero/hero-section"
import { PetSitterMap } from "@/components/map/pet-sitter-map"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center px-6 bg-white/50 backdrop-blur-sm">
            <SidebarTrigger />
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-8">
              {/* Hero Section */}
              <section className="mb-12">
                <HeroSection />
              </section>

              {/* Map Section */}
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Pet Sitters Near You</h2>
                  <p className="text-muted-foreground">
                    Explore verified pet sitters in your area. Click on map markers to see detailed profiles.
                  </p>
                </div>
                <div className="h-[500px] lg:h-[600px]">
                  <PetSitterMap />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
