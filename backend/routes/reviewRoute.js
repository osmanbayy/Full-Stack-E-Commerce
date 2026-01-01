import express from "express";
import { addReview, getProductReviews, getProductsRatings } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();

// Add review/rating (requires authentication)
reviewRouter.post("/add", authUser, addReview);

// Get reviews for a product (public)
reviewRouter.post("/product", getProductReviews);

// Get ratings for multiple products (public)
reviewRouter.post("/products", getProductsRatings);

export default reviewRouter;

