const Product = require("../models/Product");
const { validateLength } = require("../helpers/validation");

exports.createProduct = async (req, res) => {
  try {
    const { productName, description } = req.body;
    if (!productName || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validateLength(productName, 3, 50)) {
      return res.status(400).json({
        message: "Product name must be between 3 and 50 characters.",
      });
    }
    if (!validateLength(description, 3, 100)) {
      return res.status(400).json({
        message: "Description must be between 3 and 100 characters.",
      });
    }

    const newProduct = await Product.create({
      productName,
      description,
    });
    return res
      .status(200)
      .json({ message: "Product created", data: newProduct });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName: productName || product.productName,
        description: description || product.description,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Product updated successfully", data: updateProduct });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().limit(4).sort({ createdAt: -1 });
    if (allProducts.length < 1) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(201).json({ count: allProducts.length, allProducts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
