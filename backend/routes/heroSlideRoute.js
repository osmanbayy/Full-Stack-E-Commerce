import express from "express";
import {
  addHeroSlide,
  listHeroSlides,
  listAllHeroSlides,
  updateHeroSlide,
  removeHeroSlide,
} from "../controllers/heroSlideController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const heroSlideRouter = express.Router();

heroSlideRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addHeroSlide
);

heroSlideRouter.get("/list", listHeroSlides);
heroSlideRouter.get("/list-all", adminAuth, listAllHeroSlides);

heroSlideRouter.post(
  "/update",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateHeroSlide
);

heroSlideRouter.post("/remove", adminAuth, removeHeroSlide);

export default heroSlideRouter;


