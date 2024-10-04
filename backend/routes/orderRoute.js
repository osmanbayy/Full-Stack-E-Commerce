import express from "express";
import {placeOrderCOD, placeOrderRazorpay, placeOrderStripe, allOrders, updateStatus, userOrders} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place-cash-on-delivery", authUser, placeOrderCOD);
orderRouter.post("/place-stripe", authUser, placeOrderStripe);
orderRouter.post("/place-razorpay", authUser, placeOrderRazorpay);

// User Features
orderRouter.post("/user-orders", authUser, userOrders);

export default orderRouter;