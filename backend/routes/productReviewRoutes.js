const express= require("express")
const router = express.Router()
const {createProductReview,getProductReview, deleteReview} = require("../controllers/productReviewController")
const { authentication, authRoles } = require("../authentication/auth")


//create review
router.route("/create/review").put(authentication,createProductReview)

//get review
router.route("/review").get(authentication,getProductReview)

//delete review
router.route("/review").delete(authentication,deleteReview)

module.exports = router