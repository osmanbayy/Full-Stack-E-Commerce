/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (search && showSearch) {
      if (!location.pathname.includes('collection')) {
        navigate('/collection');
      }
    }
  }, [search, showSearch, location.pathname, navigate]);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearch = () => {
    if (search.trim()) {
      if (!location.pathname.includes('collection')) {
        navigate('/collection');
      }
      
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      handleSearch();
    }
    
    if (e.key === 'Escape') {
      setShowSearch(false);
      setSearch("");
    }
  };

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            setShowSearch(false);
            setSearch("");
          }}
        >
          <motion.div
            className="relative w-full max-w-2xl mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-full px-5 py-4 bg-white rounded-full shadow-lg">
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                className="flex-1 text-base outline-none bg-transparent"
                placeholder={t("search.placeholder")}
              />
              <motion.div
                onClick={handleSearch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Search className="w-5 h-5 mr-3 cursor-pointer" />
              </motion.div>
              <div
                onClick={() => {
                  setShowSearch(false);
                  setSearch("");
                }}
                className="cursor-pointer"
              >
                <X className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
