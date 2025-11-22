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
  const { refreshUser } = useAuth();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get("/carproviders");
        setProviders(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchProviders();
  }, []);

  const handleBook = async (providerId: string, price: number) => {
    const date = prompt("Enter booking date (YYYY-MM-DD):", "2025-12-25");
    if (!date) return;

    try {
      await api.post(`/carproviders/${providerId}/bookings`, {
        bookingDate: date,
      });
      toast.success(`Booking created! ฿${price} deducted.`);
      refreshUser();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Car Providers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div
            key={provider._id}
            className="bg-white p-4 rounded shadow border"
          >
            <h2 className="text-xl font-bold">{provider.name}</h2>
            <p className="text-gray-600">{provider.address}</p>
            <p className="text-gray-600">{provider.telephone}</p>
            <p className="text-green-600 font-semibold mt-2">
              Price: ฿{provider.price || 1000}
            </p>
            <button
              onClick={() => handleBook(provider._id, provider.price || 1000)}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Book (฿{provider.price || 1000})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
