import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Add rating/review for a product (only if user has purchased it)
const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, review } = req.body;

    // Check if user has purchased this product AND order status is "Delivered"
    const orders = await orderModel.find({ userId });
    let hasPurchased = false;

    for (const order of orders) {
      // Only check orders with "Delivered" status
      if (order.status === "Delivered") {
        for (const item of order.items) {
          // Check both item.id and item._id for compatibility
          if (item.id === productId || item._id === productId) {
            hasPurchased = true;
            break;
          }
        }
        if (hasPurchased) break;
      }
    }

    if (!hasPurchased) {
      return res.json({
        success: false,
        message: "You can only rate products that have been delivered.",
      });
    }

    // Check if user has already rated this product
    const existingReview = await reviewModel.findOne({ userId, productId });
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      if (review) existingReview.review = review;
      existingReview.date = Date.now();
      await existingReview.save();
    } else {
      // Create new review
      const reviewData = {
        userId,
        productId,
        rating,
        review: review || "",
        date: Date.now(),
      };
      const newReview = new reviewModel(reviewData);
      await newReview.save();
    }

    // Calculate and update average rating for the product
    const reviews = await reviewModel.find({ productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.json({
      success: true,
      message: "Review added successfully!",
      averageRating: averageRating.toFixed(1),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.body;
    const reviews = await reviewModel.find({ productId }).sort({ date: -1 });

    // Populate user information for each review
    const reviewsWithUser = await Promise.all(
      reviews.map(async (review) => {
        const user = await userModel.findById(review.userId);
        return {
          ...review.toObject(),
          userName: user ? user.name : "Anonymous",
        };
      })
    );

    // Calculate average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.json({
      success: true,
      reviews: reviewsWithUser,
      averageRating: averageRating.toFixed(1),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get average rating for multiple products (for ProductItem display)
const getProductsRatings = async (req, res) => {
  try {
    const { productIds } = req.body; // Array of product IDs

    const ratings = {};
    for (const productId of productIds) {
      const reviews = await reviewModel.find({ productId });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      ratings[productId] = {
        averageRating: averageRating.toFixed(1),
        totalReviews: reviews.length,
      };
    }

    res.json({ success: true, ratings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addReview, getProductReviews, getProductsRatings };

