import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleEn: {
    type: String,
    required: true,
  },
  titleTr: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  subtitleEn: {
    type: String,
    required: true,
  },
  subtitleTr: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
  buttonTextEn: {
    type: String,
    required: true,
  },
  buttonTextTr: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const heroSlideModel = mongoose.models.heroSlide || mongoose.model("heroSlide", heroSlideSchema);

export default heroSlideModel;

