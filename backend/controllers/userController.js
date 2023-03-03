const User = require("../models/userModel");
const sendToken = require("../middleware/sendToken");
const mailSend = require("../middleware/mailSend");
const crypto = require("crypto");

//<-----backend "user"--->
//register user
const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const message = "Register successfully";
    sendToken(user, res, 201, message);
  } catch (error) {
    res.status(201).json({
      success: false,
      message: error.message,
    });
  }
};

//login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Enter both",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Enter valid information",
      });
    }
    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Enter valid information",
      });
    }
    const message = "Login successfully";
    sendToken(user, res, 200, message);
  } catch (error) {
    res.status(201).json({
      success: false,
      message: error.message,
    });
  }
};

//logout
const logout = async (req, res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logout Successfully",
  });
};

//forgot password
const forgotPass = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Enter your valid email",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Enter valid information",
    });
  }

  const token = await user.resetPasswordTokenGenerating();
  if (!token) {
    return res.status(400).json({
      message: "Reset password token is not generating",
    });
  }

  await user.save({ validateBeforeSave: false });

  const forgetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/reset/${token}`;
  const message = `Your password reset token is \n\n ${forgetPasswordURL} \n\n if you did't sent it then ignore it please`;

  try {
    await mailSend(email, message);
    res.status(400).json({
      success: true,
      message: "Mail is send to given email",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//reset password
const resetPass = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "can't find token",
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or expire",
      });
    }

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill both fields properly",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Fill same data in fields",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    const message = "Reset Password and Login successfully";
    sendToken(user, res, 200, message);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//<-----authenticated "user"--->
//my details
const myDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(400).json({
      success: true,
      message: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//update profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body);
    res.status(400).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//update password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword) {
      res.status(400).json({
        success: false,
        message: "Enter old password",
      });
    }

    if (!newPassword || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Please fill filds",
      });
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Password should be the same",
      });
    }

    const user = await User.findById(req.user._id);
    const comparePassword = await user.comparePassword(oldPassword);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Enter correct password",
      });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    res.status(400).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// <---------------------ADMIN CONTROLLERS START FROM HERE------------------------->

//get all user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({
        success: false,
        message: "users not found",
      });
    }

    res.status(400).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get single user
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(400).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//update user
const update_A_User = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(400).json({
      success: true,
      message: "User updated",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//delete user  --admin
const delete_A_User = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    await user.remove();
    res.status(400).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPass,
  resetPass,
  myDetails,
  updateProfile,
  updatePassword,
  getAllUsers,
  getSingleUser,
  update_A_User,
  delete_A_User,
};
