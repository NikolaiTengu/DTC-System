const PcUnit = require("../../models/PcUnit");
const PcPresence = require("../../models/PcPresence");
const UnlockTicket = require("../../models/UnlockTicket");
const VisitSession = require("../../models/VisitSession");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
const { logAudit } = require("../../services/audit/logAudit");

const validateTicket = asyncHandler(async (req, res) => {
  const { pcCode, kioskSecret, ticketCode } = req.body;
  const pc = await PcUnit.findOne({ pcCode });
  if (!pc || pc.kioskSecret !== kioskSecret) throw new AppError("Invalid workstation identity", 401);
  const ticket = await UnlockTicket.findOne({ code: ticketCode }).populate("visitSessionId");
  if (!ticket || ticket.status !== "active") throw new AppError("Ticket is invalid or inactive", 400);
  if (ticket.assignedPcId.toString() !== pc._id.toString()) throw new AppError("Ticket does not belong to this workstation", 403);
  if (ticket.expiresAt < new Date()) throw new AppError("Ticket expired", 400);

  ticket.status = "used";
  ticket.usedAt = new Date();
  await ticket.save();

  const session = await VisitSession.findById(ticket.visitSessionId._id);
  session.unlockStartedAt = new Date();
  await session.save();

  await PcPresence.findOneAndUpdate(
    { pcUnitId: pc._id },
    { kioskState: "unlocked", currentSessionId: session._id, lastSeenAt: new Date() },
    { upsert: true }
  );

  await logAudit({
    req,
    action: "ticket_validated",
    module: "tickets",
    targetId: ticket._id.toString(),
    newValues: { sessionId: session._id, pcUnitId: pc._id }
  });

  res.json({ pc, ticket, session });
});

const workstationHandshake = asyncHandler(async (req, res) => {
  const { pcCode, kioskSecret } = req.body;
  const pc = await PcUnit.findOne({ pcCode });
  if (!pc || pc.kioskSecret !== kioskSecret) throw new AppError("Invalid workstation credentials", 401);
  const presence = await PcPresence.findOneAndUpdate(
    { pcUnitId: pc._id },
    { isOnline: true, kioskState: "awaiting_ticket", lastSeenAt: new Date() },
    { new: true, upsert: true }
  );
  await PcUnit.findByIdAndUpdate(pc._id, { status: pc.status === "offline" ? "available" : pc.status });
  res.json({ pc, presence });
});

module.exports = { validateTicket, workstationHandshake };
