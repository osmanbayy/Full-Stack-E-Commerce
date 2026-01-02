import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { X, LogOut, Menu, Bell, Search } from "lucide-react";

// eslint-disable-next-line react/prop-types
const Navbar = ({ setToken }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    await setToken("");
    toast.success("Logout successful!");
    setShowLogoutModal(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim().toUpperCase();
    
    if (!trimmedQuery) {
      return;
    }

    // If not on orders page, navigate to it
    if (location.pathname !== "/orders") {
      navigate(`/orders?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If already on orders page, update URL
      navigate(`/orders?search=${encodeURIComponent(trimmedQuery)}`, { replace: true });
    }
    
    setShowSearchInput(false);
    setSearchQuery("");
  };

  const handleSearchClick = () => {
    setShowSearchInput(true);
  };

  const handleSearchBlur = () => {
    // Delay to allow click events to fire
    setTimeout(() => {
      if (!searchQuery.trim()) {
        setShowSearchInput(false);
      }
    }, 200);
  };

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm backdrop-blur-lg bg-white/95">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <img className="w-32 md:w-40 h-auto" src={assets.logo} alt="Logo" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search - Desktop Only */}
            {showSearchInput ? (
              <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={handleSearchBlur}
                    autoFocus
                    placeholder="Search by order number (e.g., TRK123456789)"
                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchQuery("");
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div 
                onClick={handleSearchClick}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Search by order number...</span>
              </div>
            )}

            {/* Notifications - Desktop Only */}
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Confirm Logout</h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
