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

// CORS Configuration - Vercel için optimize edilmiş
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Tüm Vercel URL'lerini ve localhost'u kabul et
  if (
    !origin ||
    origin.includes(".vercel.app") ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1") ||
    process.env.NODE_ENV !== "production"
  ) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, token, x-requested-with");
    res.header("Access-Control-Expose-Headers", "Content-Range, X-Content-Range");
  }

  // OPTIONS request için hemen cevap ver
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// CORS middleware'i de ekle (ekstra güvenlik için)
app.use(cors({
  origin: true, // Tüm origin'lere izin ver
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "x-requested-with"],
  exposedHeaders: ["Content-Range", "X-Content-Range"]
}));

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

