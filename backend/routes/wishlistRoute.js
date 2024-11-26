import express from "express";
import authUser from "../middleware/auth.js";
import { addToWishlist } from "../controllers/wishlistContoller.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authUser, addToWishlist);

export default wishlistRouter;