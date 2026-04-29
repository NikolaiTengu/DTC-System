const EventParticipant = require("../../models/EventParticipant");
const Guest = require("../../models/Guest");
const asyncHandler = require("../../utils/asyncHandler");
const { logAudit } = require("../../services/audit/logAudit");

const registerParticipant = asyncHandler(async (req, res) => {
  let guestId = req.body.guestId || null;
  if (!guestId && req.body.fullName) {
    const guest = await Guest.create({
      fullName: req.body.fullName,
      contactNumber: req.body.contactNumber || "",
      email: req.body.email || "",
      organization: req.body.organization || "",
      address: req.body.address || ""
    });
    guestId = guest._id;
  }

  const participant = await EventParticipant.create({
    eventId: req.body.eventId,
    guestId,
    participantSnapshot: {
      fullName: req.body.fullName,
      contactNumber: req.body.contactNumber || "",
      email: req.body.email || "",
      organization: req.body.organization || ""
    },
    registrationSource: req.body.registrationSource || "admin",
    remarks: req.body.remarks || ""
  });
  await logAudit({
    req,
    actorUserId: req.user?._id || null,
    actorName: req.user?.fullName || "Self Service",
    action: "register_participant",
    module: "participants",
    targetId: participant._id.toString(),
    newValues: participant
  });
  res.status(201).json(participant);
});

const updateAttendance = asyncHandler(async (req, res) => {
  const participant = await EventParticipant.findById(req.params.id);
  participant.attendanceStatus = req.body.attendanceStatus;
  if (req.body.attendanceStatus === "checked_in") participant.checkedInAt = new Date();
  if (req.body.attendanceStatus === "checked_out") participant.checkedOutAt = new Date();
  participant.remarks = req.body.remarks || participant.remarks;
  await participant.save();
  await logAudit({
    req,
    actorUserId: req.user?._id || null,
    actorName: req.user?.fullName || "System",
    action: "update_attendance",
    module: "participants",
    targetId: participant._id.toString(),
    newValues: { attendanceStatus: participant.attendanceStatus }
  });
  res.json(participant);
});

module.exports = { registerParticipant, updateAttendance };
