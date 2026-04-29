const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    sex: { type: String, default: "" },
    age: { type: Number, default: null },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    organization: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", guestSchema);
