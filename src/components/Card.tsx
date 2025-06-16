import React from "react";
import { Heart, Star, MapPin } from "lucide-react";
import { Listing } from "@/lib/mockData";

interface CardProps {
  listing: Listing;
  currentLanguage: "en" | "fr";
  isWishlisted: boolean;
  onWishlistChange: (listingId: string) => void;
}

const Card: React.FC<CardProps> = ({
  listing,
  currentLanguage,
  isWishlisted,
  onWishlistChange,
}) => {
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistChange(listing.id);
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      restaurant: currentLanguage === "en" ? "Restaurant" : "Restaurant",
      cultural: currentLanguage === "en" ? "Cultural" : "Culturel",
      event: currentLanguage === "en" ? "Event" : "Événement",
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      restaurant:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      cultural:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      event:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={listing.images[0]}
          alt={currentLanguage === "en" ? listing.title : listing.titleFr}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
              listing.category
            )}`}
          >
            {getCategoryLabel(listing.category)}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1">
          {currentLanguage === "en" ? listing.title : listing.titleFr}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {currentLanguage === "en"
              ? listing.location.address
              : listing.location.addressFr}
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="font-medium text-gray-900 dark:text-white">
            {listing.rating}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
            ({listing.reviewCount}{" "}
            {currentLanguage === "en" ? "reviews" : "avis"})
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {currentLanguage === "en"
            ? listing.description
            : listing.descriptionFr}
        </p>

        {/* Price and Host */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={listing.host.avatar}
              alt={listing.host.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {listing.host.name}
            </span>
            {listing.host.verified && (
              <div className="ml-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="font-bold text-accent text-lg">
              {listing.price} MAD
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentLanguage === "en" ? "per person" : "par personne"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
