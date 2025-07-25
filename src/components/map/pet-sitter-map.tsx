import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data for pet sitters
const mockSitters = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 4.9,
    reviews: 127,
    price: 25,
    distance: "0.8 miles",
    specialties: ["Dogs", "Cats"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    id: 2,
    name: "Mike Chen",
    rating: 4.8,
    reviews: 89,
    price: 30,
    distance: "1.2 miles",
    specialties: ["Dogs", "Birds"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    lat: 40.7589,
    lng: -73.9851,
  },
  {
    id: 3,
    name: "Emma Davis",
    rating: 5.0,
    reviews: 203,
    price: 35,
    distance: "2.1 miles",
    specialties: ["Cats", "Small Animals"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lat: 40.6892,
    lng: -74.0445,
  },
];

export function PetSitterMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedSitter, setSelectedSitter] = useState<typeof mockSitters[0] | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location access denied, using default location");
        }
      );
    }
  }, []);

  const initializeMap = async () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Dynamically import mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      
      // Set the access token
      mapboxgl.default.accessToken = mapboxToken;

      // Initialize map
      const map = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [userLocation.lng, userLocation.lat],
        zoom: 12,
      });

      // Add user location marker
      new mapboxgl.default.Marker({ color: '#3b82f6' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(
          new mapboxgl.default.Popup().setHTML('<div>Your Location</div>')
        )
        .addTo(map);

      // Add pet sitter markers
      mockSitters.forEach((sitter) => {
        const markerElement = document.createElement('div');
        markerElement.className = 'w-10 h-10 bg-secondary rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center';
        markerElement.innerHTML = '🐕';
        markerElement.addEventListener('click', () => setSelectedSitter(sitter));

        new mapboxgl.default.Marker(markerElement)
          .setLngLat([sitter.lng, sitter.lat])
          .addTo(map);
      });

      setShowTokenInput(false);
    } catch (error) {
      console.error('Error loading map:', error);
    }
  };

  if (showTokenInput) {
    return (
      <div className="h-full flex items-center justify-center bg-muted rounded-lg">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enable Map</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Enter your Mapbox public token to view nearby pet sitters on the map.
              Get your token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
            </p>
            <div className="space-y-3">
              <Input
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button 
                onClick={initializeMap}
                disabled={!mapboxToken}
                className="w-full"
              >
                Load Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden shadow-card" />
      
      {selectedSitter && (
        <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <img
                src={selectedSitter.image}
                alt={selectedSitter.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{selectedSitter.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{selectedSitter.rating}</span>
                  <span className="text-sm text-muted-foreground">({selectedSitter.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="w-3 h-3" />
                    ${selectedSitter.price}/day
                  </div>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{selectedSitter.distance}</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {selectedSitter.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-gradient-primary hover:opacity-90"
                  onClick={() => setSelectedSitter(null)}
                >
                  Contact Sitter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}