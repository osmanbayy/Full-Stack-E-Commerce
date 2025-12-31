/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Arama yapıldığında Collection sayfasına yönlendir
  useEffect(() => {
    if (search && showSearch) {
      // Eğer Collection sayfasında değilsek, yönlendir
      if (!location.pathname.includes('collection')) {
        navigate('/collection');
      }
    }
  }, [search, showSearch, location.pathname, navigate]);

  // SearchBar açıldığında input'a focus yap
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      // Enter'a basıldığında Collection sayfasına yönlendir
      if (!location.pathname.includes('collection')) {
        navigate('/collection');
      }
    }
  };

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          className="text-center border-t border-b bg-gray-50"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-3/4 px-5 py-2 mx-3 my-5 border border-gray-400 rounded-full sm:w-1/2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              className="flex-1 text-sm outline-none bg-inherit "
              placeholder="Search products..."
            />
            <img src={assets.search_icon} className="w-4" alt="" />
          </motion.div>
          <motion.img
            onClick={() => {
              setShowSearch(false);
              setSearch("");
            }}
            src={assets.cross_icon}
            className="inline w-3 cursor-pointer"
            alt=""
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
