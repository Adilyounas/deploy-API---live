const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const productRouter = require("./routes/productRoutes")
const userRouter = require("./routes/userRoutes")
const productReviewRouter = require("./routes/productReviewRoutes")
const orderRouter = require("./routes/orderRoutes")



app.use(express.json())
app.use(cookieParser())


//product router
app.use("/api/v1", productRouter )

//user router
app.use("/api/v1", userRouter )

//reviews router
app.use("/api/v1", productReviewRouter )

//order router
app.use("/api/v1", orderRouter )







module.exports = app