const VisitSession = require("../../models/VisitSession");
const PcUnit = require("../../models/PcUnit");
const PcPresence = require("../../models/PcPresence");
const asyncHandler = require("../../utils/asyncHandler");
const { buildListQuery, paginate } = require("../../utils/query");
const { logAudit } = require("../../services/audit/logAudit");

const listSessions = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["sessionStatus", "source"]);
  const query = VisitSession.find(filters)
    .populate("guestId assignedPcId handledByUserId checkedOutByUserId eventId")
    .sort(sort);
  const result = await paginate(query, { page, limit });
  res.json(result);
});

const activeSessions = asyncHandler(async (req, res) => {
  const items = await VisitSession.find({ sessionStatus: "active" })
    .populate("guestId assignedPcId handledByUserId eventId")
    .sort({ checkInAt: -1 });
  res.json({ items, count: items.length });
});

const checkoutSession = asyncHandler(async (req, res) => {
  const session = await VisitSession.findById(req.params.id).populate("assignedPcId");
  session.sessionStatus = "completed";
  session.checkOutAt = new Date();
  session.checkedOutByUserId = req.user?._id || null;
  session.feedbackStatus = req.body.triggerFeedback ? "triggered" : "pending";
  await session.save();

  if (session.assignedPcId) {
    await PcUnit.findByIdAndUpdate(session.assignedPcId._id, { status: "available" });
    await PcPresence.findOneAndUpdate(
      { pcUnitId: session.assignedPcId._id },
      { kioskState: req.body.triggerFeedback ? "feedback" : "locked", currentSessionId: null, lastSeenAt: new Date() },
      { upsert: true }
    );
  }

  await logAudit({
    req,
    actorUserId: req.user?._id || null,
    actorName: req.user?.fullName || "System",
    action: "guest_checkout",
    module: "sessions",
    targetId: session._id.toString(),
    newValues: { sessionStatus: "completed", feedbackStatus: session.feedbackStatus }
  });

  res.json(session);
});

module.exports = { listSessions, activeSessions, checkoutSession };
