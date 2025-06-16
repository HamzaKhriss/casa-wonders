import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Listing } from "@/lib/mockData";
import { createBooking } from "@/lib/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  currentLanguage?: "en" | "fr";
}

interface BookingForm {
  date: string;
  time: string;
  participants: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  listing,
  currentLanguage = "en",
}) => {
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    date: "",
    time: "",
    participants: 1,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setForm({
        date: "",
        time: "",
        participants: 1,
      });
    }
  }, [isOpen]);

  if (!listing) return null;

  const title = currentLanguage === "en" ? listing.title : listing.titleFr;
  const address =
    currentLanguage === "en"
      ? listing.location.address
      : listing.location.addressFr;

  // Get available dates
  const availableDates = listing.availability.map((a) => a.date);
  const selectedDateAvailability = listing.availability.find(
    (a) => a.date === form.date
  );
  const availableSlots = selectedDateAvailability?.slots || [];

  const totalPrice = listing.price * form.participants;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.date && form.time && form.participants > 0) {
      setStep("payment");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking
      await createBooking({
        listingId: listing.id,
        date: form.date,
        time: form.time,
        participants: form.participants,
        status: "confirmed",
        totalPrice,
      });

      setStep("success");
    } catch (error) {
      console.error("Booking failed:", error);
      // Handle error (you could show an error message here)
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    onClose();
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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4"
          onClick={handleClose}
        />
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {step === "form" &&
                  (currentLanguage === "en"
                    ? "Book Experience"
                    : "Réserver l'Expérience")}
                {step === "payment" &&
                  (currentLanguage === "en" ? "Payment" : "Paiement")}
                {step === "success" &&
                  (currentLanguage === "en"
                    ? "Booking Confirmed"
                    : "Réservation Confirmée")}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Listing Info */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <img
                  src={listing.images[0]}
                  alt={title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {address}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-accent">
                      {listing.price} MAD
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {currentLanguage === "en" ? "per person" : "par personne"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === "form" && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {currentLanguage === "en"
                        ? "Select Date"
                        : "Sélectionner la Date"}
                    </label>
                    <div className="relative">
                      <select
                        value={form.date}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            date: e.target.value,
                            time: "",
                          }))
                        }
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                        required
                      >
                        <option value="">
                          {currentLanguage === "en"
                            ? "Choose a date..."
                            : "Choisir une date..."}
                        </option>
                        {availableDates.map((date) => (
                          <option key={date} value={date}>
                            {formatDate(date)}
                          </option>
                        ))}
                      </select>
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Time Selection */}
                  {form.date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {currentLanguage === "en"
                          ? "Select Time"
                          : "Sélectionner l'Heure"}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, time: slot }))
                            }
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                              form.time === slot
                                ? "bg-accent text-white border-accent"
                                : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <Clock className="w-4 h-4 mx-auto mb-1" />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {currentLanguage === "en"
                        ? "Number of Participants"
                        : "Nombre de Participants"}
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            participants: Math.max(1, prev.participants - 1),
                          }))
                        }
                        className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        -
                      </button>
                      <div className="flex items-center space-x-2 flex-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {form.participants}{" "}
                          {currentLanguage === "en"
                            ? "participant(s)"
                            : "participant(s)"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            participants: prev.participants + 1,
                          }))
                        }
                        className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total Price */}
                  {form.participants > 0 && (
                    <div className="bg-surface dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          {currentLanguage === "en"
                            ? "Total Price"
                            : "Prix Total"}
                        </span>
                        <span className="text-xl font-bold text-accent">
                          {totalPrice} MAD
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {listing.price} MAD × {form.participants}{" "}
                        {currentLanguage === "en"
                          ? "participant(s)"
                          : "participant(s)"}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!form.date || !form.time || form.participants < 1}
                    className="w-full py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentLanguage === "en"
                      ? "Continue to Payment"
                      : "Continuer vers le Paiement"}
                  </button>
                </form>
              )}

              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-surface dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      {currentLanguage === "en"
                        ? "Booking Summary"
                        : "Résumé de la Réservation"}
                    </h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Date" : "Date"}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(form.date)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Time" : "Heure"}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {form.time}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en"
                          ? "Participants"
                          : "Participants"}
                        :
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {form.participants}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-300 dark:border-gray-600">
                      <span className="text-gray-900 dark:text-white">
                        {currentLanguage === "en" ? "Total" : "Total"}:
                      </span>
                      <span className="text-accent">{totalPrice} MAD</span>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {currentLanguage === "en"
                        ? "Payment Information"
                        : "Informations de Paiement"}
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {currentLanguage === "en"
                          ? "Card Number"
                          : "Numéro de Carte"}
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {currentLanguage === "en" ? "Expiry" : "Expiration"}
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {currentLanguage === "en" ? "Back" : "Retour"}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>
                            {currentLanguage === "en"
                              ? "Processing..."
                              : "Traitement..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>
                            {currentLanguage === "en"
                              ? "Pay Now"
                              : "Payer Maintenant"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {step === "success" && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {currentLanguage === "en"
                        ? "Booking Confirmed!"
                        : "Réservation Confirmée!"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === "en"
                        ? "Your booking has been confirmed. You will receive a confirmation email shortly."
                        : "Votre réservation a été confirmée. Vous recevrez un email de confirmation sous peu."}
                    </p>
                  </div>

                  <div className="bg-surface dark:bg-gray-700 rounded-lg p-4 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Date" : "Date"}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(form.date)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en" ? "Time" : "Heure"}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {form.time}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === "en"
                          ? "Participants"
                          : "Participants"}
                        :
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {form.participants}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-300 dark:border-gray-600">
                      <span className="text-gray-900 dark:text-white">
                        {currentLanguage === "en" ? "Total Paid" : "Total Payé"}
                        :
                      </span>
                      <span className="text-accent">{totalPrice} MAD</span>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    {currentLanguage === "en" ? "Close" : "Fermer"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingModal;
