const AuditLog = require("../../models/AuditLog");

async function logAudit({ req, actorUserId = null, actorName = "System", action, module, targetId = "", oldValues = null, newValues = null }) {
  await AuditLog.create({
    actorUserId,
    actorName,
    action,
    module,
    targetId,
    oldValues,
    newValues,
    ipAddress: req?.ip || "",
    deviceInfo: req?.headers?.["user-agent"] || ""
  });
}

module.exports = { logAudit };
