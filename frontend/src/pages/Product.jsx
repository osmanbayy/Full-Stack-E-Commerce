/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";
import axios from "axios";
import toast from "react-hot-toast";
import { Star, ShoppingCart, Heart, Check } from "lucide-react";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, addToWishList, wishlistItems, removeFromWishlist, backendUrl, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
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
    await products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

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
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
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
            {currency} {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
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
            <motion.button
              onClick={() => addToCart(productData._id, size)}
              className="flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white transition-all duration-200 bg-black rounded-md shadow-md hover:bg-gray-800 hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ShoppingCart className="w-5 h-5" />
              {t("product.addToCart")}
            </motion.button>
            <motion.button
              onClick={handleWishlistClick}
              className={`px-8 py-4 text-sm font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                isInWishlist
                  ? "bg-red-50 text-red-600 border-2 border-red-300 hover:bg-red-100 hover:border-red-400"
                  : "text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-600 text-red-600" : ""}`} />
              {isInWishlist ? t("product.removeFromWishlist") : t("product.addToWishlist")}
            </motion.button>
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
            <>
              <p>
                An e-commerce website is an online platform that facilities the
                buying and selling of products or services over the internet. It
                serves as a virtual marketplace wehere businesses and individuals
                can showcase their products, interact with customers, and conduct
                transactions without the nedd for a physical presence. E-commerce
                websites have gained immense popularity due to their convenience,
                accessibility, and the global reach they offer.
              </p>
              <p>
                E-commerce websites typically display products or services along
                with detailed descriptions, images, prices, and any available
                variations (e.g., sizes,colors). Each product usually has its own
                dedicated page with relevant information.
              </p>
            </>
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
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-400">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      {review.review && (
                        <p className="text-sm text-gray-600">{review.review}</p>
                      )}
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
