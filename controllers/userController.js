const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

// Registrasi
const register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi." });
  }

  // Cek apakah email sudah digunakan
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
    
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Username sudah digunakan.", error: err });
      }
      res.status(201).json({ message: "Registrasi berhasil!" });
    });
  });
};

// Login
const login = (req, res) => {
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

// Reset Password
const resetPassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Semua field harus diisi." });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan dengan server.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    const user = results[0];
    const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Password lama salah." });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    const updatePasswordSql = "UPDATE users SET password = ? WHERE email = ?";
    db.query(updatePasswordSql, [hashedNewPassword, email], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ message: "Gagal memperbarui password.", error: updateErr });
      }

      res.status(200).json({ message: "Password berhasil diperbarui!" });
    });
  });
};

// Reset Email
const resetEmail = (req, res) => {
  console.log("Received request body:", req.body); // Debugging log

  const { email, password, newEmail } = req.body;

  // Validasi input
  if (!email || !password || !newEmail) {
    console.log('Parameter kosong:', { email, password, newEmail }); // Debugging log
    return res.status(400).json({ message: "Semua field harus diisi." });
  }

  // Cek apakah email baru sudah digunakan
  const checkNewEmailSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkNewEmailSql, [newEmail], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error checking new email:", checkErr);
      return res.status(500).json({ message: "Terjadi kesalahan dengan server.", error: checkErr });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ message: "Email baru sudah digunakan." });
    }

    // Cari pengguna berdasarkan email lama
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error("Error finding user by email:", err);
        return res.status(500).json({ message: "Terjadi kesalahan dengan server.", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan." });
      }

      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password salah." });
      }

      // Perbarui email
      const updateEmailSql = "UPDATE users SET email = ? WHERE email = ?";
      db.query(updateEmailSql, [newEmail, email], (updateErr) => {
        if (updateErr) {
          console.error("Error updating email:", updateErr);
          return res.status(500).json({ message: "Gagal memperbarui email.", error: updateErr });
        }

        res.status(200).json({ message: "Email berhasil diperbarui!" });
      });
    });
  });
};


module.exports = {
  register,
  login,
  resetPassword,
  resetEmail,
}; 
