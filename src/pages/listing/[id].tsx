import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import {
  ArrowLeft,
  Heart,
  Share,
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Listing } from "@/lib/mockData";
import { getListing, addToWishlist, removeFromWishlist } from "@/lib/api";
import BookingModal from "@/components/BookingModal";
import MapView from "@/components/MapView";

interface ListingDetailPageProps {
  listing: Listing | null;
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
}

const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listing: initialListing,
  currentLanguage,
}) => {
  const router = useRouter();
  const [listing, setListing] = useState(initialListing);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "location"
  >("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // If we don't have listing from SSR, try to fetch it
  useEffect(() => {
    if (!listing && router.query.id) {
      const fetchListing = async () => {
        try {
          const fetchedListing = await getListing(router.query.id as string);
          setListing(fetchedListing);
        } catch (error) {
          console.error("Failed to fetch listing:", error);
        }
      };
      fetchListing();
    }
  }, [listing, router.query.id]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === "en" ? "Loading..." : "Chargement..."}
          </p>
        </div>
      </div>
    );
  }

  const title = currentLanguage === "en" ? listing.title : listing.titleFr;
  const description =
    currentLanguage === "en" ? listing.description : listing.descriptionFr;
  const address =
    currentLanguage === "en"
      ? listing.location.address
      : listing.location.addressFr;

  const tabs = [
    { id: "overview", name: { en: "Overview", fr: "Aperçu" } },
    { id: "details", name: { en: "Details", fr: "Détails" } },
    { id: "location", name: { en: "Location", fr: "Localisation" } },
  ];

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

  const handleWishlistClick = async () => {
    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(listing.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(listing.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === "fr" ? "fr-FR" : "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
    );
  };

  return (
    <>
      <Head>
        <title>{title} - Casa Wonders</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${title} - Casa Wonders`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={listing.images[0]} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-32 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{currentLanguage === "en" ? "Back" : "Retour"}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWishlistClick}
                  disabled={isWishlistLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    isWishlisted
                      ? "bg-accent text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  } ${
                    isWishlistLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: title,
                        text: description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Carousel */}
              <div className="relative">
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  <img
                    src={listing.images[currentImageIndex]}
                    alt={title}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {listing.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Image Counter */}
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg flex items-center space-x-1">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm">
                          {currentImageIndex + 1} / {listing.images.length}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Image Thumbnails */}
                {listing.images.length > 1 && (
                  <div className="flex space-x-2 mt-4 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? "border-accent"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
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
                        {getCategoryLabel(listing.category)}
                      </span>
                      {listing.host.verified && (
                        <div className="flex items-center space-x-1 text-accent">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {currentLanguage === "en" ? "Verified" : "Vérifié"}
                          </span>
                        </div>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{listing.rating}</span>
                        <span>
                          ({listing.reviewCount}{" "}
                          {currentLanguage === "en" ? "reviews" : "avis"})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-accent">
                      {listing.price} MAD
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {currentLanguage === "en" ? "per person" : "par personne"}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Tabs */}
              <div>
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? "border-accent text-accent"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        {tab.name[currentLanguage]}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="py-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Host Info */}
                      <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <img
                          src={listing.host.avatar}
                          alt={listing.host.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {currentLanguage === "en"
                              ? "Hosted by"
                              : "Organisé par"}{" "}
                            {listing.host.name}
                          </h3>
                          {listing.host.verified && (
                            <p className="text-sm text-accent">
                              {currentLanguage === "en"
                                ? "Verified host"
                                : "Hôte vérifié"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {currentLanguage === "en"
                            ? "What's included"
                            : "Ce qui est inclus"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {listing.amenities.map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <Check className="w-4 h-4 text-accent" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {amenity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Availability */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {currentLanguage === "en"
                            ? "Availability"
                            : "Disponibilités"}
                        </h3>
                        <div className="space-y-3">
                          {listing.availability.map((day, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {formatDate(day.date)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {day.slots.join(", ")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "details" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {currentLanguage === "en"
                            ? "About this experience"
                            : "À propos de cette expérience"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {description}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {currentLanguage === "en"
                            ? "Important information"
                            : "Informations importantes"}
                        </h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li>
                            •{" "}
                            {currentLanguage === "en"
                              ? "Please arrive 15 minutes early"
                              : "Veuillez arriver 15 minutes en avance"}
                          </li>
                          <li>
                            •{" "}
                            {currentLanguage === "en"
                              ? "Cancellation policy: Free cancellation up to 24 hours before"
                              : "Politique d'annulation: Annulation gratuite jusqu'à 24h avant"}
                          </li>
                          <li>
                            •{" "}
                            {currentLanguage === "en"
                              ? "Suitable for all ages"
                              : "Convient à tous les âges"}
                          </li>
                          <li>
                            •{" "}
                            {currentLanguage === "en"
                              ? "Available in French and English"
                              : "Disponible en français et anglais"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === "location" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {currentLanguage === "en"
                            ? "Where you'll be"
                            : "Où vous serez"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {address}
                        </p>
                      </div>

                      <div className="h-64 rounded-lg overflow-hidden">
                        <MapView
                          listings={[listing]}
                          center={[listing.location.lat, listing.location.lng]}
                          zoom={15}
                          height="100%"
                          currentLanguage={currentLanguage}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-accent mb-1">
                      {listing.price} MAD
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {currentLanguage === "en" ? "per person" : "par personne"}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-accent text-white py-4 rounded-lg font-medium hover:bg-accent/90 transition-colors mb-4"
                  >
                    {currentLanguage === "en"
                      ? "Book Now"
                      : "Réserver Maintenant"}
                  </button>

                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {currentLanguage === "en"
                      ? "You won't be charged yet"
                      : "Vous ne serez pas débité maintenant"}
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {currentLanguage === "en" ? "Duration" : "Durée"}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        2-3 {currentLanguage === "en" ? "hours" : "heures"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {currentLanguage === "en"
                            ? "Group size"
                            : "Taille du groupe"}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        {currentLanguage === "en"
                          ? "Up to 10 people"
                          : "Jusqu'à 10 personnes"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4" />
                        <span>
                          {currentLanguage === "en" ? "Rating" : "Note"}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        {listing.rating} ({listing.reviewCount}{" "}
                        {currentLanguage === "en" ? "reviews" : "avis"})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          listing={listing}
          currentLanguage={currentLanguage}
        />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const listing = await getListing(id as string);

    if (!listing) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        listing,
      },
    };
  } catch (error) {
    return {
      props: {
        listing: null,
      },
    };
  }
};

export default ListingDetailPage;
