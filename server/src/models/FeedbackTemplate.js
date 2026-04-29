const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["rating", "short_text", "long_text", "yes_no", "multiple_choice", "checkbox"],
      required: true
    },
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    options: [optionSchema]
  },
  { _id: false }
);

const feedbackTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedbackTemplate", feedbackTemplateSchema);
