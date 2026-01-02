import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSkeleton";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";
import { useNavigate } from "react-router-dom";

const LatestCollection = () => {
  const { products, isLoadingProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      // Sort products by date (newest first) and take the latest 10
      const sortedProducts = [...products].sort((a, b) => (b.date || 0) - (a.date || 0));
      setLatestProducts(sortedProducts.slice(0, 10));
    } else {
      setLatestProducts([]);
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={t("home.latestCollections").split(" ")[0]} text2={t("home.latestCollections").split(" ").slice(1).join(" ")} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base italic font-semibold">
          {t("home.latestCollectionsDesc")}
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {isLoadingProducts ? (
          Array.from({ length: 10 }).map((_, index) => (
            <ProductItemSkeleton key={index} />
          ))
        ) : latestProducts.length > 0 ? (
          latestProducts.map((item, index) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={getProductName(item, i18n.language)}
              price={item.price}
              discount={item.discount || 0}
            />
          ))
        ) : null}
      </div>

      {/* Browse All Collections Button */}
      {!isLoadingProducts && latestProducts.length > 0 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/collection")}
            className="group relative px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-400 hover:bg-gray-50"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("home.browseAllCollections")}
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestCollection;
