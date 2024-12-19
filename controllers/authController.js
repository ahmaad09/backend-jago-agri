const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || "avagfarvaaebrbea"; 

// Registrasi
exports.register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi." });
  }

  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailSql, [email], (checkErr, checkResults) => {
    if (checkErr) {
      return res.status(500).json({ message: "Terjadi kesalahan dengan server.", error: checkErr });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    
    db.query(sql, [username, email, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ message: "Gagal registrasi.", error: err });
      }
      res.status(201).json({ message: "Registrasi berhasil!" });
    });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi." });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Gagal login.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah." });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login berhasil!", token });
  });
};
