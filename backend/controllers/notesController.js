const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  const note = await Note.create({
    text: req.body.text,
    user: req.userId
  });
  res.json(note);
};

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.userId });
  res.json(notes);
};

exports.deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.user.toString() !== req.userId)
    return res.status(401).json({ message: "Not authorized" });

  await note.deleteOne();
  res.json({ message: "Note deleted" });
};