import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          CarRental
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="font-medium">
                {user.role === "admin" && "👑 Admin | "}Balance: {user.balance}
              </span>
              <Link to="/dashboard" className="hover:text-blue-200">
                Providers
              </Link>
              <Link to="/bookings" className="hover:text-blue-200">
                {user.role === "admin" ? "All Bookings" : "My Bookings"}
              </Link>
              <Link to="/wallet" className="hover:text-blue-200">
                Wallet
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/carproviders"
                  className="hover:text-blue-200 font-semibold"
                >
                  Manage Providers
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
