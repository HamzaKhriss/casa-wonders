import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Search,
  User,
  Heart,
  MapPin,
  List,
  Menu,
  X,
  Globe,
  Moon,
  Sun,
  Bell,
  Settings,
  Home,
  Compass,
} from "lucide-react";
import { mockUser } from "@/lib/mockData";

interface NavbarProps {
  onThemeToggle?: () => void;
  onLanguageToggle?: () => void;
  currentTheme?: "light" | "dark";
  currentLanguage?: "en" | "fr";
}

const Navbar: React.FC<NavbarProps> = ({
  onThemeToggle,
  onLanguageToggle,
  currentTheme = "light",
  currentLanguage = "en",
}) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Home", nameFr: "Accueil", href: "/", icon: Home },
    { name: "Explore", nameFr: "Explorer", href: "/explore", icon: Compass },
    { name: "Wishlist", nameFr: "Favoris", href: "/wishlist", icon: Heart },
    { name: "Profile", nameFr: "Profil", href: "/profile", icon: User },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-200">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Casa Wonders
              </span>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {currentLanguage === "en"
                  ? "Discover Casablanca"
                  : "Découvrez Casablanca"}
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-3xl mx-12">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={
                    currentLanguage === "en"
                      ? "Search experiences, restaurants, events..."
                      : "Rechercher des expériences, restaurants, événements..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 border border-gray-200 dark:border-gray-600 rounded-3xl 
                           bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white dark:focus:bg-gray-800 
                           transition-all duration-200 text-lg shadow-lg"
                />
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-accent transition-colors" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const name = currentLanguage === "en" ? item.name : item.nameFr;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 group ${
                    active
                      ? "bg-accent text-white shadow-xl shadow-accent/25"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      active
                        ? "text-white"
                        : "text-gray-500 group-hover:text-accent"
                    } transition-colors`}
                  />
                  <span className="text-lg">{name}</span>
                  {active && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200 dark:border-gray-700">
              {/* Notifications */}
              <button
                className="relative p-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:text-accent transition-all duration-200 group"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className="p-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:text-accent transition-all duration-200"
                aria-label="Toggle theme"
              >
                {currentTheme === "light" ? (
                  <Moon className="w-6 h-6" />
                ) : (
                  <Sun className="w-6 h-6" />
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={onLanguageToggle}
                className="flex items-center space-x-2 px-4 py-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:text-accent transition-all duration-200 font-semibold"
                aria-label="Toggle language"
              >
                <Globe className="w-6 h-6" />
                <span className="text-lg font-bold uppercase tracking-wide">
                  {currentLanguage}
                </span>
              </button>

              {/* User Profile */}
              <Link
                href="/profile"
                className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="w-12 h-12 rounded-2xl border-2 border-gray-200 dark:border-gray-600 group-hover:border-accent transition-colors object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                </div>
                <div className="hidden xl:block">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {mockUser.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentLanguage === "en"
                      ? "Premium Member"
                      : "Membre Premium"}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-4 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-10 pt-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  currentLanguage === "en"
                    ? "Search experiences..."
                    : "Rechercher des expériences..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 border border-gray-200 dark:border-gray-600 rounded-3xl 
                         bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-lg
                         focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 shadow-lg"
              />
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="px-6 py-10 space-y-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const name = currentLanguage === "en" ? item.name : item.nameFr;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-5 px-6 py-5 rounded-3xl transition-all duration-200 ${
                    active
                      ? "bg-accent text-white shadow-xl"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                  <span className="text-xl font-semibold">{name}</span>
                </Link>
              );
            })}

            {/* Mobile Actions */}
            <div className="pt-10 mt-10 border-t border-gray-200 dark:border-gray-700 space-y-8">
              {/* User Profile */}
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-5 p-6 rounded-3xl hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200"
              >
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-16 h-16 rounded-3xl border-2 border-gray-200 dark:border-gray-600 object-cover"
                />
                <div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {mockUser.name}
                  </div>
                  <div className="text-lg text-gray-500 dark:text-gray-400">
                    {currentLanguage === "en"
                      ? "View Profile"
                      : "Voir le Profil"}
                  </div>
                </div>
              </Link>

              {/* Settings Row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    onThemeToggle?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-4 p-4 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200"
                >
                  {currentTheme === "light" ? (
                    <Moon className="w-6 h-6" />
                  ) : (
                    <Sun className="w-6 h-6" />
                  )}
                  <span className="text-lg font-semibold">
                    {currentLanguage === "en" ? "Dark Mode" : "Mode Sombre"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onLanguageToggle?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-4 p-4 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200"
                >
                  <Globe className="w-6 h-6" />
                  <span className="text-lg font-bold uppercase tracking-wide">
                    {currentLanguage}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
