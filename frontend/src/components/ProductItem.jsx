/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, addToWishList } = useContext(ShopContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
      <div onClick={()=> addToWishList(id)} className="absolute flex items-center justify-center w-10 h-10 transition-all duration-300 transform -translate-y-5 rounded-full opacity-0 cursor-pointer bg-slate-300 group-hover:opacity-100 group-hover:translate-y-0 top-3 right-3">
        <img src={assets.wishlist} alt="" />
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