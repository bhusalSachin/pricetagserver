const user = require("../models/user");

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await user.findById(decode.userId);

      if (!user) {
        return res.json({ success: false, message: "Unauthorized access!" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError")
        return res.json({ success: false, message: "Unauthorized access!" });
      if (error.name === "TokenExpiredError")
        return res.json({
          success: false,
          message: "Session expired try sign in!",
        });

      res.json({ success: false, message: "Internal server error" });
    }
  } else {
    return res.json({ success: false, message: "Unauthorized access!" });
  }
};
