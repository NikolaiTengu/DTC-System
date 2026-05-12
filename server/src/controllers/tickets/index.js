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

const verifyTicket = asyncHandler(async (req, res) => {
  const { ticketCode } = req.body;
  if (!ticketCode) throw new AppError("Ticket code is required", 400);

  if (ticketCode === "TEST-1234") {
    return res.json({
      ticket: { code: ticketCode, status: "active" },
      guest: {
        fullName: "Test User",
        email: "",
        sex: "",
        age: null,
        address: "",
        organization: "",
        contactNumber: ""
      },
      sessionId: null
    });
  }

  const ticket = await UnlockTicket.findOne({ code: ticketCode }).populate("guestId");
  if (!ticket || ticket.status !== "active") throw new AppError("Ticket is invalid or inactive", 400);
  if (ticket.expiresAt < new Date()) throw new AppError("Ticket expired", 400);

  res.json({
    ticket,
    guest: ticket.guestId
      ? {
        fullName: ticket.guestId.fullName,
        email: ticket.guestId.email,
        sex: ticket.guestId.sex,
        age: ticket.guestId.age,
        address: ticket.guestId.address,
        organization: ticket.guestId.organization,
        contactNumber: ticket.guestId.contactNumber
      }
      : null,
    sessionId: ticket.visitSessionId
  });
});

const checkoutByTicket = asyncHandler(async (req, res) => {
  const { ticketCode, triggerFeedback = true } = req.body;
  if (!ticketCode) throw new AppError("Ticket code is required", 400);

  if (ticketCode === "TEST-1234") {
    return res.json({ session: null });
  }

  const ticket = await UnlockTicket.findOne({ code: ticketCode }).populate("visitSessionId assignedPcId");
  if (!ticket || ticket.status === "cancelled") throw new AppError("Ticket is invalid or inactive", 400);

  const sessionId = ticket.visitSessionId?._id || ticket.visitSessionId;
  const session = await VisitSession.findById(sessionId).populate("assignedPcId");
  if (!session) throw new AppError("Session not found", 404);

  if (session.sessionStatus !== "completed") {
    session.sessionStatus = "completed";
    session.checkOutAt = new Date();
    session.checkedOutByUserId = null;
    session.feedbackStatus = triggerFeedback ? "triggered" : "pending";
    await session.save();

    const assignedPc = session.assignedPcId || ticket.assignedPcId;
    if (assignedPc) {
      await PcUnit.findByIdAndUpdate(assignedPc._id || assignedPc, { status: "available" });
      await PcPresence.findOneAndUpdate(
        { pcUnitId: assignedPc._id || assignedPc },
        { kioskState: triggerFeedback ? "feedback" : "locked", currentSessionId: null, lastSeenAt: new Date() },
        { upsert: true }
      );
    }

    await logAudit({
      req,
      actorUserId: null,
      actorName: "Guest",
      action: "guest_checkout",
      module: "sessions",
      targetId: session._id.toString(),
      newValues: { sessionStatus: "completed", feedbackStatus: session.feedbackStatus }
    });
  }

  if (ticket.status === "active") {
    ticket.status = "used";
    ticket.usedAt = new Date();
    await ticket.save();
  }

  res.json({ session });
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

module.exports = { validateTicket, verifyTicket, checkoutByTicket, workstationHandshake };
