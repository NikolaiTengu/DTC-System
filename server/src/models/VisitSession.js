const mongoose = require("mongoose");

const visitSessionSchema = new mongoose.Schema(
  {
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", required: true },
    visitPurpose: { type: String, required: true },
    wantsPc: { type: Boolean, default: false },
    assignedPcId: { type: mongoose.Schema.Types.ObjectId, ref: "PcUnit", default: null },
    ticketCode: { type: String, default: null },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    sessionStatus: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active"
    },
    checkInAt: { type: Date, default: Date.now },
    checkOutAt: { type: Date, default: null },
    handledByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    checkedOutByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    source: {
      type: String,
      enum: ["server_registration", "qr_self_service"],
      required: true
    },
    remarks: { type: String, default: "" },
    unlockStartedAt: { type: Date, default: null },
    unlockEndedAt: { type: Date, default: null },
    feedbackStatus: {
      type: String,
      enum: ["pending", "triggered", "completed", "skipped"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitSession", visitSessionSchema);
