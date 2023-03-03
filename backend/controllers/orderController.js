const Order = require("../models/orderModels");
const Product = require("../models/productModel");

//new order
const newOrder = async (req, res) => {
  try {
    const {
      orderItems,
      subtax,
      tax,
      shippingTax,
      total,
      paymentInfo,
      shippingInfo,
    } = req.body;
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      subtax,
      tax,
      shippingTax,
      total,
      paymentInfo,
      paidAt: Date.now(),
      shippingInfo,
    });

    res.status(201).json({
      success: true,
      message: "Order is placed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get single order
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "user",
      "name email"
    );
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order is not found with this id",
      });
    }
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//my orders
const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "Orders is not found with this id",
      });
    }
    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "Orders are not found",
      });
    }
    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update order shipped or delivered  --admin
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order is not found with this id",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Order is already delivered",
      });
    }

    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (item) => {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save({ validateBeforeSave: false });
      });
    }

    if (req.body.status==="Delivered") {
      order.deliveredAt = Date.now()
      await order.save({ validateBeforeSave: false });

    }

    order.orderStatus = req.body.status
    await order.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
};
