const mongoose = require("mongoose");

const pcPresenceSchema = new mongoose.Schema(
  {
    pcUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "PcUnit", required: true, unique: true },
    isOnline: { type: Boolean, default: false },
    socketId: { type: String, default: "" },
    lastSeenAt: { type: Date, default: null },
    currentSessionId: { type: mongoose.Schema.Types.ObjectId, ref: "VisitSession", default: null },
    kioskState: {
      type: String,
      enum: ["locked", "awaiting_ticket", "unlocked", "feedback"],
      default: "locked"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PcPresence", pcPresenceSchema);
