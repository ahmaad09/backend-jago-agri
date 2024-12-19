const db = require("../config/db");

exports.getNotes = (req, res) => {
  const userId = req.user.id;
  const query = "SELECT * FROM notes WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.addNote = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const query = "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)";
  db.query(query, [userId, title, content], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Note added successfully", noteId: result.insertId });
  });
};

exports.updateNote = (req, res) => {
  const { id, title, content } = req.body;
  const query = "UPDATE notes SET title = ?, content = ? WHERE id = ?";
  db.query(query, [title, content, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Note updated successfully" });
  });
};

exports.deleteNote = (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM notes WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Note deleted successfully" });
  });
};
