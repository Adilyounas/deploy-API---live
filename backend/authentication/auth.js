const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//authentication means user is login and this user belongs to us..
const authentication = async (req, res, next) => {
  const { token } = await req.cookies;
  if (!token) {
    return res.status(402).json({
      success: false,
      message: "login first",
    });
  }

  const decodedData = jwt.verify(token, process.env.SECRET_KEY);
  if (!decodedData) {
    return res.status(400).json({
      success: false,
      message: "Unauthenticated user data is not avaliable in our data base",
    });
  }
  const user = await User.findById(decodedData.id);
  req.user = user;
  next();
};

const authRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      return res.status(400).json({
        success: false,
        message: `This source is not for ${req.user.userRole} Role`,
      });
    }
    next()
  };
};

module.exports = { authentication, authRoles } ;
