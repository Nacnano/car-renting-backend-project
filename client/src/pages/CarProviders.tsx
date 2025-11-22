import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface CarProvider {
  _id: string;
  name: string;
  address: string;
  telephone: string;
}

export default function CarProviders() {
  const [providers, setProviders] = useState<CarProvider[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    telephone: "",
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const res = await api.get("/carproviders");
      console.log("📋 [CAR_PROVIDERS] Loaded providers:", res.data.data);
      setProviders(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load car providers");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/carproviders", formData);
      toast.success("Car provider added successfully");
      setShowAddForm(false);
      setFormData({ name: "", address: "", telephone: "" });
      loadProviders();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add car provider"
      );
    }
  };

  const handleEdit = (provider: CarProvider) => {
    setEditingId(provider._id);
    setFormData({
      name: provider.name,
      address: provider.address,
      telephone: provider.telephone,
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.put(`/carproviders/${id}`, formData);
      toast.success("Car provider updated successfully");
      setEditingId(null);
      setFormData({ name: "", address: "", telephone: "" });
      loadProviders();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update car provider"
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", address: "", telephone: "" });
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This will also delete all associated bookings.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/carproviders/${id}`);
      toast.success("Car provider deleted successfully");
      loadProviders();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete car provider"
      );
    }
  };

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Car Providers (Admin)</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showAddForm ? "Cancel" : "+ Add New Provider"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded shadow mb-6 border-2 border-green-200">
          <h2 className="text-xl font-bold mb-4">Add New Car Provider</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Telephone *
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Create Provider
            </button>
          </form>
        </div>
      )}

      {/* Providers List */}
      <div className="space-y-4">
        {providers.map((provider) => (
          <div
            key={provider._id}
            className="bg-white p-4 rounded shadow border"
          >
            {editingId === provider._id ? (
              // Edit Mode
              <div className="space-y-3">
                <h3 className="text-lg font-bold mb-2">Edit Provider</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(provider._id)}
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
                  <h3 className="font-bold text-lg">{provider.name}</h3>
                  <p className="text-gray-600">📍 {provider.address}</p>
                  <p className="text-gray-600">📞 {provider.telephone}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(provider)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(provider._id, provider.name)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {providers.length === 0 && <p>No car providers found.</p>}
      </div>
    </div>
  );
}
