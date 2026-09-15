import mongoose from "mongoose";

const connectDb = async () => {
  mongoose.set('strictQuery', true);

  // Check if the database is already connected to avoid creating new connections
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection; // Return the existing connection
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options as needed
    });

    // Only add listeners once
    if (!mongoose.connection.listeners('connected').length) {
      mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
      });
    }

    if (!mongoose.connection.listeners('error').length) {
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
    }

    if (!mongoose.connection.listeners('disconnected').length) {
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });
    }

    return mongoose.connection; // Return the established connection
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Throw the error to handle it in your request handlers
  }
};

export default connectDb;