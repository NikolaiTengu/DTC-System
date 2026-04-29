const Event = require("../../models/Event");
const EventParticipant = require("../../models/EventParticipant");
const asyncHandler = require("../../utils/asyncHandler");
const pick = require("../../utils/pick");
const { buildListQuery, paginate } = require("../../utils/query");
const { logAudit } = require("../../services/audit/logAudit");

const listEvents = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["status", "eventType", "date"]);
  const query = Event.find(filters).populate("personInChargeUserId").sort(sort);
  const result = await paginate(query, { page, limit });
  res.json(result);
});

const listPublicEvents = asyncHandler(async (req, res) => {
  const items = await Event.find({ status: { $in: ["scheduled", "ongoing"] } })
    .sort({ date: 1, startTime: 1 })
    .limit(50);
  res.json({ items });
});

const createEvent = asyncHandler(async (req, res) => {
  const payload = pick(req.body, [
    "title",
    "description",
    "eventType",
    "date",
    "startTime",
    "endTime",
    "venue",
    "capacity",
    "personInChargeUserId",
    "resourceSpeakers",
    "status",
    "notes"
  ]);
  const event = await Event.create(payload);
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "create_event",
    module: "events",
    targetId: event._id.toString(),
    newValues: payload
  });
  res.status(201).json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  const oldEvent = await Event.findById(req.params.id);
  const updates = pick(req.body, [
    "title",
    "description",
    "eventType",
    "date",
    "startTime",
    "endTime",
    "venue",
    "capacity",
    "personInChargeUserId",
    "resourceSpeakers",
    "status",
    "notes"
  ]);
  const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "update_event",
    module: "events",
    targetId: event._id.toString(),
    oldValues: oldEvent,
    newValues: updates
  });
  res.json(event);
});

const listEventParticipants = asyncHandler(async (req, res) => {
  const items = await EventParticipant.find({ eventId: req.params.eventId }).populate("guestId");
  res.json({ items });
});

module.exports = { listEvents, listPublicEvents, createEvent, updateEvent, listEventParticipants };
