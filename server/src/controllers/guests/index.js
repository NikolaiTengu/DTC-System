const crypto = require("crypto");
const QRCode = require("qrcode");
const Guest = require("../../models/Guest");
const VisitSession = require("../../models/VisitSession");
const UnlockTicket = require("../../models/UnlockTicket");
const PcUnit = require("../../models/PcUnit");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
const pick = require("../../utils/pick");
const { buildListQuery, paginate } = require("../../utils/query");
const { findAssignablePc } = require("../../services/pcs/assignment");
const { logAudit } = require("../../services/audit/logAudit");
const env = require("../../config/env");

const registerGuest = asyncHandler(async (req, res) => {
  if (req.body.source === "server_registration" && !req.user?.permissions?.includes("manage_guests")) {
    throw new AppError("Authenticated staff with guest management permission is required for server registration", 403);
  }

  const guest = await Guest.create(
    pick(req.body, ["fullName", "sex", "age", "contactNumber", "email", "address", "organization"])
  );

  let assignedPc = null;
  let ticket = null;
  const sessionPayload = pick(req.body, ["visitPurpose", "wantsPc", "source", "remarks", "eventId"]);
  sessionPayload.guestId = guest._id;
  sessionPayload.handledByUserId = req.user?._id || null;

  if (req.body.wantsPc) {
    assignedPc = req.body.assignedPcId
      ? await PcUnit.findOne({ _id: req.body.assignedPcId, isActive: true, status: "available" })
      : await findAssignablePc();

    sessionPayload.assignedPcId = assignedPc._id;
    sessionPayload.ticketCode = `DTC-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    assignedPc.status = "occupied";
    await assignedPc.save();
  }

  const session = await VisitSession.create(sessionPayload);

  if (assignedPc) {
    ticket = await UnlockTicket.create({
      code: session.ticketCode,
      visitSessionId: session._id,
      guestId: guest._id,
      assignedPcId: assignedPc._id,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
    });
  }

  await logAudit({
    req,
    actorUserId: req.user?._id || null,
    actorName: req.user?.fullName || "Guest Self Service",
    action: "guest_registration",
    module: "guests",
    targetId: session._id.toString(),
    newValues: { guest, session }
  });

  const qrDataUrl = ticket
    ? await QRCode.toDataURL(`${env.workstationUrl}/unlock?pc=${assignedPc.pcCode}&ticket=${ticket.code}`)
    : null;

  res.status(201).json({ guest, session, ticket, assignedPc, qrDataUrl });
});

const listGuests = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["fullName", "contactNumber"]);
  const query = Guest.find(filters).sort(sort);
  const result = await paginate(query, { page, limit });
  res.json(result);
});

module.exports = { registerGuest, listGuests };
