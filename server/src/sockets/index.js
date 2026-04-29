const PcPresence = require("../models/PcPresence");
const PcUnit = require("../models/PcUnit");

function initSocket(io) {
  io.on("connection", (socket) => {
    socket.on("workstation:presence", async ({ pcCode, kioskSecret }) => {
      const pc = await PcUnit.findOne({ pcCode });
      if (!pc || pc.kioskSecret !== kioskSecret) return;
      await PcPresence.findOneAndUpdate(
        { pcUnitId: pc._id },
        {
          isOnline: true,
          socketId: socket.id,
          lastSeenAt: new Date(),
          kioskState: "awaiting_ticket"
        },
        { upsert: true }
      );
      socket.join(`pc:${pc._id}`);
      io.emit("dashboard:update");
    });

    socket.on("disconnect", async () => {
      await PcPresence.findOneAndUpdate(
        { socketId: socket.id },
        { isOnline: false, socketId: "", lastSeenAt: new Date(), kioskState: "locked" }
      );
      io.emit("dashboard:update");
    });
  });
}

module.exports = { initSocket };
