const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middlewares/authMiddleware"); // Middleware for authentication

// Apply middleware to protect routes
router.use(authMiddleware);

// Routes for notes
router.get("/", noteController.getNotes);
router.post("/", noteController.addNote);
router.put("/", noteController.updateNote);
router.delete("/", noteController.deleteNote);

module.exports = router;
