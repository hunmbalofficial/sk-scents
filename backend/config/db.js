const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected`);
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
