const dayjs = require("dayjs");
const VisitSession = require("../../models/VisitSession");
const PcUnit = require("../../models/PcUnit");
const Event = require("../../models/Event");
const EventParticipant = require("../../models/EventParticipant");
const FeedbackResponse = require("../../models/FeedbackResponse");
const AuditLog = require("../../models/AuditLog");
const { toCsv } = require("../../utils/csv");
const asyncHandler = require("../../utils/asyncHandler");

function buildDateRange(query) {
  const startDate = query.startDate ? dayjs(query.startDate).startOf("day").toDate() : dayjs().startOf("month").toDate();
  const endDate = query.endDate ? dayjs(query.endDate).endOf("day").toDate() : dayjs().endOf("day").toDate();
  return { startDate, endDate };
}

const dashboard = asyncHandler(async (req, res) => {
  const todayStart = dayjs().startOf("day").toDate();
  const todayEnd = dayjs().endOf("day").toDate();

  const [
    activeGuests,
    checkedOutToday,
    activePcSessions,
    pcs,
    todaysEvents,
    todaysParticipants,
    recentFeedback
  ] = await Promise.all([
    VisitSession.countDocuments({ sessionStatus: "active" }),
    VisitSession.countDocuments({ checkOutAt: { $gte: todayStart, $lte: todayEnd } }),
    VisitSession.countDocuments({ sessionStatus: "active", assignedPcId: { $ne: null } }),
    PcUnit.find(),
    Event.find({ date: dayjs().format("YYYY-MM-DD") }),
    EventParticipant.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
    FeedbackResponse.find().sort({ submittedAt: -1 }).limit(5)
  ]);

  const summary = pcs.reduce(
    (acc, pc) => {
      acc[pc.status] = (acc[pc.status] || 0) + 1;
      return acc;
    },
    { available: 0, occupied: 0, maintenance: 0, offline: 0 }
  );

  res.json({
    activeGuests,
    checkedOutToday,
    activePcSessions,
    availablePcs: summary.available || 0,
    occupiedPcs: summary.occupied || 0,
    offlineMaintenancePcs: (summary.offline || 0) + (summary.maintenance || 0),
    todaysEvents,
    todaysParticipantCount: todaysParticipants,
    recentFeedback
  });
});

const guestsReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = buildDateRange(req.query);
  const rows = await VisitSession.find({
    checkInAt: { $gte: startDate, $lte: endDate }
  }).populate("guestId assignedPcId handledByUserId checkedOutByUserId eventId");
  if (req.query.format === "csv") {
    const csv = toCsv(
      rows.map((row) => ({
        guest: row.guestId?.fullName,
        purpose: row.visitPurpose,
        wantsPc: row.wantsPc,
        pc: row.assignedPcId?.displayName || "",
        status: row.sessionStatus,
        checkInAt: row.checkInAt,
        checkOutAt: row.checkOutAt,
        handledBy: row.handledByUserId ? `${row.handledByUserId.firstName} ${row.handledByUserId.lastName}` : "",
        source: row.source
      }))
    );
    res.setHeader("Content-Type", "text/csv");
    return res.send(csv);
  }
  res.json({ items: rows });
});

const pcUsageReport = asyncHandler(async (req, res) => {
  const items = await VisitSession.aggregate([
    { $match: { assignedPcId: { $ne: null }, sessionStatus: "completed", checkOutAt: { $ne: null } } },
    {
      $project: {
        assignedPcId: 1,
        durationHours: {
          $divide: [{ $subtract: ["$checkOutAt", "$checkInAt"] }, 1000 * 60 * 60]
        }
      }
    },
    {
      $group: {
        _id: "$assignedPcId",
        totalHours: { $sum: "$durationHours" },
        sessionCount: { $sum: 1 }
      }
    }
  ]);
  if (req.query.format === "csv") {
    const csv = toCsv(items);
    res.setHeader("Content-Type", "text/csv");
    return res.send(csv);
  }
  res.json({ items });
});

const eventReport = asyncHandler(async (req, res) => {
  const items = await Event.aggregate([
    {
      $lookup: {
        from: "eventparticipants",
        localField: "_id",
        foreignField: "eventId",
        as: "participants"
      }
    },
    {
      $project: {
        title: 1,
        date: 1,
        status: 1,
        participantCount: { $size: "$participants" },
        resourceSpeakers: 1,
        personInChargeUserId: 1
      }
    }
  ]);
  if (req.query.format === "csv") {
    const csv = toCsv(items);
    res.setHeader("Content-Type", "text/csv");
    return res.send(csv);
  }
  res.json({ items });
});

const feedbackReport = asyncHandler(async (req, res) => {
  const items = await FeedbackResponse.find()
    .populate("templateId visitSessionId eventParticipantId")
    .sort({ submittedAt: -1 });
  if (req.query.format === "csv") {
    const csv = toCsv(
      items.map((item) => ({
        template: item.templateId?.name || "",
        submittedAt: item.submittedAt,
        submittedByType: item.submittedByType,
        answerCount: Object.keys(item.answers || {}).length
      }))
    );
    res.setHeader("Content-Type", "text/csv");
    return res.send(csv);
  }
  res.json({ items });
});

const auditReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = buildDateRange(req.query);
  const items = await AuditLog.find({ createdAt: { $gte: startDate, $lte: endDate } }).sort({ createdAt: -1 });
  if (req.query.format === "csv") {
    const csv = toCsv(items.map((item) => item.toObject()));
    res.setHeader("Content-Type", "text/csv");
    return res.send(csv);
  }
  res.json({ items });
});

module.exports = { dashboard, guestsReport, pcUsageReport, eventReport, feedbackReport, auditReport };
