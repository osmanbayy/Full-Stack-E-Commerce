import express from "express";
import authUser from "../middleware/auth.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistContoller.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.post("/get", authUser, getWishlist);
wishlistRouter.post("/remove", authUser, removeFromWishlist);

export default wishlistRouter;