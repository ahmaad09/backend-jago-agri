const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Token tidak tersedia." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Akses ditolak. Peran tidak sesuai." });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token tidak valid." });
    }
  };
};

module.exports = verifyRole;
