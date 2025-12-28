/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, addToWishList, wishlistItems, removeFromWishlist } = useContext(ShopContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const isInWishlist = wishlistItems.includes(id);

  const handleShareClick = () => {
    setShowPopup(true);
    setIsCopied(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const copyToClipboard = () => {
    const productLink = `${window.location.origin}/product/${id}`;
    navigator.clipboard.writeText(productLink).then(() => setIsCopied(true));
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishList(id);
    }
  };

  return (
    <div className="rounded-md border-[0.5px] pb-5 hover:shadow-md relative group">
      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
        <div className="overflow-hidden">
          <img
            src={image[0]}
            className="transition ease-in-out hover:scale-110"
            alt=""
          />
        </div>
        <p className="pt-3 pb-1 pl-2 text-sm">{name}</p>
        <p className="pl-2 text-sm font-medium">
          {currency} {price}
        </p>
      </Link>
      <div 
        onClick={handleWishlistClick} 
        className={`absolute flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full cursor-pointer top-3 right-3 ${
          isInWishlist 
            ? "bg-red-500 opacity-100 translate-y-0" 
            : "bg-slate-300 opacity-0 transform -translate-y-5 group-hover:opacity-100 group-hover:translate-y-0"
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={isInWishlist ? "white" : "none"} 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
      <div className="absolute flex items-center justify-center w-10 h-10 transition-all duration-300 transform -translate-y-10 rounded-full opacity-0 cursor-pointer bg-slate-300 group-hover:opacity-100 group-hover:translate-y-0 top-16 right-3">
        <img onClick={handleShareClick} src={assets.share} alt="" />
      </div>

      {/* Share Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-5 bg-white rounded-md shadow-lg w-96">
            <h2 className="mb-3 text-lg font-semibold">Share Product:</h2>
            <p className="mb-4 text-sm">
              You can share the product by copying the link below:
            </p>
            <div className="flex items-center mb-4">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/product/${id}`}
                className="flex-1 p-2 mr-2 border rounded-md"
              />
              <button
                className="px-3 py-2 text-white bg-blue-500 rounded-md"
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>
            {isCopied && <p className="text-sm text-green-500">Copied!</p>}
            <button
              className="px-4 py-2 mt-3 bg-gray-300 rounded-md"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItem;