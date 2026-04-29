const mongoose = require("mongoose");

const eventParticipantSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", default: null },
    participantSnapshot: {
      fullName: { type: String, required: true },
      contactNumber: { type: String, default: "" },
      email: { type: String, default: "" },
      organization: { type: String, default: "" }
    },
    registrationSource: { type: String, default: "admin" },
    registeredAt: { type: Date, default: Date.now },
    attendanceStatus: {
      type: String,
      enum: ["registered", "checked_in", "checked_out", "no_show"],
      default: "registered"
    },
    checkedInAt: { type: Date, default: null },
    checkedOutAt: { type: Date, default: null },
    remarks: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventParticipant", eventParticipantSchema);
