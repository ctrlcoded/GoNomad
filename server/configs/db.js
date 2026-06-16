import mongoose from "mongoose";

// Cache the connection across serverless invocations so we don't reconnect
// on every request (and so a cold start reuses an existing connection).
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set in environment variables");
    }

    if (!cached.promise) {
        console.log("Trying connection with MongoDB");
        mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"));
        mongoose.connection.on("error", (err) => console.log("MongoDB connection error", err.message));
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;