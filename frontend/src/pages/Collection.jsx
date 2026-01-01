/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import ProductItemSkeleton from "../components/ProductItemSkeleton";
import { useTranslation } from "react-i18next";
import { searchProducts, getProductName } from "../utils/productTranslations";
import { motion, AnimatePresence } from "framer-motion";

const Collection = () => {
  const { products, search, showSearch, isLoadingProducts } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [productType, setProductType] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);
  const { t, i18n } = useTranslation();

  const toggleCategory = (event) => {
    if (category.includes(event.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== event.target.value));
    } else {
      setCategory((prev) => [...prev, event.target.value]);
    }
  };

  const toggleSubCategory = (event) => {
    if (subCategory.includes(event.target.value)) {
      setSubCategory((prev) =>
        prev.filter((item) => item !== event.target.value)
      );
    } else {
      setSubCategory((prev) => [...prev, event.target.value]);
    }
  };

  const toggleProductType = (event) => {
    if (productType.includes(event.target.value)) {
      setProductType((prev) =>
        prev.filter((item) => item !== event.target.value)
      );
    } else {
      setProductType((prev) => [...prev, event.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (search) {
      // Use multilingual search function
      productsCopy = searchProducts(productsCopy, search);
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    if (productType.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        productType.includes(item.productType)
      );
    }
    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let filterProductCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(filterProductCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(filterProductCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  useEffect(() => {
    applyFilter();
}, [category, subCategory, productType, search, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { value: "relevant", label: t("collection.relevant") },
    { value: "low-high", label: t("collection.lowToHigh") },
    { value: "high-low", label: t("collection.highToLow") },
  ];

  const selectedSortLabel = sortOptions.find(opt => opt.value === sortType)?.label || sortOptions[0].label;

  const handleSortSelect = (value) => {
    setSortType(value);
    setShowSortDropdown(false);
  };

  return (
    <div className="flex flex-col gap-1 pt-10 border-t sm:flex-row sm:gap-10">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 my-2 text-xl cursor-pointer"
        >
          {t("collection.filters")}
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        {/* Catogory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">{t("collection.categories")}</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Men"}
                onChange={toggleCategory}
              />{" "}
              {t("collection.men")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Women"}
                onChange={toggleCategory}
              />{" "}
              {t("collection.women")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Kids"}
                onChange={toggleCategory}
              />{" "}
              {t("collection.kids")}
            </p>
          </div>
        </div>
        {/* Subcategory filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">{t("collection.type")}</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />
              {t("collection.topwear")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />
              {t("collection.bottomwear")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />
              {t("collection.winterwear")}
            </p>
          </div>
        </div>
        {/* Product Type filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">{t("collection.productType")}</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700 max-h-60 overflow-y-auto">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"T-Shirt"}
                onChange={toggleProductType}
              />
              {t("collection.tShirt")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Jacket"}
                onChange={toggleProductType}
              />
              {t("collection.jacket")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Sweater"}
                onChange={toggleProductType}
              />
              {t("collection.sweater")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Shoes"}
                onChange={toggleProductType}
              />
              {t("collection.shoes")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Pants"}
                onChange={toggleProductType}
              />
              {t("collection.pants")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Dress"}
                onChange={toggleProductType}
              />
              {t("collection.dress")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Shirt"}
                onChange={toggleProductType}
              />
              {t("collection.shirt")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Jeans"}
                onChange={toggleProductType}
              />
              {t("collection.jeans")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Hoodie"}
                onChange={toggleProductType}
              />
              {t("collection.hoodie")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Shorts"}
                onChange={toggleProductType}
              />
              {t("collection.shorts")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Skirt"}
                onChange={toggleProductType}
              />
              {t("collection.skirt")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Coat"}
                onChange={toggleProductType}
              />
              {t("collection.coat")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Boots"}
                onChange={toggleProductType}
              />
              {t("collection.boots")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Sneakers"}
                onChange={toggleProductType}
              />
              {t("collection.sneakers")}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4 text-base sm:text-2xl">
          <Title text1={t("collection.allCollections").split(" ")[0]} text2={t("collection.allCollections").split(" ").slice(1).join(" ")} />
          {/* Product Sort - Custom Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <motion.button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center justify-between gap-3 bg-white border-2 border-gray-300 rounded-lg px-4 py-2.5 pr-3 text-sm font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black min-w-[160px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{selectedSortLabel}</span>
              <motion.svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: showSortDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>
            
            {/* Dropdown Options */}
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  className="absolute right-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {sortOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                        sortType === option.value
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${index !== sortOptions.length - 1 ? "border-b border-gray-200" : ""}`}
                      whileHover={{ backgroundColor: sortType === option.value ? "#000" : "#f3f4f6" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Map Products */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductItemSkeleton key={index} />
            ))}
          </div>
        ) : filterProducts.length === 0 && search ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl font-medium text-gray-500 mb-2">{t("collection.noItemsFound")}</p>
            <p className="text-sm text-gray-400">
              {t("collection.tryAdjusting")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
             {filterProducts.map((item, index) => (
               <ProductItem
                 key={index}
                 name={getProductName(item, i18n.language)}
                 id={item._id}
                 price={item.price}
                 image={item.image}
               />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
