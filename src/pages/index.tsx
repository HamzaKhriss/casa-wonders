import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Filter, Search, MapPin, TrendingUp } from "lucide-react";
import MapView from "@/components/MapView";
import FilterDrawer from "@/components/FilterDrawer";
import Card from "@/components/Card";
import { Listing } from "@/lib/mockData";
import { getListings, ListingFilters } from "@/lib/api";

interface HomePageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
}

const HomePage: React.FC<HomePageProps> = ({ currentLanguage }) => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Load initial listings
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        const response = await getListings(filters, 1, 50); // Load more for map view
        setListings(response.data);
      } catch (error) {
        console.error("Failed to load listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  const handleFilterApply = (newFilters: ListingFilters) => {
    setFilters(newFilters);
    setSelectedListing(null);
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleListingCardClick = (listing: Listing) => {
    router.push(`/listing/${listing.id}`);
  };

  const featuredListings = listings.slice(0, 6);

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
        <title>Casa Wonders - Discover the Best of Casablanca</title>
        <meta
          name="description"
          content="Explore restaurants, cultural sites, and events in Casablanca with our interactive map. Book authentic experiences in Morocco's economic capital."
        />
        <meta
          property="og:title"
          content="Casa Wonders - Discover the Best of Casablanca"
        />
        <meta
          property="og:description"
          content="Explore restaurants, cultural sites, and events in Casablanca with our interactive map."
        />
      </Head>

      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section with Map and Sidebar */}
        <div className="flex flex-col lg:flex-row min-h-screen pt-32">
          {/* Left Sidebar - Hero Content */}
          <div className="lg:w-2/5 xl:w-1/3 bg-white dark:bg-gray-800 lg:min-h-screen p-6 lg:p-8 xl:p-12">
            <div className="max-w-lg mx-auto lg:mx-0 lg:max-w-none">
              {/* Hero Text */}
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentLanguage === "en"
                    ? "Discover Casa Wonders"
                    : "Découvrez Casa Wonders"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl leading-relaxed">
                  {currentLanguage === "en"
                    ? "Explore authentic experiences, restaurants, and cultural sites in Casablanca"
                    : "Explorez des expériences authentiques, restaurants et sites culturels à Casablanca"}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2 text-accent">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold text-lg">
                      {listings.length}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === "en" ? "places" : "lieux"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-accent">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold text-lg">4.7</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === "en" ? "avg rating" : "note moy"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => router.push("/explore")}
                  className="w-full bg-accent text-white px-6 py-4 rounded-2xl shadow-lg hover:bg-accent/90 transition-colors flex items-center justify-center space-x-3 text-lg font-semibold"
                >
                  <Search className="w-6 h-6" />
                  <span>
                    {currentLanguage === "en" ? "Explore All" : "Tout Explorer"}
                  </span>
                </button>

                <button
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-3 text-lg font-semibold relative"
                >
                  <Filter className="w-6 h-6" />
                  <span>
                    {currentLanguage === "en" ? "Filter Results" : "Filtrer"}
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Featured Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentLanguage === "en"
                    ? "Popular Categories"
                    : "Catégories Populaires"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setFilters({ category: "restaurant" });
                      router.push("/explore?category=restaurant");
                    }}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="text-sm font-medium">
                      {currentLanguage === "en" ? "Restaurants" : "Restaurants"}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setFilters({ category: "cultural" });
                      router.push("/explore?category=cultural");
                    }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <div className="text-sm font-medium">
                      {currentLanguage === "en" ? "Cultural" : "Culturel"}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setFilters({ category: "event" });
                      router.push("/explore?category=event");
                    }}
                    className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors col-span-2"
                  >
                    <div className="text-sm font-medium">
                      {currentLanguage === "en"
                        ? "Events & Activities"
                        : "Événements & Activités"}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="lg:w-3/5 xl:w-2/3 lg:min-h-screen relative">
            <div className="h-96 lg:h-full relative">
              {isLoading ? (
                <div className="h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-2xl lg:rounded-none">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === "en"
                        ? "Loading map..."
                        : "Chargement de la carte..."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full rounded-t-2xl lg:rounded-none overflow-hidden">
                  <MapView
                    listings={listings}
                    onListingClick={handleListingClick}
                    selectedListing={selectedListing}
                    currentLanguage={currentLanguage}
                    height="100%"
                  />
                </div>
              )}

              {/* Selected Listing Overlay */}
              {selectedListing && (
                <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedListing.images[0]}
                        alt={
                          currentLanguage === "en"
                            ? selectedListing.title
                            : selectedListing.titleFr
                        }
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                          {currentLanguage === "en"
                            ? selectedListing.title
                            : selectedListing.titleFr}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 line-clamp-1">
                          {currentLanguage === "en"
                            ? selectedListing.location.address
                            : selectedListing.location.addressFr}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent text-lg">
                          {selectedListing.price} MAD
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedListing.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Section */}
        {featuredListings.length > 0 && (
          <section className="py-16 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentLanguage === "en"
                    ? "Featured Experiences"
                    : "Expériences en Vedette"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {currentLanguage === "en"
                    ? "Discover the most popular and highly-rated experiences in Casablanca"
                    : "Découvrez les expériences les plus populaires et les mieux notées à Casablanca"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredListings.map((listing) => (
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

              <div className="text-center mt-12">
                <button
                  onClick={() => router.push("/explore")}
                  className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  {currentLanguage === "en"
                    ? "View All Experiences"
                    : "Voir Toutes les Expériences"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="py-16 px-4 bg-surface dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en"
                  ? "Explore by Category"
                  : "Explorer par Catégorie"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Restaurants */}
              <div
                className="group cursor-pointer"
                onClick={() => {
                  setFilters({ category: "restaurant" });
                  router.push("/explore?category=restaurant");
                }}
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600"
                    alt={
                      currentLanguage === "en" ? "Restaurants" : "Restaurants"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      {currentLanguage === "en" ? "Restaurants" : "Restaurants"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {currentLanguage === "en"
                        ? "Authentic Moroccan cuisine"
                        : "Cuisine marocaine authentique"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cultural */}
              <div
                className="group cursor-pointer"
                onClick={() => {
                  setFilters({ category: "cultural" });
                  router.push("/explore?category=cultural");
                }}
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=600"
                    alt={
                      currentLanguage === "en"
                        ? "Cultural Sites"
                        : "Sites Culturels"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      {currentLanguage === "en"
                        ? "Cultural Sites"
                        : "Sites Culturels"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {currentLanguage === "en"
                        ? "Historic landmarks & tours"
                        : "Sites historiques et visites"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Events */}
              <div
                className="group cursor-pointer"
                onClick={() => {
                  setFilters({ category: "event" });
                  router.push("/explore?category=event");
                }}
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"
                    alt={currentLanguage === "en" ? "Events" : "Événements"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      {currentLanguage === "en"
                        ? "Events & Classes"
                        : "Événements & Cours"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {currentLanguage === "en"
                        ? "Workshops & experiences"
                        : "Ateliers et expériences"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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

export default HomePage;
