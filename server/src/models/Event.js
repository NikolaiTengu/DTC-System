const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: "" },
    organization: { type: String, default: "" },
    contact: { type: String, default: "" }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    eventType: { type: String, default: "" },
    date: { type: String, required: true },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    venue: { type: String, default: "" },
    capacity: { type: Number, default: 0 },
    personInChargeUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resourceSpeakers: [speakerSchema],
    status: {
      type: String,
      enum: ["draft", "scheduled", "ongoing", "completed", "cancelled"],
      default: "draft"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
