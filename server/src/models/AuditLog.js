const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    actorName: { type: String, default: "System" },
    action: { type: String, required: true },
    module: { type: String, required: true },
    targetId: { type: String, default: "" },
    oldValues: { type: mongoose.Schema.Types.Mixed, default: null },
    newValues: { type: mongoose.Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: "" },
    deviceInfo: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
