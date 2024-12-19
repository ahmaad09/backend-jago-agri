const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/notesRoutes");
const newsRoutes = require("./routes/newsRoutes");
const errorHandler = require("./middlewares/errorHandler");

require("dotenv").config();

const app = express();
// Middleware
app.use(cors());
app.use(errorHandler);
app.use(express.json());

// Koneksi ke MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("Terhubung ke database MySQL.");
});

//  route pengguna
app.use("/", userRoutes);
app.use('/notes', noteRoutes);

app.use("/news", newsRoutes);



// Menjalankan Server
app.listen(process.env.PORT, () => {
  console.log(`Server berjalan di http://localhost:${process.env.PORT}`);
}); 