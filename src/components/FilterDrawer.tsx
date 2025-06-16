import React, { useState, useEffect } from "react";
import {
  X,
  Filter,
  DollarSign,
  Star,
  Calendar,
  MapPin,
  Utensils,
  Music,
  Palette,
} from "lucide-react";
import { ListingFilters } from "@/lib/api";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ListingFilters) => void;
  currentFilters: ListingFilters;
  currentLanguage?: "en" | "fr";
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  currentLanguage = "en",
}) => {
  const [filters, setFilters] = useState<ListingFilters>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const categories = [
    {
      id: "restaurant",
      name: { en: "Restaurants", fr: "Restaurants" },
      icon: Utensils,
      color: "blue",
    },
    {
      id: "event",
      name: { en: "Events", fr: "Événements" },
      icon: Music,
      color: "purple",
    },
    {
      id: "cultural",
      name: { en: "Cultural", fr: "Culturel" },
      icon: Palette,
      color: "green",
    },
  ];

  const priceRanges = [
    {
      min: 0,
      max: 100,
      label: { en: "Under 100 MAD", fr: "Moins de 100 MAD" },
    },
    { min: 100, max: 200, label: { en: "100-200 MAD", fr: "100-200 MAD" } },
    { min: 200, max: 300, label: { en: "200-300 MAD", fr: "200-300 MAD" } },
    { min: 300, max: 500, label: { en: "300-500 MAD", fr: "300-500 MAD" } },
    {
      min: 500,
      max: undefined,
      label: { en: "Over 500 MAD", fr: "Plus de 500 MAD" },
    },
  ];

  const ratingOptions = [
    { value: 4.5, label: { en: "4.5+ Stars", fr: "4.5+ Étoiles" } },
    { value: 4.0, label: { en: "4.0+ Stars", fr: "4.0+ Étoiles" } },
    { value: 3.5, label: { en: "3.5+ Stars", fr: "3.5+ Étoiles" } },
    { value: 3.0, label: { en: "3.0+ Stars", fr: "3.0+ Étoiles" } },
  ];

  const handleCategoryChange = (
    category: "restaurant" | "event" | "cultural"
  ) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  };

  const handlePriceRangeChange = (min: number, max?: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? undefined : rating,
    }));
  };

  const handleDateChange = (date: string) => {
    setFilters((prev) => ({
      ...prev,
      date: date || undefined,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: ListingFilters = {};
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      count++;
    if (filters.minRating) count++;
    if (filters.date) count++;
    if (filters.location) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[10000] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 z-[10001] transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } rounded-t-2xl shadow-2xl`}
      >
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentLanguage === "en" ? "Filters" : "Filtres"}
              </h2>
              {activeFiltersCount > 0 && (
                <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en" ? "Category" : "Catégorie"}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = filters.category === category.id;
                  const colorClasses = {
                    blue: isSelected
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300",
                    purple: isSelected
                      ? "bg-purple-100 border-purple-500 text-purple-700"
                      : "border-gray-200 text-gray-600 hover:border-purple-300",
                    green: isSelected
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "border-gray-200 text-gray-600 hover:border-green-300",
                  };

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id as any)}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        colorClasses[
                          category.color as keyof typeof colorClasses
                        ]
                      } dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-xs font-medium block">
                        {category.name[currentLanguage]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en" ? "Price Range" : "Gamme de Prix"}
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range, index) => {
                  const isSelected =
                    filters.minPrice === range.min &&
                    filters.maxPrice === range.max;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        handlePriceRangeChange(range.min, range.max)
                      }
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-accent/10 border-accent text-accent"
                          : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {range.label[currentLanguage]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en" ? "Minimum Rating" : "Note Minimum"}
              </h3>
              <div className="space-y-2">
                {ratingOptions.map((option) => {
                  const isSelected = filters.minRating === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleRatingChange(option.value)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-accent/10 border-accent text-accent"
                          : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">
                          {option.label[currentLanguage]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en"
                  ? "Available Date"
                  : "Date Disponible"}
              </h3>
              <div className="relative">
                <input
                  type="date"
                  value={filters.date || ""}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  min={new Date().toISOString().split("T")[0]}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex space-x-3 p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClear}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {currentLanguage === "en" ? "Clear All" : "Effacer Tout"}
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              {currentLanguage === "en"
                ? "Apply Filters"
                : "Appliquer les Filtres"}
              {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
