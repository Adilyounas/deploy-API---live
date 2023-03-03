const Product = require("../models/productModel");
const ApiFeatures = require("../middleware/apiFeatures")

//create product
const createProduct = async (req, res) => {
  try {
    req.body.user = req.user._id
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//read all
const getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 4;

    //all products counts
    const totalProducts = await Product.countDocuments()

    let apiFeatures = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);

   const product = await apiFeatures.query


    if (!product) {
      return res.status(400).json({
        success: false,
        product: "Products not found",
      });
    }

    res.status(200).json({
      success: true,
      totalProducts,
      filteredCount:product.length,
      resultPerPage,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get single product
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
          success: false,
          product: "Product not found",
        });
      }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//update single product
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(400).json({
          success: false,
          product: "Product not found",
        });
      }
      product = await Product.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//delete single product
const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(400).json({
            success: false,
            product: "Product not found",
          });
        }
    
       await product.remove()

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  //create product reviews
module.exports = { createProduct, getAllProducts, getSingleProduct,updateProduct,deleteProduct };
