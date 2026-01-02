/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getProductName, getProductDescription } from "../utils/productTranslations";
import axios from "axios";
import toast from "react-hot-toast";
import { Star, ShoppingCart, Heart, Check, Loader2 } from "lucide-react";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, addToWishList, wishlistItems, removeFromWishlist, backendUrl, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageRef, setImageRef] = useState(null);
  const { t, i18n } = useTranslation();
  
  const isInWishlist = productData ? wishlistItems.includes(productData._id) : false;
  
  const handleWishlistClick = () => {
    if (isInWishlist) {
      removeFromWishlist(productData._id);
    } else {
      addToWishList(productData._id);
    }
  };

  const fetchProductData = async () => {
    setIsLoading(true);
    
    // First try to get from context (faster)
    const contextProduct = products.find((item) => item._id === productId);
    if (contextProduct) {
      setProductData(contextProduct);
      setImage(contextProduct.image[0]);
      setIsLoading(false);
      return;
    }
    
    // Then fetch from backend to ensure we have the latest data
    try {
      const response = await axios.post(backendUrl + "/api/product/single", {
        productId,
      });
      if (response.data.success && response.data.product) {
        setProductData(response.data.product);
        setImage(response.data.product.image[0]);
      } else {
        // Product not found
        setProductData(null);
        setTimeout(() => {
          navigate("/404");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setProductData(null);
      setTimeout(() => {
        navigate("/404");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/review/product", {
        productId,
      });
      if (response.data.success) {
        setRating({
          averageRating: parseFloat(response.data.averageRating),
          totalReviews: response.data.totalReviews,
        });
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderStars = (avgRating, clickable = false, onStarClick = null) => {
    const stars = [];
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 cursor-pointer fill-yellow-400 text-yellow-400"
            onClick={clickable && onStarClick ? () => onStarClick(i) : undefined}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 opacity-50 cursor-pointer"
            onClick={clickable && onStarClick ? () => onStarClick(i) : undefined}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 cursor-pointer text-gray-300"
            onClick={clickable && onStarClick ? () => onStarClick(i) : undefined}
          />
        );
      }
    }

    return stars;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Product not found state
  if (!productData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/collection")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to 404 page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return productData ? (
    <div className="pt-10 transition-opacity duration-500 ease-in border-t-2 opacity-100">
      {/* ------------------- Product Data ------------------- */}
      <div className="flex flex-col gap-12 sm:gap-12 sm:flex-row">
        {/* ------------------- Product Images ------------------- */}
        <div className="flex flex-col-reverse flex-1 gap-3 sm:flex-row">
          <div className="flex sm:flex-col justify-between overflow-x-auto sm:overflow-y-scroll sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24.7%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          {/* -------------  Main image  --------------- */}
          <div 
            className="w-full sm:w-[80%] relative overflow-hidden cursor-zoom-in group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={(e) => {
              if (imageRef && window.innerWidth >= 640) { // Only on desktop
                const rect = imageRef.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePosition({ x, y });
              }
            }}
          >
            <img 
              ref={setImageRef}
              src={image} 
              className="w-full h-auto transition-transform duration-300 ease-out" 
              alt=""
              style={{
                transform: isHovering && window.innerWidth >= 640 ? `scale(3)` : 'scale(1)',
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              }}
            />
            {/* Magnifier lens overlay - Desktop only */}
            {isHovering && window.innerWidth >= 640 && (
              <>
                {/* Lens border */}
                <div 
                  className="absolute pointer-events-none border-2 border-white shadow-2xl"
                  style={{
                    width: '150px',
                    height: '150px',
                    left: `${mousePosition.x}%`,
                    top: `${mousePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    zIndex: 20,
                    boxShadow: '0 0 0 2px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Inner circle indicator */}
                  <div 
                    className="absolute inset-0 rounded-full border border-white/50"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
                    }}
                  ></div>
                </div>
                {/* Zoom hint */}
                <div 
                  className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-medium pointer-events-none z-30 backdrop-blur-sm"
                >
                  🔍 Zoom
                </div>
              </>
            )}
          </div>
        </div>
        {/* ------------- Product Info -------------- */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{getProductName(productData, i18n.language)}</h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(rating.averageRating)}
            {rating.totalReviews > 0 && (
              <p className="pl-2 text-sm text-gray-600">
                ({rating.totalReviews})
              </p>
            )}
          </div>
          <p className="mt-5 text-3xl font-medium">
            {productData.discount > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-red-600">
                  {currency} {(productData.price * (1 - productData.discount / 100)).toFixed(2)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {currency} {productData.price}
                </span>
                <span className="px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded">
                  %{productData.discount} OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">
                {currency} {productData.price}
              </span>
            )}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {getProductDescription(productData, i18n.language)}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p className="text-sm font-medium text-gray-700">{t("product.selectSize")}</p>
            <div className="flex flex-wrap gap-3">
              {productData.sizes.map((item, index) => (
                <motion.button
                  onClick={() => setSize(item)}
                  className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 rounded-md flex items-center gap-2 ${
                    item === size
                      ? "bg-black text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item === size && (
                    <Check className="w-4 h-4" />
                  )}
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => addToCart(productData._id, size)}
              className="flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white transition-all duration-200 bg-black rounded-md shadow-md hover:bg-gray-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart className="w-5 h-5" />
              {t("product.addToCart")}
            </button>
            <button
              onClick={handleWishlistClick}
              className={`px-8 py-4 text-sm font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                isInWishlist
                  ? "bg-red-50 text-red-600 border-2 border-red-300 hover:bg-red-100 hover:border-red-400"
                  : "text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-600 text-red-600" : ""}`} />
              {isInWishlist ? t("product.removeFromWishlist") : t("product.addToWishlist")}
            </button>
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>{t("product.originalProduct")}</p>
            <p>{t("product.cashOnDelivery")}</p>
            <p>{t("product.returnPolicy")}</p>
          </div>
        </div>
      </div>

      {/* ---------------- Description & Review Section------------------ */}
      <div className="mt-20">
        <div className="flex border-b border-gray-200">
          <motion.button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 text-sm font-semibold ${
              activeTab === "description"
                ? "text-gray-700 border-b-2 border-black"
                : "text-gray-500 bg-transparent hover:text-gray-700"
            }`}
            whileHover={{ backgroundColor: "#f9fafb" }}
            transition={{ duration: 0.2 }}
          >
            {t("product.description")}
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "reviews"
                ? "text-gray-700 border-b-2 border-black"
                : "text-gray-500 bg-transparent hover:text-gray-700"
            }`}
            whileHover={{ backgroundColor: "#f9fafb" }}
            transition={{ duration: 0.2 }}
          >
            {t("product.reviews")} ({rating.totalReviews})
          </motion.button>
        </div>
        <div className="flex flex-col gap-4 px-6 py-6 text-sm text-gray-500 border border-t-0 rounded-b-md">
          {activeTab === "description" ? (
            <p className="whitespace-pre-line">
              {productData ? getProductDescription(productData, i18n.language) : ""}
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Info Message */}
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <p className="text-sm text-blue-800">
                  {t("product.onlyPurchased")}
                </p>
              </div>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        {/* User Avatar with Initials */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                          {getInitials(review.userName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-400">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          {review.review && (
                            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                              {review.review}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">{t("product.noReviews")}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ------------- display related products -------------- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
