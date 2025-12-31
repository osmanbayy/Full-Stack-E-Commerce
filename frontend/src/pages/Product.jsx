/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { motion } from "framer-motion";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, addToWishList, wishlistItems, removeFromWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  
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
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency} {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p className="text-sm font-medium text-gray-700">Select Size</p>
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
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <motion.button
              onClick={() => addToCart(productData._id, size)}
              className="px-8 py-4 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={assets.cart_icon} alt="cart" className="w-5 h-5 invert" />
              ADD TO CART
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
              {isInWishlist ? (
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z" />
                </svg>
              ) : (
                <img src={assets.wishlist} alt="wishlist" className="w-5 h-5" />
              )}
              {isInWishlist ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
            </motion.button>
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>100% Original Product</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------------- Description & Review Section------------------ */}
      <div className="mt-20">
        <div className="flex border-b border-gray-200">
          <motion.button
            className="px-6 py-3 text-sm font-semibold text-gray-700 border-b-2 border-black bg-transparent"
            whileHover={{ backgroundColor: "#f9fafb" }}
            transition={{ duration: 0.2 }}
          >
            Description
          </motion.button>
          <motion.button
            className="px-6 py-3 text-sm font-medium text-gray-500 bg-transparent hover:text-gray-700"
            whileHover={{ backgroundColor: "#f9fafb" }}
            transition={{ duration: 0.2 }}
          >
            Reviews (122)
          </motion.button>
        </div>
        <div className="flex flex-col gap-4 px-6 py-6 text-sm text-gray-500 border border-t-0 rounded-b-md">
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
