import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

// Import Leaflet CSS for maps
import "leaflet/dist/leaflet.css";

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"en" | "fr">("en");

  // Load theme and language from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("casa-wonders-theme") as
      | "light"
      | "dark"
      | null;
    const savedLanguage = localStorage.getItem("casa-wonders-language") as
      | "en"
      | "fr"
      | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.startsWith("fr") ? "fr" : "en";
      setLanguage(browserLang);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("casa-wonders-theme", theme);
  }, [theme]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem("casa-wonders-language", language);
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
  };

  return (
    <>
      <Head>
        <title>Casa Wonders - Discover Casablanca</title>
        <meta
          name="description"
          content="Discover, bookmark, and book events, cultural activities, and restaurants in Casablanca."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* SEO Meta Tags */}
        <meta
          property="og:title"
          content="Casa Wonders - Discover Casablanca"
        />
        <meta
          property="og:description"
          content="Discover, bookmark, and book events, cultural activities, and restaurants in Casablanca."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:locale"
          content={language === "fr" ? "fr_FR" : "en_US"}
        />

        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#1ABC9C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Casa Wonders" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar
          onThemeToggle={toggleTheme}
          onLanguageToggle={toggleLanguage}
          currentTheme={theme}
          currentLanguage={language}
        />

        <main className="pt-16">
          <Component
            {...pageProps}
            currentTheme={theme}
            currentLanguage={language}
            onThemeToggle={toggleTheme}
            onLanguageToggle={toggleLanguage}
          />
        </main>
      </div>
    </>
  );
}
