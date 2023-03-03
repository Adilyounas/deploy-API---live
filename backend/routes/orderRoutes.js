const express = require("express")
const router = express.Router()
const {newOrder,getSingleOrder, myOrders, getAllOrders, updateOrder} = require("../controllers/orderController")
const { authentication, authRoles } = require("../authentication/auth")


//new order
router.route("/order/new").post(authentication,newOrder)

//single order
router.route("/order/:orderId").get(authentication,getSingleOrder)

//my orders
router.route("/myOrders").get(authentication,authRoles("admin"),myOrders)

//my orders
router.route("/orders").get(authentication,authRoles("admin"),getAllOrders)

//my orders
router.route("/order/update/:orderId").put(authentication,authRoles("admin"),updateOrder)

module.exports = router