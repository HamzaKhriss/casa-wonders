import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Listing } from "@/lib/mockData";
import { Star, MapPin } from "lucide-react";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create custom marker icons for different categories
const createCustomIcon = (category: string) => {
  const colors = {
    restaurant: "#3B82F6", // Blue
    event: "#8B5CF6", // Purple
    cultural: "#10B981", // Green
  };

  const color = colors[category as keyof typeof colors] || "#6B7280";

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MapViewProps {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
  selectedListing?: Listing | null;
  center?: [number, number];
  zoom?: number;
  height?: string;
  currentLanguage?: "en" | "fr";
}

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
  selectedListing?: Listing | null;
}

// Component to update map center and zoom
const MapUpdater: React.FC<MapUpdaterProps> = ({
  center,
  zoom,
  selectedListing,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedListing) {
      map.setView(
        [selectedListing.location.lat, selectedListing.location.lng],
        15,
        {
          animate: true,
          duration: 1,
        }
      );
    } else {
      map.setView(center, zoom, {
        animate: true,
        duration: 1,
      });
    }
  }, [map, center, zoom, selectedListing]);

  return null;
};

const MapViewClient: React.FC<MapViewProps> = ({
  listings,
  onListingClick,
  selectedListing,
  center = [33.5892, -7.6125], // Casablanca center
  zoom = 12,
  height = "400px",
  currentLanguage = "en",
}) => {
  const getCategoryLabel = (category: string) => {
    const labels = {
      restaurant: { en: "Restaurant", fr: "Restaurant" },
      event: { en: "Event", fr: "Événement" },
      cultural: { en: "Cultural", fr: "Culturel" },
    };
    return (
      labels[category as keyof typeof labels]?.[currentLanguage] || category
    );
  };

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapUpdater
          center={center}
          zoom={zoom}
          selectedListing={selectedListing}
        />

        {listings.map((listing) => {
          const title =
            currentLanguage === "en" ? listing.title : listing.titleFr;
          const address =
            currentLanguage === "en"
              ? listing.location.address
              : listing.location.addressFr;

          return (
            <Marker
              key={listing.id}
              position={[listing.location.lat, listing.location.lng]}
              icon={createCustomIcon(listing.category)}
              eventHandlers={{
                click: () => onListingClick?.(listing),
              }}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-2">
                  {/* Image */}
                  <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          listing.category === "restaurant"
                            ? "bg-blue-100 text-blue-800"
                            : listing.category === "event"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {getCategoryLabel(listing.category)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {title}
                    </h3>

                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {listing.rating} ({listing.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs line-clamp-1">{address}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-accent">
                        {listing.price} MAD
                      </span>
                      <button
                        onClick={() => onListingClick?.(listing)}
                        className="px-3 py-1 bg-accent text-white text-xs rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        {currentLanguage === "en"
                          ? "View Details"
                          : "Voir Détails"}
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <button
          onClick={() => {
            // Reset to default view
            const mapElement = document.querySelector(".leaflet-container");
            if (mapElement) {
              const map = (mapElement as any)._leaflet_map;
              map.setView(center, zoom);
            }
          }}
          className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={
            currentLanguage === "en" ? "Reset View" : "Réinitialiser la Vue"
          }
        >
          <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Selected Listing Indicator */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <img
                src={selectedListing.images[0]}
                alt={
                  currentLanguage === "en"
                    ? selectedListing.title
                    : selectedListing.titleFr
                }
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                  {currentLanguage === "en"
                    ? selectedListing.title
                    : selectedListing.titleFr}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  {currentLanguage === "en"
                    ? selectedListing.location.address
                    : selectedListing.location.addressFr}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-accent text-sm">
                  {selectedListing.price} MAD
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedListing.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewClient;
