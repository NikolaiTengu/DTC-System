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
  
  // Security headers
  app.use(helmet());
  
  // CORS with credentials
  app.use(
    cors({
      origin: [env.clientUrl, env.workstationUrl],
      credentials: true
    })
  );
  
  // Request size limits to prevent memory exhaustion
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ limit: "2mb", extended: true }));
  
  // Cookie and sanitization
  app.use(cookieParser(env.cookieSecret));
  app.use(mongoSanitize());
  
  // Logging
  app.use(morgan("dev"));

  // Health check
  app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));
  
  // API routes
  app.use("/api", routes);
  
  // Not found and error handlers
  app.use(notFound);
  app.use(errorHandler);

  // Create HTTP server
  const server = http.createServer(app);
  
  // Socket.IO with proper configuration
  const io = new Server(server, {
    cors: {
      origin: [env.clientUrl, env.workstationUrl],
      credentials: true
    },
    transports: ["websocket", "polling"],
    maxHttpBufferSize: 1e5, // 100KB limit per message
    connectTimeout: 5000,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });
  
  initSocket(io);

  return { app, server, io };
}

module.exports = createApp;
