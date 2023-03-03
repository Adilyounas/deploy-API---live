const express = require("express")
const {authentication,authRoles} = require("../authentication/auth")
const {createProduct,getAllProducts, getSingleProduct, updateProduct, deleteProduct} = require("../controllers/productController")
const router = express.Router()


//create product
router.route("/admin/product/new").post(authentication,authRoles("admin") ,createProduct)

//find all products
router.route("/admin/products").get(getAllProducts)

//find single product
router.route("/products/:id").get(getSingleProduct)

//update product
router.route("/admin/product/:id").put(updateProduct)

//delete product
router.route("/admin/product/:id").delete(deleteProduct)

module.exports = router