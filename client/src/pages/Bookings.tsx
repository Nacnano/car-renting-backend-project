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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await api.get("/bookings");
        console.log("📋 [BOOKINGS] Loaded bookings:", res.data.data);
        setBookings(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load bookings");
      }
    };
    loadBookings();
  }, []);

  const handleEdit = (booking: Booking) => {
    setEditingId(booking._id);
    setEditDate(new Date(booking.bookingDate).toISOString().split("T")[0]);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.put(`/bookings/${id}`, { bookingDate: editDate });
      toast.success("Booking updated successfully");
      setEditingId(null);
      // Reload bookings
      const res = await api.get("/bookings");
      setBookings(res.data.data);
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
        : `Are you sure? You will be refunded \u0e3f${price}.`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await api.delete(`/bookings/${id}`);
      const message =
        response.data?.message ||
        (user?.role === "admin"
          ? "Booking deleted successfully"
          : `Booking cancelled. Refunded \u0e3f${price}.`);
      toast.success(message);
      setBookings(bookings.filter((b) => b._id !== id));
      refreshUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {user?.role === "admin" ? "All Bookings (Admin)" : "My Bookings"}
      </h1>
      {user?.role === "admin" && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 font-semibold">
            👑 Admin Mode: You can view, edit, and delete all bookings
          </p>
        </div>
      )}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white p-4 rounded shadow border">
            {editingId === booking._id ? (
              // Edit Mode
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {booking.carProvider.name}
                  </h3>
                  {user?.role === "admin" && booking.user && (
                    <p className="text-sm text-gray-600">
                      User: {booking.user.name} ({booking.user.email})
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Booking Date:
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="border rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(booking._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">
                    {booking.carProvider.name}
                  </h3>
                  <p>
                    Date: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Price: ฿{booking.price || 1000}
                  </p>
                  {user?.role === "admin" && booking.user && (
                    <p className="text-sm text-gray-600 mt-1">
                      User: {booking.user.name} ({booking.user.email})
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleEdit(booking)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(booking._id, booking.price)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    {user?.role === "admin" ? "Delete" : "Cancel"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {bookings.length === 0 && <p>No bookings found.</p>}
      </div>
    </div>
  );
}
