import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";
import { Trash2, Heart, Search, ShoppingCart, Star, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import WishlistItemSkeleton from "../components/WishlistItemSkeleton";

const Wishlist = () => {
  const { wishlistItems, products, currency, removeFromWishlist, token, navigate, backendUrl } = useContext(ShopContext);
  const [wishlistData, setWishlistData] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
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
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [wishlistItems, products]);

  // Fetch ratings for all wishlist items
  useEffect(() => {
    const fetchRatings = async () => {
      const ratingPromises = wishlistData.map(async (product) => {
        try {
          const response = await axios.post(backendUrl + "/api/review/product", {
            productId: product._id,
          });
          if (response.data.success) {
            return {
              id: product._id,
              averageRating: parseFloat(response.data.averageRating),
              totalReviews: response.data.totalReviews,
            };
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      });

      const results = await Promise.all(ratingPromises);
      const ratingsMap = {};
      results.forEach((result) => {
        if (result) {
          ratingsMap[result.id] = {
            averageRating: result.averageRating,
            totalReviews: result.totalReviews,
          };
        }
      });
      setRatings(ratingsMap);
    };

    if (wishlistData.length > 0) {
      fetchRatings();
    }
  }, [wishlistData, backendUrl]);

  const handleRemoveClick = (itemId, productName) => {
    setProductToDelete({ id: itemId, name: productName });
    setShowDeleteModal(true);
  };

  const handleRemoveConfirm = () => {
    if (productToDelete) {
      removeFromWishlist(productToDelete.id);
      toast.success(t("wishlist.itemRemoved"));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleRemoveCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleAddToCart = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  const renderStars = (avgRating) => {
    const stars = [];
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <Star key="half" className="w-3 h-3 opacity-50" />
      );
    }

    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 text-gray-300" />
      );
    }

    return stars;
  };

  if (!token) {
    return (
      <div className="border-t pt-14">
        <div className="mb-6 text-2xl">
          <Title text1={t("wishlist.your")} text2={t("wishlist.wishlist")} />
        </div>
        <div className="py-20 text-center">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t("wishlist.pleaseLogin")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 pb-20">
      <div className="mb-8 text-2xl">
        <Title text1={t("wishlist.your")} text2={t("wishlist.wishlist")} />
      </div>

      {isLoading ? (
        <>
          {/* Wishlist Count Skeleton */}
          <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-48"></div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <WishlistItemSkeleton key={index} />
            ))}
          </div>
        </>
      ) : wishlistData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-16 h-16 text-pink-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {t("wishlist.noItems")}
          </h2>
          <p className="text-gray-500 mb-8 max-w-md text-lg">
            {t("wishlist.noItemsDesc")}
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-black rounded-lg hover:bg-gray-800 hover:shadow-lg"
          >
            <Search className="w-4 h-4" />
            {t("wishlist.exploreProducts")}
          </button>
        </div>
      ) : (
        <>
          {/* Wishlist Count */}
          <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
            <p className="text-gray-700">
              <span className="font-semibold text-pink-600">{wishlistData.length}</span>{" "}
              {wishlistData.length === 1 ? "item" : "items"} in your wishlist
            </p>
          </div>

          {/* Products Grid - 2 columns on mobile, like Collection */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistData.map((product, index) => {
              const rating = ratings[product._id] || { averageRating: 0, totalReviews: 0 };
              const discountedPrice = product.discount > 0 
                ? (product.price * (1 - product.discount / 100)).toFixed(2) 
                : product.price;

              return (
                <div
                  key={index}
                  className="flex flex-col rounded-xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 relative group overflow-hidden h-full"
                >
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 z-20 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
                      -%{product.discount}
                    </div>
                  )}

                  {/* Remove Button - Top Right */}
                  <button
                    onClick={() => handleRemoveClick(product._id, getProductName(product, i18n.language))}
                    className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title={t("wishlist.removeFromWishlist")}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Product Image */}
                  <Link to={`/product/${product._id}`} className="flex-shrink-0">
                    <div className="overflow-hidden aspect-square bg-gray-50">
                      <img
                        src={product.image[0]}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        alt={getProductName(product, i18n.language)}
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow p-4">
                    <Link to={`/product/${product._id}`} className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] mb-2 hover:text-pink-600 transition-colors">
                        {getProductName(product, i18n.language)}
                      </h3>
                      
                      {/* Rating */}
                      {rating.totalReviews > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(rating.averageRating)}
                          <span className="text-xs text-gray-500">({rating.totalReviews})</span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="mb-4">
                        {product.discount > 0 ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-bold text-red-600">
                              {currency} {discountedPrice}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {currency} {product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-base font-bold text-gray-800">
                            {currency} {product.price}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-black to-gray-800 text-white text-sm font-semibold rounded-lg hover:from-gray-800 hover:to-black transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t("wishlist.addToCart")}
                      </button>
                      <button
                        onClick={() => handleRemoveClick(product._id, getProductName(product, i18n.language))}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-gray-200 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t("wishlist.remove")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{t("wishlist.removeModalTitle")}</h2>
                  <p className="text-sm text-gray-500">{t("wishlist.removeModalDesc")}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-800 font-medium">{productToDelete.name}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRemoveCancel}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t("navbar.cancel")}
                </button>
                <button
                  onClick={handleRemoveConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("wishlist.remove")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
