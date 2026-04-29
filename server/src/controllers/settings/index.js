const AppSetting = require("../../models/AppSetting");
const asyncHandler = require("../../utils/asyncHandler");

const listSettings = asyncHandler(async (req, res) => {
  const items = await AppSetting.find().sort({ key: 1 });
  res.json({ items });
});

const upsertSettings = asyncHandler(async (req, res) => {
  const items = req.body.items || [];
  await Promise.all(
    items.map((item) =>
      AppSetting.findOneAndUpdate(
        { key: item.key },
        { value: item.value, description: item.description || "" },
        { new: true, upsert: true }
      )
    )
  );
  res.json({ message: "Settings updated" });
});

module.exports = { listSettings, upsertSettings };
