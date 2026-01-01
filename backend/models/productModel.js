import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Backward compatibility
  nameEn: { type: String, required: false },
  nameTr: { type: String, required: false },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  productType: { type: String, required: false }, // T-Shirt, Jacket, Sweater, Shoes, etc.
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
