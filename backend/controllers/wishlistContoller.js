import userModel from "../models/userModel.js";

// Add products to user wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({
        success: false,
        message: "User ID and Item ID are required.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    if (!Array.isArray(user.wishList)) {
      user.wishList = []; // If wishList is undefined or not an array, set it as an empty array
    }
    
    if (!user.wishList.includes(itemId)) {
      user.wishList.push(itemId); // Add item to wish list
      await user.save();
      return res.json({ success: true, message: "Item added to Wish List!" });
    } else {
      return res.json({
        success: false,
        message: "Item is already in Wish List.",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user wishlist
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const wishList = Array.isArray(user.wishList) ? user.wishList : [];
    
    return res.json({ success: true, wishList });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product from user wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({
        success: false,
        message: "User ID and Item ID are required.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    if (!Array.isArray(user.wishList)) {
      user.wishList = [];
    }
    
    const index = user.wishList.indexOf(itemId);
    if (index > -1) {
      user.wishList.splice(index, 1);
      await user.save();
      return res.json({ success: true, message: "Item removed from Wish List!" });
    } else {
      return res.json({
        success: false,
        message: "Item is not in Wish List.",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToWishlist, getWishlist, removeFromWishlist };
