import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface Booking {
  _id: string;
  bookingDate: string;
  carProvider: {
    name: string;
    address: string;
    telephone: string;
  };
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { refreshUser } = useAuth();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    loadBookings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? You will be refunded 1000.")) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success("Booking cancelled. Refunded 1000.");
      setBookings(bookings.filter((b) => b._id !== id));
      refreshUser();
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-4 rounded shadow border flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg">{booking.carProvider.name}</h3>
              <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => handleDelete(booking._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        ))}
        {bookings.length === 0 && <p>No bookings found.</p>}
      </div>
    </div>
  );
}
