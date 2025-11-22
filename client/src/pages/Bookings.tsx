import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface Booking {
  _id: string;
  bookingDate: string;
  price: number;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  carProvider: {
    name: string;
    address: string;
    telephone: string;
  };
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingId(booking._id);
    setEditDate(new Date(booking.bookingDate).toISOString().split("T")[0]);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.put(`/bookings/${id}`, { bookingDate: editDate });
      toast.success("✅ Booking updated successfully");
      setEditingId(null);
      loadBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update booking");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDate("");
  };

  const handleDelete = async (id: string, price: number = 1000) => {
    const confirmMessage =
      user?.role === "admin"
        ? "Are you sure you want to delete this booking?"
        : `Cancel booking and get refunded ฿${price.toLocaleString()}?`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await api.delete(`/bookings/${id}`);
      const message =
        response.data?.message ||
        (user?.role === "admin"
          ? "Booking deleted successfully"
          : `Booking cancelled. Refunded ฿${price.toLocaleString()}.`);
      toast.success(message);
      setBookings(bookings.filter((b) => b._id !== id));
      refreshUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {user?.role === "admin" ? "All Bookings" : "My Bookings"}
          </h1>
          <p className="text-gray-600">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}{" "}
            found
          </p>
        </div>

        {user?.role === "admin" && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">👑</div>
              <p className="text-yellow-900 font-semibold">
                Admin Mode: You can view, edit, and delete all bookings
              </p>
            </div>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-500">
              Start by booking a car from the providers page
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {editingId === booking._id ? (
                  // Edit Mode
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">✏️</div>
                      <h3 className="font-bold text-xl text-gray-800">
                        Edit Booking
                      </h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Provider</p>
                      <p className="font-bold text-lg">
                        {booking.carProvider.name}
                      </p>
                      {user?.role === "admin" && booking.user && (
                        <p className="text-sm text-gray-600 mt-2">
                          👤 {booking.user.name} ({booking.user.email})
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Booking Date
                      </label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(booking._id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                      >
                        💾 Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-3xl">🚗</div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-800">
                              {booking.carProvider.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              📍 {booking.carProvider.address}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded-xl">
                            <p className="text-xs text-blue-600 font-semibold mb-1">
                              📅 Date
                            </p>
                            <p className="font-bold text-gray-800">
                              {new Date(booking.bookingDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>

                          <div className="bg-green-50 p-3 rounded-xl">
                            <p className="text-xs text-green-600 font-semibold mb-1">
                              💰 Price
                            </p>
                            <p className="font-bold text-gray-800">
                              ฿{(booking.price || 1000).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {user?.role === "admin" && booking.user && (
                          <div className="bg-purple-50 p-3 rounded-xl">
                            <p className="text-xs text-purple-600 font-semibold mb-1">
                              👤 Customer
                            </p>
                            <p className="font-semibold text-gray-800">
                              {booking.user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.user.email}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {user?.role === "admin" && (
                          <button
                            onClick={() => handleEdit(booking)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDelete(booking._id, booking.price)
                          }
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                          <span>{user?.role === "admin" ? "🗑️" : "❌"}</span>
                          <span>
                            {user?.role === "admin" ? "Delete" : "Cancel"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
