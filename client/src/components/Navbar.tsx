import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold hover:scale-105 transition-transform duration-200 flex items-center gap-2"
          >
            🚗{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              CarRental
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    {user.role === "admin" && <span className="mr-2">👑</span>}
                    <span className="font-semibold">
                      ฿{user.balance.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive("/dashboard")
                        ? "bg-white/20 backdrop-blur-md"
                        : "hover:bg-white/10"
                    }`}
                  >
                    🏢 Browse
                  </Link>

                  <Link
                    to="/bookings"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive("/bookings")
                        ? "bg-white/20 backdrop-blur-md"
                        : "hover:bg-white/10"
                    }`}
                  >
                    📅 {user.role === "admin" ? "All Bookings" : "My Bookings"}
                  </Link>

                  <Link
                    to="/wallet"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive("/wallet")
                        ? "bg-white/20 backdrop-blur-md"
                        : "hover:bg-white/10"
                    }`}
                  >
                    💳 Wallet
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      to="/carproviders"
                      className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                        isActive("/carproviders")
                          ? "bg-yellow-400 text-blue-900"
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      ⚙️ Manage
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-lg font-medium bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
