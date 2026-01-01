/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "history"

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId ) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId,
          status: event.target.value
        },
        { headers: { token } }
      );
      if (response.data.success) {
        const newStatus = event.target.value;
        toast.success(`Order status updated to ${newStatus}`);
        if (newStatus === "Delivered") {
          toast.success("Order moved to Order History");
        }
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to update order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Filter orders based on active tab
  const activeOrders = orders.filter(order => order.status !== "Delivered");
  const historyOrders = orders.filter(order => order.status === "Delivered");
  const displayedOrders = activeTab === "active" ? activeOrders : historyOrders;

  const renderOrderCard = (order, index) => (
    <div
      className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
      key={index}
    >
      <img className="w-12" src={assets.parcel_icon} alt="" />
      <div>
        <div>
          {order.items.map((item, index) => {
            if (index === order.items.length - 1) {
              return (
                <p className="py-0.5" key={index}>
                  {item.name} x {item.quantity} <span>{item.size}</span>
                </p>
              );
            } else {
              return (
                <p className="py-0.5" key={index}>
                  {item.name} x {item.quantity} <span>{item.size}</span>,
                </p>
              );
            }
          })}
        </div>

        <p className="mt-3 mb-2 font-medium">
          {order.address.firstName + " " + order.address.lastName}
        </p>

        <div>
          <p>{order.address.street + " " + ","}</p>
          <p>
            {order.address.city +
              " " +
              ", " +
              order.address.state +
              ", " +
              order.address.country +
              ", " +
              order.address.zipcode}
          </p>
        </div>

        <p>{order.address.phone}</p>
      </div>

      <div>
        <p className="text-sm sm:text-[15px]">
          Items: {order.items.length}
        </p>
        <p className="mt-3">Method: {order.paymentMethod}</p>
        <p>Payment: {order.payment ? "Done" : "Pending"}</p>
        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
        <p className="mt-2 font-semibold">Status: {order.status}</p>
      </div>

      <p className="text-sm sm:text-[15px]">
        {currency} {order.amount}
      </p>
      
      {activeTab === "active" ? (
        <select
          onChange={(event) => statusHandler(event, order._id)}
          value={order.status}
          className="p-2 font-semibold border border-gray-300 rounded"
        >
          <option value="Order Placed">Order Placed</option>
          <option value="Packing">Packing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      ) : (
        <div className="p-2 font-semibold text-gray-600 bg-gray-100 rounded">
          {order.status}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === "active"
              ? "text-gray-900 border-b-2 border-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Orders ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === "history"
              ? "text-gray-900 border-b-2 border-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Order History ({historyOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div>
        {displayedOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              {activeTab === "active" 
                ? "No active orders yet" 
                : "No order history yet"}
            </p>
          </div>
        ) : (
          displayedOrders.map((order, index) => renderOrderCard(order, index))
        )}
      </div>
    </div>
  );
};

export default Orders;
