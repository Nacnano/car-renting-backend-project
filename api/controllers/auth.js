const User = require("../models/User");

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  console.log("🔵 [AUTH] Register function called");
  console.log("📝 [AUTH] Registration data:", {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  });
  try {
    const { name, email, password, role, telephone } = req.body;

    //Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      telephone,
    });
    console.log("✅ [AUTH] User created successfully:", user._id);
    //Create token
    //const token=user.getSignedJwtToken();

    //res.status(200).json({success:true, token});
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false });
    console.log(error.stack);
  }
};

//@desc     Login user
//@route    POST /api/v1/auth/register
//@access   Public
exports.login = async (req, res, next) => {
  console.log("🔵 [AUTH] Login function called");
  console.log("📝 [AUTH] Login attempt for email:", req.body.email);
  try {
    const { email, password } = req.body;

    //Validate email&password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" });
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");
    console.log("🔍 [AUTH] User found:", user ? user._id : "Not found");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log("🔐 [AUTH] Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ [AUTH] Invalid password");
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //Create token
    //const token=user.getSignedJwtToken();

    //res.status(200).json({success:true, token});
    console.log("✅ [AUTH] Login successful for user:", user._id);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log("❌ [AUTH] Login error:", err.message);
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    // Uncomment the line below if you want to use cookies
    // .cookie('token', token, options)
    .json({
      success: true,
      // Add for frontend
      _id: user._id,
      name: user.name,
      email: user.email,
      // End for frontend
      token,
    });
};

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
  console.log("🔵 [AUTH] GetMe function called for user:", req.user.id);
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

//@desc     Log user out / clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = async (req, res, next) => {
  console.log(
    "🔵 [AUTH] Logout function called for user:",
    req.user?.id || "unknown"
  );
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
