import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  User,
  Calendar,
  Heart,
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Edit3,
  Camera,
  LogOut,
} from "lucide-react";
import { Booking, User as UserType } from "@/lib/mockData";
import { getUser, getBookings, updateUserPreferences } from "@/lib/api";

interface ProfilePageProps {
  currentLanguage: "en" | "fr";
  currentTheme: "light" | "dark";
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  currentLanguage,
  currentTheme,
  onThemeToggle,
  onLanguageToggle,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "settings"
  >("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  // Load user data and bookings
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const [userData, userBookings] = await Promise.all([
          getUser(),
          getBookings(),
        ]);
        setUser(userData);
        setBookings(userBookings);
        setEditForm({ name: userData.name, email: userData.email });
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const tabs = [
    {
      id: "overview",
      name: { en: "Overview", fr: "Aperçu" },
      icon: User,
    },
    {
      id: "bookings",
      name: { en: "My Bookings", fr: "Mes Réservations" },
      icon: Calendar,
    },
    {
      id: "settings",
      name: { en: "Settings", fr: "Paramètres" },
      icon: Settings,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Loader className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      confirmed: { en: "Confirmed", fr: "Confirmée" },
      pending: { en: "Pending", fr: "En Attente" },
      cancelled: { en: "Cancelled", fr: "Annulée" },
    };
    return labels[status as keyof typeof labels]?.[currentLanguage] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === "fr" ? "fr-FR" : "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const handleSaveProfile = async () => {
    try {
      // Update user profile (mock implementation)
      if (user) {
        const updatedUser = {
          ...user,
          name: editForm.name,
          email: editForm.email,
        };
        setUser(updatedUser);
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handlePreferenceUpdate = async (
    preferences: Partial<UserType["preferences"]>
  ) => {
    try {
      if (user) {
        const updatedUser = await updateUserPreferences(preferences);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === "en"
              ? "Loading profile..."
              : "Chargement du profil..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {currentLanguage === "en"
              ? "Profile not found"
              : "Profil non trouvé"}
          </h2>
          <button
            onClick={() => router.push("/")}
            className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            {currentLanguage === "en" ? "Go Home" : "Accueil"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {currentLanguage === "en"
            ? "My Profile - Casa Wonders"
            : "Mon Profil - Casa Wonders"}
        </title>
        <meta
          name="description"
          content={
            currentLanguage === "en"
              ? "Manage your Casa Wonders profile, view bookings, and update preferences."
              : "Gérez votre profil Casa Wonders, consultez vos réservations et mettez à jour vos préférences."
          }
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Profile Avatar and Info */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="text-accent font-medium">
                      {bookings.length}{" "}
                      {currentLanguage === "en" ? "bookings" : "réservations"}
                    </span>
                    <span className="text-accent font-medium">
                      {user.wishlist.length}{" "}
                      {currentLanguage === "en" ? "saved" : "sauvegardées"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex-1 md:flex md:justify-end">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push("/wishlist")}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {currentLanguage === "en" ? "Wishlist" : "Favoris"}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {currentLanguage === "en" ? "Edit Profile" : "Modifier"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-accent text-accent"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name[currentLanguage]}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {currentLanguage === "en"
                          ? "Total Bookings"
                          : "Réservations Totales"}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {bookings.length}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {bookings.filter((b) => b.status === "confirmed").length}{" "}
                    {currentLanguage === "en" ? "confirmed" : "confirmées"}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {currentLanguage === "en"
                          ? "Saved Experiences"
                          : "Expériences Sauvées"}
                      </h3>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {user.wishlist.length}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/wishlist")}
                    className="text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    {currentLanguage === "en"
                      ? "View wishlist →"
                      : "Voir la liste →"}
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {currentLanguage === "en"
                          ? "Total Spent"
                          : "Total Dépensé"}
                      </h3>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {bookings.reduce(
                          (sum, booking) => sum + booking.totalPrice,
                          0
                        )}{" "}
                        MAD
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === "en" ? "This year" : "Cette année"}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {currentLanguage === "en"
                          ? "Places Visited"
                          : "Lieux Visités"}
                      </h3>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {
                          new Set(
                            bookings
                              .filter((b) => b.status === "confirmed")
                              .map((b) => b.listingId)
                          ).size
                        }
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === "en"
                      ? "Unique experiences"
                      : "Expériences uniques"}
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {currentLanguage === "en"
                      ? "Recent Activity"
                      : "Activité Récente"}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center space-x-3"
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentLanguage === "en"
                              ? "Booking"
                              : "Réservation"}{" "}
                            #{booking.id.slice(-6)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(booking.date)} • {booking.totalPrice}{" "}
                            MAD
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="w-full mt-4 text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    {currentLanguage === "en"
                      ? "View all bookings →"
                      : "Voir toutes les réservations →"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentLanguage === "en"
                    ? "My Bookings"
                    : "Mes Réservations"}
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {bookings.length}{" "}
                  {currentLanguage === "en"
                    ? "total bookings"
                    : "réservations au total"}
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {currentLanguage === "en"
                      ? "No bookings yet"
                      : "Aucune réservation"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {currentLanguage === "en"
                      ? "Start exploring and book your first experience!"
                      : "Commencez à explorer et réservez votre première expérience!"}
                  </p>
                  <button
                    onClick={() => router.push("/explore")}
                    className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    {currentLanguage === "en"
                      ? "Explore Experiences"
                      : "Explorer les Expériences"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {currentLanguage === "en"
                                ? "Booking"
                                : "Réservation"}{" "}
                              #{booking.id.slice(-8).toUpperCase()}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusLabel(booking.status)}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(booking.date)} • {booking.time}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>
                                {booking.participants}{" "}
                                {currentLanguage === "en"
                                  ? "participants"
                                  : "participants"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-accent">
                            {booking.totalPrice} MAD
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {currentLanguage === "en"
                              ? `Booked on ${new Date(
                                  booking.createdAt
                                ).toLocaleDateString("en-US")}`
                              : `Réservé le ${new Date(
                                  booking.createdAt
                                ).toLocaleDateString("fr-FR")}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/listing/${booking.listingId}`)
                          }
                          className="px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        >
                          {currentLanguage === "en"
                            ? "View Details"
                            : "Voir Détails"}
                        </button>

                        {booking.status === "confirmed" && (
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            {currentLanguage === "en"
                              ? "Download Receipt"
                              : "Télécharger Reçu"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-8">
              {/* Preferences */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {currentLanguage === "en" ? "Preferences" : "Préférences"}
                </h3>

                <div className="space-y-6">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {currentTheme === "light" ? (
                        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {currentLanguage === "en"
                            ? "Dark Mode"
                            : "Mode Sombre"}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {currentLanguage === "en"
                            ? "Use dark theme"
                            : "Utiliser le thème sombre"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onThemeToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        currentTheme === "dark"
                          ? "bg-accent"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          currentTheme === "dark"
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Language Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {currentLanguage === "en" ? "Language" : "Langue"}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {currentLanguage === "en"
                            ? "Choose your preferred language"
                            : "Choisissez votre langue préférée"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onLanguageToggle}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      {currentLanguage === "en" ? "Français" : "English"}
                    </button>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {currentLanguage === "en"
                            ? "Push Notifications"
                            : "Notifications Push"}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {currentLanguage === "en"
                            ? "Receive booking confirmations and updates"
                            : "Recevoir les confirmations et mises à jour"}
                        </p>
                      </div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-accent">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {currentLanguage === "en" ? "Account" : "Compte"}
                </h3>

                <div className="space-y-4">
                  <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    {currentLanguage === "en"
                      ? "Change Password"
                      : "Changer le Mot de Passe"}
                  </button>

                  <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    {currentLanguage === "en"
                      ? "Download My Data"
                      : "Télécharger Mes Données"}
                  </button>

                  <button className="w-full text-left px-4 py-3 text-alert hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>
                      {currentLanguage === "en" ? "Sign Out" : "Se Déconnecter"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {currentLanguage === "en"
                  ? "Edit Profile"
                  : "Modifier le Profil"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLanguage === "en" ? "Name" : "Nom"}
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLanguage === "en" ? "Email" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {currentLanguage === "en" ? "Cancel" : "Annuler"}
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  {currentLanguage === "en" ? "Save Changes" : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
