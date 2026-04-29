const AuditLog = require("../../models/AuditLog");
const asyncHandler = require("../../utils/asyncHandler");
const { buildListQuery, paginate } = require("../../utils/query");

const listAuditLogs = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["module", "action"]);
  const query = AuditLog.find(filters).sort(sort);
  const result = await paginate(query, { page, limit });
  res.json(result);
});

module.exports = { listAuditLogs };
