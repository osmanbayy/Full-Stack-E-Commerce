import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";
import { Trash2, Heart, Search } from "lucide-react";

const Wishlist = () => {
  const { wishlistItems, products, currency, removeFromWishlist, token, navigate } = useContext(ShopContext);
  const [wishlistData, setWishlistData] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (products.length > 0 && wishlistItems.length > 0) {
      const tempData = wishlistItems
        .map((itemId) => {
          const product = products.find((p) => p._id === itemId);
          return product ? { ...product } : null;
        })
        .filter((item) => item !== null);
      setWishlistData(tempData);
    } else {
      setWishlistData([]);
    }
  }, [wishlistItems, products]);

  const handleRemove = (itemId) => {
    removeFromWishlist(itemId);
  };

  const handleAddToCart = (itemId) => {
    // Navigate to product page where user can select size and add to cart
    navigate(`/product/${itemId}`);
  };

  if (!token) {
    return (
      <div className="border-t pt-14">
        <div className="mb-3 text-2xl">
          <Title text1={t("wishlist.your")} text2={t("wishlist.wishlist")} />
        </div>
        <div className="py-10 text-center">
          <p className="text-gray-500">{t("wishlist.pleaseLogin")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14">
      <div className="mb-3 text-2xl">
        <Title text1={t("wishlist.your")} text2={t("wishlist.wishlist")} />
      </div>

      {wishlistData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-24 h-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            {t("wishlist.noItems")}
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            {t("wishlist.noItemsDesc")}
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white transition-all bg-black rounded-lg hover:bg-gray-800 hover:shadow-lg"
          >
            <Search className="w-5 h-5" />
            {t("wishlist.exploreProducts")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlistData.map((product, index) => (
            <div
              key={index}
              className="rounded-md border-[0.5px] pb-5 hover:shadow-md relative group"
            >
              <Link to={`/product/${product._id}`} className="text-gray-700 cursor-pointer">
                <div className="overflow-hidden">
                  <img
                    src={product.image[0]}
                    className="transition duration-500 ease-in-out hover:scale-110"
                    alt={getProductName(product, i18n.language)}
                  />
                </div>
                <p className="pt-3 pb-1 pl-2 text-sm">{getProductName(product, i18n.language)}</p>
                <p className="pl-2 text-sm font-medium">
                  {currency} {product.price}
                </p>
              </Link>
              <div className="flex gap-2 px-2 mt-2">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="flex-1 px-3 py-2 text-sm text-white transition-all bg-black hover:bg-gray-800"
                >
                  {t("wishlist.addToCart")}
                </button>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="px-3 py-2 text-sm text-white"
                  title={t("wishlist.removeFromWishlist")}
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
