import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Heart, Grid, List as ListIcon, Trash2 } from "lucide-react";
import Card from "@/components/Card";
import BookingModal from "@/components/BookingModal";
import { Listing } from "@/lib/mockData";
import { getWishlist, removeFromWishlist } from "@/lib/api";

interface WishlistPageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
}

const WishlistPage: React.FC<WishlistPageProps> = ({ currentLanguage }) => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        const wishlistItems = await getWishlist();
        setListings(wishlistItems);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleWishlistChange = async (
    listingId: string,
    isWishlisted: boolean
  ) => {
    if (!isWishlisted) {
      // Remove from local state immediately for better UX
      setListings((prev) => prev.filter((listing) => listing.id !== listingId));

      try {
        await removeFromWishlist(listingId);
      } catch (error) {
        console.error("Failed to remove from wishlist:", error);
        // Reload the wishlist on error
        const wishlistItems = await getWishlist();
        setListings(wishlistItems);
      }
    }
  };

  const handleListingClick = (listing: Listing) => {
    router.push(`/listing/${listing.id}`);
  };

  const handleBookNow = (listing: Listing, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedListing(listing);
    setIsBookingModalOpen(true);
  };

  const handleClearAll = async () => {
    if (
      window.confirm(
        currentLanguage === "en"
          ? "Are you sure you want to clear your entire wishlist?"
          : "Êtes-vous sûr de vouloir vider toute votre liste de souhaits?"
      )
    ) {
      try {
        // Remove all items
        await Promise.all(
          listings.map((listing) => removeFromWishlist(listing.id))
        );
        setListings([]);
      } catch (error) {
        console.error("Failed to clear wishlist:", error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>
          {currentLanguage === "en"
            ? "My Wishlist - Casa Wonders"
            : "Ma Liste de Souhaits - Casa Wonders"}
        </title>
        <meta
          name="description"
          content={
            currentLanguage === "en"
              ? "Your saved experiences in Casablanca. Book your favorite restaurants, cultural sites, and events."
              : "Vos expériences sauvegardées à Casablanca. Réservez vos restaurants, sites culturels et événements favoris."
          }
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentLanguage === "en"
                    ? "My Wishlist"
                    : "Ma Liste de Souhaits"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
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
                        ? "saved experiences"
                        : "expériences sauvegardées"}
                    </>
                  )}
                </p>
              </div>

              {!isLoading && listings.length > 0 && (
                <div className="flex items-center space-x-4">
                  {/* Clear All Button */}
                  <button
                    onClick={handleClearAll}
                    className="flex items-center space-x-2 px-4 py-2 text-alert hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {currentLanguage === "en" ? "Clear All" : "Tout Effacer"}
                    </span>
                  </button>

                  {/* View Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-gray-600 text-accent shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-white dark:bg-gray-600 text-accent shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
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
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {currentLanguage === "en"
                  ? "Your wishlist is empty"
                  : "Votre liste de souhaits est vide"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {currentLanguage === "en"
                  ? "Start exploring Casablanca and save your favorite experiences to book them later."
                  : "Commencez à explorer Casablanca et sauvegardez vos expériences favorites pour les réserver plus tard."}
              </p>
              <button
                onClick={() => router.push("/explore")}
                className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                {currentLanguage === "en"
                  ? "Explore Experiences"
                  : "Explorer les Expériences"}
              </button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => handleListingClick(listing)}
                    >
                      <Card
                        listing={listing}
                        currentLanguage={currentLanguage}
                        isWishlisted={true}
                        onWishlistChange={handleWishlistChange}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {listings.map((listing) => {
                    const title =
                      currentLanguage === "en"
                        ? listing.title
                        : listing.titleFr;
                    const description =
                      currentLanguage === "en"
                        ? listing.description
                        : listing.descriptionFr;
                    const address =
                      currentLanguage === "en"
                        ? listing.location.address
                        : listing.location.addressFr;

                    return (
                      <div
                        key={listing.id}
                        onClick={() => handleListingClick(listing)}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer overflow-hidden"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto">
                            <img
                              src={listing.images[0]}
                              alt={title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      listing.category === "restaurant"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        : listing.category === "event"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    }`}
                                  >
                                    {listing.category}
                                  </span>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                  {title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                  {description}
                                </p>

                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Heart className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span>{listing.rating}</span>
                                    <span>({listing.reviewCount})</span>
                                  </div>
                                  <span>•</span>
                                  <span>{address}</span>
                                </div>
                              </div>

                              <div className="ml-4 text-right">
                                <div className="text-2xl font-bold text-accent mb-1">
                                  {listing.price} MAD
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  {currentLanguage === "en"
                                    ? "per person"
                                    : "par personne"}
                                </div>

                                <div className="space-y-2">
                                  <button
                                    onClick={(e) => handleBookNow(listing, e)}
                                    className="w-full bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                                  >
                                    {currentLanguage === "en"
                                      ? "Book Now"
                                      : "Réserver"}
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleWishlistChange(listing.id, false);
                                    }}
                                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>
                                      {currentLanguage === "en"
                                        ? "Remove"
                                        : "Supprimer"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          listing={selectedListing}
          currentLanguage={currentLanguage}
        />
      </div>
    </>
  );
};

export default WishlistPage;
