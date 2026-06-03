const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const getProducts = async (req, res) => {
  try {
    const { category, gender, search, sort, featured, bestSeller } = req.query;
    let query = {};

    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (featured === 'true') query.featured = true;
    if (bestSeller === 'true') query.bestSeller = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'name_desc') sortOption = { name: -1 };

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      try { images = JSON.parse(req.body.images); } catch { images = []; }
    }

    const product = await Product.create({
      ...req.body,
      images,
      topNotes: req.body.topNotes ? JSON.parse(req.body.topNotes) : [],
      middleNotes: req.body.middleNotes ? JSON.parse(req.body.middleNotes) : [],
      baseNotes: req.body.baseNotes ? JSON.parse(req.body.baseNotes) : [],
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let images = product.images;
    if (req.files && req.files.length > 0) {
      images.forEach((img) => {
        const filePath = path.join(__dirname, '..', img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      try { images = JSON.parse(req.body.images); } catch { images = []; }
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images,
        topNotes: req.body.topNotes ? JSON.parse(req.body.topNotes) : product.topNotes,
        middleNotes: req.body.middleNotes ? JSON.parse(req.body.middleNotes) : product.middleNotes,
        baseNotes: req.body.baseNotes ? JSON.parse(req.body.baseNotes) : product.baseNotes,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.images.forEach((img) => {
      const filePath = path.join(__dirname, '..', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
