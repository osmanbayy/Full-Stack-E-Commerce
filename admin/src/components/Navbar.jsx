import { useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { X } from "lucide-react";

// eslint-disable-next-line react/prop-types
const Navbar = ({ setToken }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutHandler = async () => {
    await setToken("");
    toast.success("Logout successful!");
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-between py-2 px-[4%]">
        <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
        <button
          onClick={() => setShowLogoutModal(true)}
          className="px-5 py-2 text-xs text-white bg-gray-600 rounded-full sm:px-7 sm:py-2 sm:text-sm hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>

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
