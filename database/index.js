const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  phone: String,
  email: String,
  linkedId: mongoose.Schema.Types.ObjectId,
  linkPrecedence: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports= Contact
