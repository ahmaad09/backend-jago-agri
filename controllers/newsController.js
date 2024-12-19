const db = require('../config/db');

// Mendapatkan semua berita
const getAllNews = (req, res) => {
    db.query('SELECT * FROM news', (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database query error' });
        }
        res.json({ success: true, data: results });
    });
};

// Menambahkan berita
const addNews = (req, res) => {
    const { title, description, image } = req.body;
    const query = 'INSERT INTO news (title, description, image) VALUES (?, ?, ?)';
    
    db.query(query, [title, description, image], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database insert error' });
        }
        res.status(201).json({ success: true, data: { id: results.insertId, title, description, image } });
    });
};

// Mengedit berita
const editNews = (req, res) => {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const query = 'UPDATE news SET title = ?, description = ?, image = ? WHERE id = ?';

    db.query(query, [title, description, image, id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database update error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'News not found' });
        }
        res.json({ success: true, message: 'News updated successfully' });
    });
};

// Menghapus berita
const deleteNews = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM news WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database delete error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'News not found' });
        }
        res.json({ success: true, message: 'News deleted successfully' });
    });
};

module.exports = {
    getAllNews,
    addNews,
    editNews,
    deleteNews,
};