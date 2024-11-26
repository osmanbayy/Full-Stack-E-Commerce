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

export { addToWishlist };
