const connectDb = require("./config/db");
const env = require("./config/env");
const createApp = require("./app");

async function bootstrap() {
  try {
    await connectDb();
    const { server } = createApp();
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    server.listen(env.port, () => {
      console.log(`DTC server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Server bootstrap failed", error);
    process.exit(1);
  }
}

bootstrap();
