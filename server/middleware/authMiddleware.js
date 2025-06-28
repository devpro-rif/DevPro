const jwt = require("jsonwebtoken");
const JWT_SECRET = "secretKey";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  console.log("Token from cookie:", token); // DEBUG

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token." });
  }
};

module.exports = authMiddleware;
