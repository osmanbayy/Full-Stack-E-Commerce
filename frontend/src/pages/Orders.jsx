/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";
import RatingModal from "../components/RatingModal";
import { motion } from "framer-motion";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const { t, i18n } = useTranslation();

  const [orderData, setOrderData] = useState([]);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, productId: null, productName: null });

  const getStatusTranslation = (status) => {
    const statusMap = {
      "Order Placed": t("orders.orderPlaced"),
      "Packing": t("orders.packing"),
      "Shipped": t("orders.shipped"),
      "Out for Delivery": t("orders.outForDelivery"),
      "Delivered": t("orders.delivered")
    };
    return statusMap[status] || status;
  };

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + "/api/order/user-orders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItems = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItems.push(item);
          });
        });
        setOrderData(allOrdersItems.reverse());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const handleOpenRatingModal = (productId, productName) => {
    setRatingModal({ isOpen: true, productId, productName });
  };

  const handleCloseRatingModal = () => {
    setRatingModal({ isOpen: false, productId: null, productName: null });
  };

  const handleRatingSubmitted = () => {
    // Refresh order data after rating is submitted
    loadOrderData();
  };

  const isDelivered = (status) => {
    return status === "Delivered";
  };

  return (
    <div className="pt-16 border-t">
      <div className="text-2xl">
        <Title text1={t("orders.myOrders").split(" ")[0]} text2={t("orders.myOrders").split(" ").slice(1).join(" ")} />
      </div>

      <div className="">
        {orderData.map((item, index) => 
          <div
            key={index}
            className="flex flex-col gap-4 py-4 text-gray-700 border-t border-b md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-6 text-sm">
              <img src={item.image[0]} className="w-16 sm:w-20" alt="" />
              <div>
                <p className="font-medium sm:text-base">{getProductName(item, i18n.language)}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p className="text-lg">
                    {currency}
                    {item.price}
                  </p>
                  <p>{t("orders.quantity")}: {item.quantity}</p>
                  <p>{t("orders.size")}: {item.size}</p>
                </div>
                <p className="mt-1">
                  {t("orders.date")}: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                </p>
                <p className="mt-1">
                  {t("orders.payment")}: <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:justify-between md:w-1/2 md:items-center">
              <div className="flex items-center gap-2">
                <p className="h-2 bg-green-500 rounded-full min-w-2"></p>
                <p className="text-sm md:text-base">{getStatusTranslation(item.status)}</p>
              </div>
              <div className="flex gap-2">
                {isDelivered(item.status) && (
                  <motion.button
                    onClick={() => handleOpenRatingModal(item._id, getProductName(item, i18n.language))}
                    className="px-4 py-2 text-sm font-medium text-white bg-black rounded-sm hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("orders.rateProduct")}
                  </motion.button>
                )}
                <button onClick={loadOrderData} className="px-4 py-2 text-sm font-medium border rounded-sm hover:bg-gray-50 transition-colors">
                  {t("orders.trackOrder")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={handleCloseRatingModal}
        productId={ratingModal.productId}
        productName={ratingModal.productName}
        onRatingSubmitted={handleRatingSubmitted}
        backendUrl={backendUrl}
        token={token}
      />
    </div>
  );
};

export default Orders;
