/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

const RatingModal = ({ isOpen, onClose, productId, productName, onRatingSubmitted, backendUrl, token }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/review/add",
        {
          productId,
          rating: userRating,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(t("product.ratingSubmitted"));
        setUserRating(0);
        onRatingSubmitted();
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (clickable = true) => {
    const stars = [];
    const ratingToShow = hoveredRating || userRating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.div
          key={i}
          onClick={clickable ? () => setUserRating(i) : undefined}
          onMouseEnter={clickable ? () => setHoveredRating(i) : undefined}
          onMouseLeave={clickable ? () => setHoveredRating(0) : undefined}
          whileHover={clickable ? { scale: 1.1 } : {}}
          whileTap={clickable ? { scale: 0.95 } : {}}
        >
          <Star
            className={`w-8 h-8 cursor-pointer transition-all ${
              i <= ratingToShow
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </motion.div>
      );
    }

    return stars;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-[10000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("product.rateProduct")}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{productName}</p>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                {renderStars()}
              </div>

              {userRating > 0 && (
                <p className="text-center text-sm text-gray-500 mb-4">
                  {t("product.yourRating")}: {userRating} / 5
                </p>
              )}

              <div className="flex gap-3 justify-end">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {t("navbar.cancel")}
                </motion.button>
                <motion.button
                  onClick={handleRatingSubmit}
                  className="px-6 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || userRating === 0}
                >
                  {isSubmitting ? t("profile.loading") : t("product.submitRating")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;


