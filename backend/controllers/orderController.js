import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Generate unique tracking number
const generateTrackingNumber = () => {
  const prefix = "TRK";
  const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0"); // 4 digit random
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

// Placing orders using Cash On Delivery Method
const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Generate unique tracking number
    let trackingNumber;
    let isUnique = false;
    while (!isUnique) {
      trackingNumber = generateTrackingNumber();
      const existingOrder = await orderModel.findOne({ trackingNumber });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      trackingNumber,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed!", trackingNumber });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update Payment Status from Admin Panel
const updatePayment = async (req, res) => {
  try {
    const { orderId, payment } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { payment });
    res.json({ 
      success: true, 
      message: payment ? "Payment marked as completed!" : "Payment marked as pending!" 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update Tracking Number from Admin Panel
const updateTrackingNumber = async (req, res) => {
  try {
    const { orderId, trackingNumber } = req.body;
    
    if (!trackingNumber || trackingNumber.trim() === "") {
      return res.json({ success: false, message: "Tracking number is required!" });
    }

    // Check if tracking number already exists (excluding current order)
    const existingOrder = await orderModel.findOne({ 
      trackingNumber: trackingNumber.trim().toUpperCase(),
      _id: { $ne: orderId }
    });

    if (existingOrder) {
      return res.json({ success: false, message: "Tracking number already exists!" });
    }

    await orderModel.findByIdAndUpdate(orderId, { 
      trackingNumber: trackingNumber.trim().toUpperCase() 
    });
    
    res.json({ 
      success: true, 
      message: "Tracking number updated successfully!" 
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Financial Statistics
const getFinancialStats = async (req, res) => {
  try {
    const allOrders = await orderModel.find({});
    
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders
      .filter(order => order.payment === true)
      .reduce((sum, order) => sum + order.amount, 0);
    
    const pendingPayments = allOrders
      .filter(order => order.payment === false)
      .reduce((sum, order) => sum + order.amount, 0);
    
    const completedPayments = allOrders
      .filter(order => order.payment === true)
      .length;
    
    const pendingPaymentsCount = allOrders
      .filter(order => order.payment === false)
      .length;

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingPayments,
        completedPayments,
        pendingPaymentsCount
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrderCOD,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  updatePayment,
  updateTrackingNumber,
  getFinancialStats,
};
