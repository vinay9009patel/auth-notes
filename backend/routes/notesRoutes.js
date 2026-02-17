const router = require("express").Router();
const { createNote, getNotes, deleteNote } = require("../controllers/notesController");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.delete("/:id", protect, deleteNote);

module.exports = router;