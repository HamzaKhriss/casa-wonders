import React from "react";
import dynamic from "next/dynamic";
import { Listing } from "@/lib/mockData";

interface MapViewProps {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
  selectedListing?: Listing | null;
  center?: [number, number];
  zoom?: number;
  height?: string;
  currentLanguage?: "en" | "fr";
}

// Create a loading component
const MapLoading: React.FC<{
  height: string;
  currentLanguage: "en" | "fr";
}> = ({ height, currentLanguage }) => (
  <div
    className="bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
    style={{ height }}
  >
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
      <div className="text-gray-500 dark:text-gray-400">
        {currentLanguage === "en"
          ? "Loading map..."
          : "Chargement de la carte..."}
      </div>
    </div>
  </div>
);

// Dynamic import of the actual map component with SSR disabled
const DynamicMap = dynamic(() => import("./MapViewClient"), {
  ssr: false,
  loading: ({ currentLanguage, height }: any) => (
    <MapLoading
      height={height || "400px"}
      currentLanguage={currentLanguage || "en"}
    />
  ),
});

const MapView: React.FC<MapViewProps> = (props) => {
  return <DynamicMap {...props} />;
};

export default MapView;
