const mongoose = require("mongoose");
const env = require("./env");

async function connectDb() {
  mongoose.set("strictQuery", true);
  
  // Connection options with proper pooling and timeouts
  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 45000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority'
  };

  try {
    await mongoose.connect(env.mongodbUri, options);
    console.log("Connected to MongoDB successfully");
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    // Don't crash immediately - allow graceful degradation for monitoring
    process.exit(1);
  }
}

module.exports = connectDb;
