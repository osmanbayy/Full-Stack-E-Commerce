/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../App";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { AlertTriangle, X, Search, XCircle } from "lucide-react";

const Orders = ({ token }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "history"
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null); // { orderId, newStatus, currentStatus }

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

  const handleStatusChange = (event, orderId, currentStatus) => {
    const newStatus = event.target.value;
    if (newStatus === currentStatus) {
      return; // No change, do nothing
    }
    setPendingStatusChange({ orderId, newStatus, currentStatus });
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId: pendingStatusChange.orderId,
          status: pendingStatusChange.newStatus
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(`Order status updated to ${pendingStatusChange.newStatus}`);
        if (pendingStatusChange.newStatus === "Delivered") {
          toast.success("Order moved to Order History");
        }
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setShowStatusModal(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setShowStatusModal(false);
    setPendingStatusChange(null);
    // Reset select to current status by refreshing orders
    fetchAllOrders();
  };

  const paymentHandler = async (event, orderId) => {
    try {
      const paymentStatus = event.target.value === "true";
      const response = await axios.post(
        backendUrl + "/api/order/payment",
        {
          orderId,
          payment: paymentStatus
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update payment status");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to update payment status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Filter orders based on active tab
  const activeOrders = orders.filter(order => order.status !== "Delivered");
  const historyOrders = orders.filter(order => order.status === "Delivered");
  const tabFilteredOrders = activeTab === "active" ? activeOrders : historyOrders;

  // Filter by search query (tracking number)
  const displayedOrders = searchQuery
    ? tabFilteredOrders.filter(order => 
        order.trackingNumber && 
        order.trackingNumber.toUpperCase().includes(searchQuery.toUpperCase())
      )
    : tabFilteredOrders;

  const clearSearch = () => {
    setSearchParams({});
  };

  const trackingNumberHandler = async (event, orderId) => {
    const newTrackingNumber = event.target.value.trim().toUpperCase();
    if (!newTrackingNumber) {
      toast.error("Tracking number cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/tracking-number",
        {
          orderId,
          trackingNumber: newTrackingNumber,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Tracking number updated!");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update tracking number");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update tracking number");
    }
  };

  const renderOrderCard = (order, index) => (
    <div
      className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
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
        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
        <p className="mt-2 font-semibold">Status: {order.status}</p>
      </div>

      <p className="text-sm sm:text-[15px]">
        {currency} {order.amount}
      </p>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-600">Order Number</label>
        <input
          type="text"
          value={order.trackingNumber || ""}
          onChange={(event) => trackingNumberHandler(event, order._id)}
          placeholder="TRK123456789"
          className="p-2 font-semibold border border-gray-300 rounded bg-blue-50 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ textTransform: "uppercase" }}
        />
        {order.trackingNumber && (
          <p className="text-xs text-gray-500">Click to edit</p>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-600">Payment Status</label>
        <select
          onChange={(event) => paymentHandler(event, order._id)}
          value={order.payment ? "true" : "false"}
          className={`p-2 font-semibold border border-gray-300 rounded ${
            order.payment ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
          }`}
        >
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>
      </div>
      
      {activeTab === "active" ? (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600">Order Status</label>
          <select
            onChange={(event) => handleStatusChange(event, order._id, order.status)}
            value={order.status}
            className="p-2 font-semibold border border-gray-300 rounded"
          >
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600">Order Status</label>
          <div className="p-2 font-semibold text-gray-600 bg-gray-100 rounded">
            {order.status}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Orders Management</h1>
            <p className="text-gray-500">View and manage customer orders</p>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Search className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">
                Searching: <span className="font-mono">{searchQuery}</span>
              </span>
              <button
                onClick={clearSearch}
                className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                title="Clear search"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
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
            {searchQuery ? (
              <div>
                <p className="text-lg text-gray-500 mb-2">
                  No orders found with tracking number: <span className="font-mono font-semibold">{searchQuery}</span>
                </p>
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Clear search and show all orders
                </button>
              </div>
            ) : (
              <p className="text-lg text-gray-500">
                {activeTab === "active" 
                  ? "No active orders yet" 
                  : "No order history yet"}
              </p>
            )}
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Found <span className="font-semibold">{displayedOrders.length}</span> order{displayedOrders.length !== 1 ? "s" : ""} matching <span className="font-mono">{searchQuery}</span>
                </p>
              </div>
            )}
            {displayedOrders.map((order, index) => renderOrderCard(order, index))}
          </>
        )}
      </div>

      {/* Status Change Confirmation Modal */}
      {showStatusModal && pendingStatusChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Confirm Status Change</h2>
                  <p className="text-sm text-gray-500">Are you sure you want to change the order status?</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span className="font-semibold text-gray-800">{pendingStatusChange.currentStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Status:</span>
                  <span className="font-semibold text-blue-600">{pendingStatusChange.newStatus}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmStatusChange}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelStatusChange}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
