import { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
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

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to={"/"}>
        <img src={assets.logo} className="w-36" alt="" />
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

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>{t("navbar.about")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>{t("navbar.contact")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-gray-100 rounded-full p-1 shadow-sm">
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
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />
        <Link to={"/wishlist"}>
          <img src={assets.wishlist} alt="" />
        </Link>

        <div className="relative group">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt=""
          />
          {/* -------- Dropdown --------- */}
          {token && (
            <div className="absolute right-0 hidden pt-4 group-hover:block dropdown-menu">
              <div className="flex flex-col gap-2 px-5 py-3 text-gray-500 rounded w-36 bg-slate-100">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded text-[10px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Overlay for mobile menu */}
      {visible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] sm:hidden"
          onClick={() => setVisible(false)}
        />
      )}

      {/* Sidebar for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[9999] overflow-hidden bg-white transition-all sm:hidden ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full overflow-y-auto">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            {t("navbar.home")}
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            {t("navbar.collection")}
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            {t("navbar.about")}
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            {t("navbar.contact")}
          </NavLink>
          <div className="py-3 pl-6 border border-t-2">
            <p className="mb-3 text-sm font-semibold text-gray-700">Language / Dil</p>
            <div className="flex items-center bg-gray-100 rounded-full p-1 max-w-[140px]">
              <button
                onClick={() => {
                  changeLanguage("en");
                  setVisible(false);
                }}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 flex-1 ${
                  i18n.language === "en" 
                    ? "bg-white text-black shadow-md scale-105" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  changeLanguage("tr");
                  setVisible(false);
                }}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 flex-1 ${
                  i18n.language === "tr" 
                    ? "bg-white text-black shadow-md scale-105" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                TR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
