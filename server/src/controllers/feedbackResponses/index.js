const FeedbackResponse = require("../../models/FeedbackResponse");
const FeedbackTemplate = require("../../models/FeedbackTemplate");
const VisitSession = require("../../models/VisitSession");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
const { buildListQuery, paginate } = require("../../utils/query");
const { logAudit } = require("../../services/audit/logAudit");

const listResponses = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["templateId"]);
  const query = FeedbackResponse.find(filters).populate("templateId visitSessionId eventParticipantId assignedPcId").sort(sort);
  const result = await paginate(query, { page, limit });
  res.json(result);
});

const createResponse = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (!payload.templateId) {
    const template = await FeedbackTemplate.findOne({ isActive: true }).sort({ updatedAt: -1 });
    payload.templateId = template?._id;
  }
  if (!payload.templateId) {
    throw new AppError("No active feedback template is available", 400);
  }
  const response = await FeedbackResponse.create(payload);
  if (req.body.visitSessionId) {
    await VisitSession.findByIdAndUpdate(req.body.visitSessionId, { feedbackStatus: "completed" });
  }
  await logAudit({
    req,
    actorUserId: req.user?._id || null,
    actorName: req.user?.fullName || "Guest",
    action: "submit_feedback",
    module: "feedback_responses",
    targetId: response._id.toString(),
    newValues: { templateId: response.templateId }
  });
  res.status(201).json(response);
});

module.exports = { listResponses, createResponse };
