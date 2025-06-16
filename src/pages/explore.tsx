import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Filter, Grid, Map, Search, Loader } from "lucide-react";
import MapView from "@/components/MapView";
import FilterDrawer from "@/components/FilterDrawer";
import Card from "@/components/Card";
import { Listing } from "@/lib/mockData";
import {
  getListings,
  searchListings,
  ListingFilters,
  PaginatedResponse,
} from "@/lib/api";

interface ExplorePageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
}

const ExplorePage: React.FC<ExplorePageProps> = ({ currentLanguage }) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Initialize filters from URL params
  useEffect(() => {
    const { category, search, ...otherParams } = router.query;
    const initialFilters: ListingFilters = {};

    if (category && typeof category === "string") {
      initialFilters.category = category as "restaurant" | "event" | "cultural";
    }

    if (search && typeof search === "string") {
      setSearchQuery(search);
    }

    setFilters(initialFilters);
  }, [router.query]);

  // Load listings
  const loadListings = useCallback(
    async (pageNum: number, reset = false) => {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        let response: PaginatedResponse<Listing>;

        if (searchQuery.trim()) {
          // If there's a search query, use search API
          const searchResults = await searchListings(searchQuery);
          response = {
            data: searchResults,
            total: searchResults.length,
            page: 1,
            limit: searchResults.length,
            hasMore: false,
          };
        } else {
          // Otherwise use regular listings with filters
          response = await getListings(filters, pageNum, 12);
        }

        if (reset || pageNum === 1) {
          setListings(response.data);
        } else {
          setListings((prev) => [...prev, ...response.data]);
        }

        setHasMore(response.hasMore);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to load listings:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters, searchQuery]
  );

  // Initial load and reload when filters change
  useEffect(() => {
    loadListings(1, true);
  }, [loadListings]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  // Handle filter apply
  const handleFilterApply = (newFilters: ListingFilters) => {
    setFilters(newFilters);
    setSelectedListing(null);

    // Update URL with filters
    const params = new URLSearchParams();
    if (newFilters.category) params.set("category", newFilters.category);
    if (searchQuery) params.set("search", searchQuery);

    const queryString = params.toString();
    router.push(`/explore${queryString ? `?${queryString}` : ""}`, undefined, {
      shallow: true,
    });
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadListings(page + 1);
    }
  };

  // Handle listing click in map mode
  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  // Handle listing card click
  const handleListingCardClick = (listing: Listing) => {
    router.push(`/listing/${listing.id}`);
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
      <Head>
        <title>
          {currentLanguage === "en"
            ? "Explore Casablanca - Casa Wonders"
            : "Explorer Casablanca - Casa Wonders"}
        </title>
        <meta
          name="description"
          content={
            currentLanguage === "en"
              ? "Browse all restaurants, cultural sites, and events in Casablanca. Find your perfect experience with our advanced filters."
              : "Parcourez tous les restaurants, sites culturels et événements à Casablanca. Trouvez votre expérience parfaite avec nos filtres avancés."
          }
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-32 z-30">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Title and Results Count */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentLanguage === "en"
                    ? "Explore Casablanca"
                    : "Explorer Casablanca"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {isLoading ? (
                    currentLanguage === "en" ? (
                      "Loading..."
                    ) : (
                      "Chargement..."
                    )
                  ) : (
                    <>
                      {listings.length}{" "}
                      {currentLanguage === "en"
                        ? "experiences found"
                        : "expériences trouvées"}
                      {searchQuery && (
                        <span className="ml-1">
                          {currentLanguage === "en" ? "for" : "pour"} "
                          {searchQuery}"
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="hidden md:block">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        currentLanguage === "en"
                          ? "Search experiences..."
                          : "Rechercher..."
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </form>

                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="relative bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white dark:bg-gray-600 text-accent shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "map"
                        ? "bg-white dark:bg-gray-600 text-accent shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="md:hidden mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    currentLanguage === "en"
                      ? "Search experiences..."
                      : "Rechercher..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>
          </div>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {currentLanguage === "en"
                    ? "No experiences found"
                    : "Aucune expérience trouvée"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentLanguage === "en"
                    ? "Try adjusting your filters or search terms"
                    : "Essayez d'ajuster vos filtres ou termes de recherche"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => handleListingCardClick(listing)}
                    >
                      <Card
                        listing={listing}
                        currentLanguage={currentLanguage}
                        isWishlisted={false} // This would come from user state
                        onWishlistChange={() => {}} // Handle wishlist changes
                      />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>
                            {currentLanguage === "en"
                              ? "Loading..."
                              : "Chargement..."}
                          </span>
                        </>
                      ) : (
                        <span>
                          {currentLanguage === "en"
                            ? "Load More"
                            : "Charger Plus"}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)]">
            <MapView
              listings={listings}
              onListingClick={handleListingClick}
              selectedListing={selectedListing}
              currentLanguage={currentLanguage}
              height="100%"
            />
          </div>
        )}

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          onApplyFilters={handleFilterApply}
          currentFilters={filters}
          currentLanguage={currentLanguage}
        />
      </div>
    </>
  );
};

export default ExplorePage;
