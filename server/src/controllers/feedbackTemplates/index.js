const FeedbackTemplate = require("../../models/FeedbackTemplate");
const asyncHandler = require("../../utils/asyncHandler");
const pick = require("../../utils/pick");
const { buildListQuery, paginate } = require("../../utils/query");
const { logAudit } = require("../../services/audit/logAudit");

const listTemplates = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["isActive", "name"]);
  const query = FeedbackTemplate.find(filters).sort(sort);
  const result = await paginate(query, { page, limit });
  res.json(result);
});

const createTemplate = asyncHandler(async (req, res) => {
  const payload = pick(req.body, ["name", "description", "isActive", "questions"]);
  payload.createdBy = req.user._id;
  payload.updatedBy = req.user._id;
  const template = await FeedbackTemplate.create(payload);
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "create_feedback_template",
    module: "feedback_templates",
    targetId: template._id.toString(),
    newValues: payload
  });
  res.status(201).json(template);
});

const updateTemplate = asyncHandler(async (req, res) => {
  const oldTemplate = await FeedbackTemplate.findById(req.params.id);
  const updates = pick(req.body, ["name", "description", "isActive", "questions"]);
  updates.updatedBy = req.user._id;
  const template = await FeedbackTemplate.findByIdAndUpdate(req.params.id, updates, { new: true });
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "update_feedback_template",
    module: "feedback_templates",
    targetId: template._id.toString(),
    oldValues: oldTemplate,
    newValues: updates
  });
  res.json(template);
});

module.exports = { listTemplates, createTemplate, updateTemplate };
