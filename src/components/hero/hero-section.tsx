import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { Search, Shield, Heart, Users } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative">
      {/* Hero Content */}
      <div className="relative z-10 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted Pet Care Network</span>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Find trusted 
            <span className="bg-gradient-hero bg-clip-text text-transparent"> pet sitters </span>
            in your neighborhood
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Going out of town? Connect with verified, loving pet sitters near you. 
            Your furry family members deserve the best care while you're away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <AuthDialog>
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-soft">
                <Search className="w-5 h-5 mr-2" />
                Find Pet Sitters
              </Button>
            </AuthDialog>
            <AuthDialog>
              <Button size="lg" variant="outline" className="border-2 hover:bg-accent">
                Become a Sitter
              </Button>
            </AuthDialog>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Verified Sitters</h3>
              <p className="text-sm text-muted-foreground">Background checked & insured</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-1">Loving Care</h3>
              <p className="text-sm text-muted-foreground">Personalized attention for your pet</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-1">Trusted Community</h3>
              <p className="text-sm text-muted-foreground">Reviews from real pet owners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 rounded-3xl" />
    </div>
  )
}