const sendToken = async (user, res, statusCode, message) => {
  const token = await user.generatingJWT();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
  });
};

module.exports = sendToken
