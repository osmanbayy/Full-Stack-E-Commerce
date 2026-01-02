/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import toast from "react-hot-toast";

const Finance = ({ token }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    pendingPaymentsCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchFinancialStats = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/financial-stats",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading financial data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Financial Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green-800">
                {currency} {stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-200 rounded-full p-4">
              <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-800">
                {currency} {stats.pendingPayments.toFixed(2)}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                {stats.pendingPaymentsCount} orders
              </p>
            </div>
            <div className="bg-yellow-200 rounded-full p-4">
              <svg className="w-8 h-8 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-blue-800">
                {stats.totalOrders}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {stats.completedPayments} completed
              </p>
            </div>
            <div className="bg-blue-200 rounded-full p-4">
              <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Completed Payments</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completedPayments}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalOrders > 0 
                ? `${((stats.completedPayments / stats.totalOrders) * 100).toFixed(1)}% of total orders`
                : "0% of total orders"}
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
            <p className="text-2xl font-bold text-gray-800">{stats.pendingPaymentsCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalOrders > 0 
                ? `${((stats.pendingPaymentsCount / stats.totalOrders) * 100).toFixed(1)}% of total orders`
                : "0% of total orders"}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Summary</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Total Orders:</span> {stats.totalOrders}
          </p>
          <p>
            <span className="font-semibold">Total Revenue (Completed Payments):</span>{" "}
            {currency} {stats.totalRevenue.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Pending Payments Amount:</span>{" "}
            {currency} {stats.pendingPayments.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Potential Total Revenue:</span>{" "}
            {currency} {(stats.totalRevenue + stats.pendingPayments).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Finance;

