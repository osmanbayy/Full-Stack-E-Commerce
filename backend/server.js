import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mondodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import heroSlideRouter from "./routes/heroSlideRoute.js";
import contactRouter from "./routes/contactRoute.js";

// App Config
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());

// CORS Configuration - Must be before routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers for all requests
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, token, x-requested-with, Accept");
  res.setHeader("Access-Control-Expose-Headers", "Content-Range, X-Content-Range");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// Additional CORS middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "x-requested-with", "Accept"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/review", reviewRouter);
app.use("/api/hero-slide", heroSlideRouter);
app.use("/api/contact", contactRouter);

app.get("/", (req, res) => {
  res.send("API Working!");
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server started on: ", PORT);
  });
}

