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

// App Config
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV !== "production") {
      callback(null, true);
      return;
    }

    if (!origin) {
      callback(null, true);
      return;
    }

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (origin.includes(".vercel.app")) {
      callback(null, true);
      return;
    }

    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      callback(null, true);
      return;
    }

    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "x-requested-with"],
  exposedHeaders: ["Content-Range", "X-Content-Range"]
};

app.use(cors(corsOptions));

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);

app.get("/", (req, res) => {
  res.send("API Working!");
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server started on: ", PORT);
  });
}

