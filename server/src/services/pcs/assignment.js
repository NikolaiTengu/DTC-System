const PcUnit = require("../../models/PcUnit");
const AppError = require("../../utils/AppError");

async function findAssignablePc() {
  const pc = await PcUnit.findOne({
    isActive: true,
    status: "available"
  }).sort({ sortOrder: 1, createdAt: 1 });

  if (!pc) {
    throw new AppError("No available PC could be assigned", 409);
  }

  return pc;
}

module.exports = { findAssignablePc };
