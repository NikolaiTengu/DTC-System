const mongoose = require("mongoose");

const feedbackResponseSchema = new mongoose.Schema(
  {
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "FeedbackTemplate", required: true },
    visitSessionId: { type: mongoose.Schema.Types.ObjectId, ref: "VisitSession", default: null },
    eventParticipantId: { type: mongoose.Schema.Types.ObjectId, ref: "EventParticipant", default: null },
    assignedPcId: { type: mongoose.Schema.Types.ObjectId, ref: "PcUnit", default: null },
    answers: { type: mongoose.Schema.Types.Mixed, required: true },
    submittedAt: { type: Date, default: Date.now },
    submittedByType: {
      type: String,
      enum: ["guest", "participant", "admin_assisted"],
      default: "guest"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedbackResponse", feedbackResponseSchema);
