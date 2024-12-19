const jwt = require("jsonwebtoken");
const JWT_SECRET = "avagfarvaaebrbea";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Token tidak tersedia." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET); 
    req.userId = decoded.id; // Tambahkan userId ke request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid." });
  }
};

module.exports = verifyToken;