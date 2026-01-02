/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Star, Heart, Share2 } from "lucide-react";

const ProductItem = ({ id, image, name, price, discount = 0 }) => {
  const { currency, addToWishList, wishlistItems, removeFromWishlist, backendUrl } = useContext(ShopContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });

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

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.post(backendUrl + "/api/review/product", {
          productId: id,
        });
        if (response.data.success) {
          setRating({
            averageRating: parseFloat(response.data.averageRating),
            totalReviews: response.data.totalReviews,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRating();
  }, [id, backendUrl]);

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

  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <div className="flex flex-col rounded-md border-[0.5px] pb-5 hover:shadow-md relative group h-full">
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
          - %{discount}
        </div>
      )}
      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer flex flex-col h-full">
        <div className="overflow-hidden aspect-square">
          <img
            src={image[0]}
            className="w-full h-full object-cover transition ease-in-out hover:scale-110"
            alt=""
          />
        </div>
        <div className="flex flex-col flex-grow pt-3">
          <p className="pb-1 pl-2 text-sm line-clamp-2 min-h-[2.5rem]">{name}</p>
          <div className="flex items-center gap-1 pl-2 mb-1">
            {renderStars(rating.averageRating)}
            <span className="text-xs text-gray-500">({rating.totalReviews})</span>
          </div>
          <div className="pl-2 mt-auto">
            {discount > 0 ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-red-600">
                  {currency} {discountedPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 line-through">
                  {currency} {price}
                </p>
              </div>
            ) : (
              <p className="text-sm font-medium">
                {currency} {price}
              </p>
            )}
          </div>
        </div>
      </Link>
      <div
        onClick={handleWishlistClick}
        className={`absolute flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full cursor-pointer top-3 right-3 bg-white shadow-md ${isInWishlist
            ? "opacity-100 translate-y-0"
            : "opacity-0 transform -translate-y-5 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
      >
        <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-600 text-red-600" : "text-black"}`} />
      </div>
      <div className="absolute flex items-center justify-center w-10 h-10 transition-all duration-300 transform -translate-y-10 rounded-full opacity-0 cursor-pointer bg-white shadow-md group-hover:opacity-100 group-hover:translate-y-0 top-16 right-3">
        <Share2 onClick={handleShareClick} className="w-5 h-5" />
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