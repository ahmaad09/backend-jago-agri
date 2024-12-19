// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Rute untuk mendapatkan semua berita
router.get('/', newsController.getAllNews);

// Rute untuk menambahkan berita
router.post('/', newsController.addNews);

// Rute untuk mengedit berita
router.put('/:id', newsController.editNews);

// Rute untuk menghapus berita
router.delete('/:id', newsController.deleteNews);

module.exports = router;