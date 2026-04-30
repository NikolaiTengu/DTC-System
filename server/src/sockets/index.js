const PcPresence = require("../models/PcPresence");
const PcUnit = require("../models/PcUnit");

function initSocket(io) {
  io.on("connection", (socket) => {
    socket.on("workstation:presence", async ({ pcCode, kioskSecret }) => {
      try {
        const pc = await PcUnit.findOne({ pcCode });
        if (!pc || pc.kioskSecret !== kioskSecret) {
          socket.disconnect(true);
          return;
        }
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
      } catch (error) {
        console.error("Error in workstation:presence handler:", error);
        socket.emit("error", { message: "Server error processing presence update" });
      }
    });

    socket.on("disconnect", async () => {
      try {
        await PcPresence.findOneAndUpdate(
          { socketId: socket.id },
          { isOnline: false, socketId: "", lastSeenAt: new Date(), kioskState: "locked" },
          { new: true }
        );
        io.emit("dashboard:update");
      } catch (error) {
        console.error("Error in disconnect handler:", error);
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Handle any unhandled promise rejections on this socket
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  });
}

module.exports = { initSocket };
