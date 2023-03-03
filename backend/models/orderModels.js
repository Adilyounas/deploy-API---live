const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      image: {
        type: String,
        requried: true,
      },
      name: {
        type: String,
        requried: true,
      },
      price: {
        type: Number,
        requried: true,
      },
      quantity: {
        type: Number,
        requried: true,
      },
    },
  ],
  subTax: {
    type: Number,
    requried: true,
    default: 0,
  },
  tax: {
    type: Number,
    requried: true,
    default: 0,
  },
  shippingTax: {
    type: Number,
    requried: true,
    default: 0,
  },
  total: {
    type: Number,
    requried: true,
    default: 0,
  },
  paymentInfo: {
    id: {
      type: String,
      requried: true,
    },
    status: {
      type: String,
      requried: true,
    },
  },
  paidAt: {
    type: Date,
    requried: true,
  },
  shippingInfo: {
    address: {
      type: String,
      requried: true,
    },
    name: {
      type: String,
      requried: true,
    },
    country: {
      type: String,
      requried: true,
    },
    state: {
      type: String,
      requried: true,
    },
    city: {
      type: String,
      requried: true,
    },
    pinCode: {
      type: Number,
      requried: true,
    },
    phone: {
      type: Number,
      requried: true,
    },
  },
  orderStatus: {
    type: String,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model("Order", orderSchema);
