const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please Enter product creater id"],
  },
  name: {
    type: String,
    required: [true, "Please Enter product name"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please Enter product price"],
  },
  category: {
    type: String,
    required: [true, "Please Enter product title"],
  },
  description: {
    type: String,
    required: [true, "Please Enter product description"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Please Enter product creater id"],
      },
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
