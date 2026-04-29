const Role = require("../../models/Role");
const asyncHandler = require("../../utils/asyncHandler");
const pick = require("../../utils/pick");
const { buildListQuery, paginate } = require("../../utils/query");
const { logAudit } = require("../../services/audit/logAudit");

const listRoles = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["name"]);
  const query = Role.find(filters).sort(sort);
  const result = await paginate(query, { page, limit });
  res.json(result);
});

const createRole = asyncHandler(async (req, res) => {
  const payload = pick(req.body, ["name", "description", "permissions", "isSystem"]);
  payload.createdBy = req.user._id;
  payload.updatedBy = req.user._id;
  const role = await Role.create(payload);
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "create_role",
    module: "roles",
    targetId: role._id.toString(),
    newValues: payload
  });
  res.status(201).json(role);
});

const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  const oldValues = role?.toObject();
  const updates = pick(req.body, ["name", "description", "permissions"]);
  updates.updatedBy = req.user._id;
  const updated = await Role.findByIdAndUpdate(req.params.id, updates, { new: true });
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "update_role",
    module: "roles",
    targetId: req.params.id,
    oldValues,
    newValues: updates
  });
  res.json(updated);
});

module.exports = { listRoles, createRole, updateRole };
