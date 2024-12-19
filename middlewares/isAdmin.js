const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Hanya admin yang diizinkan." });
  }
  next();
};

module.exports = isAdmin;
