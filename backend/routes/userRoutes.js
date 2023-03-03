const express = require("express");
const {
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
} = require("../controllers/userController");
const router = express.Router();
const { authentication, authRoles } = require("../authentication/auth");

//register user
router.route("/register").post(register);

//login user
router.route("/login").post(login);

//logout user
router.route("/logout").get(logout);

//forgot user
router.route("/forgotPassword").post(forgotPass);

//reset user
router.route("/reset/:token").put(resetPass);

//My details
router.route("/myDetails").get(authentication, myDetails);

//update profile
router.route("/updateProfile").put(authentication, updateProfile);

//update password
router.route("/updatePassword").put(authentication, updatePassword);

// <-------------ADMIN ROUTES START FROM HERE------------->

//GET ALL USERS
router.route("/admin/users").get(authentication,authRoles("admin"), getAllUsers);

//GET SINGLE USER
router.route("/admin/user/:id").get(authentication,authRoles("admin"), getSingleUser);

//UPDATE USER
router.route("/admin/updateUser/:id").put(authentication,authRoles("admin"), update_A_User);

//DELETE USER
router.route("/admin/deleteUser/:id").delete(authentication,authRoles("admin"), delete_A_User);


module.exports = router;
