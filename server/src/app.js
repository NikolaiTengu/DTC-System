const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const { Server } = require("socket.io");
const env = require("./config/env");
const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const { initSocket } = require("./sockets");

function createApp() {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: [env.clientUrl, env.workstationUrl],
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser(env.cookieSecret));
  app.use(mongoSanitize());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", routes);
  app.use(notFound);
  app.use(errorHandler);

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [env.clientUrl, env.workstationUrl]
    }
  });
  initSocket(io);

  return { app, server, io };
}

module.exports = createApp;
