const Product = require("../models/productModel");

//create product reviews
const createProductReview = async (req, res) => {
  try {
    const { comment, rating, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      comment,
      rating,
    };

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviewed = await product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    await product.save({ validateBeforeSave: false });

    if (reviewed) {
      product.reviews.forEach((rev) => {
        if ((rev) => rev.user.toString() === req.user._id.toString()) {
          rev.comment = comment;
          rev.rating = rating;
        }
      });
      await product.save({ validateBeforeSave: false });
    } else {
      product.reviews.push(review);
      await product.save({ validateBeforeSave: false });
    }

    await product.save({ validateBeforeSave: false });

    //num of ratings
    let total = 0;
    product.reviews.forEach((rev) => (total += rev.rating));
    product.ratings = total / product.reviews.length;

    //number of reviews
    product.numOfReviews = product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//get product review
const getProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found with this id",
      });
    }

    res.status(201).json({
      success: true,
      reviews: product.numOfReviews,
      ratings: product.ratings,
      product: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found with this id",
      });
    }

    const updateReviews = await product.reviews.filter(
      (rev) => req.query.reviewId.toString() !== rev._id.toString()
    );
    product.reviews = updateReviews;
    await product.save({ validateBeforeSave: false });

    if (updateReviews.length === 0) {
      product.ratings = 0;
      await product.save({ validateBeforeSave: false });
    }
    //ratings
    let ratings = 0;
    updateReviews.forEach((rev) => (ratings += rev.rating));
    product.ratings = ratings / updateReviews.length;

    //number of reviews
    product.numOfReviews = updateReviews.length;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
module.exports = { createProductReview, getProductReview, deleteReview };
