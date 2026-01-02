import { v2 as cloudinary } from "cloudinary";
import heroSlideModel from "../models/heroSlideModel.js";

// Function to add hero slide
const addHeroSlide = async (req, res) => {
  try {
    const {
      title,
      titleEn,
      titleTr,
      subtitle,
      subtitleEn,
      subtitleTr,
      buttonText,
      buttonTextEn,
      buttonTextTr,
      order,
      isActive,
    } = req.body;

    const image = req.files?.image?.[0];

    if (!image) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    const slideData = {
      title: title || titleEn || titleTr,
      titleEn: titleEn || title,
      titleTr: titleTr || title,
      subtitle: subtitle || subtitleEn || subtitleTr,
      subtitleEn: subtitleEn || subtitle,
      subtitleTr: subtitleTr || subtitle,
      buttonText: buttonText || buttonTextEn || buttonTextTr,
      buttonTextEn: buttonTextEn || buttonText,
      buttonTextTr: buttonTextTr || buttonText,
      image: result.secure_url,
      order: order ? Number(order) : 0,
      isActive: isActive === "true" || isActive === true,
      date: Date.now(),
    };

    const slide = new heroSlideModel(slideData);
    await slide.save();

    res.json({ success: true, message: "Hero slide added!", slide });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to list hero slides
const listHeroSlides = async (req, res) => {
  try {
    const slides = await heroSlideModel
      .find({ isActive: true })
      .sort({ order: 1, date: -1 });

    res.json({ success: true, slides });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to list all hero slides (for admin)
const listAllHeroSlides = async (req, res) => {
  try {
    const slides = await heroSlideModel.find().sort({ order: 1, date: -1 });

    res.json({ success: true, slides });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to update hero slide
const updateHeroSlide = async (req, res) => {
  try {
    const {
      id,
      title,
      titleEn,
      titleTr,
      subtitle,
      subtitleEn,
      subtitleTr,
      buttonText,
      buttonTextEn,
      buttonTextTr,
      order,
      isActive,
    } = req.body;

    const image = req.files?.image?.[0];

    const updateData = {
      title: title || titleEn || titleTr,
      titleEn: titleEn || title,
      titleTr: titleTr || title,
      subtitle: subtitle || subtitleEn || subtitleTr,
      subtitleEn: subtitleEn || subtitle,
      subtitleTr: subtitleTr || subtitle,
      buttonText: buttonText || buttonTextEn || buttonTextTr,
      buttonTextEn: buttonTextEn || buttonText,
      buttonTextTr: buttonTextTr || buttonText,
      order: order ? Number(order) : 0,
      isActive: isActive === "true" || isActive === true,
    };

    // If new image is provided, upload it
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      updateData.image = result.secure_url;
    }

    const slide = await heroSlideModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!slide) {
      return res.json({ success: false, message: "Slide not found" });
    }

    res.json({ success: true, message: "Hero slide updated!", slide });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to remove hero slide
const removeHeroSlide = async (req, res) => {
  try {
    await heroSlideModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Hero slide removed!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addHeroSlide,
  listHeroSlides,
  listAllHeroSlides,
  updateHeroSlide,
  removeHeroSlide,
};

