const crypto = require("crypto");
const PcUnit = require("../../models/PcUnit");
const PcPresence = require("../../models/PcPresence");
const asyncHandler = require("../../utils/asyncHandler");
const pick = require("../../utils/pick");
const { buildListQuery, paginate } = require("../../utils/query");
const { logAudit } = require("../../services/audit/logAudit");

const listPcs = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["status", "isActive", "roomZone"]);
  const query = PcUnit.find(filters).sort(sort);
  const result = await paginate(query, { page, limit });
  const presence = await PcPresence.find({ pcUnitId: { $in: result.items.map((pc) => pc._id) } });
  res.json({ ...result, presence });
});

const createPc = asyncHandler(async (req, res) => {
  const payload = pick(req.body, [
    "pcCode",
    "displayName",
    "serialNumber",
    "assetTag",
    "brand",
    "model",
    "hostname",
    "ipAddress",
    "macAddress",
    "operatingSystem",
    "locationLabel",
    "roomZone",
    "notes",
    "isActive",
    "status",
    "layoutX",
    "layoutY",
    "layoutWidth",
    "layoutHeight",
    "sortOrder"
  ]);
  payload.kioskSecret = crypto.randomBytes(16).toString("hex");
  const pc = await PcUnit.create(payload);
  await PcPresence.findOneAndUpdate(
    { pcUnitId: pc._id },
    { isOnline: false, kioskState: "locked" },
    { upsert: true }
  );
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "create_pc",
    module: "pcs",
    targetId: pc._id.toString(),
    newValues: payload
  });
  res.status(201).json(pc);
});

const updatePc = asyncHandler(async (req, res) => {
  const oldPc = await PcUnit.findById(req.params.id);
  const updates = pick(req.body, [
    "displayName",
    "serialNumber",
    "assetTag",
    "brand",
    "model",
    "hostname",
    "ipAddress",
    "macAddress",
    "operatingSystem",
    "locationLabel",
    "roomZone",
    "notes",
    "isActive",
    "status",
    "layoutX",
    "layoutY",
    "layoutWidth",
    "layoutHeight",
    "sortOrder"
  ]);
  const pc = await PcUnit.findByIdAndUpdate(req.params.id, updates, { new: true });
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "update_pc",
    module: "pcs",
    targetId: pc._id.toString(),
    oldValues: oldPc,
    newValues: updates
  });
  res.json(pc);
});

const upsertLayout = asyncHandler(async (req, res) => {
  const items = req.body.items || [];
  await Promise.all(
    items.map((item) =>
      PcUnit.findByIdAndUpdate(item._id, {
        layoutX: item.layoutX,
        layoutY: item.layoutY,
        layoutWidth: item.layoutWidth,
        layoutHeight: item.layoutHeight,
        sortOrder: item.sortOrder
      })
    )
  );
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "update_layout",
    module: "layout",
    newValues: items
  });
  res.json({ message: "Layout updated" });
});

module.exports = { listPcs, createPc, updatePc, upsertLayout };
