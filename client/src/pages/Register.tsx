import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    telephone: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", formData);
      const meRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });
      login(res.data.token, meRes.data.data);
      navigate("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { msg?: string } } };
      toast.error(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          placeholder="Name"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          placeholder="Telephone"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) =>
            setFormData({ ...formData, telephone: e.target.value })
          }
          required
        />
        <input
          placeholder="Password"
          type="password"
          className="w-full border p-2 rounded mb-6"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
