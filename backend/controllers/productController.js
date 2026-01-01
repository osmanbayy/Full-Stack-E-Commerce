import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for add product
const addProduct = async (req, res) => {
  try {
    // console.log(req.files); // Gelen dosyaları kontrol edin

    const {
      name,
      nameEn,
      nameTr,
      description,
      price,
      category,
      subCategory,
      productType,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name: name || nameEn || nameTr, // Backward compatibility
      nameEn: nameEn || name,
      nameTr: nameTr || name,
      description,
      category,
      subCategory,
      productType: productType || "",
      price: Number(price),
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for list product with pagination and filtering
const listProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.category) {
      const categories = Array.isArray(req.query.category) 
        ? req.query.category 
        : [req.query.category];
      filter.category = { $in: categories };
    }
    
    if (req.query.subCategory) {
      const subCategories = Array.isArray(req.query.subCategory) 
        ? req.query.subCategory 
        : [req.query.subCategory];
      filter.subCategory = { $in: subCategories };
    }
    
    if (req.query.productType) {
      const productTypes = Array.isArray(req.query.productType) 
        ? req.query.productType 
        : [req.query.productType];
      filter.productType = { $in: productTypes };
    }
    
    if (req.query.search) {
      // Search in name, nameEn, nameTr, and description
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { nameEn: { $regex: req.query.search, $options: "i" } },
        { nameTr: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } }
      ];
    }

    // Get total count for pagination
    const totalProducts = await productModel.countDocuments(filter);
    
    // Get products with pagination
    const products = await productModel.find(filter)
      .sort({ date: -1 }) // Sort by date, newest first
      .skip(skip)
      .limit(limit);

    res.json({ 
      success: true, 
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasMore: skip + products.length < totalProducts
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for update product
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      nameEn,
      nameTr,
      description,
      price,
      category,
      subCategory,
      productType,
      sizes,
      bestseller,
      existingImages, // JSON string of existing image URLs to keep
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found!" });
    }

    // Handle new images
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const newImages = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = [];
    
    // Parse existing images if provided
    if (existingImages) {
      try {
        imagesUrl = JSON.parse(existingImages);
      } catch (e) {
        imagesUrl = product.image; // Fallback to current images
      }
    } else {
      imagesUrl = product.image; // Keep existing images if no new ones
    }

    // Upload new images if any
    if (newImages.length > 0) {
      const uploadedImages = await Promise.all(
        newImages.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      // Add new images to existing ones
      imagesUrl = [...imagesUrl, ...uploadedImages];
    }

    // Prepare update data
    const updateData = {};
    if (name || nameEn || nameTr) {
      updateData.name = name || nameEn || nameTr;
      updateData.nameEn = nameEn || name || product.nameEn;
      updateData.nameTr = nameTr || name || product.nameTr;
    }
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (category !== undefined) updateData.category = category;
    if (subCategory !== undefined) updateData.subCategory = subCategory;
    if (productType !== undefined) updateData.productType = productType;
    if (sizes !== undefined) updateData.sizes = JSON.parse(sizes);
    if (bestseller !== undefined) {
      updateData.bestseller = bestseller === "true" || bestseller === true;
    }
    if (imagesUrl.length > 0) updateData.image = imagesUrl;

    await productModel.findByIdAndUpdate(id, updateData);

    res.json({ success: true, message: "Product updated!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProduct, addProduct, removeProduct, singleProduct, updateProduct };
