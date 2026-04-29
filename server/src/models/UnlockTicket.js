const mongoose = require("mongoose");

const unlockTicketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    visitSessionId: { type: mongoose.Schema.Types.ObjectId, ref: "VisitSession", required: true },
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", required: true },
    assignedPcId: { type: mongoose.Schema.Types.ObjectId, ref: "PcUnit", required: true },
    status: {
      type: String,
      enum: ["active", "used", "expired", "cancelled"],
      default: "active"
    },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UnlockTicket", unlockTicketSchema);
