import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Number, default: Date.now },
  read: { type: Boolean, default: false },
});

const contactModel = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default contactModel;

