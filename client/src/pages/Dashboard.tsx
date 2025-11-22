import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface CarProvider {
  _id: string;
  name: string;
  address: string;
  telephone: string;
  price: number;
}

export default function Dashboard() {
  const [providers, setProviders] = useState<CarProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingProvider, setBookingProvider] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/carproviders");
      setProviders(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (
    providerId: string,
    providerName: string,
    price: number
  ) => {
    const date = prompt(
      `Book "${providerName}"\n\nEnter date (YYYY-MM-DD):`,
      "2025-12-25"
    );
    if (!date) return;

    setBookingProvider(providerId);
    try {
      await api.post(`/carproviders/${providerId}/bookings`, {
        bookingDate: date,
      });
      toast.success(`✅ Booking created! ฿${price.toLocaleString()} deducted.`);
      refreshUser();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingProvider(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Browse Car Providers
          </h1>
          <p className="text-gray-600">
            Choose from {providers.length} available providers
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Providers Available
            </h3>
            <p className="text-gray-500">
              Check back later for car rental options
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">🚗</div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold">Featured</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{provider.name}</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-xl mt-0.5">📍</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">
                          Location
                        </p>
                        <p className="text-gray-600">{provider.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="text-xl mt-0.5">📞</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">
                          Contact
                        </p>
                        <p className="text-gray-600">{provider.telephone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Rental Price
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          ฿{provider.price?.toLocaleString() || "1,000"}
                        </p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleBook(
                        provider._id,
                        provider.name,
                        provider.price || 1000
                      )
                    }
                    disabled={bookingProvider === provider._id}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {bookingProvider === provider._id ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>📅</span>
                        <span>Book Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
