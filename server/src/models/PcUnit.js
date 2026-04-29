const mongoose = require("mongoose");

const pcUnitSchema = new mongoose.Schema(
  {
    pcCode: { type: String, required: true, unique: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    serialNumber: { type: String, default: "" },
    assetTag: { type: String, default: "" },
    brand: { type: String, default: "" },
    model: { type: String, default: "" },
    hostname: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    macAddress: { type: String, default: "" },
    operatingSystem: { type: String, default: "" },
    locationLabel: { type: String, default: "" },
    roomZone: { type: String, default: "" },
    notes: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "inactive", "pulled_out", "offline"],
      default: "available"
    },
    layoutX: { type: Number, default: 0 },
    layoutY: { type: Number, default: 0 },
    layoutWidth: { type: Number, default: 1 },
    layoutHeight: { type: Number, default: 1 },
    sortOrder: { type: Number, default: 0 },
    kioskSecret: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PcUnit", pcUnitSchema);
