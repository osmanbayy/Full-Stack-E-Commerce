import { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingCart, Menu, ChevronLeft, UserCircle, Package, LogOut, ChevronRight, Home, ShoppingBag, Info, Mail } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { t, i18n } = useTranslation();

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to={"/"}>
        <img src={assets.logo} className="-ml-5 w-36" alt="logo" />
      </Link>

      <ul className="hidden gap-5 text-sm text-gray-700 sm:flex">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>{t("navbar.home")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>{t("navbar.collection")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/faq" className="flex flex-col items-center gap-1">
          <p>{t("navbar.about")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>{t("navbar.contact")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {/* Language Selector - Visible on all screens */}
        <div className="items-center flex p-1 bg-gray-100 rounded-full shadow-sm">
          <button
            onClick={() => changeLanguage("en")}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
              i18n.language === "en" 
                ? "bg-white text-black shadow-md scale-105" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("tr")}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
              i18n.language === "tr" 
                ? "bg-white text-black shadow-md scale-105" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            TR
          </button>
        </div>
        
        {/* Search - Visible on all screens */}
        <Search
          onClick={() => setShowSearch(true)}
          className="w-5 h-5 cursor-pointer"
        />
        
        {/* Wishlist - Hidden on mobile, visible on desktop */}
        <Link to={"/wishlist"} className="hidden sm:block">
          <Heart className="w-5 h-5" />
        </Link>

        {/* User Profile - Visible on all screens */}
        <div className="relative group">
          <User
            onClick={() => {
              if (!token) {
                navigate("/login");
              } else {
                // Toggle dropdown on mobile, hover on desktop
                setShowUserDropdown(!showUserDropdown);
              }
            }}
            className="w-5 h-5 cursor-pointer transition-colors hover:text-gray-700"
          />
          {/* -------- Modern Dropdown --------- */}
          {token && (
            <>
              {/* Desktop Dropdown - Hover */}
              <div className="absolute right-0 hidden pt-4 sm:group-hover:block dropdown-menu z-50 transition-all duration-200 opacity-0 sm:group-hover:opacity-100">
                <div className="flex flex-col gap-1 px-2 py-2 text-sm text-gray-700 rounded-xl w-48 bg-white shadow-2xl border border-gray-100 overflow-hidden">
                  <div
                    onClick={() => navigate("/my-profile")}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-black hover:translate-x-1 group/item"
                  >
                    <UserCircle className="w-4 h-4 text-gray-500 group-hover/item:text-black transition-colors" />
                    <span className="flex-1 font-medium">{t("navbar.myProfile")}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </div>
                  
                  <div
                    onClick={() => navigate("/orders")}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-black hover:translate-x-1 group/item"
                  >
                    <Package className="w-4 h-4 text-gray-500 group-hover/item:text-black transition-colors" />
                    <span className="flex-1 font-medium">{t("navbar.orders")}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="h-px bg-gray-200 my-1 mx-2" />
                  
                  <div
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:translate-x-1 group/item"
                  >
                    <LogOut className="w-4 h-4 text-gray-500 group-hover/item:text-red-600 transition-colors" />
                    <span className="flex-1 font-medium">{t("navbar.logout")}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
              
              {/* Mobile Dropdown - Click */}
              {showUserDropdown && (
                <div className="absolute right-0 pt-4 sm:hidden z-50">
                  <div className="flex flex-col gap-1 px-2 py-2 text-sm text-gray-700 rounded-xl w-48 bg-white shadow-2xl border border-gray-100 overflow-hidden">
                    <div
                      onClick={() => {
                        navigate("/my-profile");
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-black hover:translate-x-1"
                    >
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      <span className="flex-1 font-medium">{t("navbar.myProfile")}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div
                      onClick={() => {
                        navigate("/orders");
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-black hover:translate-x-1"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="flex-1 font-medium">{t("navbar.orders")}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="h-px bg-gray-200 my-1 mx-2" />
                    
                    {/* Wishlist - Mobile only in dropdown */}
                    <Link
                      to="/wishlist"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-black hover:translate-x-1 min-w-0"
                    >
                      <Heart className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="flex-1 font-medium truncate">{t("wishlist.yourWishlist")}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </Link>
                    
                    {/* Cart - Mobile only in dropdown */}
                    <Link
                      to="/cart"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-black hover:translate-x-1 min-w-0"
                    >
                      <ShoppingCart className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="flex-1 font-medium truncate">{t("cart.myCart")}</span>
                      {getCartCount() > 0 && (
                        <span className="w-5 h-5 text-center leading-5 bg-black text-white text-xs rounded-full flex-shrink-0">
                          {getCartCount()}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </Link>
                    
                    <div className="h-px bg-gray-200 my-1 mx-2" />
                    
                    <div
                      onClick={() => {
                        handleLogoutClick();
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:translate-x-1"
                    >
                      <LogOut className="w-4 h-4 text-gray-500" />
                      <span className="flex-1 font-medium">{t("navbar.logout")}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Cart - Hidden on mobile, visible on desktop */}
        <Link to="/cart" className="relative hidden sm:block">
          <ShoppingCart className="w-5 h-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded text-[10px]">
            {getCartCount()}
          </p>
        </Link>
        
        {/* Hamburger Menu - Visible only on mobile */}
        <Menu
          onClick={() => setVisible(true)}
          className="w-5 h-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* Overlay for mobile menu */}
      {visible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] sm:hidden"
          onClick={() => setVisible(false)}
        />
      )}
      
      {/* Overlay for user dropdown on mobile */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[49] sm:hidden"
          onClick={() => setShowUserDropdown(false)}
        />
      )}

      {/* Sidebar for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[9999] overflow-hidden bg-white transition-all sm:hidden ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <p>{t("navbar.back")}</p>
          </div>
          
          {/* Navigation Links */}
          <NavLink
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 py-2 pl-6 border"
            to="/"
          >
            <Home className="w-5 h-5" />
            <span>{t("navbar.home")}</span>
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 py-2 pl-6 border"
            to="/collection"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t("navbar.collection")}</span>
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 py-2 pl-6 border"
            to="/faq"
          >
            <Info className="w-5 h-5" />
            <span>{t("navbar.about")}</span>
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 py-2 pl-6 border"
            to="/contact"
          >
            <Mail className="w-5 h-5" />
            <span>{t("navbar.contact")}</span>
          </NavLink>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-[10000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={cancelLogout}
            />
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  {t("navbar.logoutConfirm")}
                </h3>
                <p className="mb-6 text-gray-600">
                  {t("navbar.logoutMessage")}
                </p>
                <div className="flex justify-end gap-3">
                  <motion.button
                    onClick={cancelLogout}
                    className="px-6 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("navbar.cancel")}
                  </motion.button>
                  <motion.button
                    onClick={logout}
                    className="px-6 py-2 text-sm font-medium text-white transition-colors bg-black rounded-md hover:bg-gray-800"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("navbar.yes")}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
